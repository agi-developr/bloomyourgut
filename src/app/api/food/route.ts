import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { MealType } from '@/types/database'

const VALID_MEAL_TYPES: MealType[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
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
    const mealType = searchParams.get('meal_type')
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '30'))
    )

    let query = supabase
      .from('food_logs')
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

    if (mealType) {
      query = query.eq('meal_type', mealType)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /food GET] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch food logs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ foods: data || [] })
  } catch (error) {
    console.error('[API /food GET] Unexpected error:', error)
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
      meal_type?: MealType | null
      foods: string[]
      ingredients?: string[] | null
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

    if (!Array.isArray(body.foods) || body.foods.length === 0) {
      return NextResponse.json(
        { error: 'foods must be a non-empty array of strings' },
        { status: 400 }
      )
    }

    // Validate meal_type if provided
    if (
      body.meal_type &&
      !VALID_MEAL_TYPES.includes(body.meal_type)
    ) {
      return NextResponse.json(
        {
          error: `meal_type must be one of: ${VALID_MEAL_TYPES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        user_id: user.id,
        date: body.date,
        meal_type: body.meal_type ?? null,
        foods: body.foods,
        ingredients: body.ingredients ?? null,
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[API /food POST] Error:', error)
      return NextResponse.json(
        { error: 'Failed to log food' },
        { status: 500 }
      )
    }

    return NextResponse.json({ food: data }, { status: 201 })
  } catch (error) {
    console.error('[API /food POST] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
