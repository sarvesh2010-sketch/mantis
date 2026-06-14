'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, FileText, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface UploadManualModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  onSuccess: (newDoc: { id: string; title: string; type: 'pdf'; file_url: string }) => void
}

export function UploadManualModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: UploadManualModalProps) {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    // Pre-populate title with file name without extension
    setTitle(file.name.replace('.pdf', ''))
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const file = acceptedFiles[0]

  async function handleUpload() {
    if (!file) {
      toast.error('Please select a PDF file first')
      return
    }
    if (!title.trim()) {
      toast.error('Please enter a document title')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)

      const res = await api.post(`/knowledge/upload/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Manual uploaded successfully! Indexing has started.')
      
      onSuccess({
        id: res.data.document_id,
        title: title,
        type: 'pdf',
        file_url: res.data.file_url,
      })
      
      // Reset state and close
      setTitle('')
      onClose()
    } catch (err: any) {
      console.error('Upload error:', err)
      const message = err.response?.data?.detail || 'Failed to upload document'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Upload User Manual</h3>
                <p className="text-xs text-text-muted mt-0.5">Adding to product: <span className="text-brand-400 font-medium">{productName}</span></p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dropzone */}
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-brand-500 bg-brand-500/5'
                    : 'border-white/10 hover:border-brand-500/30 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-brand-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-white">
                  {isDragActive ? 'Drop the PDF here' : 'Drag & drop manual PDF here'}
                </p>
                <p className="text-xs text-text-muted mt-1">or click to browse from files</p>
                <p className="text-2xs text-text-muted mt-2">PDF files only · up to 50MB</p>
              </div>

              {/* Selected File Details */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 rounded-xl border border-white/5 bg-[#121214]/50 p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-brand-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                      <p className="text-2xs text-text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  </div>

                  <div>
                    <label className="label text-[11px] uppercase tracking-wider mb-1.5 block">Document Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-field py-2 text-sm"
                      placeholder="e.g. Owner's Manual, Schematic, Troubleshooting Guide"
                      disabled={uploading}
                    />
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="btn-ghost px-4 py-2 text-sm text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || !title || uploading}
                  className="btn-primary px-5 py-2 text-sm flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading & Indexing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Manual
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
