'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, RefreshCw, Tag, X, Plus } from 'lucide-react'
import { adminApi, Customer } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

const STATUS_META: Record<string, { color: string; bg: string }> = {
  active: { color: '#059669', bg: '#D1FAE5' },
  paused: { color: '#D97706', bg: '#FEF3C7' },
  cancelled: { color: '#DC2626', bg: '#FEE2E2' },
  dunning: { color: '#7C3AED', bg: '#EDE9FE' },
}

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState('')
  const [addingTag, setAddingTag] = useState(false)
  const [tagInput, setTagInput] = useState(false)

  const reload = () => {
    setLoading(true)
    adminApi.customerProfile(id).then(setCustomer).finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [id])

  const handleAddTag = async () => {
    if (!newTag.trim() || !customer) return
    setAddingTag(true)
    try {
      await adminApi.addTag(id, newTag.trim().toLowerCase())
      setCustomer(prev => prev ? { ...prev, tags: [...(prev.tags ?? []), newTag.trim().toLowerCase()] } : prev)
      setNewTag('')
      setTagInput(false)
    } finally {
      setAddingTag(false)
    }
  }

  const handleRemoveTag = async (tag: string) => {
    await adminApi.removeTag(id, tag)
    setCustomer(prev => prev ? { ...prev, tags: prev.tags.filter(t => t !== tag) } : prev)
  }

  if (loading) return (
    <div style={{ flex: 1, padding: 32 }}>
      <div style={{ height: 20, width: 200, background: '#F0F4FA', borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ height: 80, background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }} />)}
      </div>
    </div>
  )

  if (!customer) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, color: '#9EB3C8' }}>Customer not found</p>
    </div>
  )

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9EB3C8', textDecoration: 'none', fontFamily: 'var(--font-bricolage)', fontSize: 13 }}>
          <ArrowLeft size={14} /> Customers
        </Link>
        <span style={{ color: '#E0E9F4' }}>/</span>
        <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E' }}>
          {customer.first_name} {customer.last_name}
        </span>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Profile header */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1568D3, #3A85E0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 18, color: 'white',
              }}>
                {(customer.first_name?.[0] ?? customer.email[0]).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 18, fontWeight: 700, color: '#0E1B2E' }}>
                  {customer.first_name} {customer.last_name}
                </div>
                <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{customer.email}</div>
                {customer.phone && <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>{customer.phone}</div>}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', textAlign: 'right' }}>
              Customer since<br />
              <span style={{ fontSize: 12, color: '#5B6B80', fontWeight: 500 }}>
                {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Spent', value: fmt(customer.total_spent_cents) },
              { label: 'Orders', value: String(customer.order_count) },
              { label: 'Avg Order', value: customer.aov_cents ? fmt(customer.aov_cents) : '—' },
            ].map(m => (
              <div key={m.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 22, fontWeight: 700, color: '#0E1B2E' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Tag size={13} color="#9EB3C8" />
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tags</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {customer.tags?.map(tag => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#1568D3', background: '#E8F1FB', border: '1px solid #B3CDEF', padding: '3px 8px', borderRadius: 4 }}>
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#6BA3E2' }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
              {tagInput ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    autoFocus value={newTag} onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                    placeholder="tag name" style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #B3CDEF', fontFamily: 'var(--font-jetbrains)', fontSize: 10, outline: 'none', width: 100 }}
                  />
                  <button onClick={handleAddTag} disabled={addingTag} style={{ padding: '3px 8px', borderRadius: 4, background: '#1568D3', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: 'white' }}>
                    {addingTag ? '…' : 'Add'}
                  </button>
                  <button onClick={() => { setTagInput(false); setNewTag('') }} style={{ padding: '3px 8px', borderRadius: 4, background: '#F0F4FA', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80' }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setTagInput(true)} style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', background: '#F0F4FA', border: '1px dashed #C2D8E0', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}>
                  <Plus size={9} /> Add Tag
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent orders */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={14} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Recent Orders</span>
            </div>
            {!customer.recent_orders?.length ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No orders</div>
            ) : (
              customer.recent_orders.map(order => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #F0F4FA', textDecoration: 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFCFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, fontWeight: 700, color: '#1568D3' }}>{order.order_number}</div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', marginTop: 1 }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>{fmt(order.total_cents)}</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Subscriptions */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={14} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E' }}>Subscriptions</span>
            </div>
            {!customer.subscriptions?.length ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No subscriptions</div>
            ) : (
              customer.subscriptions.map(sub => {
                const sm = STATUS_META[sub.status] ?? { color: '#5B6B80', bg: '#F4F7FB' }
                return (
                  <div key={sub.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>
                        Every {sub.billing_interval_count} {sub.billing_interval}
                      </span>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: sm.color, background: sm.bg, padding: '2px 6px', borderRadius: 3 }}>
                        {sub.status}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8' }}>
                      Next: {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : 'N/A'}
                      {sub.discount_percent ? ` · ${sub.discount_percent}% off` : ''}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
