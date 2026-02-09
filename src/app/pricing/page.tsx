"use client"

import { useState } from "react"
import { Check, MessageCircle, Video, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "forever",
    description: "Get started with essential gut health tools",
    features: [
      "5 articles per month",
      "Basic GutScore",
      "Weekly email digest",
      "Community (read-only)",
    ],
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    highlighted: false,
  },
  {
    name: "Bloom",
    monthlyPrice: "$7",
    annualPrice: "$5.83",
    annualTotal: "$70",
    period: "mo",
    description: "Full access to articles, tracking, and AI",
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Unlimited articles",
      "AI gut assistant",
      "Full symptom tracking",
      "Food diary",
      "Treatment comparisons",
      "Community access",
      "Personalized research digests",
    ],
    cta: "Start Bloom",
    ctaHref: "/sign-up?plan=bloom",
    highlighted: true,
  },
  {
    name: "Pro",
    monthlyPrice: "$29",
    annualPrice: "$24.17",
    annualTotal: "$290",
    period: "mo",
    description: "Advanced tools, coaching, and personalized protocols",
    features: [
      "Everything in Bloom",
      "Personalized protocols",
      "Group coaching (2x/month)",
      "Priority AI",
      "Advanced correlations",
      "Protocol builder",
      "Lab result interpretation",
      "Export health data",
    ],
    cta: "Go Pro",
    ctaHref: "/sign-up?plan=pro",
    highlighted: false,
  },
]

const faqItems = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period. No questions asked.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "The Free tier gives you ongoing access to core features. You can upgrade to Bloom or Pro anytime and downgrade back to Free if it's not the right fit.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. We also support Apple Pay and Google Pay.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a full refund within the first 14 days of your subscription if you're not satisfied. Contact us at support@bloomyourgut.com.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing date.",
  },
  {
    question: "Do you offer student or healthcare worker discounts?",
    answer:
      "Yes! We offer 50% off Bloom and Pro plans for verified students and healthcare workers. Contact us with proof of status to get your discount code.",
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Start free, upgrade when you&apos;re ready. No hidden fees.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <Label
          htmlFor="billing-toggle"
          className={`text-sm ${!annual ? "font-semibold text-gray-900" : "text-gray-500"}`}
        >
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={annual}
          onCheckedChange={setAnnual}
          className="data-[state=checked]:bg-green-600"
        />
        <Label
          htmlFor="billing-toggle"
          className={`text-sm ${annual ? "font-semibold text-gray-900" : "text-gray-500"}`}
        >
          Annual
        </Label>
        {annual && (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Save 17%
          </Badge>
        )}
      </div>

      {/* Pricing cards */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col ${
              tier.highlighted
                ? "border-2 border-green-500 shadow-lg shadow-green-100"
                : "border border-gray-200"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-600 text-white hover:bg-green-600">
                  {tier.badge}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {tier.name}
              </CardTitle>
              <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {annual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-sm text-gray-500">
                  /{tier.period === "forever" ? "forever" : "mo"}
                </span>
                {annual && tier.annualTotal && (
                  <p className="mt-1 text-xs text-gray-400">
                    Billed {tier.annualTotal}/year
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className={`w-full ${
                  tier.highlighted
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <Link href={tier.ctaHref}>{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Consultation section */}
      <div className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            1-on-1 Gut Health Consultation
          </h2>
          <p className="mt-2 text-gray-500">
            Get personalized guidance from our gut health specialists.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Async Consultation</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Detailed written analysis and personalized plan
              </p>
              <div className="mt-3">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="text-sm text-gray-500">/session</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Detailed health history review",
                  "Personalized gut health plan",
                  "Supplement recommendations",
                  "14-day follow-up support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                <Link href="/consult">Book Async</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Live Consultation</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                60-minute video call with a gut health specialist
              </p>
              <div className="mt-3">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="text-sm text-gray-500">/session</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "60-minute video consultation",
                  "Real-time Q&A",
                  "Lab test recommendations",
                  "14-day follow-up support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                <Link href="/consult">Book Live</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* PPP notice */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <Globe className="h-4 w-4" />
          Prices adjusted for your region with Purchasing Power Parity
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Billing FAQ
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-gray-900">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
