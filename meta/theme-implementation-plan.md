# Blueprint Theme System - Implementation Plan

**Architecture:** Build-time TypeScript generation → Runtime pure CSS

**Philosophy:** Use modern CSS (OKLCH, `light-dark()`, data attributes) with zero runtime JavaScript. TypeScript handles color manipulation, validation, and generation at build time.

---

## Architecture Overview

```
TypeScript Theme Definition → Theme Builder → Generated CSS Files
         ↓                            ↓                ↓
   theme.config.ts              Color math,       light.css
   (source of truth)         accessibility,      dark.css
                              validation      primitives.css
```

**Key Principles:**

1. **Single source of truth** - Define colors once, generate all variants
2. **Type-safe theming** - Full TypeScript validation for theme config
3. **Build-time validation** - Fail fast if contrast ratios don't meet WCAG
4. **Zero runtime cost** - Output is pure CSS custom properties
5. **CLI integration** - Fits naturally with existing `bp` CLI

---

## Phase 1: Foundation (Immediate)

### 1.1 Token Architecture

**3-layer system:**

```
Primitives (generated) → Semantics (themed) → Components (optional)
      ↓                        ↓                      ↓
  --bp-blue-500          --bp-color-primary    --bp-button-bg
```

**File structure:**

```
source/themes/
├── generated/              # Build output (git-ignored)
│   ├── primitives.css      # All color scales (50-950)
│   ├── light.css           # Light theme semantics
│   ├── dark.css            # Dark theme semantics
│   └── index.css           # Main entry
├── config/
│   └── theme.config.ts     # Theme definition (source of truth)
└── index.ts                # TypeScript exports for build tools
```

### 1.2 Color System

**Use OKLCH with hex fallbacks:**

- **Primitive colors:** 11-step scales (50-950) per color
- **Generated from source:** Define one base color, generate full scale
- **OKLCH values:** Stored as space-separated values for modern browsers
- **Hex fallbacks:** Converted for legacy browser support

**Example primitive generation:**

```typescript
// Input: Single source color
const blue = oklch(0.55, 0.15, 250);

// Output: Full scale
--bp-blue-50: 0.95 0.02 250;
--bp-blue-100: 0.90 0.04 250;
// ... through
--bp-blue-950: 0.15 0.06 250;

// With fallbacks
--bp-blue-50-fallback: #eff6ff;
--bp-blue-100-fallback: #dbeafe;
```

### 1.3 Semantic Tokens

**Map primitives to semantic meaning:**

```css
/* Light theme */
[data-theme='light'] {
  --bp-color-background: var(--bp-white);
  --bp-color-surface: var(--bp-gray-50);
  --bp-color-text: var(--bp-gray-900);
  --bp-color-text-muted: var(--bp-gray-600);
  --bp-color-primary: var(--bp-blue-500);
  --bp-color-primary-hover: var(--bp-blue-600);
  --bp-color-border: var(--bp-gray-200);
}

/* Dark theme */
[data-theme='dark'] {
  --bp-color-background: var(--bp-gray-950);
  --bp-color-surface: var(--bp-gray-900);
  --bp-color-text: var(--bp-gray-50);
  --bp-color-text-muted: var(--bp-gray-400);
  --bp-color-primary: var(--bp-blue-400);
  --bp-color-primary-hover: var(--bp-blue-300);
  --bp-color-border: var(--bp-gray-800);
}
```

---

## TypeScript API Design

### Theme Configuration Format

```typescript
// source/themes/config/theme.config.ts
import { defineTheme } from '../builder/defineTheme.js';

export const blueprintTheme = defineTheme({
  // Source colors (OKLCH)
  colors: {
    // Neutral scale
    gray: {
      source: { l: 0.55, c: 0.02, h: 240 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    // Brand colors
    blue: {
      source: { l: 0.55, c: 0.15, h: 250 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    // Semantic colors (optional - can be auto-generated)
    success: {
      source: { l: 0.55, c: 0.15, h: 145 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    error: {
      source: { l: 0.55, c: 0.19, h: 25 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    warning: {
      source: { l: 0.65, c: 0.17, h: 85 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
  },

  // Spacing scale
  spacing: {
    base: 4, // Base unit in px
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: {
      xs: 1,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
    },
  },

  // Border radius
  radius: {
    none: 0,
    sm: 2,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    full: 9999,
  },

  // Motion/animation
  motion: {
    durations: {
      instant: 0,
      fast: 100,
      normal: 200,
      slow: 300,
      slower: 500,
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Typography
  typography: {
    fontFamilies: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", monospace',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Theme variants
  themes: {
    light: {
      background: 'white',
      surface: 'gray.50',
      text: 'gray.900',
      textMuted: 'gray.600',
      primary: 'blue.500',
      primaryHover: 'blue.600',
      border: 'gray.200',
      // ... more semantic mappings
    },
    dark: {
      background: 'gray.950',
      surface: 'gray.900',
      text: 'gray.50',
      textMuted: 'gray.400',
      primary: 'blue.400',
      primaryHover: 'blue.300',
      border: 'gray.800',
      // ... more semantic mappings
    },
  },

  // Validation rules
  accessibility: {
    enforceWCAG: true,
    minimumContrast: {
      normal: 4.5, // WCAG AA
      large: 3.0, // WCAG AA for large text
    },
  },
});
```

