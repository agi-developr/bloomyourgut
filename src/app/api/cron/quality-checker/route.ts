// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkArticleQuality } from '@/lib/ai/quality-checker'
import type { Article } from '@/types/database'

const ARTICLES_PER_RUN = 10
const QUALITY_THRESHOLD = 8

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch articles pending quality review
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'review')
      .order('created_at', { ascending: true })
      .limit(ARTICLES_PER_RUN)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch articles for review', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: true,
        reviewed: 0,
        approved: 0,
        rejected: 0,
        message: 'No articles pending review',
        timestamp: new Date().toISOString(),
      })
    }

    let approved = 0
    let rejected = 0
    const errors: string[] = []

    for (const article of articles as Article[]) {
      try {
        // Run AI quality check on the article
        const qualityResult = await checkArticleQuality(article)

        if (qualityResult.score >= QUALITY_THRESHOLD) {
          // Article passes quality gate -- approve it
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              status: 'approved',
              quality_score: qualityResult.score,
              updated_at: new Date().toISOString(),
            })
            .eq('id', article.id)

          if (updateError) {
            errors.push(`Failed to approve article "${article.slug}": ${updateError.message}`)
            continue
          }

          approved++
        } else {
          // Article does not meet quality threshold -- send back to draft
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              status: 'draft',
              quality_score: qualityResult.score,
              updated_at: new Date().toISOString(),
            })
            .eq('id', article.id)

          if (updateError) {
            errors.push(`Failed to reject article "${article.slug}": ${updateError.message}`)
            continue
          }

          // Log quality issues for visibility
          console.warn(
            `Article "${article.slug}" scored ${qualityResult.score}/${QUALITY_THRESHOLD}. Issues: ${qualityResult.issues?.join(', ') ?? 'none listed'}`
          )

          rejected++
        }
      } catch (checkError) {
        const message = checkError instanceof Error ? checkError.message : String(checkError)
        errors.push(`Error checking quality for article "${article.slug}": ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      reviewed: articles.length,
      approved,
      rejected,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Quality checker failed', details: message },
      { status: 500 }
    )
  }
}
