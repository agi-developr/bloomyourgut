"use client"

import { useState } from "react"
import { Activity, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const bristolScale = [
  { type: 1, label: "Separate hard lumps", description: "Hard to pass" },
  { type: 2, label: "Lumpy sausage", description: "Sausage-shaped but lumpy" },
  { type: 3, label: "Cracked sausage", description: "Like a sausage with cracks" },
  { type: 4, label: "Smooth snake", description: "Smooth and soft (ideal)" },
  { type: 5, label: "Soft blobs", description: "Soft blobs with clear edges" },
  { type: 6, label: "Fluffy pieces", description: "Mushy consistency" },
  { type: 7, label: "Watery", description: "Entirely liquid" },
]

const placeholderHistory = [
  { date: "Feb 9", bloating: 4, pain: 2, energy: 7, gas: 3, mood: 7, stool: 4 },
  { date: "Feb 8", bloating: 5, pain: 3, energy: 6, gas: 4, mood: 6, stool: 3 },
  { date: "Feb 7", bloating: 3, pain: 1, energy: 8, gas: 2, mood: 8, stool: 4 },
  { date: "Feb 6", bloating: 6, pain: 4, energy: 5, gas: 5, mood: 5, stool: 5 },
  { date: "Feb 5", bloating: 4, pain: 2, energy: 7, gas: 3, mood: 7, stool: 4 },
  { date: "Feb 4", bloating: 7, pain: 5, energy: 4, gas: 6, mood: 4, stool: 6 },
  { date: "Feb 3", bloating: 3, pain: 2, energy: 8, gas: 2, mood: 8, stool: 4 },
]

export default function SymptomsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [bloating, setBloating] = useState([5])
  const [pain, setPain] = useState([3])
  const [energy, setEnergy] = useState([7])
  const [gas, setGas] = useState([4])
  const [mood, setMood] = useState([6])
  const [stoolType, setStoolType] = useState<number | null>(null)
  const [notes, setNotes] = useState("")

  function handleSave() {
    // TODO: Save to Supabase
    console.log({
      date,
      bloating: bloating[0],
      pain: pain[0],
      energy: energy[0],
      gas: gas[0],
      mood: mood[0],
      stool_type: stoolType,
      notes,
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Activity className="h-7 w-7 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Symptom Tracker</h1>
          <p className="text-sm text-gray-500">
            Log how you&apos;re feeling today
          </p>
        </div>
      </div>

      {/* Date selector */}
      <div className="mb-6">
        <Label htmlFor="symptom-date" className="text-sm font-medium">
          Date
        </Label>
        <Input
          id="symptom-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 max-w-xs"
        />
      </div>

      {/* Symptom sliders */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Symptoms</CardTitle>
          <CardDescription>
            Rate each symptom from 0 (none) to 10 (severe)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { label: "Bloating", value: bloating, onChange: setBloating, color: "text-blue-600" },
            { label: "Pain", value: pain, onChange: setPain, color: "text-red-600" },
            { label: "Energy", value: energy, onChange: setEnergy, color: "text-amber-600" },
            { label: "Gas", value: gas, onChange: setGas, color: "text-purple-600" },
            { label: "Mood", value: mood, onChange: setMood, color: "text-green-600" },
          ].map((symptom) => (
            <div key={symptom.label}>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">{symptom.label}</Label>
                <span className={`text-sm font-bold ${symptom.color}`}>
                  {symptom.value[0]}/10
                </span>
              </div>
              <Slider
                value={symptom.value}
                onValueChange={symptom.onChange}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bristol stool scale */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Bristol Stool Scale</CardTitle>
          <CardDescription>
            Select the type that best matches (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {bristolScale.map((item) => (
              <button
                key={item.type}
                onClick={() => setStoolType(item.type)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  stoolType === item.type
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      stoolType === item.type
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    Type {item.type}
                  </span>
                  {item.type === 4 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-[10px]"
                    >
                      Ideal
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional notes about how you're feeling today..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Save button */}
      <Button
        onClick={handleSave}
        className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Symptoms
      </Button>

      {/* History */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Last 7 Days
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Date
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Bloating
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Pain
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Energy
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Gas
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Mood
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">
                  Stool
                </th>
              </tr>
            </thead>
            <tbody>
              {placeholderHistory.map((row) => (
                <tr key={row.date} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {row.date}
                  </td>
                  <td className="px-3 py-2 text-center">{row.bloating}</td>
                  <td className="px-3 py-2 text-center">{row.pain}</td>
                  <td className="px-3 py-2 text-center">{row.energy}</td>
                  <td className="px-3 py-2 text-center">{row.gas}</td>
                  <td className="px-3 py-2 text-center">{row.mood}</td>
                  <td className="px-3 py-2 text-center">Type {row.stool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
