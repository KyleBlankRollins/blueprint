# Theme Plugin Best Practices

Advanced patterns and recommendations for creating high-quality theme plugins.

## Table of Contents

- [Design Token Strategy](#design-token-strategy)
- [Color Design](#color-design)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Naming Conventions](#naming-conventions)
- [Plugin Architecture](#plugin-architecture)
- [Testing](#testing)
- [Documentation](#documentation)
- [Distribution](#distribution)
- [Maintenance](#maintenance)
- [Common Pitfalls](#common-pitfalls)

---

## Design Token Strategy

Understanding when to use semantic tokens vs universal tokens is crucial for theme authoring and component development.

### Semantic Tokens (Theme-Specific)

**Definition:** Tokens that vary between themes and define the visual personality.

**Provided by:** Theme plugins (via `addThemeVariant()`)

**Used in:** Component styles that should adapt to different themes

**Examples:**

- `--bp-color-background` - Main background color
- `--bp-color-primary` - Brand color
- `--bp-font-family` - Typography stack
- `--bp-border-radius` - Border roundness
- `--bp-shadow-md` - Shadow style

**When to use in components:**

```css
/* ✅ Good - Adapts to theme */
.my-component {
  background: var(--bp-color-surface);
  color: var(--bp-color-text);
  font-family: var(--bp-font-family);
  border-radius: var(--bp-border-radius);
}
```

**Complete list of semantic tokens:** See [Semantic Tokens Reference](./plugin-authoring-guide.md#semantic-tokens-reference) in the Plugin Authoring Guide.

### Universal Tokens (Infrastructure)

**Definition:** Tokens that remain consistent across all themes, providing structural foundation.

**Provided by:** `utilities.css` (generated once)

**Used in:** Component spacing, sizing, and structural properties

**Categories:**

- **Spacing scale**: `--bp-spacing-{0-12}`, `--bp-spacing-{xs,sm,md,lg,xl,2xl}`
- **Font sizes**: `--bp-font-size-{xs,sm,base,lg,xl,2xl,3xl,4xl}`
- **Font weights**: `--bp-font-weight-{light,normal,medium,semibold,bold}`
- **Line heights**: `--bp-line-height-{tight,normal,relaxed,loose}`
- **Motion/timing**: `--bp-transition-{fast,base,slow}`
- **Z-index**: `--bp-z-{dropdown,modal,tooltip}`
- **Breakpoints**: `--bp-breakpoint-{sm,md,lg,xl}`
- **Focus indicators**: `--bp-focus-{width,offset,style}`

**When to use in components:**

```css
/* ✅ Good - Structural properties */
.my-component {
  padding: var(--bp-spacing-md);
  gap: var(--bp-spacing-sm);
  font-size: var(--bp-font-size-base);
  line-height: var(--bp-line-height-normal);
  transition: var(--bp-transition-fast);
}
```

### Decision Matrix

| Property         | Token Type | Example                   | Rationale                |
| ---------------- | ---------- | ------------------------- | ------------------------ |
| Background color | Semantic   | `--bp-color-background`   | Varies per theme         |
| Text color       | Semantic   | `--bp-color-text`         | Varies per theme         |
| Border color     | Semantic   | `--bp-color-border`       | Varies per theme         |
| Font family      | Semantic   | `--bp-font-family`        | Theme personality        |
| Border radius    | Semantic   | `--bp-border-radius`      | Theme personality        |
| Shadows          | Semantic   | `--bp-shadow-md`          | Theme depth style        |
| Padding          | Universal  | `--bp-spacing-md`         | Structural consistency   |
| Font size        | Universal  | `--bp-font-size-base`     | Hierarchical consistency |
| Line height      | Universal  | `--bp-line-height-normal` | Typographic rhythm       |
| Transitions      | Universal  | `--bp-transition-fast`    | Motion consistency       |

### For Theme Authors

**Your responsibility:** Provide all 32 required semantic tokens in every theme variant.

```typescript
builder.addThemeVariant('my-theme', {
  // All 32 required tokens must be provided
  // See complete list in plugin-authoring-guide.md
  background: 'oklch(1 0 0)',
  surface: 'oklch(0.98 0 0)',
  // ... 30 more tokens
});
```

**Never override universal tokens** - They ensure consistent spacing, sizing, and structure across all themes.

### For Component Authors

**Use semantic tokens for:**

- Colors (background, text, border, etc.)
- Typography (font-family, heading fonts)
- Visual style (border-radius, shadows)

**Use universal tokens for:**

- Spacing (padding, margin, gap)
- Sizing (font-size, icon sizes)
- Structural properties (line-height, transitions)

**Example component:**

```css
.bp-button {
  /* Universal - Structure */
  padding: var(--bp-spacing-sm) var(--bp-spacing-md);
  font-size: var(--bp-font-size-base);
  line-height: var(--bp-line-height-tight);
  transition: var(--bp-transition-fast);

  /* Semantic - Theme-specific */
  background: var(--bp-color-primary);
  color: var(--bp-color-text-inverse);
  font-family: var(--bp-font-family);
  border-radius: var(--bp-border-radius);
  box-shadow: var(--bp-shadow-sm);
}
```

### Why This Split?

1. **Theme Interchangeability** - All themes provide the same semantic tokens, so components work everywhere
2. **Consistent Structure** - Spacing and sizing stay uniform for better UX
3. **Clear Boundaries** - Theme authors know exactly what they control
4. **Smaller CSS** - No duplicate infrastructure tokens per theme

---

## Color Design

### Choose the Right OKLCH Values

OKLCH is a perceptually uniform color space. Understanding its parameters is crucial:

**Lightness (l):**

```typescript
// Light backgrounds
background: { l: 0.98, c: 0, h: 0 }  // Near white
surface: { l: 0.95, c: 0, h: 0 }     // Subtle gray

// Dark backgrounds
background: { l: 0.1, c: 0, h: 0 }   // Near black
surface: { l: 0.15, c: 0, h: 0 }     // Slightly lighter

// Text on light backgrounds
text: { l: 0.2, c: 0, h: 0 }         // Dark for contrast

// Text on dark backgrounds
text: { l: 0.95, c: 0, h: 0 }        // Light for contrast
```

**Chroma (c):**

```typescript
// Neutral/grayscale
{ l: 0.5, c: 0, h: 0 }               // No saturation

// Subtle color
{ l: 0.5, c: 0.05, h: 220 }          // Slight blue tint

// Moderate saturation
{ l: 0.5, c: 0.15, h: 220 }          // Brand colors

// High saturation
{ l: 0.5, c: 0.25, h: 220 }          // Accent colors
```

**Hue (h):**

```typescript
// Common hues
red: 0 - 30;
orange: 30 - 60;
yellow: 60 - 90;
green: 90 - 150;
cyan: 150 - 210;
blue: 210 - 270;
purple: 270 - 330;
magenta: 330 - 360;
```

### Create Harmonious Color Scales

Use consistent lightness steps for predictable scales:

**Good - Consistent steps:**

```typescript
builder.addColor('brand', {
  source: { l: 0.5, c: 0.2, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
});

// Generates predictable lightness progression:
// 50  → l: 0.95 (very light)
// 100 → l: 0.90
// 200 → l: 0.80
// ...
// 500 → l: 0.50 (source)
// ...
// 950 → l: 0.05 (very dark)
```

**Avoid - Inconsistent steps:**

```typescript
// Don't use arbitrary steps
scale: [10, 75, 150, 400, 650, 999]; // ❌ Unpredictable
```

### Design for Both Light and Dark Modes

**Principle:** Same semantic meaning, different values

```typescript
register(builder) {
  // Single color definition
  builder.addColor('brand', {
    source: { l: 0.5, c: 0.2, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });

  // Light mode uses darker steps
  builder.addThemeVariant('light', {
    background: builder.colors.white,
    primary: builder.colors.brand600,     // Darker
    text: builder.colors.brand900,        // Much darker
  });

  // Dark mode uses lighter steps
  builder.addThemeVariant('dark', {
    background: builder.colors.black,
    primary: builder.colors.brand400,     // Lighter
    text: builder.colors.brand50,         // Much lighter
  });
}
```

### Use Semantic Color Names

**Good:**

```typescript
builder.addColor('oceanBlue', {
  /* ... */
});
builder.addColor('coralAccent', {
  /* ... */
});
builder.addColor('forestGreen', {
  /* ... */
});
```

**Avoid:**

```typescript
builder.addColor('color1', {
  /* ... */
}); // ❌ Not descriptive
builder.addColor('blue', {
  /* ... */
}); // ❌ Too generic
builder.addColor('primaryBlue', {
  /* ... */
}); // ❌ Mixes semantic/visual
```

### Limit Your Palette

**Recommended:**

- 1-2 primary brand colors
- 1-2 accent colors
- 1 neutral/gray scale
- Use shared colors for semantic states (success, warning, error)

**Example:**

```typescript
register(builder) {
  // Primary brand color
  builder.addColor('oceanBlue', { /* ... */ });

  // Accent
  builder.addColor('coral', { /* ... */ });

  // Use Blueprint's shared colors for the rest
  builder.addThemeVariant('ocean-light', {
    primary: builder.colors.oceanBlue600,
    success: builder.colors.green600,      // Shared
    warning: builder.colors.yellow600,     // Shared
    error: builder.colors.red600,          // Shared
  });
}
```

---

## Accessibility

### Always Test Contrast Ratios

Use the built-in validation:

```typescript
import { validateThemeAccessibility } from '../builder/validation.js';

export const myTheme: ThemePlugin = {
  id: 'my-theme',
  version: '1.0.0',

  register(builder) {
    // ... define colors and variants
  },

  validate(config) {
    // Automatically checks WCAG AA compliance
    return validateThemeAccessibility(config);
  },
};
```

**Run validation regularly:**

```bash
bp theme plugin validate my-theme
```

### WCAG Contrast Requirements

**Text contrast:**

- Normal text: ≥ 4.5:1 (WCAG AA)
- Large text (18px+): ≥ 3.0:1 (WCAG AA)

**UI elements:**

- Borders, icons, buttons: ≥ 3.0:1 (WCAG AA)
- Focus indicators: ≥ 3.0:1 (WCAG AA)

**Practical guidelines:**

```typescript
// Light mode
{
  background: { l: 1.0, c: 0, h: 0 },    // White
  text: { l: 0.2, c: 0, h: 0 },          // Dark (contrast: 9.5:1) ✅
  border: { l: 0.7, c: 0, h: 0 },        // Medium (contrast: 3.2:1) ✅
}

// Dark mode
{
  background: { l: 0.1, c: 0, h: 0 },    // Near black
  text: { l: 0.95, c: 0, h: 0 },         // Light (contrast: 14:1) ✅
  border: { l: 0.4, c: 0, h: 0 },        // Medium (contrast: 3.5:1) ✅
}
```

### Design for Color Blindness

**Avoid relying solely on color:**

```typescript
// ❌ Bad - Only color differentiates states
success: green;
error: red;

// ✅ Good - Icons + color
// In your components:
// <icon name="check-circle" color="success">
// <icon name="alert-circle" color="error">
```

**Use distinct hues:**

```typescript
// ✅ Good - Colors distinguishable for most color blindness types
success: {
  h: 140;
} // Green
warning: {
  h: 50;
} // Yellow-orange
error: {
  h: 10;
} // Red
info: {
  h: 220;
} // Blue
```

### Provide High Contrast Variants

```typescript
register(builder) {
  // Standard variant
  builder.addThemeVariant('light', { /* ... */ });

  // High contrast variant
  builder.addThemeVariant('light-high-contrast', {
    background: builder.colors.white,
    text: builder.colors.black,           // Pure black (max contrast)
    primary: builder.colors.brand800,     // Darker
    border: builder.colors.gray500,       // Stronger
  });
}
```

---

## Performance

### Minimize Color Scales

**Only generate needed steps:**

```typescript
// ❌ Generates 51 colors (50-1000 by 50s)
scale: Array.from({ length: 51 }, (_, i) => 50 + i * 50);

// ✅ Generates 11 colors (standard scale)
scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// ✅ Minimal scale for simple themes
scale: [100, 300, 500, 700, 900];
```

### Cache Expensive Computations

If your plugin does complex calculations:

```typescript
export const myTheme: ThemePlugin = {
  id: 'my-theme',
  version: '1.0.0',

  register(builder) {
    // ❌ Bad - Recalculates every time
    const computedColor = expensiveColorCalculation();
    builder.addColor('computed', computedColor);

    // ✅ Good - Calculate once, cache result
    if (!cachedColors.computed) {
      cachedColors.computed = expensiveColorCalculation();
    }
    builder.addColor('computed', cachedColors.computed);
  },
};
```

### Lazy Load Plugin Dependencies

```typescript
export const myTheme: ThemePlugin = {
  id: 'my-theme',
  version: '1.0.0',

  async register(builder) {
    // Only load heavy dependencies if needed
    if (needsAdvancedFeatures) {
      const { advancedColors } = await import('./advanced-colors.js');
      builder.addColor('special', advancedColors.special);
    }
  },
};
```

### Optimize Theme Variants

**Extend instead of duplicating:**

```typescript
// ❌ Bad - Duplicates all tokens
builder.addThemeVariant('variant1', {
  /* 17 tokens */
});
builder.addThemeVariant('variant2', {
  /* 17 tokens, 16 same as variant1 */
});

// ✅ Good - Extends base, only defines differences
builder.addThemeVariant('variant1', {
  /* 17 tokens */
});
builder.extendThemeVariant('variant1', 'variant2', {
  primary: builder.colors.differentBlue, // Only override what's different
});
```

---

## Naming Conventions

### Plugin IDs

**Format:** `kebab-case`

```typescript
// ✅ Good
id: 'ocean-theme';
id: 'corporate-blue';
id: 'high-contrast';

// ❌ Bad
id: 'OceanTheme'; // camelCase
id: 'ocean_theme'; // snake_case
id: 'Ocean Theme'; // spaces
```

### Color Names

**Format:** `camelCase`, descriptive

```typescript
// ✅ Good
'oceanBlue';
'forestGreen';
'sunsetOrange';
'corporateGray';

// ❌ Bad
'ocean-blue'; // kebab-case (breaks builder.colors.ocean-blue)
'blue1'; // non-descriptive
'OCEAN_BLUE'; // SCREAMING_SNAKE_CASE
```

### Theme Variant Names

**Format:** `kebab-case`, `{theme}-{mode}` pattern

```typescript
// ✅ Good
'ocean-light';
'ocean-dark';
'ocean-high-contrast';
'corporate-light';
'corporate-dark';

// ❌ Bad
'oceanLight'; // camelCase
'ocean_light'; // snake_case
'light'; // too generic (conflicts)
```

### Version Numbers

**Follow Semantic Versioning:**

```typescript
version: '1.0.0'     // Major.Minor.Patch

// Increment patch: Bug fixes, minor tweaks
'1.0.0' → '1.0.1'

// Increment minor: New colors, new variants (backwards compatible)
'1.0.1' → '1.1.0'

// Increment major: Breaking changes, removed colors
'1.1.0' → '2.0.0'
```

---

## Plugin Architecture

### Single Responsibility Principle

Each plugin should have one clear purpose:

**Good:**

```typescript
// ocean-theme plugin - Defines ocean color palette
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  register(builder) {
    builder.addColor('oceanBlue', {
      /* ... */
    });
    builder.addColor('seaGreen', {
      /* ... */
    });
  },
};

// ocean-variants plugin - Creates theme variants
export const oceanVariants: ThemePlugin = {
  id: 'ocean-variants',
  dependencies: [{ id: 'ocean' }],
  register(builder) {
    builder.addThemeVariant('ocean-light', {
      /* ... */
    });
    builder.addThemeVariant('ocean-dark', {
      /* ... */
    });
  },
};
```

**Avoid:**

```typescript
// ❌ Plugin does too much
export const megaPlugin: ThemePlugin = {
  id: 'mega',
  register(builder) {
    // Defines 20 colors
    // Creates 10 theme variants
    // Modifies design tokens
    // Sets up custom validation
    // 500+ lines of code
  },
};
```

### Use Dependencies for Composition

**Declare dependencies explicitly:**

```typescript
export const oceanDarkTheme: ThemePlugin = {
  id: 'ocean-dark',
  version: '1.0.0',

  // Explicit dependencies
  dependencies: [{ id: 'ocean', version: '^1.0.0' }],

  register(builder) {
    // Extend colors from ocean plugin
    builder.extendThemeVariant('ocean-light', 'ocean-dark', {
      background: builder.colors.oceanBlue950,
      text: builder.colors.oceanBlue50,
    });
  },
};
```

### Organize Large Plugins

**Split into modules:**

```
plugins/ocean/
├── index.ts           # Main plugin export
├── colors.ts          # Color definitions
├── variants.ts        # Theme variants
├── validation.ts      # Custom validation
└── README.md
```

```typescript
// index.ts
import { defineColors } from './colors.js';
import { defineVariants } from './variants.js';
import { validateOceanTheme } from './validation.js';

export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  register(builder) {
    defineColors(builder);
    defineVariants(builder);
  },

  validate: validateOceanTheme,
};
```

### Provide Configuration Options

**Allow customization:**

```typescript
// colors.ts
export interface OceanThemeConfig {
  primaryHue?: number; // Default: 220 (blue)
  accentHue?: number; // Default: 180 (cyan)
  includeVariants?: boolean; // Default: true
}

export function createOceanTheme(config: OceanThemeConfig = {}): ThemePlugin {
  const { primaryHue = 220, accentHue = 180, includeVariants = true } = config;

  return {
    id: 'ocean',
    version: '1.0.0',

    register(builder) {
      builder.addColor('oceanBlue', {
        source: { l: 0.5, c: 0.15, h: primaryHue },
        scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      });

      if (includeVariants) {
        builder.addThemeVariant('ocean-light', {
          /* ... */
        });
        builder.addThemeVariant('ocean-dark', {
          /* ... */
        });
      }
    },
  };
}
```

**Usage:**

```typescript
// Default configuration
const ocean = createOceanTheme();

// Custom configuration
const tealOcean = createOceanTheme({ primaryHue: 180 });
const minimalOcean = createOceanTheme({ includeVariants: false });
```

---

## Testing

### Test Plugin Registration

```typescript
import { describe, it, expect } from 'vitest';
import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import { oceanTheme } from './ocean/index.js';

describe('Ocean Theme Plugin', () => {
  it('should register without errors', () => {
    const builder = new ThemeBuilder();

    expect(() => {
      builder.use(oceanTheme);
    }).not.toThrow();
  });

  it('should add expected colors', () => {
    const builder = new ThemeBuilder().use(oceanTheme);

    expect(builder.hasColor('oceanBlue')).toBe(true);
    expect(builder.hasColor('seaGreen')).toBe(true);
  });

  it('should create theme variants', () => {
    const builder = new ThemeBuilder().use(oceanTheme);

    const variants = builder.getThemeVariantNames();
    expect(variants).toContain('ocean-light');
    expect(variants).toContain('ocean-dark');
  });
});
```

### Test Contrast Ratios

```typescript
import { validateThemeAccessibility } from '../builder/validation.js';

describe('Ocean Theme Accessibility', () => {
  it('should meet WCAG AA contrast requirements', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);
    const config = builder.build();

    const errors = validateThemeAccessibility(config);

    expect(errors).toHaveLength(0);
  });

  it('should have sufficient text contrast in light mode', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);
    const variant = builder.getThemeVariant('ocean-light');

    // Manual contrast check if needed
    const textColor = variant?.text;
    const bgColor = variant?.background;

    const ratio = getContrastRatio(textColor, bgColor);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
```

### Test Build Output

```typescript
describe('Ocean Theme Build', () => {
  it('should build without errors', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);

    expect(() => {
      builder.build();
    }).not.toThrow();
  });

  it('should include all required design tokens', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);
    const theme = builder.build();

    expect(theme.spacing).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.motion).toBeDefined();
  });

  it('should serialize color refs correctly', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);
    const theme = builder.build();

    const lightTheme = theme.themes.light;
    expect(typeof lightTheme.primary).toBe('string');
    expect(lightTheme.primary).toMatch(/^[a-zA-Z]+\.\d+$/);
  });
});
```

### Snapshot Testing

```typescript
describe('Ocean Theme Snapshots', () => {
  it('should match color definition snapshot', () => {
    const builder = new ThemeBuilder().use(oceanTheme);
    const oceanBlue = builder.getColor('oceanBlue');

    expect(oceanBlue).toMatchSnapshot();
  });

  it('should match theme variant snapshot', () => {
    const builder = ThemeBuilder.withDefaults().use(oceanTheme);
    const theme = builder.build();

    expect(theme.themes['ocean-light']).toMatchSnapshot();
  });
});
```

---

## Documentation

### Write Clear README Files

**Essential sections:**

````markdown
# Ocean Theme

A calming ocean-inspired color palette for Blueprint.

## Installation

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import oceanTheme from '@blueprint/themes/plugins/ocean';

const theme = ThemeBuilder.withDefaults().use(oceanTheme).build();
```

## Colors

- **oceanBlue** - Deep blue inspired by ocean waters
- **seaGreen** - Teal accent color

## Theme Variants

- **ocean-light** - Light mode with oceanic blues
- **ocean-dark** - Dark mode with lighter ocean tones

## Options

```typescript
import { createOceanTheme } from '@blueprint/themes/plugins/ocean';

const customOcean = createOceanTheme({
  primaryHue: 200, // Adjust blue hue
  accentHue: 180, // Adjust teal hue
});
```

## Accessibility

All theme variants meet WCAG AA contrast requirements.

## License

MIT
````

### Add JSDoc Comments

````typescript
/**
 * Ocean Theme Plugin
 *
 * Provides a calming ocean-inspired color palette with blue and teal colors.
 * Includes light and dark theme variants optimized for WCAG AA accessibility.
 *
 * @example
 * ```typescript
 * const theme = ThemeBuilder.withDefaults()
 *   .use(oceanTheme)
 *   .build();
 * ```
 */
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',
  name: 'Ocean Theme',
  description: 'Calming ocean-inspired color palette',
  author: 'Your Name <email@example.com>',
  tags: ['blue', 'ocean', 'calm', 'professional'],

  /**
   * Registers ocean colors and theme variants with the builder
   *
   * Adds:
   * - oceanBlue color with 11-step scale
   * - seaGreen accent color
   * - ocean-light theme variant
   * - ocean-dark theme variant
   */
  register(builder) {
    // Implementation
  },
};
````

### Document Breaking Changes

**In CHANGELOG.md:**

````markdown
# Changelog

## [2.0.0] - 2025-01-15

### Breaking Changes

- Removed `oceanTeal` color (use `seaGreen` instead)
- Renamed `ocean` variant to `ocean-light`
- Changed primary hue from 210 to 220 (slight blue shift)

### Migration Guide

```diff
- primary: builder.colors.oceanTeal600
+ primary: builder.colors.seaGreen600

- builder.addThemeVariant('ocean', { ... })
+ builder.addThemeVariant('ocean-light', { ... })
```
````

## [1.1.0] - 2024-12-20

### Added

- New `seaGreen` accent color
- High contrast variant: `ocean-high-contrast`

## [1.0.0] - 2024-12-01

### Added

- Initial release with oceanBlue color
- Light and dark theme variants

````

---

## Distribution

### Prepare for npm Publishing

**package.json:**

```json
{
  "name": "@yourorg/blueprint-theme-ocean",
  "version": "1.0.0",
  "description": "Ocean theme plugin for Blueprint design system",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "blueprint",
    "theme",
    "design-system",
    "ocean",
    "blue"
  ],
  "peerDependencies": {
    "@blueprint/themes": "^1.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/blueprint-theme-ocean"
  },
  "license": "MIT"
}
````

### Version Appropriately

**Before publishing:**

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features, backwards compatible)
npm version minor

# Major release (breaking changes)
npm version major
```

### Create GitHub Releases

**Release notes template:**

````markdown
## Ocean Theme v1.1.0

### New Features

- Added `seaGreen` accent color for better visual hierarchy
- Introduced `ocean-high-contrast` variant for accessibility

### Improvements

- Improved text contrast in dark mode (now exceeds WCAG AAA)
- Optimized color scale for better gradients

### Documentation

- Added configuration options guide
- Updated examples with new colors

### Breaking Changes

None - fully backwards compatible with v1.0.0

### Installation

```bash
npm install @yourorg/blueprint-theme-ocean@1.1.0
```
````

````

---

## Maintenance

### Monitor for Deprecations

```typescript
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',

  beforeBuild(config) {
    // Check for deprecated color usage
    if (config.colors.oldColor) {
      console.warn(
        'Warning: "oldColor" is deprecated and will be removed in v2.0.0. ' +
        'Use "newColor" instead.'
      );
    }
  }
};
````

### Provide Migration Paths

```typescript
/**
 * @deprecated Use createOceanTheme() instead
 * Will be removed in v2.0.0
 */
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.5.0',
  register(builder) {
    console.warn(
      'oceanTheme export is deprecated. ' +
        'Use createOceanTheme() instead for configuration options.'
    );
    // ... existing implementation
  },
};

/**
 * Recommended way to create ocean theme
 */
export function createOceanTheme(config = {}) {
  return {
    id: 'ocean',
    version: '1.5.0',
    register(builder) {
      // ... new implementation
    },
  };
}
```

### Keep Dependencies Updated

```bash
# Check for outdated dependencies
npm outdated

# Update Blueprint peer dependency
npm update @blueprint/themes

# Test after updates
npm test
```

---

## Common Pitfalls

### Avoid Hardcoded Values

**❌ Bad:**

```typescript
builder.addThemeVariant('light', {
  primary: '#3B82F6', // Hardcoded hex string
});
```

**✅ Good:**

```typescript
builder.addThemeVariant('light', {
  primary: builder.colors.blue600, // Color ref
});
```

### Don't Mutate Builder State

**❌ Bad:**

```typescript
register(builder) {
  // Trying to modify colors object directly
  builder.colors.myColor = someValue;  // Won't work
}
```

**✅ Good:**

```typescript
register(builder) {
  // Use addColor method
  builder.addColor('myColor', {
    source: { l: 0.5, c: 0.15, h: 220 },
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  });
}
```

### Validate Theme Variants

**❌ Bad:**

```typescript
builder.addThemeVariant('incomplete', {
  background: builder.colors.white,
  text: builder.colors.black,
  // Missing 15 other required tokens!
});
```

**✅ Good:**

```typescript
builder.addThemeVariant('complete', {
  // All 17 required semantic tokens defined
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
```

### Handle Plugin Dependencies

**❌ Bad:**

```typescript
// Assumes 'ocean' plugin is loaded, but doesn't declare dependency
register(builder) {
  builder.extendThemeVariant('ocean-light', 'ocean-custom', {
    // This will fail if ocean plugin isn't loaded!
    primary: builder.colors.oceanBlue700,
  });
}
```

**✅ Good:**

```typescript
export const oceanCustomTheme: ThemePlugin = {
  id: 'ocean-custom',
  version: '1.0.0',

  // Explicit dependency
  dependencies: [{ id: 'ocean', version: '^1.0.0' }],

  register(builder) {
    builder.extendThemeVariant('ocean-light', 'ocean-custom', {
      primary: builder.colors.oceanBlue700,
    });
  },
};
```

### Test Contrast Before Publishing

**❌ Bad:**

```typescript
// Ships with poor contrast
builder.addThemeVariant('low-contrast', {
  background: { l: 0.9, c: 0, h: 0 },
  text: { l: 0.7, c: 0, h: 0 }, // Only 2:1 contrast! ❌
});
```

**✅ Good:**

```typescript
// Always validate
const errors = validateThemeAccessibility(config);
if (errors.length > 0) {
  console.error('Contrast violations:', errors);
  throw new Error('Theme does not meet accessibility requirements');
}
```

### Use Appropriate Scale Steps

**❌ Bad:**

```typescript
// Too many steps (generates 100 colors!)
scale: Array.from({ length: 100 }, (_, i) => i * 10);
```

**✅ Good:**

```typescript
// Standard 11-step scale
scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Or minimal 5-step scale
scale: [100, 300, 500, 700, 900];
```

---

## Checklist

Before publishing your plugin:

**Code Quality:**

- [ ] All colors have descriptive names
- [ ] Both light and dark variants provided
- [ ] WCAG AA contrast requirements met
- [ ] No hardcoded color values
- [ ] Proper error handling
- [ ] TypeScript types are correct

**Testing:**

- [ ] Plugin registers without errors
- [ ] All color refs resolve correctly
- [ ] Theme variants validate successfully
- [ ] Contrast ratios tested
- [ ] Build produces valid output
- [ ] Unit tests pass (>80% coverage)

**Documentation:**

- [ ] README with installation instructions
- [ ] JSDoc comments on exported functions
- [ ] Example code provided
- [ ] CHANGELOG.md maintained
- [ ] LICENSE file included

**Distribution:**

- [ ] package.json configured correctly
- [ ] Peer dependencies declared
- [ ] Version follows semver
- [ ] Git tags created for releases
- [ ] GitHub release notes written

**Accessibility:**

- [ ] Text contrast ≥ 4.5:1
- [ ] UI elements contrast ≥ 3.0:1
- [ ] Focus indicators visible
- [ ] Color-blind friendly
- [ ] High contrast variant available

---

## Resources

- **[Plugin Authoring Guide](./PLUGIN-AUTHORING-GUIDE.md)** - Getting started with plugins
- **[API Reference](./API-REFERENCE.md)** - Complete API documentation
- **[Type Generation](./TYPE-GENERATION.md)** - TypeScript type generation
- **[OKLCH Color Picker](https://oklch.com/)** - Visual OKLCH color tool
- **[WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)** - Test contrast ratios
- **[Semantic Versioning](https://semver.org/)** - Version numbering guide

## Next Steps

1. Review existing plugins in `source/themes/plugins/` for examples
2. Start with a simple plugin using the CLI: `bp theme plugin create`
3. Test thoroughly before publishing
4. Share your plugin with the community!
