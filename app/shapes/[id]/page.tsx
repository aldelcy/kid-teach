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
import shapesDataEn from '@/content/i18n/en/shapes.json'
import shapesDataFr from '@/content/i18n/fr/shapes.json'
import shapesDataHt from '@/content/i18n/ht/shapes.json'

const shapesData = {
  en: shapesDataEn,
  fr: shapesDataFr,
  ht: shapesDataHt,
}

// Shape SVG components
const ShapeIcon = ({ shapeId, size = 200 }: { shapeId: string; size?: number }) => {
  const style = { width: size, height: size }

  switch (shapeId) {
    case 'circle':
      return <div className="rounded-full bg-primary-500" style={style} />
    case 'square':
      return <div className="bg-primary-500" style={style} />
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="currentColor" className="text-primary-500" />
        </svg>
      )
    case 'rectangle':
      return <div className="bg-primary-500" style={{ width: size * 1.5, height: size }} />
    case 'oval':
      return <div className="rounded-full bg-primary-500" style={{ width: size * 1.5, height: size }} />
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M50,10 L60,40 L90,40 L68,60 L78,90 L50,70 L22,90 L32,60 L10,40 L40,40 Z" fill="currentColor" className="text-primary-500" />
        </svg>
      )
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M50,85 C50,85 10,50 10,30 C10,20 20,15 30,15 C40,15 50,25 50,25 C50,25 60,15 70,15 C80,15 90,20 90,30 C90,50 50,85 50,85 Z" fill="currentColor" className="text-red-500" />
        </svg>
      )
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,10 90,50 50,90 10,50" fill="currentColor" className="text-primary-500" />
        </svg>
      )
    default:
      return <div className="bg-gray-300" style={style} />
  }
}

const allShapes = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'heart', 'diamond']

export default function ShapeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n, t } = useTranslation('common')
  const shapeId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const currentShapes = shapesData[currentLang] || shapesDataEn
  const shapeData = (currentShapes.shapes || []).find((s: any) => s.id === shapeId)

  const currentIndex = allShapes.indexOf(shapeId)
  const prevShape = currentIndex > 0 ? allShapes[currentIndex - 1] : null
  const nextShape = currentIndex < allShapes.length - 1 ? allShapes[currentIndex + 1] : null

  if (!shapeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Shape not found</h1>
            <Button onClick={() => router.push('/shapes')}>Back to Shapes</Button>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  // Get audio URL for shape (not yet implemented in audio index)
  const shapeAudioUrl = undefined

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => prevShape && router.push(`/shapes/${prevShape}`)}
              disabled={!prevShape}
              size="lg"
            >
              <ChevronLeft size={24} />
              {t('prev')}
            </Button>
            <Button
              variant="outline"
              onClick={() => nextShape && router.push(`/shapes/${nextShape}`)}
              disabled={!nextShape}
              size="lg"
            >
              {t('next')}
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Main Content: Shape Display */}
          <div className="flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px]">
            {/* HUGE Shape */}
            <div className="mb-8 flex items-center justify-center">
              <ShapeIcon shapeId={shapeData.id} size={300} />
            </div>

            {/* Shape Name */}
            <h1 className="text-5xl font-bold mb-8">{shapeData.name}</h1>

            {/* Audio Button */}
            <div className="w-full max-w-md">
              <AudioButton
                text={shapeData.name}
                audioUrl={shapeAudioUrl}
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

