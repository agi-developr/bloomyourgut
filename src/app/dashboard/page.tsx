"use client"

import Link from "next/link"
import {
  Activity,
  Utensils,
  Pill,
  TrendingUp,
  BarChart3,
  FileText,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GutScoreDisplay } from "@/components/gut-score-display"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Placeholder chart data
const chartData = [
  { date: "Jan 10", score: 42 },
  { date: "Jan 15", score: 45 },
  { date: "Jan 20", score: 48 },
  { date: "Jan 25", score: 44 },
  { date: "Jan 30", score: 52 },
  { date: "Feb 4", score: 55 },
  { date: "Feb 9", score: 58 },
]

const recentActivity = [
  { type: "symptom", text: "Logged symptoms: Bloating 4/10, Energy 7/10", time: "2 hours ago" },
  { type: "food", text: "Logged lunch: Chicken salad, avocado, rice", time: "5 hours ago" },
  { type: "supplement", text: "Took: Probiotics 50B CFU, L-Glutamine 5g", time: "8 hours ago" },
  { type: "article", text: "Read: Understanding SIBO", time: "1 day ago" },
  { type: "symptom", text: "Logged symptoms: Bloating 3/10, Energy 8/10", time: "1 day ago" },
]

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "symptom":
      return <Activity className="h-4 w-4 text-blue-500" />
    case "food":
      return <Utensils className="h-4 w-4 text-orange-500" />
    case "supplement":
      return <Pill className="h-4 w-4 text-purple-500" />
    case "article":
      return <FileText className="h-4 w-4 text-green-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-400" />
  }
}

export default function DashboardPage() {
  // TODO: Check auth, redirect if not signed in
  const userName = "there"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s your gut health overview for today.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          Free Plan
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* GutScore */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your GutScore</CardTitle>
            <CardDescription>Overall gut health rating</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <GutScoreDisplay score={58} trend="up" size="md" />
          </CardContent>
          <div className="border-t px-6 py-3">
            <Link
              href="/dashboard/gutscore"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View detailed breakdown
            </Link>
          </div>
        </Card>

        {/* Quick log buttons */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Log</CardTitle>
            <CardDescription>Track your daily health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                variant="outline"
                asChild
                className="h-20 flex-col gap-2 border-blue-100 hover:bg-blue-50"
              >
                <Link href="/dashboard/symptoms">
                  <Activity className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">Log Symptoms</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-20 flex-col gap-2 border-orange-100 hover:bg-orange-50"
              >
                <Link href="/dashboard/food">
                  <Utensils className="h-6 w-6 text-orange-500" />
                  <span className="text-sm font-medium">Log Food</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-20 flex-col gap-2 border-purple-100 hover:bg-purple-50"
              >
                <Link href="/dashboard/supplements">
                  <Pill className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium">Log Supplement</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Trend chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">GutScore Trend</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest health logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade banner for free users */}
      <Card className="mt-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Upgrade to unlock full tracking
              </p>
              <p className="text-sm text-gray-500">
                Get unlimited articles, AI assistant, and advanced analytics.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Link href="/pricing">Upgrade to Bloom</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
