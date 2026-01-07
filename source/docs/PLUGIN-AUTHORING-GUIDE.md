# Theme Plugin Authoring Guide

Complete guide to creating custom theme plugins for Blueprint's design system.

Blueprint's theme system uses a plugin-based architecture that allows you to:

- **Create reusable themes** as standalone modules
- **Define custom color palettes** with automatic scale generation
- **Build theme variants** (light, dark, high contrast, etc.)
- **Type-safe development** with full IDE autocomplete
- **Validate automatically** against WCAG accessibility standards
- **Distribute independently** via npm, git, or local files

## Quick Start

### Create Your First Plugin

The fastest way to create a plugin is using the CLI:

```bash
bp theme plugin create
```

This will prompt you for:

- **Plugin ID** - Unique identifier (e.g., `ocean`)
- **Display name** - Human-readable name (e.g., `Ocean Theme`)
- **Author** - Your name or organization
- **Description** - What makes this theme unique
- **Primary color** - Base color for your theme

The CLI will generate a complete plugin structure:

```
source/themes/plugins/ocean/
├── index.ts          # Plugin code
└── README.md         # Documentation
```

### Manual Creation

You can also create a plugin manually:

```typescript
import type { ThemePlugin } from '../../core/types.js';

export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',
  name: 'Ocean Theme',
  author: 'Your Name',
  description: 'A calming ocean-inspired color palette',

  register(builder) {
    // Add colors and theme variants here
  },
};

export default oceanTheme;
```

## Plugin Structure

### Required Fields

Every plugin must have:

```typescript
{
  id: string;           // Unique identifier (kebab-case)
  version: string;      // Semver version (e.g., '1.0.0')
  register(builder) {}  // Registration function
}
```

### Optional Metadata

Enhance discoverability with metadata:

```typescript
{
  name: 'Ocean Theme',
  description: 'A calming ocean-inspired color palette',
  author: 'Your Name <email@example.com>',
  license: 'MIT',
  homepage: 'https://github.com/yourname/ocean-theme',
  tags: ['blue', 'ocean', 'calming', 'professional'],
}
```

### Plugin Dependencies

Declare dependencies on other plugins:

```typescript
{
  dependencies: [
    { id: 'blueprint-core', version: '^1.0.0' },
    { id: 'primitives', optional: true }
  ],
  peerPlugins: ['dark-mode-enhancer']
}
```

## Defining Colors

### Basic Color Definition

Colors are defined using the OKLCH color space:

```typescript
register(builder) {
  builder.addColor('oceanBlue', {
    source: { l: 0.5, c: 0.15, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });
}
```

**OKLCH Parameters:**

- `l` (lightness): 0 = black, 1 = white
- `c` (chroma): 0 = grayscale, 0.4 = highly saturated
- `h` (hue): 0-360 degrees (0 = red, 120 = green, 240 = blue)

### Understanding the Color Scale

The scale array defines which color steps to generate:

```typescript
scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
```

This creates:

- `oceanBlue50` - Lightest
- `oceanBlue100` - Very light
- `oceanBlue200` - Light
- ...
- `oceanBlue500` - Base color (your source color)
- ...
- `oceanBlue900` - Very dark
- `oceanBlue950` - Darkest

### Color Metadata

Add metadata for documentation:

```typescript
builder.addColor('oceanBlue', {
  source: { l: 0.5, c: 0.15, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  metadata: {
    name: 'Ocean Blue',
    description: 'Primary blue inspired by deep ocean waters',
    tags: ['primary', 'ocean', 'blue'],
  },
});
```

### Multiple Colors

Add as many colors as needed:

```typescript
register(builder) {
  // Primary brand color
  builder.addColor('oceanBlue', {
    source: { l: 0.5, c: 0.15, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });

  // Accent color
  builder.addColor('coral', {
    source: { l: 0.6, c: 0.18, h: 30 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });

  // Neutral color
  builder.addColor('slate', {
    source: { l: 0.5, c: 0.02, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });
}
```

## Creating Theme Variants

### Semantic Tokens

Theme variants map semantic tokens to your colors:

