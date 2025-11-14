'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  const { t } = useTranslation('common')
  const [isOnline, setIsOnline] = React.useState(true)

  React.useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">You&apos;re Online!</h1>
            <Link href="/">
              <Button size="lg">Go Home</Button>
            </Link>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <WifiOff size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">{t('offline')}</h1>
          <p className="text-lg text-gray-600 mb-6">
            You&apos;re currently offline. Don&apos;t worry! You can still use the app with cached content.
          </p>
          <Link href="/">
            <Button size="lg">Continue Offline</Button>
          </Link>
        </Card>
      </main>
      <AppFooter />
    </div>
  )
}

