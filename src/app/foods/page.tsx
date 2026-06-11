import type { Metadata } from "next"
import { HubIndex } from "@/components/hub-index"

export const metadata: Metadata = {
  title: "Gut Health Foods & Supplements: Benefits & Evidence | BloomYourGut",
  description:
    "Discover how foods, herbs, and supplements support gut health — bone broth, sauerkraut, kefir, berberine, L-glutamine, and more.",
  alternates: { canonical: "https://bloomyourgut.com/foods" },
}

export default function FoodsIndexPage() {
  return <HubIndex category="foods" />
}
