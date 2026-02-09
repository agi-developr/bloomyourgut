"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface GutScoreDisplayProps {
  score: number
  trend?: "up" | "down" | "stable"
  size?: "sm" | "md" | "lg"
  components?: {
    symptom_avg: number
    trend: number
    consistency: number
    food_diversity: number
  }
}

function getScoreColor(score: number): string {
  if (score < 30) return "text-red-500"
  if (score < 60) return "text-amber-500"
  return "text-green-500"
}

function getScoreBg(score: number): string {
  if (score < 30) return "bg-red-50 border-red-200"
  if (score < 60) return "bg-amber-50 border-amber-200"
  return "bg-green-50 border-green-200"
}

function getScoreRing(score: number): string {
  if (score < 30) return "stroke-red-500"
  if (score < 60) return "stroke-amber-500"
  return "stroke-green-500"
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-5 w-5 text-green-500" />
    case "down":
      return <TrendingDown className="h-5 w-5 text-red-500" />
    default:
      return <Minus className="h-5 w-5 text-gray-400" />
  }
}

export function GutScoreDisplay({
  score,
  trend = "stable",
  size = "md",
  components,
}: GutScoreDisplayProps) {
  const sizeMap = {
    sm: { container: "h-24 w-24", text: "text-2xl", label: "text-[10px]", radius: 38, stroke: 5 },
    md: { container: "h-36 w-36", text: "text-4xl", label: "text-xs", radius: 58, stroke: 6 },
    lg: { container: "h-48 w-48", text: "text-5xl", label: "text-sm", radius: 78, stroke: 8 },
  }

  const s = sizeMap[size]
  const circumference = 2 * Math.PI * s.radius
  const progress = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular score */}
      <div className={`relative ${s.container}`}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={s.radius}
            fill="none"
            strokeWidth={s.stroke}
            className="stroke-gray-100"
          />
          <circle
            cx="100"
            cy="100"
            r={s.radius}
            fill="none"
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={`transition-all duration-700 ${getScoreRing(score)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${s.text} ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className={`${s.label} text-gray-400`}>GutScore</span>
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <TrendIcon trend={trend} />
        <span className="text-sm text-gray-500 capitalize">{trend}</span>
      </div>

      {/* Component breakdown */}
      {components && (
        <div className="mt-2 grid w-full max-w-xs grid-cols-2 gap-3">
          {[
            { label: "Symptom Severity", value: components.symptom_avg },
            { label: "Trend", value: components.trend },
            { label: "Consistency", value: components.consistency },
            { label: "Food Diversity", value: components.food_diversity },
          ].map((comp) => (
            <div
              key={comp.label}
              className={`rounded-lg border p-2 text-center ${getScoreBg(comp.value * 4)}`}
            >
              <div className={`text-lg font-bold ${getScoreColor(comp.value * 4)}`}>
                {comp.value}
                <span className="text-xs text-gray-400">/25</span>
              </div>
              <div className="text-[10px] text-gray-500">{comp.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
