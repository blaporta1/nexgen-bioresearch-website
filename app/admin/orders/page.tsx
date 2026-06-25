'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { adminApi, Order, Paginated } from '@/lib/admin-client'

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

const ALL_STATUSES = Object.keys(STATUS_META)

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_META[status] ?? { label: status, color: '#5B6B80', bg: '#F4F7FB' }
  return (
    <span style={{
      fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 4,
    }}>
      {s.label}
    </span>
  )
}

export default function OrdersPage() {
  const [result, setResult] = useState<Paginated<Order> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit), sort: 'created_at', order: 'desc' }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const data = await adminApi.orders(params)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { load() }, [load])

  const totalPages = result ? Math.ceil(result.total / limit) : 1

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Orders</h1>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>
            {result ? `${result.total.toLocaleString()} total orders` : 'Loading…'}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9EB3C8' }} />
            <input
              type="text"
              placeholder="Search order number, email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                borderRadius: 8, border: '1px solid #E0E9F4', background: '#F8FAFC',
                fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={13} color="#9EB3C8" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              style={{
                padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E9F4',
                background: '#F8FAFC', fontFamily: 'var(--font-bricolage)', fontSize: 13,
                color: '#0E1B2E', outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{
                      padding: '11px 20px', textAlign: 'left',
                      fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#9EB3C8', fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F0F4FA' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 20px' }}>
                          <div style={{ height: 12, background: '#F0F4FA', borderRadius: 4, width: j === 1 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !result?.data?.length ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  result.data.map(order => (
                    <tr key={order.id} style={{ borderTop: '1px solid #F0F4FA', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFCFF')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, fontWeight: 700, color: '#1568D3' }}>
                          {order.order_number}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.customer?.email ?? order.customer_email ?? '—'}
                        </div>
                        {(order.customer?.first_name || order.customer?.last_name) && (
                          <div style={{ fontSize: 11, color: '#9EB3C8', marginTop: 1 }}>
                            {order.customer.first_name} {order.customer.last_name}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>
                        {order.items ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : '—'}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>
                        {fmt(order.total_cents)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', whiteSpace: 'nowrap' }}>
                          <Clock size={11} />
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <Link href={`/admin/orders/${order.id}`} style={{
                          fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#1568D3',
                          textDecoration: 'none', fontWeight: 500,
                        }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {result && result.total > limit && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>
                Page {page} of {totalPages} · {result.total} orders
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9EB3C8' : '#0E1B2E' }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#9EB3C8' : '#0E1B2E' }}
                >
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
