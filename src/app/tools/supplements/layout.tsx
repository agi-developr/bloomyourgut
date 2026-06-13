import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Supplement Interaction Checker",
  description:
    "Check 15 common supplement interactions. Know which to take together, which to separate, and which to avoid.",
}

export default function SupplementsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
