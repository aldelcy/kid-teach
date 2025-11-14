'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { Card } from '@/components/ui/Card'
import { AudioButton } from '@/components/ui/AudioButton'
import { audioController } from '@/lib/audio/AudioController'
import { dbClient } from '@/lib/db/IndexedDbClient'
import actionsDataEn from '@/content/i18n/en/actions.json'
import actionsDataFr from '@/content/i18n/fr/actions.json'
import actionsDataHt from '@/content/i18n/ht/actions.json'

const actionsData = {
  en: actionsDataEn,
  fr: actionsDataFr,
  ht: actionsDataHt,
}

const motionVariants = {
  bounce: {
    animate: { y: [0, -20, 0] },
    transition: { duration: 0.5 },
  },
  fade: {
    animate: { opacity: [1, 0.5, 1] },
    transition: { duration: 0.5 },
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.5 },
  },
  slide: {
    animate: { x: [0, 10, 0] },
    transition: { duration: 0.5 },
  },
  scale: {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 0.5 },
  },
  rotate: {
    animate: { rotate: [0, 10, -10, 0] },
    transition: { duration: 0.5 },
  },
}

export default function ActionsPage() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const actions = actionsData[currentLang]?.actions || actionsDataEn.actions
  const [animatedAction, setAnimatedAction] = React.useState<string | null>(null)
  const [contentEdits, setContentEdits] = React.useState<{ actions?: any[] }>({})

  React.useEffect(() => {
    loadContentEdits()
  }, [])

  const loadContentEdits = async () => {
    const edits = await dbClient.getContentEdits()
    setContentEdits(edits)
  }

  const getActionGif = (action: any): string | null => {
    // Check IndexedDB first for custom GIF URL
    const actionEdit = contentEdits.actions?.find(a => a.id === action.id)
    if (actionEdit?.gifUrl) {
      return actionEdit.gifUrl
    }
    // Fallback to null (no GIF, use default display)
    return null
  }

  const handlePlayAction = async (verb: string, motionHint: string) => {
    await audioController.speak(verb, currentLang)
    setAnimatedAction(verb)
    setTimeout(() => setAnimatedAction(null), 500)
  }

  const getMotionProps = (motionHint: string, isActive: boolean) => {
    if (!isActive) return {}
    const variant = motionVariants[motionHint as keyof typeof motionVariants]
    return variant || {}
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Actions</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {actions.map((action: any) => {
            const isActive = animatedAction === action.verb
            const motionProps = getMotionProps(action.motionHint, isActive)
            const gifUrl = getActionGif(action)
            const hasGif = gifUrl !== null

            return (
              <motion.div
                key={action.id}
                {...motionProps}
              >
                <Card
                  className="text-center p-6 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handlePlayAction(action.verb, action.motionHint)}
                >
                  <div className="w-32 h-32 bg-gray-100 rounded-card mb-4 mx-auto flex items-center justify-center overflow-hidden">
                    {hasGif ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gifUrl!}
                        alt={action.verb}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to emoji if GIF fails to load
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🎭</div>'
                        }}
                      />
                    ) : (
                      <div className="text-6xl">🎭</div>
                    )}
                  </div>
                  <div className="text-xl font-bold mb-2">{action.verb}</div>
                  <AudioButton
                    text={action.verb}
                    lang={currentLang}
                    size="sm"
                  />
                </Card>
              </motion.div>
            )
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

