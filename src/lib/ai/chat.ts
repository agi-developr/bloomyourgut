import Anthropic from '@anthropic-ai/sdk'
import { CHAT_ASSISTANT_PROMPT } from './prompts'

const anthropic = new Anthropic()

interface UserContext {
  conditions?: string[]
  symptoms?: {
    recent: { date: string; type: string; severity: number }[]
  }
  gutScore?: number
  foodLog?: { date: string; foods: string[] }[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Chat with the Bloom AI gut health assistant.
 *
 * Uses claude-haiku-4-5-20251001 for fast, cost-effective responses.
 * Optionally includes user symptom/food data as context for
 * personalized responses.
 */
export async function chat(
  messages: ChatMessage[],
  userContext?: UserContext
): Promise<string> {
  let systemPrompt = CHAT_ASSISTANT_PROMPT

  // Enrich the system prompt with user-specific context
  if (userContext) {
    const contextParts: string[] = ['\n\n## User Context']

    if (userContext.conditions?.length) {
      contextParts.push(
        `**Known conditions:** ${userContext.conditions.join(', ')}`
      )
    }

    if (userContext.gutScore !== undefined) {
      contextParts.push(`**Current GutScore:** ${userContext.gutScore}/100`)
    }

    if (userContext.symptoms?.recent?.length) {
      const recentSymptoms = userContext.symptoms.recent
        .slice(0, 10)
        .map(
          (s) =>
            `- ${s.date}: ${s.type} (severity ${s.severity}/10)`
        )
        .join('\n')
      contextParts.push(`**Recent symptoms:**\n${recentSymptoms}`)
    }

    if (userContext.foodLog?.length) {
      const recentFoods = userContext.foodLog
        .slice(0, 7)
        .map((f) => `- ${f.date}: ${f.foods.join(', ')}`)
        .join('\n')
      contextParts.push(`**Recent food log:**\n${recentFoods}`)
    }

    systemPrompt += contextParts.join('\n')
  }

  // Validate messages array
  if (!messages.length) {
    throw new Error('Messages array cannot be empty')
  }

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    temperature: 0.5,
    system: systemPrompt,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response received from chat assistant')
  }

  return textBlock.text
}
