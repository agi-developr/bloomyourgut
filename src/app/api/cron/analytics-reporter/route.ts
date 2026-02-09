import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

    // Run all queries in parallel for performance
    const [
      articlesResult,
      publishedArticlesResult,
      profilesResult,
      newSignupsResult,
      activeSubsResult,
      studiesResult,
      symptomLogsResult,
    ] = await Promise.all([
      // Total articles count
      supabase.from('articles').select('id', { count: 'exact', head: true }),

      // Published articles count
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),

      // Total users count
      supabase.from('profiles').select('id', { count: 'exact', head: true }),

      // New signups today
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart),

      // Active subscriptions grouped by tier
      supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('status', 'active'),

      // Total studies in pipeline
      supabase.from('studies').select('id, status'),

      // Symptom logs today (engagement metric)
      supabase
        .from('symptom_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart),
    ])

    // Calculate subscription tier breakdown
    const subscriptionsByTier: Record<string, number> = { free: 0, bloom: 0, pro: 0 }
    if (activeSubsResult.data) {
      for (const sub of activeSubsResult.data) {
        subscriptionsByTier[sub.tier] = (subscriptionsByTier[sub.tier] || 0) + 1
      }
    }

    // Calculate study pipeline breakdown
    const studiesByStatus: Record<string, number> = {}
    if (studiesResult.data) {
      for (const study of studiesResult.data) {
        studiesByStatus[study.status] = (studiesByStatus[study.status] || 0) + 1
      }
    }

    const metrics = {
      content: {
        total_articles: articlesResult.count ?? 0,
        published_articles: publishedArticlesResult.count ?? 0,
        studies_pipeline: studiesByStatus,
      },
      users: {
        total_users: profilesResult.count ?? 0,
        new_signups_today: newSignupsResult.count ?? 0,
        symptom_logs_today: symptomLogsResult.count ?? 0,
      },
      subscriptions: {
        active_by_tier: subscriptionsByTier,
        total_active: Object.values(subscriptionsByTier).reduce((a, b) => a + b, 0),
      },
      generated_at: now.toISOString(),
    }

    // Log metrics for monitoring (in production, this would push to Slack/dashboard)
    console.log('[Analytics Report]', JSON.stringify(metrics, null, 2))

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Analytics reporter failed', details: message },
      { status: 500 }
    )
  }
}
