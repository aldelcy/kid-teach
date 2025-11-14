'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { AudioButton } from '@/components/ui/AudioButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { audioController } from '@/lib/audio/AudioController'
import { audioIndex } from '@/lib/audio/audioIndex'
import alphabetDataEn from '@/content/i18n/en/alphabet.json'
import alphabetDataFr from '@/content/i18n/fr/alphabet.json'
import alphabetDataHt from '@/content/i18n/ht/alphabet.json'

const alphabetData = {
  en: alphabetDataEn,
  fr: alphabetDataFr,
  ht: alphabetDataHt,
}

// Generate all letters A-Z for navigation
const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function LetterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n, t } = useTranslation('common')
  const letterId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const currentAlphabet = alphabetData[currentLang] || alphabetDataEn
  const letterData = (currentAlphabet.letters || []).find((l: any) => l.id.toLowerCase() === letterId.toLowerCase())

  const currentIndex = allLetters.indexOf(letterId.toLowerCase())
  const prevLetter = currentIndex > 0 ? allLetters[currentIndex - 1] : null
  const nextLetter = currentIndex < allLetters.length - 1 ? allLetters[currentIndex + 1] : null

  const [selectedWord, setSelectedWord] = React.useState<string | null>(null)

  if (!letterData) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Letter not found</h1>
            <Button onClick={() => router.push('/alphabet')}>Back to Alphabet</Button>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  // Get audio URL for letter (only calculate after we know letterData exists)
  const letterAudioUrl: string | undefined = letterData.letterAudioKey
    ? audioIndex.resolveAudioKey(letterData.letterAudioKey)
    : audioIndex.getLetterAudio(currentLang, letterId)

  // Combine upper and lower case for audio playback
  const letterText = `${letterData.upper} ${letterData.lower}`

  const handlePlayWord = async (word: string, audioKey?: string, sound?: string) => {
    setSelectedWord(word)
    // Priority: sound property > audioKey
    const audioUrl = sound || (audioKey ? audioIndex.resolveAudioKey(audioKey) : undefined)
    await audioController.speak(word, currentLang, audioUrl)
    setTimeout(() => setSelectedWord(null), 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => prevLetter && router.push(`/alphabet/${prevLetter}`)}
              disabled={!prevLetter}
              size="lg"
            >
              <ChevronLeft size={24} />
              {t('prev')}
            </Button>
            <Button
              variant="outline"
              onClick={() => nextLetter && router.push(`/alphabet/${nextLetter}`)}
              disabled={!nextLetter}
              size="lg"
            >
              {t('next')}
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Main Content: Letter on Left, Examples on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Left Side: HUGE Letters with Audio Button */}
            <div className="flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px]">
              {/* HUGE Letters: Upper and Lower Case Side by Side */}
              <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 mb-8">
                <div
                  className="text-[18rem] md:text-[24rem] lg:text-[28rem] font-bold leading-none select-none"
                  style={{ lineHeight: '0.85', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  aria-label={`Letter ${letterData.upper}`}
                >
                  {letterData.upper}
                </div>
                <div
                  className="text-[18rem] md:text-[24rem] lg:text-[28rem] font-bold leading-none select-none"
                  style={{ lineHeight: '0.85', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  aria-label={`Letter ${letterData.lower}`}
                >
                  {letterData.lower}
                </div>
              </div>

              {/* Audio Button */}
              <div className="w-full max-w-md">
                <AudioButton
                  text={letterText}
                  audioUrl={letterAudioUrl}
                  lang={currentLang}
                  size="lg"
                  fullWidth
                />
              </div>
            </div>

            {/* Right Side: Examples */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold mb-6">Examples</h2>
              {letterData.examples && letterData.examples.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {letterData.examples.map((example: any, index: number) => (
                    <Card
                      key={index}
                      onClick={() => handlePlayWord(example.word, example.audioKey, example.sound)}
                      className={`cursor-pointer hover:scale-105 transition-transform p-4 ${
                        selectedWord === example.word ? 'ring-4 ring-primary-500' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-3 w-full">
                        {example.image && (
                          <div className="relative w-full h-40 bg-gray-100 rounded-card overflow-hidden flex items-center justify-center">
                            <Image
                              src={example.image}
                              alt={example.word}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="text-xl font-bold">{example.word}</div>
                        <AudioButton
                          text={example.word}
                          audioUrl={example.sound || (example.audioKey ? audioIndex.resolveAudioKey(example.audioKey) : undefined)}
                          lang={currentLang}
                          size="lg"
                          fullWidth
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-xl text-gray-500">No examples available for this letter yet.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

