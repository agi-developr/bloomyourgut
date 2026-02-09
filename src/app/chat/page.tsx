"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

const systemMessage: Message = {
  id: "system-1",
  role: "system",
  content:
    "I'm your AI gut health assistant. Ask me anything about gut health, your symptoms, or treatment options. Note: I provide educational information only, not medical advice.",
  timestamp: new Date(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([systemMessage])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // TODO: Check actual subscription status
  const isSubscribed = false

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // TODO: Call /api/chat endpoint
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getPlaceholderResponse(userMessage.content),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, I encountered an error. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-4 sm:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Bot className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              AI Gut Assistant
            </h1>
            <p className="text-xs text-gray-500">
              Evidence-based gut health guidance
            </p>
          </div>
        </div>
        {!isSubscribed && (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700">
            <Lock className="mr-1 h-3 w-3" />
            Bloom+ Required
          </Badge>
        )}
      </div>

      {/* Subscription notice for free users */}
      {!isSubscribed && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="flex items-center justify-between py-3">
            <p className="text-sm text-amber-700">
              The AI assistant is available on Bloom and Pro plans. You can
              preview it with 3 free messages.
            </p>
            <Button
              size="sm"
              asChild
              className="ml-4 shrink-0 bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role !== "user" && (
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "system"
                      ? "bg-blue-100"
                      : "bg-green-100"
                  }`}
                >
                  <Bot
                    className={`h-4 w-4 ${
                      message.role === "system"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : message.role === "system"
                      ? "border border-blue-200 bg-blue-50 text-blue-800"
                      : "bg-white text-gray-700 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
              <div className="rounded-lg bg-white px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about gut health, symptoms, or treatments..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Disclaimer */}
      <p className="mt-2 text-center text-[10px] text-gray-400">
        This AI assistant provides educational information only, not medical
        advice. Always consult a healthcare professional.
      </p>
    </div>
  )
}

function getPlaceholderResponse(userInput: string): string {
  const lower = userInput.toLowerCase()

  if (lower.includes("sibo")) {
    return "SIBO (Small Intestinal Bacterial Overgrowth) is a condition where bacteria normally found in the large intestine migrate to the small intestine. Common symptoms include bloating, gas, and abdominal pain.\n\nThe gold standard test is the lactulose or glucose breath test. Treatment typically involves antibiotics (rifaximin is most studied) or herbal antimicrobials (berberine, oregano oil, allicin).\n\nWould you like to know more about SIBO testing, treatment protocols, or dietary approaches?"
  }

  if (lower.includes("probiotic")) {
    return "Probiotics can be helpful for gut health, but the research shows that specific strains matter more than CFU count. Here are some evidence-based recommendations:\n\n- Lactobacillus rhamnosus GG: Well-studied for IBS and antibiotic-associated diarrhea\n- Saccharomyces boulardii: A beneficial yeast, helpful for diarrhea prevention\n- VSL#3: A multi-strain blend studied for IBD\n\nImportant: If you have SIBO, probiotics may need to be introduced carefully after treatment. Would you like strain-specific recommendations for your condition?"
  }

  if (lower.includes("bloat")) {
    return "Bloating is one of the most common gut symptoms and can have multiple causes:\n\n1. **Food triggers**: Common culprits include FODMAPs, dairy, gluten, and high-fiber foods\n2. **SIBO**: Bacterial overgrowth in the small intestine\n3. **Low stomach acid**: Incomplete digestion leading to fermentation\n4. **Motility issues**: Slow transit time\n5. **Stress**: The gut-brain connection is strong\n\nTracking your food and symptoms can help identify patterns. Have you tried logging your meals in the food diary to identify triggers?"
  }

  return "That's a great question about gut health! Based on current research, I'd recommend:\n\n1. **Track your symptoms** consistently using the symptom tracker - patterns become visible after 2-3 weeks of data\n2. **Consider your diet** - a diverse plant-based diet supports microbiome health\n3. **Manage stress** - the gut-brain axis plays a major role in digestive health\n\nWould you like me to go deeper into any of these areas? You can also check our articles section for detailed, research-backed information on specific topics."
}
