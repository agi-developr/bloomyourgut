import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Medical Disclaimer',
  description:
    'Medical disclaimer for BloomYourGut. Our content is for educational purposes only and is not a substitute for professional medical advice.',
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Medical Disclaimer
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: February 9, 2026
      </p>

      <div className="mt-10 space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Not a Substitute for Professional Medical Advice
          </h2>
          <p className="mt-3">
            The information provided on BloomYourGut.com, including all text,
            graphics, images, and other material, is for informational and
            educational purposes only. Nothing on this website is intended to be a
            substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician, gastroenterologist, or other
            qualified health provider with any questions you may have regarding a
            medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Educational Content Only
          </h2>
          <p className="mt-3">
            All articles, guides, protocols, and tools on this website are provided
            for general educational purposes. They are based on published scientific
            research and are intended to help you have more informed conversations
            with your healthcare providers. Our content is not designed to diagnose,
            treat, cure, or prevent any disease or medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Consult Your Healthcare Provider
          </h2>
          <p className="mt-3">
            Before making any changes to your diet, supplement regimen, exercise
            routine, or any other aspect of your health management, consult with
            your doctor or qualified healthcare professional. This is especially
            important if you are pregnant, nursing, taking medication, or have a
            pre-existing medical condition. Never disregard professional medical
            advice or delay seeking it because of something you have read on this
            website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            We Are Not Licensed Medical Practitioners
          </h2>
          <p className="mt-3">
            BloomYourGut and its team members are not licensed physicians, medical
            doctors, nurses, dietitians, or registered healthcare professionals
            unless explicitly stated otherwise. We are a health education platform
            that curates and summarizes peer-reviewed scientific research about gut
            health and the microbiome. Our team&apos;s backgrounds and
            qualifications are described on our{' '}
            <Link href="/about" className="text-green-600 underline hover:text-green-700">
              About page
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Individual Results May Vary
          </h2>
          <p className="mt-3">
            Health outcomes are highly individual. What works for one person may not
            work for another. Testimonials, case studies, or user-reported outcomes
            featured on this site do not guarantee that you will achieve the same
            results. Factors such as genetics, existing health conditions,
            medications, lifestyle, diet, and adherence to protocols all influence
            individual outcomes. The GutScore and other tracking tools on this
            platform are for personal informational use and do not constitute a
            clinical assessment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Supplements and Diet Information
          </h2>
          <p className="mt-3">
            Statements regarding dietary supplements, probiotics, prebiotics, and
            food-based interventions have not been evaluated by the U.S. Food and
            Drug Administration (FDA) or any equivalent regulatory body. These
            products and dietary approaches are not intended to diagnose, treat,
            cure, or prevent any disease. If we mention or link to specific
            products, we do so for informational purposes only and this should not
            be interpreted as a medical endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            AI-Generated Content
          </h2>
          <p className="mt-3">
            Some content on this website is generated or assisted by artificial
            intelligence and then reviewed by our editorial team. While we make
            every effort to ensure accuracy and cite peer-reviewed sources,
            AI-generated content may occasionally contain errors or
            oversimplifications. We encourage readers to verify claims by consulting
            the original research papers cited in our articles and to discuss any
            health decisions with their healthcare provider.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            External Links and Third-Party Content
          </h2>
          <p className="mt-3">
            This website may contain links to third-party websites, products, or
            services. These links are provided for convenience and informational
            purposes only. BloomYourGut does not endorse, warrant, or guarantee the
            accuracy of information found on external sites. We are not responsible
            for the content, privacy practices, or terms of use of any linked
            third-party websites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Emergency Situations
          </h2>
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">
              If you think you may have a medical emergency, call your doctor, go to
              the nearest emergency room, or call 911 (or your local emergency
              number) immediately.
            </p>
            <p className="mt-2 text-red-700">
              Do not rely on information from this website for emergency medical
              needs. BloomYourGut does not recommend or endorse any specific tests,
              physicians, products, procedures, opinions, or other information that
              may be mentioned on this site in the context of an emergency.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Limitation of Liability
          </h2>
          <p className="mt-3">
            By using this website, you agree that BloomYourGut and its owners,
            operators, contributors, and affiliates shall not be held liable for any
            damages, injuries, or losses arising from the use of, or reliance on,
            the information provided on this site. You use the information on this
            website at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Changes to This Disclaimer
          </h2>
          <p className="mt-3">
            We may update this Medical Disclaimer from time to time. Any changes
            will be posted on this page with an updated revision date. We encourage
            you to review this disclaimer periodically.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-500">
            If you have questions about this Medical Disclaimer or concerns about
            the health information on our site, please contact us at{' '}
            <a
              href="mailto:hello@bloomyourgut.com"
              className="text-green-600 underline hover:text-green-700"
            >
              hello@bloomyourgut.com
            </a>
            . For information about our team and their qualifications, please visit
            our{' '}
            <Link href="/about" className="text-green-600 underline hover:text-green-700">
              About page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
