import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { TreatmentOutcomeInsert } from '@/types/database'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch all completed protocols with user info
    const { data: protocols, error: protocolError } = await supabase
      .from('protocols')
      .select('id, user_id, title, description, supplements, diet_rules, duration_weeks, created_at, updated_at')
      .eq('status', 'completed')

    if (protocolError) {
      return NextResponse.json(
        { error: 'Failed to fetch completed protocols', details: protocolError.message },
        { status: 500 }
      )
    }

    if (!protocols || protocols.length === 0) {
      return NextResponse.json({
        success: true,
        outcomes_aggregated: 0,
        message: 'No completed protocols to analyze',
        timestamp: new Date().toISOString(),
      })
    }

    // For each user with a completed protocol, compare gut scores before and after
    type OutcomeAccumulator = {
      improvements: number[]
      durations: number[]
    }
    // Key: "condition::treatment"
    const outcomeMap = new Map<string, OutcomeAccumulator>()

    const errors: string[] = []

    for (const protocol of protocols) {
      try {
        const userId = protocol.user_id
        const durationWeeks = protocol.duration_weeks ?? 4
        const protocolStart = new Date(protocol.created_at)
        const protocolEnd = new Date(protocolStart.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000)

        // Fetch the user's profile to get their conditions
        const { data: profile } = await supabase
          .from('profiles')
          .select('conditions')
          .eq('id', userId)
          .single()

        const conditions = profile?.conditions ?? ['general']

        // Get gut scores in the week BEFORE the protocol started
        const beforeStart = new Date(protocolStart.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const { data: beforeScores } = await supabase
          .from('gut_scores')
          .select('score')
          .eq('user_id', userId)
          .gte('date', beforeStart)
          .lt('date', protocolStart.toISOString())
          .order('date', { ascending: true })

        // Get gut scores in the week AFTER the protocol ended
        const afterEnd = new Date(protocolEnd.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        const { data: afterScores } = await supabase
          .from('gut_scores')
          .select('score')
          .eq('user_id', userId)
          .gte('date', protocolEnd.toISOString())
          .lte('date', afterEnd)
          .order('date', { ascending: true })

        // Need scores both before and after to compute improvement
        if (!beforeScores?.length || !afterScores?.length) continue

        const avgBefore = beforeScores.reduce((sum, s) => sum + s.score, 0) / beforeScores.length
        const avgAfter = afterScores.reduce((sum, s) => sum + s.score, 0) / afterScores.length

        // Calculate improvement percentage (positive = improvement)
        const improvementPct = avgBefore > 0
          ? ((avgAfter - avgBefore) / avgBefore) * 100
          : 0

        // Build the treatment description from the protocol
        const treatmentParts: string[] = []
        if (protocol.supplements && Array.isArray(protocol.supplements)) {
          for (const supp of protocol.supplements) {
            if (typeof supp === 'object' && supp !== null && 'name' in supp) {
              treatmentParts.push((supp as { name: string }).name)
            }
          }
        }
        if (protocol.diet_rules && Array.isArray(protocol.diet_rules)) {
          for (const rule of protocol.diet_rules) {
            if (typeof rule === 'object' && rule !== null && 'category' in rule) {
              treatmentParts.push((rule as { category: string }).category)
            }
          }
        }
        const treatment = treatmentParts.length > 0
          ? treatmentParts.slice(0, 3).join(' + ')
          : protocol.title

        // Accumulate outcomes for each condition+treatment combo
        for (const condition of conditions) {
          const key = `${condition}::${treatment}`
          if (!outcomeMap.has(key)) {
            outcomeMap.set(key, { improvements: [], durations: [] })
          }
          const acc = outcomeMap.get(key)!
          acc.improvements.push(improvementPct)
          acc.durations.push(durationWeeks)
        }
      } catch (protocolErr) {
        const message = protocolErr instanceof Error ? protocolErr.message : String(protocolErr)
        errors.push(`Error processing protocol ${protocol.id}: ${message}`)
      }
    }

    // Build the outcomes to upsert
    const outcomes: TreatmentOutcomeInsert[] = []

    for (const [key, acc] of outcomeMap.entries()) {
      const [condition, treatment] = key.split('::')
      const avgImprovement = acc.improvements.reduce((a, b) => a + b, 0) / acc.improvements.length
      const avgDuration = acc.durations.reduce((a, b) => a + b, 0) / acc.durations.length

      outcomes.push({
        condition,
        treatment,
        improvement_pct: Math.round(avgImprovement * 100) / 100,
        sample_size: acc.improvements.length,
        avg_duration_weeks: Math.round(avgDuration * 10) / 10,
      })
    }

    if (outcomes.length === 0) {
      return NextResponse.json({
        success: true,
        outcomes_aggregated: 0,
        protocols_analyzed: protocols.length,
        message: 'No protocols had sufficient before/after gut score data',
        timestamp: new Date().toISOString(),
      })
    }

    // Upsert outcomes (update existing condition+treatment combos)
    let upsertedCount = 0

    const BATCH_SIZE = 50
    for (let i = 0; i < outcomes.length; i += BATCH_SIZE) {
      const batch = outcomes.slice(i, i + BATCH_SIZE)

      const { error: upsertError } = await supabase
        .from('treatment_outcomes')
        .upsert(
          batch.map((o) => ({ ...o, computed_at: new Date().toISOString() })),
          { onConflict: 'condition,treatment' }
        )

      if (upsertError) {
        errors.push(`Batch upsert failed at offset ${i}: ${upsertError.message}`)
      } else {
        upsertedCount += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      outcomes_aggregated: upsertedCount,
      protocols_analyzed: protocols.length,
      unique_combinations: outcomeMap.size,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Outcomes aggregator failed', details: message },
      { status: 500 }
    )
  }
}
