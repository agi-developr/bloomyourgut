import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "BloomYourGut - Evidence-Based Gut Health",
    template: "%s | BloomYourGut",
  },
  description:
    "Your gut health journey, backed by science. Expert articles, symptom tracking, personalized protocols, and AI-powered insights.",
  keywords: [
    "gut health",
    "microbiome",
    "SIBO",
    "IBS",
    "probiotics",
    "digestive health",
  ],
  metadataBase: new URL("https://bloomyourgut.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloomyourgut.com",
    siteName: "BloomYourGut",
    title: "BloomYourGut - Evidence-Based Gut Health",
    description: "Your gut health journey, backed by science.",
    images: [
      {
        url: "/og-image-optimized.jpg",
        width: 1200,
        height: 630,
        alt: "BloomYourGut - Evidence-Based Gut Health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomYourGut - Evidence-Based Gut Health",
    description: "Your gut health journey, backed by science.",
    images: ["/og-image-optimized.jpg"],
  },
  icons: {
    icon: "/logo-optimized.jpg",
    apple: "/logo-optimized.jpg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
