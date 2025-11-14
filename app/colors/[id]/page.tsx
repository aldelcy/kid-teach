'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { BigTile } from '@/components/ui/BigTile'
import { AudioButton } from '@/components/ui/AudioButton'
import { audioController } from '@/lib/audio/AudioController'
import { audioIndex } from '@/lib/audio/audioIndex'
import colorsDataEn from '@/content/i18n/en/colors.json'
import colorsDataFr from '@/content/i18n/fr/colors.json'
import colorsDataHt from '@/content/i18n/ht/colors.json'

const colorsData = {
  en: colorsDataEn,
  fr: colorsDataFr,
  ht: colorsDataHt,
}

export default function ColorDetailPage() {
  const params = useParams()
  const { i18n } = useTranslation()
  const colorId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const allColors = colorsData[currentLang]?.colors || colorsDataEn.colors
  const color = allColors.find((c: any) => c.id === colorId)

  if (!color) {
    return <div>Color not found</div>
  }

  // Get audio URL for color
  const colorAudioUrl = audioIndex.getColorAudio(currentLang, color.name)

  const handlePlayColor = async () => {
    await audioController.speak(color.name, currentLang, colorAudioUrl)
  }

  const handlePlayItem = async (item: string) => {
    // Try to get audio for the example item (might not exist, will fall back to TTS)
    const itemAudioUrl = audioIndex.getAnimalAudio(currentLang, item) ||
                         audioIndex.getLetterAudio(currentLang, item)
    await audioController.speak(item, currentLang, itemAudioUrl)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Color Swatch */}
          <div className="text-center mb-8">
            <ColorSwatch
              color={color.hex}
              name={color.name}
              size="lg"
              className="mx-auto mb-4"
            />
            <h1 className="text-5xl font-bold mb-4" style={{ color: color.hex }}>
              {color.name}
            </h1>
            <AudioButton
              text={color.name}
              audioUrl={colorAudioUrl}
              lang={currentLang}
              size="lg"
            />
          </div>

          {/* Color Examples */}
          {color.examples && color.examples.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Examples</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {color.examples.map((example: string, index: number) => (
                  <BigTile
                    key={index}
                    onClick={() => handlePlayItem(example)}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold">{example}</div>
                    </div>
                  </BigTile>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No examples available for this color yet.
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

