# Blueprint Core Plugin

The default Blueprint theme with light and dark variants.

## Overview

Blueprint Core is the standard theme for all Blueprint projects. It provides a carefully crafted color palette with semantic meaning and two complete theme variants optimized for both light and dark viewing environments.

## Features

- **5 core semantic colors:** gray, blue, green, red, yellow
- **Light theme variant** optimized for day viewing
- **Dark theme variant** with adjusted colors for night viewing
- **WCAG-conscious** color choices (though enforcement is opt-in)
- **Type-safe** color references via ThemeBuilder

## Colors

### Gray (Neutral)

Neutral gray scale for text, borders, and backgrounds.

- **OKLCH:** `oklch(0.55 0.02 240)`
- **Use cases:** Text, borders, backgrounds, disabled states
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Blue (Primary Brand)

Primary brand color for interactive elements and primary actions.

- **OKLCH:** `oklch(0.55 0.15 240)`
- **Use cases:** Buttons, links, focus states, primary actions
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Green (Success)

Success and positive state color for confirmations and success messages.

- **OKLCH:** `oklch(0.55 0.13 145)`
- **Use cases:** Success messages, confirmations, positive indicators
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Red (Error)

Error and destructive state color for errors and warnings.

- **OKLCH:** `oklch(0.55 0.15 25)`
- **Use cases:** Error messages, destructive actions, alerts
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Yellow (Warning)

Warning and caution state color for important information.

- **OKLCH:** `oklch(0.65 0.13 85)`
- **Use cases:** Warning messages, caution states, important info
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Theme Variants

### Light Theme

Optimized for daylight viewing with high contrast text on light backgrounds.

**Key tokens:**

- `background`: gray.50 (very light background)
- `text`: gray.900 (nearly black text)
- `primary`: blue.500 (medium blue for actions)
- `surface`: gray.100 (card/panel backgrounds)

### Dark Theme

Optimized for low-light viewing with reduced eye strain.

**Key tokens:**

- `background`: gray.950 (nearly black background)
- `text`: gray.50 (very light text)
- `primary`: blue.500 (same blue, adjusted visually by context)
- `surface`: gray.900 (card/panel backgrounds)

**Dark mode adjustments:**

- Lighter color steps for semantic colors (400 instead of 500)
- Higher contrast borders
- Inverted text hierarchy

## Usage

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import primitivesPlugin from '@blueprint/themes/plugins/primitives';
import blueprintCorePlugin from '@blueprint/themes/plugins/blueprint-core';

const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCorePlugin);

const theme = builder.build();

// Generated theme includes:
// - All color scales (gray, blue, green, red, yellow)
// - Light theme variant
// - Dark theme variant
// - Type-safe color references
```

## Dependencies

- `primitives` - Requires white and black primitive colors

## Validation

The plugin includes validation rules to ensure:

- All required colors are defined (gray, blue, green, red, yellow)
- Both theme variants exist (light, dark)
- Color references resolve correctly

## Metadata

- **ID:** `blueprint-core`
- **Version:** `1.0.0`
- **Author:** Blueprint Team
- **License:** MIT
- **Tags:** core, theme, light, dark

## Extending

You can extend Blueprint Core to create custom themes:

```typescript
import blueprintCorePlugin from '@blueprint/themes/plugins/blueprint-core';

const myCustomPlugin: ThemePlugin = {
  id: 'my-custom-theme',
  version: '1.0.0',
  dependencies: [{ id: 'blueprint-core' }],

  register(builder) {
    // Add custom colors
    builder.addColor('purple', {
      source: { l: 0.55, c: 0.15, h: 280 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // Extend light theme
    builder.extendThemeVariant('light', 'my-light', {
      primary: builder.colors.purple500,
    });
  },
};
```

## Accessibility

Blueprint Core uses perceptually uniform OKLCH colors for consistent brightness and contrast. While WCAG enforcement is currently opt-in, the color choices are designed with accessibility in mind:

- High contrast text colors (gray.900 on gray.50 in light mode)
- Sufficient color difference between semantic states
- Focus indicators with good contrast
- Warning colors darkened for better contrast (yellow.600 vs yellow.500)
