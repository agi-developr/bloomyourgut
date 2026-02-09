import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AffiliateProduct } from '@/types/database'

/** Timeout for each HEAD request (ms). */
const REQUEST_TIMEOUT_MS = 10_000

/**
 * Check if a URL is reachable with a HEAD request.
 * Returns the HTTP status code or -1 on network error.
 */
async function checkUrlHealth(url: string): Promise<{ status: number; ok: boolean }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })

    clearTimeout(timeoutId)

    return {
      status: response.status,
      ok: response.ok,
    }
  } catch (error) {
    // Network error, timeout, or abort
    const isAbort = error instanceof Error && error.name === 'AbortError'
    return {
      status: isAbort ? 408 : -1,
      ok: false,
    }
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Fetch all active affiliate products
    const { data: products, error: fetchError } = await supabase
      .from('affiliate_products')
      .select('*')
      .eq('is_active', true)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch affiliate products', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        checked: 0,
        healthy: 0,
        deactivated: 0,
        message: 'No active affiliate products to check',
        timestamp: new Date().toISOString(),
      })
    }

    const now = new Date().toISOString()
    let healthy = 0
    let deactivated = 0
    const errors: string[] = []
    const deactivatedProducts: string[] = []

    for (const product of products as AffiliateProduct[]) {
      try {
        const result = await checkUrlHealth(product.affiliate_url)

        if (result.ok) {
          // URL is healthy -- just update last_checked_at
          const { error: updateError } = await supabase
            .from('affiliate_products')
            .update({ last_checked_at: now })
            .eq('id', product.id)

          if (updateError) {
            errors.push(`Failed to update last_checked_at for "${product.name}": ${updateError.message}`)
          }

          healthy++
        } else {
          // URL is dead or erroring -- deactivate the product
          console.warn(
            `Affiliate product "${product.name}" (${product.affiliate_url}) returned status ${result.status} -- deactivating`
          )

          const { error: updateError } = await supabase
            .from('affiliate_products')
            .update({
              is_active: false,
              last_checked_at: now,
            })
            .eq('id', product.id)

          if (updateError) {
            errors.push(`Failed to deactivate "${product.name}": ${updateError.message}`)
          }

          deactivated++
          deactivatedProducts.push(`${product.name} (status: ${result.status})`)
        }
      } catch (checkError) {
        const message = checkError instanceof Error ? checkError.message : String(checkError)
        errors.push(`Error checking "${product.name}": ${message}`)
      }
    }

    return NextResponse.json({
      success: true,
      checked: products.length,
      healthy,
      deactivated,
      deactivated_products: deactivatedProducts.length > 0 ? deactivatedProducts : undefined,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Affiliate checker failed', details: message },
      { status: 500 }
    )
  }
}
