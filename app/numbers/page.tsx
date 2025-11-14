'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { BigTile } from '@/components/ui/BigTile'
import numbersDataEn from '@/content/i18n/en/numbers.json'
import numbersDataFr from '@/content/i18n/fr/numbers.json'
import numbersDataHt from '@/content/i18n/ht/numbers.json'

const numbersData = {
  en: numbersDataEn,
  fr: numbersDataFr,
  ht: numbersDataHt,
}

export default function NumbersPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const numbers = numbersData[currentLang]?.numbers || numbersDataEn.numbers

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Numbers</h1>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 max-w-6xl mx-auto">
          {numbers.map((number: any) => (
            <Link key={number.id} href={`/numbers/${number.id}`}>
              <BigTile className="aspect-square">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{number.value}</span>
                  <span className="text-sm mt-1">{number.name}</span>
                </div>
              </BigTile>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

