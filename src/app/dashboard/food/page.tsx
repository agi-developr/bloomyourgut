"use client"

import { useState, type KeyboardEvent } from "react"
import { toast } from "sonner"
import { Utensils, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type MealType = "breakfast" | "lunch" | "dinner" | "snack"

interface MealEntry {
  id: string
  mealType: MealType
  foods: string[]
  notes: string
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
}

const mealTypeColors: Record<MealType, string> = {
  breakfast: "bg-amber-50 text-amber-700",
  lunch: "bg-green-50 text-green-700",
  dinner: "bg-blue-50 text-blue-700",
  snack: "bg-purple-50 text-purple-700",
}

// Placeholder today's meals
const placeholderMeals: MealEntry[] = [
  {
    id: "1",
    mealType: "breakfast",
    foods: ["Oatmeal", "Blueberries", "Almond butter", "Banana"],
    notes: "Had with warm water and lemon before",
  },
  {
    id: "2",
    mealType: "lunch",
    foods: ["Chicken breast", "Brown rice", "Steamed broccoli", "Avocado"],
    notes: "",
  },
]

export default function FoodDiaryPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [mealType, setMealType] = useState<MealType>("lunch")
  const [foods, setFoods] = useState<string[]>([])
  const [foodInput, setFoodInput] = useState("")
  const [notes, setNotes] = useState("")
  const [meals, setMeals] = useState<MealEntry[]>(placeholderMeals)

  function handleAddFood(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && foodInput.trim()) {
      e.preventDefault()
      if (!foods.includes(foodInput.trim())) {
        setFoods([...foods, foodInput.trim()])
      }
      setFoodInput("")
    }
  }

  function handleRemoveFood(food: string) {
    setFoods(foods.filter((f) => f !== food))
  }

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meal_type: mealType,
          foods,
          notes: notes || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      const data = await res.json()
      toast.success('Meal saved successfully!')
      // Add to today's meals display
      setMeals(prev => [{ id: data.food.id || Date.now().toString(), mealType, foods: [...foods], notes }, ...prev])
      setFoods([])
      setNotes('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save meal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Utensils className="h-7 w-7 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Diary</h1>
          <p className="text-sm text-gray-500">
            Track what you eat to identify triggers and patterns
          </p>
        </div>
      </div>

      {/* Date selector */}
      <div className="mb-6">
        <Label htmlFor="food-date" className="text-sm font-medium">
          Date
        </Label>
        <Input
          id="food-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 max-w-xs"
        />
      </div>

      {/* Log form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Log a Meal</CardTitle>
          <CardDescription>
            Select the meal type and add foods you ate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meal type */}
          <div>
            <Label className="text-sm font-medium">Meal Type</Label>
            <Select
              value={mealType}
              onValueChange={(v) => setMealType(v as MealType)}
            >
              <SelectTrigger className="mt-1 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Foods input */}
          <div>
            <Label className="text-sm font-medium">
              Foods (press Enter to add)
            </Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                placeholder="e.g., Chicken breast"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={handleAddFood}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (foodInput.trim() && !foods.includes(foodInput.trim())) {
                    setFoods([...foods, foodInput.trim()])
                    setFoodInput("")
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {foods.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {foods.map((food) => (
                  <Badge
                    key={food}
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-50 text-green-700"
                  >
                    {food}
                    <button
                      onClick={() => handleRemoveFood(food)}
                      className="ml-0.5 rounded-full hover:bg-green-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              placeholder="How did this meal make you feel? Any reactions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={foods.length === 0 || saving}
        className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Meal'}
      </Button>

      {/* Today's meals */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Today&apos;s Meals
        </h2>
        {meals.length > 0 ? (
          <div className="space-y-4">
            {meals.map((meal) => (
              <Card key={meal.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant="secondary"
                        className={mealTypeColors[meal.mealType]}
                      >
                        {mealTypeLabels[meal.mealType]}
                      </Badge>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {meal.foods.map((food) => (
                          <span
                            key={food}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                      {meal.notes && (
                        <p className="mt-2 text-xs text-gray-400">
                          {meal.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">
            No meals logged today. Start by adding one above.
          </div>
        )}
      </div>
    </div>
  )
}
