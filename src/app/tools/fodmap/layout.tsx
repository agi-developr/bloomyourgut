import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FODMAP Food Lookup",
  description:
    "Search 20 common foods with color-coded FODMAP risk levels. See fructose, lactose, fructans, galactans, and polyol content at a glance.",
}

export default function FodmapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
