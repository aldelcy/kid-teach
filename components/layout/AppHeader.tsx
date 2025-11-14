'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Settings, Home, ArrowLeft } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { IconButton } from '@/components/ui/IconButton'
import { Button } from '@/components/ui/button'
import { dbClient } from '@/lib/db/IndexedDbClient'

export const AppHeader: React.FC = () => {
  const { t } = useTranslation('common')
  const pathname = usePathname()
  const router = useRouter()
  const [kidLock, setKidLock] = React.useState(false)

  React.useEffect(() => {
    dbClient.getSettings().then(settings => {
      setKidLock(settings.kidLock)
    })
  }, [])

  // Show back button on all pages except home
  const showBackButton = pathname !== '/'

  const handleBack = () => {
    router.back()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button - Big and Prominent */}
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="default"
              size="lg"
              className="bg-red-500 text-white hover:bg-red-600 active:bg-red-700 text-xl font-bold flex items-center justify-center gap-2 px-6"
            >
              <ArrowLeft size={28} />
              <span>{t('back')}</span>
            </Button>
          )}

          {/* App Name */}
          <Link href="/" className="flex items-center gap-2">
            <Home size={24} />
            <span className="text-xl font-bold">{t('appName')}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {!kidLock && (
            <Link href="/settings">
              <IconButton
                icon={<Settings size={24} />}
                size="sm"
                variant="ghost"
                aria-label={t('settings')}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

