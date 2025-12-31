# Wada Sanzo Color Palette Plugin

Historical accent colors from Japanese artist Wada Sanzo's "A Dictionary of Color Combinations."

## Overview

This plugin brings the timeless color harmonies of Wada Sanzo (1883-1967), a Japanese artist and dyer, to modern web design. The colors are derived from his seminal work "A Dictionary of Color Combinations," originally published in the 1930s.

Wada Sanzo's color combinations have stood the test of time, offering sophisticated and harmonious palettes that work beautifully in both light and dark themes.

## Historical Context

**Wada Sanzo (1883-1967)** was a Japanese artist, costume and kimono designer, and professor at the Tokyo School of Fine Arts. His "Dictionary of Color Combinations" (色の組み合わせ辞典) was first published in the 1930s and contained 348 color combination patterns.

The book has been republished multiple times and remains influential in design, fashion, and art worldwide.

## Colors

### Sulphur Yellow

A soft, muted yellow with low chroma - gentle and sophisticated.

- **OKLCH:** `oklch(0.941 0.0554 91.42)`
- **Character:** Soft, warm, approachable
- **Use cases:** Background tints, subtle accents, warm neutrals
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Yellow Orange

A warm, earthy orange with medium chroma - vibrant but not overwhelming.

- **OKLCH:** `oklch(0.7777 0.1684 64.45)`
- **Character:** Warm, energetic, earthy
- **Use cases:** Call-to-action buttons, warnings, highlights
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Vanderpoel Blue

A deep, sophisticated blue with subtle chroma - named after color theorist Emily Vanderpoel.

- **OKLCH:** `oklch(0.4025 0.0836 233.38)`
- **Character:** Deep, trustworthy, sophisticated
- **Use cases:** Primary actions, links, professional interfaces
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Theme Variants

### Wada Light

A warm, inviting light theme using Sulphur Yellow backgrounds and Vanderpoel Blue for primary actions.

**Key characteristics:**

- Warm background with subtle yellow tint
- Deep blue for interactive elements
- Earthy orange for warnings
- Professional yet approachable

**Key tokens:**

- `background`: sulphurYellow.50
- `primary`: vandarPoelBlue.500
- `warning`: yellowOrange.600

### Wada Dark

A sophisticated dark theme with warm text tints and adjusted blues for night viewing.

**Key characteristics:**

- Dark neutral backgrounds
- Warm text with Sulphur Yellow tint
- Lighter blues for better visibility
- Reduced eye strain

**Key tokens:**

- `background`: gray.950
- `text`: sulphurYellow.50 (warm white)
- `primary`: vandarPoelBlue.400 (lighter for dark mode)

## Usage

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import primitivesPlugin from '@blueprint/themes/plugins/primitives';
import blueprintCorePlugin from '@blueprint/themes/plugins/blueprint-core';
import wadaSanzoPlugin from '@blueprint/themes/plugins/wada-sanzo';

const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCorePlugin)
  .use(wadaSanzoPlugin);

const theme = builder.build();

// Generated theme includes:
// - All Wada Sanzo accent colors
// - wada-light theme variant
// - wada-dark theme variant
// - Type-safe color references
```

## Using as Accent Colors

You can also use Wada Sanzo colors as accents in your own theme:

```typescript
const myPlugin: ThemePlugin = {
  id: 'my-theme',
  version: '1.0.0',
  dependencies: [{ id: 'wada-sanzo' }],

  register(builder) {
    builder.addThemeVariant('my-custom', {
      background: builder.colors.white500,
      primary: builder.colors.vandarPoelBlue500,
      warning: builder.colors.yellowOrange500,
      // Mix with Blueprint core colors
      success: builder.colors.green500,
      error: builder.colors.red500,
      // ...
    });
  },
};
```

## Dependencies

- `primitives` - Requires white and black primitive colors
- `blueprint-core` - Uses Blueprint's gray scale and semantic colors

## Validation

The plugin includes validation rules to ensure:

- All Wada Sanzo colors are defined (sulphurYellow, yellowOrange, vandarPoelBlue)
- Both theme variants exist (wada-light, wada-dark)
- Color references resolve correctly

## Metadata

- **ID:** `wada-sanzo`
- **Version:** `1.0.0`
- **Author:** Blueprint Team
- **License:** MIT
- **Tags:** accent, historical, wada-sanzo, japanese

## References

- [A Dictionary of Color Combinations](https://www.dictionaryofcolorcom binations.com/) - Modern republication
- [Wada Sanzo on Wikipedia](https://en.wikipedia.org/wiki/Sanzo_Wada)
- Original work: 配色総鑑 (Haishoku Sōkan / A Dictionary of Color Combinations)

## Design Philosophy

Wada Sanzo's color combinations emphasize:

- **Harmony over contrast** - Colors that work together naturally
- **Subtlety over vibrancy** - Sophisticated, muted tones
- **Cultural depth** - Connections to Japanese aesthetics and nature
- **Timelessness** - Colors that remain relevant across decades

These principles make Wada Sanzo's palette perfect for professional interfaces, editorial designs, and products that value sophistication and restraint.
