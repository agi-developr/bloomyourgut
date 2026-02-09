// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { translateContent } from '@/lib/translation/translator'
import type { Article, ArticleTranslationInsert } from '@/types/database'

const TARGET_LANGUAGES = ['es', 'pt', 'de', 'fr', 'hi']
const ARTICLES_PER_RUN = 3

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch published articles
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch published articles', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: true,
        translations_created: 0,
        message: 'No published articles to translate',
        timestamp: new Date().toISOString(),
      })
    }

    // Fetch all existing translations to find gaps
    const { data: existingTranslations, error: transError } = await supabase
      .from('article_translations')
      .select('article_id, language')

    if (transError) {
      return NextResponse.json(
        { error: 'Failed to fetch existing translations', details: transError.message },
        { status: 500 }
      )
    }

    // Build a set of existing article_id+language combos for quick lookup
    const existingSet = new Set(
      (existingTranslations ?? []).map((t) => `${t.article_id}:${t.language}`)
    )

    // Find articles missing translations
    type TranslationJob = { article: Article; language: string }
    const jobs: TranslationJob[] = []

    for (const article of articles as Article[]) {
      for (const lang of TARGET_LANGUAGES) {
        if (!existingSet.has(`${article.id}:${lang}`)) {
          jobs.push({ article, language: lang })
        }
        if (jobs.length >= ARTICLES_PER_RUN) break
      }
      if (jobs.length >= ARTICLES_PER_RUN) break
    }

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        translations_created: 0,
        message: 'All published articles are fully translated',
        timestamp: new Date().toISOString(),
      })
    }

    let translationsCreated = 0
    const errors: string[] = []

    for (const job of jobs) {
      try {
        // Translate all content fields
        const translated = await translateContent({
          title: job.article.title,
          content: job.article.content,
          excerpt: job.article.excerpt ?? '',
          seo_title: job.article.seo_title ?? '',
          seo_description: job.article.seo_description ?? '',
        }, job.language)

        // Generate a localized slug
        const localizedSlug = `${job.language}/${translated.title
          .toLowerCase()
          .replace(/[^a-z0-9\u00C0-\u024F]+/g, '-')
          .replace(/^-|-$/g, '')}`

        const translationToInsert: ArticleTranslationInsert = {
          article_id: job.article.id,
          language: job.language,
          title: translated.title,
          slug: localizedSlug,
          content: translated.content,
          excerpt: translated.excerpt || null,
          seo_title: translated.seo_title || null,
          seo_description: translated.seo_description || null,
          status: 'review',
        }

        const { error: insertError } = await supabase
          .from('article_translations')
          .insert(translationToInsert)

        if (insertError) {
          errors.push(
            `Failed to insert ${job.language} translation for "${job.article.slug}": ${insertError.message}`
          )
          continue
        }

        translationsCreated++
      } catch (transError) {
        const message = transError instanceof Error ? transError.message : String(transError)
        errors.push(
          `Error translating "${job.article.slug}" to ${job.language}: ${message}`
        )
      }
    }

    return NextResponse.json({
      success: true,
      translations_created: translationsCreated,
      jobs_attempted: jobs.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Translator failed', details: message },
      { status: 500 }
    )
  }
}
