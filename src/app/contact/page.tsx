"use client"

import { useState } from "react"
import { Mail, MessageSquare, Clock, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const contactChannels = [
  {
    icon: Mail,
    label: "General Inquiries",
    email: "hello@bloomyourgut.com",
    description: "Questions about our platform, content, or partnerships.",
  },
  {
    icon: MessageSquare,
    label: "Support",
    email: "support@bloomyourgut.com",
    description: "Technical issues, account help, or bug reports.",
  },
  {
    icon: Mail,
    label: "Privacy",
    email: "privacy@bloomyourgut.com",
    description: "Data requests, privacy concerns, or GDPR inquiries.",
  },
]

const subjects = [
  "General",
  "Bug Report",
  "Content Suggestion",
  "Partnership",
  "Advertising",
  "Other",
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !subject || !message) return

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to send message")
      }

      toast.success("Message sent!", {
        description: "We typically respond within 24-48 hours.",
      })
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      toast.error("Failed to send message", {
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
          <p className="mt-6 text-lg text-gray-600">
            Have a question, suggestion, or want to collaborate? We&apos;d love
            to hear from you. Choose the best way to reach us below.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            {/* Form */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactChannels.map((channel) => (
                <Card key={channel.label} className="border-gray-100">
                  <CardContent className="pt-6">
                    <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-green-50 p-2.5">
                      <channel.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {channel.label}
                    </h3>
                    <a
                      href={`mailto:${channel.email}`}
                      className="mt-1 block text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      {channel.email}
                    </a>
                    <p className="mt-1 text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* Response time */}
              <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Response Time
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
