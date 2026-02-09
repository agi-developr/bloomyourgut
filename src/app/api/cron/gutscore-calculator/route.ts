// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateGutScore } from '@/lib/gutscore'
import type { SymptomLog, FoodLog, GutScore } from '@/types/database'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const todayStr = now.toISOString().split('T')[0]

    // Find all users who have logged symptoms in the last 7 days
    const { data: recentLoggers, error: loggersError } = await supabase
      .from('symptom_logs')
      .select('user_id')
      .gte('date', sevenDaysAgo)

    if (loggersError) {
      return NextResponse.json(
        { error: 'Failed to fetch recent loggers', details: loggersError.message },
        { status: 500 }
      )
    }

    if (!recentLoggers || recentLoggers.length === 0) {
      return NextResponse.json({
        success: true,
        scores_calculated: 0,
        message: 'No users with recent symptom logs',
        timestamp: now.toISOString(),
      })
    }

    // Deduplicate user IDs
    const userIds = [...new Set(recentLoggers.map((log) => log.user_id))]

    let scoresCalculated = 0
    const errors: string[] = []

    for (const userId of userIds) {
      try {
        // Fetch the user's last 7 days of symptom logs
        const { data: symptomLogs, error: symptomError } = await supabase
          .from('symptom_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo)
          .order('date', { ascending: true })

        if (symptomError) {
          errors.push(`Failed to fetch symptom logs for user ${userId}: ${symptomError.message}`)
          continue
        }

        // Fetch the user's last 7 days of food logs
        const { data: foodLogs, error: foodError } = await supabase
          .from('food_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo)
          .order('date', { ascending: true })

        if (foodError) {
          errors.push(`Failed to fetch food logs for user ${userId}: ${foodError.message}`)
          continue
        }

        // Fetch the user's last 30 days of gut scores for trend analysis
        const { data: previousScores, error: scoresError } = await supabase
          .from('gut_scores')
          .select('*')
          .eq('user_id', userId)
          .gte('date', thirtyDaysAgo)
          .order('date', { ascending: true })

        if (scoresError) {
          errors.push(`Failed to fetch previous scores for user ${userId}: ${scoresError.message}`)
          continue
        }

        // Calculate the new GutScore
        const scoreResult = await calculateGutScore({
          symptomLogs: (symptomLogs ?? []) as SymptomLog[],
          foodLogs: (foodLogs ?? []) as FoodLog[],
          previousScores: (previousScores ?? []) as GutScore[],
        })

        // Upsert the score for today (one score per user per day)
        const { error: upsertError } = await supabase
          .from('gut_scores')
          .upsert(
            {
              user_id: userId,
              date: todayStr,
              score: scoreResult.score,
              components: scoreResult.components,
            },
            { onConflict: 'user_id,date' }
          )

        if (upsertError) {
          errors.push(`Failed to upsert gut score for user ${userId}: ${upsertError.message}`)
          continue
        }

        scoresCalculated++
      } catch (calcError) {
        const message = calcError instanceof Error ? calcError.message : String(calcError)
        errors.push(`Error calculating score for user ${userId}: ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      scores_calculated: scoresCalculated,
      total_users: userIds.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'GutScore calculator failed', details: message },
      { status: 500 }
    )
  }
}
