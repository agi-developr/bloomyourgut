"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowLeft, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fodmapFoods, type FodmapFood } from "@/lib/data/fodmap-foods"

const levelColors = {
  low: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const fodmapTypes = [
  { key: "fructose" as const, label: "Fructose", color: "bg-orange-400" },
  { key: "lactose" as const, label: "Lactose", color: "bg-blue-400" },
  { key: "fructans" as const, label: "Fructans", color: "bg-purple-400" },
  { key: "galactans" as const, label: "GOS", color: "bg-pink-400" },
  { key: "polyols" as const, label: "Polyols", color: "bg-teal-400" },
]

const categories = ["All", ...Array.from(new Set(fodmapFoods.map((f) => f.category))).sort()]

function FodmapBar({ food }: { food: FodmapFood }) {
  const total = food.fructose + food.lactose + food.fructans + food.galactans + food.polyols
  if (total === 0) return <span className="text-xs text-gray-400">No FODMAPs detected</span>

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
      {fodmapTypes.map((type) => {
        const value = food[type.key]
        if (value === 0) return null
        return (
          <div
            key={type.key}
            className={`${type.color} transition-all`}
            style={{ width: `${(value / total) * 100}%` }}
            title={`${type.label}: ${value}/10`}
          />
        )
      })}
    </div>
  )
}

export default function FodmapScorerPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [levelFilter, setLevelFilter] = useState<string>("All")

  const filtered = useMemo(() => {
    return fodmapFoods.filter((f) => {
      const matchesSearch = f.food.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "All" || f.category === category
      const matchesLevel = levelFilter === "All" || f.fodmap_level === levelFilter
      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [search, category, levelFilter])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-green-600"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">FODMAP Food Risk Scorer</h1>
      <p className="mt-2 text-gray-600">
        Search foods to check their FODMAP risk level, safe serving sizes, and which FODMAP
        categories they contain.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          FODMAP scores are on a 0-10 scale per category. Higher = more likely to trigger symptoms.
        </span>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {fodmapTypes.map((type) => (
          <div key={type.key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className={`h-3 w-3 rounded-full ${type.color}`} />
            {type.label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="All">All Levels</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mt-2 text-sm text-gray-400">{filtered.length} foods</div>

      {/* Food cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((food) => (
          <Card key={food.food} className="border-gray-100">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{food.food}</CardTitle>
                  <span className="text-xs text-gray-400">{food.category}</span>
                </div>
                <Badge className={levelColors[food.fodmap_level]}>{food.fodmap_level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <FodmapBar food={food} />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Serving: </span>
                  <span className="text-gray-700">{food.serving_size}</span>
                </div>
                <div>
                  <span className="text-gray-400">Safe amount: </span>
                  <span className="font-medium text-gray-700">{food.safe_amount}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{food.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-gray-400">
          No foods match your search. Try a different term.
        </div>
      )}

      <p className="mt-12 text-xs text-gray-400">
        This tool is for educational purposes only and does not constitute medical advice. Consult a
        registered dietitian for personalized FODMAP guidance.
      </p>
    </div>
  )
}
