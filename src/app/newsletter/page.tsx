"use client"

import { useState } from "react"
import {
  Mail,
  BookOpen,
  Sparkles,
  Bell,
  Gift,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const benefits = [
  {
    icon: BookOpen,
    title: "Weekly Research Digest",
    description:
      "A curated summary of the most important gut health studies published that week, translated into plain language.",
  },
  {
    icon: Bell,
    title: "New Article Alerts",
    description:
      "Be the first to know when we publish new evidence-based articles on topics that matter to your gut health.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Gut Health Tips",
    description:
      "Practical, research-backed tips you won't find on our blog. Delivered straight to your inbox.",
  },
  {
    icon: Gift,
    title: "Early Access to Features",
    description:
      "Get first access to new platform features, tools, and beta programs before they launch publicly.",
  },
  {
    icon: Mail,
    title: "Monthly State of Gut Science",
    description:
      "A deep-dive monthly report covering emerging trends, breakthrough studies, and shifting consensus in microbiome research.",
  },
]

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setSubmitted(true)
    toast.success("You're subscribed!", {
      description:
        "Check your inbox for a confirmation email and your free guide.",
    })
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 border-green-200 bg-green-100 text-green-700"
          >
            <Mail className="mr-1 h-3 w-3" />
            Free Newsletter
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">
            Science-Backed Gut Health, Delivered Weekly
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Join 10,000+ gut health enthusiasts who get our curated research
            digest every week. No hype, no miracle cures — just evidence-based
            insights you can actually use.
          </p>
        </div>
      </section>

      {/* Lead Magnet + Signup */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Lead Magnet */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-100 p-3">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <Badge
                  variant="secondary"
                  className="mb-3 border-green-200 bg-white text-green-700"
                >
                  Free Guide
                </Badge>
                <h2 className="text-xl font-bold text-gray-900">
                  7 Gut Tests Your Doctor Won&apos;t Order
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Most doctors run basic panels that miss critical gut health
                  markers. This guide covers:
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Comprehensive stool analysis (GI-MAP)",
                    "Organic acids test (OAT)",
                    "Lactulose breath test for SIBO",
                    "Zonulin for intestinal permeability",
                    "Secretory IgA for gut immunity",
                    "Short-chain fatty acid profiles",
                    "Food sensitivity panels (MRT/LEAP)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-gray-500">
                  Delivered instantly to your inbox when you subscribe.
                </p>
              </CardContent>
            </Card>

            {/* Signup Form */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Subscribe for Free
              </h2>
              <p className="mt-2 text-gray-500">
                Get the weekly digest plus your free guide. Unsubscribe anytime
                with one click.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-lg bg-green-50 p-6 text-center">
                  <div className="mb-3 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    You&apos;re in!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check your inbox to confirm your subscription and download
                    your free guide.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-email">Email address</Label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    Get the Free Guide + Newsletter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-center text-xs text-gray-400">
                    No spam. Unsubscribe anytime. We respect your inbox.
                  </p>
                </form>
              )}

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "bg-green-200",
                    "bg-emerald-200",
                    "bg-teal-200",
                    "bg-green-300",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 border-white ${color}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">10,000+</span>{" "}
                  gut health enthusiasts already subscribed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            What Subscribers Get
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Every issue is packed with actionable, research-backed content you
            can use immediately.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3">
                    <benefit.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample issue teaser */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            What a Typical Issue Looks Like
          </h2>
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail className="h-3.5 w-3.5" />
                  BloomYourGut Weekly Digest - Issue #47
                </div>
                <div className="space-y-3 border-l-2 border-green-200 pl-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      This Week in Gut Science
                    </p>
                    <p className="text-gray-500">
                      New meta-analysis on Lactobacillus rhamnosus GG for IBS,
                      plus updated FODMAP research from Monash University.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Practical Tip
                    </p>
                    <p className="text-gray-500">
                      How to read a probiotic label: CFU count, strain
                      specificity, and storage requirements explained.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Myth vs. Evidence
                    </p>
                    <p className="text-gray-500">
                      Does apple cider vinegar actually improve digestion? Here
                      is what 4 clinical studies found.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-green-50 py-16">
        <div className="mx-auto max-w-md px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Bloom?
          </h2>
          <p className="mt-3 text-gray-600">
            Join the newsletter and get your free guide today.
          </p>
          {!submitted && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex gap-2"
            >
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
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Subscribe
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
          )}
          {submitted && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                You&apos;re already subscribed!
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
