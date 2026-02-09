import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Leaf className="mb-6 h-16 w-16 text-green-300" />
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Page Not Found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
        We couldn&apos;t find the page you&apos;re looking for. It may have been
        moved, renamed, or might not exist yet.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/articles"
          className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Go to Articles
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
