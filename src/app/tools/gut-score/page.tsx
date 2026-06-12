"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

const factors = [
  { key: "diet_diversity", label: "Diet Diversity", description: "Variety of whole foods consumed weekly" },
  { key: "fiber_intake", label: "Fiber Intake", description: "Daily fiber from vegetables, fruits, whole grains" },
  { key: "fermented_foods", label: "Fermented Foods", description: "Regular consumption of yogurt, kimchi, sauerkraut, etc." },
  { key: "exercise", label: "Exercise", description: "Regular physical activity (150+ min/week moderate)" },
  { key: "sleep_quality", label: "Sleep Quality", description: "Consistent 7-9 hours of restorative sleep" },
  { key: "stress_management", label: "Stress Management", description: "Active stress reduction practices" },
  { key: "hydration", label: "Hydration", description: "Adequate daily water intake (2-3L)" },
  { key: "antibiotic_avoidance", label: "Antibiotic Avoidance", description: "Minimal unnecessary antibiotic use" },
  { key: "prebiotic_intake", label: "Prebiotic Intake", description: "Regular prebiotic foods (garlic, onion, asparagus, banana)" },
  { key: "nature_exposure", label: "Nature Exposure", description: "Time outdoors, contact with soil and natural environments" },
]

function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score <= 3) return { label: "Needs Attention", color: "text-red-600", description: "Your lifestyle factors suggest low microbiome diversity. Focus on diet diversity, fermented foods, and stress management for the biggest impact." }
  if (score <= 5) return { label: "Developing", color: "text-yellow-600", description: "Some good habits in place. Increasing fiber, fermented foods, and exercise would meaningfully improve your gut diversity." }
  if (score <= 7) return { label: "Good", color: "text-green-600", description: "Strong foundation for microbiome health. Fine-tune the lower-scoring areas for further improvement." }
  return { label: "Excellent", color: "text-emerald-600", description: "Your lifestyle strongly supports gut microbiome diversity. Maintain these habits and continue exploring new whole foods." }
}

export default function GutScorePage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(factors.map((f) => [f.key, 5]))
  )

  const updateValue = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const { totalScore, chartData } = useMemo(() => {
    const total = Object.values(values).reduce((sum, v) => sum + v, 0) / factors.length
    const data = factors.map((f) => ({
      factor: f.label.length > 12 ? f.label.slice(0, 12) + "..." : f.label,
      fullLabel: f.label,
      value: values[f.key],
    }))
    return { totalScore: Math.round(total * 10) / 10, chartData: data }
  }, [values])

  const scoreInfo = getScoreLabel(totalScore)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-green-600"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Gut Microbiome Diversity Score</h1>
      <p className="mt-2 text-gray-600">
        Rate 10 lifestyle factors that influence gut microbiome diversity. Your radar chart updates
        in real time.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Based on published research linking lifestyle factors to microbiome diversity. This is an
          estimate — actual microbiome composition requires stool testing.
        </span>
      </div>

      {/* Score + Radar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-100">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className={`text-6xl font-bold ${scoreInfo.color}`}>{totalScore}</div>
            <div className={`text-lg font-medium ${scoreInfo.color}`}>{scoreInfo.label}</div>
            <p className="mt-3 text-center text-sm text-gray-600">{scoreInfo.description}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Factor sliders */}
      <div className="mt-8 space-y-4">
        {factors.map((factor) => (
          <Card key={factor.key} className="border-gray-100">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-medium text-gray-900">{factor.label}</span>
                  <p className="text-xs text-gray-500">{factor.description}</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">{values[factor.key]}</span>
              </div>
              <Slider
                value={[values[factor.key]]}
                onValueChange={([v]) => updateValue(factor.key, v)}
                max={10}
                step={1}
                className="mt-3"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-12 text-xs text-gray-400">
        This tool provides a lifestyle-based estimate of microbiome diversity support. For accurate
        microbiome assessment, consider professional stool testing services. This does not constitute
        medical advice.
      </p>
    </div>
  )
}
