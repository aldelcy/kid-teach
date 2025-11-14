'use client'

import { useEffect } from 'react'
import { audioController } from '@/lib/audio/AudioController'

/**
 * Hook to manage audio unlock state
 * Audio is enabled by default and auto-unlocks on first user interaction (button click)
 * No annoying overlay - audio just works!
 */
export function useAudioUnlocked() {
  useEffect(() => {
    // Check if audio was explicitly disabled by user
    const audioDisabled = localStorage.getItem('audioDisabled') === 'true'

    if (audioDisabled) {
      // Audio was manually disabled, keep it locked
      // User can re-enable via settings or by clicking an audio button
      return
    }

    // Default: Audio should be enabled
    // Set localStorage to 'true' if not already set (first time user)
    if (localStorage.getItem('audioUnlocked') === null) {
      localStorage.setItem('audioUnlocked', 'true')
    }

    // Note: We don't call audioController.unlock() here because:
    // 1. Browser requires user interaction to unlock audio context
    // 2. Audio buttons will auto-unlock on first click
    // 3. This prevents annoying overlays while still satisfying browser requirements
  }, [])

  // Return empty object - no state needed, audio unlocks automatically
  return {}
}

