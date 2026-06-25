import type { CartItem } from './cart-context'

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || ''

export interface ShippingAddress {
  first_name: string
  last_name: string
  address1: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export interface CreateOrderPayload {
  customer_email: string
  items: CartItem[]
  shipping_address: ShippingAddress
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  total_cents: number
  source?: string
  meta?: Record<string, unknown>
}

export interface CreatedOrder {
  id: string
  order_number: string
  status: string
  total_cents: number
  created_at: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  const res = await fetch(`${CRM_URL}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_email: payload.customer_email,
      shipping_address: payload.shipping_address,
      billing_address: payload.shipping_address,
      subtotal_cents: payload.subtotal_cents,
      shipping_cents: payload.shipping_cents,
      tax_cents: payload.tax_cents,
      total_cents: payload.total_cents,
      source: payload.source,
      channel: 'web',
      meta: payload.meta || {},
      items: payload.items.map(i => ({
        sku: i.sku,
        name: i.name,
        quantity: i.qty,
        unit_price_cents: Math.round(i.price * 100),
        discount_cents: 0,
      })),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create order')
  }

  return res.json()
}

export async function lookupOrder(orderNumber: string, email: string) {
  const res = await fetch(`${CRM_URL}/api/v1/orders/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_number: orderNumber, email }),
  })
  if (!res.ok) throw new Error('Order not found')
  return res.json()
}

export async function trackBehavior(customerId: string, eventType: string, properties: Record<string, unknown>) {
  if (!CRM_URL) return
  try {
    await fetch(`${CRM_URL}/api/v1/customers/${customerId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, properties }),
    })
  } catch {}
}
