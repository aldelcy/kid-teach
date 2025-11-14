'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { dbClient, FamilyMember } from '@/lib/db/IndexedDbClient'
import familyDataEn from '@/content/i18n/en/family.json'
import familyDataFr from '@/content/i18n/fr/family.json'
import familyDataHt from '@/content/i18n/ht/family.json'

const familyData = {
  en: familyDataEn,
  fr: familyDataFr,
  ht: familyDataHt,
}

export const FamilyEditor: React.FC = () => {
  const { i18n, t } = useTranslation('common')
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const roles = familyData[currentLang]?.roles || familyDataEn.roles
  const [familyMembers, setFamilyMembers] = React.useState<FamilyMember[]>([])
  const [editingMember, setEditingMember] = React.useState<FamilyMember | null>(null)

  React.useEffect(() => {
    loadFamily()
  }, [])

  const loadFamily = async () => {
    const members = await dbClient.getFamily()
    setFamilyMembers(members)
  }

  const handleAddPhoto = async (roleId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        const photo = e.target?.result as string
        const role = roles.find(r => r.id === roleId)
        const member: FamilyMember = {
          id: roleId,
          role: roleId,
          photo,
          labels: {
            en: familyDataEn.roles.find(r => r.id === roleId)?.label || roleId,
            fr: familyDataFr.roles.find(r => r.id === roleId)?.label || roleId,
            ht: familyDataHt.roles.find(r => r.id === roleId)?.label || roleId,
          },
        }
        await dbClient.addFamilyMember(member)
        await loadFamily()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const handleEditLabels = (member: FamilyMember) => {
    setEditingMember(member)
  }

  const handleSaveLabels = async () => {
    if (!editingMember) return
    await dbClient.addFamilyMember(editingMember)
    setEditingMember(null)
    await loadFamily()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('familyManagement')}</h2>
      <div className="space-y-4">
        {roles.map((role: any) => {
          const member = familyMembers.find(m => m.id === role.id)
          const isEditing = editingMember?.id === role.id

          return (
            <div key={role.id} className="border-2 border-gray-200 rounded-card p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {member?.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={role.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-2">{role.label}</div>
                  {isEditing && editingMember ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingMember.labels.en}
                        onChange={(e) => setEditingMember({ ...editingMember, labels: { ...editingMember.labels, en: e.target.value } })}
                        placeholder="English"
                        className="w-full px-2 py-1 border rounded"
                      />
                      <input
                        type="text"
                        value={editingMember.labels.fr}
                        onChange={(e) => setEditingMember({ ...editingMember, labels: { ...editingMember.labels, fr: e.target.value } })}
                        placeholder="Français"
                        className="w-full px-2 py-1 border rounded"
                      />
                      <input
                        type="text"
                        value={editingMember.labels.ht}
                        onChange={(e) => setEditingMember({ ...editingMember, labels: { ...editingMember.labels, ht: e.target.value } })}
                        placeholder="Kreyòl"
                        className="w-full px-2 py-1 border rounded"
                      />
                      <Button onClick={handleSaveLabels} size="sm">Save</Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>EN: {member?.labels.en || role.label}</div>
                      <div>FR: {member?.labels.fr || role.label}</div>
                      <div>HT: {member?.labels.ht || role.label}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => handleAddPhoto(role.id)} size="sm">
                    {member?.photo ? 'Change Photo' : 'Add Photo'}
                  </Button>
                  {member?.photo && (
                    <Button
                      onClick={async () => {
                        if (member) {
                          const updatedMember = { ...member, photo: undefined }
                          await dbClient.addFamilyMember(updatedMember)
                          await loadFamily()
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete Photo
                    </Button>
                  )}
                  <Button
                    onClick={() => handleEditLabels(member || {
                      id: role.id,
                      role: role.id,
                      labels: {
                        en: familyDataEn.roles.find(r => r.id === role.id)?.label || role.id,
                        fr: familyDataFr.roles.find(r => r.id === role.id)?.label || role.id,
                        ht: familyDataHt.roles.find(r => r.id === role.id)?.label || role.id,
                      },
                    })}
                    size="sm"
                    variant="outline"
                  >
                    Edit Labels
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

