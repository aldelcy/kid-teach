import { Howl } from 'howler'

interface AudioQueueItem {
  text?: string
  audioUrl?: string
  lang?: string
  onEnd?: () => void
}

class AudioController {
  private queue: AudioQueueItem[] = []
  private isProcessing = false
  private currentHowl: Howl | null = null
  private synth: SpeechSynthesis | null = null
  private isUnlocked = false
  private voices: SpeechSynthesisVoice[] = []
  private languageVoices: Map<string, SpeechSynthesisVoice | null> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis
      this.loadVoices()

      // Some browsers load voices asynchronously
      if (this.synth) {
        this.synth.onvoiceschanged = () => this.loadVoices()
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return

    this.voices = this.synth.getVoices()

    // Map languages to voices
    this.languageVoices.set('en', this.findVoice('en-US') || this.findVoice('en'))
    this.languageVoices.set('fr', this.findVoice('fr-FR') || this.findVoice('fr'))
    this.languageVoices.set('ht', this.findVoice('fr-FR') || this.findVoice('fr')) // Fallback to French for Haitian Creole
  }

  private findVoice(langPrefix: string): SpeechSynthesisVoice | null {
    return this.voices.find(voice => voice.lang.startsWith(langPrefix)) || null
  }

  unlock(): void {
    this.isUnlocked = true
    // Create a silent audio context to unlock on iOS
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        gain.gain.value = 0
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(0)
        osc.stop(0.01)
      } catch (error) {
        console.warn('Failed to unlock audio context:', error)
      }
    }
    // Save preference to localStorage so it persists across reloads
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioUnlocked', 'true')
      localStorage.removeItem('audioDisabled')
    }
  }

  lock(): void {
    this.isUnlocked = false
    this.cancel()
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioDisabled', 'true')
      localStorage.setItem('audioUnlocked', 'false')
    }
  }

  isAudioUnlocked(): boolean {
    return this.isUnlocked
  }

  async speak(text: string, lang: string = 'en', audioUrl?: string, onEnd?: () => void): Promise<void> {
    // Check if audio was explicitly disabled
    if (typeof window !== 'undefined' && localStorage.getItem('audioDisabled') === 'true') {
      console.warn('Audio is disabled. Enable it in settings or click an audio button.')
      return
    }

    // Auto-unlock on first speak call (user interaction required for browser audio)
    // This allows audio to work immediately without annoying unlock prompts
    if (!this.isUnlocked) {
      this.unlock()
    }

    // Cancel any current speech
    this.cancel()

    // Priority: pre-recorded audio > TTS
    if (audioUrl) {
      try {
        await this.playAudio(audioUrl, onEnd)
        return
      } catch (error) {
        console.warn('Failed to play audio, falling back to TTS', error)
      }
    }

    // Fallback to TTS
    this.speakTTS(text, lang, onEnd)
  }

  private async playAudio(audioPath: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      // Howler.js can handle both local paths and URLs
      // Local paths should start with / and be relative to public folder
      // URLs should start with http:// or https://
      const howl = new Howl({
        src: [audioPath],
        html5: false, // Use Web Audio API when possible for better performance
        preload: true,
        onend: () => {
          this.currentHowl = null
          if (onEnd) onEnd()
          resolve()
          this.processQueue()
        },
        onloaderror: (id, error) => {
          console.warn('Audio load error:', audioPath, error)
          this.currentHowl = null
          reject(error)
        },
        onplayerror: (id, error) => {
          console.warn('Audio play error:', audioPath, error)
          this.currentHowl = null
          reject(error)
        },
      })

      this.currentHowl = howl
      howl.play()
    })
  }

  private speakTTS(text: string, lang: string, onEnd?: () => void): void {
    if (!this.synth) {
      console.warn('SpeechSynthesis not available')
      if (onEnd) onEnd()
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'fr-FR'

    const voice = this.languageVoices.get(lang)
    if (voice) {
      utterance.voice = voice
    }

    utterance.onend = () => {
      if (onEnd) onEnd()
      this.processQueue()
    }

    utterance.onerror = (error) => {
      console.error('TTS error:', error)
      if (onEnd) onEnd()
      this.processQueue()
    }

    this.synth.speak(utterance)
  }

  cancel(): void {
    if (this.currentHowl) {
      this.currentHowl.stop()
      this.currentHowl = null
    }
    if (this.synth) {
      this.synth.cancel()
    }
    this.queue = []
    this.isProcessing = false
  }

  private processQueue(): void {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true
    const item = this.queue.shift()
    if (!item) {
      this.isProcessing = false
      return
    }

    if (item.text && item.lang) {
      this.speak(item.text, item.lang, item.audioUrl, () => {
        this.isProcessing = false
        if (item.onEnd) item.onEnd()
        this.processQueue()
      })
    } else if (item.audioUrl) {
      this.playAudio(item.audioUrl, () => {
        this.isProcessing = false
        if (item.onEnd) item.onEnd()
        this.processQueue()
      })
    }
  }
}

// Singleton instance
export const audioController = new AudioController()

