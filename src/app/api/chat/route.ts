import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { CHAT_ASSISTANT_PROMPT } from '@/lib/ai/prompts'

interface ChatRequestMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatRequestMessage[]
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user via Supabase
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate messages from request body
    let body: ChatRequestBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: 'Each message must have a role and content' },
          { status: 400 }
        )
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'Message role must be "user" or "assistant"' },
          { status: 400 }
        )
      }
    }

    // 3. Fetch user context for personalization (parallel queries)
    const [profileResult, symptomsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('conditions, goals')
        .eq('id', user.id)
        .single(),
      supabase
        .from('symptom_logs')
        .select('date, bloating, pain, energy, stool_type, gas, mood, notes')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7),
    ])

    const profile = profileResult.data
    const recentSymptoms = symptomsResult.data

    // 4. Build enriched system prompt with user context
    const contextParts: string[] = []

    if (profile?.conditions?.length) {
      contextParts.push(
        `- Conditions: ${profile.conditions.join(', ')}`
      )
    } else {
      contextParts.push('- Conditions: Not specified')
    }

    if (profile?.goals?.length) {
      contextParts.push(`- Goals: ${profile.goals.join(', ')}`)
    } else {
      contextParts.push('- Goals: Not specified')
    }

    if (recentSymptoms?.length) {
      contextParts.push(
        `- Recent Symptoms (last 7 days): ${JSON.stringify(recentSymptoms)}`
      )
    } else {
      contextParts.push('- Recent Symptoms: No data available')
    }

    const systemPrompt = `${CHAT_ASSISTANT_PROMPT}

User Context:
${contextParts.join('\n')}`

    // 5. Call Claude Haiku with user context
    const anthropic = new Anthropic()

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      temperature: 0.5,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 502 }
      )
    }

    return NextResponse.json({ message: textBlock.text })
  } catch (error) {
    console.error('[API /chat] Error:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
