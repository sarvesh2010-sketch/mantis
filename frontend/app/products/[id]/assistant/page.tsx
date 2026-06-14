'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Camera, X, Volume2, VolumeX, Bug, ChevronLeft, CheckCircle, Loader2, Zap, Plus } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useChatStore } from '@/stores/chatStore'
import { api } from '@/lib/api'
import type { Product, SourceCitation, Message } from '@/types'
import { CATEGORIES } from '@/types'
import { getCategoryColor } from '@/lib/utils'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { useAuthStore } from '@/stores/authStore'
import { UploadManualModal } from '@/components/UploadManualModal'


const DIAGNOSTIC_STEPS = [
  { step: 1, label: 'Intake', desc: 'Understanding symptoms' },
  { step: 2, label: 'Hypothesis', desc: 'Identifying causes' },
  { step: 3, label: 'Elimination', desc: 'Asking follow-ups' },
  { step: 4, label: 'Inspection', desc: 'Suggesting checks' },
  { step: 5, label: 'Narrowing', desc: 'Finding root cause' },
  { step: 6, label: 'Resolution', desc: 'Corrective actions' },
]

/* ============================================
   DIAGNOSTIC PROGRESS
   ============================================ */
function DiagnosticProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="space-y-2">
      {DIAGNOSTIC_STEPS.map((s) => {
        const isCompleted = s.step < currentStep
        const isCurrent = s.step === currentStep
        return (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: s.step * 0.05 }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/20 text-green-400'
                  : isCurrent
                  ? 'bg-brand-500 text-white animate-glow-pulse'
                  : 'bg-bg-tertiary text-text-muted'
              }`}
            >
              {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : s.step}
            </div>
            <div>
              <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-text-muted'}`}>
                {s.label}
              </span>
              {isCurrent && <span className="text-2xs text-text-muted block">{s.desc}</span>}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ============================================
   RETRIEVAL BADGE
   ============================================ */
function RetrievalBadge({ ms }: { ms: number }) {
  const color = ms < 10 ? 'text-green-400' : ms < 50 ? 'text-yellow-400' : 'text-text-muted'
  return (
    <div className="flex items-center gap-1.5 mt-2">
      {ms < 10 && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
      )}
      <Zap className="w-3 h-3 text-text-muted" />
      <span className={`text-2xs font-mono ${color}`}>MOSS · {ms}ms</span>
    </div>
  )
}

/* ============================================
   SOURCE CITATION PILLS
   ============================================ */
function SourcePills({ sources }: { sources: SourceCitation[] }) {
  if (!sources || sources.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="badge text-2xs cursor-pointer hover:bg-brand-500/15 transition-colors"
          style={{ background: 'rgba(99,86,245,0.08)', border: '1px solid rgba(99,86,245,0.15)' }}
          title={src.snippet}
        >
          <span>📄</span>
          <span className="text-brand-400">{src.doc_title}</span>
          {src.page && <span className="text-text-muted">· Page {src.page}</span>}
        </motion.div>
      ))}
    </div>
  )
}

