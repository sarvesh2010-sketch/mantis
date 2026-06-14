'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { company } = useAuthStore()
  const [name, setName] = useState(company?.name || '')
  const [description, setDescription] = useState(company?.description || '')
  const [website, setWebsite] = useState(company?.website_url || '')

  function handleSave() {
    toast.success('Settings saved!')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
      <p className="text-text-secondary mb-8">Manage your company profile.</p>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Company Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={3} className="input-field resize-none" placeholder="Tell users about your company..." />
        </div>
        <div>
          <label className="label">Website</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
            className="input-field" placeholder="https://..." />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Settings
        </motion.button>
      </div>
    </div>
  )
}
