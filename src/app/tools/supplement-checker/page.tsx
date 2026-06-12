"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, CheckCircle, MinusCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  supplementInteractions,
  allSupplements,
  type SupplementInteraction,
} from "@/lib/data/supplement-interactions"

const typeConfig = {
  synergistic: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
    label: "Synergistic",
  },
  neutral: {
    icon: MinusCircle,
    color: "bg-gray-100 text-gray-700",
    borderColor: "border-gray-200",
    label: "Neutral",
  },
  caution: {
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-200",
    label: "Caution",
  },
  avoid: {
    icon: XCircle,
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-200",
    label: "Avoid",
  },
}

const timingLabels: Record<string, string> = {
  together: "Take together",
  separate_30min: "Separate by 30 min",
  separate_2hr: "Separate by 2 hours",
  separate_4hr: "Separate by 4 hours",
  never: "Never combine",
}

function InteractionCard({ interaction }: { interaction: SupplementInteraction }) {
  const config = typeConfig[interaction.interaction_type]
  const Icon = config.icon

  return (
    <Card className={`border ${config.borderColor}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900">
                {interaction.supp_a} + {interaction.supp_b}
              </div>
              <div className="text-xs text-gray-500">
                {timingLabels[interaction.timing] ?? interaction.timing}
              </div>
            </div>
          </div>
          <Badge className={config.color}>{config.label}</Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600">{interaction.explanation}</p>
      </CardContent>
    </Card>
  )
}

export default function SupplementCheckerPage() {
  const [suppA, setSuppA] = useState("")
  const [suppB, setSuppB] = useState("")

  const results = useMemo(() => {
    if (!suppA && !suppB) return supplementInteractions

    return supplementInteractions.filter((i) => {
      const matchA = !suppA || i.supp_a === suppA || i.supp_b === suppA
      const matchB = !suppB || i.supp_a === suppB || i.supp_b === suppB
      return matchA && matchB
    })
  }, [suppA, suppB])

  const grouped = useMemo(() => {
    const groups: Record<string, SupplementInteraction[]> = {
      avoid: [],
      caution: [],
      neutral: [],
      synergistic: [],
    }
    for (const r of results) {
      groups[r.interaction_type].push(r)
    }
    return groups
  }, [results])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-green-600"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Supplement Interaction Checker</h1>
      <p className="mt-2 text-gray-600">
        Check how gut health supplements interact with each other. Find synergies, timing conflicts,
        and combinations to avoid.
      </p>

      {/* Selectors */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={suppA}
          onChange={(e) => setSuppA(e.target.value)}
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">Select first supplement...</option>
          {allSupplements.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="self-center text-sm text-gray-400">+</span>
        <select
          value={suppB}
          onChange={(e) => setSuppB(e.target.value)}
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">Select second supplement...</option>
          {allSupplements.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {(suppA || suppB) && (
        <button
          onClick={() => {
            setSuppA("")
            setSuppB("")
          }}
          className="mt-2 text-sm text-green-600 hover:underline"
        >
          Clear filters
        </button>
      )}

      {/* Summary */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {(["avoid", "caution", "neutral", "synergistic"] as const).map((type) => {
          const config = typeConfig[type]
          return (
            <div key={type} className={`rounded-lg p-3 text-center ${config.color}`}>
              <div className="text-2xl font-bold">{grouped[type].length}</div>
              <div className="text-xs">{config.label}</div>
            </div>
          )
        })}
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3">
        {results.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No interactions found for this combination.
          </div>
        ) : (
          results.map((i, idx) => <InteractionCard key={idx} interaction={i} />)
        )}
      </div>

      <p className="mt-12 text-xs text-gray-400">
        This tool is for educational purposes only. Always consult your healthcare provider before
        starting or combining supplements.
      </p>
    </div>
  )
}
