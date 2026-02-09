import { z } from 'zod'

/**
 * Environment variable validation schema.
 *
 * Validates all required env vars at startup to fail fast
 * rather than discovering missing config at runtime.
 *
 * Usage: import { env } from '@/lib/env' -- this triggers validation.
 * If any required variable is missing or invalid, the process will
 * throw with a descriptive error message.
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Stripe secret key must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'Stripe webhook secret must start with whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Stripe publishable key must start with pk_'),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-', 'Anthropic API key must start with sk-ant-'),

  // DeepL (optional -- falls back to Claude for translations)
  DEEPL_API_KEY: z.string().optional(),

  // PubMed (optional -- increases rate limits from 3/sec to 10/sec)
  PUBMED_API_KEY: z.string().optional(),

  // Cron security
  CRON_SECRET: z.string().min(16, 'CRON_SECRET must be at least 16 characters'),

  // Site URL
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://bloomyourgut.com'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validated environment variables.
 *
 * This will throw a ZodError at import time if any required
 * environment variables are missing or invalid.
 *
 * For development, create a .env.local file with all required values.
 * For production, set these in your Vercel project settings.
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    throw new Error(
      `Invalid environment variables:\n${formatted}\n\nCheck your .env.local file or Vercel environment settings.`
    )
  }

  return result.data
}

let _env: Env | null = null

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv()
  }
  return _env
}
