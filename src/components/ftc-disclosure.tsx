export function FtcDisclosure({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="mt-12 border-t border-gray-200 pt-6">
      <p className="text-xs leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-500">Affiliate Disclosure:</span>{' '}
        Some links on this page are affiliate links. We may earn a commission at no
        extra cost to you. We only recommend products we believe in. All
        recommendations are evidence-based and independently selected by our
        editorial team.
      </p>
    </div>
  )
}
