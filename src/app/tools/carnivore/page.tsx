"use client"

import { useState, useMemo } from "react"
import { Beef, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailCapture } from "@/components/email-capture"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import carnivoreFoods from "@/data/carnivore-foods.json"

const categories = [
  "All",
  ...Array.from(new Set(carnivoreFoods.map((f) => f.category))).sort(),
]

function histamineBadgeClasses(risk: string) {
  switch (risk) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200"
    case "moderate":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "low":
      return "bg-green-100 text-green-700 border-green-200"
    case "none":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export default function CarnivorePage() {
  const [category, setCategory] = useState("All")

  const filtered = useMemo(() => {
    if (category === "All") return carnivoreFoods
    return carnivoreFoods.filter((f) => f.category === category)
  }, [category])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Beef className="h-3.5 w-3.5" />
            Diet Reference
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Carnivore Diet Reference
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Nutrition data, histamine risk ratings, and SIBO safety flags for
            carnivore-friendly foods.
          </p>
        </div>
      </section>

      {/* Filters + Table */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Cal
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Protein
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Fat
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Histamine
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Bioavail.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    SIBO Safe
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
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {food.calories_per_100g}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {food.protein_g}g
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {food.fat_g}g
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${histamineBadgeClasses(food.histamine_risk)}`}
                      >
                        {food.histamine_risk}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{
                              width: `${(food.bioavailability / 10) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-500">
                          {food.bioavailability}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {food.sibo_safe === 1 ? (
                        <Check className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            {filtered.length} of {carnivoreFoods.length} foods shown. Nutrition
            values per 100g. Bioavailability scored 0-10.
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
