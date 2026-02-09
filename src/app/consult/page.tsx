import { Metadata } from "next"
import Link from "next/link"
import {
  MessageCircle,
  Video,
  Check,
  Calendar,
  Shield,
  Clock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "1-on-1 Gut Health Consultation",
  description:
    "Get personalized gut health guidance with a 1-on-1 consultation. Async or live video options available.",
}

const benefits = [
  "Comprehensive review of your health history and symptoms",
  "Personalized gut health plan tailored to your situation",
  "Evidence-based supplement and dietary recommendations",
  "Lab test recommendations for further investigation",
  "14 days of follow-up email support after your session",
  "Written summary of recommendations you can share with your doctor",
]

const faqItems = [
  {
    question: "Who conducts the consultations?",
    answer:
      "Consultations are conducted by our team of certified nutritionists and gut health specialists with backgrounds in functional medicine. All recommendations are evidence-based and sourced from peer-reviewed research.",
  },
  {
    question: "Is this a replacement for medical care?",
    answer:
      "No. Our consultations provide educational guidance and personalized recommendations based on research. We are not licensed medical practitioners. We always recommend working with your healthcare provider for medical diagnoses and treatments.",
  },
  {
    question: "What's the difference between Async and Live?",
    answer:
      "Async consultations involve submitting a detailed questionnaire and receiving a comprehensive written plan within 48-72 hours. Live consultations are 60-minute video calls where we discuss your health in real-time. Both include the same 14-day follow-up support.",
  },
  {
    question: "How do I prepare for my consultation?",
    answer:
      "After booking, you'll receive a comprehensive intake form covering your health history, current symptoms, diet, supplements, and goals. Completing this form thoroughly helps us make the most of your session. If you have any lab results, bring those too.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes, we offer a full refund within 7 days of your consultation if you feel it didn't meet your expectations. We want you to feel confident in your investment.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "We don't accept insurance directly, but we can provide a superbill that you can submit to your insurance company for potential reimbursement. Check with your provider for out-of-network nutrition counseling benefits.",
  },
]

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          1-on-1 Gut Health Consultation
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Get personalized, evidence-based guidance from our gut health
          specialists. Your unique health situation deserves individual
          attention.
        </p>
      </div>

      {/* What you get */}
      <div className="mx-auto mt-12 max-w-2xl">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          What&apos;s Included
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span className="text-sm text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation options */}
      <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
        {/* Async */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <MessageCircle className="h-7 w-7 text-green-600" />
            </div>
            <CardTitle className="text-xl">Async Consultation</CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              Submit your questionnaire and receive a detailed written plan
              within 48-72 hours.
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">$149</span>
              <span className="text-sm text-gray-500">/session</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Detailed health history review",
                "Comprehensive written plan",
                "Supplement protocol",
                "Dietary recommendations",
                "Lab test suggestions",
                "14-day follow-up support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/sign-up?consult=async">Book Async Consultation</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Live */}
        <Card className="flex flex-col border-2 border-green-500 shadow-lg shadow-green-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <Video className="h-7 w-7 text-green-600" />
            </div>
            <CardTitle className="text-xl">Live Consultation</CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              60-minute video call with a gut health specialist for real-time
              discussion and Q&A.
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">$149</span>
              <span className="text-sm text-gray-500">/session</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "60-minute video call",
                "Real-time Q&A",
                "Screen sharing for lab reviews",
                "Personalized supplement plan",
                "Dietary recommendations",
                "14-day follow-up support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/sign-up?consult=live">Book Live Consultation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Calendar placeholder */}
      <div className="mx-auto mt-16 max-w-xl">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <Calendar className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              Calendar scheduling will be available after booking
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Choose your preferred date and time after completing payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trust signals */}
      <div className="mx-auto mt-16 max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <Shield className="mb-2 h-8 w-8 text-green-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Evidence-Based
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              All recommendations sourced from peer-reviewed research
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="mb-2 h-8 w-8 text-green-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              14-Day Follow-Up
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Email support included after every consultation
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Star className="mb-2 h-8 w-8 text-green-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Satisfaction Guaranteed
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Full refund within 7 days if not satisfied
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Consultation FAQ
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-gray-900">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
