export interface TierPricing {
  monthly: number
  annual: number
  monthlyPriceId: string
  annualPriceId: string
}

export interface ConsultPricing {
  amount: number
  priceId: string
}

export interface CountryPricing {
  country: string
  countryCode: string
  currency: string
  symbol: string
  bloom: TierPricing
  pro: TierPricing
  consult: ConsultPricing
}

export interface DisplayPrice {
  amount: number
  formatted: string
  currency: string
  symbol: string
}

// ----- PPP Pricing Map -----

const PRICING_MAP: Record<string, CountryPricing> = {
  US: {
    country: 'United States',
    countryCode: 'US',
    currency: 'usd',
    symbol: '$',
    bloom: {
      monthly: 7,
      annual: 70,
      monthlyPriceId: 'price_1SyxNJKFdDBxr4nxeVho4uIH',
      annualPriceId: 'price_1SyxNLKFdDBxr4nxSNq904K4',
    },
    pro: {
      monthly: 29,
      annual: 290,
      monthlyPriceId: 'price_1SyxNNKFdDBxr4nxB4pVWpJh',
      annualPriceId: 'price_1SyxNPKFdDBxr4nxrmRaR9BW',
    },
    consult: {
      amount: 149,
      priceId: 'price_1SyxNRKFdDBxr4nxoCZxzpQ0',
    },
  },

  IN: {
    country: 'India',
    countryCode: 'IN',
    currency: 'inr',
    symbol: '\u20B9',
    bloom: {
      monthly: 149,
      annual: 1490,
      monthlyPriceId: 'price_bloom_monthly_in',
      annualPriceId: 'price_bloom_annual_in',
    },
    pro: {
      monthly: 499,
      annual: 4990,
      monthlyPriceId: 'price_pro_monthly_in',
      annualPriceId: 'price_pro_annual_in',
    },
    consult: {
      amount: 2499,
      priceId: 'price_consult_in',
    },
  },

  BR: {
    country: 'Brazil',
    countryCode: 'BR',
    currency: 'brl',
    symbol: 'R$',
    bloom: {
      monthly: 14.9,
      annual: 149,
      monthlyPriceId: 'price_bloom_monthly_br',
      annualPriceId: 'price_bloom_annual_br',
    },
    pro: {
      monthly: 49.9,
      annual: 499,
      monthlyPriceId: 'price_pro_monthly_br',
      annualPriceId: 'price_pro_annual_br',
    },
    consult: {
      amount: 249,
      priceId: 'price_consult_br',
    },
  },

  NG: {
    country: 'Nigeria',
    countryCode: 'NG',
    currency: 'ngn',
    symbol: '\u20A6',
    bloom: {
      monthly: 1300,
      annual: 13000,
      monthlyPriceId: 'price_bloom_monthly_ng',
      annualPriceId: 'price_bloom_annual_ng',
    },
    pro: {
      monthly: 3500,
      annual: 35000,
      monthlyPriceId: 'price_pro_monthly_ng',
      annualPriceId: 'price_pro_annual_ng',
    },
    consult: {
      amount: 15000,
      priceId: 'price_consult_ng',
    },
  },

  ID: {
    country: 'Indonesia',
    countryCode: 'ID',
    currency: 'idr',
    symbol: 'Rp',
    bloom: {
      monthly: 39900,
      annual: 399000,
      monthlyPriceId: 'price_bloom_monthly_id',
      annualPriceId: 'price_bloom_annual_id',
    },
    pro: {
      monthly: 129900,
      annual: 1299000,
      monthlyPriceId: 'price_pro_monthly_id',
      annualPriceId: 'price_pro_annual_id',
    },
    consult: {
      amount: 599000,
      priceId: 'price_consult_id',
    },
  },

  KE: {
    country: 'Kenya',
    countryCode: 'KE',
    currency: 'kes',
    symbol: 'KES',
    bloom: {
      monthly: 290,
      annual: 2900,
      monthlyPriceId: 'price_bloom_monthly_ke',
      annualPriceId: 'price_bloom_annual_ke',
    },
    pro: {
      monthly: 750,
      annual: 7500,
      monthlyPriceId: 'price_pro_monthly_ke',
      annualPriceId: 'price_pro_annual_ke',
    },
    consult: {
      amount: 4500,
      priceId: 'price_consult_ke',
    },
  },
}

// Countries that share US pricing (English-speaking, similar PPP)
const US_PRICING_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'SG']

/**
 * Get pricing for a given ISO 3166-1 alpha-2 country code.
 * Falls back to US pricing for unmapped countries.
 */
export function getPricingForCountry(countryCode: string): CountryPricing {
  const code = countryCode.toUpperCase()

  if (PRICING_MAP[code]) {
    return PRICING_MAP[code]
  }

  // Fall back to US pricing for unmapped countries
  if (US_PRICING_COUNTRIES.includes(code)) {
    return PRICING_MAP.US
  }

  return PRICING_MAP.US
}

/**
 * Format a price amount with the correct currency symbol and locale formatting.
 */
export function getDisplayPrice(
  amount: number,
  currency: string,
  symbol: string
): DisplayPrice {
  // Determine decimal places based on currency
  const noDecimalCurrencies = ['inr', 'ngn', 'idr', 'kes']
  const decimals = noDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2

  const formatted =
    symbol === 'R$' || symbol === 'Rp' || symbol === 'KES'
      ? `${symbol} ${amount.toFixed(decimals)}`
      : `${symbol}${amount.toFixed(decimals)}`

  return { amount, formatted, currency, symbol }
}

/**
 * Get all available country codes that have PPP pricing.
 */
export function getAvailableCountries(): string[] {
  return Object.keys(PRICING_MAP)
}

/**
 * Features included in each tier.
 */
export const TIER_FEATURES = {
  free: [
    '3 articles per month',
    'Basic GutScore',
    'Community access',
  ],
  bloom: [
    'Unlimited articles',
    'Full GutScore with trends',
    'Symptom tracker',
    'Food diary with analysis',
    'AI gut health assistant',
    'Weekly email digest',
  ],
  pro: [
    'Everything in Bloom',
    'AI-powered meal plans',
    'Lab result interpretation',
    'Priority AI assistant',
    'Export health data',
    'Early access to features',
    'Multi-language support',
  ],
  consult: [
    '60-minute video consultation',
    'Personalized gut health plan',
    'Lab test recommendations',
    'Follow-up email support (14 days)',
  ],
} as const
