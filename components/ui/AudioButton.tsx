'use client'

import * as React from 'react'
import { Volume2, Loader2 } from 'lucide-react'
import { IconButton } from './IconButton'
import { audioController } from '@/lib/audio/AudioController'
import { useTranslation } from 'react-i18next'

export interface AudioButtonProps {
  text?: string
  audioUrl?: string
  lang?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  audioUrl,
  lang = 'en',
  disabled = false,
  size = 'md',
  fullWidth = false,
}) => {
  const { i18n } = useTranslation()
  const [isPlaying, setIsPlaying] = React.useState(false)
  const currentLang = lang || i18n.language

  const handleClick = async () => {
    if (disabled || isPlaying) return

    // Check if audio was explicitly disabled
    const audioDisabled = typeof window !== 'undefined' && localStorage.getItem('audioDisabled') === 'true'
    if (audioDisabled) {
      // Audio is disabled, don't play
      return
    }

    // Auto-unlock on first click (user interaction unlocks audio context)
    // This satisfies browser autoplay policies
    if (!audioController.isAudioUnlocked()) {
      audioController.unlock()
      // Save to localStorage so preference persists across reloads
      if (typeof window !== 'undefined') {
        localStorage.setItem('audioUnlocked', 'true')
        localStorage.removeItem('audioDisabled')
      }
    }

    setIsPlaying(true)
    try {
      await audioController.speak(text || '', currentLang, audioUrl, () => {
        setIsPlaying(false)
      })
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    }
  }

  // Full width button variant
  if (fullWidth) {
    const iconSize = size === 'lg' ? 32 : size === 'md' ? 28 : 24
    return (
      <button
        onClick={handleClick}
        disabled={disabled || isPlaying}
        className={`
          w-full min-h-[64px] px-6 py-4 rounded-card
          bg-primary-500 text-white font-bold text-lg
          hover:bg-primary-600 active:bg-primary-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-primary-500
          flex items-center justify-center gap-3
        `}
        aria-label={text || 'Play audio'}
      >
        {isPlaying ? (
          <>
            <Loader2 className="animate-spin" size={iconSize} />
            <span>Playing...</span>
          </>
        ) : (
          <>
            <Volume2 size={iconSize} />
            <span>{text || 'Play'}</span>
          </>
        )}
      </button>
    )
  }

  // Icon button variant (default)
  return (
    <IconButton
      icon={
        isPlaying ? (
          <Loader2 className="animate-spin" size={size === 'lg' ? 32 : size === 'md' ? 24 : 20} />
        ) : (
          <Volume2 size={size === 'lg' ? 32 : size === 'md' ? 24 : 20} />
        )
      }
      onClick={handleClick}
      disabled={disabled || isPlaying}
      size={size}
      aria-label={text || 'Play audio'}
    />
  )
}