### Theme Builder API

```typescript
// source/themes/builder/types.ts
export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4 typical)
  h: number; // Hue (0-360)
}

export interface ColorScale {
  source: OKLCHColor;
  scale: number[];
}

export interface ThemeConfig {
  colors: Record<string, ColorScale>;
  spacing: {
    base: number;
    scale: number[];
    semantic?: Record<string, number>;
  };
  radius: Record<string, number>;
  motion: {
    durations: Record<string, number>;
    easings: Record<string, string>;
  };
  typography: {
    fontFamilies: Record<string, string>;
    fontSizes: Record<string, number>;
    lineHeights: Record<string, number>;
  };
  themes: Record<string, Record<string, string>>;
  accessibility?: {
    enforceWCAG?: boolean;
    minimumContrast?: {
      normal: number;
      large: number;
    };
  };
}
```

### Color Generation Algorithm

```typescript
// source/themes/builder/generateColorScale.ts
import { convertOKLCHtoHex, interpolateOKLCH } from './colorUtils.js';

/**
 * Generate an 11-step color scale (50-950) from a source OKLCH color
 */
export function generateColorScale(
  source: OKLCHColor,
  steps: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
): Record<number, { oklch: OKLCHColor; hex: string }> {
  const scale: Record<number, { oklch: OKLCHColor; hex: string }> = {};

  // Define lightness curve (non-linear for better perceptual distribution)
  const lightnessMap: Record<number, number> = {
    50: 0.95,
    100: 0.9,
    200: 0.8,
    300: 0.7,
    400: 0.65,
    500: source.l, // Source is the base (500)
    600: source.l * 0.91,
    700: source.l * 0.82,
    800: source.l * 0.64,
    900: source.l * 0.45,
    950: source.l * 0.27,
  };

  // Chroma curve (reduce chroma at extremes for better balance)
  const chromaMap: Record<number, number> = {
    50: source.c * 0.13,
    100: source.c * 0.27,
    200: source.c * 0.4,
    300: source.c * 0.6,
    400: source.c * 0.8,
    500: source.c,
    600: source.c,
    700: source.c * 0.93,
    800: source.c * 0.8,
    900: source.c * 0.67,
    950: source.c * 0.4,
  };

  for (const step of steps) {
    const oklch: OKLCHColor = {
      l: lightnessMap[step],
      c: chromaMap[step],
      h: source.h, // Hue remains constant
    };

    scale[step] = {
      oklch,
      hex: convertOKLCHtoHex(oklch),
    };
  }

  return scale;
}
```

### Accessibility Validation

```typescript
// source/themes/builder/validateContrast.ts
import { getContrastRatio } from './colorUtils.js';

export interface ContrastViolation {
  token: string;
  foreground: string;
  background: string;
  ratio: number;
  required: number;
}

/**
 * Validate all text/background combinations meet WCAG contrast requirements
 */
export function validateThemeContrast(
  theme: GeneratedTheme,
  config: ThemeConfig
): ContrastViolation[] {
  const violations: ContrastViolation[] = [];
  const minContrast = config.accessibility?.minimumContrast?.normal ?? 4.5;

  // Check text on background
  const textBgRatio = getContrastRatio(
    theme.semanticTokens['--bp-color-text'],
    theme.semanticTokens['--bp-color-background']
  );

  if (textBgRatio < minContrast) {
    violations.push({
      token: '--bp-color-text',
      foreground: theme.semanticTokens['--bp-color-text'],
      background: theme.semanticTokens['--bp-color-background'],
      ratio: textBgRatio,
      required: minContrast,
    });
  }

  // Check primary text on primary background
  const primaryRatio = getContrastRatio(
    theme.semanticTokens['--bp-color-primary'],
    theme.semanticTokens['--bp-color-background']
  );

  if (primaryRatio < minContrast) {
    violations.push({
      token: '--bp-color-primary',
      foreground: theme.semanticTokens['--bp-color-primary'],
      background: theme.semanticTokens['--bp-color-background'],
      ratio: primaryRatio,
      required: minContrast,
    });
  }

  // ... check other combinations

  return violations;
}
```