```typescript
register(builder) {
  builder.addColor('oceanBlue', {
    source: { l: 0.5, c: 0.15, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });

  builder.addThemeVariant('ocean-light', {
    // Backgrounds
    background: builder.colors.white,
    surface: builder.colors.oceanBlue50,
    surfaceElevated: builder.colors.white,
    surfaceSubdued: builder.colors.oceanBlue100,

    // Text
    text: builder.colors.oceanBlue900,
    textMuted: builder.colors.oceanBlue600,
    textInverse: builder.colors.white,

    // Primary brand
    primary: builder.colors.oceanBlue600,
    primaryHover: builder.colors.oceanBlue700,
    primaryActive: builder.colors.oceanBlue800,

    // Semantic states
    success: builder.colors.green600,
    warning: builder.colors.yellow600,
    error: builder.colors.red600,
    info: builder.colors.oceanBlue500,

    // UI elements
    border: builder.colors.oceanBlue200,
    borderStrong: builder.colors.oceanBlue300,
    focus: builder.colors.oceanBlue500,
  });
}
```

### Dark Mode Variant

Create a complementary dark variant:

```typescript
builder.addThemeVariant('ocean-dark', {
  // Backgrounds (inverted)
  background: builder.colors.oceanBlue950,
  surface: builder.colors.oceanBlue900,
  surfaceElevated: builder.colors.oceanBlue800,
  surfaceSubdued: builder.colors.black,

  // Text (inverted)
  text: builder.colors.oceanBlue50,
  textMuted: builder.colors.oceanBlue400,
  textInverse: builder.colors.oceanBlue900,

  // Primary brand (lighter for dark bg)
  primary: builder.colors.oceanBlue400,
  primaryHover: builder.colors.oceanBlue300,
  primaryActive: builder.colors.oceanBlue200,

  // Semantic states (lighter for dark bg)
  success: builder.colors.green400,
  warning: builder.colors.yellow400,
  error: builder.colors.red400,
  info: builder.colors.oceanBlue400,

  // UI elements
  border: builder.colors.oceanBlue700,
  borderStrong: builder.colors.oceanBlue600,
  focus: builder.colors.oceanBlue400,
});
```

### Extending Existing Variants

Extend a variant instead of rewriting everything:

```typescript
register(builder) {
  // First, create or ensure base variant exists
  builder.addThemeVariant('ocean-light', { /* ... */ });

  // Extend it with overrides
  builder.extendThemeVariant('ocean-light', 'ocean-high-contrast', {
    // Only override specific tokens
    text: builder.colors.black,
    primary: builder.colors.oceanBlue700,
    border: builder.colors.oceanBlue400,
  });
}
```

## Type Safety

### Autocomplete Support

The builder's color registry is fully typed:

```typescript
register(builder) {
  builder.addColor('oceanBlue', { /* ... */ });

  // TypeScript knows about all color steps:
  builder.colors.oceanBlue50;   // ✅ Valid
  builder.colors.oceanBlue500;  // ✅ Valid
  builder.colors.oceanBlue1000; // ❌ TypeScript error
  builder.colors.notDefined;    // ❌ TypeScript error
}
```

### Generated Type Declarations

Run type generation for enhanced autocomplete:

```bash
bp theme generate-types
```

This creates `source/themes/generated/theme.d.ts` with all available colors.

## Semantic Tokens Reference

All theme variants must provide a complete set of **semantic tokens**. These tokens define the visual language of your theme and ensure compatibility with all Blueprint components.

### Required Semantic Tokens (32 Total)

#### Background & Surface Colors (4 tokens)

```typescript
{
  background: string,        // Main background color
  surface: string,           // Card/panel backgrounds
  surfaceElevated: string,   // Elevated surfaces (modals, popovers)
  surfaceSubdued: string,    // Subtle backgrounds (disabled states)
}
```

#### Text Colors (4 tokens)

```typescript
{
  text: string,              // Primary text color
  textStrong: string,        // Emphasized text (headings, labels)
  textMuted: string,         // Secondary text (captions, help text)
  textInverse: string,       // Text on colored backgrounds
}
```

#### Primary Brand Colors (3 tokens)

```typescript
{
  primary: string,           // Primary brand color (buttons, links)
  primaryHover: string,      // Hover state
  primaryActive: string,     // Active/pressed state
}
```

#### Semantic State Colors (4 tokens)

```typescript
{
  success: string,           // Success states (green)
  warning: string,           // Warning states (yellow/orange)
  error: string,             // Error states (red)
  info: string,              // Informational states (blue)
}
```

#### UI Element Colors (4 tokens)

```typescript
{
  border: string,            // Default borders
  borderStrong: string,      // Emphasized borders
  borderWidth: string,       // Border width (e.g., '1px')
  focus: string,             // Focus ring color
}
```

#### Typography Tokens (3 tokens)

