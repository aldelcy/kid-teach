import localforage from 'localforage'

export interface FamilyMember {
  id: string
  role: string
  photo?: string // Data URL
  labels: {
    en: string
    fr: string
    ht: string
  }
}

export interface AnimalEdit {
  id: string
  imageUrl?: string // Custom image URL
}

export interface ActionEdit {
  id: string
  gifUrl?: string // Custom GIF URL
}

export interface ContentEdits {
  animals?: AnimalEdit[]
  actions?: ActionEdit[]
  [key: string]: any
}

export interface AppData {
  family: FamilyMember[]
  contentEdits: ContentEdits
  settings: {
    defaultLanguage: string
    voices: {
      en?: string
      fr?: string
      ht?: string
    }
    kidLock: boolean
  }
}

class IndexedDbClient {
  private db: LocalForage

  constructor() {
    this.db = localforage.createInstance({
      name: 'kidTeach',
      storeName: 'kidTeachStore',
      description: 'KidTeach app data storage',
    })
  }

  async getFamily(): Promise<FamilyMember[]> {
    const family = await this.db.getItem<FamilyMember[]>('family')
    return family || []
  }

  async saveFamily(family: FamilyMember[]): Promise<void> {
    await this.db.setItem('family', family)
  }

  async addFamilyMember(member: FamilyMember): Promise<void> {
    const family = await this.getFamily()
    const existingIndex = family.findIndex(m => m.id === member.id)
    if (existingIndex >= 0) {
      family[existingIndex] = member
    } else {
      family.push(member)
    }
    await this.saveFamily(family)
  }

  async removeFamilyMember(id: string): Promise<void> {
    const family = await this.getFamily()
    const filtered = family.filter(m => m.id !== id)
    await this.saveFamily(filtered)
  }

  async getContentEdits(): Promise<ContentEdits> {
    const edits = await this.db.getItem<ContentEdits>('contentEdits')
    return edits || {}
  }

  async saveContentEdits(edits: ContentEdits): Promise<void> {
    await this.db.setItem('contentEdits', edits)
  }

  async updateAnimalEdit(animalEdit: AnimalEdit): Promise<void> {
    const edits = await this.getContentEdits()
    const animals = edits.animals || []
    const existingIndex = animals.findIndex(a => a.id === animalEdit.id)
    if (existingIndex >= 0) {
      animals[existingIndex] = animalEdit
    } else {
      animals.push(animalEdit)
    }
    await this.saveContentEdits({ ...edits, animals })
  }

  async updateActionEdit(actionEdit: ActionEdit): Promise<void> {
    const edits = await this.getContentEdits()
    const actions = edits.actions || []
    const existingIndex = actions.findIndex(a => a.id === actionEdit.id)
    if (existingIndex >= 0) {
      actions[existingIndex] = actionEdit
    } else {
      actions.push(actionEdit)
    }
    await this.saveContentEdits({ ...edits, actions })
  }

  async removeAnimalEdit(animalId: string): Promise<void> {
    const edits = await this.getContentEdits()
    const animals = (edits.animals || []).filter(a => a.id !== animalId)
    await this.saveContentEdits({ ...edits, animals })
  }

  async removeActionEdit(actionId: string): Promise<void> {
    const edits = await this.getContentEdits()
    const actions = (edits.actions || []).filter(a => a.id !== actionId)
    await this.saveContentEdits({ ...edits, actions })
  }

  async getSettings(): Promise<AppData['settings']> {
    const settings = await this.db.getItem<AppData['settings']>('settings')
    return settings || {
      defaultLanguage: 'fr',
      voices: {},
      kidLock: false,
    }
  }

  async saveSettings(settings: AppData['settings']): Promise<void> {
    await this.db.setItem('settings', settings)
  }

  async exportData(): Promise<AppData> {
    const [family, contentEdits, settings] = await Promise.all([
      this.getFamily(),
      this.getContentEdits(),
      this.getSettings(),
    ])

    return {
      family,
      contentEdits,
      settings,
    }
  }

  async importData(data: AppData): Promise<void> {
    if (data.family) {
      await this.saveFamily(data.family)
    }
    if (data.contentEdits) {
      await this.saveContentEdits(data.contentEdits)
    }
    if (data.settings) {
      await this.saveSettings(data.settings)
    }
  }

  async clearAll(): Promise<void> {
    await this.db.clear()
  }
}

export const dbClient = new IndexedDbClient()

