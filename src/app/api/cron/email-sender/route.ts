import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * ConvertKit broadcast API structure (for future integration).
 *
 * POST https://api.convertkit.com/v4/broadcasts
 * Headers:
 *   Authorization: Bearer <CONVERTKIT_API_SECRET>
 *   Content-Type: application/json
 *
 * Body:
 * {
 *   "broadcast": {
 *     "content": "<html email content>",
 *     "subject": "Your Weekly Gut Health Digest",
 *     "description": "Weekly digest - <date>",
 *     "email_layout_template": "Text Only",
 *     "public": true,
 *     "published_at": "<ISO datetime for scheduling>"
 *   }
 * }
 */

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch recent published articles to build the digest
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, published_at')
      .eq('status', 'published')
      .gte('published_at', sevenDaysAgo)
      .order('published_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch articles for digest', details: fetchError.message },
        { status: 500 }
      )
    }

    const articleCount = articles?.length ?? 0

    // Check if ConvertKit API key is configured
    const convertkitApiSecret = process.env.CONVERTKIT_API_SECRET
    const convertkitConfigured = Boolean(convertkitApiSecret)

    if (!convertkitConfigured) {
      // Log what would happen in production
      console.log('[Email Sender] ConvertKit not configured. Would send digest with:')
      console.log(`  - ${articleCount} articles`)
      console.log(`  - Subject: "Your Weekly Gut Health Digest"`)
      console.log(
        `  - Articles: ${articles?.map((a) => a.title).join(', ') ?? 'none'}`
      )

      return NextResponse.json({
        success: true,
        sent: false,
        reason: 'ConvertKit API not configured (CONVERTKIT_API_SECRET missing)',
        would_send: {
          article_count: articleCount,
          subject: 'Your Weekly Gut Health Digest',
          articles: articles?.map((a) => ({
            title: a.title,
            url: `https://bloomyourgut.com/articles/${a.slug}`,
          })) ?? [],
        },
        timestamp: now.toISOString(),
      })
    }

    // Production: Send via ConvertKit Broadcasts API
    try {
      const broadcastPayload = {
        broadcast: {
          subject: 'Your Weekly Gut Health Digest',
          description: `Weekly digest - ${now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
          content: buildPlainDigest(articles ?? []),
          email_layout_template: 'Text Only',
          public: true,
        },
      }

      const response = await fetch('https://api.convertkit.com/v4/broadcasts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${convertkitApiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(broadcastPayload),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        return NextResponse.json(
          {
            error: 'ConvertKit API error',
            status: response.status,
            details: errorBody,
          },
          { status: 502 }
        )
      }

      const result = await response.json()

      return NextResponse.json({
        success: true,
        sent: true,
        broadcast_id: result.broadcast?.id,
        article_count: articleCount,
        timestamp: now.toISOString(),
      })
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : String(apiError)
      return NextResponse.json(
        { error: 'Failed to send via ConvertKit', details: message },
        { status: 502 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Email sender failed', details: message },
      { status: 500 }
    )
  }
}

/**
 * Build a simple HTML digest for ConvertKit broadcast content.
 */
function buildPlainDigest(
  articles: Array<{ title: string; slug: string; excerpt: string | null }>
): string {
  if (articles.length === 0) {
    return '<p>No new articles this week. Stay tuned!</p>'
  }

  const items = articles
    .map(
      (a) =>
        `<h3><a href="https://bloomyourgut.com/articles/${a.slug}">${a.title}</a></h3>
<p>${a.excerpt ?? ''}</p>`
    )
    .join('\n')

  return `<h2>This Week in Gut Health</h2>\n${items}\n<p><a href="https://bloomyourgut.com/articles">Read all articles</a></p>`
}
