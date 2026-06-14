'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/types'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [modelNumber, setModelNumber] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { company } = useAuthStore()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (description.length < 20) {
      toast.error('Description must be at least 20 characters')
      return
    }
    setLoading(true)
    try {
      const res = await api.post(`/products?company_id=${company?.id}`, {
        name, model_number: modelNumber || undefined, category, description,
        image_url: imageUrl || undefined,
      })
      toast.success('Product created!')
      router.push(`/dashboard/products/${res.data.id}/knowledge`)
    } catch {
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Add a new product</h1>
      <p className="text-text-secondary mb-8">Fill in the details and then upload documentation.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Product Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Honda Activa 6G" required className="input-field" />
        </div>

        <div>
          <label className="label">Model Number</label>
          <input type="text" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)}
            placeholder="e.g. Activa 6G" className="input-field" />
        </div>

        <div>
          <label className="label">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required
            className="input-field appearance-none cursor-pointer">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product (min 20 characters)..." required minLength={20}
            rows={4} className="input-field resize-none" />
        </div>

        <div>
          <label className="label">Product Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..." className="input-field" />
          {imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden max-w-[200px] border border-border-subtle">
              <img src={imageUrl} alt="Preview" className="w-full h-auto" />
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(99,86,245,0.3)' }}
          whileTap={{ scale: 0.98 }}
          type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 mt-4"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <>Create Product <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </form>
    </div>
  )
}
