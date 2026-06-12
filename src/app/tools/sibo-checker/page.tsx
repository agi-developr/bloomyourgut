"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { siboSymptoms } from "@/lib/data/sibo-symptoms"

const categoryColors: Record<string, string> = {
  Digestive: "bg-orange-100 text-orange-800",
  Neurological: "bg-purple-100 text-purple-800",
  Systemic: "bg-blue-100 text-blue-800",
  Immune: "bg-red-100 text-red-800",
  Dermatological: "bg-pink-100 text-pink-800",
  Metabolic: "bg-teal-100 text-teal-800",
}

function getSeverityLabel(score: number): { label: string; color: string; description: string } {
  if (score <= 2) return { label: "Minimal", color: "text-green-600", description: "Your symptoms are very mild. Continue monitoring and maintaining gut-friendly habits." }
  if (score <= 4) return { label: "Mild", color: "text-yellow-600", description: "Some symptoms present. Consider dietary adjustments and tracking triggers." }
  if (score <= 6) return { label: "Moderate", color: "text-orange-600", description: "Noticeable symptoms affecting quality of life. A low-FODMAP trial and targeted supplements may help." }
  if (score <= 8) return { label: "Significant", color: "text-red-600", description: "Multiple symptoms at concerning levels. Consider SIBO breath testing and professional evaluation." }
  return { label: "Severe", color: "text-red-800", description: "High symptom burden. Strongly recommend consulting a gastroenterologist or functional medicine practitioner for testing and treatment." }
}

export default function SiboCheckerPage() {
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(siboSymptoms.map((s) => [s.symptom, 0]))
  )

  const updateRating = (symptom: string, value: number) => {
    setRatings((prev) => ({ ...prev, [symptom]: value }))
  }

  const { totalScore, activeSymptoms, topTriggers, topRelief } = useMemo(() => {
    const active = siboSymptoms.filter((s) => ratings[s.symptom] > 0)
    const total = active.length > 0
      ? active.reduce((sum, s) => sum + ratings[s.symptom], 0) / active.length
      : 0

    const sorted = [...active].sort((a, b) => ratings[b.symptom] - ratings[a.symptom])
    const triggers = sorted
      .slice(0, 3)
      .flatMap((s) => s.common_triggers.split(", "))
    const relief = sorted
      .slice(0, 5)
      .flatMap((s) => s.relief_methods.split(", "))

    const uniqueTriggers = [...new Set(triggers)].slice(0, 6)
    const uniqueRelief = [...new Set(relief)].slice(0, 6)

    return {
      totalScore: Math.round(total * 10) / 10,
      activeSymptoms: active.length,
      topTriggers: uniqueTriggers,
      topRelief: uniqueRelief,
    }
  }, [ratings])

  const severity = getSeverityLabel(totalScore)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-green-600"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">SIBO Symptom Checker</h1>
      <p className="mt-2 text-gray-600">
        Rate each symptom from 0 (none) to 10 (severe) to get a personalized severity assessment
        with trigger identification and relief recommendations.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          This is not a diagnostic tool. SIBO requires breath testing for diagnosis. Use this to
          track symptoms and inform conversations with your healthcare provider.
        </span>
      </div>

      {/* Score summary */}
      <Card className="mt-6 border-gray-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="text-center">
              <div className={`text-5xl font-bold ${severity.color}`}>{totalScore}</div>
              <div className={`text-sm font-medium ${severity.color}`}>{severity.label}</div>
              <div className="text-xs text-gray-400">{activeSymptoms}/15 symptoms rated</div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">{severity.description}</p>

              {topTriggers.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-500">Top Triggers</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {topTriggers.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {topRelief.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-500">Suggested Relief</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {topRelief.map((r) => (
                      <Badge key={r} className="bg-green-100 text-xs text-green-800">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symptom sliders */}
      <div className="mt-8 space-y-4">
        {siboSymptoms.map((symptom) => (
          <Card key={symptom.symptom} className="border-gray-100">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{symptom.symptom}</span>
                    <Badge className={`text-xs ${categoryColors[symptom.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {symptom.category}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {symptom.affected_pct}% of SIBO patients report this
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {ratings[symptom.symptom]}
                </span>
              </div>
              <Slider
                value={[ratings[symptom.symptom]]}
                onValueChange={([v]) => updateRating(symptom.symptom, v)}
                max={10}
                step={1}
                className="mt-3"
              />
              {ratings[symptom.symptom] > 0 && (
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">Triggers: </span>
                    {symptom.common_triggers}
                  </div>
                  <div>
                    <span className="text-gray-400">Relief: </span>
                    {symptom.relief_methods}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-12 text-xs text-gray-400">
        This tool is for educational purposes only and does not constitute medical advice.
        SIBO diagnosis requires a lactulose or glucose breath test administered by a healthcare provider.
      </p>
    </div>
  )
}
