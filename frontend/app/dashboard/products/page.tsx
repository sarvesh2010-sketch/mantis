'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Package, Eye, EyeOff, Trash2, Edit, BookOpen } from 'lucide-react'

const demoProducts = [
  { id: '1', name: 'Honda Activa 6G', category: 'scooter', is_published: true, docs: 2 },
  { id: '2', name: 'Samsung WindFree AC', category: 'ac', is_published: true, docs: 1 },
  { id: '3', name: 'LG TurboWash 360', category: 'washing_machine', is_published: false, docs: 0 },
]

export default function DashboardProducts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Products</h1>
          <p className="text-text-secondary mt-1">Manage your product listings and documentation.</p>
        </div>
        <Link href="/dashboard/products/new">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,86,245,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Product</th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Category</th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Docs</th>
              <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoProducts.map((product, i) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border-b border-border-subtle hover:bg-bg-hover/30 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center">
                      <Package className="w-4 h-4 text-text-muted" />
                    </div>
                    <span className="text-sm font-medium text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="badge-brand text-2xs capitalize">{product.category.replace('_', ' ')}</span>
                </td>
                <td className="px-5 py-4">
                  {product.is_published ? (
                    <span className="badge-success text-2xs flex items-center gap-1 w-fit">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="badge-warning text-2xs flex items-center gap-1 w-fit">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-text-secondary">{product.docs}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/dashboard/products/${product.id}/knowledge`}>
                      <button className="btn-ghost p-2 text-text-muted hover:text-brand-400" title="Knowledge Base">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="btn-ghost p-2 text-text-muted hover:text-white" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost p-2 text-text-muted hover:text-red-400" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
