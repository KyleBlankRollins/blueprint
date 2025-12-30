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
- **OKLCH values:** Complete color values with `@supports` for progressive enhancement
- **Hex fallbacks:** Base declaration for legacy browser support

**Example primitive generation:**

```css
/* Hex fallbacks for all browsers */
:root {
  --bp-blue-50: #eff6ff;
  --bp-blue-100: #dbeafe;
  --bp-blue-500: #3b82f6;
  --bp-blue-950: #1e3a8a;
}

/* OKLCH for modern browsers */
@supports (color: oklch(0 0 0)) {
  :root {
    --bp-blue-50: oklch(0.95 0.02 250);
    --bp-blue-100: oklch(0.9 0.04 250);
    --bp-blue-500: oklch(0.55 0.15 250);
    --bp-blue-950: oklch(0.15 0.06 250);
  }
}
```

### 1.3 Semantic Tokens

**Map primitives to semantic meaning:**

```css
/* Light theme */
[data-theme='light'] {
  /* Backgrounds */
  --bp-color-background: var(--bp-white);
  --bp-color-surface: var(--bp-gray-50);
  --bp-color-surface-elevated: var(--bp-white);
  --bp-color-surface-subdued: var(--bp-gray-100);

  /* Text */
  --bp-color-text: var(--bp-gray-900);
  --bp-color-text-muted: var(--bp-gray-600);
  --bp-color-text-inverse: var(--bp-white);

  /* Primary */
  --bp-color-primary: var(--bp-blue-500);
  --bp-color-primary-hover: var(--bp-blue-600);
  --bp-color-primary-active: var(--bp-blue-700);

  /* Semantic */
  --bp-color-success: var(--bp-green-500);
  --bp-color-warning: var(--bp-yellow-600);
  --bp-color-error: var(--bp-red-500);
  --bp-color-info: var(--bp-blue-500);

  /* UI Elements */
  --bp-color-border: var(--bp-gray-200);
  --bp-color-border-strong: var(--bp-gray-300);
  --bp-color-focus: var(--bp-blue-500);
}

/* Dark theme */
[data-theme='dark'] {
  /* Backgrounds */
  --bp-color-background: var(--bp-gray-950);
  --bp-color-surface: var(--bp-gray-900);
  --bp-color-surface-elevated: var(--bp-gray-800);
  --bp-color-surface-subdued: var(--bp-black);

  /* Text */
  --bp-color-text: var(--bp-gray-50);
  --bp-color-text-muted: var(--bp-gray-400);
  --bp-color-text-inverse: var(--bp-gray-900);

  /* Primary (reduced chroma for dark backgrounds) */
  --bp-color-primary: var(--bp-blue-400);
  --bp-color-primary-hover: var(--bp-blue-300);
  --bp-color-primary-active: var(--bp-blue-200);

  /* Semantic */
  --bp-color-success: var(--bp-green-400);
  --bp-color-warning: var(--bp-yellow-400);
  --bp-color-error: var(--bp-red-400);
  --bp-color-info: var(--bp-blue-400);

  /* UI Elements */
  --bp-color-border: var(--bp-gray-800);
  --bp-color-border-strong: var(--bp-gray-700);
  --bp-color-focus: var(--bp-blue-400);
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

    // Semantic colors
    green: {
      source: { l: 0.55, c: 0.13, h: 145 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    red: {
      source: { l: 0.55, c: 0.15, h: 25 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    yellow: {
      source: { l: 0.65, c: 0.13, h: 85 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
  },

  // Dark mode adjustments
  darkMode: {
    chromaMultiplier: 0.85, // Reduce saturation by 15% for dark backgrounds
    contrastBoost: 1.1, // Slightly increase contrast for better readability
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

  // Border radius (consistent progression)
  radius: {
    none: 0,
    sm: 2, // 2px
    md: 4, // 4px (2x)
    lg: 8, // 8px (2x)
    xl: 12, // 12px (1.5x)
    '2xl': 16, // 16px (1.33x)
    '3xl': 24, // 24px (1.5x) - for large cards/modals
    full: 9999,
  },

  // Motion/animation
  motion: {
    durations: {
      instant: 0,
      fast: 150, // Hover states, tooltips
      normal: 300, // Modals, dropdowns
      slow: 500, // Page transitions, complex animations
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // Combined presets
    transitions: {
      fast: '150ms cubic-bezier(0, 0, 0.2, 1)',
      base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Focus rings (accessibility-critical)
  focus: {
    width: 2, // px
    offset: 2, // px
    style: 'solid',
  },

  // Z-index scale (for layering)
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    overlay: 1030,
    modal: 1040,
    popover: 1060,
    tooltip: 1080,
  },

  // Opacity scale
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    overlay: 0.6,
    subtle: 0.4,
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Theme variants
  themes: {
    light: {
      // Backgrounds
      background: 'white',
      surface: 'gray.50',
      surfaceElevated: 'white',
      surfaceSubdued: 'gray.100',

      // Text
      text: 'gray.900',
      textMuted: 'gray.600',
      textInverse: 'white',

      // Primary
      primary: 'blue.500',
      primaryHover: 'blue.600',
      primaryActive: 'blue.700',

      // Semantic
      success: 'green.500',
      warning: 'yellow.600', // Darker for better contrast
      error: 'red.500',
      info: 'blue.500',

      // UI Elements
      border: 'gray.200',
      borderStrong: 'gray.300',
      focus: 'blue.500',
    },
    dark: {
      // Backgrounds
      background: 'gray.950',
      surface: 'gray.900',
      surfaceElevated: 'gray.800',
      surfaceSubdued: 'black',

      // Text
      text: 'gray.50',
      textMuted: 'gray.400',
      textInverse: 'gray.900',

      // Primary (uses dark mode chroma adjustments)
      primary: 'blue.400',
      primaryHover: 'blue.300',
      primaryActive: 'blue.200',

      // Semantic
      success: 'green.400',
      warning: 'yellow.400',
      error: 'red.400',
      info: 'blue.400',

      // UI Elements
      border: 'gray.800',
      borderStrong: 'gray.700',
      focus: 'blue.400',
    },
  },

  // Validation rules
  accessibility: {
    enforceWCAG: true,
    minimumContrast: {
      text: 4.5, // WCAG AA for normal text
      textLarge: 3.0, // WCAG AA for large text (18px+)
      ui: 3.0, // WCAG AA for UI components (borders, icons)
      interactive: 3.0, // For hover/active states
      focus: 3.0, // Focus indicators must contrast with both bg and element
    },
    colorBlindSafe: true, // Ensure sufficient hue separation
    minHueDifference: 60, // Minimum degrees between semantic colors
    highContrast: true, // Support prefers-contrast: more
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
  darkMode?: {
    chromaMultiplier?: number;
    contrastBoost?: number;
  };
  spacing: {
    base: number;
    scale: number[];
    semantic?: Record<string, number>;
  };
  radius: Record<string, number>;
  motion: {
    durations: Record<string, number>;
    easings: Record<string, string>;
    transitions?: Record<string, string>;
  };
  typography: {
    fontFamilies: Record<string, string>;
    fontSizes: Record<string, number>;
    lineHeights: Record<string, number>;
    fontWeights?: Record<string, number>;
  };
  focus?: {
    width: number;
    offset: number;
    style: string;
  };
  zIndex?: Record<string, number>;
  opacity?: Record<string, number>;
  breakpoints?: Record<string, string>;
  themes: Record<string, Record<string, string>>;
  accessibility?: {
    enforceWCAG?: boolean;
    minimumContrast?: {
      text: number;
      textLarge: number;
      ui: number;
      interactive: number;
      focus: number;
    };
    colorBlindSafe?: boolean;
    minHueDifference?: number;
    highContrast?: boolean;
  };
}
```

