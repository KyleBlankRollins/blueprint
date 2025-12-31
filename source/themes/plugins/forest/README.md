# Forest Theme Plugin

Custom theme plugin for Blueprint.

## Overview

This plugin provides light and dark theme variants with a custom primary color.

## Primary Color

- **Hex:** #16a34a
- **OKLCH:** oklch(0.63 0.17 149)

## Theme Variants

### forest-light

Light theme variant optimized for daylight viewing.

### forest-dark

Dark theme variant optimized for low-light viewing.

## Usage

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import primitivesPlugin from '@blueprint/themes/plugins/primitives';
import blueprintCorePlugin from '@blueprint/themes/plugins/blueprint-core';
import forestPlugin from '@blueprint/themes/plugins/forest';

const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCorePlugin)
  .use(forestPlugin);

const theme = builder.build();
```

## Generated Files

After running `npm run theme:generate`, the following CSS files will be created:

- `source/themes/generated/forest/forest-light.css`
- `source/themes/generated/forest/forest-dark.css`

## Metadata

- **Plugin ID:** forest
- **Version:** 1.0.0
- **Dependencies:** primitives, blueprint-core

## Customization

You can customize this theme by editing `index.ts`:

1. Adjust the primary color's OKLCH values
2. Add additional colors with `builder.addColor()`
3. Modify semantic token mappings
4. Create additional theme variants
