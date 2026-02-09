import { Metadata } from "next"
import Link from "next/link"
import {
  Clock,
  Calendar,
  Share2,
  BookOpen,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { ArticleCard } from "@/components/article-card"

// Placeholder article data
const placeholderArticle = {
  title: "Understanding SIBO: A Complete Guide to Small Intestinal Bacterial Overgrowth",
  slug: "understanding-sibo-complete-guide",
  content: `
    <h2 id="what-is-sibo">What is SIBO?</h2>
    <p>Small Intestinal Bacterial Overgrowth (SIBO) is a condition characterized by an abnormal increase in the bacterial population of the small intestine. Unlike the large intestine, which naturally contains trillions of bacteria, the small intestine normally has relatively few microorganisms.</p>
    <p>When bacteria from the colon migrate upward or when normal clearing mechanisms fail, these bacteria can proliferate in the small intestine, leading to a range of digestive symptoms.</p>

    <h2 id="symptoms">Common Symptoms</h2>
    <p>The most common symptoms of SIBO include:</p>
    <ul>
      <li>Bloating and abdominal distension, especially after meals</li>
      <li>Excessive gas and flatulence</li>
      <li>Abdominal pain or cramping</li>
      <li>Diarrhea, constipation, or alternating between both</li>
      <li>Nausea and acid reflux</li>
      <li>Fatigue and brain fog</li>
      <li>Nutrient malabsorption (B12, iron, fat-soluble vitamins)</li>
    </ul>

    <h2 id="causes">Causes and Risk Factors</h2>
    <p>Several factors can contribute to the development of SIBO:</p>
    <ul>
      <li><strong>Impaired motility:</strong> The migrating motor complex (MMC) normally sweeps bacteria out of the small intestine between meals. Conditions that impair this function increase SIBO risk.</li>
      <li><strong>Structural abnormalities:</strong> Adhesions, strictures, or surgical alterations can create areas where bacteria accumulate.</li>
      <li><strong>Low stomach acid:</strong> Stomach acid serves as a natural barrier against bacterial overgrowth.</li>
      <li><strong>Immune deficiency:</strong> The gut immune system plays a crucial role in controlling bacterial populations.</li>
    </ul>

    <h2 id="diagnosis">Diagnosis</h2>
    <p>The most common non-invasive test for SIBO is the lactulose or glucose breath test. Patients consume a sugar solution, and the gases produced by bacterial fermentation (hydrogen and methane) are measured over several hours.</p>
    <p>A positive test typically shows elevated hydrogen or methane levels within the first 90-120 minutes, indicating bacterial fermentation occurring in the small intestine.</p>

    <h2 id="treatment">Evidence-Based Treatments</h2>
    <p>Treatment for SIBO typically follows a multi-phase approach:</p>
    <ul>
      <li><strong>Antibiotics:</strong> Rifaximin is the most studied antibiotic for SIBO, with success rates of 40-70% after a single course. For methane-dominant SIBO, neomycin is often added.</li>
      <li><strong>Herbal antimicrobials:</strong> Studies show that herbal protocols using berberine, oregano oil, and neem can be as effective as rifaximin in some patients.</li>
      <li><strong>Dietary modifications:</strong> The low FODMAP diet, elemental diet, or specific carbohydrate diet can help reduce bacterial fermentation.</li>
      <li><strong>Prokinetics:</strong> Medications or supplements that improve motility help prevent SIBO recurrence.</li>
    </ul>

    <h2 id="prevention">Preventing Recurrence</h2>
    <p>SIBO has a high recurrence rate, estimated at 40-50% within one year. Strategies to prevent recurrence include:</p>
    <ul>
      <li>Meal spacing (4-5 hours between meals to allow MMC function)</li>
      <li>Prokinetic agents</li>
      <li>Stress management</li>
      <li>Addressing underlying causes</li>
    </ul>
  `,
  excerpt:
    "Learn about the causes, symptoms, and evidence-based treatments for SIBO.",
  author: "BloomYourGut Team",
  category: "SIBO",
  tags: ["SIBO", "bacterial overgrowth", "digestive health", "gut health"],
  seo_title: "Understanding SIBO: Complete Guide to Bacterial Overgrowth",
  seo_description:
    "Comprehensive evidence-based guide on SIBO (Small Intestinal Bacterial Overgrowth) covering symptoms, causes, diagnosis, and treatment options.",
  reading_time_minutes: 12,
  published_at: "2026-02-01",
  faq: [
    {
      question: "How common is SIBO?",
      answer:
        "SIBO is estimated to affect 6-15% of the general population, but prevalence is much higher (up to 80%) in people with IBS.",
    },
    {
      question: "Can SIBO be cured permanently?",
      answer:
        "While SIBO can be treated effectively, recurrence is common (40-50% within a year). Addressing underlying causes and using prokinetics can significantly reduce recurrence risk.",
    },
    {
      question: "What is the best diet for SIBO?",
      answer:
        "The low FODMAP diet is the most studied dietary approach for SIBO symptom management. The elemental diet has the highest success rates but is more restrictive. Work with a dietitian to find the right approach.",
    },
    {
      question: "Should I take probiotics with SIBO?",
      answer:
        "Research on probiotics for SIBO is mixed. Some strains may help, while others could worsen symptoms. Consult with your healthcare provider before starting probiotics if you have SIBO.",
    },
  ],
}

const relatedArticles = [
  {
    title: "The Low FODMAP Diet: A Step-by-Step Protocol for IBS Relief",
    slug: "low-fodmap-diet-ibs-protocol",
    excerpt: "A practical guide to the low FODMAP elimination diet.",
    category: "IBS",
    readingTime: 15,
    publishedAt: "2026-01-20",
  },
  {
    title: "Probiotics vs Prebiotics: What the Research Actually Shows",
    slug: "probiotics-vs-prebiotics-research",
    excerpt: "A deep dive into the clinical evidence for probiotics.",
    category: "Probiotics",
    readingTime: 10,
    publishedAt: "2026-01-25",
  },
]

// Table of contents extracted from headings
const toc = [
  { id: "what-is-sibo", title: "What is SIBO?" },
  { id: "symptoms", title: "Common Symptoms" },
  { id: "causes", title: "Causes and Risk Factors" },
  { id: "diagnosis", title: "Diagnosis" },
  { id: "treatment", title: "Evidence-Based Treatments" },
  { id: "prevention", title: "Preventing Recurrence" },
]

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  // TODO: Fetch real article by params.slug from Supabase
  void params
  const article = placeholderArticle

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    keywords: article.tags,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.published_at,
    },
    other: {
      "article:section": article.category,
    },
  }
}

export default async function ArticlePage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  // TODO: Fetch real article from Supabase
  void params
  const article = placeholderArticle

  // Schema.org structured data for MedicalWebPage
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: "BloomYourGut",
    },
    datePublished: article.published_at,
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/articles"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <article>
            {/* Header */}
            <header className="mb-8">
              <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100">
                {article.category}
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {article.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>{article.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.reading_time_minutes} min read
                </span>
              </div>

              {/* Share buttons */}
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Share2 className="mr-1 h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </header>

            {/* Article body */}
            <div
              className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-green-500"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* FAQ section */}
            {article.faq && article.faq.length > 0 && (
              <section className="mt-12 rounded-lg border border-gray-100 bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {article.faq.map((item, i) => (
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
              </section>
            )}

            {/* Medical disclaimer */}
            <div className="mt-8">
              <MedicalDisclaimer />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of contents */}
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-green-50 hover:text-green-700"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Related articles */}
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.slug}
                      href={`/articles/${ra.slug}`}
                      className="block rounded-md p-2 transition-colors hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {ra.title}
                      </p>
                      <span className="mt-1 text-xs text-gray-400">
                        {ra.readingTime} min read
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