```typescript
{
  fontFamily: string,        // Main font stack
  fontFamilyMono: string,    // Monospace font for code
  fontFamilyHeading: string, // Heading font (can match fontFamily)
}
```

**Font Guidelines:**

- Use system font stacks for best performance
- Ensure fonts work at 16px base size (Blueprint's default)
- Include fallbacks: `'MyFont, -apple-system, sans-serif'`
- For monospace: `'"SF Mono", "Courier New", monospace'`

#### Border Radius Tokens (3 tokens)

```typescript
{
  borderRadius: string,      // Default radius (e.g., '4px')
  borderRadiusLarge: string, // Large radius (e.g., '8px')
  borderRadiusFull: string,  // Full rounded (e.g., '9999px')
}
```

Border radius affects theme personality:

- **Sharp** (`0px`): Modern, technical
- **Subtle** (`2-4px`): Professional, balanced
- **Rounded** (`8-12px`): Friendly, approachable
- **Pill-shaped** (`9999px`): Playful, modern

#### Shadow Tokens (4 tokens)

```typescript
{
  shadowSm: string,          // Subtle shadow
  shadowMd: string,          // Default shadow
  shadowLg: string,          // Elevated shadow
  shadowXl: string,          // Floating shadow
}
```

Example shadows:

```typescript
shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
```

### Complete Theme Variant Example

Here's a complete theme variant with all 32 required tokens:

```typescript
builder.addThemeVariant('complete-light', {
  // Background & Surface (4)
  background: 'oklch(0.98 0.01 90)',
  surface: 'oklch(1.00 0 0)',
  surfaceElevated: 'oklch(1.00 0 0)',
  surfaceSubdued: 'oklch(0.95 0.01 90)',

  // Text (4)
  text: 'oklch(0.20 0.01 240)',
  textStrong: 'oklch(0.10 0.01 240)',
  textMuted: 'oklch(0.50 0.01 240)',
  textInverse: 'oklch(1.00 0 0)',

  // Primary Brand (3)
  primary: 'oklch(0.45 0.15 250)',
  primaryHover: 'oklch(0.40 0.15 250)',
  primaryActive: 'oklch(0.35 0.15 250)',

  // Semantic States (4)
  success: 'oklch(0.50 0.13 145)',
  warning: 'oklch(0.60 0.13 65)',
  error: 'oklch(0.50 0.15 25)',
  info: 'oklch(0.45 0.15 250)',

  // UI Elements (4)
  border: 'oklch(0.85 0.01 240)',
  borderStrong: 'oklch(0.70 0.01 240)',
  borderWidth: '1px',
  focus: 'oklch(0.45 0.15 250)',

  // Typography (3)
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"SF Mono", Monaco, "Cascadia Code", monospace',
  fontFamilyHeading:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // Border Radius (3)
  borderRadius: '4px',
  borderRadiusLarge: '8px',
  borderRadiusFull: '9999px',

  // Shadows (4)
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg:
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl:
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
});
```

### Direct OKLCH Values vs Color References

You can use either direct OKLCH strings OR ColorRef objects:

```typescript
// Option 1: Direct OKLCH strings (recommended for simplicity)
builder.addThemeVariant('my-theme', {
  background: 'oklch(1 0 0)', // Direct OKLCH
  primary: 'oklch(0.5 0.15 250)', // Direct OKLCH
  // ... other tokens
});

// Option 2: ColorRef objects (if you need color scales)
builder.addColor('blue', {
  source: { l: 0.5, c: 0.15, h: 250 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
});

builder.addThemeVariant('my-theme', {
  background: builder.colors.white, // ColorRef
  primary: builder.colors.blue500, // ColorRef
  // ... other tokens
});
```

**Note:** The CSS output will contain semantic tokens ONLY. Color scales (like `blue.500`) are internal to the theme plugin and won't appear in generated CSS. This ensures all themes are interchangeable.

### Type-Safe Color References

All color references are validated at compile time:

```typescript
builder.addThemeVariant('my-theme', {
  primary: builder.colors.oceanBlue600, // ✅ Type-safe
  // primary: 'oceanBlue.600',           // ❌ Don't use strings
  // primary: builder.colors.typo600,    // ❌ TypeScript error
});
```

## Validation

### Automatic Validation

Plugins are automatically validated:

```typescript
// Checks performed:
// ✅ Required fields present (id, version, register)
// ✅ Valid semver version
// ✅ No duplicate plugin IDs
// ✅ Dependencies exist
// ✅ Color references are valid
// ✅ OKLCH values in valid ranges
// ✅ All semantic tokens defined
```

### Custom Validation

Add custom validation logic:

```typescript
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  register(builder) {
    // ... register colors and variants
  },

  validate(config) {
    const errors = [];

    // Custom validation rules
    if (!config.colors.oceanBlue) {
      errors.push({
        plugin: 'ocean',
        type: 'missing_color',
        message: 'Ocean theme requires oceanBlue color',
      });
    }

    return errors;
  },
};
```

### WCAG Accessibility Validation

The system automatically checks WCAG contrast ratios:

```typescript
// Automatically validated:
// - Text/background contrast ≥ 4.5:1 (WCAG AA)
// - UI elements contrast ≥ 3.0:1 (WCAG AA)
// - Focus indicators contrast ≥ 3.0:1 (WCAG AA)
```

Validation errors will show which tokens fail:

```
❌ ocean-light.text/background contrast too low: 3.2:1 (required: 4.5:1)
❌ ocean-dark.border/background contrast too low: 2.1:1 (required: 3.0:1)
```

### Validate Your Plugin

Test your plugin before using it:

```bash
bp theme plugin validate ocean
```

## Lifecycle Hooks

### beforeBuild Hook

Run code before theme is built:

```typescript
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  register(builder) {
    // ... register colors and variants
  },

  beforeBuild(config) {
    console.log('Building ocean theme...');
    console.log(`Colors: ${Object.keys(config.colors).length}`);
    console.log(`Variants: ${Object.keys(config.themes).length}`);
  },
};
```

### afterBuild Hook

Run code after theme is built:

```typescript
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  register(builder) {
    // ... register colors and variants
  },

  afterBuild(config) {
    console.log('✅ Ocean theme built successfully');

    // Log generated CSS file locations
    console.log(`CSS files: ${Object.keys(config.themes).length}`);
  },
};
```

## Using Your Plugin

### Register in Config

Add your plugin to `theme.config.ts`:

```typescript
import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import blueprintCore from '../plugins/blueprint-core/index.js';
import oceanTheme from '../plugins/ocean/index.js';

const builder = new ThemeBuilder().use(blueprintCore).use(oceanTheme);

export const theme = builder.build();
```

### Build CSS

Generate CSS from your plugin:

```bash
npm run build
```

Your theme variants will be generated as CSS files:

```
source/themes/generated/ocean/
├── ocean-light.css
└── ocean-dark.css
```

### Use in Components

Apply your theme in HTML:

```html
<body data-theme="ocean-light">
  <button class="bp-button">Ocean Button</button>
</body>
```

Switch themes dynamically:

```javascript
document.body.dataset.theme = 'ocean-dark';
```

## Best Practices

### 1. Use Semantic Color Names

**Good:**

```typescript
builder.addColor('oceanBlue', {
  /* ... */
});
builder.addColor('coral', {
  /* ... */
});
```

**Avoid:**

```typescript
builder.addColor('color1', {
  /* ... */
});
builder.addColor('brandBlue', {
  /* ... */
}); // Too generic
```

### 2. Always Provide Both Light and Dark

Users expect both variants:

```typescript
register(builder) {
  // Define colors once
  builder.addColor('oceanBlue', { /* ... */ });

  // Create both variants
  builder.addThemeVariant('ocean-light', { /* ... */ });
  builder.addThemeVariant('ocean-dark', { /* ... */ });
}
```

### 3. Test Contrast Ratios

Use the validation system:

```bash
bp theme plugin validate ocean
```

Or test manually:

```typescript
import { validateThemeAccessibility } from '../builder/validation.js';

const errors = validateThemeAccessibility(config);
if (errors.length > 0) {
  console.error('Contrast violations:', errors);
}
```

### 4. Document Your Colors

Add helpful metadata:

```typescript
builder.addColor('oceanBlue', {
  source: { l: 0.5, c: 0.15, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  metadata: {
    name: 'Ocean Blue',
    description: 'Primary brand color inspired by deep ocean waters',
    tags: ['primary', 'ocean', 'blue', 'brand'],
  },
});
```

### 5. Use Consistent Naming

Follow a consistent pattern:

```typescript
// Plugin ID
id: 'ocean';

// Theme variants
('ocean-light');
('ocean-dark');
('ocean-high-contrast');

// Color names
('oceanBlue');
('oceanTeal');
('oceanNavy');
```

### 6. Leverage Dependencies

Don't reinvent the wheel:

```typescript
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  // Depend on shared colors
  dependencies: [
    { id: 'blueprint-core' }, // Provides gray, white, black, etc.
  ],

  register(builder) {
    // Add only your unique colors
    builder.addColor('oceanBlue', {
      /* ... */
    });

    // Use colors from dependencies
    builder.addThemeVariant('ocean-light', {
      background: builder.colors.white, // From blueprint-core
      text: builder.colors.gray900, // From blueprint-core
      primary: builder.colors.oceanBlue600, // Your color
    });
  },
};
```

### 7. Version Your Plugin

Follow semantic versioning:

- **Patch** (1.0.1): Bug fixes, minor tweaks
- **Minor** (1.1.0): New colors, new variants, backwards compatible
- **Major** (2.0.0): Breaking changes, removed colors/variants

### 8. Include README

Document your plugin:

````markdown
# Ocean Theme

A calming ocean-inspired color palette.

## Colors

- `oceanBlue` - Deep ocean blue
- `coral` - Warm coral accent

## Variants

- `ocean-light` - Light mode
- `ocean-dark` - Dark mode

## Installation

```typescript
import oceanTheme from './plugins/ocean/index.js';
builder.use(oceanTheme);
```
````

## Examples

### Minimal Plugin

Smallest possible plugin:

```typescript
import type { ThemePlugin } from '../../core/types.js';

export const minimalTheme: ThemePlugin = {
  id: 'minimal',
  version: '1.0.0',

  register(builder) {
    builder.addThemeVariant('minimal', {
      background: builder.colors.white,
      surface: builder.colors.gray50,
      surfaceElevated: builder.colors.white,
      surfaceSubdued: builder.colors.gray100,
      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.white,
      primary: builder.colors.blue600,
      primaryHover: builder.colors.blue700,
      primaryActive: builder.colors.blue800,
      success: builder.colors.green600,
      warning: builder.colors.yellow600,
      error: builder.colors.red600,
      info: builder.colors.blue500,
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.blue500,
    });
  },
};
```

### Multi-Color Plugin

Plugin with multiple custom colors:

```typescript
import type { ThemePlugin } from '../../core/types.js';

export const forestTheme: ThemePlugin = {
  id: 'forest',
  version: '1.0.0',
  name: 'Forest Theme',
  description: 'Nature-inspired greens and earth tones',

  register(builder) {
    // Primary green
    builder.addColor('forestGreen', {
      source: { l: 0.45, c: 0.12, h: 140 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // Accent brown
    builder.addColor('earthBrown', {
      source: { l: 0.4, c: 0.08, h: 40 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // Light variant
    builder.addThemeVariant('forest-light', {
      background: builder.colors.white,
      surface: builder.colors.forestGreen50,
      surfaceElevated: builder.colors.white,
      surfaceSubdued: builder.colors.forestGreen100,
      text: builder.colors.forestGreen900,
      textMuted: builder.colors.forestGreen600,
      textInverse: builder.colors.white,
      primary: builder.colors.forestGreen600,
      primaryHover: builder.colors.forestGreen700,
      primaryActive: builder.colors.forestGreen800,
      success: builder.colors.forestGreen600,
      warning: builder.colors.earthBrown500,
      error: builder.colors.red600,
      info: builder.colors.blue500,
      border: builder.colors.forestGreen200,
      borderStrong: builder.colors.forestGreen300,
      focus: builder.colors.forestGreen500,
    });

    // Dark variant
    builder.addThemeVariant('forest-dark', {
      background: builder.colors.forestGreen950,
      surface: builder.colors.forestGreen900,
      surfaceElevated: builder.colors.forestGreen800,
      surfaceSubdued: builder.colors.black,
      text: builder.colors.forestGreen50,
      textMuted: builder.colors.forestGreen400,
      textInverse: builder.colors.forestGreen900,
      primary: builder.colors.forestGreen400,
      primaryHover: builder.colors.forestGreen300,
      primaryActive: builder.colors.forestGreen200,
      success: builder.colors.forestGreen400,
      warning: builder.colors.earthBrown400,
      error: builder.colors.red400,
      info: builder.colors.blue400,
      border: builder.colors.forestGreen700,
      borderStrong: builder.colors.forestGreen600,
      focus: builder.colors.forestGreen400,
    });
  },
};

export default forestTheme;
```

### Plugin with Dependencies

Plugin that extends another:

```typescript
import type { ThemePlugin } from '../../core/types.js';

export const oceanProTheme: ThemePlugin = {
  id: 'ocean-pro',
  version: '1.0.0',
  name: 'Ocean Pro Theme',
  description: 'Professional variant of Ocean theme with enhanced contrast',

  dependencies: [{ id: 'ocean', version: '^1.0.0' }],

  register(builder) {
    // Extend ocean-light with higher contrast
    builder.extendThemeVariant('ocean-light', 'ocean-pro', {
      text: builder.colors.black,
      primary: builder.colors.oceanBlue700,
      border: builder.colors.oceanBlue400,
    });
  },
};

export default oceanProTheme;
```

### Plugin with Validation

Plugin with custom validation:

```typescript
import type { ThemePlugin } from '../../core/types.js';

export const brandTheme: ThemePlugin = {
  id: 'brand',
  version: '1.0.0',

  register(builder) {
    builder.addColor('brandPrimary', {
      source: { l: 0.5, c: 0.2, h: 280 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    builder.addThemeVariant('brand', {
      /* ... */
    });
  },

  validate(config) {
    const errors = [];

    // Ensure brand color exists
    if (!config.colors.brandPrimary) {
      errors.push({
        plugin: 'brand',
        type: 'missing_color',
        message: 'Brand theme requires brandPrimary color',
      });
    }

    // Ensure brand variant exists
    if (!config.themes.brand) {
      errors.push({
        plugin: 'brand',
        type: 'invalid_ref',
        message: 'Brand theme variant not registered',
      });
    }

    return errors;
  },
};
```

## CLI Commands

### Create a Plugin

```bash
# Interactive creation
bp theme plugin create

# With options
bp theme plugin create --id ocean --color "#0ea5e9"
```

### List Plugins

```bash
bp theme plugin list
```

Output:

```
Installed Theme Plugins:
  blueprint-core@1.0.0 - Blueprint's core design system theme
  ocean@1.0.0 - A calming ocean-inspired color palette
  forest@1.0.0 - Nature-inspired greens and earth tones
```

### Validate a Plugin

```bash
bp theme plugin validate ocean
```

### Show Plugin Info

```bash
bp theme plugin info ocean
```

Output:

```
Ocean Theme (ocean@1.0.0)
Description: A calming ocean-inspired color palette
Author: Your Name
License: MIT

Colors: oceanBlue, coral
Variants: ocean-light, ocean-dark
Dependencies: blueprint-core@^1.0.0
```

## Troubleshooting

### Plugin Not Found

If your plugin isn't being loaded:

1. Check the plugin is imported in `theme.config.ts`:

   ```typescript
   import oceanTheme from '../plugins/ocean/index.js';
   ```

2. Verify the plugin is registered:

   ```typescript
   builder.use(oceanTheme);
   ```

3. Check for import errors in the console

### Type Errors

If you're getting TypeScript errors:

1. Regenerate types:

   ```bash
   bp theme generate-types
   ```

2. Restart your TypeScript server in VS Code:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type "TypeScript: Restart TS Server"

### Contrast Validation Failures

If WCAG contrast checks fail:

1. Run validation to see specific failures:

   ```bash
   bp theme plugin validate ocean
   ```

2. Adjust lightness values:
   - Light backgrounds need dark text (l: 0.1-0.3)
   - Dark backgrounds need light text (l: 0.9-1.0)
   - Borders need 3:1 contrast with background

3. Use the contrast checker:

   ```typescript
   import { getContrastRatio } from '../color/colorUtils.js';

   const ratio = getContrastRatio(
     { l: 0.1, c: 0, h: 0 }, // text
     { l: 1, c: 0, h: 0 } // background
   );
   console.log(`Contrast: ${ratio.toFixed(2)}:1`);
   ```

### Color Not Available

If a color isn't available in `builder.colors`:

1. Ensure the color is added before use:

   ```typescript
   builder.addColor('myColor', {
     /* ... */
   });
   // Now available: builder.colors.myColor50, etc.
   ```

2. Check the color name spelling

3. Verify the plugin dependency is loaded first

## Next Steps

- **[API Reference](./API-REFERENCE.md)** - Complete ThemeBuilder API documentation
- **[Best Practices](./BEST-PRACTICES.md)** - Advanced techniques and patterns
- **[Type Generation](./TYPE-GENERATION.md)** - Understanding type generation
- **[Example Plugins](../plugins/)** - Study existing plugins

## Resources

- [OKLCH Color Picker](https://oklch.com/) - Visual OKLCH color tool
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/) - Test contrast ratios
- [Blueprint Theme Plugins](../plugins/) - Built-in plugin examples
