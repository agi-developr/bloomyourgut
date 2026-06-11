import type { Metadata } from "next"
import { getHubPagesByCategory } from "@/data/hub-pages"
import { HubRoute, buildHubMetadata } from "@/components/hub-page-template"

export const dynamicParams = false

export function generateStaticParams() {
  return getHubPagesByCategory("foods").map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  return buildHubMetadata("foods", slug)
}

export default async function FoodHubPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  return <HubRoute category="foods" slug={slug} />
}
