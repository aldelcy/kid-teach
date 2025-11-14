import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/components/providers/I18nProvider'
import { AudioProvider } from '@/components/providers/AudioProvider'
import { ServiceWorkerRegister } from './service-worker-register'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KidTeach - Learn Alphabet, Colors, Animals & More',
  description: 'A tablet-first PWA for toddlers to learn alphabet, colors, animals, family members, and actions. Bilingual (English + French) with Haitian Creole support.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KidTeach',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ef4444',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <AudioProvider>
            {children}
            <ServiceWorkerRegister />
          </AudioProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

