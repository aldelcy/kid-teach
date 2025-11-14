'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { BigTile } from '@/components/ui/BigTile'
import {
  Type,
  Hash,
  Shapes,
  Palette,
  Cat,
  Users,
  Activity,
  Shuffle,
  Settings
} from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">{t('appName')}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/alphabet">
            <BigTile icon={<Type size={64} />}>
              {t('alphabet')}
            </BigTile>
          </Link>
          <Link href="/numbers">
            <BigTile icon={<Hash size={64} />}>
              {t('numbers')}
            </BigTile>
          </Link>
          <Link href="/shapes">
            <BigTile icon={<Shapes size={64} />}>
              {t('shapes')}
            </BigTile>
          </Link>
          <Link href="/colors">
            <BigTile icon={<Palette size={64} />}>
              {t('colors')}
            </BigTile>
          </Link>
          <Link href="/animals">
            <BigTile icon={<Cat size={64} />}>
              {t('animals')}
            </BigTile>
          </Link>
          <Link href="/family">
            <BigTile icon={<Users size={64} />}>
              {t('family')}
            </BigTile>
          </Link>
          <Link href="/actions">
            <BigTile icon={<Activity size={64} />}>
              {t('actions')}
            </BigTile>
          </Link>
          <Link href="/random">
            <BigTile icon={<Shuffle size={64} />}>
              {t('randomize')}
            </BigTile>
          </Link>
          <Link href="/settings">
            <BigTile icon={<Settings size={64} />}>
              {t('settings')}
            </BigTile>
          </Link>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

