import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SupplementTiming } from '@/types/database'

const VALID_TIMINGS: SupplementTiming[] = [
  'morning',
  'afternoon',
  'evening',
  'with_meal',
  'empty_stomach',
]

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
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '30'))
    )

    let query = supabase
      .from('supplement_logs')
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
      console.error('[API /supplements GET] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch supplement logs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ supplements: data || [] })
  } catch (error) {
    console.error('[API /supplements GET] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: {
      date: string
      supplement: string
      dose?: string | null
      timing?: SupplementTiming | null
      notes?: string | null
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (!body.date) {
      return NextResponse.json(
        { error: 'date is required (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (!body.supplement || typeof body.supplement !== 'string') {
      return NextResponse.json(
        { error: 'supplement name is required' },
        { status: 400 }
      )
    }

    // Validate timing if provided
    if (body.timing && !VALID_TIMINGS.includes(body.timing)) {
      return NextResponse.json(
        {
          error: `timing must be one of: ${VALID_TIMINGS.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('supplement_logs')
      .insert({
        user_id: user.id,
        date: body.date,
        supplement: body.supplement,
        dose: body.dose ?? null,
        timing: body.timing ?? null,
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[API /supplements POST] Error:', error)
      return NextResponse.json(
        { error: 'Failed to log supplement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ supplement: data }, { status: 201 })
  } catch (error) {
    console.error('[API /supplements POST] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
