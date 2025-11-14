# Audio Files Directory

This directory contains all audio files for the KidTeach app.

## Directory Structure

```
public/assets/audio/
├── letters/
│   ├── en/              # English letter pronunciations
│   │   └── words/       # English word pronunciations (optional)
│   ├── fr/              # French letter pronunciations
│   │   └── words/       # French word pronunciations (optional)
│   └── ht/              # Haitian Creole letter pronunciations (future)
│       └── words/       # Haitian Creole word pronunciations (future)
├── animals/
│   ├── en/              # English animal sounds
│   ├── fr/              # French animal sounds
│   └── ht/              # Haitian Creole animal sounds (future)
└── colors/
    ├── en/              # English color pronunciations
    ├── fr/              # French color pronunciations
    └── ht/              # Haitian Creole color pronunciations (future)
```

## Required Audio Files

### Letters (from audio-index.json)

#### English (en)
- `a.mp3` - Letter A pronunciation
- `b.mp3` - Letter B pronunciation
- `c.mp3` - Letter C pronunciation

#### French (fr)
- `a.mp3` - Lettre A pronunciation
- `b.mp3` - Lettre B pronunciation
- `c.mp3` - Lettre C pronunciation

### Animals (from audio-index.json)

#### English (en)
- `cat.mp3` - Cat sound
- `dog.mp3` - Dog sound
- `duck.mp3` - Duck sound

#### French (fr)
- `chat.mp3` - Chat sound
- `chien.mp3` - Chien sound
- `canard.mp3` - Canard sound

### Colors (from audio-index.json)

#### English (en)
- `red.mp3` - Red pronunciation
- `blue.mp3` - Blue pronunciation

#### French (fr)
- `rouge.mp3` - Rouge pronunciation
- `bleu.mp3` - Bleu pronunciation

## Additional Audio Files Needed

Based on the content files, you may also want to add:

### Alphabet Word Audio (Optional)
- English: `apple.mp3`, `ant.mp3`, `airplane.mp3`, `ball.mp3`, `banana.mp3`, `bear.mp3`, `cat.mp3`, `car.mp3`, `cake.mp3`
- French: `pomme.mp3`, `fourmi.mp3`, `avion.mp3`, `balle.mp3`, `banane.mp3`, `ours.mp3`, `chat.mp3`, `voiture.mp3`, `gateau.mp3`

### Additional Animals (from animals.json)
- English: `cow.mp3`, `sheep.mp3`, `lion.mp3`, `elephant.mp3`, `bird.mp3`, `fish.mp3`, `horse.mp3`
- French: `vache.mp3`, `mouton.mp3`, `lion.mp3`, `elephant.mp3`, `oiseau.mp3`, `poisson.mp3`, `cheval.mp3`

### Additional Colors (from colors.json)
- English: `green.mp3`, `yellow.mp3`, `orange.mp3`, `purple.mp3`, `pink.mp3`, `black.mp3`, `white.mp3`, `brown.mp3`
- French: `vert.mp3`, `jaune.mp3`, `orange.mp3`, `violet.mp3`, `rose.mp3`, `noir.mp3`, `blanc.mp3`, `marron.mp3`

## File Format

- Format: MP3
- Recommended: 44.1kHz, 128kbps, mono
- Keep files small for quick loading on tablets

## Adding Audio Files

1. Place audio files in the appropriate directory
2. Update `content/audio/audio-index.json` with new file paths
3. Ensure file names match the keys in the audio-index.json

## Notes

- Audio files are referenced via `/assets/audio/...` paths in the audio-index.json
- The app will fall back to Text-to-Speech (TTS) if audio files are not found
- All audio should be clear and kid-friendly

