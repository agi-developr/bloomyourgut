"use client"

import { useState } from "react"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface EmailCaptureProps {
  variant?: "default" | "compact"
  className?: string
}

export function EmailCapture({ variant = "default", className = "" }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    try {
      const res = await fetch("/api/email-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to subscribe")
      }

      setSubmitted(true)
      toast.success("Subscribed!", {
        description: "You're on the list. Check your inbox to confirm.",
      })
    } catch (err) {
      toast.error("Something went wrong", {
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-green-700">
          <Mail className="h-4 w-4" />
          <span className="text-sm font-medium">
            You&apos;re in! Check your inbox to confirm.
          </span>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-xs"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    )
  }

  return (
    <div className={className}>
      <div className="mx-auto max-w-md text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <Mail className="h-3.5 w-3.5" />
          Free: 7 Gut Tests Your Doctor Won&apos;t Order
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Get Our Weekly Research Digest
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Join 10,000+ gut health enthusiasts. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
