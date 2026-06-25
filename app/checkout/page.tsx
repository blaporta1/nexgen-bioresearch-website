'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Lock, ChevronRight, AlertTriangle, CheckCircle, CreditCard, Loader2 } from 'lucide-react'
import { NexGenMark } from '@/components/NexGenLogo'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/crm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const SHIPPING = 12.99

// ── Card form — uses Stripe Elements ─────────────────────────────────────────
function PaymentForm({
  form,
  cartItems,
  subtotal,
  total,
  onBack,
  onSuccess,
}: {
  form: Record<string, string>
  cartItems: ReturnType<typeof useCart>['items']
  subtotal: number
  total: number
  onBack: () => void
  onSuccess: (orderNumber: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    try {
      // 1. Create PaymentIntent server-side
      const piRes = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: Math.round(total * 100),
          currency: 'usd',
          customer_email: form.email,
        }),
      })
      const { client_secret, error: piError } = await piRes.json()
      if (piError || !client_secret) throw new Error(piError || 'Could not initialize payment')

      // 2. Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              state: form.state,
              postal_code: form.zip,
              country: 'US',
            },
          },
        },
      })

      if (stripeError) throw new Error(stripeError.message)
      if (paymentIntent?.status !== 'succeeded') throw new Error('Payment was not completed')

      // 3. Create order in CRM
      const order = await createOrder({
        customer_email: form.email,
        items: cartItems,
        shipping_address: {
          first_name: form.firstName,
          last_name: form.lastName,
          address1: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: 'US',
        },
        subtotal_cents: Math.round(subtotal * 100),
        shipping_cents: Math.round(SHIPPING * 100),
        tax_cents: 0,
        total_cents: Math.round(total * 100),
        meta: {
          institution: form.institution,
          research_purpose: form.researchPurpose,
          stripe_payment_intent: paymentIntent.id,
        },
      })

      onSuccess(order.order_number)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-slate text-sm mb-6 hover:text-navy"
      >
        ← Back to Researcher Info
      </button>
      <h1 className="text-navy font-bold mb-6" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>
        Payment
      </h1>

      <div className="bg-white rounded-2xl p-6 border border-frost mb-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={18} style={{ color: '#1568D3' }} />
          <h2 className="text-navy font-semibold text-sm">Card Details</h2>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate">
            <Lock size={12} />
            256-bit SSL
          </div>
        </div>

        <CardElement
          options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#0E1B2E',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': { color: '#5B6B80' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
          className="px-4 py-3 rounded-xl border border-frost"
        />
      </div>

      {error && (
        <div className="rounded-xl p-4 mb-5 flex items-start gap-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
          <p className="text-sm" style={{ color: '#991b1b' }}>{error}</p>
        </div>
      )}

      <div className="rounded-xl p-4 mb-6 border" style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', lineHeight: 1.65, letterSpacing: '0.02em' }}>
          YOUR PAYMENT IS PROCESSED SECURELY VIA STRIPE. YOUR ATTESTATION, IP ADDRESS, AND ORDER DETAILS ARE LOGGED WITH THIS TRANSACTION.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold text-white"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock size={15} />
            Place Secure Order — ${total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  )
}

