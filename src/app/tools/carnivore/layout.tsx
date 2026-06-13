import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carnivore Diet Reference",
  description:
    "20 carnivore-friendly foods with full nutrition data, histamine risk ratings, and SIBO safety flags.",
}

export default function CarnivoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
