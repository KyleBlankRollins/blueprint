# Primitives Plugin

Core color primitives shared by all Blueprint themes.

## Overview

This plugin provides essential achromatic colors that serve as the foundation for all theme variants. It's designed to be loaded before any other theme plugins.

## Colors

### White

Pure white with 100% lightness, zero chroma.

- **OKLCH:** `oklch(1.0 0 0)`
- **Use cases:** High contrast backgrounds, inverted text, clean surfaces
- **Accessibility:** Maximum contrast against dark colors

### Black

Pure black with 0% lightness, zero chroma.

- **OKLCH:** `oklch(0.0 0 0)`
- **Use cases:** Text, shadows, maximum contrast elements
- **Accessibility:** Maximum contrast against light colors

## Usage

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import primitivesPlugin from '@blueprint/themes/plugins/primitives';

const builder = new ThemeBuilder().use(primitivesPlugin);

// Access colors via builder.colors
const theme = builder.addThemeVariant('my-theme', {
  background: builder.colors.white500,
  text: builder.colors.black900,
  // ...
});
```

## Metadata

- **ID:** `primitives`
- **Version:** `1.0.0`
- **Author:** Blueprint Team
- **License:** MIT
- **Tags:** core, primitives, foundation

## Dependencies

None - this is a foundation plugin.

## Notes

- All themes should load this plugin first
- Provides achromatic colors only (no hue)
- Colors are generated using the standard 11-step scale
- Both colors have zero chroma for pure neutrals
