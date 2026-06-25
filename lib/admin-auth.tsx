'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { adminApi, AdminUser } from '@/lib/admin-client'

interface AdminAuthCtx {
  user: AdminUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const Ctx = createContext<AdminAuthCtx | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ngadmin_token')
    if (stored) {
      setToken(stored)
      adminApi.me()
        .then(u => { setUser(u); setIsLoading(false) })
        .catch(() => { localStorage.removeItem('ngadmin_token'); setIsLoading(false) })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = await adminApi.login(email, password)
    localStorage.setItem('ngadmin_token', result.token)
    setToken(result.token)
    setUser(result.user)
  }

  const logout = () => {
    localStorage.removeItem('ngadmin_token')
    setToken(null)
    setUser(null)
    window.location.href = '/admin/login'
  }

  return <Ctx.Provider value={{ user, token, login, logout, isLoading }}>{children}</Ctx.Provider>
}

export function useAdmin() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdmin must be used inside AdminAuthProvider')
  return ctx
}
