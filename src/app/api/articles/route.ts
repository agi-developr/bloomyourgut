import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
    const category = searchParams.get('category')
    const language = searchParams.get('language') || 'en'
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const supabase = await createClient()

    let query = supabase
      .from('articles')
      .select(
        'id, title, slug, excerpt, category, tags, reading_time_minutes, published_at, author',
        { count: 'exact' }
      )
      .eq('status', 'published')
      .eq('language', language)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data, error, count } = await query

    if (error) {
      console.error('[API /articles GET] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      articles: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('[API /articles GET] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Authenticate user (admin check)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    let body: {
      title: string
      slug: string
      content: string
      excerpt?: string
      category: string
      tags?: string[]
      seo_title?: string
      seo_description?: string
      seo_keywords?: string[]
      reading_time_minutes?: number
      study_id?: string
      status?: string
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'title, slug, content, and category are required' },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || null,
        category: body.category,
        tags: body.tags || null,
        seo_title: body.seo_title || null,
        seo_description: body.seo_description || null,
        seo_keywords: body.seo_keywords || null,
        reading_time_minutes: body.reading_time_minutes || null,
        study_id: body.study_id || null,
        status: (body.status as 'draft' | 'review' | 'approved' | 'published') || 'draft',
        published_at:
          body.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('[API /articles POST] Error:', error)
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      )
    }

    return NextResponse.json({ article: data }, { status: 201 })
  } catch (error) {
    console.error('[API /articles POST] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
