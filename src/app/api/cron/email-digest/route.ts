import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Article } from '@/types/database'

/**
 * Generate an HTML email template for the weekly digest.
 */
function generateDigestHtml(articles: Article[], weekDate: string): string {
  const articleRows = articles
    .map(
      (article) => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #1a1a2e;">
          <a href="https://bloomyourgut.com/articles/${article.slug}"
             style="color: #16a34a; text-decoration: none;">
            ${escapeHtml(article.title)}
          </a>
        </h2>
        <p style="margin: 0 0 8px; color: #4b5563; font-size: 14px; line-height: 1.5;">
          ${escapeHtml(article.excerpt ?? article.content.substring(0, 200) + '...')}
        </p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          ${article.reading_time_minutes ? `${article.reading_time_minutes} min read` : ''}
          ${article.category ? `&middot; ${escapeHtml(article.category)}` : ''}
        </p>
      </td>
    </tr>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BloomYourGut Weekly Digest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 20px; text-align: center; background-color: #16a34a;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px;">BloomYourGut</h1>
        <p style="margin: 8px 0 0; color: #dcfce7; font-size: 14px;">Weekly Gut Health Digest &middot; ${escapeHtml(weekDate)}</p>
      </td>
    </tr>

    <!-- Intro -->
    <tr>
      <td style="padding: 20px; background-color: #ffffff;">
        <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
          Here are the latest evidence-based gut health articles from this week.
          Each article is backed by peer-reviewed research.
        </p>
      </td>
    </tr>

    <!-- Articles -->
    <tr>
      <td style="padding: 0 20px; background-color: #ffffff;">
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          ${articleRows || '<tr><td style="padding: 20px 0; color: #9ca3af;">No new articles this week.</td></tr>'}
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
        <a href="https://bloomyourgut.com/articles"
           style="display: inline-block; padding: 12px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
          Read All Articles
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          You are receiving this because you subscribed to BloomYourGut.
          <br>
          <a href="https://bloomyourgut.com/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch articles published in the last 7 days
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .gte('published_at', sevenDaysAgo)
      .order('published_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch recent articles', details: fetchError.message },
        { status: 500 }
      )
    }

    const weekDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Generate the HTML email digest
    const digestHtml = generateDigestHtml((articles ?? []) as Article[], weekDate)

    return NextResponse.json({
      success: true,
      articles_count: articles?.length ?? 0,
      week_of: weekDate,
      digest_html: digestHtml,
      digest_size_bytes: new TextEncoder().encode(digestHtml).length,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Email digest generation failed', details: message },
      { status: 500 }
    )
  }
}
