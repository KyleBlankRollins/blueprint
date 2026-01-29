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

## Typography

Blueprint Core bundles the **Figtree** variable font for self-hosted typography. Figtree is a friendly geometric sans-serif designed by Erik Kennedy, available under the SIL Open Font License.

### Bundled Font

- **Font:** Figtree Variable (300-900 weight range)
- **Format:** TTF (truetype)
- **Size:** ~62KB
- **License:** SIL OFL 1.1

### Font Stack

```css
/* Primary font family */
font-family: Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace font family */
font-family: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
```

### How It Works

When you run `npm run theme:generate`, the CLI:
1. Collects font assets declared in `getAssets()`
2. Generates a `fonts.css` file with `@font-face` declarations
3. Copies font files to `generated/blueprint-core/assets/fonts/`
4. Imports `fonts.css` in the main `index.css`

The generated `fonts.css`:

```css
@font-face {
  font-family: 'Figtree';
  src: url('./assets/fonts/Figtree-VariableFont_wght.ttf') format('truetype');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
```

## Architecture

Blueprint Core extends `ThemeBase`, which provides:

- **Default design tokens** - Spacing, typography, motion, radius, opacity, breakpoints, focus, accessibility, zIndex
- **Customizable per-theme** - Override any tokens in child classes
- **Deep merge support** - Partial overrides without duplicating entire token groups

This theme uses all default design tokens from ThemeBase without overrides.

## Usage

### Basic Usage

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import { blueprintCoreTheme } from '@blueprint/themes/plugins/blueprint-core';

const theme = ThemeBuilder.withDefaults().build();

// Generated theme includes:
// - All color scales (gray, blue, green, red, yellow)
// - Light and dark theme variants
// - Design tokens (spacing, typography, motion, etc.)
// - Type-safe color references
```

### Custom Builder

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import { blueprintCoreTheme } from '@blueprint/themes/plugins/blueprint-core';

const builder = new ThemeBuilder().use(blueprintCoreTheme);

const theme = builder.build();
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

Create custom themes by extending ThemeBase:

```typescript
import { ThemeBase } from '@blueprint/themes/builder';
import type { ThemeBuilder } from '@blueprint/themes/builder';

export class MyCustomTheme extends ThemeBase {
  id = 'my-custom';
  version = '1.0.0';
  name = 'My Custom Theme';
  description = 'Custom theme based on Blueprint';
  author = 'Your Name';
  license = 'MIT';
  tags = ['custom'];

  // Override design tokens (optional)
  protected spacing = {
    base: 8, // Larger base spacing
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
  };

  register(builder: ThemeBuilder) {
    // Add custom purple color
    builder.addColor('purple', {
      source: { l: 0.55, c: 0.15, h: 280 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Purple',
        description: 'Custom brand color',
        tags: ['brand', 'primary'],
      },
    });

    // Define custom theme variant
    builder.addThemeVariant('custom-light', {
      background: builder.colors.gray50,
      text: builder.colors.gray900,
      primary: builder.colors.purple500,
      success: builder.colors.green500,
      error: builder.colors.red500,
      warning: builder.colors.yellow600,
    });
  }
}

export const myCustomTheme = new MyCustomTheme();

// Use in ThemeBuilder
const theme = new ThemeBuilder().use(myCustomTheme).build();
```

## Accessibility

Blueprint Core uses perceptually uniform OKLCH colors for consistent brightness and contrast. While WCAG enforcement is currently opt-in, the color choices are designed with accessibility in mind:

- High contrast text colors (gray.900 on gray.50 in light mode)
- Sufficient color difference between semantic states
- Focus indicators with good contrast
- Warning colors darkened for better contrast (yellow.600 vs yellow.500)
