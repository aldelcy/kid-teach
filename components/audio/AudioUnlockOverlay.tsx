'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AudioUnlockOverlayProps {
  show: boolean
  onUnlock: () => void
}

export const AudioUnlockOverlay: React.FC<AudioUnlockOverlayProps> = ({
  show,
  onUnlock,
}) => {
  const { t } = useTranslation('common')

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-primary-500 bg-opacity-90"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="text-center p-8"
        >
          <Volume2 size={64} className="mx-auto mb-6 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('tapToEnableSound')}
          </h2>
          <Button
            onClick={onUnlock}
            size="lg"
            className="bg-white text-primary-500 hover:bg-gray-100"
          >
            {t('tapToEnableSound')}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

