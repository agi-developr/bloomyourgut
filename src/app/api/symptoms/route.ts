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
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '30'))
    )

    let query = supabase
      .from('symptom_logs')
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
      console.error('[API /symptoms GET] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch symptom logs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ symptoms: data || [] })
  } catch (error) {
    console.error('[API /symptoms GET] Unexpected error:', error)
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
      bloating?: number | null
      pain?: number | null
      energy?: number | null
      stool_type?: number | null
      gas?: number | null
      mood?: number | null
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

    // Validate severity scores are in range 1-10 if provided
    const severityFields = ['bloating', 'pain', 'energy', 'gas', 'mood'] as const
    for (const field of severityFields) {
      const value = body[field]
      if (value !== undefined && value !== null) {
        if (typeof value !== 'number' || value < 1 || value > 10) {
          return NextResponse.json(
            { error: `${field} must be a number between 1 and 10` },
            { status: 400 }
          )
        }
      }
    }

    // Validate stool_type is Bristol scale (1-7)
    if (
      body.stool_type !== undefined &&
      body.stool_type !== null
    ) {
      if (
        typeof body.stool_type !== 'number' ||
        body.stool_type < 1 ||
        body.stool_type > 7
      ) {
        return NextResponse.json(
          { error: 'stool_type must be between 1 and 7 (Bristol scale)' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('symptom_logs')
      .insert({
        user_id: user.id,
        date: body.date,
        bloating: body.bloating ?? null,
        pain: body.pain ?? null,
        energy: body.energy ?? null,
        stool_type: body.stool_type ?? null,
        gas: body.gas ?? null,
        mood: body.mood ?? null,
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[API /symptoms POST] Error:', error)
      return NextResponse.json(
        { error: 'Failed to log symptoms' },
        { status: 500 }
      )
    }

    return NextResponse.json({ symptom: data }, { status: 201 })
  } catch (error) {
    console.error('[API /symptoms POST] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
