import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

interface CheckoutRequestBody {
  priceId: string
  mode?: 'subscription' | 'payment'
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate request body
    let body: CheckoutRequestBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { priceId, mode = 'subscription' } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    if (mode !== 'subscription' && mode !== 'payment') {
      return NextResponse.json(
        { error: 'Mode must be "subscription" or "payment"' },
        { status: 400 }
      )
    }

    // 3. Get or create Stripe customer
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = existingSubscription?.stripe_customer_id

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      // Upsert subscription record with new Stripe customer
      await supabase.from('subscriptions').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        tier: 'free',
        status: 'active',
      })
    }

    // 4. Build the checkout session params
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://bloomyourgut.com'

    const params: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=canceled`,
      metadata: { supabase_user_id: user.id },
    }

    // Add subscription-specific metadata
    if (mode === 'subscription') {
      params.subscription_data = {
        metadata: { supabase_user_id: user.id },
      }
    }

    // 5. Create checkout session
    const session = await getStripe().checkout.sessions.create(params)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[API /checkout] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
