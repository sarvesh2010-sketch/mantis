'use client'
import { motion } from 'framer-motion'
import { Package, FileText, Activity, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
}

const stats = [
  { icon: Package, label: 'Total Products', value: '3', color: '#6356F5' },
  { icon: Activity, label: 'Published', value: '2', color: '#22C55E' },
  { icon: FileText, label: 'Documents Indexed', value: '5', color: '#3B82F6' },
  { icon: Users, label: 'Diagnostic Sessions', value: '27', color: '#F59E0B' },
]

export default function DashboardHome() {
  const { company } = useAuthStore()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {company?.name || 'Company'}
        </h1>
        <p className="text-text-secondary mt-2">Here&apos;s an overview of your product platform.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              {stat.value}
            </motion.span>
            <p className="text-sm text-text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
