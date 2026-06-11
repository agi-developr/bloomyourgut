import type { Metadata } from "next"
import { HubIndex } from "@/components/hub-index"

export const metadata: Metadata = {
  title: "Gut Health Symptoms: What They Mean | BloomYourGut",
  description:
    "Understand gut-health symptoms — bloating, brain fog, constipation, fatigue, and more — and how they connect to your digestive health.",
  alternates: { canonical: "https://bloomyourgut.com/symptoms" },
}

export default function SymptomsIndexPage() {
  return <HubIndex category="symptoms" />
}
