'use client'
import { useEffect, useState, useCallback } from 'react'
import { Zap, ToggleLeft, ToggleRight, Trash2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { adminApi, Workflow, Paginated } from '@/lib/admin-client'

const TRIGGER_LABELS: Record<string, string> = {
  order_placed: 'Order Placed',
  order_confirmed: 'Order Confirmed',
  order_shipped: 'Order Shipped',
  order_delivered: 'Order Delivered',
  order_cancelled: 'Order Cancelled',
  order_refunded: 'Order Refunded',
  payment_failed: 'Payment Failed',
  subscription_created: 'Subscription Created',
  subscription_renewed: 'Subscription Renewed',
  subscription_cancelled: 'Subscription Cancelled',
  subscription_paused: 'Subscription Paused',
  subscription_dunning: 'Subscription Dunning',
  abandoned_cart: 'Abandoned Cart',
  customer_created: 'Customer Created',
  customer_tag_added: 'Customer Tag Added',
  review_requested: 'Review Requested',
  manual: 'Manual Trigger',
}

export default function WorkflowsPage() {
  const [result, setResult] = useState<Paginated<Workflow> | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminApi.workflows()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (wf: Workflow) => {
    setToggling(wf.id)
    try {
      const updated = await adminApi.toggleWorkflow(wf.id)
      setResult(prev => prev ? { ...prev, data: prev.data.map(w => w.id === wf.id ? updated : w) } : prev)
      showToast(`"${wf.name}" ${updated.is_active ? 'enabled' : 'disabled'}`)
    } catch {
      showToast('Failed to toggle workflow', false)
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async (wf: Workflow) => {
    if (!confirm(`Delete "${wf.name}"? This cannot be undone.`)) return
    setDeleting(wf.id)
    try {
      await adminApi.deleteWorkflow(wf.id)
      setResult(prev => prev ? { ...prev, data: prev.data.filter(w => w.id !== wf.id), total: prev.total - 1 } : prev)
      showToast(`"${wf.name}" deleted`)
    } catch {
      showToast('Failed to delete workflow', false)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={{ flex: 1 }}>
      {/* Toast */}
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

      <div style={{ background: 'white', borderBottom: '1px solid #E0E9F4', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 20, fontWeight: 700, color: '#0E1B2E' }}>Workflows</h1>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#9EB3C8', marginTop: 2 }}>
            Event-driven automation — {result?.total ?? 0} workflows
          </p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, background: '#1568D3', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-bricolage)', fontSize: 13, fontWeight: 600, color: 'white', boxShadow: '0 2px 8px rgba(21,104,211,0.3)' }}>
          <Plus size={14} /> New Workflow
        </button>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 80, background: 'white', borderRadius: 12, border: '1px solid #E0E9F4' }} />
            ))}
          </div>
        ) : !result?.data?.length ? (
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E0E9F4', padding: '60px 32px', textAlign: 'center' }}>
            <Zap size={32} color="#9EB3C8" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 15, fontWeight: 600, color: '#0E1B2E', marginBottom: 6 }}>No workflows yet</div>
            <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 13, color: '#9EB3C8', maxWidth: 360, margin: '0 auto 20px' }}>
              Create your first automation — post-purchase emails, dunning sequences, VIP tagging, and more.
            </div>
            <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#9EB3C8', background: '#F8FAFC', border: '1px solid #E0E9F4', borderRadius: 8, padding: '12px 16px', maxWidth: 500, margin: '0 auto', textAlign: 'left', lineHeight: 1.8 }}>
              POST {process.env.NEXT_PUBLIC_CRM_URL}/api/v1/workflows<br />
              Authorization: Bearer &lt;token&gt;<br />
              {'{'}&quot;name&quot;: &quot;Post-Delivery Email&quot;, &quot;trigger&quot;: &quot;order_delivered&quot;, ...{'}'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.data.map(wf => (
              <div key={wf.id} style={{
                background: 'white', borderRadius: 12,
                border: `1px solid ${wf.is_active ? '#B3CDEF' : '#E0E9F4'}`,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'box-shadow 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(14,27,46,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: wf.is_active ? '#E8F1FB' : '#F0F4FA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={16} color={wf.is_active ? '#1568D3' : '#9EB3C8'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-bricolage)', fontSize: 14, fontWeight: 600, color: '#0E1B2E', marginBottom: 3 }}>
                    {wf.name}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1568D3', background: '#E8F1FB', padding: '2px 6px', borderRadius: 3 }}>
                      {TRIGGER_LABELS[wf.trigger] ?? wf.trigger}
                    </span>
                    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8', display: 'flex', alignItems: 'center', gap: 3 }}>
                      {wf.steps?.length ?? 0} steps
                    </span>
                    {wf.run_once_per_customer && (
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8' }}>once per customer</span>
                    )}
                    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#9EB3C8' }}>
                      Created {new Date(wf.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: wf.is_active ? '#059669' : '#9EB3C8' }}>
                    {wf.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggle(wf)}
                    disabled={toggling === wf.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: wf.is_active ? '#1568D3' : '#9EB3C8', display: 'flex', alignItems: 'center' }}
                    title={wf.is_active ? 'Disable' : 'Enable'}
                  >
                    {wf.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button
                    onClick={() => handleDelete(wf)}
                    disabled={deleting === wf.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9EB3C8', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9EB3C8')}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  )
}
