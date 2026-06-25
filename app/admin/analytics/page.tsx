'use client'
import { useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { adminApi, RevenueSummary, DailyRevenue, SubscriptionMetrics, LtvStats } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((cents ?? 0) / 100)

function BarChart({ data, labelKey = 'date' }: { data: DailyRevenue[]; labelKey?: string }) {
  const W = 700, H = 180
  const PAD = { top: 16, right: 16, bottom: 36, left: 64 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const max = Math.max(...data.map(d => Number(d.revenue_cents)), 1)
  const barCount = data.length
  const totalBarW = chartW / barCount
  const barW = Math.max(3, totalBarW - 2)

  if (!data.length) return (
    <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>No data yet</span>
    </div>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <g key={pct}>
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + chartH * (1 - pct)} y2={PAD.top + chartH * (1 - pct)} stroke="#E0E9F4" strokeWidth={1} />
          <text x={PAD.left - 8} y={PAD.top + chartH * (1 - pct) + 4} textAnchor="end" fontSize={9} fill="#9EB3C8" fontFamily="var(--font-jetbrains)">
            {fmt(max * pct)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = Math.max(2, (Number(d.revenue_cents) / max) * chartH)
        const x = PAD.left + i * totalBarW + (totalBarW - barW) / 2
        const y = PAD.top + chartH - barH
        const showLabel = i === 0 || i === Math.floor(barCount / 3) || i === Math.floor(barCount * 2 / 3) || i === barCount - 1
        const dateStr = d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill="#1568D3" rx={2} opacity={0.8} />
            {showLabel && <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={8} fill="#9EB3C8" fontFamily="var(--font-jetbrains)">{dateStr}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function LtvCohortTable({ ltvData }: { ltvData: LtvStats }) {
  const cohorts = ltvData.cohorts?.slice(0, 8) ?? []
  if (!cohorts.length) return <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No cohort data yet</p>
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#F8FAFC' }}>
          {['Cohort', 'Customers', 'Avg LTV', 'Avg Orders'].map(h => (
            <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9EB3C8', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cohorts.map(c => (
          <tr key={c.cohort_month} style={{ borderTop: '1px solid #F0F4FA' }}>
            <td style={{ padding: '10px 16px', fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#0E1B2E', fontWeight: 600 }}>{c.cohort_month}</td>
            <td style={{ padding: '10px 16px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{c.customers}</td>
            <td style={{ padding: '10px 16px', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: '#0E1B2E' }}>{fmt(c.avg_ltv_cents)}</td>
            <td style={{ padding: '10px 16px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{Number(c.avg_orders).toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null)
  const [daily30, setDaily30] = useState<DailyRevenue[]>([])
  const [daily90, setDaily90] = useState<DailyRevenue[]>([])
  const [subs, setSubs] = useState<SubscriptionMetrics | null>(null)
  const [ltv, setLtv] = useState<LtvStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<30 | 90>(30)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, d30, d90, s, l] = await Promise.allSettled([
        adminApi.revenueOverview(),
        adminApi.revenueDaily(30),
        adminApi.revenueDaily(90),
        adminApi.subscriptionStats(),
        adminApi.ltv(),
      ])
      if (r.status === 'fulfilled') setRevenue(r.value)
      if (d30.status === 'fulfilled') setDaily30(Array.isArray(d30.value) ? d30.value : [])
      if (d90.status === 'fulfilled') setDaily90(Array.isArray(d90.value) ? d90.value : [])
      if (s.status === 'fulfilled') setSubs(s.value)
      if (l.status === 'fulfilled') setLtv(l.value)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const cur = revenue?.current_period
  const prev = revenue?.previous_period

  const dailyData = period === 30 ? daily30 : daily90

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Analytics</h1>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>Revenue, subscriptions, LTV, and cohort data</p>
        </div>
        <button onClick={load} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#F0F4FA', border: '1px solid #E0E9F4', color: '#5B6B80', fontSize: 12, fontFamily: 'var(--font-bricolage)', cursor: 'pointer' }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Revenue comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Revenue (Current)', value: cur ? fmt(Number(cur.total_revenue_cents)) : '—', sub: prev ? `Prior: ${fmt(Number(prev.total_revenue_cents))}` : '', growth: revenue?.growth_pct },
            { label: 'Orders (Current)', value: cur ? String(cur.order_count) : '—', sub: prev ? `Prior: ${prev.order_count}` : '', growth: null },
            { label: 'AOV', value: cur ? fmt(Number(cur.aov_cents)) : '—', sub: 'Average order value', growth: null },
            { label: 'Unique Buyers', value: cur ? String(cur.unique_customers) : '—', sub: 'This period', growth: null },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '18px 20px' }}>
              {loading ? (
                <div>
                  <div style={{ height: 10, width: '60%', background: '#F0F4FA', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ height: 24, width: '80%', background: '#F0F4FA', borderRadius: 6 }} />
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 26, fontWeight: 780, color: '#0E1B2E', letterSpacing: '-0.02em' }}>{card.value}</div>
                  <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 11, color: card.growth !== undefined && card.growth !== null && parseFloat(String(card.growth)) > 0 ? '#059669' : '#9EB3C8', marginTop: 4 }}>
                    {card.growth !== null && card.growth !== undefined ? `${parseFloat(String(card.growth)) > 0 ? '+' : ''}${card.growth}% vs prior` : card.sub}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Revenue chart with period toggle */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E' }}>Daily Revenue</div>
              <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', marginTop: 2 }}>
                Total: {fmt(dailyData.reduce((s, d) => s + Number(d.revenue_cents), 0))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {([30, 90] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${period === p ? '#1568D3' : '#E0E9F4'}`, background: period === p ? '#E8F1FB' : 'white', color: period === p ? '#1568D3' : '#9EB3C8', fontFamily: 'var(--font-jetbrains)', fontSize: 10, cursor: 'pointer', fontWeight: period === p ? 600 : 400 }}>
                  {p}d
                </button>
              ))}
            </div>
          </div>
          <BarChart data={dailyData} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Subscription metrics */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E', marginBottom: 16 }}>Subscriptions</div>
            {!subs || loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 40, background: '#F0F4FA', borderRadius: 8, marginBottom: 10 }} />)
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'MRR', value: fmt(Number(subs.mrr_cents)), big: true },
                  { label: 'Active Subscribers', value: String(subs.counts?.active_count ?? 0) },
                  { label: 'Paused', value: String(subs.counts?.paused_count ?? 0) },
                  { label: 'In Dunning', value: String(subs.counts?.dunning_count ?? 0) },
                  { label: 'Churn Rate (30d)', value: `${subs.churn_rate_pct ?? 0}%` },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{m.label}</span>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: m.big ? 18 : 14, fontWeight: m.big ? 780 : 600, color: '#0E1B2E' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LTV */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E', marginBottom: 16 }}>Customer Lifetime Value</div>
            {!ltv || loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 40, background: '#F0F4FA', borderRadius: 8, marginBottom: 10 }} />)
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Average LTV', value: fmt(Number(ltv.summary?.avg_ltv_cents ?? 0)), big: true },
                  { label: 'Median LTV', value: fmt(Number(ltv.summary?.median_ltv_cents ?? 0)) },
                  { label: 'P90 LTV', value: fmt(Number(ltv.summary?.p90_ltv_cents ?? 0)) },
                  { label: 'Max LTV', value: fmt(Number(ltv.summary?.max_ltv_cents ?? 0)) },
                  { label: 'Qualifying Customers', value: String(ltv.summary?.customer_count ?? 0) },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>{m.label}</span>
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: m.big ? 18 : 14, fontWeight: m.big ? 780 : 600, color: '#0E1B2E' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LTV by cohort */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4FA' }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E' }}>LTV by Cohort</div>
            <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', marginTop: 2 }}>Customer lifetime value grouped by first-order month</div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ height: 36, background: '#F0F4FA', borderRadius: 6 }} />)}
              </div>
            ) : ltv ? (
              <LtvCohortTable ltvData={ltv} />
            ) : (
              <div style={{ padding: '24px 20px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No data yet</div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
