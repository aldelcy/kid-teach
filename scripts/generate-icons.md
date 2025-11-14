# Icon Generation Instructions

The PWA manifest requires icon files at `/public/icon-192.png` and `/public/icon-512.png`.

## Option 1: Use an Online Tool

1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload a square image (at least 512x512px)
3. Generate the icons
4. Download and place them in `/public/`:
   - `icon-192.png` (192x192px)
   - `icon-512.png` (512x512px)

## Option 2: Create with Image Editor

1. Create a square image (512x512px) with your app logo/icon
2. Use an image editor (Photoshop, GIMP, Figma, etc.) to:
   - Resize to 192x192px → save as `icon-192.png`
   - Resize to 512x512px → save as `icon-512.png`
3. Place both files in `/public/`

## Option 3: Use a Simple SVG (Temporary)

For development, you can create a simple SVG icon:

1. Create `/public/icon.svg` with a simple design
2. Convert to PNG using an online tool or ImageMagick:
   ```bash
   # Using ImageMagick (if installed)
   convert -background none -resize 192x192 icon.svg icon-192.png
   convert -background none -resize 512x512 icon.svg icon-512.png
   ```

## Icon Requirements

- **Format**: PNG
- **Sizes**: 192x192px and 512x512px
- **Purpose**: "any maskable" (can be used as maskable icon)
- **Background**: Transparent or solid color
- **Design**: Simple, recognizable, kid-friendly

## Temporary Placeholder

Until proper icons are created, the app will work but may show a default icon in the browser/OS.

