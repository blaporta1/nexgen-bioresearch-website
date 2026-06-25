'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { adminApi, Order } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  payment_pending: { label: 'Awaiting Payment', color: '#7C3AED', bg: '#EDE9FE' },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#DBEAFE' },
  processing: { label: 'Processing', color: '#0891B2', bg: '#CFFAFE' },
  shipped: { label: 'Shipped', color: '#7C3AED', bg: '#EDE9FE' },
  out_for_delivery: { label: 'Out for Delivery', color: '#059669', bg: '#D1FAE5' },
  delivered: { label: 'Delivered', color: '#059669', bg: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' },
  refunded: { label: 'Refunded', color: '#9333EA', bg: '#F3E8FF' },
  payment_failed: { label: 'Payment Failed', color: '#DC2626', bg: '#FEE2E2' },
}

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  payment_pending: ['confirmed', 'payment_failed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'delivered'],
  out_for_delivery: ['delivered'],
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [note, setNote] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    adminApi.order(id).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async () => {
    if (!newStatus) return
    setUpdating(true)
    try {
      const updated = await adminApi.updateOrderStatus(id, newStatus, note || undefined)
      setOrder(updated)
      setShowStatusModal(false)
      setNote('')
      setNewStatus('')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this order? This cannot be undone.')) return
    setUpdating(true)
    try {
      const updated = await adminApi.cancelOrder(id)
      setOrder(updated)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div style={{ flex: 1, padding: '32px' }}>
      <div style={{ height: 20, width: 120, background: '#F0F4FA', borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 160, background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }} />
        ))}
      </div>
    </div>
  )

  if (!order) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <XCircle size={32} color="#9EB3C8" />
        <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, color: '#9EB3C8', marginTop: 12 }}>Order not found</p>
        <button onClick={() => router.back()} style={{ marginTop: 12, fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#1568D3', background: 'none', border: 'none', cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    </div>
  )

  const s = STATUS_META[order.status] ?? { label: order.status, color: '#5B6B80', bg: '#F4F7FB' }
  const nextStatuses = NEXT_STATUSES[order.status] ?? []

  return (
    <div style={{ flex: 1 }}>
      {/* Status update modal */}
      {showStatusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowStatusModal(false) }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400 }}>
            <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 18, fontWeight: 700, color: '#0E1B2E', marginBottom: 16 }}>
              Update Order Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {nextStatuses.map(st => {
                const sm = STATUS_META[st]
                return (
                  <button key={st} onClick={() => setNewStatus(st)}
                    style={{
                      padding: '12px 16px', borderRadius: 8, textAlign: 'left',
                      border: `2px solid ${newStatus === st ? sm.color : '#E0E9F4'}`,
                      background: newStatus === st ? sm.bg : 'white',
                      cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13,
                      color: newStatus === st ? sm.color : '#0E1B2E',
                      transition: 'all 0.15s',
                    }}>
                    {sm.label}
                  </button>
                )
              })}
            </div>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Optional note…"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E0E9F4',
                fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E',
                resize: 'vertical', minHeight: 80, outline: 'none', marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowStatusModal(false)}
                style={{ flex: 1, padding: '11px', borderRadius: 8, border: '1px solid #E0E9F4', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>
                Cancel
              </button>
              <button onClick={handleStatusUpdate} disabled={!newStatus || updating}
                style={{ flex: 1, padding: '11px', borderRadius: 8, background: newStatus ? '#1568D3' : '#9EB3C8', border: 'none', cursor: newStatus ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: 'white' }}>
                {updating ? 'Updating…' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9EB3C8', textDecoration: 'none', fontFamily: 'var(--font-bricolage)', fontSize: 13 }}>
            <ArrowLeft size={14} /> Orders
          </Link>
          <span style={{ color: '#E0E9F4' }}>/</span>
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 13, fontWeight: 700, color: '#0E1B2E' }}>{order.order_number}</span>
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 4 }}>
            {s.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {nextStatuses.length > 0 && (
            <button onClick={() => setShowStatusModal(true)}
              style={{ padding: '8px 16px', borderRadius: 8, background: '#1568D3', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} /> Update Status
            </button>
          )}
          {!['cancelled', 'refunded'].includes(order.status) && (
            <button onClick={handleCancel} disabled={updating}
              style={{ padding: '8px 16px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FCA5A5', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              <XCircle size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Items */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={15} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Order Items</span>
            </div>
            <div>
              {order.items?.map(item => (
                <div key={item.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E', marginBottom: 2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8' }}>
                      SKU: {item.sku} · Qty: {item.quantity} × {fmt(item.unit_price_cents)}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 700, color: '#0E1B2E' }}>
                    {fmt(item.total_cents)}
                  </span>
                </div>
              )) ?? (
                <div style={{ padding: '20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8', textAlign: 'center' }}>No items</div>
              )}
              <div style={{ padding: '14px 20px', background: '#F8FAFC' }}>
                {[
                  ['Subtotal', order.subtotal_cents],
                  ['Shipping', order.shipping_cents],
                  ['Tax', order.tax_cents],
                ].map(([label, val]) => (
                  <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{fmt(Number(val))}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #E0E9F4', marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 15, fontWeight: 700, color: '#0E1B2E' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 15, fontWeight: 700, color: '#0E1B2E' }}>{fmt(order.total_cents)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Status Timeline</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {order.status_history?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {order.status_history.map((event, i) => {
                    const sm = STATUS_META[event.status] ?? { label: event.status, color: '#5B6B80' }
                    const isLast = i === order.status_history!.length - 1
                    return (
                      <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: isLast ? 0 : 20, position: 'relative' }}>
                        {!isLast && <div style={{ position: 'absolute', left: 7, top: 20, bottom: 0, width: 2, background: '#F0F4FA' }} />}
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: sm.color, flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>
                            {sm.label}
                          </div>
                          {event.note && <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#5B6B80', marginTop: 2 }}>{event.note}</div>}
                          <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', marginTop: 2 }}>
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No history yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Customer */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={14} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Customer</span>
            </div>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E', marginBottom: 2 }}>
              {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : '—'}
            </div>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>
              {order.customer?.email ?? order.customer_email ?? '—'}
            </div>
            {order.customer?.id && (
              <Link href={`/admin/customers/${order.customer.id}`} style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#1568D3', textDecoration: 'none' }}>
                View profile →
              </Link>
            )}
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <MapPin size={14} color="#1568D3" />
                <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Ship To</span>
              </div>
              {[
                `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
                order.shipping_address.address1,
                `${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zip}`,
                order.shipping_address.country,
              ].map((line, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: i === 0 ? '#0E1B2E' : '#5B6B80', fontWeight: i === 0 ? 600 : 400, marginBottom: 2 }}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Payment */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CreditCard size={14} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Payment</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>Amount</span>
              <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>{fmt(order.total_cents)}</span>
            </div>
            {order.stripe_payment_intent_id && (
              <div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Stripe PI
                </div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', wordBreak: 'break-all' }}>
                  {order.stripe_payment_intent_id}
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '16px 20px' }}>
            {[
              ['Created', order.created_at],
              ['Updated', order.updated_at],
            ].map(([label, ts]) => (
              <div key={String(label)} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80' }}>
                  {ts ? new Date(String(ts)).toLocaleString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
