'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { dbClient, AnimalEdit } from '@/lib/db/IndexedDbClient'
import animalsDataEn from '@/content/i18n/en/animals.json'
import animalsDataFr from '@/content/i18n/fr/animals.json'
import animalsDataHt from '@/content/i18n/ht/animals.json'

const animalsData = {
  en: animalsDataEn,
  fr: animalsDataFr,
  ht: animalsDataHt,
}

export const AnimalEditor: React.FC = () => {
  const { i18n, t } = useTranslation('common')
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const animals = animalsData[currentLang]?.animals || animalsDataEn.animals
  const [contentEdits, setContentEdits] = React.useState<{ animals?: AnimalEdit[] }>({})
  const [editingAnimal, setEditingAnimal] = React.useState<string | null>(null)
  const [imageUrls, setImageUrls] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    loadContentEdits()
  }, [])

  const loadContentEdits = async () => {
    const edits = await dbClient.getContentEdits()
    setContentEdits(edits)
    // Initialize image URLs from edits
    const urls: Record<string, string> = {}
    edits.animals?.forEach(animal => {
      if (animal.imageUrl) {
        urls[animal.id] = animal.imageUrl
      }
    })
    setImageUrls(urls)
  }

  const handleSaveImageUrl = async (animalId: string) => {
    const imageUrl = imageUrls[animalId]?.trim()
    if (imageUrl) {
      await dbClient.updateAnimalEdit({ id: animalId, imageUrl })
    } else {
      await dbClient.removeAnimalEdit(animalId)
    }
    await loadContentEdits()
    setEditingAnimal(null)
  }

  const handleDeleteImageUrl = async (animalId: string) => {
    await dbClient.removeAnimalEdit(animalId)
    setImageUrls({ ...imageUrls, [animalId]: '' })
    await loadContentEdits()
  }

  const getAnimalEdit = (animalId: string): AnimalEdit | undefined => {
    return contentEdits.animals?.find(a => a.id === animalId)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Animal Images</h2>
      <p className="text-gray-600 mb-4">Add custom image URLs for animals. Leave empty to use default images.</p>
      <div className="space-y-4">
        {animals.map((animal: any) => {
          const animalEdit = getAnimalEdit(animal.id)
          const isEditing = editingAnimal === animal.id
          const currentImageUrl = imageUrls[animal.id] || animalEdit?.imageUrl || ''

          return (
            <div key={animal.id} className="border-2 border-gray-200 rounded-card p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-bold text-xl mb-2">{animal.name}</div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={currentImageUrl}
                        onChange={(e) => setImageUrls({ ...imageUrls, [animal.id]: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border-2 border-primary-500 rounded-card text-lg"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveImageUrl(animal.id)} size="sm">
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingAnimal(null)
                            setImageUrls({ ...imageUrls, [animal.id]: animalEdit?.imageUrl || '' })
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        {animalEdit?.imageUrl ? (
                          <span className="text-green-600">Custom URL: {animalEdit.imageUrl}</span>
                        ) : (
                          <span className="text-gray-400">Using default image</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingAnimal(animal.id)
                            setImageUrls({ ...imageUrls, [animal.id]: animalEdit?.imageUrl || '' })
                          }}
                          size="sm"
                          variant="outline"
                        >
                          {animalEdit?.imageUrl ? 'Edit URL' : 'Add URL'}
                        </Button>
                        {animalEdit?.imageUrl && (
                          <Button
                            onClick={() => handleDeleteImageUrl(animal.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete URL
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

