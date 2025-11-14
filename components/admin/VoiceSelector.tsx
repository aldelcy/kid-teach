'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

export interface VoiceSelectorProps {
  settings: {
    voices: {
      en?: string
      fr?: string
      ht?: string
    }
  }
  onSettingsChange: (settings: any) => void
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  settings,
  onSettingsChange,
}) => {
  const { t } = useTranslation('common')
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const getVoicesForLang = (lang: string) => {
    const langPrefix = lang === 'en' ? 'en' : lang === 'fr' ? 'fr' : 'fr'
    return voices.filter(v => v.lang.startsWith(langPrefix))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('voiceSelection')}</h2>
      <div className="space-y-4">
        {['en', 'fr', 'ht'].map(lang => {
          const langVoices = getVoicesForLang(lang)
          const currentVoice = settings.voices[lang as keyof typeof settings.voices]

          return (
            <div key={lang}>
              <label className="block text-lg mb-2">
                {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Kreyòl'}
              </label>
              <select
                value={currentVoice || ''}
                onChange={(e) => {
                  onSettingsChange({
                    ...settings,
                    voices: {
                      ...settings.voices,
                      [lang]: e.target.value,
                    },
                  })
                }}
                className="w-full px-4 py-3 text-lg border-2 border-primary-500 rounded-card"
              >
                <option value="">Default</option>
                {langVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

