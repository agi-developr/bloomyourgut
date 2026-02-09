import Anthropic from '@anthropic-ai/sdk'
import { CONTENT_GENERATOR_PROMPT } from './prompts'

const anthropic = new Anthropic()

export interface GeneratedArticle {
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string[]
  reading_time_minutes: number
  sections: { heading: string; content: string }[]
  faq: { question: string; answer: string }[]
  citations: string[]
}

interface PubMedStudyInput {
  title: string
  abstract: string | null
  pmid: string
}

interface RawArticleResponse {
  title: string
  excerpt: string
  category: string
  tags: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string[]
  sections: { heading: string; content: string }[]
  faq: { question: string; answer: string }[]
  citations: string[]
}

/**
 * Generate a slug from an article title.
 * Strips non-alphanumeric characters, lowercases, and joins with hyphens.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

/**
 * Estimate reading time based on word count.
 * Average adult reads ~238 words per minute.
 */
function calculateReadingTime(sections: { content: string }[]): number {
  const totalWords = sections.reduce((count, section) => {
    return count + section.content.split(/\s+/).length
  }, 0)

  return Math.max(1, Math.ceil(totalWords / 238))
}

/**
 * Combine article sections into a single markdown content string.
 */
function sectionsToMarkdown(sections: { heading: string; content: string }[]): string {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.content}`)
    .join('\n\n')
}

/**
 * Generate a gut health article from a PubMed study using Claude.
 *
 * Uses claude-sonnet-4-5-20250929 with low temperature for factual accuracy.
 * Returns a structured article ready for database insertion.
 */
export async function generateArticle(
  study: PubMedStudyInput
): Promise<GeneratedArticle> {
  const userPrompt = `Please write an article based on this PubMed study:

**Title:** ${study.title}

**Abstract:** ${study.abstract ?? 'No abstract available.'}

**PMID:** ${study.pmid}

Respond with valid JSON only. No markdown code fences.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0.3,
    system: CONTENT_GENERATOR_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response received from Claude')
  }

  let parsed: RawArticleResponse
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    // Attempt to extract JSON from markdown code fences
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch?.[1]) {
      parsed = JSON.parse(jsonMatch[1])
    } else {
      throw new Error(
        `Failed to parse article JSON from Claude response: ${textBlock.text.slice(0, 200)}`
      )
    }
  }

  // Validate required fields
  if (!parsed.title || !parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Generated article is missing required fields (title, sections)')
  }

  if (!parsed.faq || parsed.faq.length < 3) {
    throw new Error('Generated article must include at least 3 FAQ entries')
  }

  const slug = generateSlug(parsed.title)
  const content = sectionsToMarkdown(parsed.sections)
  const readingTime = calculateReadingTime(parsed.sections)

  return {
    title: parsed.title,
    slug,
    content,
    excerpt: parsed.excerpt,
    category: parsed.category ?? 'Gut Health',
    tags: parsed.tags ?? [],
    seo_title: parsed.seo_title,
    seo_description: parsed.seo_description,
    seo_keywords: parsed.seo_keywords ?? [],
    reading_time_minutes: readingTime,
    sections: parsed.sections,
    faq: parsed.faq,
    citations: parsed.citations ?? [],
  }
}
