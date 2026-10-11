'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FlaskConical, AlertCircle, CheckCircle } from 'lucide-react'
import { adminApi } from '@/lib/admin-client'

export default function AdminSetup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 10) {
      setError('Password must be at least 10 characters')
      return
    }
    setLoading(true)
    try {
      await adminApi.setup(email, password, name)
      setDone(true)
      setTimeout(() => router.push('/admin/login'), 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed')
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
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #C2D8E0 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #1568D3, #3A85E0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(21,104,211,0.4)',
            }}>
              <FlaskConical size={24} color="white" />
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 22, color: 'white', marginBottom: 8 }}>
            Admin Setup
          </h1>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            CREATE YOUR FIRST ADMIN ACCOUNT
          </p>
        </div>

        {done ? (
          <div style={{
            background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)',
            borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />
            <p style={{ color: '#10B981', fontSize: 14, fontFamily: 'var(--font-bricolage)' }}>
              Admin created! Redirecting to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: 'rgba(21,104,211,0.08)', border: '1px solid rgba(21,104,211,0.2)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 4,
            }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontFamily: 'var(--font-bricolage)' }}>
                This page is only available before any admin accounts exist.
                Once created, this route will return 403.
              </p>
            </div>

            {[
              { label: 'Full Name', value: name, set: setName, type: 'text', placeholder: 'Dr. Jane Smith' },
              { label: 'Email Address', value: email, set: setEmail, type: 'email', placeholder: 'admin@nexgenbioresearch.com' },
              { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: 'Min 10 characters' },
              { label: 'Confirm Password', value: confirm, set: setConfirm, type: 'password', placeholder: 'Repeat password' },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 6 }}>
                  {field.label.toUpperCase()}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: 14, fontFamily: 'var(--font-bricolage)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <AlertCircle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
                <p style={{ color: '#EF4444', fontSize: 13, fontFamily: 'var(--font-bricolage)' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4, padding: '14px 24px', borderRadius: 10, border: 'none',
                background: loading ? 'rgba(21,104,211,0.5)' : 'linear-gradient(135deg, #1568D3, #3A85E0)',
                color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-bricolage)', letterSpacing: '-0.01em',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(21,104,211,0.35)',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Creating admin…' : 'Create Admin Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-bricolage)' }}>
              Already set up?{' '}
              <a href="/admin/login" style={{ color: '#3A85E0', textDecoration: 'none' }}>Sign in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