/* ============================================
   MESSAGE BUBBLE
   ============================================ */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
              <Bug className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-text-muted font-medium">Mantis</span>
          </div>
        )}

        {/* Image if present */}
        {msg.image_url && (
          <div className="mb-2 rounded-xl overflow-hidden max-w-[300px]">
            <img src={msg.image_url} alt="Uploaded" className="w-full h-auto" />
          </div>
        )}

        {/* Message content */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-brand-500/15 border border-brand-500/20'
              : 'bg-bg-tertiary border border-border-subtle'
          }`}
        >
          {msg.input_type === 'voice' && isUser && (
            <div className="flex items-center gap-1.5 mb-1">
              <Mic className="w-3 h-3 text-brand-400" />
              <span className="text-2xs text-brand-400">Voice input</span>
            </div>
          )}
          <div className="text-sm text-text-primary leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>

        {/* Sources and retrieval badge (assistant only) */}
        {!isUser && msg.sources && <SourcePills sources={msg.sources} />}
        {!isUser && msg.retrieval_ms !== undefined && <RetrievalBadge ms={msg.retrieval_ms} />}
      </div>
    </motion.div>
  )
}

/* ============================================
   TYPING INDICATOR
   ============================================ */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
        <Bug className="w-3 h-3 text-white" />
      </div>
      <div className="bg-bg-tertiary border border-border-subtle rounded-2xl px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-brand-400"
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ============================================
   ASSISTANT PAGE
   ============================================ */
export default function AssistantPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [input, setInput] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleUploadSuccess = (newDoc: any) => {
    setProduct(prev => {
      if (!prev) return prev
      return {
        ...prev,
        knowledge_documents: [
          ...(prev.knowledge_documents || []),
          {
            ...newDoc,
            indexed: false,
            created_at: new Date().toISOString()
          }
        ]
      }
    })
  }
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const { startRecording, stopRecording } = useVoiceInput()
  const { speak } = useTextToSpeech()
  const { isAuthenticated } = useAuthStore()

  const {
    messages, session, isLoading, isRecording, diagnosticStep,
    pendingImageUrl, initSession, addMessage, setLoading,
    setDiagnosticStep, setPendingImage, clearSession
  } = useChatStore()

  // Fetch product data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${productId}/assistant`)
      return
    }

    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${productId}`)
        setProduct(res.data)
      } catch {
        setProduct({
          id: productId, company_id: 'c1', name: 'Honda Activa 6G', model_number: 'Activa 6G',
          category: 'scooter', description: "Honda's best-selling automatic scooter",
          is_published: true, created_at: new Date().toISOString(),
          companies: { name: 'Honda Motors' },
          knowledge_documents: [
            { id: 'd1', product_id: productId, title: 'Owner Manual', type: 'pdf', indexed: true, created_at: '', page_count: 128, chunk_count: 215 },
          ],
        })
      }
    }
    const timer = setTimeout(() => {
      fetchProduct()
    }, 0)
    return () => clearTimeout(timer)
  }, [productId])

  // Init session + initial greeting
  useEffect(() => {
    if (!session || session.product_id !== productId) {
      initSession(productId)
      // Auto-send greeting
      const greetingTimer = setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: `Hello! I'm ready to help you diagnose issues with your product. 🔧\n\nWhat problem are you experiencing today? Describe any symptoms — sounds, behaviors, error lights, or anything unusual you've noticed.`,
          input_type: 'text',
          sources: [],
          retrieval_ms: 0,
        })
      }, 500)
      return () => clearTimeout(greetingTimer)
    }
  }, [productId, session, initSession, addMessage])

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsTranscribing(true)
      try {
        const transcript = await stopRecording()
        if (transcript) {
          setInput(transcript)
          setIsVoiceInput(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsTranscribing(false)
      }
    } else {
      await startRecording()
    }
  }

  async function sendMessage() {
    if (!input.trim() && !pendingImageUrl) return
    if (!session) return

    const text = input.trim()
    const imageUrl = pendingImageUrl
    const currentInputType = imageUrl ? 'image' : isVoiceInput ? 'voice' : 'text'

    // Add user message
    addMessage({
      role: 'user',
      content: text || 'Sent an image',
      input_type: currentInputType,
      image_url: imageUrl || undefined,
    })

    setInput('')
    setIsVoiceInput(false)
    setPendingImage(null)
    setLoading(true)

    try {
      const res = await api.post('/assistant/chat', {
        session_token: session.session_token,
        product_id: productId,
        message: text,
        input_type: currentInputType,
        image_url: imageUrl,
        conversation_history: messages.map(m => ({ role: m.role, content: m.content })),
      })

      addMessage({
        role: 'assistant',
        content: res.data.reply,
        input_type: 'text',
        sources: res.data.sources,
        retrieval_ms: res.data.retrieval_ms,
      })

      setDiagnosticStep(res.data.diagnostic_step)

      if (autoSpeak) {
        speak(res.data.reply)
      }
    } catch {
      addMessage({
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the diagnostic service right now. Please check that the backend server is running and try again.",
        input_type: 'text',
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const catIcon = CATEGORIES.find(c => c.value === product?.category)?.icon || '🔧'

  return (
    <div className="h-screen flex pt-16">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-r border-border-subtle overflow-hidden shrink-0 hidden lg:block"
            style={{ background: '#0F0F12' }}
          >
            <div className="p-5 h-full flex flex-col">
              {/* Product info */}
              <Link href={`/products/${productId}`} className="flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${getCategoryColor(product?.category || 'other')}15` }}>
                  {catIcon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">{product?.name}</h3>
                  <span className="text-2xs text-text-muted">{product?.companies?.name}</span>
                </div>
              </Link>

              <div className="divider mb-5" />

              {/* Diagnostic Progress */}
              <span className="label mb-3">Diagnostic Progress</span>
              <DiagnosticProgress currentStep={diagnosticStep} />

              <div className="divider my-5" />

              {/* Knowledge base mini */}
              <div className="flex items-center justify-between mb-3">
                <span className="label">Knowledge Base</span>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="text-2xs text-brand-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3 text-brand-400" /> Upload
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {product?.knowledge_documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="text-green-400">●</span>
                    <span className="truncate">{doc.title}</span>
                  </div>
                ))}
              </div>

              {/* Clear session */}
              <button
                onClick={clearSession}
                className="btn-ghost text-xs mt-4 w-full text-center text-text-muted hover:text-red-400"
              >
                Clear Session
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-border-subtle flex items-center justify-between px-5 shrink-0" style={{ background: 'rgba(15,15,18,0.8)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden btn-ghost p-1.5">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-white">{product?.name}</span>
            <div className="badge-brand text-2xs">
              Step {diagnosticStep}/6 — {DIAGNOSTIC_STEPS[diagnosticStep - 1]?.label}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`btn-ghost p-2 ${autoSpeak ? 'text-brand-400' : 'text-text-muted'}`}
              aria-label="Toggle auto-speak"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>
          {isLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-border-subtle p-4 shrink-0" style={{ background: '#0F0F12' }}>
          {/* Pending image preview */}
          <AnimatePresence>
            {pendingImageUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 flex items-center gap-2"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border-subtle">
                  <img src={pendingImageUrl} alt="Pending" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => setPendingImage(null)} className="btn-ghost p-1.5 text-text-muted hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {isVoiceInput && (
            <div className="flex items-center gap-1.5 text-xs text-brand-400 mb-2 px-1 animate-fade-in">
              <Mic className="w-3.5 h-3.5" />
              <span>Voice input: {input}</span>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Image upload */}
            <button
              className="btn-ghost p-2.5 text-text-muted hover:text-brand-400 shrink-0"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/jpeg,image/png,image/webp'
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (!file) return
                  if (file.size > 5 * 1024 * 1024) return
                  try {
                    const formData = new FormData()
                    formData.append('file', file)
                    const res = await api.post(`/image/upload/${productId}`, formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    setPendingImage(res.data.image_url)
                  } catch {
                    setPendingImage(URL.createObjectURL(file))
                  }
                }
                input.click()
              }}
              aria-label="Upload image"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (isVoiceInput) setIsVoiceInput(false)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe your issue..."
                rows={1}
                className="input-field resize-none min-h-[44px] max-h-[120px] pr-12"
                style={{ paddingRight: '48px' }}
              />
            </div>

            {/* Voice button */}
            <button
              onClick={handleVoiceToggle}
              disabled={isTranscribing}
              className={`btn-ghost p-2.5 shrink-0 transition-all duration-200 relative ${
                isRecording ? 'text-red-500' : isTranscribing ? 'text-brand-400' : 'text-text-muted hover:text-brand-400'
              }`}
              aria-label={isRecording ? 'Stop recording' : isTranscribing ? 'Transcribing' : 'Start recording'}
            >
              {isRecording && (
                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
              )}
              {isTranscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !pendingImageUrl)}
              className="btn-primary p-2.5 shrink-0 disabled:opacity-30"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      {product && (
        <UploadManualModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          productId={productId}
          productName={product.name}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  )
}
