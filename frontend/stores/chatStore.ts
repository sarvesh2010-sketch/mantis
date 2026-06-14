'use client'
import { create } from 'zustand'
import type { Message, DiagnosticSession } from '@/types'
import { v4 as uuid } from 'uuid'

interface ChatState {
  messages: Message[]
  session: DiagnosticSession | null
  isLoading: boolean
  isRecording: boolean
  isSpeaking: boolean
  diagnosticStep: number
  pendingImageUrl: string | null

  initSession: (productId: string) => void
  addMessage: (msg: Omit<Message, 'id' | 'created_at'>) => void
  setLoading: (v: boolean) => void
  setRecording: (v: boolean) => void
  setSpeaking: (v: boolean) => void
  setDiagnosticStep: (step: number) => void
  setPendingImage: (url: string | null) => void
  clearSession: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  session: null,
  isLoading: false,
  isRecording: false,
  isSpeaking: false,
  diagnosticStep: 1,
  pendingImageUrl: null,

  initSession: (productId) => {
    const token = uuid()
    set({
      session: { session_token: token, product_id: productId, diagnostic_step: 1 },
      messages: [],
      diagnosticStep: 1,
    })
  },

  addMessage: (msg) => {
    const full: Message = { id: uuid(), created_at: new Date(), ...msg }
    set((s) => ({ messages: [...s.messages, full] }))
  },

  setLoading:       (v) => set({ isLoading: v }),
  setRecording:     (v) => set({ isRecording: v }),
  setSpeaking:      (v) => set({ isSpeaking: v }),
  setDiagnosticStep:(step) => set({ diagnosticStep: step }),
  setPendingImage:  (url) => set({ pendingImageUrl: url }),
  clearSession:     () => set({ messages: [], session: null, diagnosticStep: 1 }),
}))
