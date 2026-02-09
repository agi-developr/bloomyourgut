import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'BloomYourGut Terms of Service. Read the terms that govern your use of our platform.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: February 9, 2026
      </p>

      <div className="mt-10 space-y-8 text-gray-600 leading-relaxed">
        <p>
          Welcome to BloomYourGut. By accessing or using our website, mobile
          applications, and services (collectively, the &quot;Service&quot;), you
          agree to be bound by these Terms of Service (&quot;Terms&quot;). Please
          read them carefully before using our platform.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p className="mt-3">
            By creating an account, subscribing to our services, or even just
            browsing our website, you agree to these Terms and our{' '}
            <Link href="/privacy" className="text-green-600 underline hover:text-green-700">
              Privacy Policy
            </Link>
            . If you do not agree to any part of these Terms, you must stop using
            the Service immediately. We may update these Terms from time to time.
            Continued use of the Service after changes are posted constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. Account Registration
          </h2>
          <p className="mt-3">
            To access certain features of the Service, you must create an account.
            When registering, you agree to:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Provide accurate and complete information</li>
            <li>Keep your login credentials secure and confidential</li>
            <li>
              Notify us immediately if you suspect unauthorized access to your
              account
            </li>
            <li>Be at least 18 years of age</li>
          </ul>
          <p className="mt-3">
            You are responsible for all activity that occurs under your account. We
            reserve the right to suspend or terminate accounts that violate these
            Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. Subscriptions and Billing
          </h2>
          <p className="mt-3">
            BloomYourGut offers both free and paid subscription plans. For paid
            plans:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Subscription fees are billed in advance on a monthly or annual basis,
              depending on the plan you select
            </li>
            <li>
              All payments are processed securely through Stripe. We do not store
              your payment card details on our servers
            </li>
            <li>
              Prices are listed in US dollars unless otherwise stated. Applicable
              taxes may be added based on your location
            </li>
            <li>
              Subscriptions automatically renew at the end of each billing period
              unless you cancel before the renewal date
            </li>
            <li>
              We reserve the right to change subscription prices with 30 days
              notice. Price changes will not affect your current billing period
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. Cancellation and Refunds
          </h2>
          <p className="mt-3">
            You can cancel your subscription at any time from your account
            dashboard. Upon cancellation:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              You will retain access to paid features until the end of your current
              billing period
            </li>
            <li>
              No partial refunds are issued for unused time within a billing period
            </li>
            <li>
              Your account will automatically revert to the free plan after the
              paid period expires
            </li>
            <li>
              Your health tracking data will be retained for 90 days after
              downgrading, giving you time to export it or re-subscribe
            </li>
          </ul>
          <p className="mt-3">
            Refund requests for exceptional circumstances (such as accidental
            charges or service outages) can be submitted to{' '}
            <a
              href="mailto:billing@bloomyourgut.com"
              className="text-green-600 underline hover:text-green-700"
            >
              billing@bloomyourgut.com
            </a>{' '}
            within 14 days of the charge. We review each request on a case-by-case
            basis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. Acceptable Use
          </h2>
          <p className="mt-3">
            You agree not to use the Service to:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Violate any applicable laws, regulations, or third-party rights
            </li>
            <li>
              Upload or share content that is harmful, threatening, abusive,
              defamatory, obscene, or otherwise objectionable
            </li>
            <li>
              Attempt to gain unauthorized access to other user accounts, our
              servers, or any connected systems
            </li>
            <li>
              Use automated tools (bots, scrapers, crawlers) to access the Service
              without our written permission
            </li>
            <li>
              Reproduce, redistribute, or resell our content without written
              authorization
            </li>
            <li>
              Provide medical advice to other users based on our content, or
              present our educational content as professional medical guidance
            </li>
            <li>
              Interfere with or disrupt the Service or impose an unreasonable load
              on our infrastructure
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. Health Disclaimer
          </h2>
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-gray-700">
              BloomYourGut provides health-related content for educational and
              informational purposes only. Our content, tools, and features are{' '}
              <span className="font-semibold">
                not a substitute for professional medical advice, diagnosis, or
                treatment
              </span>
              . Always consult with a qualified healthcare provider before making
              changes to your diet, supplement routine, or health management plan.
            </p>
            <p className="mt-2 text-gray-700">
              For our complete Medical Disclaimer, please visit our{' '}
              <Link
                href="/disclaimer"
                className="text-green-600 underline hover:text-green-700"
              >
                Medical Disclaimer page
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. Intellectual Property
          </h2>
          <p className="mt-3">
            All content on BloomYourGut, including articles, graphics, logos,
            icons, images, audio clips, data compilations, software, and the
            overall design of the Service, is the property of BloomYourGut or its
            content suppliers and is protected by copyright, trademark, and other
            intellectual property laws.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              You may read, share links to, and print articles for personal,
              non-commercial use
            </li>
            <li>
              You may not reproduce, distribute, modify, or create derivative works
              from our content without written permission
            </li>
            <li>
              User-submitted content (such as comments or forum posts) remains your
              property, but you grant us a non-exclusive, royalty-free license to
              display and use it in connection with the Service
            </li>
            <li>
              If you believe content on our site infringes your intellectual
              property rights, contact us at{' '}
              <a
                href="mailto:legal@bloomyourgut.com"
                className="text-green-600 underline hover:text-green-700"
              >
                legal@bloomyourgut.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            8. Limitation of Liability
          </h2>
          <p className="mt-3">
            To the fullest extent permitted by applicable law, BloomYourGut and its
            owners, operators, employees, and affiliates shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including but not limited to:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Loss of profits, data, or goodwill</li>
            <li>Service interruptions or downtime</li>
            <li>
              Health outcomes resulting from information found on our platform
            </li>
            <li>
              Errors or inaccuracies in content, including AI-generated content
            </li>
            <li>Unauthorized access to or alteration of your data</li>
          </ul>
          <p className="mt-3">
            Our total liability for any claim arising from or related to the
            Service shall not exceed the amount you paid to us in the 12 months
            preceding the claim, or $100, whichever is greater.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            9. Indemnification
          </h2>
          <p className="mt-3">
            You agree to indemnify and hold harmless BloomYourGut and its
            affiliates, officers, and employees from any claims, damages, losses, or
            expenses (including reasonable legal fees) arising from your use of the
            Service, your violation of these Terms, or your violation of any
            third-party rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            10. Governing Law
          </h2>
          <p className="mt-3">
            These Terms shall be governed by and construed in accordance with the
            laws of the State of Delaware, United States, without regard to its
            conflict of law provisions. Any disputes arising from these Terms or the
            Service shall be resolved in the state or federal courts located in
            Delaware. You consent to the personal jurisdiction of such courts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            11. Severability
          </h2>
          <p className="mt-3">
            If any provision of these Terms is found to be unenforceable or invalid
            by a court of competent jurisdiction, that provision will be limited or
            eliminated to the minimum extent necessary, and the remaining provisions
            will remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            12. Contact Us
          </h2>
          <p className="mt-3">
            If you have any questions about these Terms of Service, please contact
            us:
          </p>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800">BloomYourGut</p>
            <p className="mt-1">
              Email:{' '}
              <a
                href="mailto:legal@bloomyourgut.com"
                className="text-green-600 underline hover:text-green-700"
              >
                legal@bloomyourgut.com
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
