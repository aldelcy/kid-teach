'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { Card } from '@/components/ui/Card'
import { AudioButton } from '@/components/ui/AudioButton'
import { audioIndex } from '@/lib/audio/audioIndex'
import { dbClient, FamilyMember } from '@/lib/db/IndexedDbClient'
import familyDataEn from '@/content/i18n/en/family.json'
import familyDataFr from '@/content/i18n/fr/family.json'
import familyDataHt from '@/content/i18n/ht/family.json'

const familyData = {
  en: familyDataEn,
  fr: familyDataFr,
  ht: familyDataHt,
}

export default function FamilyPage() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const roles = familyData[currentLang]?.roles || familyDataEn.roles
  const [familyMembers, setFamilyMembers] = React.useState<FamilyMember[]>([])

  React.useEffect(() => {
    loadFamily()
  }, [])

  const loadFamily = async () => {
    const members = await dbClient.getFamily()
    setFamilyMembers(members)
  }

  const getMemberLabel = (roleId: string): string => {
    const member = familyMembers.find(m => m.id === roleId)
    if (member) {
      return member.labels[currentLang] || member.labels.en || roleId
    }
    const role = roles.find((r: any) => r.id === roleId)
    return (role as any)?.label || roleId
  }

  const getMemberPhoto = (roleId: string): string | undefined => {
    const member = familyMembers.find(m => m.id === roleId)
    return member?.photo
  }

  const handleCardClick = (roleId: string) => {
    router.push(`/family/${roleId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Family</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {roles.map((role: any) => {
            const photo = getMemberPhoto(role.id)
            const label = getMemberLabel(role.id)
            // Get audio URL from audio index using role ID
            const audioUrl = audioIndex.getFamilyAudio(currentLang, role.id)

            return (
              <Card
                key={role.id}
                className="text-center p-6 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleCardClick(role.id)}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl md:text-8xl">👤</span>
                  )}
                </div>
                <div className="text-xl font-bold mb-4">{label}</div>
                <div onClick={(e) => e.stopPropagation()}>
                  <AudioButton
                    text={label}
                    audioUrl={audioUrl}
                    lang={currentLang}
                    size="lg"
                    fullWidth
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

