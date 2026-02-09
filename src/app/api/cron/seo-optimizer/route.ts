import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Article } from '@/types/database'

const ARTICLES_PER_RUN = 10

/**
 * Generate MedicalWebPage schema.org JSON-LD for an article.
 */
function generateMedicalSchema(article: Article): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || '',
    author: {
      '@type': 'Organization',
      name: 'BloomYourGut',
      url: 'https://bloomyourgut.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BloomYourGut',
      url: 'https://bloomyourgut.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bloomyourgut.com/logo.png',
      },
    },
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bloomyourgut.com/articles/${article.slug}`,
    },
    about: {
      '@type': 'MedicalCondition',
      name: article.category,
    },
    keywords: article.seo_keywords?.join(', ') || article.tags?.join(', ') || '',
    articleSection: article.category,
    wordCount: article.content.split(/\s+/).length,
    ...(article.reading_time_minutes
      ? { timeRequired: `PT${article.reading_time_minutes}M` }
      : {}),
  }
}

/**
 * Find related articles by shared tags or same category for internal linking.
 */
async function findRelatedArticles(
  supabase: ReturnType<typeof createAdminClient>,
  article: Article
): Promise<Array<{ id: string; title: string; slug: string }>> {
  // First try to find articles with overlapping tags
  const { data: tagMatches } = await supabase
    .from('articles')
    .select('id, title, slug, tags')
    .eq('status', 'published')
    .neq('id', article.id)
    .limit(20)

  if (!tagMatches || tagMatches.length === 0) return []

  const articleTags = new Set(article.tags ?? [])

  // Score each candidate by tag overlap
  const scored = tagMatches
    .map((candidate) => {
      const candidateTags = candidate.tags ?? []
      const overlap = candidateTags.filter((t: string) => articleTags.has(t)).length
      return { id: candidate.id, title: candidate.title, slug: candidate.slug, overlap }
    })
    .filter((c) => c.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 5)

  // If we did not find enough tag-based matches, fall back to same category
  if (scored.length < 3) {
    const { data: categoryMatches } = await supabase
      .from('articles')
      .select('id, title, slug')
      .eq('status', 'published')
      .eq('category', article.category)
      .neq('id', article.id)
      .limit(5)

    const existingIds = new Set(scored.map((s) => s.id))
    for (const match of categoryMatches ?? []) {
      if (!existingIds.has(match.id)) {
        scored.push({ ...match, overlap: 0 })
      }
      if (scored.length >= 5) break
    }
  }

  return scored.map(({ id, title, slug }) => ({ id, title, slug }))
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch approved articles that have not yet been SEO-optimized
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'approved')
      .is('schema_markup', null)
      .order('created_at', { ascending: true })
      .limit(ARTICLES_PER_RUN)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch articles for SEO optimization', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: true,
        optimized: 0,
        message: 'No articles need SEO optimization',
        timestamp: new Date().toISOString(),
      })
    }

    let optimized = 0
    const errors: string[] = []

    for (const article of articles as Article[]) {
      try {
        // Generate schema.org structured data
        const schemaMarkup = generateMedicalSchema(article)

        // Find related articles for internal linking suggestions
        const relatedArticles = await findRelatedArticles(supabase, article)

        // Build internal link suggestions as part of SEO data
        const internalLinks = relatedArticles.map((related) => ({
          title: related.title,
          url: `/articles/${related.slug}`,
        }))

        // Update the article with SEO data
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            schema_markup: {
              ...schemaMarkup,
              _internal_links: internalLinks,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', article.id)

        if (updateError) {
          errors.push(`Failed to update SEO for "${article.slug}": ${updateError.message}`)
          continue
        }

        optimized++
      } catch (seoError) {
        const message = seoError instanceof Error ? seoError.message : String(seoError)
        errors.push(`Error optimizing "${article.slug}": ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      optimized,
      total_candidates: articles.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'SEO optimizer failed', details: message },
      { status: 500 }
    )
  }
}
