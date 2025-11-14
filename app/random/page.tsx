'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { AudioButton } from '@/components/ui/AudioButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Shuffle } from 'lucide-react'
import { audioController } from '@/lib/audio/AudioController'
import { audioIndex } from '@/lib/audio/audioIndex'
import alphabetDataEn from '@/content/i18n/en/alphabet.json'
import alphabetDataFr from '@/content/i18n/fr/alphabet.json'
import alphabetDataHt from '@/content/i18n/ht/alphabet.json'
import numbersDataEn from '@/content/i18n/en/numbers.json'
import numbersDataFr from '@/content/i18n/fr/numbers.json'
import numbersDataHt from '@/content/i18n/ht/numbers.json'
import shapesDataEn from '@/content/i18n/en/shapes.json'
import shapesDataFr from '@/content/i18n/fr/shapes.json'
import shapesDataHt from '@/content/i18n/ht/shapes.json'

const alphabetData = {
  en: alphabetDataEn,
  fr: alphabetDataFr,
  ht: alphabetDataHt,
}

const numbersData = {
  en: numbersDataEn,
  fr: numbersDataFr,
  ht: numbersDataHt,
}

const shapesData = {
  en: shapesDataEn,
  fr: shapesDataFr,
  ht: shapesDataHt,
}

type RandomItem = {
  type: 'alphabet' | 'number' | 'shape'
  id: string
  name: string
  display: string | number
  audioUrl?: string
}

export default function RandomPage() {
  const router = useRouter()
  const { i18n, t } = useTranslation('common')
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'

  const [currentItem, setCurrentItem] = React.useState<RandomItem | null>(null)
  const [category, setCategory] = React.useState<'alphabet' | 'number' | 'shape' | 'all'>('all')

  const getRandomItem = React.useCallback(() => {
    const items: RandomItem[] = []

    // Add alphabet items
    if (category === 'all' || category === 'alphabet') {
      const alphabet = alphabetData[currentLang] || alphabetDataEn
      alphabet.letters?.forEach((letter: any) => {
        items.push({
          type: 'alphabet',
          id: letter.id,
          name: `${letter.upper} ${letter.lower}`,
          display: letter.upper,
          audioUrl: audioIndex.getLetterAudio(currentLang, letter.id),
        })
      })
    }

    // Add number items
    if (category === 'all' || category === 'number') {
      const numbers = numbersData[currentLang] || numbersDataEn
      numbers.numbers?.forEach((number: any) => {
        items.push({
          type: 'number',
          id: number.id,
          name: number.name,
          display: number.value,
          audioUrl: undefined, // Number audio not yet implemented
        })
      })
    }

    // Add shape items
    if (category === 'all' || category === 'shape') {
      const shapes = shapesData[currentLang] || shapesDataEn
      shapes.shapes?.forEach((shape: any) => {
        items.push({
          type: 'shape',
          id: shape.id,
          name: shape.name,
          display: shape.name,
          audioUrl: undefined, // Shape audio not yet implemented
        })
      })
    }

    if (items.length === 0) return null

    const randomItem = items[Math.floor(Math.random() * items.length)]
    return randomItem
  }, [category, currentLang])

  React.useEffect(() => {
    setCurrentItem(getRandomItem())
  }, [getRandomItem])

  const handleNext = () => {
    setCurrentItem(getRandomItem())
  }

  const handlePlay = async () => {
    if (!currentItem) return
    await audioController.speak(currentItem.name, currentLang, currentItem.audioUrl)
  }

  const handleNavigate = () => {
    if (!currentItem) return
    const basePath = currentItem.type === 'alphabet' ? '/alphabet' :
                     currentItem.type === 'number' ? '/numbers' : '/shapes'
    router.push(`${basePath}/${currentItem.id}`)
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">No items available</h1>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Selector */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            <Button
              variant={category === 'all' ? 'default' : 'outline'}
              onClick={() => setCategory('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={category === 'alphabet' ? 'default' : 'outline'}
              onClick={() => setCategory('alphabet')}
              size="sm"
            >
              {t('alphabet')}
            </Button>
            <Button
              variant={category === 'number' ? 'default' : 'outline'}
              onClick={() => setCategory('number')}
              size="sm"
            >
              {t('numbers')}
            </Button>
            <Button
              variant={category === 'shape' ? 'default' : 'outline'}
              onClick={() => setCategory('shape')}
              size="sm"
            >
              {t('shapes')}
            </Button>
          </div>

          {/* Main Display */}
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
              {/* Display Item */}
              <div className="text-[15rem] md:text-[20rem] font-bold leading-none select-none"
                style={{ lineHeight: '0.85', fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {currentItem.display}
              </div>

              {/* Item Name */}
              <h1 className="text-4xl font-bold">{currentItem.name}</h1>

              {/* Audio Button */}
              <div className="w-full max-w-md">
                <AudioButton
                  text={currentItem.name}
                  audioUrl={currentItem.audioUrl}
                  lang={currentLang}
                  size="lg"
                  fullWidth
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full max-w-md">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="flex-1"
                >
                  <Shuffle size={24} className="mr-2" />
                  {t('randomize')}
                </Button>
                <Button
                  onClick={handleNavigate}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  {t('seeMore')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

