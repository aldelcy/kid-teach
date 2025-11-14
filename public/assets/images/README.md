# Image Files Directory

This directory contains all image files for the KidTeach app.

## Directory Structure

```
public/assets/images/
├── alphabet/
│   ├── a/              # Letter A example images
│   ├── b/              # Letter B example images
│   ├── c/              # Letter C example images
│   ├── d/              # Letter D example images (future)
│   ├── ...             # Letters E-Z (future)
│   └── z/              # Letter Z example images (future)
├── animals/            # Animal images (shared across languages)
└── colors/             # Color example images (optional)
```

All letter directories (a-z) have been created to allow for future expansion.

## Required Images

### Alphabet Images (from alphabet.json)

#### English
- `alphabet/a/apple.jpg`
- `alphabet/a/ant.jpg`
- `alphabet/a/airplane.jpg`
- `alphabet/b/ball.jpg`
- `alphabet/b/banana.jpg`
- `alphabet/b/bear.jpg`
- `alphabet/c/cat.jpg`
- `alphabet/c/car.jpg`
- `alphabet/c/cake.jpg`

#### French
- `alphabet/a/pomme.jpg`
- `alphabet/a/fourmi.jpg`
- `alphabet/a/avion.jpg`
- `alphabet/b/balle.jpg`
- `alphabet/b/banane.jpg`
- `alphabet/b/ours.jpg`
- `alphabet/c/chat.jpg`
- `alphabet/c/voiture.jpg`
- `alphabet/c/gateau.jpg`

### Animal Images (from animals.json)

- `animals/cat.jpg`
- `animals/dog.jpg`
- `animals/cow.jpg`
- `animals/sheep.jpg`
- `animals/duck.jpg`
- `animals/lion.jpg`
- `animals/elephant.jpg`
- `animals/bird.jpg`
- `animals/fish.jpg`
- `animals/horse.jpg`

## File Format

- Format: JPG or PNG
- Recommended: Optimized for web, clear and kid-friendly
- Size: Reasonable file size for quick loading on tablets

## Notes

- Images are referenced via `/assets/images/...` paths in the content files
- The app will show placeholder icons if images are not found
- All images should be clear, colorful, and appropriate for toddlers

