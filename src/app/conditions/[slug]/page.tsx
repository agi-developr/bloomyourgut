import type { Metadata } from "next"
import { getHubPagesByCategory } from "@/data/hub-pages"
import { HubRoute, buildHubMetadata } from "@/components/hub-page-template"

export const dynamicParams = false

export function generateStaticParams() {
  return getHubPagesByCategory("conditions").map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  return buildHubMetadata("conditions", slug)
}

export default async function ConditionHubPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  return <HubRoute category="conditions" slug={slug} />
}
