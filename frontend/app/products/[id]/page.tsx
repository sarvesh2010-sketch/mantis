'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Building2, FileText, ExternalLink, Download, Mic, Camera, MessageSquare, Zap, ChevronRight, Play } from 'lucide-react'
import { CATEGORIES } from '@/types'
import type { Product } from '@/types'
import { api } from '@/lib/api'
import { getCategoryColor } from '@/lib/utils'
import { Footer } from '@/components/layout/Footer'

const DIAGNOSTIC_STEPS = [
  { step: 1, label: 'Intake', desc: 'Understanding symptoms' },
  { step: 2, label: 'Hypothesis', desc: 'Identifying causes' },
  { step: 3, label: 'Elimination', desc: 'Asking follow-ups' },
  { step: 4, label: 'Inspection', desc: 'Suggesting checks' },
  { step: 5, label: 'Narrowing', desc: 'Finding root cause' },
  { step: 6, label: 'Resolution', desc: 'Corrective actions' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  async function fetchProduct() {
    try {
      const res = await api.get(`/products/${productId}`)
      setProduct(res.data)
    } catch {
      // Demo fallback
      setProduct({
        id: productId, company_id: 'c1', name: 'Honda Activa 6G', model_number: 'Activa 6G',
        category: 'scooter', description: "Honda's best-selling automatic scooter, powered by a 109.51cc BS6 compliant engine. Features include silent start, LED headlamp, integrated headlamp beam with position lamp, and telescopic front suspension. The engine delivers smooth performance with enhanced mileage and lower emissions.",
        is_published: true, created_at: new Date().toISOString(),
        companies: { name: 'Honda Motors', description: 'Leading motorcycle and scooter manufacturer' },
        knowledge_documents: [
          { id: 'd1', product_id: productId, title: 'Owner Manual (2024)', type: 'pdf', page_count: 128, chunk_count: 215, indexed: true, created_at: '' },
          { id: 'd2', product_id: productId, title: 'Service Guide', type: 'pdf', page_count: 64, chunk_count: 108, indexed: true, created_at: '' },
          { id: 'd3', product_id: productId, title: 'Honda Support FAQ', type: 'link', external_url: 'https://honda.co.in/support', indexed: false, created_at: '' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const categoryColor = getCategoryColor(product.category)
  const catLabel = CATEGORIES.find(c => c.value === product.category)?.label || product.category

  return (
    <>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
          >
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-secondary">{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              {/* Product Image */}
              <div className="aspect-video rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${categoryColor}12, ${categoryColor}05)` }}>
                    <span className="text-8xl">{CATEGORIES.find(c => c.value === product.category)?.icon || '🔧'}</span>
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <h1 className="text-4xl font-bold text-white tracking-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-4">
                {product.companies && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-bg-tertiary flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-text-muted" />
                    </div>
                    <span className="text-sm text-text-secondary">{product.companies.name}</span>
                  </div>
                )}
                <div className="badge-brand">{catLabel}</div>
                {product.model_number && (
                  <span className="text-sm text-text-muted font-mono">{product.model_number}</span>
                )}
              </div>

              <p className="text-text-secondary mt-6 leading-relaxed">{product.description}</p>

              {/* Knowledge Base */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-white mb-5">Available Documentation</h2>
                <div className="space-y-3">
                  {product.knowledge_documents?.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ x: 4 }}
                      className="card p-4 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {doc.type === 'pdf' ? (
                          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <FileText className="w-4.5 h-4.5 text-red-400" />
                          </div>
                        ) : doc.type === 'link' ? (
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <ExternalLink className="w-4.5 h-4.5 text-blue-400" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Play className="w-4.5 h-4.5 text-purple-400" />
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-white">{doc.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-2xs text-text-muted uppercase">{doc.type}</span>
                            {doc.page_count && (
                              <span className="text-2xs text-text-muted">· {doc.page_count} pages</span>
                            )}
                            {doc.indexed && <span className="text-2xs text-green-400">· Indexed ✓</span>}
                          </div>
                        </div>
                      </div>
                      {doc.type === 'pdf' && (
                        <button className="btn-ghost text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div
                className="card p-7 relative overflow-hidden"
                style={{ boxShadow: '0 0 40px rgba(99,86,245,0.08)' }}
              >
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-[18px] pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(99,86,245,0.3), transparent 50%, rgba(99,86,245,0.3))',
                  padding: '1px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }} />

                <h3 className="text-xl font-semibold text-white mb-2">Get AI Diagnosis</h3>
                <p className="text-sm text-text-secondary mb-6">Talk to Mantis, your dedicated product technician.</p>

                {/* Input modes */}
                <div className="flex gap-2 mb-6">
                  {[
                    { icon: MessageSquare, label: 'Text' },
                    { icon: Mic, label: 'Voice' },
                    { icon: Camera, label: 'Image' },
                  ].map((mode) => (
                    <div key={mode.label} className="flex-1 card p-3 text-center">
                      <mode.icon className="w-5 h-5 text-brand-400 mx-auto mb-1.5" />
                      <span className="text-xs text-text-secondary">{mode.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={`/products/${product.id}/assistant`}>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,86,245,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2 mb-6"
                  >
                    Start Diagnosis <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Steps preview */}
                <div className="space-y-2.5">
                  {DIAGNOSTIC_STEPS.map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center text-2xs font-medium text-text-muted shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-text-secondary">{s.label}</span>
                        <span className="text-2xs text-text-muted ml-2">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MOSS badge */}
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs text-text-muted font-mono">Retrieved in &lt;10ms via MOSS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
