import { Metadata } from "next"
import {
  BookOpen,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  Heart,
  Target,
  Microscope,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EmailCapture } from "@/components/email-capture"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about BloomYourGut's mission to make evidence-based gut health information accessible to everyone.",
}

const eatSignals = [
  {
    icon: Microscope,
    title: "PubMed-Sourced Research",
    description:
      "Every article starts with peer-reviewed studies from PubMed and major medical journals. We cite our sources so you can verify.",
  },
  {
    icon: GraduationCap,
    title: "Expert Review Process",
    description:
      "Content is reviewed by registered dietitians and healthcare professionals before publication to ensure accuracy.",
  },
  {
    icon: Search,
    title: "Systematic Methodology",
    description:
      "We use a systematic review process to evaluate the strength of evidence, clearly distinguishing between strong and preliminary findings.",
  },
  {
    icon: ShieldCheck,
    title: "Regular Updates",
    description:
      "Articles are regularly reviewed and updated as new research emerges. Science evolves, and so does our content.",
  },
]

const values = [
  {
    icon: BookOpen,
    title: "Evidence Over Anecdote",
    description:
      "We prioritize peer-reviewed research over personal testimonials. When evidence is mixed, we say so.",
  },
  {
    icon: Heart,
    title: "Empathy First",
    description:
      "Living with gut issues is tough. We build tools with compassion, understanding that every person's journey is unique.",
  },
  {
    icon: Target,
    title: "Transparency",
    description:
      "We're honest about what we know and don't know. We clearly label affiliate content and never compromise editorial integrity.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Gut health can be isolating. We're building a supportive community where people can share experiences and learn together.",
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Our Story
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            BloomYourGut was born from a personal struggle with gut health and a
            frustration with the lack of reliable, evidence-based information
            available online.
          </p>
        </div>
      </section>

      {/* Founder story */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[200px_1fr]">
            {/* Photo placeholder */}
            <div className="flex items-start justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-green-100">
                <Users className="h-16 w-16 text-green-300" />
              </div>
            </div>

            {/* Story */}
            <div className="space-y-4 text-gray-600">
              <p>
                Like many of you, I spent years struggling with unexplained
                digestive issues: the bloating after every meal, the fatigue, the
                brain fog, the constant anxiety about what I could and
                couldn&apos;t eat.
              </p>
              <p>
                I saw multiple GI specialists, tried countless elimination diets,
                and spent hundreds of dollars on supplements that promised
                miracle results. What I found most frustrating was the disconnect
                between what influencers promoted online and what the actual
                research showed.
              </p>
              <p>
                With a background in nutrition research from the University of
                Washington and over 10 years of studying the gut microbiome, I
                decided to build what I wished existed: a platform that
                translates complex research into practical, actionable guidance.
              </p>
              <p>
                BloomYourGut is the result of that vision. Every article is
                sourced from PubMed, every recommendation is evidence-based, and
                every tool is designed to help you understand your unique gut
                health patterns.
              </p>
              <p className="font-medium text-gray-900">
                Because you deserve better than guesswork when it comes to your
                health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            To make evidence-based gut health information accessible, actionable,
            and personalized for everyone — regardless of their background,
            location, or budget.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
            Our Values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3">
                    <value.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How the platform works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            How the Platform Works
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              BloomYourGut combines three pillars to support your gut health
              journey:
            </p>
            <ol className="ml-4 list-decimal space-y-3">
              <li>
                <strong className="text-gray-900">
                  Research-backed articles:
                </strong>{" "}
                Our content pipeline starts with scanning PubMed for relevant
                studies, then translating the findings into accessible,
                actionable articles. Every claim is cited with its source.
              </li>
              <li>
                <strong className="text-gray-900">Smart tracking tools:</strong>{" "}
                Our symptom tracker, food diary, and supplement logger help you
                identify patterns in your data. Our GutScore algorithm synthesizes
                your tracking data into a single, actionable metric.
              </li>
              <li>
                <strong className="text-gray-900">AI-powered insights:</strong>{" "}
                Our AI gut assistant can answer your questions, identify
                correlations in your data, and provide personalized
                recommendations — all grounded in published research.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* E-E-A-T signals */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Our Research Standards
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            We hold ourselves to the highest standards of accuracy and
            transparency.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {eatSignals.map((signal) => (
              <div key={signal.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <signal.icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {signal.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {signal.description}
                  </p>
                </div>
              </div>
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
