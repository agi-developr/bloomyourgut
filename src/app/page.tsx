import Link from "next/link"
import {
  BookOpen,
  Activity,
  Bot,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PricingCard } from "@/components/pricing-card"
import { EmailCapture } from "@/components/email-capture"

const stats = [
  { icon: BookOpen, label: "Research-Backed Articles", value: "500+" },
  { icon: Users, label: "Community Members", value: "10,000+" },
  { icon: TrendingUp, label: "Report Improvement", value: "73%" },
]

const features = [
  {
    icon: BookOpen,
    title: "Research-Backed Content",
    description:
      "Every article is sourced from PubMed and peer-reviewed journals. Updated weekly with the latest gut health research.",
  },
  {
    icon: Activity,
    title: "Smart Symptom Tracking",
    description:
      "Log symptoms, food, and supplements daily. Our algorithms identify patterns and correlations unique to your body.",
  },
  {
    icon: Bot,
    title: "AI Gut Assistant",
    description:
      "Ask questions about gut health, get evidence-based answers, and receive personalized recommendations from our AI.",
  },
]

const steps = [
  {
    step: "1",
    title: "Read",
    description: "Expert articles on your condition, backed by peer-reviewed research.",
    color: "bg-green-50 text-green-600",
  },
  {
    step: "2",
    title: "Track",
    description: "Log symptoms, food, and supplements daily. See what works for you.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    step: "3",
    title: "Bloom",
    description: "Watch your GutScore improve over time as you optimize your gut health.",
    color: "bg-teal-50 text-teal-600",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
              <Sparkles className="h-4 w-4" />
              Evidence-based gut health platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Gut Health Journey,{" "}
              <span className="text-green-600">Backed by Science</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Evidence-based articles, AI-powered symptom tracking, and
              personalized protocols — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Link href="/articles">
                  Start Reading Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Track Your Gut Health</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-center gap-3">
                <stat.icon className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need for Better Gut Health
            </h2>
            <p className="mt-4 text-gray-600">
              Science-driven tools designed to help you understand and improve
              your digestive health.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600">
              Three simple steps to transform your gut health.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${step.color} text-xl font-bold`}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-gray-600">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              features={[
                "5 articles per month",
                "Basic GutScore",
                "Weekly email digest",
                "Community (read-only)",
              ]}
              cta="Get Started Free"
              ctaHref="/sign-up"
            />
            <PricingCard
              name="Bloom"
              price="$7"
              period="mo"
              badge="Most Popular"
              highlighted
              features={[
                "Unlimited articles",
                "AI gut assistant",
                "Full symptom tracking",
                "Food diary",
                "Personalized digests",
              ]}
              cta="Start Bloom"
              ctaHref="/sign-up?plan=bloom"
            />
            <PricingCard
              name="Pro"
              price="$29"
              period="mo"
              features={[
                "Everything in Bloom",
                "Personalized protocols",
                "Group coaching (2x/month)",
                "Priority AI",
                "Advanced correlations",
              ]}
              cta="Go Pro"
              ctaHref="/sign-up?plan=pro"
            />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View full pricing details
              <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="border-t border-gray-100 bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Bloom?
          </h2>
          <p className="mt-4 text-lg text-green-100">
            Join thousands of people taking control of their gut health with
            evidence-based tools and expert guidance.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="bg-white text-green-700 hover:bg-green-50"
            >
              <Link href="/sign-up">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
