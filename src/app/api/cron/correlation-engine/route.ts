import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CorrelationInsert, CorrelationDirection } from '@/types/database'

/** Symptom dimensions to correlate against foods. */
const SYMPTOM_DIMENSIONS = ['bloating', 'pain', 'energy', 'stool_type', 'gas', 'mood'] as const

/** Minimum number of data points a food must have to compute a correlation. */
const MIN_SAMPLE_SIZE = 10

/**
 * Compute Pearson correlation coefficient between two numeric arrays.
 * Returns null if insufficient variance or mismatched lengths.
 */
function pearsonCorrelation(x: number[], y: number[]): number | null {
  const n = x.length
  if (n !== y.length || n < 3) return null

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0)
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0)
  const sumY2 = y.reduce((a, yi) => a + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  )

  if (denominator === 0) return null

  return numerator / denominator
}

/**
 * Determine the direction label based on the correlation coefficient.
 */
function getDirection(r: number): CorrelationDirection {
  if (r > 0.1) return 'positive'
  if (r < -0.1) return 'negative'
  return 'neutral'
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch all food logs (anonymized: we only need date, foods, and user_id for matching)
    const { data: foodLogs, error: foodError } = await supabase
      .from('food_logs')
      .select('user_id, date, foods')

    if (foodError) {
      return NextResponse.json(
        { error: 'Failed to fetch food logs', details: foodError.message },
        { status: 500 }
      )
    }

    // Fetch all symptom logs
    const { data: symptomLogs, error: symptomError } = await supabase
      .from('symptom_logs')
      .select('user_id, date, bloating, pain, energy, stool_type, gas, mood')

    if (symptomError) {
      return NextResponse.json(
        { error: 'Failed to fetch symptom logs', details: symptomError.message },
        { status: 500 }
      )
    }

    if (!foodLogs || !symptomLogs || foodLogs.length === 0 || symptomLogs.length === 0) {
      return NextResponse.json({
        success: true,
        correlations_computed: 0,
        message: 'Insufficient data for correlation analysis',
        timestamp: new Date().toISOString(),
      })
    }

    // Build a lookup: user_id+date -> symptom values
    type SymptomRecord = Record<string, number | null>
    const symptomMap = new Map<string, SymptomRecord>()
    for (const log of symptomLogs) {
      const key = `${log.user_id}:${log.date}`
      symptomMap.set(key, {
        bloating: log.bloating,
        pain: log.pain,
        energy: log.energy,
        stool_type: log.stool_type,
        gas: log.gas,
        mood: log.mood,
      })
    }

    // Count food occurrences and build food->symptom data pairs
    type FoodSymptomData = {
      [symptom: string]: { foodValues: number[]; symptomValues: number[] }
    }
    const foodData = new Map<string, FoodSymptomData>()

    for (const foodLog of foodLogs) {
      const symptomKey = `${foodLog.user_id}:${foodLog.date}`
      const symptoms = symptomMap.get(symptomKey)
      if (!symptoms) continue

      for (const food of foodLog.foods) {
        const normalizedFood = food.toLowerCase().trim()
        if (!normalizedFood) continue

        if (!foodData.has(normalizedFood)) {
          const entry: FoodSymptomData = {}
          for (const dim of SYMPTOM_DIMENSIONS) {
            entry[dim] = { foodValues: [], symptomValues: [] }
          }
          foodData.set(normalizedFood, entry)
        }

        const data = foodData.get(normalizedFood)!
        for (const dim of SYMPTOM_DIMENSIONS) {
          const symptomVal = symptoms[dim]
          if (symptomVal !== null && symptomVal !== undefined) {
            // Food presence is binary: 1 when present on that day
            data[dim].foodValues.push(1)
            data[dim].symptomValues.push(symptomVal)
          }
        }
      }
    }

    // Compute correlations for foods with sufficient data
    const correlations: CorrelationInsert[] = []

    for (const [food, data] of foodData.entries()) {
      for (const dim of SYMPTOM_DIMENSIONS) {
        const { foodValues, symptomValues } = data[dim]
        if (foodValues.length < MIN_SAMPLE_SIZE) continue

        const r = pearsonCorrelation(foodValues, symptomValues)
        if (r === null) continue

        correlations.push({
          food,
          symptom: dim,
          correlation_coefficient: Math.round(r * 1000) / 1000,
          sample_size: foodValues.length,
          direction: getDirection(r),
          confidence: Math.min(foodValues.length / 100, 1),
        })
      }
    }

    if (correlations.length === 0) {
      return NextResponse.json({
        success: true,
        correlations_computed: 0,
        message: 'No foods met the minimum sample size threshold',
        timestamp: new Date().toISOString(),
      })
    }

    // Upsert correlations (update existing food+symptom combos)
    let upsertedCount = 0
    const errors: string[] = []

    // Process in batches to avoid payload limits
    const BATCH_SIZE = 50
    for (let i = 0; i < correlations.length; i += BATCH_SIZE) {
      const batch = correlations.slice(i, i + BATCH_SIZE)

      const { error: upsertError } = await supabase
        .from('correlations')
        .upsert(
          batch.map((c) => ({ ...c, computed_at: new Date().toISOString() })),
          { onConflict: 'food,symptom' }
        )

      if (upsertError) {
        errors.push(`Batch upsert failed at offset ${i}: ${upsertError.message}`)
      } else {
        upsertedCount += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      correlations_computed: upsertedCount,
      unique_foods_analyzed: foodData.size,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Correlation engine failed', details: message },
      { status: 500 }
    )
  }
}
