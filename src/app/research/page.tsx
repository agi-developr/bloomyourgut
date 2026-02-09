import { Metadata } from "next"
import {
  Search,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Microscope,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EmailCapture } from "@/components/email-capture"

export const metadata: Metadata = {
  title: "Research Methodology",
  description:
    "Learn how BloomYourGut sources, evaluates, and presents evidence-based gut health research. Our rigorous methodology ensures every article meets the highest scientific standards.",
}

const pipeline = [
  {
    step: "01",
    icon: Database,
    title: "PubMed Scanning",
    description:
      "We continuously scan PubMed, Cochrane Library, and major gastroenterology journals for new studies relevant to gut health, the microbiome, and digestive wellness.",
  },
  {
    step: "02",
    icon: Search,
    title: "Systematic Screening",
    description:
      "Each study is screened for relevance, sample size, methodology quality, and conflict of interest. We prioritize randomized controlled trials and systematic reviews.",
  },
  {
    step: "03",
    icon: GraduationCap,
    title: "Expert Review",
    description:
      "Shortlisted research is reviewed by registered dietitians and healthcare professionals who evaluate clinical significance and practical applicability.",
  },
  {
    step: "04",
    icon: FileCheck,
    title: "Content Synthesis",
    description:
      "Findings are translated into accessible language while preserving scientific accuracy. Every claim is linked to its original source for reader verification.",
  },
  {
    step: "05",
    icon: RefreshCw,
    title: "Ongoing Updates",
    description:
      "Published articles are revisited quarterly. When new evidence emerges that changes our understanding, we update the article and note the revision history.",
  },
]

const eatSignals = [
  {
    icon: Microscope,
    letter: "Experience",
    title: "First-Hand Experience",
    description:
      "Our team includes individuals who have personally navigated IBS, SIBO, and other gut conditions. We understand the daily reality of living with digestive issues.",
  },
  {
    icon: GraduationCap,
    letter: "Expertise",
    title: "Professional Expertise",
    description:
      "Content is authored and reviewed by professionals with backgrounds in nutrition science, gastroenterology research, and registered dietetics.",
  },
  {
    icon: BookOpen,
    letter: "Authoritativeness",
    title: "Authoritative Sources",
    description:
      "We cite exclusively from peer-reviewed journals, government health databases (NIH, WHO), and established medical institutions. No blog-sourced claims.",
  },
  {
    icon: ShieldCheck,
    letter: "Trustworthiness",
    title: "Transparent & Trustworthy",
    description:
      "We disclose conflicts of interest, clearly label sponsored content, maintain editorial independence, and correct errors publicly when they occur.",
  },
]

const evidenceGrades = [
  {
    level: "Strong",
    color: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-600",
    icon: CheckCircle2,
    description:
      "Supported by multiple randomized controlled trials, systematic reviews, or meta-analyses with consistent results across diverse populations.",
    example: "e.g., Probiotics for antibiotic-associated diarrhea",
  },
  {
    level: "Moderate",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
    icon: FileCheck,
    description:
      "Supported by at least one well-designed RCT or multiple cohort studies with generally consistent findings. Some limitations in scope or population.",
    example: "e.g., Low-FODMAP diet for IBS symptom management",
  },
  {
    level: "Preliminary",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    iconColor: "text-amber-600",
    icon: Search,
    description:
      "Based on early-stage research such as pilot studies, animal models, or small human trials. Promising but requires further investigation.",
    example: "e.g., Specific probiotic strains for mental health via gut-brain axis",
  },
  {
    level: "Insufficient",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    iconColor: "text-gray-500",
    icon: AlertTriangle,
    description:
      "Limited or conflicting evidence. May be based on case reports, in-vitro studies, or expert opinion only. We include these with clear caveats.",
    example: "e.g., Many social media gut health trends",
  },
]

const citationStandards = [
  {
    title: "Primary Sources Only",
    description:
      "We link directly to the original published study on PubMed or the journal website. No telephone-game citations from secondary sources.",
  },
  {
    title: "DOI References",
    description:
      "Every cited study includes its DOI (Digital Object Identifier) for permanent, verifiable access to the original research.",
  },
  {
    title: "Publication Date Noted",
    description:
      "We include publication dates so readers can assess recency. Gut microbiome research evolves rapidly, and context matters.",
  },
  {
    title: "Conflict Disclosure",
    description:
      "When cited studies are industry-funded, we note this in our articles so readers can factor potential bias into their evaluation.",
  },
]

export default function ResearchPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <Microscope className="h-3.5 w-3.5" />
            Evidence-Based Approach
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Research Methodology
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Every article on BloomYourGut follows a rigorous, transparent
            research process. We believe you deserve to know exactly how we
            source, evaluate, and present gut health information.
          </p>
        </div>
      </section>

      {/* Research Pipeline */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            How Articles Are Sourced
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Our content pipeline ensures every article meets rigorous scientific
            standards before publication.
          </p>
          <div className="space-y-8">
            {pipeline.map((step) => (
              <div key={step.step} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <step.icon className="h-6 w-6 text-green-600" />
                  </div>
                  {step.step !== "05" && (
                    <div className="mt-2 h-full w-px bg-green-200" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600">
                    Step {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation Standards */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Citation Standards
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Transparency starts with traceable citations. Every claim we make
            can be verified by our readers.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {citationStandards.map((standard) => (
              <Card key={standard.title} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-green-50 p-2">
                    <FileCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {standard.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* E-E-A-T Signals */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            E-E-A-T: Our Quality Framework
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            We align with Google&apos;s E-E-A-T framework (Experience,
            Expertise, Authoritativeness, Trustworthiness) to ensure our content
            meets the highest quality standards.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {eatSignals.map((signal) => (
              <div key={signal.letter} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <signal.icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-green-600">
                    {signal.letter}
                  </div>
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

      {/* Evidence Grading */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Evidence Grading System
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Not all evidence is created equal. We use a four-tier grading system
            so you always know how strong the science is behind our
            recommendations.
          </p>
          <div className="space-y-4">
            {evidenceGrades.map((grade) => (
              <Card key={grade.level} className="border-gray-100">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <grade.icon className={`h-5 w-5 ${grade.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {grade.level}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${grade.color}`}
                      >
                        {grade.level} Evidence
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {grade.description}
                    </p>
                    <p className="mt-1 text-xs italic text-gray-400">
                      {grade.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
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
