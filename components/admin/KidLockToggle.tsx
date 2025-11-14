'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export interface KidLockToggleProps {
  kidLock: boolean
  onKidLockChange: (kidLock: boolean) => void
}

export const KidLockToggle: React.FC<KidLockToggleProps> = ({
  kidLock,
  onKidLockChange,
}) => {
  const { t } = useTranslation('common')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('kidLock')}</h2>
      <p className="mb-4">{t('kidLockEnabled')}</p>
      <Button
        onClick={() => onKidLockChange(!kidLock)}
        variant={kidLock ? 'default' : 'outline'}
        size="lg"
      >
        {kidLock ? 'Disable Kid Lock' : 'Enable Kid Lock'}
      </Button>
    </div>
  )
}

