import { Metadata } from "next"
import { BookOpen } from "lucide-react"
import { ArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Gut Health Articles",
  description:
    "Evidence-based gut health articles covering SIBO, IBS, microbiome science, probiotics, nutrition, and the latest research.",
}

const categories = [
  "All",
  "SIBO",
  "IBS",
  "Microbiome",
  "Nutrition",
  "Probiotics",
  "Research",
]

// Placeholder articles for when Supabase isn't connected
const placeholderArticles = [
  {
    title: "Understanding SIBO: A Complete Guide to Small Intestinal Bacterial Overgrowth",
    slug: "understanding-sibo-complete-guide",
    excerpt:
      "Learn about the causes, symptoms, and evidence-based treatments for SIBO, one of the most common yet underdiagnosed gut conditions.",
    category: "SIBO",
    readingTime: 12,
    publishedAt: "2026-02-01",
  },
  {
    title: "The Gut-Brain Connection: How Your Microbiome Affects Mental Health",
    slug: "gut-brain-connection-microbiome-mental-health",
    excerpt:
      "Explore the fascinating science behind the gut-brain axis and how your gut bacteria influence mood, anxiety, and cognitive function.",
    category: "Microbiome",
    readingTime: 8,
    publishedAt: "2026-01-28",
  },
  {
    title: "Probiotics vs Prebiotics: What the Research Actually Shows",
    slug: "probiotics-vs-prebiotics-research",
    excerpt:
      "A deep dive into the clinical evidence for probiotics and prebiotics, which strains work, and how to choose the right supplement.",
    category: "Probiotics",
    readingTime: 10,
    publishedAt: "2026-01-25",
  },
  {
    title: "The Low FODMAP Diet: A Step-by-Step Protocol for IBS Relief",
    slug: "low-fodmap-diet-ibs-protocol",
    excerpt:
      "A practical guide to the low FODMAP elimination diet, including what to eat, what to avoid, and how to reintroduce foods safely.",
    category: "IBS",
    readingTime: 15,
    publishedAt: "2026-01-20",
  },
  {
    title: "Leaky Gut Syndrome: Separating Science from Hype",
    slug: "leaky-gut-syndrome-science-vs-hype",
    excerpt:
      "What does the research actually say about intestinal permeability? We review the evidence and debunk common myths.",
    category: "Research",
    readingTime: 9,
    publishedAt: "2026-01-15",
  },
  {
    title: "Anti-Inflammatory Foods for Gut Healing: Evidence-Based Guide",
    slug: "anti-inflammatory-foods-gut-healing",
    excerpt:
      "Discover which foods have the strongest anti-inflammatory effects on your gut, backed by clinical studies and nutritional science.",
    category: "Nutrition",
    readingTime: 7,
    publishedAt: "2026-01-10",
  },
]

export default async function ArticlesPage() {
  // TODO: Fetch from Supabase when connected
  // const supabase = await createClient()
  // const { data: articles } = await supabase
  //   .from('articles')
  //   .select('*')
  //   .eq('status', 'published')
  //   .order('published_at', { ascending: false })

  const articles = placeholderArticles

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gut Health Articles
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-gray-500">
          Evidence-based articles on gut health, written from peer-reviewed
          research and updated weekly.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={cat === "All" ? "default" : "secondary"}
            className={`cursor-pointer px-3 py-1 text-sm ${
              cat === "All"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Article grid */}
      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              category={article.category}
              readingTime={article.readingTime}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No articles yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Articles are being written and reviewed. Check back soon!
          </p>
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <span className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white">
          1
        </span>
        <span className="cursor-pointer rounded-md px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">
          2
        </span>
        <span className="cursor-pointer rounded-md px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">
          3
        </span>
      </div>
    </div>
  )
}
