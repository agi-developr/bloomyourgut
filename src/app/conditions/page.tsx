import type { Metadata } from "next"
import { HubIndex } from "@/components/hub-index"

export const metadata: Metadata = {
  title: "Gut Health Conditions: Evidence-Based Guides | BloomYourGut",
  description:
    "Browse evidence-based guides to gut conditions — SIBO, IBS, leaky gut, candida, and more — covering symptoms, causes, and treatment.",
  alternates: { canonical: "https://bloomyourgut.com/conditions" },
}

export default function ConditionsIndexPage() {
  return <HubIndex category="conditions" />
}
