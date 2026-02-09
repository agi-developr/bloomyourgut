import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'
import type { SubscriptionTier, SubscriptionStatus } from '@/types/database'

/**
 * Determine subscription tier from a Stripe price ID.
 * Matches against all PPP pricing variants.
 */
function getTierFromPriceId(priceId: string): SubscriptionTier {
  if (priceId.includes('pro')) return 'pro'
  if (priceId.includes('bloom')) return 'bloom'
  return 'bloom'
}

/**
 * Map Stripe subscription status to our internal status.
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled'
    default:
      return 'active'
  }
}

/**
 * Resolve the user_id for a given Stripe subscription.
 * First checks metadata, then falls back to customer lookup in DB.
 */
async function resolveUserId(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
): Promise<string | null> {
  // Try metadata first
  const metaUserId = subscription.metadata?.supabase_user_id
  if (metaUserId) return metaUserId

  // Fall back to customer ID lookup
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  return sub?.user_id || null
}

/**
 * Sync a Stripe subscription to the database.
 */
async function syncSubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()

  const userId = await resolveUserId(supabase, subscription)
  if (!userId) {
    console.error(
      '[Webhook] Cannot find user for subscription:',
      subscription.id
    )
    return
  }

  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  // Get the primary price ID from the subscription
  const priceId = subscription.items.data[0]?.price?.id || ''
  const tier = getTierFromPriceId(priceId)
  const status = mapStripeStatus(subscription.status)

  // Get current_period_end from the subscription item (Stripe SDK v20)
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end
    ? new Date(
        subscription.items.data[0].current_period_end * 1000
      ).toISOString()
    : null

  // Update subscriptions table
  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      tier,
      status,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  // Sync tier to profiles table
  await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}

/**
 * Extract subscription ID from a Stripe Invoice via its parent field.
 * In Stripe SDK v20, invoice.subscription was replaced with
 * invoice.parent.subscription_details.subscription.
 */
function getSubscriptionIdFromInvoice(
  invoice: Stripe.Invoice
): string | null {
  const subDetails = invoice.parent?.subscription_details
  if (!subDetails?.subscription) return null

  return typeof subDetails.subscription === 'string'
    ? subDetails.subscription
    : subDetails.subscription.id
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = getStripe().webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('[Webhook] Signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    switch (event.type) {
      // ---- New subscription or one-time payment completed ----
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id
          const subscription =
            await getStripe().subscriptions.retrieve(subscriptionId)
          await syncSubscription(subscription)
        }

        if (session.mode === 'payment') {
          // This is a consultation booking
          const userId = session.metadata?.supabase_user_id
          if (userId) {
            await supabase.from('consultations').insert({
              user_id: userId,
              date: new Date().toISOString().split('T')[0],
              type: 'async',
              status: 'pending',
              stripe_payment_id: session.payment_intent as string | null,
            })
          }
        }
        break
      }

      // ---- Subscription updated (plan change, renewal, etc.) ----
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await syncSubscription(subscription)
        break
      }

      // ---- Subscription canceled ----
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub?.user_id) {
          // Downgrade to free tier
          await supabase
            .from('subscriptions')
            .update({
              tier: 'free',
              status: 'canceled',
              stripe_subscription_id: null,
              cancel_at_period_end: false,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', sub.user_id)

          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('id', sub.user_id)
        }
        break
      }

      // ---- Successful payment (renewal confirmation) ----
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = getSubscriptionIdFromInvoice(invoice)
        if (subscriptionId) {
          const subscription =
            await getStripe().subscriptions.retrieve(subscriptionId)
          await syncSubscription(subscription)
        }
        break
      }

      // ---- Failed payment ----
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id

        if (customerId) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()

          if (sub?.user_id) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'past_due',
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', sub.user_id)
          }
        }
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
