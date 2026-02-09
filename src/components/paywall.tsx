import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaywallProps {
  articlesUsed?: number
  articlesLimit?: number
}

export function Paywall({
  articlesUsed = 5,
  articlesLimit = 5,
}: PaywallProps) {
  return (
    <div className="relative">
      {/* Blurred overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm" />

      {/* Paywall card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="mx-4 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Unlock Unlimited Articles
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You&apos;ve read {articlesUsed} of {articlesLimit} free articles
            this month. Upgrade to Bloom for unlimited access.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="text-sm text-gray-400">
              Starting at{" "}
              <span className="font-semibold text-gray-900">$7/mo</span>
            </div>
            <Button
              asChild
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/pricing">Upgrade to Bloom</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
