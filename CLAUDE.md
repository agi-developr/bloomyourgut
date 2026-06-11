# BloomYourGut — AI Gut Health Companion

## Stack
- **Framework:** Next.js 16.1.6 (App Router, SSR/SSG)
- **Frontend:** React 19 + Tailwind CSS 4 + shadcn/ui + Radix UI
- **Database:** Supabase PostgreSQL (13 tables, RLS enabled)
- **Payments:** Stripe SDK v20.3.1 (API `2026-01-28.clover`)
- **AI:** Anthropic SDK — Haiku (chat), Opus (content generation)
- **Translation:** DeepL (European) + Claude (Asian/Arabic)
- **Research:** PubMed API (study discovery)
- **Analytics:** Vercel Analytics, PostHog
- **Deployment:** Vercel (primary)

## Key Directories
```
src/app/           — Next.js App Router (pages + API routes)
src/app/api/       — REST API + 13 cron jobs
src/app/dashboard/ — Protected user area (symptoms, food, supplements, protocols, gutscore)
src/app/articles/  — Blog/content (auto-generated from PubMed)
src/app/chat/      — AI gut health assistant
src/components/    — UI components (shadcn/ui primitives + features)
src/lib/ai/        — AI pipeline (chat, content-generator, quality-checker, prompts)
src/lib/supabase/  — DB clients (admin, client, server)
src/lib/pubmed/    — PubMed API scanner
src/lib/translation/ — DeepL/Claude translation
supabase/migrations/ — 3 SQL migrations
```

## Cron Jobs (13, defined in vercel.json)
pubmed-scanner (6am), content-generator (8am), quality-checker (10am), translator (noon), seo-optimizer (2pm), publisher (4pm), gutscore-calculator (midnight), analytics-reporter (12:30am), email-digest (Mon 9am), email-sender (Mon 10am), correlation-engine (Sun midnight), affiliate-checker (Fri noon), outcomes-aggregator (Sat midnight)

## Deployment
```bash
npm run build  # Next.js build
# Auto-deploys via Vercel on push to main
```
- Git remote: https://github.com/agi-developr/bloomyourgut.git
- Domain: bloomyourgut.com

## Environment Variables
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` (live), `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live), `ANTHROPIC_API_KEY`, `DEEPL_API_KEY`, `PUBMED_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY`, `CONVERTKIT_API_KEY`

## Critical Gotchas
- **Stripe v20:** `current_period_end` on `SubscriptionItem`, not Subscription root
- **Stripe keys are LIVE** (pk_live_, sk_live_) — not test
- **Next.js 16:** Route handlers use `params: Promise<>` pattern
- **Next.js 16:** Middleware deprecated in favor of proxy
- **Cron auth:** Bearer token via `CRON_SECRET` env var, all cron endpoints are GET
- **AI models:** Haiku for chat (cheap/fast), Opus for content generation (quality)

## Monetization
- **Free:** 3 articles/month, basic GutScore
- **Bloom:** $7-29/mo (PPP), unlimited articles, AI assistant
- **Pro:** $29-499/mo (PPP), meal plans, lab interpretation
- **Consultations:** $149-599 (PPP)
- PPP pricing for 6 countries: US, IN, BR, NG, ID, KE

## Health Domain Context
Focus: SIBO, IBS, leaky gut, autoimmune gut conditions, microbiome optimization, gut-brain axis. All content must include medical disclaimers and evidence-based citations.

## Database Tables
studies, articles, article_translations, affiliate_products, profiles, symptom_logs, food_logs, supplement_logs, gut_scores, protocols, subscriptions, consultations, correlations
