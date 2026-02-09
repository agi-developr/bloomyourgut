import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateArticle } from '@/lib/ai/content-generator'
import type { Study, ArticleInsert } from '@/types/database'

const ARTICLES_PER_RUN = 5

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch studies that are queued for content generation
    const { data: studies, error: fetchError } = await supabase
      .from('studies')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(ARTICLES_PER_RUN)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch queued studies', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!studies || studies.length === 0) {
      return NextResponse.json({
        success: true,
        articles_generated: 0,
        message: 'No queued studies to process',
        timestamp: new Date().toISOString(),
      })
    }

    let articlesGenerated = 0
    const errors: string[] = []

    for (const study of studies as Study[]) {
      try {
        // Generate article content from the study using AI
        const article = await generateArticle(study)

        // Create a URL-friendly slug from the title
        const slug = article.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const articleToInsert: ArticleInsert = {
          title: article.title,
          slug,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          seo_keywords: article.seo_keywords,
          study_id: study.id,
          reading_time_minutes: article.reading_time_minutes,
          status: 'review',
        }

        const { error: insertError } = await supabase
          .from('articles')
          .insert(articleToInsert)

        if (insertError) {
          errors.push(`Failed to insert article for study ${study.pmid}: ${insertError.message}`)
          continue
        }

        // Mark the study as processed
        const { error: updateError } = await supabase
          .from('studies')
          .update({ status: 'processed', updated_at: new Date().toISOString() })
          .eq('id', study.id)

        if (updateError) {
          errors.push(`Failed to update study ${study.pmid} status: ${updateError.message}`)
          continue
        }

        articlesGenerated++
      } catch (genError) {
        const message = genError instanceof Error ? genError.message : String(genError)
        errors.push(`Error generating article for study ${study.pmid}: ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      articles_generated: articlesGenerated,
      studies_processed: studies.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Content generator failed', details: message },
      { status: 500 }
    )
  }
}