### Color Generation Algorithm

```typescript
// source/themes/builder/generateColorScale.ts
import { convertOKLCHtoHex, interpolateOKLCH } from './colorUtils.js';

/**
 * Generate an 11-step color scale (50-950) from a source OKLCH color
 * @param source - Base OKLCH color (typically the 500 step)
 * @param steps - Scale steps to generate
 * @param darkModeAdjustments - Optional chroma/contrast adjustments for dark mode
 */
export function generateColorScale(
  source: OKLCHColor,
  steps: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  darkModeAdjustments?: { chromaMultiplier?: number; contrastBoost?: number }
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
  const contrast = config.accessibility?.minimumContrast ?? {
    text: 4.5,
    textLarge: 3.0,
    ui: 3.0,
    interactive: 3.0,
    focus: 3.0,
  };

  // Text contrast checks
  const textPairs: [string, string, number][] = [
    ['text', 'background', contrast.text],
    ['textMuted', 'background', contrast.text],
    ['text', 'surface', contrast.text],
    ['textMuted', 'surface', contrast.text],
    ['textInverse', 'primary', contrast.text],
  ];

  for (const [fg, bg, required] of textPairs) {
    const ratio = getContrastRatio(
      theme.semanticTokens[`--bp-color-${fg}`],
      theme.semanticTokens[`--bp-color-${bg}`]
    );
    if (ratio < required) {
      violations.push({
        token: `--bp-color-${fg}`,
        foreground: theme.semanticTokens[`--bp-color-${fg}`],
        background: theme.semanticTokens[`--bp-color-${bg}`],
        ratio,
        required,
      });
    }
  }

  // UI component contrast checks (borders, icons, etc.)
  const uiPairs: [string, string, number][] = [
    ['border', 'background', contrast.ui],
    ['borderStrong', 'background', contrast.ui],
    ['primary', 'background', contrast.ui],
    ['success', 'background', contrast.ui],
    ['error', 'background', contrast.ui],
    ['warning', 'background', contrast.ui],
  ];

  for (const [fg, bg, required] of uiPairs) {
    const ratio = getContrastRatio(
      theme.semanticTokens[`--bp-color-${fg}`],
      theme.semanticTokens[`--bp-color-${bg}`]
    );
    if (ratio < required) {
      violations.push({
        token: `--bp-color-${fg}`,
        foreground: theme.semanticTokens[`--bp-color-${fg}`],
        background: theme.semanticTokens[`--bp-color-${bg}`],
        ratio,
        required,
      });
    }
  }

  // Interactive state contrast (hover/active states)
  const interactivePairs: [string, string, number][] = [
    ['primaryHover', 'primary', contrast.interactive],
    ['primaryActive', 'primaryHover', contrast.interactive],
  ];

  for (const [fg, bg, required] of interactivePairs) {
    const ratio = getContrastRatio(
      theme.semanticTokens[`--bp-color-${fg}`],
      theme.semanticTokens[`--bp-color-${bg}`]
    );
    if (ratio < required) {
      violations.push({
        token: `--bp-color-${fg}`,
        foreground: theme.semanticTokens[`--bp-color-${fg}`],
        background: theme.semanticTokens[`--bp-color-${bg}`],
        ratio,
        required,
      });
    }
  }

  // Focus indicator contrast (must contrast with both background AND element)
  const focusBgRatio = getContrastRatio(
    theme.semanticTokens['--bp-color-focus'],
    theme.semanticTokens['--bp-color-background']
  );
  const focusPrimaryRatio = getContrastRatio(
    theme.semanticTokens['--bp-color-focus'],
    theme.semanticTokens['--bp-color-primary']
  );

  if (focusBgRatio < contrast.focus || focusPrimaryRatio < contrast.focus) {
    violations.push({
      token: '--bp-color-focus',
      foreground: theme.semanticTokens['--bp-color-focus'],
      background: `background (${focusBgRatio.toFixed(2)}:1) or primary (${focusPrimaryRatio.toFixed(2)}:1)`,
      ratio: Math.min(focusBgRatio, focusPrimaryRatio),
      required: contrast.focus,
    });
  }

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

  // Hex fallbacks first
  for (const [colorName, scale] of Object.entries(colors)) {
    css += `\n  /* ${colorName} scale */\n`;

    for (const [step, { hex }] of Object.entries(scale)) {
      css += `  --bp-${colorName}-${step}: ${hex};\n`;
    }
  }

  css += '}\n\n';

  // OKLCH values for modern browsers
  css += '@supports (color: oklch(0 0 0)) {\n  :root {\n';

  for (const [colorName, scale] of Object.entries(colors)) {
    css += `\n    /* ${colorName} scale */\n`;

    for (const [step, { oklch }] of Object.entries(scale)) {
      css += `    --bp-${colorName}-${step}: oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h.toFixed(0)});\n`;
    }
  }

  css += '  }\n}\n';
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
      // Reference primitive token (hex fallback + OKLCH in @supports already handled)
      css += `  --bp-color-${semanticToken}: var(--bp-${colorName}-${step});\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate additional utility tokens (focus, opacity, z-index, etc.)
 */
