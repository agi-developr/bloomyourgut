import Link from "next/link"
import { Leaf } from "lucide-react"

const footerLinks = {
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
  resources: [
    { href: "/articles", label: "Articles" },
    { href: "/research", label: "Research" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Medical Disclaimer" },
  ],
  connect: [
    { href: "https://discord.gg/bloomyourgut", label: "Discord" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "https://twitter.com/bloomyourgut", label: "Twitter" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="text-lg font-bold">
                <span className="text-green-600">Bloom</span>
                <span className="text-gray-900">YourGut</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Evidence-based gut health content, tracking tools, and AI-powered
              insights to help you feel your best.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Connect</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-green-600"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BloomYourGut. For educational
            purposes only. Not medical advice.
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            Some links on this site are affiliate links. We may earn a
            commission if you purchase through these links, at no extra cost to
            you. All recommendations are evidence-based and independently
            selected.
          </p>
        </div>
      </div>
    </footer>
  )
}
