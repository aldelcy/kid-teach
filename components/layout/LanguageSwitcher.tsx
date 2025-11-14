'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('common')
  const [isOpen, setIsOpen] = React.useState(false)

  const languages = [
    { code: 'en', label: t('english') },
    { code: 'fr', label: t('french') },
    { code: 'ht', label: t('haitianCreole') },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Languages size={20} />
        <span>{currentLanguage.label}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-kid-lg z-50 border">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 first:rounded-t-card last:rounded-b-card ${
                  i18n.language === lang.code ? 'bg-primary-50 text-primary-700' : ''
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

