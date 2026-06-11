import { createAdminClient } from '@/lib/supabase/admin'
import type { HubPage } from '@/data/hub-pages'

/**
 * Build-safe data loaders for hub pages.
 *
 * Every Supabase call is wrapped so that a missing service-role key (e.g. during
 * `next build` without env) degrades to an empty result instead of throwing —
 * the same pattern used by `src/app/sitemap.ts`.
 */

export interface HubArticle {
  title: string
  slug: string
  excerpt: string | null
  category: string
  reading_time_minutes: number | null
  published_at: string | null
}

export interface HubProduct {
  name: string
  brand: string | null
  affiliate_url: string
  image_url: string | null
  description: string | null
}

function tryAdminClient(): ReturnType<typeof createAdminClient> | null {
  try {
    return createAdminClient()
  } catch {
    return null
  }
}

/**
 * Fetch published articles that match a hub page's topical categories/tags.
 * Matches on category OR overlapping tags, newest first.
 */
export async function getMatchingArticles(
  page: HubPage,
  limit = 6
): Promise<HubArticle[]> {
  const supabase = tryAdminClient()
  if (!supabase) return []

  const needles = [
    page.name,
    ...page.articleCategories,
    ...page.tags,
  ].filter(Boolean)

  if (needles.length === 0) return []

  try {
    // Match category against any of the topical needles (case-insensitive),
    // or overlapping tags via the text[] `tags` column.
    const orCategory = needles
      .map((n) => `category.ilike.%${escapeOr(n)}%`)
      .join(',')

    const { data, error } = await supabase
      .from('articles')
      .select('title, slug, excerpt, category, reading_time_minutes, published_at, tags')
      .eq('status', 'published')
      .eq('language', 'en')
      .or(orCategory)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      category: a.category,
      reading_time_minutes: a.reading_time_minutes,
      published_at: a.published_at,
    }))
  } catch {
    return []
  }
}

/**
 * Fetch active affiliate products whose category matches the hub page's
 * `affiliateCategory`, for product recommendations.
 */
export async function getAffiliateProducts(
  page: HubPage,
  limit = 3
): Promise<HubProduct[]> {
  const supabase = tryAdminClient()
  if (!supabase || !page.affiliateCategory) return []

  try {
    const { data, error } = await supabase
      .from('affiliate_products')
      .select('name, brand, affiliate_url, image_url, description, category, is_active')
      .eq('is_active', true)
      .ilike('category', `%${page.affiliateCategory}%`)
      .limit(limit)

    if (error || !data) return []

    return data.map((p) => ({
      name: p.name,
      brand: p.brand,
      affiliate_url: p.affiliate_url,
      image_url: p.image_url,
      description: p.description,
    }))
  } catch {
    return []
  }
}

/** Escape commas/parentheses that would break Supabase `.or()` filter syntax. */
function escapeOr(s: string): string {
  return s.replace(/[(),]/g, ' ').trim()
}
