# Audio System Documentation

The audio system supports both **local audio files** and **remote URLs** seamlessly.

## Supported Audio Sources

### 1. Local Audio Files
- **Path Format**: `/assets/audio/{category}/{lang}/{filename}.mp3`
- **Example**: `/assets/audio/letters/en/alphasounds-a.mp3`
- **Location**: Files should be placed in `public/assets/audio/`
- **Advantages**:
  - Works offline (with PWA caching)
  - Faster loading
  - No external dependencies

### 2. Remote URLs
- **URL Format**: `https://example.com/path/to/audio.mp3` or `http://example.com/path/to/audio.mp3`
- **Example**: `https://audiocdn.frenchtoday.com/file/ft-public-files/audioclick/blog/alphabet/02.mp3`
- **Advantages**:
  - No need to host files locally
  - Can use external CDN services
  - Easier to update content

## Usage

### In `audio-index.json`

You can mix local paths and URLs in the same file:

```json
{
  "letters": {
    "en": {
      "a": "/assets/audio/letters/en/alphasounds-a.mp3",  // Local path
      "b": "/assets/audio/letters/en/alphasounds-b.mp3"   // Local path
    },
    "fr": {
      "a": "https://audiocdn.frenchtoday.com/file/ft-public-files/audioclick/blog/alphabet/02.mp3",  // URL
      "b": "https://audiocdn.frenchtoday.com/file/ft-public-files/audioclick/blog/alphabet/03.mp3"   // URL
    }
  }
}
```

### In Code

The audio system automatically detects and handles both formats:

```typescript
import { audioIndex } from '@/lib/audio/audioIndex'
import { audioController } from '@/lib/audio/AudioController'

// Get audio path (works for both local paths and URLs)
const audioPath = audioIndex.getLetterAudio('en', 'a')
// Returns: "/assets/audio/letters/en/alphasounds-a.mp3" (local)
// or: "https://example.com/audio.mp3" (URL)

// Play audio (automatically handles both formats)
await audioController.speak('A', 'en', audioPath)
```

## Path Resolution

The `audioIndex` service automatically resolves paths:

1. **Local paths** (starting with `/`):
   - Ensured to start with `/`
   - Assumed to be relative to `public/` folder
   - Example: `/assets/audio/letters/en/a.mp3`

2. **URLs** (starting with `http://` or `https://`):
   - Used as-is
   - No modification needed
   - Example: `https://example.com/audio.mp3`

## Audio Controller

The `AudioController` uses Howler.js, which supports both:
- Local paths (served from `public/` folder)
- Remote URLs (loaded via HTTP/HTTPS)

### Error Handling

If an audio file fails to load:
1. The error is logged to the console
2. The system automatically falls back to Text-to-Speech (TTS)
3. No user-facing error is displayed

## Best Practices

1. **Prefer local files** for:
   - Core content that rarely changes
   - Offline functionality
   - Better performance

2. **Use URLs for**:
   - External audio resources
   - Content that changes frequently
   - Large files you don't want to host

3. **Mix and match**:
   - Use local files for one language, URLs for another
   - Use local files for common content, URLs for rare content
   - Migrate from URLs to local files as needed

## Caching

- **Local files**: Cached by PWA service worker for offline access
- **Remote URLs**: Cached by browser and service worker (if configured)
- **TTS**: No caching (generated on-demand)

## Security

- **Local files**: Only accessible from your domain
- **Remote URLs**: Subject to CORS policies
- **TTS**: No security concerns (client-side generation)

## Performance

- **Local files**:
  - Faster initial load (served from same domain)
  - Better for offline use
  - Lower latency

- **Remote URLs**:
  - May be slower (network latency)
  - Depends on CDN performance
  - Requires internet connection

