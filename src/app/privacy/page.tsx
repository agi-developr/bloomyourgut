import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'BloomYourGut Privacy Policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: February 9, 2026
      </p>

      <div className="mt-10 space-y-8 text-gray-600 leading-relaxed">
        <p>
          At BloomYourGut, we take your privacy seriously. This Privacy Policy
          explains what information we collect, why we collect it, how we use it,
          and your rights regarding your data. We believe in transparency and want
          you to feel confident using our platform.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <div className="mt-3 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">
                Information you provide directly
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  Account information: name, email address, and password when you
                  create an account
                </li>
                <li>
                  Health tracking data: symptom logs, food diaries, and GutScore
                  entries you voluntarily submit
                </li>
                <li>
                  Payment information: billing details processed securely through
                  Stripe (we never store your full card number)
                </li>
                <li>
                  Communications: messages you send to us via email or contact forms
                </li>
                <li>
                  Newsletter preferences: your email address when you subscribe to
                  our newsletter
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Information collected automatically
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  Device and browser information: browser type, operating system,
                  device type
                </li>
                <li>
                  Usage data: pages visited, time spent on pages, features used,
                  and interaction patterns
                </li>
                <li>
                  IP address and approximate location (country/region level only)
                </li>
                <li>Referral source: how you found our website</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Provide and maintain our services, including personalized gut health
              tracking and article recommendations
            </li>
            <li>Process subscriptions and payments</li>
            <li>
              Send you relevant content, including weekly email digests (only if you
              opt in)
            </li>
            <li>
              Generate aggregated, anonymized health insights and research (your
              individual data is never shared)
            </li>
            <li>Improve our platform, content quality, and user experience</li>
            <li>Respond to your questions and support requests</li>
            <li>
              Detect and prevent fraud, abuse, and security issues
            </li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. Data Storage and Security
          </h2>
          <p className="mt-3">
            Your data is stored securely on Supabase, a trusted cloud database
            provider that uses enterprise-grade encryption. Specifically:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>All data is encrypted at rest and in transit (TLS 1.3)</li>
            <li>
              Database access requires authenticated, role-based permissions
            </li>
            <li>
              Health tracking data is stored in an isolated schema with additional
              access controls
            </li>
            <li>
              We perform regular security audits and maintain strict access
              controls for our team
            </li>
            <li>
              Passwords are hashed using industry-standard algorithms and are never
              stored in plain text
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. Third-Party Services
          </h2>
          <p className="mt-3">
            We use a limited number of trusted third-party services to operate our
            platform:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <span className="font-semibold">Stripe</span> -- Processes payments
              securely. Stripe is PCI DSS Level 1 certified. We never see or store
              your full credit card number. See{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <span className="font-semibold">Google Analytics</span> -- Helps us
              understand how visitors use our site. We use IP anonymization and do
              not share data with Google for advertising purposes. See{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <span className="font-semibold">PostHog</span> -- Product analytics
              that helps us improve the user experience. PostHog is GDPR compliant
              and we self-host where possible. See{' '}
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                PostHog&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <span className="font-semibold">ConvertKit</span> -- Manages our
              email newsletter. Your email address is shared with ConvertKit only
              if you subscribe to our newsletter. See{' '}
              <a
                href="https://convertkit.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                ConvertKit&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <span className="font-semibold">Supabase</span> -- Hosts our
              database and authentication services. See{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Supabase&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties. We do not
            share your health tracking data with any third party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
          <p className="mt-3">We use cookies and similar technologies to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <span className="font-semibold">Essential cookies:</span> Keep you
              signed in and remember your preferences. These are necessary for the
              site to function.
            </li>
            <li>
              <span className="font-semibold">Analytics cookies:</span> Help us
              understand how visitors interact with our site. These can be disabled
              in your browser settings.
            </li>
          </ul>
          <p className="mt-3">
            We do not use advertising or tracking cookies. You can control cookies
            through your browser settings. Disabling essential cookies may affect
            your ability to use certain features of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. Your Rights
          </h2>
          <p className="mt-3">
            Depending on your location, you may have the following rights under
            GDPR, CCPA, or other applicable data protection laws:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <span className="font-semibold">Access:</span> Request a copy of the
              personal data we hold about you
            </li>
            <li>
              <span className="font-semibold">Correction:</span> Request that we
              correct any inaccurate or incomplete data
            </li>
            <li>
              <span className="font-semibold">Deletion:</span> Request that we
              delete your personal data (right to be forgotten)
            </li>
            <li>
              <span className="font-semibold">Export:</span> Request a portable
              copy of your data in a machine-readable format (JSON or CSV)
            </li>
            <li>
              <span className="font-semibold">Restriction:</span> Request that we
              limit how we process your data
            </li>
            <li>
              <span className="font-semibold">Objection:</span> Object to our
              processing of your data for certain purposes
            </li>
            <li>
              <span className="font-semibold">Withdraw consent:</span> Where
              processing is based on consent, you can withdraw it at any time
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{' '}
            <a
              href="mailto:privacy@bloomyourgut.com"
              className="text-green-600 underline hover:text-green-700"
            >
              privacy@bloomyourgut.com
            </a>
            . We will respond within 30 days. For California residents: we do not
            sell personal information as defined by the CCPA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. Data Retention
          </h2>
          <p className="mt-3">
            We retain your personal data only for as long as necessary to provide
            our services and fulfill the purposes described in this policy:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <span className="font-semibold">Account data:</span> Retained while
              your account is active. Deleted within 30 days of account deletion
              request.
            </li>
            <li>
              <span className="font-semibold">Health tracking data:</span> Retained
              while your account is active. Permanently deleted within 30 days of
              account deletion.
            </li>
            <li>
              <span className="font-semibold">Payment records:</span> Retained for
              7 years as required by tax and financial regulations.
            </li>
            <li>
              <span className="font-semibold">Analytics data:</span> Aggregated and
              anonymized after 26 months.
            </li>
            <li>
              <span className="font-semibold">Email communications:</span> Retained
              for 3 years unless you request earlier deletion.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            8. Children&apos;s Privacy
          </h2>
          <p className="mt-3">
            BloomYourGut is not intended for use by anyone under the age of 18. We
            do not knowingly collect personal information from children. If you are a
            parent or guardian and believe your child has provided us with personal
            information, please contact us at{' '}
            <a
              href="mailto:privacy@bloomyourgut.com"
              className="text-green-600 underline hover:text-green-700"
            >
              privacy@bloomyourgut.com
            </a>{' '}
            and we will promptly delete that information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            9. Changes to This Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time to reflect changes in
            our practices, technology, legal requirements, or for other operational
            reasons. When we make significant changes, we will notify you by posting a
            notice on our website and, if you have an account, by sending you an email.
            We encourage you to review this page periodically. Your continued use of
            BloomYourGut after changes are posted constitutes your acceptance of the
            updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            10. Contact Us
          </h2>
          <p className="mt-3">
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact us:
          </p>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800">BloomYourGut</p>
            <p className="mt-1">
              Email:{' '}
              <a
                href="mailto:privacy@bloomyourgut.com"
                className="text-green-600 underline hover:text-green-700"
              >
                privacy@bloomyourgut.com
              </a>
            </p>
            <p>
              General inquiries:{' '}
              <a
                href="mailto:hello@bloomyourgut.com"
                className="text-green-600 underline hover:text-green-700"
              >
                hello@bloomyourgut.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
