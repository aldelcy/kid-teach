'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { AudioButton } from '@/components/ui/AudioButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { audioController } from '@/lib/audio/AudioController'
import { audioIndex } from '@/lib/audio/audioIndex'
import numbersDataEn from '@/content/i18n/en/numbers.json'
import numbersDataFr from '@/content/i18n/fr/numbers.json'
import numbersDataHt from '@/content/i18n/ht/numbers.json'

const numbersData = {
  en: numbersDataEn,
  fr: numbersDataFr,
  ht: numbersDataHt,
}

// Generate all numbers 1-20 for navigation
const allNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString())

export default function NumberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n, t } = useTranslation('common')
  const numberId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const currentNumbers = numbersData[currentLang] || numbersDataEn
  const numberData = (currentNumbers.numbers || []).find((n: any) => n.id === numberId)

  const currentIndex = allNumbers.indexOf(numberId)
  const prevNumber = currentIndex > 0 ? allNumbers[currentIndex - 1] : null
  const nextNumber = currentIndex < allNumbers.length - 1 ? allNumbers[currentIndex + 1] : null

  if (!numberData) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Number not found</h1>
            <Button onClick={() => router.push('/numbers')}>Back to Numbers</Button>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  // Get audio URL for number (not yet implemented in audio index)
  const numberAudioUrl = undefined

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => prevNumber && router.push(`/numbers/${prevNumber}`)}
              disabled={!prevNumber}
              size="lg"
            >
              <ChevronLeft size={24} />
              {t('prev')}
            </Button>
            <Button
              variant="outline"
              onClick={() => nextNumber && router.push(`/numbers/${nextNumber}`)}
              disabled={!nextNumber}
              size="lg"
            >
              {t('next')}
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Main Content: Number Display */}
          <div className="flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px]">
            {/* HUGE Number */}
            <div className="text-[20rem] md:text-[24rem] lg:text-[28rem] font-bold leading-none select-none mb-8"
              style={{ lineHeight: '0.85', fontFamily: 'system-ui, -apple-system, sans-serif' }}
              aria-label={`Number ${numberData.value}`}
            >
              {numberData.value}
            </div>

            {/* Number Name */}
            <h1 className="text-5xl font-bold mb-8">{numberData.name}</h1>

            {/* Audio Button */}
            <div className="w-full max-w-md">
              <AudioButton
                text={numberData.name}
                audioUrl={numberAudioUrl}
                lang={currentLang}
                size="lg"
                fullWidth
              />
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

