const CRM_BASE = process.env.NEXT_PUBLIC_CRM_URL || ''

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ngadmin_token')
}

async function req<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  if (!CRM_BASE) throw new Error('CRM_NOT_CONFIGURED')
  const token = getToken()
  const res = await fetch(`${CRM_BASE}/api/v1${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ngadmin_token')
      window.location.href = '/admin/login'
    }
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, string>
    throw new Error(err.message ?? err.error ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser { id: string; email: string; name: string; role: string }

export interface RevenuePeriod {
  total_revenue_cents: number
  order_count: number
  aov_cents: number
  unique_customers: number
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
}

export interface RevenueSummary {
  current_period: RevenuePeriod
  previous_period: RevenuePeriod
  growth_pct: string | null
}

export interface DailyRevenue { date: string; revenue_cents: number; order_count: number; aov_cents: number }

export interface SubscriptionCounts {
  active_count: string; paused_count: string; cancelled_count: string; dunning_count: string; total_count: string
}

export interface SubscriptionMetrics {
  counts: SubscriptionCounts
  mrr_cents: number
  churn_rate_pct: number
}

export interface LtvSummary {
  avg_ltv_cents: number; max_ltv_cents: number
  median_ltv_cents: number; p90_ltv_cents: number; customer_count: number
}

export interface LtvStats { summary: LtvSummary; cohorts: LtvCohort[] }
export interface LtvCohort { cohort_month: string; customers: number; avg_ltv_cents: number; avg_orders: number }

export interface OrderItem { id: string; name: string; sku: string; quantity: number; unit_price_cents: number; total_cents: number }
export interface Address { first_name: string; last_name: string; address1: string; city: string; state: string; zip: string; country: string }
export interface StatusEvent { status: string; note?: string; created_at: string }

export interface Order {
  id: string; order_number: string; status: string
  total_cents: number; subtotal_cents: number; shipping_cents: number; tax_cents: number
  created_at: string; updated_at: string
  customer?: { id: string; email: string; first_name: string; last_name: string }
  customer_email?: string
  items?: OrderItem[]
  shipping_address?: Address
  status_history?: StatusEvent[]
  stripe_payment_intent_id?: string
}

export interface Customer {
  id: string; email: string; first_name: string; last_name: string; phone?: string
  total_spent_cents: number; order_count: number; aov_cents: number
  tags: string[]; created_at: string; last_order_at?: string
  recent_orders?: Order[]
  subscriptions?: Subscription[]
  payment_methods?: PaymentMethod[]
}

export interface Subscription {
  id: string; status: string; billing_interval: string; billing_interval_count: number
  next_billing_date: string; total_cents?: number; discount_percent?: number
  created_at: string; cancelled_at?: string
}

export interface PaymentMethod { id: string; provider: string; last4?: string; brand?: string; exp_month?: number; exp_year?: number }

export interface Paginated<T> { data: T[]; total: number; page: number; limit: number }

export interface Workflow {
  id: string; name: string; trigger: string; is_active: boolean
  run_once_per_customer: boolean; steps: unknown[]; created_at: string
}

export interface ApiKey {
  id: string; name: string; key_prefix: string; scopes: string[]
  last_used_at: string | null; created_at: string
}

// ─── API Client ───────────────────────────────────────────────────────────────

export const adminApi = {
  login: (email: string, password: string) =>
    req<{ token: string; user: AdminUser }>('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => req<AdminUser>('/auth/me'),
  setup: (email: string, password: string, name: string) =>
    req<{ message: string; user: AdminUser }>('/auth/setup', { method: 'POST', body: { email, password, name } }),

  revenueOverview: () => req<RevenueSummary>('/analytics/revenue'),
  revenueDaily: (days = 30) => req<DailyRevenue[]>(`/analytics/revenue/daily?days=${days}`),
  subscriptionStats: () => req<SubscriptionMetrics>('/analytics/subscriptions'),
  ltv: () => req<LtvStats>('/analytics/ltv'),
  cohorts: (months = 6) => req<unknown[]>(`/analytics/cohorts?months=${months}`),
  fulfillment: (days = 30) => req<unknown>(`/analytics/fulfillment?days=${days}`),

  orders: (params?: Record<string, string>) =>
    req<Paginated<Order>>(`/orders?${new URLSearchParams(params ?? {})}`),
  order: (id: string) => req<Order>(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    req<Order>(`/orders/${id}/status`, { method: 'PATCH', body: { status, note } }),
  cancelOrder: (id: string) => req<Order>(`/orders/${id}/cancel`, { method: 'POST' }),
  refundOrder: (id: string, amount_cents?: number) =>
    req<unknown>(`/orders/${id}/refund`, { method: 'POST', body: { amount_cents } }),

  customers: (params?: Record<string, string>) =>
    req<Paginated<Customer>>(`/customers?${new URLSearchParams(params ?? {})}`),
  customerProfile: (id: string) => req<Customer>(`/customers/${id}/profile`),
  addTag: (id: string, tag: string) =>
    req<unknown>(`/customers/${id}/tags`, { method: 'POST', body: { tag } }),
  removeTag: (id: string, tag: string) =>
    req<unknown>(`/customers/${id}/tags/${tag}`, { method: 'DELETE' }),

  workflows: (params?: Record<string, string>) =>
    req<Paginated<Workflow>>(`/workflows?${new URLSearchParams(params ?? {})}`),
  toggleWorkflow: (id: string) =>
    req<Workflow>(`/workflows/${id}/toggle`, { method: 'POST' }),
  deleteWorkflow: (id: string) => req<void>(`/workflows/${id}`, { method: 'DELETE' }),

  apiKeys: () => req<ApiKey[]>('/auth/api-keys'),
  createApiKey: (name: string) =>
    req<{ key: string; prefix: string; note: string }>('/auth/api-keys', { method: 'POST', body: { name, scopes: ['read', 'write'] } }),
  deleteApiKey: (id: string) => req<void>(`/auth/api-keys/${id}`, { method: 'DELETE' }),
}

export const isCrmConfigured = () => Boolean(CRM_BASE && CRM_BASE !== 'https://your-crm.up.railway.app')
