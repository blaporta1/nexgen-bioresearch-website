'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FlaskConical, AlertCircle } from 'lucide-react'
import { useAdmin } from '@/lib/admin-auth'

export default function AdminLogin() {
  const { login } = useAdmin()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#07101C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #C2D8E0 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #1568D3, #3A85E0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(21,104,211,0.4)',
            }}>
              <FlaskConical size={24} color="white" />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 26, color: 'white', letterSpacing: '-0.02em' }}>
            NexGen Admin
          </div>
          <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginTop: 6 }}>
            BIORESEARCH CONSOLE
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: 32,
          backdropFilter: 'blur(20px)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Sign in
          </h1>
          <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            Enter your admin credentials to continue
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            }}>
              <AlertCircle size={14} color="#EF4444" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#FCA5A5' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@nexgenbioresearch.com"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: 14, fontFamily: 'var(--font-bricolage)',
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#1568D3')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: 14, fontFamily: 'var(--font-bricolage)',
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#1568D3')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 8,
                background: loading ? '#0A3880' : '#1568D3',
                color: 'white', fontFamily: 'var(--font-bricolage)', fontWeight: 600, fontSize: 14,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginTop: 4,
                boxShadow: '0 4px 16px rgba(21,104,211,0.3)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
          First time? Run POST /auth/setup to create your account
        </p>
      </div>
    </div>
  )
}
