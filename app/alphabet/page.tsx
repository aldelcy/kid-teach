'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { BigTile } from '@/components/ui/BigTile'
import alphabetDataEn from '@/content/i18n/en/alphabet.json'
import alphabetDataFr from '@/content/i18n/fr/alphabet.json'
import alphabetDataHt from '@/content/i18n/ht/alphabet.json'

const alphabetData = {
  en: alphabetDataEn,
  fr: alphabetDataFr,
  ht: alphabetDataHt,
}

// Generate all letters A-Z for display
const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AlphabetPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const currentAlphabet = alphabetData[currentLang] || alphabetDataEn
  const availableLetters = (currentAlphabet.letters || []).map((l: any) => l.id.toLowerCase())

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Alphabet</h1>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
          {allLetters.map(letter => {
            const hasContent = availableLetters.includes(letter.toLowerCase())
            return (
              <Link key={letter} href={`/alphabet/${letter.toLowerCase()}`}>
                <BigTile className={`aspect-square ${hasContent ? '' : 'opacity-50'}`}>
                  <span className="text-5xl font-bold">{letter}</span>
                </BigTile>
              </Link>
            )
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

