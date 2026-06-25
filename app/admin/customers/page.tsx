'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { adminApi, Customer, Paginated } from '@/lib/admin-client'

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

export default function CustomersPage() {
  const [result, setResult] = useState<Paginated<Customer> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 25

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit), sort: 'total_spent_cents', order: 'desc' }
      if (search) params.search = search
      const data = await adminApi.customers(params)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const totalPages = result ? Math.ceil(result.total / limit) : 1

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Customers</h1>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>
            {result ? `${result.total.toLocaleString()} total customers` : 'Loading…'}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '14px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9EB3C8' }} />
            <input
              type="text" placeholder="Search by email, name, or phone…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                borderRadius: 8, border: '1px solid #E0E9F4', background: '#F8FAFC',
                fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E', outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Customer', 'Total Spent', 'Orders', 'AOV', 'Tags', 'Joined', ''].map(h => (
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
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F0F4FA' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 20px' }}>
                          <div style={{ height: 12, background: '#F0F4FA', borderRadius: 4, width: j === 0 ? '80%' : '50%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !result?.data?.length ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center' }}>
                      <Users size={28} color="#9EB3C8" style={{ margin: '0 auto 10px' }} />
                      <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>No customers yet</p>
                    </td>
                  </tr>
                ) : (
                  result.data.map(customer => (
                    <tr key={customer.id} style={{ borderTop: '1px solid #F0F4FA', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFCFF')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E', marginBottom: 2 }}>
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
                            : '—'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#5B6B80' }}>{customer.email}</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 700, color: '#0E1B2E' }}>
                        {fmt(customer.total_spent_cents)}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 14, color: '#0E1B2E' }}>
                        {customer.order_count}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>
                        {customer.aov_cents ? fmt(customer.aov_cents) : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {customer.tags?.includes('vip') && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#D97706', background: '#FEF3C7', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.06em' }}>
                              <Star size={8} />VIP
                            </span>
                          )}
                          {customer.tags?.filter(t => t !== 'vip').slice(0, 2).map(tag => (
                            <span key={tag} style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#5B6B80', background: '#F0F4FA', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.06em' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', whiteSpace: 'nowrap' }}>
                        {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <Link href={`/admin/customers/${customer.id}`} style={{ fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#1568D3', textDecoration: 'none', fontWeight: 500 }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {result && result.total > limit && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8' }}>
                Page {page} of {totalPages} · {result.total} customers
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9EB3C8' : '#0E1B2E' }}>
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E0E9F4', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#9EB3C8' : '#0E1B2E' }}>
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
