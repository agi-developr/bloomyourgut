import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let supabase: ReturnType<typeof createAdminClient>
  try {
    supabase = createAdminClient()
  } catch {
    // During build without env vars, return static pages only
    return [
      { url: 'https://bloomyourgut.com', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
      { url: 'https://bloomyourgut.com/articles', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
      { url: 'https://bloomyourgut.com/pricing', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    ]
  }

  // Static pages
  const staticPages = [
    { url: 'https://bloomyourgut.com', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: 'https://bloomyourgut.com/articles', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: 'https://bloomyourgut.com/pricing', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://bloomyourgut.com/about', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: 'https://bloomyourgut.com/consult', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: 'https://bloomyourgut.com/disclaimer', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://bloomyourgut.com/privacy', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://bloomyourgut.com/terms', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://bloomyourgut.com/research', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://bloomyourgut.com/contact', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://bloomyourgut.com/faq', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://bloomyourgut.com/newsletter', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://bloomyourgut.com/chat', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ]

  // Published articles (English)
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .eq('language', 'en')
    .order('published_at', { ascending: false })

  const articlePages = (articles || []).map((article) => ({
    url: `https://bloomyourgut.com/articles/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Translated articles
  const { data: translations } = await supabase
    .from('article_translations')
    .select('slug, language, updated_at')
    .eq('status', 'published')

  const translationPages = (translations || []).map((t) => ({
    url: `https://bloomyourgut.com/${t.language}/articles/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...translationPages]
}
