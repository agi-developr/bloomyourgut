import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

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
      </body>
    </html>
  )
}
