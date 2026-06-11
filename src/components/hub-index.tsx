import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmailCapture } from "@/components/email-capture"
import { SchemaMarkup } from "@/components/schema-markup"
import { generateBreadcrumbSchema } from "@/lib/seo"
import {
  getHubPagesByCategory,
  type HubCategory,
} from "@/data/hub-pages"

const SITE = "https://bloomyourgut.com"

const META: Record<
  HubCategory,
  { label: string; heading: string; blurb: string }
> = {
  conditions: {
    label: "Conditions",
    heading: "Gut Health Conditions",
    blurb:
      "Evidence-based guides to gut conditions — from SIBO and IBS to leaky gut and candida — covering symptoms, causes, and treatment.",
  },
  symptoms: {
    label: "Symptoms",
    heading: "Gut Health Symptoms",
    blurb:
      "Understand what your symptoms mean — bloating, brain fog, constipation, fatigue and more — and how they connect to gut health.",
  },
  foods: {
    label: "Foods & Supplements",
    heading: "Gut Health Foods & Supplements",
    blurb:
      "How specific foods, herbs, and supplements support your gut — from bone broth and sauerkraut to berberine and L-glutamine.",
  },
}

export function HubIndex({ category }: { category: HubCategory }) {
  const meta = META[category]
  const pages = getHubPagesByCategory(category)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE },
    { name: meta.label, url: `${SITE}/${category}` },
  ])

  return (
    <>
      <SchemaMarkup data={breadcrumbSchema} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-700">{meta.label}</span>
        </nav>

        <header className="mb-8 max-w-2xl">
          <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100">
            {meta.label}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {meta.heading}
          </h1>
          <p className="mt-3 text-gray-500">{meta.blurb}</p>
          <p className="mt-2 text-sm text-gray-400">{pages.length} topics</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              className="group flex items-start gap-2 rounded-lg border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-400" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-600">
                  {p.name}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {p.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-green-100 bg-green-50/60 p-8">
          <EmailCapture />
        </section>
      </div>
    </>
  )
}
