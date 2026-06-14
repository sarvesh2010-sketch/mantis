'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bug, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(12, 12, 14, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,86,245,0.4)] transition-shadow duration-300">
            <Bug className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Mantis</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/products" className="btn-ghost text-sm">
            Products
          </Link>
          {isAuthenticated && user?.role === 'company' && (
            <Link href="/dashboard" className="btn-ghost text-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-text-secondary">{user?.email}</span>
              <button onClick={clearAuth} className="btn-ghost text-sm flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-border-subtle"
          style={{ background: 'rgba(12, 12, 14, 0.95)' }}
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            <Link href="/products" className="btn-ghost text-sm text-left" onClick={() => setMobileOpen(false)}>
              Products
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'company' && (
                  <Link href="/dashboard" className="btn-ghost text-sm text-left" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <button onClick={() => { clearAuth(); setMobileOpen(false); }} className="btn-ghost text-sm text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm text-left" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
