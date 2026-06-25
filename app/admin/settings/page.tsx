'use client'
import { useEffect, useState, useCallback } from 'react'
import { Key, Plus, Trash2, Copy, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { adminApi, ApiKey } from '@/lib/admin-client'
import { useAdmin } from '@/lib/admin-auth'

export default function SettingsPage() {
  const { user } = useAdmin()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [showKey, setShowKey] = useState(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const keys = await adminApi.apiKeys()
      setApiKeys(Array.isArray(keys) ? keys : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const result = await adminApi.createApiKey(newKeyName.trim())
      setNewKeyValue(result.key)
      setNewKeyName('')
      await load()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create key', false)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (key: ApiKey) => {
    if (!confirm(`Revoke API key "${key.name}"? This cannot be undone.`)) return
    try {
      await adminApi.deleteApiKey(key.id)
      setApiKeys(prev => prev.filter(k => k.id !== key.id))
      showToast(`"${key.name}" revoked`)
    } catch {
      showToast('Failed to revoke key', false)
    }
  }

  const copyKey = () => {
    if (!newKeyValue) return
    navigator.clipboard.writeText(newKeyValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ flex: 1 }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 8,
          background: toast.ok ? '#0E1B2E' : '#DC2626',
          color: 'white', padding: '12px 18px', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          fontFamily: 'var(--font-bricolage)', fontSize: 13,
          animation: 'slideIn 0.2s ease',
        }}>
          {toast.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px' }}>
        <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Settings</h1>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>
          API keys and account configuration
        </p>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Account card */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E', marginBottom: 16 }}>
            Account
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Name', value: user?.name ?? '—' },
              { label: 'Email', value: user?.email ?? '—' },
              { label: 'Role', value: user?.role?.toUpperCase() ?? '—' },
              { label: 'Admin ID', value: user?.id ?? '—' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: item.label === 'Admin ID' ? 'var(--font-jetbrains)' : 'var(--font-bricolage)', fontSize: item.label === 'Admin ID' ? 11 : 13, color: '#0E1B2E', wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New key revealed */}
        {newKeyValue && (
          <div style={{ background: '#F0FFF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle size={16} color="#059669" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#059669' }}>
                API key created — copy it now!
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#166534', marginBottom: 12 }}>
              This key will not be shown again. Store it securely.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, fontFamily: 'var(--font-jetbrains)', fontSize: 12,
                background: 'white', border: '1px solid #86EFAC', borderRadius: 8,
                padding: '10px 14px', color: '#0E1B2E', wordBreak: 'break-all',
                letterSpacing: '0.02em',
              }}>
                {showKey ? newKeyValue : '•'.repeat(Math.min(newKeyValue.length, 48))}
              </div>
              <button onClick={() => setShowKey(v => !v)} style={{ padding: '10px', borderRadius: 8, background: 'white', border: '1px solid #86EFAC', cursor: 'pointer', color: '#059669', display: 'flex', alignItems: 'center' }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button onClick={copyKey} style={{ padding: '10px 14px', borderRadius: 8, background: copied ? '#059669' : '#1568D3', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-bricolage)', fontSize: 13 }}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button onClick={() => setNewKeyValue(null)} style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 12, color: '#166534', textDecoration: 'underline' }}>
              I&apos;ve saved it, dismiss
            </button>
          </div>
        )}

        {/* API Keys */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Key size={15} color="#1568D3" />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 15, color: '#0E1B2E' }}>API Keys</span>
            </div>
            <button onClick={() => setShowCreate(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#1568D3', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 12, fontWeight: 600, color: 'white' }}>
              <Plus size={13} /> New Key
            </button>
          </div>

          {showCreate && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0F4FA', background: '#F8FAFC', display: 'flex', gap: 10 }}>
              <input
                autoFocus value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Key name (e.g. Website, Zapier…)"
                style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: '1px solid #E0E9F4', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#0E1B2E', outline: 'none', background: 'white' }}
              />
              <button onClick={handleCreate} disabled={creating || !newKeyName.trim()} style={{ padding: '9px 16px', borderRadius: 8, background: creating || !newKeyName.trim() ? '#9EB3C8' : '#1568D3', border: 'none', cursor: creating || !newKeyName.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: 'white' }}>
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button onClick={() => { setShowCreate(false); setNewKeyName('') }} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #E0E9F4', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#5B6B80' }}>
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2].map(i => <div key={i} style={{ height: 48, background: '#F0F4FA', borderRadius: 8 }} />)}
            </div>
          ) : !apiKeys.length ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8' }}>
              No API keys yet — create one to integrate with the website or third-party tools.
            </div>
          ) : (
            <div>
              {apiKeys.map(key => (
                <div key={key.id} style={{ padding: '14px 24px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Key size={14} color="#5B6B80" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E', marginBottom: 2 }}>{key.name}</div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <code style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80', background: '#F0F4FA', padding: '2px 6px', borderRadius: 3 }}>
                          {key.key_prefix}••••••••
                        </code>
                        {key.scopes.map(s => (
                          <span key={s} style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#1568D3', background: '#E8F1FB', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                        {key.last_used_at ? 'Last used' : 'Never used'}
                      </div>
                      {key.last_used_at && (
                        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80' }}>
                          {new Date(key.last_used_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDelete(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9EB3C8', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9EB3C8')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Environment reference */}
        <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E0E9F4', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: 14, color: '#0E1B2E', marginBottom: 12 }}>
            Environment Variables
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'NEXT_PUBLIC_CRM_URL', val: process.env.NEXT_PUBLIC_CRM_URL || '(not set)', ok: Boolean(process.env.NEXT_PUBLIC_CRM_URL) },
              { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', val: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '••••set••••' : '(not set)', ok: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'white', borderRadius: 8, border: '1px solid #E0E9F4' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.ok ? '#059669' : '#DC2626', flexShrink: 0 }} />
                <code style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#0E1B2E', flex: 1 }}>{item.key}</code>
                <code style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80' }}>{item.val}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  )
}
