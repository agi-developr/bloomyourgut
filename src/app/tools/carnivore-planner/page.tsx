"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, X, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { carnivoreFoods, type CarnivoreFood } from "@/lib/data/carnivore-foods"

const histamineColors = {
  none: "bg-green-100 text-green-800",
  low: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

type MealItem = { food: CarnivoreFood; grams: number }

export default function CarnivorePlannerPage() {
  const [search, setSearch] = useState("")
  const [histamineFilter, setHistamineFilter] = useState(false)
  const [meal, setMeal] = useState<MealItem[]>([])

  const filtered = useMemo(() => {
    return carnivoreFoods.filter((f) => {
      const matchesSearch = f.food.toLowerCase().includes(search.toLowerCase())
      const matchesHistamine =
        !histamineFilter || f.histamine_risk === "none" || f.histamine_risk === "low"
      return matchesSearch && matchesHistamine
    })
  }, [search, histamineFilter])

  const addToMeal = (food: CarnivoreFood) => {
    setMeal((prev) => {
      const existing = prev.find((m) => m.food.food === food.food)
      if (existing) return prev
      return [...prev, { food, grams: 200 }]
    })
  }

  const removeFromMeal = (foodName: string) => {
    setMeal((prev) => prev.filter((m) => m.food.food !== foodName))
  }

  const updateGrams = (foodName: string, grams: number) => {
    setMeal((prev) =>
      prev.map((m) => (m.food.food === foodName ? { ...m, grams: Math.max(0, grams) } : m))
    )
  }

  const totals = useMemo(() => {
    return meal.reduce(
      (acc, item) => {
        const multiplier = item.grams / 100
        return {
          calories: acc.calories + item.food.calories_per_100g * multiplier,
          protein: acc.protein + item.food.protein_g * multiplier,
          fat: acc.fat + item.food.fat_g * multiplier,
          carbs: acc.carbs + item.food.carbs_g * multiplier,
        }
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    )
  }, [meal])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-green-600"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Carnivore Diet Meal Planner</h1>
      <p className="mt-2 text-gray-600">
        Browse carnivore-friendly foods with full macros, histamine risk, and bioavailability
        scores. Add foods to build a meal with live macro totals.
      </p>

      {/* Meal builder */}
      {meal.length > 0 && (
        <Card className="mt-6 border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Meal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meal.map((item) => (
              <div key={item.food.food} className="flex items-center gap-3">
                <button
                  onClick={() => removeFromMeal(item.food.food)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="flex-1 text-sm font-medium text-gray-900">{item.food.food}</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={item.grams}
                    onChange={(e) => updateGrams(item.food.food, parseInt(e.target.value) || 0)}
                    className="w-20 text-right text-sm"
                  />
                  <span className="text-xs text-gray-400">g</span>
                </div>
                <span className="w-16 text-right text-xs text-gray-500">
                  {Math.round((item.food.calories_per_100g * item.grams) / 100)} cal
                </span>
              </div>
            ))}

            <div className="border-t border-green-200 pt-3">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{Math.round(totals.calories)}</div>
                  <div className="text-xs text-gray-500">Calories</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{Math.round(totals.protein)}g</div>
                  <div className="text-xs text-gray-500">Protein</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">{Math.round(totals.fat)}g</div>
                  <div className="text-xs text-gray-500">Fat</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{Math.round(totals.carbs)}g</div>
                  <div className="text-xs text-gray-500">Carbs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <Switch checked={histamineFilter} onCheckedChange={setHistamineFilter} />
          <span className="text-sm text-gray-600">Low histamine only</span>
        </div>
      </div>

      {/* Food library */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((food) => {
          const inMeal = meal.some((m) => m.food.food === food.food)
          return (
            <Card key={food.food} className={`border-gray-100 ${inMeal ? "ring-2 ring-green-300" : ""}`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{food.food}</div>
                    <div className="text-xs text-gray-400">{food.category}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={inMeal ? "outline" : "default"}
                    onClick={() => (inMeal ? removeFromMeal(food.food) : addToMeal(food))}
                    className={inMeal ? "" : "bg-green-600 hover:bg-green-700"}
                  >
                    {inMeal ? (
                      <X className="mr-1 h-3 w-3" />
                    ) : (
                      <Plus className="mr-1 h-3 w-3" />
                    )}
                    {inMeal ? "Remove" : "Add"}
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="font-medium text-gray-900">{food.calories_per_100g}</div>
                    <div className="text-gray-400">cal/100g</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-600">{food.protein_g}g</div>
                    <div className="text-gray-400">protein</div>
                  </div>
                  <div>
                    <div className="font-medium text-amber-600">{food.fat_g}g</div>
                    <div className="text-gray-400">fat</div>
                  </div>
                  <div>
                    <div className="font-medium text-green-600">{food.carbs_g}g</div>
                    <div className="text-gray-400">carbs</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className={`text-xs ${histamineColors[food.histamine_risk]}`}>
                    {food.histamine_risk === "none" ? "No" : food.histamine_risk} histamine
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Bio: {food.bioavailability}/10
                  </Badge>
                  {food.omega3_score >= 1 && (
                    <Badge className="bg-blue-100 text-xs text-blue-800">
                      Omega-3: {food.omega3_score}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="mt-12 text-xs text-gray-400">
        Nutritional values are approximate per 100g. The carnivore diet is a restrictive elimination
        protocol — consult a healthcare provider before starting, especially if managing SIBO or
        other gut conditions.
      </p>
    </div>
  )
}
