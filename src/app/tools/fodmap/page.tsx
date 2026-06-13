"use client"

import { useState, useMemo } from "react"
import { Search, UtensilsCrossed } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailCapture } from "@/components/email-capture"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import fodmapFoods from "@/data/fodmap-foods.json"

const categories = [
  "All",
  ...Array.from(new Set(fodmapFoods.map((f) => f.category))).sort(),
]

function fodmapBadgeClasses(level: string) {
  switch (level) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200"
    case "moderate":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "low":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function fodmapValueColor(value: number) {
  if (value === 0) return "text-gray-300"
  if (value <= 3) return "text-amber-600"
  if (value <= 6) return "text-orange-600"
  return "text-red-600"
}

export default function FodmapPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = useMemo(() => {
    return fodmapFoods.filter((food) => {
      const matchesSearch = food.food
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory =
        category === "All" || food.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            FODMAP Reference
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            FODMAP Food Lookup
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Search foods and see their FODMAP content at a glance. Color-coded
            risk levels help you make quick decisions.
          </p>
        </div>
      </section>

      {/* Filters + Table */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category tabs */}
          <Tabs
            value={category}
            onValueChange={setCategory}
            className="mb-8"
          >
            <TabsList className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Food
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    FODMAP
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Fruct.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Lact.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Fruct-ans
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Galact.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Polyols
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-gray-900 md:table-cell">
                    Serving
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-gray-900 lg:table-cell">
                    Safe Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((food) => (
                  <tr
                    key={food.food}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {food.food}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {food.category}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${fodmapBadgeClasses(food.fodmap_level)}`}
                      >
                        {food.fodmap_level}
                      </Badge>
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-mono font-medium ${fodmapValueColor(food.fructose)}`}
                    >
                      {food.fructose}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-mono font-medium ${fodmapValueColor(food.lactose)}`}
                    >
                      {food.lactose}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-mono font-medium ${fodmapValueColor(food.fructans)}`}
                    >
                      {food.fructans}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-mono font-medium ${fodmapValueColor(food.galactans)}`}
                    >
                      {food.galactans}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-mono font-medium ${fodmapValueColor(food.polyols)}`}
                    >
                      {food.polyols}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                      {food.serving_size}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                      {food.safe_amount}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No foods match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            {filtered.length} of {fodmapFoods.length} foods shown. FODMAP
            values are relative intensity scores (0-10).
          </p>
        </div>
      </section>

      {/* Medical disclaimer */}
      <section className="bg-gray-50 py-12">
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
