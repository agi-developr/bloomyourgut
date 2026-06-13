import { Metadata } from "next"
import { Stethoscope, AlertCircle, Users, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmailCapture } from "@/components/email-capture"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import siboSymptoms from "@/data/sibo-symptoms.json"

export const metadata: Metadata = {
  title: "SIBO Symptom Guide",
  description:
    "15 common SIBO symptoms with severity ratings, triggers, and evidence-based relief methods.",
}

function severityColor(severity: number) {
  if (severity <= 3) return "bg-green-500"
  if (severity <= 6) return "bg-amber-500"
  return "bg-red-500"
}

function severityLabel(severity: number) {
  if (severity <= 3) return "Mild"
  if (severity <= 6) return "Moderate"
  return "Severe"
}

const categoryIcons: Record<string, typeof Stethoscope> = {
  Digestive: Stethoscope,
  Neurological: AlertCircle,
  Systemic: Zap,
  Immune: Users,
  Dermatological: Users,
  Metabolic: Zap,
}

// Group symptoms by category
const grouped = siboSymptoms.reduce(
  (acc, symptom) => {
    if (!acc[symptom.category]) acc[symptom.category] = []
    acc[symptom.category].push(symptom)
    return acc
  },
  {} as Record<string, typeof siboSymptoms>,
)

const categoryOrder = [
  "Digestive",
  "Neurological",
  "Systemic",
  "Immune",
  "Dermatological",
  "Metabolic",
]

export default function SiboSymptomsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
            <Stethoscope className="h-3.5 w-3.5" />
            Symptom Guide
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            SIBO Symptom Guide
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Understand common SIBO symptoms, their severity, triggers, and
            evidence-based relief methods.
          </p>
        </div>
      </section>

      {/* Symptom cards by category */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {categoryOrder
            .filter((cat) => grouped[cat])
            .map((cat, catIdx) => {
              const Icon = categoryIcons[cat] || Stethoscope
              return (
                <div
                  key={cat}
                  className={catIdx > 0 ? "mt-12" : ""}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {cat}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-gray-200 text-gray-500"
                    >
                      {grouped[cat].length} symptoms
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {grouped[cat].map((symptom) => (
                      <Card
                        key={symptom.symptom}
                        className="border-gray-100"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {symptom.symptom}
                            </h3>
                            <Badge
                              variant="outline"
                              className="ml-2 shrink-0 border-gray-200 text-xs text-gray-500"
                            >
                              {symptom.affected_pct}% affected
                            </Badge>
                          </div>

                          {/* Severity bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Severity:{" "}
                                <span className="font-medium text-gray-700">
                                  {symptom.severity_avg}/10
                                </span>
                              </span>
                              <span className="font-medium">
                                {severityLabel(symptom.severity_avg)}
                              </span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${severityColor(symptom.severity_avg)}`}
                                style={{
                                  width: `${(symptom.severity_avg / 10) * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Triggers */}
                          <div className="mt-4">
                            <p className="text-xs font-medium text-gray-500">
                              Common Triggers
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {symptom.common_triggers}
                            </p>
                          </div>

                          {/* Relief */}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-500">
                              Relief Methods
                            </p>
                            <p className="mt-1 text-sm text-green-700">
                              {symptom.relief_methods}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
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
