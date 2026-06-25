'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign,
  BarChart2, RefreshCw, ArrowRight, Clock, Package,
} from 'lucide-react'
import { adminApi, RevenueSummary, DailyRevenue, SubscriptionMetrics, Order } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

const fmtShort = (cents: number) => {
  const d = cents / 100
  if (d >= 1000) return `$${(d / 1000).toFixed(1)}k`
  return `$${d.toFixed(0)}`
}

const ORDER_STATUSES: Record<string, { label: string; color: string; bg: string }> = {
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

function StatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUSES[status] ?? { label: status, color: '#5B6B80', bg: '#F4F7FB' }
  return (
    <span style={{
      fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: s.color, background: s.bg,
      padding: '3px 8px', borderRadius: 4,
    }}>
      {s.label}
    </span>
  )
}

function BarChart({ data }: { data: DailyRevenue[] }) {
  const W = 600, H = 140
  const PAD = { top: 10, right: 10, bottom: 28, left: 56 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const max = Math.max(...data.map(d => Number(d.revenue_cents)), 1)
  const barCount = data.length
  const totalBarW = chartW / barCount
  const barW = Math.max(4, totalBarW - 2)

  if (!data.length) return (
    <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80' }}>No data yet</span>
    </div>
  )

  const yTicks = [0, 0.25, 0.5, 0.75, 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {yTicks.map(pct => (
        <g key={pct}>
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={PAD.top + chartH * (1 - pct)} y2={PAD.top + chartH * (1 - pct)}
            stroke="#E0E9F4" strokeWidth={1}
          />
          <text
            x={PAD.left - 6} y={PAD.top + chartH * (1 - pct) + 4}
            textAnchor="end" fontSize={9} fill="#9EB3C8"
            fontFamily="var(--font-jetbrains)"
          >
            {fmtShort(max * pct)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = Math.max(2, (Number(d.revenue_cents) / max) * chartH)
        const x = PAD.left + i * totalBarW + (totalBarW - barW) / 2
        const y = PAD.top + chartH - barH
        const isLast = i === data.length - 1
        const showLabel = i === 0 || i === Math.floor(data.length / 2) || isLast
        const dateStr = d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill="#1568D3" rx={2} opacity={isLast ? 1 : 0.7} />
            {showLabel && (
              <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={8} fill="#9EB3C8" fontFamily="var(--font-jetbrains)">
                {dateStr}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function MetricCard({
  label, value, sub, icon: Icon, iconBg, iconColor, trend, loading
}: {
  label: string; value: string; sub?: string
  icon: React.ElementType; iconBg: string; iconColor: string
  trend?: { pct: number | null; label: string }
  loading?: boolean
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 12,
      border: '1px solid #E0E9F4',
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(14,27,46,0.04)',
    }}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0F4FA' }} />
          <div style={{ width: '60%', height: 12, borderRadius: 6, background: '#F0F4FA' }} />
          <div style={{ width: '80%', height: 24, borderRadius: 6, background: '#F0F4FA' }} />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={17} color={iconColor} />
            </div>
            {trend && trend.pct !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {trend.pct >= 0
                  ? <TrendingUp size={12} color="#059669" />
                  : <TrendingDown size={12} color="#DC2626" />}
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: trend.pct >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
                  {trend.pct >= 0 ? '+' : ''}{trend.pct}%
                </span>
              </div>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9EB3C8', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 28, fontWeight: 780, color: '#0E1B2E', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {value}
          </div>
          {sub && (
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#9EB3C8', marginTop: 6 }}>
              {sub}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PageHeader({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <div style={{
      background: 'white', borderBottom: '1px solid #E0E9F4',
      padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E', marginBottom: 2 }}>Dashboard</h1>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>{now}</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          background: '#F0F4FA', border: '1px solid #E0E9F4',
          color: '#5B6B80', fontSize: 12, fontFamily: 'var(--font-bricolage)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        Refresh
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null)
  const [daily, setDaily] = useState<DailyRevenue[]>([])
  const [subs, setSubs] = useState<SubscriptionMetrics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, d, s, o] = await Promise.allSettled([
        adminApi.revenueOverview(),
        adminApi.revenueDaily(30),
        adminApi.subscriptionStats(),
        adminApi.orders({ limit: '8', sort: 'created_at', order: 'desc' }),
      ])
      if (r.status === 'fulfilled') setRevenue(r.value)
      if (d.status === 'fulfilled') setDaily(Array.isArray(d.value) ? d.value : [])
      if (s.status === 'fulfilled') setSubs(s.value)
      if (o.status === 'fulfilled') setRecentOrders(o.value.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const cur = revenue?.current_period
  const prev = revenue?.previous_period
  const growthPct = revenue?.growth_pct ? parseFloat(revenue.growth_pct) : null
  const orderGrowthPct = (cur && prev && Number(prev.order_count) > 0)
    ? Number(((Number(cur.order_count) - Number(prev.order_count)) / Number(prev.order_count) * 100).toFixed(1))
    : null

  const statusGroups: Record<string, number> = {}
  recentOrders.forEach(o => { statusGroups[o.status] = (statusGroups[o.status] ?? 0) + 1 })
  const statusTotal = recentOrders.length || 1

  return (
    <div style={{ flex: 1 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <PageHeader onRefresh={load} loading={loading} />

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <MetricCard
            label="Revenue MTD" loading={loading}
            value={cur ? fmt(Number(cur.total_revenue_cents)) : '$0'}
            sub={prev ? `vs ${fmt(Number(prev.total_revenue_cents))} prior period` : undefined}
            icon={DollarSign} iconBg="#DBEAFE" iconColor="#2563EB"
            trend={{ pct: growthPct, label: 'vs prior period' }}
          />
          <MetricCard
            label="Orders MTD" loading={loading}
            value={cur ? String(cur.order_count) : '0'}
            sub={prev ? `vs ${prev.order_count} prior period` : undefined}
            icon={ShoppingBag} iconBg="#D1FAE5" iconColor="#059669"
            trend={{ pct: orderGrowthPct, label: 'vs prior period' }}
          />
          <MetricCard
            label="Avg Order Value" loading={loading}
            value={cur ? fmt(Number(cur.aov_cents)) : '$0'}
            sub={cur ? `${cur.unique_customers} unique buyers` : undefined}
            icon={BarChart2} iconBg="#EDE9FE" iconColor="#7C3AED"
          />
          <MetricCard
            label="MRR" loading={loading}
            value={subs ? fmt(Number(subs.mrr_cents)) : '$0'}
            sub={subs ? `${subs.counts?.active_count ?? 0} active subscribers` : undefined}
            icon={RefreshCw} iconBg="#FEF3C7" iconColor="#D97706"
          />
        </div>

        {/* Chart Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Revenue chart */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E' }}>
                  Revenue — Last 30 Days
                </div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', marginTop: 2 }}>
                  {daily.reduce((sum, d) => sum + Number(d.revenue_cents), 0) > 0
                    ? fmt(daily.reduce((sum, d) => sum + Number(d.revenue_cents), 0)) + ' total'
                    : 'No orders yet'}
                </div>
              </div>
            </div>
            <BarChart data={daily} />
          </div>

          {/* Order status */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E', marginBottom: 16 }}>
              Orders by Status
            </div>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 28, background: '#F0F4FA', borderRadius: 6, marginBottom: 10 }} />
              ))
            ) : Object.keys(statusGroups).length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120 }}>
                <Package size={24} color="#9EB3C8" />
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 8 }}>No orders yet</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(statusGroups).map(([status, count]) => {
                  const s = ORDER_STATUSES[status] ?? { label: status, color: '#5B6B80', bg: '#F4F7FB' }
                  const pct = Math.round((count / statusTotal) * 100)
                  return (
                    <div key={status}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#0E1B2E' }}>{s.label}</span>
                        <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>{count}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: '#F0F4FA' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E0E9F4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E' }}>
              Recent Orders
            </div>
            <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#1568D3' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Order', 'Customer', 'Date', 'Total', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9EB3C8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} style={{ padding: '14px 24px' }}>
                          <div style={{ height: 12, background: '#F0F4FA', borderRadius: 4, width: '70%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px 24px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>
                      No orders yet — they&apos;ll appear here after checkout
                    </td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} style={{ borderTop: '1px solid #F0F4FA' }}>
                      <td style={{ padding: '14px 24px' }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, fontWeight: 700, color: '#1568D3' }}>
                            {order.order_number}
                          </span>
                        </Link>
                      </td>
                      <td style={{ padding: '14px 24px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>
                        {order.customer?.email ?? order.customer_email ?? '—'}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>
                          <Clock size={11} />
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>
                        {fmt(order.total_cents)}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription snapshot */}
        {subs && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Active Subs', value: subs.counts?.active_count ?? 0, color: '#059669' },
              { label: 'Paused', value: subs.counts?.paused_count ?? 0, color: '#D97706' },
              { label: 'In Dunning', value: subs.counts?.dunning_count ?? 0, color: '#DC2626' },
              { label: 'Churn Rate', value: `${subs.churn_rate_pct ?? 0}%`, color: '#5B6B80' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'white', borderRadius: 12, border: '1px solid #E0E9F4',
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9EB3C8', marginBottom: 2 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
