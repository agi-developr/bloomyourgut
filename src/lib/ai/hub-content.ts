import Anthropic from '@anthropic-ai/sdk'
import type { HubPage } from '@/data/hub-pages'

/**
 * AI overview generation for programmatic SEO hub pages.
 *
 * The hub routes render a deterministic, templated overview at build time so
 * `next build` never makes a network call (see `renderOverviewHtml`). This
 * module is the *enrichment* path: a cron job or script can call
 * `generateHubOverview` to produce a richer, unique Claude-written overview and
 * persist it (e.g. into a `hub_overviews` table) for the route to prefer.
 *
 * Uses Sonnet with low temperature for factual, on-brand medical content,
 * matching the convention in `content-generator.ts`.
 */

const anthropic = new Anthropic()

const HUB_OVERVIEW_SYSTEM = `You are a medical content writer for BloomYourGut, an evidence-based gut-health site.
Write a clear, accurate, encouraging overview for a hub page about a gut-health topic.
Rules:
- 250-400 words, written for an educated patient (not a clinician).
- Use simple HTML only: <p>, <h2>, <ul>, <li>, <strong>. No <html>/<head>/<body>.
- Evidence-based and balanced. Never promise cures. Encourage seeing a clinician for red flags.
- Weave in the provided key points; do not invent statistics beyond them.
- Warm, practical, second-person voice. No markdown code fences. Return HTML only.`

/**
 * Generate an AI overview (HTML) for a single hub page.
 * Intended for offline/cron enrichment, NOT for per-request build rendering.
 */
export async function generateHubOverview(page: HubPage): Promise<string> {
  const userPrompt = `Topic: ${page.name} (${page.category})
Summary: ${page.summary}
Key points:
${page.keyPoints.map((k) => `- ${k}`).join('\n')}

Write the overview HTML now.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1200,
    temperature: 0.4,
    system: HUB_OVERVIEW_SYSTEM,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response received from Claude')
  }

  // Strip accidental code fences if present.
  return textBlock.text.replace(/```(?:html)?/g, '').trim()
}

/**
 * Deterministic, build-safe overview HTML rendered from structured seed data.
 * This is what the routes use at build time — no network, always available.
 */
export function renderOverviewHtml(page: HubPage): string {
  const intro = `<p>${escapeHtml(page.summary)}</p>`
  const akaLine =
    page.aka.length > 0
      ? `<p><strong>Also known as:</strong> ${page.aka.map(escapeHtml).join(', ')}.</p>`
      : ''

  const heading =
    page.category === 'foods'
      ? `<h2>Why ${escapeHtml(page.name)} matters for your gut</h2>`
      : `<h2>What you need to know about ${escapeHtml(page.name)}</h2>`

  const points = `<ul>${page.keyPoints
    .map((k) => `<li>${escapeHtml(k)}</li>`)
    .join('')}</ul>`

  const closing =
    page.category === 'foods'
      ? `<p>Like any gut-support strategy, ${escapeHtml(
          page.name
        )} works best as part of a broader, personalized approach. Introduce it gradually, pay attention to how your body responds, and pair it with the related foods and protocols below.</p>`
      : `<p>Understanding ${escapeHtml(
          page.name
        )} is the first step toward relief. Explore the related conditions, symptoms, and gut-supportive foods below, and work with a qualified healthcare provider to build a plan that addresses the root cause — not just the symptoms.</p>`

  return `${intro}${akaLine}${heading}${points}${closing}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
