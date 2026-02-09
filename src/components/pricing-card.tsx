import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta: string
  ctaHref: string
  highlighted?: boolean
  badge?: string
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <Card
      className={`relative flex flex-col ${
        highlighted
          ? "border-2 border-green-500 shadow-lg shadow-green-100"
          : "border border-gray-200"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-green-600 text-white hover:bg-green-600">
            {badge}
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {name}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-gray-500">
            {description}
          </CardDescription>
        )}
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          {period && (
            <span className="text-sm text-gray-500">/{period}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className={`w-full ${
            highlighted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <Link href={ctaHref}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
