import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount_cents, currency = 'usd', customer_email } = await req.json()

    if (!amount_cents || amount_cents < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const params: Stripe.PaymentIntentCreateParams = {
      amount: amount_cents,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { source: 'nexgen_website' },
    }

    if (customer_email) {
      // Look up or create Stripe customer so card can be saved
      const existing = await stripe.customers.list({ email: customer_email, limit: 1 })
      const customer = existing.data[0] ?? await stripe.customers.create({ email: customer_email })
      params.customer = customer.id
      params.setup_future_usage = 'off_session'
    }

    const intent = await stripe.paymentIntents.create(params)

    return NextResponse.json({ client_secret: intent.client_secret })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
