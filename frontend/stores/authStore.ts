'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Company } from '@/types'

interface AuthState {
  user: User | null
  company: Company | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string, company?: Company) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token, company) =>
        set({ user, accessToken: token, company: company ?? null, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, company: null, isAuthenticated: false }),
    }),
    { name: 'mantis-auth' }
  )
)
