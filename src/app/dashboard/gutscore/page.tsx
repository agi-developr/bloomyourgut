"use client"

import { toast } from "sonner"
import { BarChart3, Info, Lightbulb } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GutScoreDisplay } from "@/components/gut-score-display"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const trendData = [
  { date: "Jan 10", score: 42 },
  { date: "Jan 13", score: 40 },
  { date: "Jan 16", score: 45 },
  { date: "Jan 19", score: 43 },
  { date: "Jan 22", score: 48 },
  { date: "Jan 25", score: 46 },
  { date: "Jan 28", score: 52 },
  { date: "Jan 31", score: 50 },
  { date: "Feb 3", score: 55 },
  { date: "Feb 6", score: 54 },
  { date: "Feb 9", score: 58 },
]

const insights = [
  {
    title: "Your bloating is trending down",
    description:
      "Over the past 2 weeks, your bloating scores have decreased from an average of 6.2 to 4.1. Keep tracking to maintain this improvement.",
    type: "positive" as const,
  },
  {
    title: "Consider increasing food diversity",
    description:
      "Your Food Diversity score is 14/25. Try adding 2-3 new vegetables this week to improve your microbiome diversity.",
    type: "suggestion" as const,
  },
  {
    title: "Strong consistency this week",
    description:
      "You've logged symptoms every day for the past 7 days. Consistent tracking leads to better insights and a higher GutScore.",
    type: "positive" as const,
  },
]

export default function GutScorePage() {
  const score = 58
  const components = {
    symptom_avg: 16,
    trend: 18,
    consistency: 10,
    food_diversity: 14,
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            GutScore Details
          </h1>
          <p className="text-sm text-gray-500">
            Your comprehensive gut health rating breakdown
          </p>
        </div>
      </div>

      {/* Info banner */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="flex items-center gap-3 py-3">
          <Info className="h-5 w-5 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-700">
            Your GutScore is calculated from your tracking data. Log symptoms, food, and supplements daily for the most accurate score.
          </p>
        </CardContent>
      </Card>

      {/* Big score display */}
      <Card className="mb-8">
        <CardContent className="py-8">
          <GutScoreDisplay
            score={score}
            trend="up"
            size="lg"
            components={components}
          />
        </CardContent>
      </Card>

      {/* 30-day trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">30-Day Trend</CardTitle>
          <CardDescription>
            Your GutScore over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Personalized tips based on your score components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-lg border p-4 ${
                  insight.type === "positive"
                    ? "border-green-100 bg-green-50"
                    : "border-amber-100 bg-amber-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    insight.type === "positive"
                      ? "text-green-800"
                      : "text-amber-800"
                  }`}
                >
                  {insight.title}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    insight.type === "positive"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How it's calculated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-500" />
            How is GutScore Calculated?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="overview">
            <AccordionItem value="overview">
              <AccordionTrigger className="text-sm font-medium">
                Overview
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Your GutScore is a composite metric (0-100) calculated from four
                equally weighted components, each worth up to 25 points. The
                score is recalculated daily based on your logged data from the
                past 14 days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="symptom">
              <AccordionTrigger className="text-sm font-medium">
                Symptom Severity (0-25)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Based on the inverse of your average symptom scores. Lower
                symptoms = higher score. We look at bloating, pain, gas, and
                other tracked symptoms over the past 14 days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="trend">
              <AccordionTrigger className="text-sm font-medium">
                Trend (0-25)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Measures whether your symptoms are improving, stable, or
                worsening over time. A consistent downward trend in symptoms
                earns a higher trend score.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="consistency">
              <AccordionTrigger className="text-sm font-medium">
                Consistency (0-25)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Rewards consistent daily logging. The more days you log symptoms,
                food, and supplements, the higher your consistency score. This
                encourages building healthy tracking habits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="diversity">
              <AccordionTrigger className="text-sm font-medium">
                Food Diversity (0-25)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Measures the variety of foods in your diet over the past 14 days.
                Research shows that eating 30+ different plant foods per week is
                associated with a healthier microbiome.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
