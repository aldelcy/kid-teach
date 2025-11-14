import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enCommon from '@/content/i18n/en/common.json'
import enAlphabet from '@/content/i18n/en/alphabet.json'
import enColors from '@/content/i18n/en/colors.json'
import enAnimals from '@/content/i18n/en/animals.json'
import enActions from '@/content/i18n/en/actions.json'
import enFamily from '@/content/i18n/en/family.json'

import frCommon from '@/content/i18n/fr/common.json'
import frAlphabet from '@/content/i18n/fr/alphabet.json'
import frColors from '@/content/i18n/fr/colors.json'
import frAnimals from '@/content/i18n/fr/animals.json'
import frActions from '@/content/i18n/fr/actions.json'
import frFamily from '@/content/i18n/fr/family.json'

import htCommon from '@/content/i18n/ht/common.json'
import htAlphabet from '@/content/i18n/ht/alphabet.json'
import htColors from '@/content/i18n/ht/colors.json'
import htAnimals from '@/content/i18n/ht/animals.json'
import htActions from '@/content/i18n/ht/actions.json'
import htFamily from '@/content/i18n/ht/family.json'

const resources = {
  en: {
    common: enCommon,
    alphabet: enAlphabet,
    colors: enColors,
    animals: enAnimals,
    actions: enActions,
    family: enFamily,
  },
  fr: {
    common: frCommon,
    alphabet: frAlphabet,
    colors: frColors,
    animals: frAnimals,
    actions: frActions,
    family: frFamily,
  },
  ht: {
    common: htCommon,
    alphabet: htAlphabet,
    colors: htColors,
    animals: htAnimals,
    actions: htActions,
    family: htFamily,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr', // French as default
    defaultNS: 'common',
    ns: ['common', 'alphabet', 'colors', 'animals', 'actions', 'family'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

