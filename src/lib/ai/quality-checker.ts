import Anthropic from '@anthropic-ai/sdk'
import { QUALITY_CHECKER_PROMPT } from './prompts'

const anthropic = new Anthropic()

export interface QualityResult {
  /** Overall quality score 0-10 */
  score: number
  /** Accuracy of claims vs cited research 0-10 */
  accuracy: number
  /** Readability for general audience 0-10 */
  readability: number
  /** Whether medical claims are safely hedged */
  medical_claims_safe: boolean
  /** Specific issues found */
  issues: string[]
  /** Improvement suggestions */
  suggestions: string[]
}

interface ArticleInput {
  title: string
  content: string
  citations: string[]
}

/**
 * Check the quality of a generated gut health article.
 *
 * Evaluates accuracy, readability, and medical claim safety.
 * Articles scoring below 7 should be revised before publishing.
 * Articles with medical_claims_safe === false must NOT be published.
 */
export async function checkArticleQuality(
  article: ArticleInput
): Promise<QualityResult> {
  const userPrompt = `Please evaluate this gut health article:

**Title:** ${article.title}

**Content:**
${article.content}

**Citations:**
${article.citations.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Respond with valid JSON only. No markdown code fences.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    temperature: 0.1,
    system: QUALITY_CHECKER_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response received from quality checker')
  }

  let parsed: QualityResult
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch?.[1]) {
      parsed = JSON.parse(jsonMatch[1])
    } else {
      throw new Error(
        `Failed to parse quality check JSON: ${textBlock.text.slice(0, 200)}`
      )
    }
  }

  // Validate and clamp scores to valid ranges
  return {
    score: clampScore(parsed.score),
    accuracy: clampScore(parsed.accuracy),
    readability: clampScore(parsed.readability),
    medical_claims_safe: Boolean(parsed.medical_claims_safe),
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
  }
}

function clampScore(value: unknown): number {
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  return Math.min(10, Math.max(0, num))
}

/**
 * Check if an article passes the minimum quality threshold for publishing.
 */
export function isPublishReady(result: QualityResult): boolean {
  return (
    result.score >= 7 &&
    result.accuracy >= 7 &&
    result.medical_claims_safe &&
    result.issues.length <= 2
  )
}
