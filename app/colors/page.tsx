'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { Card } from '@/components/ui/Card'
import colorsDataEn from '@/content/i18n/en/colors.json'
import colorsDataFr from '@/content/i18n/fr/colors.json'
import colorsDataHt from '@/content/i18n/ht/colors.json'

const colorsData = {
  en: colorsDataEn,
  fr: colorsDataFr,
  ht: colorsDataHt,
}

export default function ColorsPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const colors = colorsData[currentLang]?.colors || colorsDataEn.colors

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Colors</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {colors.map((color: any) => (
            <Link key={color.id} href={`/colors/${color.id}`}>
              <Card className="text-center p-6 cursor-pointer hover:scale-105 transition-transform">
                <ColorSwatch color={color.hex} name={color.name} size="md" className="mx-auto mb-4" />
                <div className="text-xl font-bold">{color.name}</div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

