/**
 * SEO utilities for BloomYourGut
 *
 * Generates structured data (JSON-LD) for search engines.
 * Supports MedicalWebPage, FAQ, and Breadcrumb schemas.
 */

/** Generate MedicalWebPage schema.org JSON-LD for articles */
export function generateArticleSchema(article: {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BloomYourGut',
      url: 'https://bloomyourgut.com',
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: article.url,
    about: {
      '@type': 'MedicalCondition',
      name: 'Digestive System Diseases',
    },
  }
}

/** Generate FAQ schema for pages with Q&A content */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** Generate breadcrumb schema for navigation trails */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
