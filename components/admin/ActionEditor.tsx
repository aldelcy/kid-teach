'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { dbClient, ActionEdit } from '@/lib/db/IndexedDbClient'
import actionsDataEn from '@/content/i18n/en/actions.json'
import actionsDataFr from '@/content/i18n/fr/actions.json'
import actionsDataHt from '@/content/i18n/ht/actions.json'

const actionsData = {
  en: actionsDataEn,
  fr: actionsDataFr,
  ht: actionsDataHt,
}

export const ActionEditor: React.FC = () => {
  const { i18n, t } = useTranslation('common')
  const currentLang = i18n.language as 'en' | 'fr' | 'ht'
  const actions = actionsData[currentLang]?.actions || actionsDataEn.actions
  const [contentEdits, setContentEdits] = React.useState<{ actions?: ActionEdit[] }>({})
  const [editingAction, setEditingAction] = React.useState<string | null>(null)
  const [gifUrls, setGifUrls] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    loadContentEdits()
  }, [])

  const loadContentEdits = async () => {
    const edits = await dbClient.getContentEdits()
    setContentEdits(edits)
    // Initialize GIF URLs from edits
    const urls: Record<string, string> = {}
    edits.actions?.forEach(action => {
      if (action.gifUrl) {
        urls[action.id] = action.gifUrl
      }
    })
    setGifUrls(urls)
  }

  const handleSaveGifUrl = async (actionId: string) => {
    const gifUrl = gifUrls[actionId]?.trim()
    if (gifUrl) {
      await dbClient.updateActionEdit({ id: actionId, gifUrl })
    } else {
      await dbClient.removeActionEdit(actionId)
    }
    await loadContentEdits()
    setEditingAction(null)
  }

  const handleDeleteGifUrl = async (actionId: string) => {
    await dbClient.removeActionEdit(actionId)
    setGifUrls({ ...gifUrls, [actionId]: '' })
    await loadContentEdits()
  }

  const getActionEdit = (actionId: string): ActionEdit | undefined => {
    return contentEdits.actions?.find(a => a.id === actionId)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Action GIFs</h2>
      <p className="text-gray-600 mb-4">Add custom GIF URLs for actions. Leave empty to use default display.</p>
      <div className="space-y-4">
        {actions.map((action: any) => {
          const actionEdit = getActionEdit(action.id)
          const isEditing = editingAction === action.id
          const currentGifUrl = gifUrls[action.id] || actionEdit?.gifUrl || ''

          return (
            <div key={action.id} className="border-2 border-gray-200 rounded-card p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-bold text-xl mb-2">{action.verb}</div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={currentGifUrl}
                        onChange={(e) => setGifUrls({ ...gifUrls, [action.id]: e.target.value })}
                        placeholder="https://example.com/action.gif"
                        className="w-full px-3 py-2 border-2 border-primary-500 rounded-card text-lg"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveGifUrl(action.id)} size="sm">
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingAction(null)
                            setGifUrls({ ...gifUrls, [action.id]: actionEdit?.gifUrl || '' })
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
                        {actionEdit?.gifUrl ? (
                          <span className="text-green-600">Custom GIF URL: {actionEdit.gifUrl}</span>
                        ) : (
                          <span className="text-gray-400">Using default display</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingAction(action.id)
                            setGifUrls({ ...gifUrls, [action.id]: actionEdit?.gifUrl || '' })
                          }}
                          size="sm"
                          variant="outline"
                        >
                          {actionEdit?.gifUrl ? 'Edit GIF URL' : 'Add GIF URL'}
                        </Button>
                        {actionEdit?.gifUrl && (
                          <Button
                            onClick={() => handleDeleteGifUrl(action.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete GIF URL
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

