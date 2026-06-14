'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/products', icon: Package, label: 'My Products' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { company, user, isAuthenticated, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-subtle shrink-0 hidden lg:flex flex-col" style={{ background: '#0F0F12' }}>
        <div className="p-5 flex-1">
          {/* Company */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <span className="text-lg">🏢</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white truncate">{company?.name || 'Company'}</h3>
              <span className="text-2xs text-text-muted">Company Dashboard</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-text-muted hover:text-white hover:bg-bg-tertiary'
                  }`}>
                    {isActive && (
                      <motion.div
                        layoutId="dashboard-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(99,86,245,0.1)', border: '1px solid rgba(99,86,245,0.2)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-5 border-t border-border-subtle">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-medium text-brand-400">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{user?.email}</p>
              <p className="text-2xs text-text-muted">Company Admin</p>
            </div>
          </div>
          <button onClick={clearAuth} className="btn-ghost w-full text-xs flex items-center gap-2 text-text-muted hover:text-red-400">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ background: '#0C0C0E' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
