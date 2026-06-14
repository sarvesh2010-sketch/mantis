'use client'
import { useState, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import { useChatStore } from '@/stores/chatStore'
import { toast } from 'sonner'

export function useVoiceInput() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { setRecording } = useChatStore()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(100)
      setRecording(true)
    } catch (err) {
      toast.error('Microphone access denied')
    }
  }, [setRecording])

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current
      if (!recorder) return reject('No recorder')

      recorder.onstop = async () => {
        setRecording(false)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const stream = recorder.stream
        stream.getTracks().forEach(t => t.stop())

        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          const res = await api.post<{ transcript: string }>('/voice/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          resolve(res.data.transcript)
        } catch {
          reject('Transcription failed')
        }
      }

      recorder.stop()
    })
  }, [setRecording])

  return { startRecording, stopRecording }
}
