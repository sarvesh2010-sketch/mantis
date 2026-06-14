'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Building2, Search, FileText, ExternalLink, ChevronRight, Package, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Footer } from '@/components/layout/Footer'
import { CATEGORIES } from '@/types'

interface Document {
  id: string
  title: string
  type: 'pdf' | 'text' | 'link' | 'video_link'
  file_url?: string | null
  external_url?: string | null
}

interface Product {
  id: string
  name: string
  model_number?: string | null
  category: string
  is_published: boolean
  knowledge_documents: Document[]
}

interface CompanyData {
  id: string
  name: string
  logo_url?: string | null
  description?: string | null
  products: Product[]
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/companies')
      return
    }

    async function fetchCompanies() {
      setLoading(true)
      try {
        const res = await api.get('/products/companies/all')
        setCompanies(res.data || [])
      } catch (err) {
        console.error('Error fetching companies:', err)
        // Fallback mock data if server error
        setCompanies([
          {
            id: 'c1',
            name: 'Honda Motors',
            description: 'Leading global manufacturer of automobiles, motorcycles, and power equipment.',
            products: [
              {
                id: 'demo-1',
                name: 'Honda Activa 6G',
                model_number: 'Activa 6G',
                category: 'scooter',
                is_published: true,
                knowledge_documents: [
                  { id: 'd1', title: 'Activa 6G Owner Manual', type: 'pdf', file_url: '#' }
                ]
              }
            ]
          },
          {
            id: 'c2',
            name: 'Samsung Electronics',
            description: 'South Korean multinational electronics corporation headquartered in Yeongtong-gu, Suwon.',
            products: [
              {
                id: 'demo-2',
                name: 'Samsung WindFree AC',
                model_number: 'AR18BY4YATA',
                category: 'ac',
                is_published: true,
                knowledge_documents: [
                  { id: 'd2', title: 'WindFree AC User Guide', type: 'pdf', file_url: '#' },
                  { id: 'd3', title: 'Support FAQ', type: 'link', external_url: 'https://samsung.com/support' }
                ]
              }
            ]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [isAuthenticated, router])

  // Filter companies/products by search term and publication status
  const filteredCompanies = companies.map(c => ({
    ...c,
    products: c.products ? c.products.filter(p => p.is_published) : []
  })).filter(c => {
    const companyMatch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         (c.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const productMatch = c.products.some(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.knowledge_documents.some(d => d.title.toLowerCase().includes(search.toLowerCase()))
    )
    return companyMatch || productMatch
  })

  return (
    <>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Partner Companies</h1>
              <p className="text-text-secondary mt-2">Browse registered manufacturers, their products, and service manuals.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search companies, manuals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </motion.div>

          {/* Companies Grid */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="card p-6 space-y-4">
                  <div className="h-6 w-1/4 shimmer rounded" />
                  <div className="h-4 w-3/4 shimmer rounded" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-20 shimmer rounded-xl" />
                    <div className="h-20 shimmer rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCompanies.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8"
            >
              {filteredCompanies.map((company) => (
                <motion.div
                  key={company.id}
                  variants={fadeInUp}
                  className="glass-card p-6 md:p-8 relative overflow-hidden"
                >
                  {/* Glowing card decoration */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
                  
                  {/* Company Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl shrink-0">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Building2 className="w-6 h-6 text-brand-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white leading-tight">{company.name}</h2>
                      <p className="text-sm text-text-secondary mt-1 max-w-3xl">{company.description || "Partner manufacturer with registered manual guides."}</p>
                    </div>
                  </div>

                  <div className="divider mb-6" />

                  {/* Products & Manuals */}
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Registered Products & Manuals</h3>
                  {company.products.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {company.products.map((product) => {
                        const catIcon = CATEGORIES.find(c => c.value === product.category)?.icon || '🔧';
                        return (
                          <div
                            key={product.id}
                            className="card p-5 border border-border-subtle flex flex-col justify-between"
                            style={{ background: '#09090B' }}
                          >
                            <div>
                              {/* Product header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{catIcon}</span>
                                  <h4 className="text-base font-semibold text-white truncate max-w-[200px]" title={product.name}>
                                    {product.name}
                                  </h4>
                                </div>
                                {product.model_number && (
                                  <span className="text-2xs text-text-muted font-mono bg-bg-tertiary px-2 py-0.5 rounded">
                                    {product.model_number}
                                  </span>
                                )}
                              </div>

                              {/* Manuals list */}
                              <div className="space-y-2.5 mt-4">
                                {product.knowledge_documents && product.knowledge_documents.length > 0 ? (
                                  product.knowledge_documents.map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex items-center justify-between p-2.5 rounded-lg bg-bg-tertiary/50 border border-white/5 hover:border-brand-500/20 transition-all"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                                        <span className="text-xs text-text-secondary truncate pr-2" title={doc.title}>
                                          {doc.title}
                                        </span>
                                      </div>
                                      
                                      {/* Link to manual */}
                                      {doc.type === 'pdf' ? (
                                        <a
                                          href={doc.file_url || '#'}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-2xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 shrink-0"
                                        >
                                          Open PDF <ExternalLink className="w-3 h-3" />
                                        </a>
                                      ) : (
                                        <a
                                          href={doc.external_url || '#'}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-2xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 shrink-0"
                                        >
                                          Visit Link <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-text-muted italic">No manuals uploaded yet.</p>
                                )}
                              </div>
                            </div>

                            {/* Diagnose link */}
                            <div className="mt-6 pt-3 border-t border-white/5 flex justify-end">
                              <Link
                                href={`/products/${product.id}`}
                                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
                              >
                                View Diagnostics <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted italic">No products registered for this company.</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Building2 className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No companies found</h3>
              <p className="text-sm text-text-muted">Try adjusting your search criteria</p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
