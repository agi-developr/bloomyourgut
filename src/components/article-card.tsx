import Link from "next/link"
import { Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string
  category: string
  readingTime: number | null
  publishedAt: string | null
  imageUrl?: string | null
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  category,
  readingTime,
  publishedAt,
}: ArticleCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="mb-2">
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 hover:bg-green-100"
            >
              {category}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold leading-tight text-gray-900 transition-colors group-hover:text-green-600">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="line-clamp-2 text-sm text-gray-500">{excerpt}</p>
        </CardContent>
        <CardFooter className="text-xs text-gray-400">
          <div className="flex items-center gap-4">
            {readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
