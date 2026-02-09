export default function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-100">
            <div className="h-48 animate-pulse bg-gray-200" />
            <div className="p-5">
              <div className="mb-3 h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
