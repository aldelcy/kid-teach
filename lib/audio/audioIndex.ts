import audioIndexData from '@/content/audio/audio-index.json'

export interface AudioIndex {
  letters: {
    [lang: string]: {
      [letter: string]: string
    }
  }
  animals: {
    [lang: string]: {
      [animal: string]: string
    }
  }
  colors: {
    [lang: string]: {
      [color: string]: string
    }
  }
  family: {
    [lang: string]: {
      [role: string]: string
    }
  }
}

/**
 * Utility to check if an audio path is a URL or a local path
 */
export function isAudioUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://')
}

/**
 * Utility to check if an audio path is a local file path
 */
export function isLocalPath(path: string): boolean {
  return path.startsWith('/') && !isAudioUrl(path)
}

/**
 * Resolves a local path to ensure it's correctly formatted for Next.js
 * Local paths should start with / and be relative to the public folder
 */
export function resolveLocalPath(path: string): string {
  if (isAudioUrl(path)) {
    return path // URLs are returned as-is
  }

  // Ensure local paths start with / and are relative to public folder
  if (path.startsWith('/assets/')) {
    return path // Already correctly formatted
  }

  // If path doesn't start with /, add it
  if (!path.startsWith('/')) {
    return `/${path}`
  }

  return path
}

class AudioIndexService {
  private index: AudioIndex = audioIndexData as AudioIndex

  getLetterAudio(lang: string, letter: string): string | undefined {
    const audioPath = this.index.letters[lang]?.[letter.toLowerCase()]
    if (!audioPath) return undefined

    // Resolve local paths, leave URLs as-is
    return resolveLocalPath(audioPath)
  }

  getAnimalAudio(lang: string, animal: string): string | undefined {
    const audioPath = this.index.animals[lang]?.[animal.toLowerCase()]
    if (!audioPath) return undefined

    // Resolve local paths, leave URLs as-is
    return resolveLocalPath(audioPath)
  }

  getColorAudio(lang: string, color: string): string | undefined {
    const audioPath = this.index.colors[lang]?.[color.toLowerCase()]
    if (!audioPath) return undefined

    // Resolve local paths, leave URLs as-is
    return resolveLocalPath(audioPath)
  }

  getFamilyAudio(lang: string, roleId: string): string | undefined {
    const audioPath = this.index.family[lang]?.[roleId.toLowerCase()]
    if (!audioPath) return undefined

    // Resolve local paths, leave URLs as-is
    return resolveLocalPath(audioPath)
  }

  // Helper to resolve audio key path (e.g., "letters.en.a" or "letters.en.a.word.apple")
  // For word-level audio keys, we currently only support letter-level audio
  resolveAudioKey(audioKey: string): string | undefined {
    if (!audioKey) return undefined

    const parts = audioKey.split('.')
    if (parts.length < 3) return undefined

    const category = parts[0] // "letters", "animals", "colors"
    const lang = parts[1] // "en", "fr", "ht"
    const item = parts[2] // "a", "cat", "red"

    try {
      let audioPath: string | undefined

      switch (category) {
        case 'letters':
          audioPath = this.getLetterAudio(lang, item)
          break
        case 'animals':
          audioPath = this.getAnimalAudio(lang, item)
          break
        case 'colors':
          audioPath = this.getColorAudio(lang, item)
          break
        case 'family':
          audioPath = this.getFamilyAudio(lang, item)
          break
        default:
          return undefined
      }

      // Resolve local paths, leave URLs as-is
      return audioPath ? resolveLocalPath(audioPath) : undefined
    } catch (error) {
      console.warn('Error resolving audio key:', audioKey, error)
      return undefined
    }
  }

  /**
   * Get all audio paths for a language and category
   */
  getAllAudioPaths(category: 'letters' | 'animals' | 'colors' | 'family', lang: string): string[] {
    const categoryData = this.index[category]?.[lang]
    if (!categoryData) return []

    return Object.values(categoryData).map(path => resolveLocalPath(path))
  }
}

export const audioIndex = new AudioIndexService()

