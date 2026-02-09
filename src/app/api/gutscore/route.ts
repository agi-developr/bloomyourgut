import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const limit = Math.min(
      365,
      Math.max(1, parseInt(searchParams.get('limit') || '30'))
    )

    let query = supabase
      .from('gut_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(limit)

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /gutscore GET] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch gut scores' },
        { status: 500 }
      )
    }

    // Compute summary stats if we have data
    const scores = data || []
    let summary = null

    if (scores.length > 0) {
      const scoreValues = scores.map((s) => s.score)
      const currentScore = scoreValues[0]
      const avgScore =
        scoreValues.reduce((sum, val) => sum + val, 0) / scoreValues.length
      const minScore = Math.min(...scoreValues)
      const maxScore = Math.max(...scoreValues)

      // Calculate trend (positive = improving, negative = declining)
      let trend = 0
      if (scores.length >= 2) {
        const recent = scoreValues.slice(0, Math.ceil(scoreValues.length / 2))
        const older = scoreValues.slice(Math.ceil(scoreValues.length / 2))
        const recentAvg =
          recent.reduce((sum, val) => sum + val, 0) / recent.length
        const olderAvg =
          older.reduce((sum, val) => sum + val, 0) / older.length
        trend = Math.round((recentAvg - olderAvg) * 10) / 10
      }

      summary = {
        current: currentScore,
        average: Math.round(avgScore * 10) / 10,
        min: minScore,
        max: maxScore,
        trend,
        dataPoints: scores.length,
      }
    }

    return NextResponse.json({
      scores,
      summary,
    })
  } catch (error) {
    console.error('[API /gutscore GET] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
