const PUBMED_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

export interface PubMedStudy {
  pmid: string
  title: string
  abstract: string
  authors: string[]
  journal: string
  publishedDate: string
}

/**
 * Default search queries targeting gut health research topics.
 * These are used by the daily cron scanner to find new studies.
 */
export const GUT_HEALTH_QUERIES = [
  'gut microbiome 2024 2025 2026',
  'SIBO treatment',
  'IMO intestinal methanogen',
  'IBS diet intervention',
  'probiotics clinical trial',
  'leaky gut intestinal permeability',
  'gut brain axis',
  'autoimmune gut connection',
  'FODMAP diet outcomes',
  'fecal microbiota transplant',
] as const

/**
 * Search PubMed for study PMIDs matching a query.
 *
 * Uses the E-utilities esearch endpoint.
 * Returns an array of PMID strings.
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 20
): Promise<string[]> {
  const params = new URLSearchParams({
    db: 'pubmed',
    term: query,
    retmax: String(maxResults),
    retmode: 'json',
    sort: 'date',
  })

  // Add API key if available for higher rate limits
  const apiKey = process.env.PUBMED_API_KEY
  if (apiKey) {
    params.set('api_key', apiKey)
  }

  const response = await fetch(`${PUBMED_BASE}/esearch.fcgi?${params}`)

  if (!response.ok) {
    throw new Error(
      `PubMed search failed: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  const idList = data?.esearchresult?.idlist

  if (!Array.isArray(idList)) {
    throw new Error('Unexpected PubMed search response format')
  }

  return idList
}

/**
 * Fetch detailed study information for a list of PMIDs.
 *
 * Uses the E-utilities efetch endpoint with XML parsing.
 * Batches requests to stay within PubMed rate limits.
 */
export async function fetchStudyDetails(
  pmids: string[]
): Promise<PubMedStudy[]> {
  if (pmids.length === 0) return []

  // PubMed recommends batches of 200 max
  const batchSize = 200
  const studies: PubMedStudy[] = []

  for (let i = 0; i < pmids.length; i += batchSize) {
    const batch = pmids.slice(i, i + batchSize)
    const batchStudies = await fetchBatch(batch)
    studies.push(...batchStudies)

    // Respect rate limits: 3 requests/second without API key, 10/sec with
    if (i + batchSize < pmids.length) {
      await sleep(process.env.PUBMED_API_KEY ? 100 : 350)
    }
  }

  return studies
}

async function fetchBatch(pmids: string[]): Promise<PubMedStudy[]> {
  const params = new URLSearchParams({
    db: 'pubmed',
    id: pmids.join(','),
    retmode: 'xml',
    rettype: 'abstract',
  })

  const apiKey = process.env.PUBMED_API_KEY
  if (apiKey) {
    params.set('api_key', apiKey)
  }

  const response = await fetch(`${PUBMED_BASE}/efetch.fcgi?${params}`)

  if (!response.ok) {
    throw new Error(
      `PubMed fetch failed: ${response.status} ${response.statusText}`
    )
  }

  const xml = await response.text()
  return parseArticleXml(xml)
}

/**
 * Parse PubMed XML response into structured study objects.
 *
 * Uses string-based XML parsing to avoid requiring an XML library.
 * This is intentionally simple -- PubMed XML is well-structured.
 */
function parseArticleXml(xml: string): PubMedStudy[] {
  const studies: PubMedStudy[] = []

  // Split into individual article blocks
  const articleBlocks = xml.split('<PubmedArticle>')

  for (const block of articleBlocks) {
    if (!block.includes('</PubmedArticle>')) continue

    const pmid = extractTag(block, 'PMID')
    const title = extractTag(block, 'ArticleTitle')

    if (!pmid || !title) continue

    // Extract abstract text (may have multiple AbstractText elements)
    const abstractParts: string[] = []
    const abstractMatches = block.matchAll(
      /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g
    )
    for (const match of abstractMatches) {
      abstractParts.push(stripTags(match[1]))
    }

    // Extract authors
    const authors: string[] = []
    const authorMatches = block.matchAll(
      /<Author[^>]*>[\s\S]*?<LastName>(.*?)<\/LastName>[\s\S]*?<ForeName>(.*?)<\/ForeName>[\s\S]*?<\/Author>/g
    )
    for (const match of authorMatches) {
      authors.push(`${match[2]} ${match[1]}`)
    }

    // Extract journal
    const journal = extractTag(block, 'Title') ?? extractTag(block, 'ISOAbbreviation') ?? ''

    // Extract publication date
    const year = extractTag(block, 'Year') ?? ''
    const month = extractTag(block, 'Month') ?? '01'
    const day = extractTag(block, 'Day') ?? '01'
    const publishedDate = year ? `${year}-${padDate(month)}-${padDate(day)}` : ''

    studies.push({
      pmid,
      title: stripTags(title),
      abstract: abstractParts.join(' '),
      authors,
      journal,
      publishedDate,
    })
  }

  return studies
}

/**
 * Score the relevance of a study to gut health topics (0-10).
 *
 * Uses keyword matching and heuristics. Studies with higher scores
 * are prioritized for article generation.
 */
export function scoreRelevance(study: PubMedStudy): number {
  const text = `${study.title} ${study.abstract}`.toLowerCase()
  let score = 0

  // High-value keywords (direct gut health relevance)
  const highValueKeywords = [
    'microbiome', 'microbiota', 'gut', 'intestinal', 'sibo',
    'ibs', 'irritable bowel', 'fodmap', 'probiotic', 'prebiotic',
    'dysbiosis', 'permeability', 'leaky gut', 'fecal transplant',
    'fmt', 'methanogen', 'imo',
  ]

  // Medium-value keywords (related topics)
  const mediumValueKeywords = [
    'digestion', 'digestive', 'colon', 'colonic', 'gastro',
    'inflammation', 'inflammatory bowel', 'crohn', 'celiac',
    'gluten', 'ferment', 'short-chain fatty acid', 'scfa',
    'butyrate', 'gut-brain', 'enteric',
  ]

  // Low-value keywords (tangentially related)
  const lowValueKeywords = [
    'diet', 'nutrition', 'fiber', 'immune', 'autoimmune',
    'anxiety', 'depression', 'stress', 'sleep',
  ]

  for (const keyword of highValueKeywords) {
    if (text.includes(keyword)) score += 1.5
  }
  for (const keyword of mediumValueKeywords) {
    if (text.includes(keyword)) score += 0.8
  }
  for (const keyword of lowValueKeywords) {
    if (text.includes(keyword)) score += 0.3
  }

  // Bonus for human studies
  if (text.includes('clinical trial') || text.includes('randomized')) {
    score += 1.0
  }
  if (text.includes('human') || text.includes('patient')) {
    score += 0.5
  }

  // Penalty for animal-only studies
  if (
    (text.includes('mouse') || text.includes('mice') || text.includes('rat')) &&
    !text.includes('human') &&
    !text.includes('patient')
  ) {
    score -= 1.0
  }

  // Penalty for studies with no abstract
  if (!study.abstract || study.abstract.length < 50) {
    score -= 2.0
  }

  return Math.min(10, Math.max(0, Math.round(score * 10) / 10))
}

// ----- Utility helpers -----

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 's')
  const match = xml.match(regex)
  return match?.[1]?.trim() ?? null
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim()
}

function padDate(value: string): string {
  const num = parseInt(value, 10)
  if (Number.isNaN(num)) return '01'
  return String(num).padStart(2, '0')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
