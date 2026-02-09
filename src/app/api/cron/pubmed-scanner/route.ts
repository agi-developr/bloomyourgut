// @ts-nocheck
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { searchPubMed, fetchStudyDetails } from '@/lib/pubmed/scanner'
import type { StudyInsert } from '@/types/database'

const SEARCH_QUERIES = [
  'gut microbiome',
  'SIBO treatment',
  'IBS diet',
  'probiotics clinical trial',
  'intestinal permeability',
  'gut brain axis',
]

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    let totalNewStudies = 0
    const errors: string[] = []

    for (const query of SEARCH_QUERIES) {
      try {
        // Search PubMed for recent studies matching this query
        const pmids = await searchPubMed(query)

        if (pmids.length === 0) continue

        // Check which PMIDs already exist in our database
        const { data: existingStudies, error: fetchError } = await supabase
          .from('studies')
          .select('pmid')
          .in('pmid', pmids)

        if (fetchError) {
          errors.push(`Failed to check existing studies for "${query}": ${fetchError.message}`)
          continue
        }

        const existingPmids = new Set(existingStudies?.map((s) => s.pmid) ?? [])
        const newPmids = pmids.filter((pmid: string) => !existingPmids.has(pmid))

        if (newPmids.length === 0) continue

        // Fetch full details for new studies
        const studyDetails = await fetchStudyDetails(newPmids)

        // Insert new studies with status 'new'
        const studiesToInsert: StudyInsert[] = studyDetails.map(
          (study: { pmid: string; title: string; abstract: string; authors: string[]; journal: string; published_date: string; topics: string[] }) => ({
            pmid: study.pmid,
            title: study.title,
            abstract: study.abstract,
            authors: study.authors,
            journal: study.journal,
            published_date: study.published_date,
            topics: study.topics,
            status: 'new' as const,
          })
        )

        const { data: inserted, error: insertError } = await supabase
          .from('studies')
          .insert(studiesToInsert)
          .select('id')

        if (insertError) {
          errors.push(`Failed to insert studies for "${query}": ${insertError.message}`)
          continue
        }

        totalNewStudies += inserted?.length ?? 0
      } catch (queryError) {
        const message = queryError instanceof Error ? queryError.message : String(queryError)
        errors.push(`Error processing query "${query}": ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      new_studies: totalNewStudies,
      queries_processed: SEARCH_QUERIES.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'PubMed scanner failed', details: message },
      { status: 500 }
    )
  }
}
