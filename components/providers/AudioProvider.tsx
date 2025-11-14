'use client'

import { useAudioUnlocked } from '@/hooks/useAudioUnlocked'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Initialize audio unlock state (no overlay shown)
  useAudioUnlocked()

  return <>{children}</>
}

