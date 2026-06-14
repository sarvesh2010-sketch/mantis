'use client'
import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useChatStore } from '@/stores/chatStore'

export function useTextToSpeech() {
  const { setSpeaking } = useChatStore()

  const speak = useCallback(async (text: string) => {
    // Truncate to first 500 chars for TTS (keep it concise)
    const textToSpeak = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '').slice(0, 500)

    try {
      setSpeaking(true)
      const res = await api.post('/voice/speak', { text: textToSpeak }, { responseType: 'arraybuffer' })
      const audioCtx = new AudioContext()
      const buffer = await audioCtx.decodeAudioData(res.data)
      const source = audioCtx.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx.destination)
      source.onended = () => setSpeaking(false)
      source.start()
    } catch {
      setSpeaking(false)
    }
  }, [setSpeaking])

  return { speak }
}
