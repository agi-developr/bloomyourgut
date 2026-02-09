"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Pill, Save, Clock } from "lucide-react"
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

type Timing = "morning" | "afternoon" | "evening" | "with_meal" | "empty_stomach"

const timingLabels: Record<Timing, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  with_meal: "With Meal",
  empty_stomach: "Empty Stomach",
}

const timingColors: Record<Timing, string> = {
  morning: "bg-amber-50 text-amber-700",
  afternoon: "bg-blue-50 text-blue-700",
  evening: "bg-indigo-50 text-indigo-700",
  with_meal: "bg-green-50 text-green-700",
  empty_stomach: "bg-orange-50 text-orange-700",
}

interface SupplementEntry {
  id: string
  name: string
  dose: string
  timing: Timing
  notes: string
}

const placeholderSupplements: SupplementEntry[] = [
  {
    id: "1",
    name: "Probiotics (Lactobacillus rhamnosus)",
    dose: "50 Billion CFU",
    timing: "morning",
    notes: "Taken on empty stomach with water",
  },
  {
    id: "2",
    name: "L-Glutamine",
    dose: "5g",
    timing: "empty_stomach",
    notes: "",
  },
  {
    id: "3",
    name: "Digestive Enzymes",
    dose: "1 capsule",
    timing: "with_meal",
    notes: "Taken with lunch",
  },
]

export default function SupplementsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [supplementName, setSupplementName] = useState("")
  const [dose, setDose] = useState("")
  const [timing, setTiming] = useState<Timing>("morning")
  const [notes, setNotes] = useState("")
  const [supplements, setSupplements] = useState<SupplementEntry[]>(placeholderSupplements)

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/supplements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          supplement: supplementName,
          dose: dose || null,
          timing,
          notes: notes || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      const data = await res.json()
      toast.success('Supplement saved successfully!')
      setSupplements(prev => [{ id: data.supplement.id || Date.now().toString(), name: supplementName, dose, timing, notes }, ...prev])
      setSupplementName('')
      setDose('')
      setNotes('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save supplement')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Pill className="h-7 w-7 text-purple-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Supplement Logger
          </h1>
          <p className="text-sm text-gray-500">
            Track your supplement intake and timing
          </p>
        </div>
      </div>

      {/* Date selector */}
      <div className="mb-6">
        <Label htmlFor="supp-date" className="text-sm font-medium">
          Date
        </Label>
        <Input
          id="supp-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 max-w-xs"
        />
      </div>

      {/* Log form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Log a Supplement</CardTitle>
          <CardDescription>
            Record your supplement, dosage, and timing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Supplement name */}
            <div>
              <Label className="text-sm font-medium">Supplement Name</Label>
              <Input
                placeholder="e.g., Probiotics, L-Glutamine"
                value={supplementName}
                onChange={(e) => setSupplementName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Dose */}
            <div>
              <Label className="text-sm font-medium">Dose</Label>
              <Input
                placeholder="e.g., 5g, 50B CFU, 1 capsule"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Timing */}
          <div>
            <Label className="text-sm font-medium">Timing</Label>
            <Select
              value={timing}
              onValueChange={(v) => setTiming(v as Timing)}
            >
              <SelectTrigger className="mt-1 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="with_meal">With Meal</SelectItem>
                <SelectItem value="empty_stomach">Empty Stomach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              placeholder="Any reactions or observations..."
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
        disabled={!supplementName.trim() || saving}
        className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Supplement'}
      </Button>

      {/* Today's supplements */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Today&apos;s Supplements
        </h2>
        {supplements.length > 0 ? (
          <div className="space-y-3">
            {supplements.map((supp) => (
              <Card key={supp.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                        <Pill className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {supp.name}
                        </p>
                        <p className="text-sm text-gray-500">{supp.dose}</p>
                        {supp.notes && (
                          <p className="mt-1 text-xs text-gray-400">
                            {supp.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-1 ${timingColors[supp.timing]}`}
                    >
                      <Clock className="h-3 w-3" />
                      {timingLabels[supp.timing]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">
            No supplements logged today. Start by adding one above.
          </div>
        )}
      </div>
    </div>
  )
}
