'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

export interface ParentGateProps {
  onUnlock: () => void
  children?: React.ReactNode
}

export const ParentGate: React.FC<ParentGateProps> = ({ onUnlock, children }) => {
  const { t } = useTranslation('common')
  const [isHolding, setIsHolding] = React.useState(false)
  const [holdProgress, setHoldProgress] = React.useState(0)
  const [showMath, setShowMath] = React.useState(false)
  const [mathAnswer, setMathAnswer] = React.useState('')
  const [mathQuestion, setMathQuestion] = React.useState({ a: 0, b: 0 })
  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // Generate math question
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    setMathQuestion({ a, b })
  }, [])

  const startHold = () => {
    setIsHolding(true)
    setHoldProgress(0)

    progressTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimerRef.current!)
          setIsHolding(false)
          setShowMath(true)
          return 100
        }
        return prev + 2 // 2% per 40ms = 2 seconds total
      })
    }, 40)

    holdTimerRef.current = setTimeout(() => {
      clearInterval(progressTimerRef.current!)
      setIsHolding(false)
      setShowMath(true)
    }, 2000)
  }

  const stopHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    setIsHolding(false)
    setHoldProgress(0)
  }

  const handleMathSubmit = () => {
    const correctAnswer = mathQuestion.a + mathQuestion.b
    if (parseInt(mathAnswer) === correctAnswer) {
      onUnlock()
    } else {
      setMathAnswer('')
      // Regenerate question
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      setMathQuestion({ a, b })
    }
  }

  if (showMath) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Card className="p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">{t('parentMode')}</h2>
            <p className="text-lg mb-6">
              {mathQuestion.a} + {mathQuestion.b} = ?
            </p>
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              className="w-full px-4 py-3 text-2xl border-2 border-primary-500 rounded-card mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMathSubmit()
                }
              }}
            />
            <div className="flex gap-4">
              <Button onClick={handleMathSubmit} className="flex-1">
                {t('save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMath(false)
                  setMathAnswer('')
                }}
                className="flex-1"
              >
                {t('cancel')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Card className="p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{t('parentMode')}</h2>
        <p className="text-lg mb-6 text-center">{t('unlockParentMode')}</p>
        <div className="flex flex-col items-center gap-4">
          <button
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            className="w-full py-4 px-6 bg-primary-500 text-white rounded-card text-xl font-bold relative overflow-hidden"
          >
            {isHolding && (
              <motion.div
                className="absolute inset-0 bg-primary-600"
                initial={{ width: '0%' }}
                animate={{ width: `${holdProgress}%` }}
                transition={{ duration: 0.04 }}
              />
            )}
            <span className="relative z-10">
              {isHolding ? t('unlocking') : t('unlockParentMode')}
            </span>
          </button>
          {children}
        </div>
      </Card>
    </div>
  )
}

