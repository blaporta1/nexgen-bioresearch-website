'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ShoppingBag, Users, BarChart2,
  Zap, Settings, LogOut, RefreshCw, ChevronRight,
  FlaskConical, AlertCircle
} from 'lucide-react'
import { AdminAuthProvider, useAdmin } from '@/lib/admin-auth'
import { isCrmConfigured } from '@/lib/admin-client'

const NAV = [
  {
    group: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    ],
  },
  {
    group: 'Automate',
    items: [
      { label: 'Workflows', href: '/admin/workflows', icon: Zap },
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: RefreshCw },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAdmin()
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [isLoading, user, isLoginPage, router])

  if (isLoginPage) return <>{children}</>
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#07101C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <FlaskConical size={32} color="#1568D3" />
          <div style={{ fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.08em' }}>
            LOADING...
          </div>
        </div>
      </div>
    )
  }
  if (!user) return null

  const configured = isCrmConfigured()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EEF2F7' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: '#07101C',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #1568D3, #3A85E0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <FlaskConical size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 13, color: 'white', lineHeight: 1.2 }}>NexGen</div>
              <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Console</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.map(group => (
            <div key={group.group} style={{ marginBottom: 8 }}>
              <div style={{
                fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                padding: '8px 12px 4px',
              }}>
                {group.group}
              </div>
              {group.items.map(item => {
                const active = pathname?.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                      textDecoration: 'none', transition: 'background 0.15s',
                      background: active ? 'rgba(21,104,211,0.12)' : 'transparent',
                      borderLeft: active ? '2px solid #1568D3' : '2px solid transparent',
                      color: active ? '#3A85E0' : 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }}
                  >
                    <Icon size={15} />
                    <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: active ? 600 : 400 }}>
                      {item.label}
                    </span>
                    {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 4 }}>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2 }}>
              {user.name}
            </div>
            <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
              {user.role.toUpperCase()}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px', borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'
              ;(e.currentTarget as HTMLElement).style.color = '#EF4444'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'
            }}
          >
            <LogOut size={14} />
            <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13 }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 240, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {!configured && (
          <div style={{
            background: '#7C3AED', color: 'white', padding: '10px 24px',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
            fontFamily: 'var(--font-bricolage)',
          }}>
            <AlertCircle size={15} />
            <span>
              <strong>CRM not connected.</strong> Add{' '}
              <code style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-jetbrains)', fontSize: 11 }}>
                NEXT_PUBLIC_CRM_URL
              </code>{' '}
              to <code style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-jetbrains)', fontSize: 11 }}>.env.local</code>{' '}
              to load live data.
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  )
}
