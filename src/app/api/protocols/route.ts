import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ProtocolStatus } from '@/types/database'

const VALID_STATUSES: ProtocolStatus[] = ['active', 'completed', 'paused']

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
    const includePublic = searchParams.get('include_public') === 'true'
    const status = searchParams.get('status') as ProtocolStatus | null

    // Fetch user's own protocols
    let userQuery = supabase
      .from('protocols')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (status && VALID_STATUSES.includes(status)) {
      userQuery = userQuery.eq('status', status)
    }

    const { data: userProtocols, error: userError } = await userQuery

    if (userError) {
      console.error('[API /protocols GET] Error fetching user protocols:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch protocols' },
        { status: 500 }
      )
    }

    // Optionally fetch public protocols from other users
    let publicProtocols: typeof userProtocols = []

    if (includePublic) {
      const { data: pubData, error: pubError } = await supabase
        .from('protocols')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user.id)
        .order('upvotes', { ascending: false })
        .limit(20)

      if (pubError) {
        console.error(
          '[API /protocols GET] Error fetching public protocols:',
          pubError
        )
        // Non-fatal: still return user protocols
      } else {
        publicProtocols = pubData
      }
    }

    return NextResponse.json({
      protocols: userProtocols || [],
      publicProtocols: publicProtocols || [],
    })
  } catch (error) {
    console.error('[API /protocols GET] Unexpected error:', error)
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
      title: string
      description?: string | null
      supplements?: { name: string; dose: string; timing: string; duration: string }[] | null
      diet_rules?: { rule: string; category: string }[] | null
      duration_weeks?: number | null
      is_public?: boolean
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      )
    }

    // Validate duration if provided
    if (
      body.duration_weeks !== undefined &&
      body.duration_weeks !== null &&
      (typeof body.duration_weeks !== 'number' || body.duration_weeks < 1)
    ) {
      return NextResponse.json(
        { error: 'duration_weeks must be a positive number' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('protocols')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description ?? null,
        supplements: body.supplements ?? null,
        diet_rules: body.diet_rules ?? null,
        duration_weeks: body.duration_weeks ?? null,
        is_public: body.is_public ?? false,
      })
      .select()
      .single()

    if (error) {
      console.error('[API /protocols POST] Error:', error)
      return NextResponse.json(
        { error: 'Failed to create protocol' },
        { status: 500 }
      )
    }

    return NextResponse.json({ protocol: data }, { status: 201 })
  } catch (error) {
    console.error('[API /protocols POST] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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
      id: string
      status?: ProtocolStatus
      title?: string
      description?: string | null
      supplements?: { name: string; dose: string; timing: string; duration: string }[] | null
      diet_rules?: { rule: string; category: string }[] | null
      duration_weeks?: number | null
      is_public?: boolean
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (!body.id) {
      return NextResponse.json(
        { error: 'Protocol id is required' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('protocols')
      .select('user_id')
      .eq('id', body.id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      )
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own protocols' },
        { status: 403 }
      )
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.supplements !== undefined) updateData.supplements = body.supplements
    if (body.diet_rules !== undefined) updateData.diet_rules = body.diet_rules
    if (body.duration_weeks !== undefined)
      updateData.duration_weeks = body.duration_weeks
    if (body.is_public !== undefined) updateData.is_public = body.is_public

    const { data, error } = await supabase
      .from('protocols')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('[API /protocols PATCH] Error:', error)
      return NextResponse.json(
        { error: 'Failed to update protocol' },
        { status: 500 }
      )
    }

    return NextResponse.json({ protocol: data })
  } catch (error) {
    console.error('[API /protocols PATCH] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
