import { Metadata } from "next"
import Link from "next/link"
import {
  UtensilsCrossed,
  Beef,
  Stethoscope,
  Pill,
  ArrowRight,
  Wrench,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EmailCapture } from "@/components/email-capture"

export const metadata: Metadata = {
  title: "Gut Health Tools",
  description:
    "Free evidence-based gut health tools: FODMAP food lookup, carnivore diet reference, SIBO symptom guide, and supplement interaction checker.",
}

const tools = [
  {
    href: "/tools/fodmap",
    icon: UtensilsCrossed,
    title: "FODMAP Food Lookup",
    description:
      "Search 20 common foods with color-coded FODMAP risk levels. See fructose, lactose, fructans, galactans, and polyol content at a glance.",
    color: "bg-green-50 text-green-600",
  },
  {
    href: "/tools/carnivore",
    icon: Beef,
    title: "Carnivore Diet Reference",
    description:
      "20 carnivore-friendly foods with full nutrition data, histamine risk ratings, and SIBO safety flags.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/tools/sibo-symptoms",
    icon: Stethoscope,
    title: "SIBO Symptom Guide",
    description:
      "15 common SIBO symptoms with severity ratings, triggers, and evidence-based relief methods.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    href: "/tools/supplements",
    icon: Pill,
    title: "Supplement Interaction Checker",
    description:
      "Check 15 common supplement interactions. Know which to take together, which to separate, and which to avoid.",
    color: "bg-cyan-50 text-cyan-600",
  },
]

export default function ToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <Wrench className="h-3.5 w-3.5" />
            Free Tools
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Gut Health Tools
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Evidence-based reference tools to help you make informed decisions
            about food, supplements, and symptom management.
          </p>
        </div>
      </section>

      {/* Tool cards */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full border-gray-100 transition-shadow hover:shadow-md">
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
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600">
                      Open tool
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="border-t border-gray-100 bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>
    </div>
  )
}
