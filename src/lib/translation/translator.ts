import Anthropic from '@anthropic-ai/sdk'

/**
 * Languages supported by the DeepL API (European languages).
 * These get fast, high-quality translations via DeepL.
 */
const DEEPL_LANGUAGES = ['es', 'pt', 'de', 'fr', 'it', 'nl', 'pl', 'ru'] as const

/**
 * Languages that require Claude for translation (Asian, Arabic, etc.).
 * DeepL either doesn't support these or has lower quality.
 */
const CLAUDE_LANGUAGES = ['ja', 'ko', 'zh', 'ar', 'tr', 'id', 'th', 'vi', 'hi'] as const

type DeepLLanguage = (typeof DEEPL_LANGUAGES)[number]
type ClaudeLanguage = (typeof CLAUDE_LANGUAGES)[number]
type SupportedLanguage = DeepLLanguage | ClaudeLanguage

/** Map of language codes to human-readable names for Claude prompts */
const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  pt: 'Portuguese (Brazilian)',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
  tr: 'Turkish',
  id: 'Indonesian',
  th: 'Thai',
  vi: 'Vietnamese',
  hi: 'Hindi',
}

/** Map language codes to DeepL target language codes (which differ from ISO) */
const DEEPL_LANGUAGE_MAP: Record<DeepLLanguage, string> = {
  es: 'ES',
  pt: 'PT-BR',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
  nl: 'NL',
  pl: 'PL',
  ru: 'RU',
}

/**
 * Translate content using the optimal engine for the target language.
 *
 * - DeepL for European languages (faster, cheaper, high quality)
 * - Claude Haiku for Asian/Arabic languages (better quality for these)
 *
 * @param content - The text to translate (English source)
 * @param targetLang - ISO 639-1 language code (e.g., 'es', 'ja')
 * @param type - 'article' preserves markdown; 'meta' is plain text (SEO fields)
 */
export async function translateContent(
  content: string,
  targetLang: string,
  type: 'article' | 'meta'
): Promise<string> {
  if (!content.trim()) {
    return ''
  }

  const lang = targetLang.toLowerCase()

  if (!isSupportedLanguage(lang)) {
    throw new Error(
      `Unsupported language: ${targetLang}. Supported: ${[...DEEPL_LANGUAGES, ...CLAUDE_LANGUAGES].join(', ')}`
    )
  }

  if (isDeepLLanguage(lang)) {
    return translateWithDeepL(content, lang, type)
  }

  return translateWithClaude(content, lang, type)
}

/**
 * Translate using the DeepL API.
 */
async function translateWithDeepL(
  content: string,
  targetLang: DeepLLanguage,
  type: 'article' | 'meta'
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    // Fall back to Claude if DeepL key isn't configured
    return translateWithClaude(content, targetLang, type)
  }

  // Determine DeepL API base URL (free vs pro)
  const baseUrl = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2'
    : 'https://api.deepl.com/v2'

  const formData = new URLSearchParams({
    text: content,
    target_lang: DEEPL_LANGUAGE_MAP[targetLang],
    source_lang: 'EN',
    // Preserve markdown formatting for articles
    ...(type === 'article' ? { tag_handling: 'html' } : {}),
  })

  const response = await fetch(`${baseUrl}/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `DeepL translation failed (${response.status}): ${errorText}`
    )
  }

  const data = await response.json()
  const translated = data?.translations?.[0]?.text

  if (!translated) {
    throw new Error('Empty translation response from DeepL')
  }

  return translated
}

/**
 * Translate using Claude Haiku for languages DeepL doesn't handle well.
 */
async function translateWithClaude(
  content: string,
  targetLang: string,
  type: 'article' | 'meta'
): Promise<string> {
  const anthropic = new Anthropic()
  const languageName = LANGUAGE_NAMES[targetLang] ?? targetLang

  const systemPrompt =
    type === 'article'
      ? `You are a professional medical translator specializing in gut health and digestive health content. Translate the following English text to ${languageName}.

Rules:
- Preserve ALL markdown formatting (headings, bold, lists, links)
- Keep medical terms accurate -- use the standard medical terminology in ${languageName}
- Maintain the same tone: friendly, evidence-based, accessible
- Do NOT add or remove any content
- Do NOT translate brand names, proper nouns, or PMIDs
- Respond with ONLY the translated text, no explanations`
      : `You are a professional translator for SEO content. Translate the following English text to ${languageName}.

Rules:
- This is SEO metadata (title, description, keywords)
- Keep it concise and natural-sounding in ${languageName}
- Optimize for search engines in the target language
- Do NOT add or remove content
- Respond with ONLY the translated text, no explanations`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No translation response received from Claude')
  }

  return textBlock.text
}

// ----- Type guard helpers -----

function isDeepLLanguage(lang: string): lang is DeepLLanguage {
  return (DEEPL_LANGUAGES as readonly string[]).includes(lang)
}

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (
    (DEEPL_LANGUAGES as readonly string[]).includes(lang) ||
    (CLAUDE_LANGUAGES as readonly string[]).includes(lang)
  )
}

/**
 * Get all supported translation languages.
 */
export function getSupportedLanguages(): { code: string; name: string; engine: 'deepl' | 'claude' }[] {
  const languages: { code: string; name: string; engine: 'deepl' | 'claude' }[] = []

  for (const lang of DEEPL_LANGUAGES) {
    languages.push({ code: lang, name: LANGUAGE_NAMES[lang], engine: 'deepl' })
  }
  for (const lang of CLAUDE_LANGUAGES) {
    languages.push({ code: lang, name: LANGUAGE_NAMES[lang], engine: 'claude' })
  }

  return languages
}
