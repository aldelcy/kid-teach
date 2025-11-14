# KidTeach - Tablet-First PWA for Toddlers

A **tablet-first Progressive Web App (PWA)** designed for toddlers to learn **Alphabet, Colors, Animals, Family Members, and Actions**. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎯 **Tablet-First Design**: Optimized for 12-inch iPad (1024×1366 CSS px baseline)
- 🌍 **Bilingual Support**: English + French fully implemented, Haitian Creole scaffolded
- 🔊 **Audio Support**: Pre-recorded audio + Web Speech API (TTS) fallback
- 📱 **Offline-First**: Works offline with service worker caching
- 🔒 **Privacy-First**: No tracking, no analytics, all data stored locally
- 👨‍👩‍👧 **Family Photos**: Parent-editable family member gallery
- ⚙️ **Parent Mode**: Gated settings with content management
- 🎨 **Kid-Friendly UI**: Large tap targets (≥48px), bright colors, high contrast

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** + **Radix UI** for primitives
- **Framer Motion** for animations
- **react-i18next** for internationalization
- **howler.js** for audio playback
- **localforage** (IndexedDB) for local storage
- **Service Worker** for PWA functionality

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Project Structure

```
kidTeach/
├── app/                    # Next.js App Router pages
│   ├── alphabet/          # Alphabet learning module
│   ├── colors/            # Colors learning module
│   ├── animals/           # Animals learning module
│   ├── family/            # Family members module
│   ├── actions/           # Actions/verbs module
│   ├── settings/          # Parent Mode settings
│   ├── offline/           # Offline page
│   └── privacy/           # Privacy policy
├── components/            # React components
│   ├── ui/                # UI primitives (Button, Card, etc.)
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── admin/             # Parent Mode components
│   └── providers/         # Context providers
├── content/               # Content files
│   └── i18n/              # Translation files (en, fr, ht)
├── lib/                   # Utilities and services
│   ├── audio/             # AudioController
│   ├── db/                # IndexedDB client
│   ├── i18n/              # i18n configuration
│   └── cloud/             # Cloud sync adapter (stub)
├── hooks/                 # React hooks
└── public/                # Static assets
    ├── manifest.json      # PWA manifest
    └── sw.js              # Service worker
```

## Adding a New Language

1. Create a new directory under `content/i18n/` (e.g., `content/i18n/ht/`)
2. Copy the JSON structure from an existing language (e.g., `en/`)
3. Translate all strings in the JSON files
4. Update `lib/i18n/config.ts` to include the new language imports
5. Add the language to the language switcher in `components/layout/LanguageSwitcher.tsx`
6. Test the language switching functionality

Example for Haitian Creole (already scaffolded):

```bash
# Files already created:
content/i18n/ht/common.json
content/i18n/ht/alphabet.json
content/i18n/ht/colors.json
content/i18n/ht/animals.json
content/i18n/ht/actions.json
content/i18n/ht/family.json
```

Just fill in the translations in each JSON file.

## Adding Family Photos

1. Open the app and navigate to **Settings**
2. Unlock **Parent Mode** (hold button for 2 seconds + math challenge)
3. Go to **Family Management** section
4. Click **Add Photo** for any family member
5. Select a photo from your device or take a new one
6. Photos are stored locally in IndexedDB

## Offline Behavior

- The service worker caches the app shell and static assets
- Seeded content (alphabet A-C, colors, animals, etc.) works offline
- Family photos and content edits are stored in IndexedDB
- The app shows an offline page when network is unavailable
- Cached content is served immediately, network requests are made in the background

## iPad Audio Quirks

- **First Gesture Requirement**: iOS Safari requires a user gesture to unlock audio
- **Audio Unlock Overlay**: On first run, a "Tap to Enable Sound" overlay appears
- **AudioController**: Handles audio unlock, TTS, and pre-recorded audio playback
- **Voice Selection**: Parent Mode allows selecting TTS voices per language

### How to Unlock Sound

1. On first run, tap the **"Tap to Enable Sound"** button
2. This unlocks the audio context and enables TTS
3. The unlock state is saved in localStorage
4. Subsequent visits won't show the overlay

## Cloud Sync Adapter (Future)

The app includes a `CloudSyncAdapter` interface in `lib/cloud/CloudSyncAdapter.ts` for future cloud synchronization. To implement:

1. Create a class implementing `CloudSyncAdapter`
2. Implement `push(snapshot: AppData)` to upload data
3. Implement `pull()` to download data
4. Add authentication/authorization as needed
5. Handle conflict resolution (last-write-wins, merge, etc.)
6. Update `components/admin/BackupRestore.tsx` to use the adapter

Example structure:

```typescript
class CloudSyncAdapterImpl implements CloudSyncAdapter {
  async push(snapshot: AppData): Promise<void> {
    // Upload to Firebase, AWS S3, your backend, etc.
  }

  async pull(): Promise<AppData | null> {
    // Download from cloud storage
  }
}
```

## PWA Installation

### iOS (Safari)

1. Open the app in Safari
2. Tap the **Share** button
3. Select **Add to Home Screen**
4. The app will appear on your home screen

### Android (Chrome)

1. Open the app in Chrome
2. Tap the **Menu** (three dots)
3. Select **Add to Home Screen** or **Install App**
4. The app will appear on your home screen

### Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Click the **Install** icon in the address bar
3. The app will install as a standalone app

## Parent Mode

Parent Mode provides administrative controls:

- **Language Settings**: Set default language and select TTS voices
- **Family Management**: Add/edit family photos and labels
- **Content Management**: Edit animals, actions, and other content
- **Backup & Restore**: Export/import app data as JSON
- **Kid Lock**: Hide settings and disable long-press menus

### Unlocking Parent Mode

1. Navigate to **Settings**
2. Hold the unlock button for 2 seconds
3. Solve a simple math problem (e.g., 5 + 3 = ?)
4. Parent Mode is unlocked for the session

## Content Structure

### Alphabet

- Grid of letters A-Z
- Detail view with letter, words, and images
- Pre-recorded audio for letters A-C
- TTS fallback for other letters

### Colors

- Palette grid (red, blue, green, yellow, orange, purple, pink, black, white, brown)
- Detail view with color swatch and example items
- Optional color mixing mini-game

### Animals

- Grid of 8-12 common animals
- Detail view with large image, name, sound, and fact
- Pre-recorded audio for some animals
- TTS fallback for others

### Family Members

- Parent-editable gallery of role cards
- Photos stored in IndexedDB
- Localized labels (en, fr, ht)
- Tap to hear role name

### Actions

- Grid of 8-10 verbs (clap, jump, sleep, eat, drink, run, hug, wave, read, dance)
- Tap to hear verb
- Optional motion hints (bounce, fade, pulse, etc.)

## Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Browser Support

- **iOS Safari**: 14+
- **Android Chrome**: 90+
- **Desktop Chrome**: 90+
- **Desktop Firefox**: 88+
- **Desktop Safari**: 14+
- **Desktop Edge**: 90+

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Audio with [howler.js](https://howlerjs.com/)
- i18n with [react-i18next](https://react.i18next.com/)

