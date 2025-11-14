'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { Card } from '@/components/ui/Card'
import { AudioButton } from '@/components/ui/AudioButton'
import { Volume2 } from 'lucide-react'
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

export default function AnimalsPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const animals = animalsData[currentLang]?.animals || animalsDataEn.animals
  const [contentEdits, setContentEdits] = React.useState<{ animals?: any[] }>({})

  React.useEffect(() => {
    loadContentEdits()
  }, [])

  const loadContentEdits = async () => {
    const edits = await dbClient.getContentEdits()
    setContentEdits(edits)
  }

  const getAnimalImage = (animal: any): string => {
    // Check IndexedDB first for custom URL
    const animalEdit = contentEdits.animals?.find(a => a.id === animal.id)
    if (animalEdit?.imageUrl) {
      return animalEdit.imageUrl
    }
    // Fallback to content JSON
    return animal.image || '/assets/images/animals/default.jpg'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Animals</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {animals.map((animal: any) => {
            const imageUrl = getAnimalImage(animal)
            const isCustomUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://')

            return (
              <Link key={animal.id} href={`/animals/${animal.id}`}>
                <Card className="text-center p-6 cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-32 h-32 bg-gray-100 rounded-card mb-4 mx-auto flex items-center justify-center overflow-hidden">
                    {isCustomUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={animal.name} className="w-full h-full object-cover" onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl">🐾</span>'
                      }} />
                    ) : (
                      imageUrl ? (
                        <Image src={imageUrl} alt={animal.name} width={128} height={128} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">🐾</span>
                      )
                    )}
                  </div>
                  <div className="text-xl font-bold mb-2">{animal.name}</div>
                  {animal.soundKey && (
                    <div className="flex justify-center">
                      <Volume2 size={20} className="text-gray-500" />
                    </div>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

