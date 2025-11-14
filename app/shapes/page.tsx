'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { BigTile } from '@/components/ui/BigTile'
import { Card } from '@/components/ui/Card'
import shapesDataEn from '@/content/i18n/en/shapes.json'
import shapesDataFr from '@/content/i18n/fr/shapes.json'
import shapesDataHt from '@/content/i18n/ht/shapes.json'

const shapesData = {
  en: shapesDataEn,
  fr: shapesDataFr,
  ht: shapesDataHt,
}

// Shape SVG components
const ShapeIcon = ({ shapeId, size = 64 }: { shapeId: string; size?: number }) => {
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

export default function ShapesPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const shapes = shapesData[currentLang]?.shapes || shapesDataEn.shapes

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Shapes</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {shapes.map((shape: any) => (
            <Link key={shape.id} href={`/shapes/${shape.id}`}>
              <Card className="text-center p-6 cursor-pointer hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  <ShapeIcon shapeId={shape.id} size={80} />
                </div>
                <div className="text-xl font-bold">{shape.name}</div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

