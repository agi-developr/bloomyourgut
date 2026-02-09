/**
 * GutScore calculation engine.
 *
 * The GutScore is a 0-100 composite score measuring overall gut health
 * based on four equally-weighted components (each 0-25 points):
 *
 * 1. Symptom Severity (inverted: fewer symptoms = higher score)
 * 2. Trend (improving over time = higher score)
 * 3. Consistency (regular tracking = higher score)
 * 4. Food Diversity (varied diet = higher score)
 */

export interface GutScoreComponents {
  /** 0-25: Lower symptom severity = higher score */
  symptom_severity: number
  /** 0-25: Improving trend over time = higher score */
  trend: number
  /** 0-25: Consistent daily tracking = higher score */
  consistency: number
  /** 0-25: Diverse diet with many unique foods = higher score */
  food_diversity: number
}

export interface GutScoreResult {
  /** Overall gut health score 0-100 */
  score: number
  /** Breakdown of score components */
  components: GutScoreComponents
}

interface SymptomLog {
  date: string
  type: string
  /** Severity 1-10 */
  severity: number
}

interface FoodLog {
  date: string
  foods: string[]
}

interface PreviousScore {
  date: string
  score: number
}

/**
 * Calculate the GutScore from symptom logs, food logs, and historical scores.
 *
 * @param symptomLogs - Last 7 days of symptom entries
 * @param foodLogs - Last 7 days of food diary entries
 * @param previousScores - Last 30 days of GutScore values for trend analysis
 */
export function calculateGutScore(
  symptomLogs: SymptomLog[],
  foodLogs: FoodLog[],
  previousScores: PreviousScore[]
): GutScoreResult {
  const symptomSeverity = calculateSymptomComponent(symptomLogs)
  const trend = calculateTrendComponent(previousScores)
  const consistency = calculateConsistencyComponent(symptomLogs, foodLogs)
  const foodDiversity = calculateFoodDiversityComponent(foodLogs)

  const score = Math.round(
    symptomSeverity + trend + consistency + foodDiversity
  )

  return {
    score: clamp(score, 0, 100),
    components: {
      symptom_severity: round(symptomSeverity),
      trend: round(trend),
      consistency: round(consistency),
      food_diversity: round(foodDiversity),
    },
  }
}

/**
 * Symptom Severity Component (0-25 points)
 *
 * Inverted: fewer and less severe symptoms = higher score.
 * No symptoms at all in the past 7 days = full 25 points.
 */
function calculateSymptomComponent(symptomLogs: SymptomLog[]): number {
  if (symptomLogs.length === 0) {
    // No symptoms logged could mean no tracking OR no symptoms.
    // Give a moderate score to avoid rewarding non-tracking.
    return 15
  }

  // Average severity across all logged symptoms (1-10 scale)
  const avgSeverity =
    symptomLogs.reduce((sum, log) => sum + clamp(log.severity, 1, 10), 0) /
    symptomLogs.length

  // Frequency factor: more symptom entries = more frequent issues
  // Cap at 3 entries/day * 7 days = 21 max expected entries
  const frequencyPenalty = Math.min(symptomLogs.length / 21, 1)

  // Invert: lower severity and frequency = higher score
  // avgSeverity ranges 1-10, normalize to 0-1
  const severityFactor = 1 - (avgSeverity - 1) / 9
  const frequencyFactor = 1 - frequencyPenalty * 0.5

  return 25 * severityFactor * frequencyFactor
}

/**
 * Trend Component (0-25 points)
 *
 * Compares recent scores to older scores.
 * Improving trend = higher score. Declining = lower.
 */
function calculateTrendComponent(previousScores: PreviousScore[]): number {
  if (previousScores.length < 2) {
    // Not enough data for trend analysis - give baseline score
    return 12.5
  }

  // Sort by date to ensure chronological order
  const sorted = [...previousScores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Split into first half and second half
  const midpoint = Math.floor(sorted.length / 2)
  const olderScores = sorted.slice(0, midpoint)
  const recentScores = sorted.slice(midpoint)

  const olderAvg =
    olderScores.reduce((sum, s) => sum + s.score, 0) / olderScores.length
  const recentAvg =
    recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length

  // Calculate improvement as a percentage of the scale (0-100)
  const improvement = recentAvg - olderAvg

  // Map improvement to 0-25 score
  // -20 or worse = 0 points, +20 or better = 25 points
  // 0 (no change) = 12.5 points
  const normalized = (improvement + 20) / 40
  return 25 * clamp(normalized, 0, 1)
}

/**
 * Consistency Component (0-25 points)
 *
 * Rewards users who track daily. 7/7 days tracked = full score.
 */
function calculateConsistencyComponent(
  symptomLogs: SymptomLog[],
  foodLogs: FoodLog[]
): number {
  // Count unique days with any tracking activity
  const trackedDays = new Set<string>()

  for (const log of symptomLogs) {
    trackedDays.add(normalizeDate(log.date))
  }
  for (const log of foodLogs) {
    trackedDays.add(normalizeDate(log.date))
  }

  // Score based on percentage of days tracked out of 7
  const daysTracked = Math.min(trackedDays.size, 7)
  return 25 * (daysTracked / 7)
}

/**
 * Food Diversity Component (0-25 points)
 *
 * A diverse diet supports a diverse microbiome.
 * Measures unique foods consumed over 7 days.
 *
 * Targets: 30+ unique foods/week is considered excellent
 * (based on American Gut Project research).
 */
function calculateFoodDiversityComponent(foodLogs: FoodLog[]): number {
  if (foodLogs.length === 0) {
    return 0
  }

  // Collect all unique foods (normalized to lowercase)
  const uniqueFoods = new Set<string>()
  for (const log of foodLogs) {
    for (const food of log.foods) {
      const normalized = food.toLowerCase().trim()
      if (normalized) {
        uniqueFoods.add(normalized)
      }
    }
  }

  // 30 unique foods in a week = perfect score
  // Based on American Gut Project's "30 plant foods per week" target
  const diversityRatio = Math.min(uniqueFoods.size / 30, 1)

  return 25 * diversityRatio
}

// ----- Utility helpers -----

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function normalizeDate(dateStr: string): string {
  // Extract YYYY-MM-DD from any date string
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toISOString().slice(0, 10)
}

/**
 * Get a human-readable interpretation of a GutScore.
 */
export function interpretScore(score: number): {
  label: string
  description: string
  color: string
} {
  if (score >= 80) {
    return {
      label: 'Excellent',
      description:
        'Your gut health indicators are strong. Keep up your current routine!',
      color: '#22c55e', // green-500
    }
  }
  if (score >= 60) {
    return {
      label: 'Good',
      description:
        'Your gut health is on a positive track. Small improvements can make a big difference.',
      color: '#84cc16', // lime-500
    }
  }
  if (score >= 40) {
    return {
      label: 'Fair',
      description:
        'There is room for improvement. Consider tracking more consistently and diversifying your diet.',
      color: '#eab308', // yellow-500
    }
  }
  if (score >= 20) {
    return {
      label: 'Needs Attention',
      description:
        'Your symptoms or tracking patterns suggest your gut could use some support. Consider reviewing your diet and talking to a healthcare provider.',
      color: '#f97316', // orange-500
    }
  }
  return {
    label: 'Critical',
    description:
      'Your gut health indicators are concerning. We strongly recommend consulting with a healthcare provider.',
    color: '#ef4444', // red-500
  }
}
