import type { Metadata } from "next"
import Link from "next/link"
import {
  Search,
  Pill,
  Stethoscope,
  Beef,
  Activity,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Free Gut Health Tools",
  description:
    "Interactive gut health tools — FODMAP food scorer, supplement interaction checker, SIBO symptom checker, carnivore diet planner, and gut microbiome diversity score.",
  keywords: [
    "FODMAP checker",
    "supplement interactions",
    "SIBO symptoms",
    "carnivore diet",
    "gut health score",
    "microbiome",
  ],
}

const tools = [
  {
    href: "/tools/fodmap-scorer",
    icon: Search,
    title: "FODMAP Food Risk Scorer",
    description:
      "Search 20+ foods with color-coded FODMAP risk levels, safe serving sizes, and detailed FODMAP breakdown by category.",
    color: "bg-red-50 text-red-600",
  },
  {
    href: "/tools/supplement-checker",
    icon: Pill,
    title: "Supplement Interaction Checker",
    description:
      "Check interactions between 15+ gut health supplements. Find synergies, conflicts, and optimal timing.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    href: "/tools/sibo-checker",
    icon: Stethoscope,
    title: "SIBO Symptom Checker",
    description:
      "Rate 15 SIBO-related symptoms to get a severity score with personalized trigger identification and relief recommendations.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/tools/carnivore-planner",
    icon: Beef,
    title: "Carnivore Diet Meal Planner",
    description:
      "Browse 20 carnivore-friendly foods with full macros, histamine risk levels, and SIBO safety ratings. Build meals with live totals.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    href: "/tools/gut-score",
    icon: Activity,
    title: "Gut Microbiome Diversity Score",
    description:
      "Rate 10 lifestyle factors on interactive sliders to estimate your gut microbiome diversity with a radar chart visualization.",
    color: "bg-emerald-50 text-emerald-600",
  },
]

export default function ToolsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Free Gut Health Tools
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Interactive, evidence-based tools to help you understand your gut
              health. No sign-up required.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full border-gray-100 transition-shadow group-hover:shadow-md">
                  <CardContent className="pt-6">
                    <div
                      className={`mb-4 inline-flex items-center justify-center rounded-lg p-3 ${tool.color}`}
                    >
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                      {tool.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                      Try it free
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            These tools are for educational purposes only and do not constitute
            medical advice. Always consult a qualified healthcare provider for
            diagnosis and treatment of gut health conditions.
          </p>
        </div>
      </section>
    </div>
  )
}
