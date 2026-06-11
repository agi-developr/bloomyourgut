import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  ExternalLink,
  ShoppingBag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { EmailCapture } from "@/components/email-capture"
import { SchemaMarkup } from "@/components/schema-markup"
import { FtcDisclosure } from "@/components/ftc-disclosure"
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo"
import {
  type HubPage,
  type HubCategory,
  getHubPage,
  getRelatedHubPages,
  resolveHubRef,
  hubPageUrl,
} from "@/data/hub-pages"
import {
  getMatchingArticles,
  getAffiliateProducts,
  type HubArticle,
  type HubProduct,
} from "@/lib/hub-data"
import { renderOverviewHtml } from "@/lib/ai/hub-content"

const CATEGORY_LABEL: Record<HubCategory, string> = {
  conditions: "Conditions",
  symptoms: "Symptoms",
  foods: "Foods & Supplements",
}

const SITE = "https://bloomyourgut.com"

interface HubPageTemplateProps {
  page: HubPage
  overviewHtml: string
  articles: HubArticle[]
  products: HubProduct[]
  related: HubPage[]
}

export function HubPageTemplate({
  page,
  overviewHtml,
  articles,
  products,
  related,
}: HubPageTemplateProps) {
  const categoryLabel = CATEGORY_LABEL[page.category]
  const categoryHref = `/${page.category}`

  // ---- Structured data (schema.org) ----
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.title,
    headline: page.title,
    description: page.summary,
    url: hubPageUrl(page),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "BloomYourGut",
      url: SITE,
    },
    about: {
      "@type": page.category === "foods" ? "Substance" : "MedicalCondition",
      name: page.name,
      ...(page.aka.length > 0 ? { alternateName: page.aka } : {}),
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
  }

  const faqSchema = generateFAQSchema(page.faq)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE },
    { name: categoryLabel, url: `${SITE}${categoryHref}` },
    { name: page.name, url: hubPageUrl(page) },
  ])

  return (
    <>
      <SchemaMarkup data={medicalWebPageSchema} />
      <SchemaMarkup data={faqSchema} />
      <SchemaMarkup data={breadcrumbSchema} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={categoryHref} className="hover:text-green-600">
            {categoryLabel}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-700">{page.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <article>
            <header className="mb-8">
              <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100">
                {categoryLabel}
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {page.title}
              </h1>
              {page.aka.length > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  Also known as: {page.aka.join(", ")}
                </p>
              )}
            </header>

            {/* AI-generated / templated overview */}
            <div
              className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-green-500"
              dangerouslySetInnerHTML={{ __html: overviewHtml }}
            />

            {/* Affiliate product recommendations */}
            {products.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                  Recommended Products
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <a
                      key={product.affiliate_url}
                      href={product.affiliate_url}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="group flex flex-col rounded-lg border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-green-600">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-gray-400">
                              {product.brand}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-green-500" />
                      </div>
                      {product.description && (
                        <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
                <FtcDisclosure show={true} />
              </section>
            )}

            {/* Matching articles */}
            {articles.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <div className="space-y-3">
                  {articles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className="group flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-green-600">
                          {a.title}
                        </p>
                        {a.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {a.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ with schema markup */}
            {page.faq.length > 0 && (
              <section className="mt-12 rounded-lg border border-gray-100 bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {page.faq.map((item, i) => (
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

            {/* Email capture CTA */}
            <section className="mt-12 rounded-2xl border border-green-100 bg-green-50/60 p-8">
              <EmailCapture />
            </section>

            <div className="mt-8">
              <MedicalDisclaimer />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Crosslinks to related hub pages */}
              {related.length > 0 && (
                <div className="rounded-lg border border-gray-100 bg-white p-5">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Related Topics
                  </h3>
                  <nav className="space-y-1">
                    {related.map((r) => (
                      <Link
                        key={`${r.category}/${r.slug}`}
                        href={r.href}
                        className="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-green-50 hover:text-green-700"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        {r.name}
                        <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-300">
                          {r.category}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* Compact email capture */}
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Weekly Gut-Health Digest
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Evidence-based tips, no spam.
                </p>
                <EmailCapture variant="compact" className="flex-col [&>input]:max-w-none" />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <Link
            href={categoryHref}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {categoryLabel}
          </Link>
        </div>
      </div>
    </>
  )
}

/** Resolve a page's related refs into full HubPages (build-time helper). */
export function resolveRelated(page: HubPage): HubPage[] {
  return page.related
    .map((ref) => resolveHubRef(ref, page.category))
    .filter((p): p is HubPage => Boolean(p))
}

/**
 * Shared async server component for a hub route. Loads matching articles and
 * affiliate products, resolves crosslinks, and renders the template. Each
 * route file (`/conditions`, `/symptoms`, `/foods`) delegates to this.
 */
export async function HubRoute({
  category,
  slug,
}: {
  category: HubCategory
  slug: string
}) {
  const page = getHubPage(category, slug)
  if (!page) notFound()

  const [articles, products] = await Promise.all([
    getMatchingArticles(page),
    getAffiliateProducts(page),
  ])
  const related = getRelatedHubPages(page, 8)
  const overviewHtml = renderOverviewHtml(page)

  return (
    <HubPageTemplate
      page={page}
      overviewHtml={overviewHtml}
      articles={articles}
      products={products}
      related={related}
    />
  )
}

/** Shared metadata builder for a hub route. */
export function buildHubMetadata(
  category: HubCategory,
  slug: string
): Metadata {
  const page = getHubPage(category, slug)
  if (!page) return {}

  const keywords = [page.name, ...page.aka, ...page.tags]

  return {
    title: page.title,
    description: page.summary,
    keywords,
    alternates: { canonical: hubPageUrl(page) },
    openGraph: {
      type: "article",
      title: page.title,
      description: page.summary,
      url: hubPageUrl(page),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.summary,
    },
  }
}
