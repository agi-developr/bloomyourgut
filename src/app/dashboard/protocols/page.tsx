"use client"

import { useState } from "react"
import {
  ClipboardList,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Crown,
  Pill,
  Utensils,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Protocol {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "paused"
  supplements: { name: string; dose: string; timing: string }[]
  dietRules: string[]
  durationWeeks: number
  startDate: string
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: Play },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-700", icon: Pause },
}

const placeholderProtocols: Protocol[] = [
  {
    id: "1",
    title: "SIBO Elimination Protocol",
    description:
      "A 6-week antimicrobial protocol targeting hydrogen-dominant SIBO with herbal antimicrobials and dietary modifications.",
    status: "active",
    supplements: [
      { name: "Berberine", dose: "500mg 2x/day", timing: "With meals" },
      { name: "Oregano Oil", dose: "200mg 2x/day", timing: "Between meals" },
      { name: "Allicin (Garlic Extract)", dose: "450mg 2x/day", timing: "With meals" },
      { name: "Prokinetic (Ginger)", dose: "1000mg at bedtime", timing: "Evening" },
    ],
    dietRules: [
      "Follow low FODMAP diet",
      "Avoid sugar and refined carbs",
      "Space meals 4-5 hours apart",
      "No snacking between meals",
      "Stop eating 3 hours before bed",
    ],
    durationWeeks: 6,
    startDate: "2026-01-15",
  },
  {
    id: "2",
    title: "Gut Repair Phase",
    description:
      "Post-antimicrobial gut lining repair protocol focusing on L-Glutamine and bone broth.",
    status: "paused",
    supplements: [
      { name: "L-Glutamine", dose: "5g 2x/day", timing: "Empty stomach" },
      { name: "Zinc Carnosine", dose: "75mg 2x/day", timing: "With meals" },
      { name: "Vitamin D3", dose: "5000 IU/day", timing: "Morning" },
    ],
    dietRules: [
      "Include bone broth daily",
      "Increase prebiotic foods gradually",
      "Avoid alcohol and NSAIDs",
    ],
    durationWeeks: 8,
    startDate: "2025-11-01",
  },
]

function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[protocol.status]
  const StatusIcon = config.icon

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{protocol.title}</h3>
              <Badge
                variant="secondary"
                className={`flex items-center gap-1 ${config.color}`}
              >
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {protocol.description}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {protocol.durationWeeks} weeks
              </span>
              <span className="flex items-center gap-1">
                <Pill className="h-3.5 w-3.5" />
                {protocol.supplements.length} supplements
              </span>
              <span className="flex items-center gap-1">
                <Utensils className="h-3.5 w-3.5" />
                {protocol.dietRules.length} diet rules
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
            {/* Supplements */}
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                <Pill className="h-4 w-4 text-purple-500" />
                Supplements
              </h4>
              <ul className="space-y-2">
                {protocol.supplements.map((supp, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-900">
                      {supp.name}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {supp.dose} &middot; {supp.timing}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diet rules */}
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                <Utensils className="h-4 w-4 text-orange-500" />
                Diet Rules
              </h4>
              <ul className="space-y-1.5">
                {protocol.dietRules.map((rule, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProtocolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-7 w-7 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Protocol Builder
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage your gut health protocols
            </p>
          </div>
        </div>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Protocol
        </Button>
      </div>

      {/* Pro badge notice */}
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="flex items-center gap-3 py-4">
          <Crown className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Pro Feature
            </p>
            <p className="text-xs text-amber-600">
              Protocol Builder is available on the Pro plan. You can view
              existing protocols but need Pro to create new ones.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Protocol list */}
      <div className="space-y-4">
        {placeholderProtocols.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </div>
    </div>
  )
}
