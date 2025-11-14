'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'
import { AudioButton } from '@/components/ui/AudioButton'
import { Card } from '@/components/ui/Card'
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

export default function FamilyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n } = useTranslation()
  const roleId = params.id as string
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const roles = familyData[currentLang]?.roles || familyDataEn.roles
  const [familyMembers, setFamilyMembers] = React.useState<FamilyMember[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadFamily()
  }, [])

  const loadFamily = async () => {
    const members = await dbClient.getFamily()
    setFamilyMembers(members)
    setLoading(false)
  }

  // Find the family member or use default role
  const member = familyMembers.find(m => m.id === roleId)
  const defaultRole = roles.find((r: any) => r.id === roleId)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
        <AppFooter />
      </div>
    )
  }

  if (!defaultRole && !member) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Family member not found</h1>
            <button
              onClick={() => router.push('/family')}
              className="px-6 py-3 bg-primary-500 text-white rounded-card font-bold hover:bg-primary-600 transition-colors"
            >
              Back to Family
            </button>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  // Get label (prioritize member's custom label, then default role label)
  const label = member
    ? member.labels[currentLang] || member.labels.en || defaultRole?.label || roleId
    : defaultRole?.label || roleId

  // Get photo (member's photo if available, otherwise placeholder)
  const photo = member?.photo

  // Get audio URL from audio index using role ID
  const audioUrl = audioIndex.getFamilyAudio(currentLang, roleId)

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            {/* Large Photo */}
            <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] bg-gray-100 rounded-full mb-8 mx-auto flex items-center justify-center overflow-hidden">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={label} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12rem] md:text-[16rem] lg:text-[20rem]">👤</span>
              )}
            </div>

            {/* Label */}
            <h1 className="text-5xl md:text-6xl font-bold mb-8">{label}</h1>

            {/* Audio Button */}
            <div className="max-w-md mx-auto">
              <AudioButton
                text={label}
                audioUrl={audioUrl}
                lang={currentLang}
                size="lg"
                fullWidth
              />
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

