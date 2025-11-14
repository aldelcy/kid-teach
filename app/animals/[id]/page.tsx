'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { AudioButton } from '@/components/ui/AudioButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { audioController } from '@/lib/audio/AudioController'
import { audioIndex } from '@/lib/audio/audioIndex'
import { dbClient } from '@/lib/db/IndexedDbClient'
import Image from 'next/image'
import animalsDataEn from '@/content/i18n/en/animals.json'
import animalsDataFr from '@/content/i18n/fr/animals.json'
import animalsDataHt from '@/content/i18n/ht/animals.json'

const animalsData = {
  en: animalsDataEn,
  fr: animalsDataFr,
  ht: animalsDataHt,
}

export default function AnimalDetailPage() {
  const params = useParams()
  const { i18n } = useTranslation()
  const animalId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const allAnimals = animalsData[currentLang]?.animals || animalsDataEn.animals
  const animal = allAnimals.find((a: any) => a.id === animalId)
  const [contentEdits, setContentEdits] = React.useState<{ animals?: any[] }>({})

  React.useEffect(() => {
    loadContentEdits()
  }, [])

  const loadContentEdits = async () => {
    const edits = await dbClient.getContentEdits()
    setContentEdits(edits)
  }

  if (!animal) {
    return <div>Animal not found</div>
  }

  // Get image URL - check IndexedDB first, then fallback to content JSON
  const getAnimalImage = (): string => {
    const animalEdit = contentEdits.animals?.find(a => a.id === animalId)
    if (animalEdit?.imageUrl) {
      return animalEdit.imageUrl
    }
    return animal.image || '/assets/images/animals/default.jpg'
  }

  const animalImageUrl = getAnimalImage()
  const isCustomUrl = animalImageUrl.startsWith('http://') || animalImageUrl.startsWith('https://')

  // Get audio URL from audio index
  const animalSoundUrl = animal.soundKey
    ? audioIndex.resolveAudioKey(animal.soundKey)
    : audioIndex.getAnimalAudio(currentLang, animal.name)

  const handlePlayName = async () => {
    await audioController.speak(animal.name, currentLang)
  }

  const handlePlaySound = async () => {
    if (animalSoundUrl) {
      await audioController.speak('', currentLang, animalSoundUrl)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-card mb-6 mx-auto flex items-center justify-center overflow-hidden">
              {isCustomUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={animalImageUrl}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-9xl">🐾</span>'
                  }}
                />
              ) : (
                animalImageUrl ? (
                  <Image src={animalImageUrl} alt={animal.name} width={320} height={320} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl">🐾</span>
                )
              )}
            </div>
            <h1 className="text-5xl font-bold mb-4">{animal.name}</h1>

            <div className="flex items-center justify-center gap-4 mb-6">
              <AudioButton
                text={animal.name}
                lang={currentLang}
                size="lg"
              />
              <Button onClick={handlePlayName} size="lg">
                Say Name
              </Button>
              {animalSoundUrl && (
                <Button onClick={handlePlaySound} size="lg" variant="secondary">
                  Play Sound
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

