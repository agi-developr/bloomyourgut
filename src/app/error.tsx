'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <span className="text-3xl text-red-500">!</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Something went wrong
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
        An unexpected error occurred. Our team has been notified. Please try again
        or head back to the home page.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Try Again
        </button>
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