### CSS Generation

```typescript
// source/themes/builder/generateCSS.ts

export function generatePrimitivesCSS(
  colors: Record<string, Record<number, { oklch: OKLCHColor; hex: string }>>
): string {
  let css = '/* Generated primitive color tokens */\n:root {\n';

  for (const [colorName, scale] of Object.entries(colors)) {
    css += `\n  /* ${colorName} scale */\n`;

    for (const [step, { oklch, hex }] of Object.entries(scale)) {
      // Hex fallback
      css += `  --bp-${colorName}-${step}-fallback: ${hex};\n`;

      // OKLCH value (space-separated for use with oklch())
      css += `  --bp-${colorName}-${step}: ${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h.toFixed(0)};\n`;
    }
  }

  css += '}\n';
  return css;
}

export function generateThemeCSS(
  themeName: string,
  mappings: Record<string, string>,
  colors: Record<string, Record<number, { oklch: OKLCHColor; hex: string }>>
): string {
  const selector =
    themeName === 'light'
      ? ':root, [data-theme="light"]'
      : `[data-theme="${themeName}"]`;

  let css = `/* ${themeName} theme */\n${selector} {\n`;

  for (const [semanticToken, primitiveRef] of Object.entries(mappings)) {
    // Parse primitive reference (e.g., "blue.500" → "--bp-blue-500")
    const [colorName, step] = primitiveRef.split('.');

    if (colorName === 'white' || colorName === 'black') {
      css += `  --bp-color-${semanticToken}: ${colorName};\n`;
    } else {
      // With fallback support
      css += `  --bp-color-${semanticToken}: var(--bp-${colorName}-${step}-fallback);\n`;
    }
  }

  // OKLCH values for modern browsers
  css += '}\n\n';
  css += `@supports (color: oklch(0 0 0)) {\n  ${selector} {\n`;

  for (const [semanticToken, primitiveRef] of Object.entries(mappings)) {
    const [colorName, step] = primitiveRef.split('.');

    if (colorName !== 'white' && colorName !== 'black') {
      css += `    --bp-color-${semanticToken}: var(--bp-${colorName}-${step});\n`;
    }
  }

  css += '  }\n}\n';

  return css;
}
```

---

## CLI Commands

### `bp theme generate`

Generate CSS files from theme configuration.

```bash
# Generate all themes from config
bp theme generate

# Generate specific theme
bp theme generate --theme light

# Watch mode for development
bp theme generate --watch

# Output to custom directory
bp theme generate --output ./dist/themes
```

**Implementation:**

```typescript
// source/cli/commands/theme/generate.ts
import { Command } from 'commander';
import { loadThemeConfig } from '../../lib/theme/loadConfig.js';
import { generateTheme } from '../../lib/theme/generateTheme.js';
import { writeThemeFiles } from '../../lib/theme/writeFiles.js';
import { validateThemeContrast } from '../../lib/theme/validateContrast.js';

export const generateCommand = new Command('generate')
  .description('Generate CSS theme files from theme configuration')
  .option('-t, --theme <name>', 'Generate specific theme only')
  .option('-o, --output <dir>', 'Output directory', 'source/themes/generated')
  .option('-w, --watch', 'Watch for changes and regenerate')
  .option('--no-validate', 'Skip accessibility validation')
  .action(async (options) => {
    const config = await loadThemeConfig();
    const generated = await generateTheme(config);

    if (options.validate) {
      const violations = validateThemeContrast(generated, config);

      if (violations.length > 0) {
        console.error('❌ Contrast violations detected:');
        violations.forEach((v) => {
          console.error(
            `  ${v.token}: ${v.ratio.toFixed(2)}:1 (requires ${v.required}:1)`
          );
        });
        process.exit(1);
      }
    }

    await writeThemeFiles(generated, options.output);
    console.log('✅ Theme files generated successfully');

    if (options.watch) {
      // Watch theme.config.ts for changes
      watchThemeConfig(() => {
        // Re-run generation
      });
    }
  });
```

### `bp theme create`

Interactive theme creator.

```bash
# Create new theme interactively
bp theme create

# Create from existing theme
bp theme create --from light --name ocean

# Create from brand color
bp theme create --color "#3b82f6" --name brand
```

**Features:**

- Interactive prompts for theme name, source colors
- Preview contrast ratios in terminal
- Generate full theme config
- Optionally update `theme.config.ts`

### `bp theme validate`

Validate theme configuration and accessibility.

```bash
# Validate current theme config
bp theme validate

# Check specific theme
bp theme validate --theme dark

# Strict WCAG AAA validation
bp theme validate --strict
```

**Output:**

```
✅ Theme validation passed

Colors:
  ✓ blue scale: 11 steps generated
  ✓ gray scale: 11 steps generated
  ⚠ warning scale: Step 100 very close to white (L=0.96)

Accessibility (WCAG AA):
  ✓ text/background: 12.5:1
  ✓ text-muted/background: 5.2:1
  ✓ primary/background: 4.8:1
  ✗ error/background: 3.2:1 (requires 4.5:1)

1 error, 1 warning
```

### `bp theme preview`

Preview theme in browser.

```bash
# Launch preview server
bp theme preview

# Preview specific theme
bp theme preview --theme dark

# Preview all themes side-by-side
bp theme preview --all
```

Generates a preview page showing:

- All primitive color scales
- Semantic token mappings
- Component examples with current theme
- Contrast ratio matrix
- Color picker for adjustments

---

## Build Integration

### Vite Plugin

```typescript
// vite-plugin-blueprint-theme.ts
import { Plugin } from 'vite';
import { generateTheme } from './source/themes/builder/index.js';

export function blueprintThemePlugin(): Plugin {
  return {
    name: 'blueprint-theme',

    async buildStart() {
      // Generate themes at build start
      const config = await loadThemeConfig();
      const generated = await generateTheme(config);
      await writeThemeFiles(generated, 'source/themes/generated');
    },

    configureServer(server) {
      // Watch theme config in dev mode
      server.watcher.add('source/themes/config/theme.config.ts');

      server.watcher.on('change', async (file) => {
        if (file.includes('theme.config.ts')) {
          // Regenerate themes
          const config = await loadThemeConfig();
          const generated = await generateTheme(config);
          await writeThemeFiles(generated, 'source/themes/generated');

          // Trigger HMR
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}
```

### Usage in vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { blueprintThemePlugin } from './vite-plugin-blueprint-theme.js';

export default defineConfig({
  plugins: [
    blueprintThemePlugin(),
    // ... other plugins
  ],
});
```

---

## Migration Path

### Current State

- Manual CSS custom properties in `source/themes/light.css`
- Hardcoded color values
- No build-time validation

### Phase 1: Setup Infrastructure (Week 1)

1. ✅ Create theme builder TypeScript API
2. ✅ Implement OKLCH color utilities (using `culori` or `colorjs.io`)
3. ✅ Create theme config schema and types
4. ✅ Implement CSS generation

### Phase 2: CLI Commands (Week 1-2)

1. ✅ `bp theme generate` - Basic generation
2. ✅ `bp theme validate` - Contrast validation
3. ✅ `bp theme create` - Interactive theme creator
4. ✅ `bp theme preview` - Browser preview

### Phase 3: Initial Theme (Week 2)

1. ✅ Convert existing `light.css` to theme config
2. ✅ Generate primitives from config
3. ✅ Create dark theme
4. ✅ Update component library to use generated tokens

### Phase 4: Documentation & DX (Week 3)

1. ✅ Document theme customization
2. ✅ Create theme examples
3. ✅ Add theme switcher to demo
4. ✅ TypeScript types for theme tokens

### Phase 5: Advanced Features (Week 4+)

1. ⏳ High-contrast theme
2. ⏳ Component-level tokens
3. ⏳ Theme interpolation (blend two themes)
4. ⏳ P3 gamut support
5. ⏳ CSS `light-dark()` function support

---

## Dependencies

```json
{
  "dependencies": {
    "culori": "^4.0.1" // OKLCH color manipulation
  },
  "devDependencies": {
    "@types/culori": "^2.1.0"
  }
}
```

**Why culori?**

- Full OKLCH support
- Color conversion (OKLCH ↔ hex ↔ RGB)
- Contrast ratio calculation (WCAG)
- Color interpolation
- Lightweight (11kb gzipped)
- TypeScript-first

---

## Success Metrics

1. **Zero runtime JavaScript** - All theming is CSS-only
2. **Type-safe config** - Compile errors for invalid theme definitions
3. **Automatic validation** - Build fails if WCAG contrast not met
4. **Fast generation** - Theme builds complete in <1 second
5. **Developer experience** - Theme changes visible in <100ms (HMR)

---

## Open Questions

1. **Color space fallback strategy?** Use `@supports` or provide both values always?
2. **Component tokens in v1?** Or defer to Phase 5?
3. **Theme variants?** Support more than just light/dark (e.g., high-contrast, colorblind-friendly)?
4. **CSS Layers?** Use `@layer` for primitive/semantic/component separation?
5. **Export formats?** Generate TypeScript types? JSON for docs? Figma tokens?

---

## References

- [culori documentation](https://culorjs.org/)
- [OKLCH in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
