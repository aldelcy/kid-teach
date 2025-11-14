'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { dbClient, AppData } from '@/lib/db/IndexedDbClient'

export const BackupRestore: React.FC = () => {
  const { t } = useTranslation('common')

  const handleExport = async () => {
    const data = await dbClient.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kidteach-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const text = await file.text()
      try {
        const data: AppData = JSON.parse(text)
        await dbClient.importData(data)
        alert('Data imported successfully! Please refresh the page.')
      } catch (error) {
        alert('Error importing data. Please check the file format.')
        console.error(error)
      }
    }
    input.click()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('backupRestore')}</h2>
      <div className="flex gap-4">
        <Button onClick={handleExport} size="lg">
          {t('exportData')}
        </Button>
        <Button onClick={handleImport} size="lg" variant="secondary">
          {t('importData')}
        </Button>
      </div>
    </div>
  )
}

