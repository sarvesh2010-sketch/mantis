'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Building2, FileText, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/types'
import type { Product } from '@/types'
import { api } from '@/lib/api'
import { Footer } from '@/components/layout/Footer'
import { getCategoryColor } from '@/lib/utils'

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
}

/* Product Card */
function ProductCard({ product }: { product: Product }) {
  const categoryColor = getCategoryColor(product.category)
  const catLabel = CATEGORIES.find(c => c.value === product.category)?.label || product.category

  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/products/${product.id}`}>
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
          className="card-hover overflow-hidden group cursor-pointer"
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${categoryColor}15, ${categoryColor}05)` }}>
                <span className="text-5xl">{CATEGORIES.find(c => c.value === product.category)?.icon || '🔧'}</span>
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-3 right-3 badge-brand text-2xs">
              {catLabel}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-brand-400 transition-colors duration-200">
              {product.name}
            </h3>
            {product.model_number && (
              <p className="text-xs text-text-muted mb-2 font-mono">{product.model_number}</p>
            )}
            {product.companies && (
              <div className="flex items-center gap-1.5 mb-3">
                <Building2 className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-sm text-text-secondary">{product.companies.name}</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs text-text-muted">
                  {product.knowledge_documents?.length || 0} docs
                </span>
              </div>
              <span className="text-xs font-medium text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                Diagnose <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (category) params.category = category
      const res = await api.get('/products', { params })
      setProducts(res.data.products || [])
      setTotal(res.data.total || 0)
    } catch {
      // Demo fallback data
      setProducts([
        {
          id: 'demo-1', company_id: 'c1', name: 'Honda Activa 6G', model_number: 'Activa 6G',
          category: 'scooter', description: "Honda's best-selling automatic scooter, powered by a 109.51cc BS6 compliant engine.",
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'Honda Motors' },
          knowledge_documents: [{ id: 'd1', product_id: 'demo-1', title: 'Owner Manual', type: 'pdf', indexed: true, created_at: '' }],
        },
        {
          id: 'demo-2', company_id: 'c2', name: 'Samsung WindFree AC', model_number: 'AR18BY4YATA',
          category: 'ac', description: 'WindFree Cooling with 23,000 micro holes for gentle cool air without direct wind.',
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'Samsung Electronics' },
        },
        {
          id: 'demo-3', company_id: 'c3', name: 'LG TurboWash 360', model_number: 'FHP1208Z3M',
          category: 'washing_machine', description: 'AI-powered washing machine with TurboWash 360 for a complete clean in under 30 minutes.',
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'LG Electronics' },
        },
        {
          id: 'demo-4', company_id: 'c4', name: 'Sony WH-1000XM5', model_number: 'WH-1000XM5',
          category: 'electronics', description: 'Industry-leading noise cancelling headphones with next-gen processor and superior call quality.',
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'Sony Corporation' },
        },
        {
          id: 'demo-5', company_id: 'c5', name: 'Dyson V15 Detect', model_number: 'V15',
          category: 'appliance', description: 'Laser-equipped cordless vacuum that reveals microscopic dust on hard floors.',
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'Dyson Ltd' },
        },
        {
          id: 'demo-6', company_id: 'c1', name: 'TVS Apache RTR 160', model_number: 'RTR 160 4V',
          category: 'scooter', description: 'The ultimate sport bike with race-derived engineering and SmartXonnect technology.',
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'TVS Motor Company' },
        },
      ])
      setTotal(6)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    if (category && p.category !== category) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
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
            className="mb-10"
          >
            <h1 className="text-4xl font-bold text-white tracking-tight">Product Marketplace</h1>
            <p className="text-text-secondary mt-2">{total} products available for diagnostic support</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-60 shrink-0"
            >
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Categories */}
              <div>
                <span className="label">Category</span>
                <div className="flex flex-col gap-1.5 mt-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                      !category ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        category === cat.value ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
                      }`}
                    >
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card overflow-hidden">
                      <div className="aspect-video shimmer" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 w-3/4 shimmer rounded" />
                        <div className="h-4 w-1/2 shimmer rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <Search className="w-12 h-12 text-text-muted mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
                  <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
