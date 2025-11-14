'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const AppFooter: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="w-full border-t bg-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm">
        <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
          {t('privacy')}
        </Link>
      </div>
    </footer>
  )
}

