// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidateTag } from 'next/cache'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const now = new Date().toISOString()

    // Fetch approved articles that have schema_markup (SEO-optimized and ready)
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('status', 'approved')
      .not('schema_markup', 'is', null)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch articles for publishing', details: fetchError.message },
        { status: 500 }
      )
    }

    let articlesPublished = 0
    let translationsPublished = 0
    const errors: string[] = []

    if (articles && articles.length > 0) {
      const articleIds = articles.map((a) => a.id)

      // Bulk-update articles to published status
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          status: 'published',
          published_at: now,
          updated_at: now,
        })
        .in('id', articleIds)

      if (updateError) {
        errors.push(`Failed to publish articles: ${updateError.message}`)
      } else {
        articlesPublished = articles.length
      }

      // Also publish translations that are in 'review' status for newly published articles
      const { data: translations, error: transError } = await supabase
        .from('article_translations')
        .select('id')
        .in('article_id', articleIds)
        .eq('status', 'review')

      if (transError) {
        errors.push(`Failed to fetch translations for publishing: ${transError.message}`)
      } else if (translations && translations.length > 0) {
        const translationIds = translations.map((t) => t.id)

        const { error: transUpdateError } = await supabase
          .from('article_translations')
          .update({
            status: 'published',
            updated_at: now,
          })
          .in('id', translationIds)

        if (transUpdateError) {
          errors.push(`Failed to publish translations: ${transUpdateError.message}`)
        } else {
          translationsPublished = translations.length
        }
      }
    }

    // Also check for translations whose parent articles are already published
    // but the translations themselves are still in 'review'
    const { data: orphanTranslations, error: orphanError } = await supabase
      .from('article_translations')
      .select('id, article_id')
      .eq('status', 'review')

    if (!orphanError && orphanTranslations && orphanTranslations.length > 0) {
      const parentIds = [...new Set(orphanTranslations.map((t) => t.article_id).filter(Boolean))]

      if (parentIds.length > 0) {
        const { data: publishedParents } = await supabase
          .from('articles')
          .select('id')
          .in('id', parentIds as string[])
          .eq('status', 'published')

        if (publishedParents && publishedParents.length > 0) {
          const publishedParentIds = new Set(publishedParents.map((p) => p.id))
          const transToPublish = orphanTranslations
            .filter((t) => t.article_id && publishedParentIds.has(t.article_id))
            .map((t) => t.id)

          if (transToPublish.length > 0) {
            const { error: orphanUpdateError } = await supabase
              .from('article_translations')
              .update({ status: 'published', updated_at: now })
              .in('id', transToPublish)

            if (orphanUpdateError) {
              errors.push(`Failed to publish orphan translations: ${orphanUpdateError.message}`)
            } else {
              translationsPublished += transToPublish.length
            }
          }
        }
      }
    }

    // Trigger sitemap regeneration by revalidating the sitemap cache tag
    if (articlesPublished > 0) {
      try {
        revalidateTag('sitemap')
        revalidateTag('articles')
      } catch {
        // revalidateTag may fail outside of a request context in some environments
        console.warn('Failed to revalidate cache tags -- sitemap will update on next build')
      }
    }

    return NextResponse.json({
      success: true,
      articles_published: articlesPublished,
      translations_published: translationsPublished,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Publisher failed', details: message },
      { status: 500 }
    )
  }
}
