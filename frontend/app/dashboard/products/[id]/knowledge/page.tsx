'use client'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Link as LinkIcon, Trash2, CheckCircle, Loader2, ExternalLink, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface Doc {
  id: string
  title: string
  type: string
  page_count?: number
  chunk_count?: number
  indexed: boolean
}

export default function KnowledgeBasePage() {
  const params = useParams()
  const productId = params.id as string
  const [activeTab, setActiveTab] = useState<'upload' | 'links'>('upload')
  const [documents, setDocuments] = useState<Doc[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkType, setLinkType] = useState('link')

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setUploadTitle(file.name.replace('.pdf', ''))
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  async function handleUpload() {
    const file = acceptedFiles[0]
    if (!file || !uploadTitle) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', uploadTitle)
      const res = await api.post(`/knowledge/upload/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setDocuments(prev => [...prev, {
        id: res.data.document_id, title: uploadTitle, type: 'pdf',
        page_count: res.data.page_count, chunk_count: res.data.chunk_count, indexed: false
      }])
      toast.success('Document uploaded! Indexing in progress...')
      setUploadTitle('')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleAddLink() {
    if (!linkTitle || !linkUrl) return
    try {
      await api.post(`/knowledge/link/${productId}`, {
        title: linkTitle, type: linkType, external_url: linkUrl,
      })
      setDocuments(prev => [...prev, { id: Date.now().toString(), title: linkTitle, type: linkType, indexed: false }])
      toast.success('Link added!')
      setLinkTitle('')
      setLinkUrl('')
    } catch {
      toast.error('Failed to add link')
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${productId}`)
        setDocuments(res.data.knowledge_documents || [])
      } catch (err) {
        console.error("Failed to fetch product documents:", err)
      }
    }
    fetchProduct()
  }, [productId])

  async function handleDelete(docId: string) {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await api.delete(`/knowledge/${docId}`)
      setDocuments(prev => prev.filter(d => d.id !== docId))
      toast.success('Document deleted successfully')
    } catch {
      toast.error('Failed to delete document')
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Knowledge Base</h1>
      <p className="text-text-secondary mb-6">Upload documentation for AI-powered diagnostics.</p>

      {/* MOSS status */}
      <div className="card p-4 flex items-center gap-3 mb-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-sm text-text-secondary">MOSS Index: <span className="text-green-400 font-medium">Active</span></span>
        <span className="text-xs text-text-muted font-mono ml-auto">{documents.filter(d => d.indexed).length} documents indexed</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-bg-tertiary mb-6 w-fit">
        {[
          { value: 'upload' as const, icon: Upload, label: 'Upload Files' },
          { value: 'links' as const, icon: LinkIcon, label: 'Add Links' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.value ? 'bg-brand-500 text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-5">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-border-subtle hover:border-border-default'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Drop PDF files here or click to browse</p>
            <p className="text-xs text-text-muted mt-1">Max 50MB · PDF only</p>
          </div>

          {acceptedFiles[0] && (
            <div className="space-y-3">
              <div>
                <label className="label">Document Title</label>
                <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  className="input-field" placeholder="e.g. Owner Manual" />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary flex items-center gap-2"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload & Index
              </motion.button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)}
              className="input-field" placeholder="e.g. Honda Support FAQ" />
          </div>
          <div>
            <label className="label">URL</label>
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="label">Type</label>
            <select value={linkType} onChange={(e) => setLinkType(e.target.value)} className="input-field">
              <option value="link">Web Link</option>
              <option value="video_link">YouTube Video</option>
            </select>
          </div>
          <button onClick={handleAddLink} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>
      )}

      {/* Document List */}
      <div className="mt-8">
        <span className="label mb-3">Existing Documents</span>
        <div className="space-y-2">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {doc.type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-red-400" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <span className="text-sm font-medium text-white">{doc.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {doc.page_count && <span className="text-2xs text-text-muted">{doc.page_count} pages</span>}
                    {doc.chunk_count && <span className="text-2xs text-text-muted">· {doc.chunk_count} chunks</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.indexed ? (
                  <span className="badge-success text-2xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Indexed
                  </span>
                ) : (
                  <span className="badge-warning text-2xs flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Indexing
                  </span>
                )}
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="btn-ghost p-1.5 text-text-muted hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
