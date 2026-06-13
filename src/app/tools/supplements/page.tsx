"use client"

import { useState, useMemo } from "react"
import { Pill, Search, ArrowRightLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EmailCapture } from "@/components/email-capture"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import supplementInteractions from "@/data/supplement-interactions.json"

const allSupplements = Array.from(
  new Set(
    supplementInteractions.flatMap((i) => [i.supp_a, i.supp_b]),
  ),
).sort()

function interactionBadgeClasses(type: string) {
  switch (type) {
    case "synergistic":
      return "bg-green-100 text-green-700 border-green-200"
    case "neutral":
      return "bg-gray-100 text-gray-700 border-gray-200"
    case "caution":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "avoid":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function timingLabel(timing: string) {
  switch (timing) {
    case "together":
      return "Take together"
    case "separate_2hr":
      return "Separate by 2 hours"
    case "separate_4hr":
      return "Separate by 4 hours"
    case "avoid":
      return "Do not combine"
    default:
      return timing.replace(/_/g, " ")
  }
}

export default function SupplementsPage() {
  const [suppA, setSuppA] = useState("")
  const [suppB, setSuppB] = useState("")

  const checkerResults = useMemo(() => {
    if (!suppA && !suppB) return []
    return supplementInteractions.filter((i) => {
      const matchA =
        !suppA ||
        i.supp_a.toLowerCase().includes(suppA.toLowerCase()) ||
        i.supp_b.toLowerCase().includes(suppA.toLowerCase())
      const matchB =
        !suppB ||
        i.supp_a.toLowerCase().includes(suppB.toLowerCase()) ||
        i.supp_b.toLowerCase().includes(suppB.toLowerCase())
      return matchA && matchB
    })
  }, [suppA, suppB])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
            <Pill className="h-3.5 w-3.5" />
            Interaction Checker
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Supplement Interaction Checker
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Check which supplements work well together, which to separate, and
            which combinations to avoid.
          </p>
        </div>
      </section>

      {/* Checker */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Check an Interaction
              </h2>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="w-full sm:flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Supplement A
                  </label>
                  <select
                    value={suppA}
                    onChange={(e) => setSuppA(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select supplement...</option>
                    {allSupplements.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <ArrowRightLeft className="h-5 w-5 shrink-0 text-gray-300" />
                <div className="w-full sm:flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Supplement B
                  </label>
                  <select
                    value={suppB}
                    onChange={(e) => setSuppB(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select supplement...</option>
                    {allSupplements.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checker results */}
              {(suppA || suppB) && (
                <div className="mt-6">
                  {checkerResults.length > 0 ? (
                    <div className="space-y-3">
                      {checkerResults.map((interaction, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {interaction.supp_a}
                            </span>
                            <ArrowRightLeft className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {interaction.supp_b}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${interactionBadgeClasses(interaction.interaction_type)}`}
                            >
                              {interaction.interaction_type}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {interaction.explanation}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Timing: {timingLabel(interaction.timing)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-400">
                      No matching interactions found.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Full reference table */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            All Interactions
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Supplement A
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Supplement B
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Interaction
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Timing
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-gray-900 md:table-cell">
                    Explanation
                  </th>
                </tr>
              </thead>
              <tbody>
                {supplementInteractions.map((interaction, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {interaction.supp_a}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {interaction.supp_b}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${interactionBadgeClasses(interaction.interaction_type)}`}
                      >
                        {interaction.interaction_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {timingLabel(interaction.timing)}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                      {interaction.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Medical disclaimer */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MedicalDisclaimer />
        </div>
      </section>

      {/* Email capture */}
      <section className="border-t border-gray-100 bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>
    </div>
  )
}