export function generateUtilityCSS(config: ThemeConfig): string {
  let css = '/* Utility tokens */\n:root {\n';

  // Focus ring
  if (config.focus) {
    css += `\n  /* Focus indicators */\n`;
    css += `  --bp-focus-width: ${config.focus.width}px;\n`;
    css += `  --bp-focus-offset: ${config.focus.offset}px;\n`;
    css += `  --bp-focus-style: ${config.focus.style};\n`;
    css += `  --bp-focus-ring: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);\n`;
  }

  // Z-index
  if (config.zIndex) {
    css += `\n  /* Z-index scale */\n`;
    for (const [name, value] of Object.entries(config.zIndex)) {
      css += `  --bp-z-${name}: ${value};\n`;
    }
  }

  // Opacity
  if (config.opacity) {
    css += `\n  /* Opacity scale */\n`;
    for (const [name, value] of Object.entries(config.opacity)) {
      css += `  --bp-opacity-${name}: ${value};\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate media query for reduced motion
 */
export function generateReducedMotionCSS(config: ThemeConfig): string {
  return `
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --bp-transition-fast: 0ms;
    --bp-transition-base: 0ms;
    --bp-transition-slow: 0ms;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
}

/**
 * Generate high contrast mode support
 */
export function generateHighContrastCSS(config: ThemeConfig): string {
  if (!config.accessibility?.highContrast) return '';

  return `
/* High contrast mode support */
@media (prefers-contrast: more) {
  :root {
    --bp-color-text: black;
    --bp-color-background: white;
    --bp-border-width: 2px;
    --bp-focus-width: 3px;
  }
  
  [data-theme="dark"] {
    --bp-color-text: white;
    --bp-color-background: black;
  }
}
`;
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

### Phase 1: Core Infrastructure (Week 1)

1. Theme builder TypeScript API
2. OKLCH color utilities
3. Theme config schema + types
4. CSS generation functions
5. TypeScript type generation
6. Basic generation script (for Phase 2 testing)

### Phase 2: Theme Generation & Visual QA (Week 1)

1. Convert light.css → theme.config.ts
2. Generate primitives.css from config
3. Visual QA: Review all color scales in browser
4. Adjust OKLCH curves based on visual review
5. Generate dark.css theme
6. Visual QA: Compare light/dark side-by-side

### Phase 3: Component Validation (Week 1-2)

1. Build `bp theme preview` for ongoing visual feedback
2. Update button component (all variants + states)
3. Update input component (validation states)
4. Verify all semantic tokens work as expected
5. Update remaining components

### Phase 4: CLI Tooling (Week 2)

1. `bp theme generate` (polish existing script)
2. `bp theme validate` (contrast checking)
3. `bp theme create` (interactive)
4. High-contrast theme generation

### Phase 5: Documentation & QA (Week 2-3)

1. Document theme customization
2. Generate token usage guidelines
3. Add theme switcher to demo
4. Accessibility audit (screen readers, colorblind sim)
5. Create theme examples

### Phase 6: Advanced Features (Week 4+)

1. Component-level tokens
2. Theme interpolation
3. P3 gamut support
4. CSS `light-dark()` function

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

1. **Component tokens in v1?** Include basic component tokens or defer to Phase 5?
2. **Theme variants?** Support more than just light/dark (e.g., colorblind-friendly modes)?
3. **CSS Layers?** Use `@layer` for primitive/semantic/component separation?
4. **Export formats?** Generate TypeScript types? JSON for docs? Figma tokens?
5. **Color interpolation?** Support theme blending/transitions?

---

## Design System Improvements (Addressed)

This plan has been updated to address critical design system quality issues:

### ✅ **OKLCH Storage Format**

- Changed from space-separated values to complete color values
- Uses `@supports` for progressive enhancement
- Hex fallback in base declaration, OKLCH in modern browsers

### ✅ **Dark Mode Color Science**

- Added `darkMode.chromaMultiplier` (0.85) to reduce saturation on dark backgrounds
- Added `darkMode.contrastBoost` (1.1) for better readability
- Dark theme uses lighter color steps (400 instead of 500)

### ✅ **Complete Semantic Color Set**

- Added: `surfaceElevated`, `surfaceSubdued`, `textInverse`
- Added: `primaryActive`, `borderStrong`, `focus`
- Added: `info` color for informational UI
- All semantic colors mapped in both light and dark themes

### ✅ **Consistent Border Radius Scale**

- Fixed progression: 0, 2, 4, 8, 12, 16, 24, 9999
- Now follows 2x pattern similar to spacing scale
- Added `3xl` (24px) for large cards/modals

### ✅ **Motion Token Improvements**

- Updated durations: 150ms (fast), 300ms (normal), 500ms (slow)
- Added combined `transitions` presets with duration + easing
- Added `@media (prefers-reduced-motion)` support

### ✅ **Focus Ring Tokens**

- Added dedicated `focus` config with width, offset, style
- CSS custom properties for `--bp-focus-ring`
- Accessibility-critical for keyboard navigation

### ✅ **Expanded Contrast Validation**

- Text contrast (4.5:1 AA)
- UI component contrast (3.0:1 for borders, icons)
- Interactive state contrast (hover/active transitions)
- Focus indicator contrast (against both background AND element)
- Validates all foreground/background combinations

### ✅ **Additional Token Categories**

- **Z-index scale**: dropdown, sticky, overlay, modal, popover, tooltip
- **Opacity scale**: disabled, hover, overlay, subtle
- **Breakpoints**: sm, md, lg, xl, 2xl (640px - 1536px)
- **Typography weights**: normal, medium, semibold, bold
- **Line heights**: Expanded from 3 to 6 values (none, tight, snug, normal, relaxed, loose)

### ✅ **Accessibility Features**

- `colorBlindSafe` flag with `minHueDifference` (60°)
- `highContrast` support via `@media (prefers-contrast: more)`
- Comprehensive WCAG contrast validation
- Focus indicator requirements

### ✅ **Build-time Utilities**

- `generateUtilityCSS()` for focus, z-index, opacity tokens
- `generateReducedMotionCSS()` for animation preferences
- `generateHighContrastCSS()` for high contrast mode

---

## References

- [culori documentation](https://culorjs.org/)
- [OKLCH in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
