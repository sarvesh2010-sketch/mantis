'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Bug, Eye, EyeOff, ArrowRight, Building2, User } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

function SignupForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'user'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState<'company' | 'user'>(defaultRole === 'company' ? 'company' : 'user')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', {
        email, password, role,
        company_name: role === 'company' ? companyName : undefined
      })
      // Auto-login
      const loginRes = await api.post('/auth/login', { email, password })
      setAuth(
        { id: loginRes.data.user_id, email: loginRes.data.email, role: loginRes.data.role },
        loginRes.data.access_token,
        loginRes.data.company
      )
      toast.success('Account created!')
      router.push(role === 'company' ? '/dashboard' : '/products')
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Registration failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-brand-500/15 blur-3xl" />

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Mantis</span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Create your account</h1>
          <p className="text-sm text-text-secondary text-center mb-8">Join Mantis to get started</p>

          {/* Role toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-bg-tertiary">
            {[
              { value: 'user' as const, icon: User, label: 'User' },
              { value: 'company' as const, icon: Building2, label: 'Company' },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  role === r.value
                    ? 'bg-brand-500 text-white shadow-lg'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'company' && (
              <div>
                <label className="label">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" required className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                  required minLength={6} className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(99,86,245,0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-sm text-text-muted text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-200 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}

