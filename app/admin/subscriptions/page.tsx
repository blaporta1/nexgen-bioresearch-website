'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

const STATUS_META: Record<string, { color: string; bg: string }> = {
  active: { color: '#059669', bg: '#D1FAE5' },
  paused: { color: '#D97706', bg: '#FEF3C7' },
  cancelled: { color: '#DC2626', bg: '#FEE2E2' },
  dunning: { color: '#7C3AED', bg: '#EDE9FE' },
  pending: { color: '#2563EB', bg: '#DBEAFE' },
}

interface SubRow {
  id: string; status: string; billing_interval: string; billing_interval_count: number
  next_billing_date: string; created_at: string; cancelled_at?: string
  customer?: { id: string; email: string; first_name: string; last_name: string }
  discount_percent?: number
}

export default function SubscriptionsPage() {
  const [data, setData] = useState<{ data: SubRow[]; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await (adminApi as unknown as { subscriptions: (p: Record<string,string>) => Promise<{data: SubRow[]; total: number}> })
        .subscriptions?.({ page: String(page), limit: String(limit) })
        ?? { data: [], total: 0 }
      setData(result)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const totalPages = data ? Math.ceil(data.total / limit) : 1

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px' }}>
        <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Subscriptions</h1>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>
          {data ? `${data.total} total subscriptions` : 'Loading…'}
        </p>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Customer', 'Interval', 'Status', 'Next Billing', 'Discount', ''].map(h => (
                    <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9EB3C8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F0F4FA' }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 20px' }}>
                          <div style={{ height: 12, background: '#F0F4FA', borderRadius: 4, width: j === 0 ? '70%' : '50%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !data?.data?.length ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center' }}>
                      <RefreshCw size={28} color="#9EB3C8" style={{ margin: '0 auto 10px' }} />
                      <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No subscriptions yet</p>
                    </td>
                  </tr>
                ) : (
                  data.data.map(sub => {
                    const sm = STATUS_META[sub.status] ?? { color: '#5B6B80', bg: '#F4F7FB' }
                    return (
                      <tr key={sub.id} style={{ borderTop: '1px solid #F0F4FA' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FAFCFF')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '14px 20px' }}>
                          {sub.customer ? (
                            <Link href={`/admin/customers/${sub.customer.id}`} style={{ textDecoration: 'none' }}>
                              <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#1568D3' }}>
                                {sub.customer.first_name} {sub.customer.last_name}
                              </div>
                              <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 11, color: '#9EB3C8' }}>{sub.customer.email}</div>
                            </Link>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E' }}>
                          Every {sub.billing_interval_count} {sub.billing_interval}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: sm.color, background: sm.bg, padding: '3px 8px', borderRadius: 4 }}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80' }}>
                          {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E' }}>
                          {sub.discount_percent ? `${sub.discount_percent}%` : '—'}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          {sub.customer && (
                            <Link href={`/admin/customers/${sub.customer.id}`} style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#1568D3', textDecoration: 'none' }}>
                              View →
                            </Link>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {data && data.total > limit && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>Page {page} of {totalPages}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9EB3C8' : '#0E1B2E' }}>
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#9EB3C8' : '#0E1B2E' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
