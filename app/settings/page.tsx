'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { ParentGate } from '@/components/layout/ParentGate'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { dbClient, AppData } from '@/lib/db/IndexedDbClient'
import { FamilyEditor } from '@/components/admin/FamilyEditor'
import { AnimalEditor } from '@/components/admin/AnimalEditor'
import { ActionEditor } from '@/components/admin/ActionEditor'
import { BackupRestore } from '@/components/admin/BackupRestore'
import { VoiceSelector } from '@/components/admin/VoiceSelector'
import { KidLockToggle } from '@/components/admin/KidLockToggle'

export default function SettingsPage() {
  const { i18n } = useTranslation()
  const [isUnlocked, setIsUnlocked] = React.useState(false)
  const [settings, setSettings] = React.useState({
    defaultLanguage: 'fr',
    voices: {},
    kidLock: false,
  })

  React.useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const loadedSettings = await dbClient.getSettings()
    setSettings(loadedSettings)
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
  }

  const handleSaveSettings = async () => {
    await dbClient.saveSettings(settings)
    // Update i18n language if changed
    if (settings.defaultLanguage !== i18n.language) {
      i18n.changeLanguage(settings.defaultLanguage)
    }
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ParentGate onUnlock={handleUnlock} />
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center mb-8">Settings</h1>

          {/* Language Settings */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Language</h2>
            <LanguageSwitcher />
            <div className="mt-4">
              <label className="block text-lg mb-2">Default Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full px-4 py-3 text-lg border-2 border-primary-500 rounded-card"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ht">Kreyòl Ayisyen</option>
              </select>
            </div>
          </Card>

          {/* Voice Selection */}
          <Card>
            <VoiceSelector
              settings={settings}
              onSettingsChange={setSettings}
            />
          </Card>

          {/* Family Management */}
          <Card>
            <FamilyEditor />
          </Card>

          {/* Animal Image Management */}
          <Card>
            <AnimalEditor />
          </Card>

          {/* Action GIF Management */}
          <Card>
            <ActionEditor />
          </Card>

          {/* Backup & Restore */}
          <Card>
            <BackupRestore />
          </Card>

          {/* Kid Lock */}
          <Card>
            <KidLockToggle
              kidLock={settings.kidLock}
              onKidLockChange={(kidLock) => {
                setSettings({ ...settings, kidLock })
              }}
            />
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button onClick={handleSaveSettings} size="lg">
              Save Settings
            </Button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

