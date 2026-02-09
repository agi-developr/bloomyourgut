import { Metadata } from "next"
import { HelpCircle, Leaf, CreditCard, Settings } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EmailCapture } from "@/components/email-capture"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about BloomYourGut, gut health basics, using the platform, and subscriptions.",
}

const faqSections = [
  {
    icon: HelpCircle,
    title: "About BloomYourGut",
    questions: [
      {
        q: "What is BloomYourGut?",
        a: "BloomYourGut is an evidence-based gut health platform that combines research-backed articles, smart tracking tools, and AI-powered insights to help you understand and improve your digestive health. Every piece of content is sourced from peer-reviewed research on PubMed.",
      },
      {
        q: "Is this medical advice?",
        a: "No. BloomYourGut provides educational health information based on published research, but it is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before making changes to your diet, supplements, or treatment plan.",
      },
      {
        q: "Who writes the articles?",
        a: "Our content is authored by a team with backgrounds in nutrition science and gastroenterology research, and reviewed by registered dietitians and healthcare professionals. Every article goes through a rigorous review process before publication.",
      },
      {
        q: "How is BloomYourGut different from other health sites?",
        a: "We focus exclusively on gut health, source every claim from PubMed, use an evidence grading system (Strong, Moderate, Preliminary, Insufficient), and provide interactive tools like symptom tracking and AI-powered analysis. We never promote unverified trends or miracle cures.",
      },
      {
        q: "Is my health data private?",
        a: "Absolutely. Your health data is encrypted at rest and in transit. We never sell personal data to third parties. You can export or delete your data at any time. See our Privacy Policy for full details on how we protect your information.",
      },
    ],
  },
  {
    icon: Leaf,
    title: "Gut Health Basics",
    questions: [
      {
        q: "What is the gut microbiome?",
        a: "The gut microbiome is the community of trillions of microorganisms (bacteria, fungi, viruses, and archaea) living in your digestive tract. These organisms play crucial roles in digestion, immune function, vitamin synthesis, and even mental health through the gut-brain axis. Research shows that microbiome diversity is generally associated with better health outcomes.",
      },
      {
        q: "What are FODMAPs?",
        a: "FODMAPs (Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols) are short-chain carbohydrates that are poorly absorbed in the small intestine. For people with IBS, FODMAPs can trigger symptoms like bloating, gas, and abdominal pain. A low-FODMAP diet, developed at Monash University, is a clinically validated approach to identifying food triggers.",
      },
      {
        q: "How do probiotics work?",
        a: "Probiotics are live microorganisms that, when consumed in adequate amounts, confer a health benefit. They work through multiple mechanisms: competing with harmful bacteria for resources, producing antimicrobial compounds, strengthening the gut barrier, and modulating the immune system. Effects are strain-specific, meaning different probiotic strains have different benefits.",
      },
      {
        q: "What is SIBO?",
        a: "SIBO (Small Intestinal Bacterial Overgrowth) is a condition where excessive bacteria grow in the small intestine, which normally has relatively few bacteria. Symptoms include bloating, gas, diarrhea, and abdominal pain. Diagnosis typically involves a lactulose or glucose breath test, and treatment usually includes targeted antibiotics and dietary modifications.",
      },
      {
        q: "Can gut health affect mental health?",
        a: "Yes. The gut-brain axis is a bidirectional communication system between the gastrointestinal tract and the central nervous system. Research has shown that gut bacteria produce neurotransmitters like serotonin (approximately 95% of serotonin is produced in the gut), GABA, and dopamine. Studies link gut microbiome imbalances to conditions like anxiety, depression, and stress responses.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Using the Platform",
    questions: [
      {
        q: "How does the symptom tracker work?",
        a: "The symptom tracker lets you log daily digestive symptoms (bloating, pain, gas, etc.) along with severity ratings. Over time, it identifies patterns and correlations with your food diary entries, helping you understand which foods or behaviors trigger your symptoms.",
      },
      {
        q: "What is GutScore?",
        a: "GutScore is our proprietary algorithm that synthesizes your tracking data (symptoms, food diary, supplements, lifestyle factors) into a single 0-100 metric. It helps you see your overall gut health trajectory at a glance and identifies which factors most influence your score.",
      },
      {
        q: "How does the AI gut assistant work?",
        a: "Our AI assistant uses your tracking data combined with published research to answer gut health questions, identify correlations in your data, and provide personalized recommendations. It always cites its sources and clearly distinguishes between well-established science and preliminary findings.",
      },
      {
        q: "Can I export my health data?",
        a: "Yes. You can export all your tracking data (symptoms, food diary, supplements, GutScore history) as a CSV or PDF report at any time from your dashboard settings. This is useful for sharing with your healthcare provider.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Subscriptions & Billing",
    questions: [
      {
        q: "What plans do you offer?",
        a: "We offer three plans: Bloom ($7/month) for full article access and basic tracking, Pro ($29/month) for advanced analytics and AI assistant, and Consult ($149 one-time) for a personalized gut health consultation. Annual plans are available at a discount. Free users can access a limited number of articles and basic features.",
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes. You can cancel your subscription at any time from your account settings. You will retain access to your paid features until the end of your current billing period. No cancellation fees, no questions asked.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe, our secure payment processor. We also support Apple Pay and Google Pay where available.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a full refund within the first 7 days of any new subscription if you are not satisfied. After 7 days, we prorate refunds on a case-by-case basis. Contact support@bloomyourgut.com for refund requests.",
      },
    ],
  },
]

// Collect all Q&A for JSON-LD schema
const allFaqItems = faqSections.flatMap((s) => s.questions)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
}

export default function FAQPage() {
  return (
    <div>
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Find answers to common questions about BloomYourGut, gut health
            fundamentals, and how to get the most from our platform.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <section.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${section.title}-${idx}`}
                    >
                      <AccordionTrigger className="text-left text-gray-900 hover:text-green-700">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-500">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-gray-600">
            Can&apos;t find what you&apos;re looking for? Reach out to our team
            and we&apos;ll get back to you within 24-48 hours.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Contact Us
          </a>
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