// ── Main checkout page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<'info' | 'payment' | 'confirmed'>('info')
  const [orderNumber, setOrderNumber] = useState('')
  const [attested, setAttested] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '',
    institution: '', researchPurpose: '',
  })

  const canProceed = attested && ageVerified && termsAccepted &&
    form.email && form.firstName && form.lastName && form.address && form.city && form.state && form.zip

  const total = subtotal + SHIPPING

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  // Pre-fetch PaymentIntent when moving to payment step
  useEffect(() => {
    if (step !== 'payment' || clientSecret || items.length === 0) return
    fetch('/api/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_cents: Math.round(total * 100), customer_email: form.email }),
    })
      .then(r => r.json())
      .then(d => setClientSecret(d.client_secret))
      .catch(() => {})
  }, [step])

  const handleSuccess = (num: string) => {
    setOrderNumber(num)
    clearCart()
    setStep('confirmed')
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#D1FAE5' }}>
            <CheckCircle size={32} style={{ color: '#059669' }} />
          </div>
          <h1 className="text-navy font-bold mb-2" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
            Order Confirmed
          </h1>
          {orderNumber && (
            <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, color: '#1568D3', marginBottom: 8 }}>
              {orderNumber}
            </p>
          )}
          <p className="text-slate text-sm mb-6" style={{ lineHeight: 1.7 }}>
            Your order has been received and your researcher attestation has been logged.
            You'll receive a confirmation email with your COA download links and tracking number.
          </p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Redirect to shop if cart is empty
  if (items.length === 0 && step === 'info') {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-navy font-semibold mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
            Browse Compounds
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cloud">
      {/* Header */}
      <div className="bg-white border-b border-frost">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><NexGenMark size={28} navyColor="#0E1B2E" signalColor="#1568D3" /></Link>
          <div className="flex items-center gap-2">
            {['info', 'payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: step === s || (step === 'payment' && s === 'info') ? '#1568D3' : '#C2D8E0',
                      color: step === s || (step === 'payment' && s === 'info') ? 'white' : '#5B6B80',
                    }}
                  >
                    {step === 'payment' && s === 'info' ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-medium capitalize hidden sm:block" style={{ color: step === s ? '#1568D3' : '#5B6B80' }}>
                    {s === 'info' ? 'Researcher Info' : 'Payment'}
                  </span>
                </div>
                {i < 1 && <div className="w-8 h-px" style={{ background: '#C2D8E0' }} />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-slate text-xs">
            <Lock size={12} /><span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3">
            {step === 'info' && (
              <div>
                <h1 className="text-navy font-bold mb-6" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>
                  Researcher Information
                </h1>

                {/* Compliance gate */}
                <div className="rounded-2xl p-6 mb-8 border" style={{ background: 'white', borderColor: '#C2D8E0' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Shield size={18} style={{ color: '#1568D3' }} />
                    <h2 className="text-navy font-semibold text-sm">Required Researcher Attestation</h2>
                  </div>
                  {[
                    { key: 'attested', state: attested, set: setAttested, label: 'Research-Use Attestation', body: 'I confirm that I am a licensed researcher, scientist, or qualified professional purchasing these products strictly for in-vitro or laboratory research purposes. I am not purchasing for human or animal consumption, resale for human use, or any purpose other than scientific research.' },
                    { key: 'age', state: ageVerified, set: setAgeVerified, label: 'Age Verification', body: 'I confirm that I am 18 years of age or older.' },
                    { key: 'terms', state: termsAccepted, set: setTermsAccepted, label: 'Terms of Sale', body: 'I have read and agree to the Terms of Sale and Privacy Policy. I understand that my attestation, IP address, and order details are logged.' },
                  ].map(item => (
                    <label key={item.key}
                      className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer mb-3 transition-colors"
                      style={{ borderColor: item.state ? '#B3CDEF' : '#C2D8E0', background: item.state ? '#F0F6FF' : '#FAFBFD' }}
                    >
                      <input type="checkbox" checked={item.state} onChange={e => item.set(e.target.checked)} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-navy font-medium text-sm mb-1">{item.label} <span style={{ color: '#1568D3' }}>*</span></p>
                        <p className="text-slate text-xs" style={{ lineHeight: 1.65 }}>{item.body}</p>
                      </div>
                    </label>
                  ))}
                  {!canProceed && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #F59E0B' }}>
                      <AlertTriangle size={14} style={{ color: '#D97706', flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>All attestations and required fields must be completed before proceeding.</p>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl p-6 border border-frost mb-6">
                  <h2 className="text-navy font-semibold text-sm mb-5">Contact Information</h2>
                  <div className="space-y-4">
                    <input type="email" placeholder="Email address *" value={form.email} onChange={e => update('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                    <input placeholder="Institution / Laboratory (optional)" value={form.institution} onChange={e => update('institution', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                    <textarea placeholder="Brief research application (optional)" value={form.researchPurpose} onChange={e => update('researchPurpose', e.target.value)}
                      rows={3} className="w-full px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate resize-none" style={{ outline: 'none' }} />
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-2xl p-6 border border-frost mb-6">
                  <h2 className="text-navy font-semibold text-sm mb-5">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="First name *" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                        className="px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                      <input placeholder="Last name *" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                        className="px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                    </div>
                    <input placeholder="Street address *" value={form.address} onChange={e => update('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                    <div className="grid grid-cols-3 gap-4">
                      <input placeholder="City *" value={form.city} onChange={e => update('city', e.target.value)}
                        className="px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                      <select value={form.state} onChange={e => update('state', e.target.value)}
                        className="px-4 py-3 rounded-xl border border-frost text-navy text-sm" style={{ outline: 'none' }}>
                        <option value="">State *</option>
                        {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input placeholder="ZIP *" value={form.zip} onChange={e => update('zip', e.target.value)}
                        className="px-4 py-3 rounded-xl border border-frost text-navy text-sm placeholder:text-slate" style={{ outline: 'none' }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => canProceed && setStep('payment')}
                  disabled={!canProceed}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: canProceed ? '#1568D3' : '#C2D8E0', cursor: canProceed ? 'pointer' : 'not-allowed', boxShadow: canProceed ? '0 4px 16px rgba(21,104,211,0.3)' : 'none' }}
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <Elements stripe={stripePromise} options={clientSecret ? { clientSecret } : undefined}>
                <PaymentForm
                  form={form}
                  cartItems={items}
                  subtotal={subtotal}
                  total={total}
                  onBack={() => setStep('info')}
                  onSuccess={handleSuccess}
                />
              </Elements>
            )}
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-frost p-6 sticky top-32">
              <h2 className="text-navy font-semibold mb-5 text-sm">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F4F7FB' }}>
                      <NexGenMark size={24} navyColor="#0E1B2E" signalColor="#1568D3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-navy text-sm font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="purity-badge" style={{ fontSize: 10 }}>{item.purity}</span>
                        <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#5B6B80' }}>{item.sku}</span>
                      </div>
                    </div>
                    <p className="text-navy font-semibold text-sm">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-frost pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Subtotal</span>
                  <span className="text-navy">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Shipping (2-day cold chain)</span>
                  <span className="text-navy">${SHIPPING.toFixed(2)}</span>
                </div>
                <div className="border-t border-frost pt-3 flex justify-between">
                  <span className="text-navy font-bold">Total</span>
                  <span className="text-navy font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-frost">
                {[
                  { icon: Shield, text: 'Researcher attestation required & logged' },
                  { icon: Lock, text: '256-bit SSL encrypted payment' },
                  { icon: CheckCircle, text: 'COA download included with order' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 mb-2.5">
                    <item.icon size={13} className="text-signal flex-shrink-0" />
                    <span className="text-slate text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
