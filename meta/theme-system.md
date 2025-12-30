# Theme System Research

Research into how major design systems and UI libraries handle theming to inform Blueprint's approach.

## Executive Summary

Most modern component libraries use **CSS custom properties** as the foundation for theming. The key differentiators are:

1. **Token architecture** - How tokens are organized (primitive → semantic → component)
2. **Theme switching** - CSS classes vs data attributes vs media queries
3. **Customization depth** - Full override vs constrained palettes
4. **Distribution** - CSS files, JS objects, or build-time generation

---

## Design Systems Analyzed

### 1. Radix UI / Radix Themes

**Approach:** CSS custom properties with semantic naming

**Color System:**

- Uses a 12-step color scale (1-12) for each color
- Steps have semantic meaning: 1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solid, 11-12 text
- Colors defined as CSS custom properties: `--gray-1`, `--gray-12`, `--accent-9`
- Automatic alpha variants: `--gray-a1` through `--gray-a12`

**Theme Switching:**

```html
<div
  class="radix-themes"
  data-accent-color="blue"
  data-gray-color="slate"
  data-radius="medium"
></div>
```

**Spacing:** Fixed scale (1-9) mapped to rem values
**Animations:** Not tokenized, uses CSS keyframes directly

**Strengths:**

- 12-step scale provides excellent contrast ratios
- Semantic steps make color selection intuitive
- Data attributes make theme switching trivial

**Weaknesses:**

- Large CSS bundle (all 12 steps for every color)
- Learning curve for the step system

---

### 2. Tailwind CSS

**Approach:** Utility-first with build-time token injection

**Color System:**

- Numeric scale: `gray-50` through `gray-950`
- Configured in `tailwind.config.js`, compiled to utilities
- No runtime theming (requires rebuild)

**Theme Switching:**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // or with full scale
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

**Dark Mode:**

```html
<div class="bg-white dark:bg-gray-900"></div>
```

Uses `prefers-color-scheme` or manual class toggle

**Spacing:** Numeric scale (0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64)
**Animations:** Predefined set (`animate-spin`, `animate-pulse`, etc.)

**Strengths:**

- Excellent DX with IDE autocomplete
- Small production bundles (purged)
- Highly customizable

**Weaknesses:**

- No runtime theme switching without CSS variables
- Requires build step for customization

---

### 3. Chakra UI

**Approach:** JavaScript theme object with CSS-in-JS

**Color System:**

```js
const theme = {
  colors: {
    brand: {
      50: '#f5fee5',
      100: '#e1fbb4',
      // ... through 900
    },
  },
};
```

**Theme Switching:**

```jsx
<ChakraProvider theme={customTheme}>
  <ColorModeProvider>
```

**Semantic Tokens:**

```js
const theme = {
  semanticTokens: {
    colors: {
      'bg-surface': { default: 'gray.50', _dark: 'gray.900' },
      'text-primary': { default: 'gray.900', _dark: 'gray.50' },
    },
  },
};
```

**Spacing:** Based on 4px grid (1 = 4px, 2 = 8px, etc.)
**Animations:** JS-based with Framer Motion integration

**Strengths:**

- Full TypeScript support
- Component-level style overrides
- Semantic tokens bridge primitive and usage

**Weaknesses:**

- Runtime overhead
- JavaScript dependency for theming

---

### 4. Material Design 3 (Material You)

**Approach:** Dynamic color with tonal palettes

**Color System:**

- **Key colors:** Primary, Secondary, Tertiary, Error, Neutral
- **Tonal palettes:** Each key color generates 13 tones (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100)
- **Dynamic theming:** Extract colors from images

**Token Naming:**

```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container
--md-sys-color-surface
--md-sys-color-on-surface
```

**Theme Generation:**
Uses algorithm to generate entire palette from 1-5 source colors

**Spacing:** 4dp baseline grid
**Animations:** Motion tokens (`--md-sys-motion-duration-short`, `--md-sys-motion-easing-standard`)

**Strengths:**

- Scientific color contrast
- Dynamic theming from images
- Comprehensive token system

**Weaknesses:**

- Complex to implement fully
- Requires understanding of color science

---

### 5. Shadcn/ui

**Approach:** CSS custom properties with HSL values

**Color System:**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

**Usage:**

```css
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

**Why HSL?**

- Easy to create variations: `hsl(var(--primary) / 0.5)` for 50% opacity
- Can adjust lightness programmatically

**Spacing:** Uses Tailwind's spacing scale
**Border Radius:** Single token `--radius` with variants (`--radius-sm`, `--radius-lg`)

**Strengths:**

- Minimal footprint
- Easy to customize
- Copy-paste friendly

**Weaknesses:**

- Limited color scale (no numbered steps)
- Manual dark mode definition

---

### 6. IBM Carbon Design System

**Approach:** Layered token architecture

**Token Layers:**

1. **Global tokens** - Raw values (`$carbon--blue-60: #0f62fe`)
2. **Alias tokens** - Semantic meaning (`$interactive-01: $carbon--blue-60`)
3. **Component tokens** - Specific usage (`$button-primary: $interactive-01`)

**Color System:**

```scss
// 10-step scale
$blue-10: #edf5ff;
$blue-20: #d0e2ff;
// ... through
$blue-100: #001141;
```

**Theme Switching:**

```html
<div data-carbon-theme="g100"></div>
```

Themes: white, g10, g90, g100

**Spacing:** 2px baseline with mini unit (8px)
**Motion:** Tokenized durations and easings

**Strengths:**

- Enterprise-ready
- Excellent documentation
- Strict accessibility compliance

**Weaknesses:**

- Complex token system
- Heavy SCSS dependency

---

### 7. Open Props

**Approach:** CSS custom properties as a primitive library

**Color System:**

```css
--gray-0: #f8f9fa;
--gray-1: #f1f3f5;
/* 0-12 scale per color */

/* Semantic (opt-in) */
--surface-1: var(--gray-0);
--text-1: var(--gray-9);
```

**Adaptive Colors:**

```css
--gray-adaptive-0: light-dark(var(--gray-0), var(--gray-12));
```

**Spacing:**

```css
--size-1: 0.25rem;
--size-2: 0.5rem;
/* up to --size-15 */
```

**Animations:**

```css
--ease-1: cubic-bezier(0.25, 0, 0.5, 1);
--ease-in-1: cubic-bezier(0.25, 0, 1, 1);
--animation-fade-in: fade-in 0.5s var(--ease-3);
```

**Strengths:**

- Zero JavaScript
- Modular imports
- Modern CSS features (`light-dark()`)

**Weaknesses:**

- No component tokens
- Requires building your own semantic layer

---

### 8. Ant Design

**Approach:** Design tokens with ConfigProvider

**Color System:**

- Algorithm-generated palettes from seed colors
- 10-step scale per color

**Theme Configuration:**

```jsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#00b96b',
      borderRadius: 2,
    },
    components: {
      Button: {
        colorPrimary: '#00b96b',
      },
    },
  }}
>
```

**Token Categories:**

- Seed tokens (source of truth)
- Map tokens (derived)
- Alias tokens (semantic)
- Component tokens (specific)

**Strengths:**

- Comprehensive token system
- Component-level overrides
- Algorithm-based generation

**Weaknesses:**

- Heavy JavaScript runtime
- Complex architecture

---

## Comparison Matrix

| Feature         | Radix     | Tailwind | Chakra    | Material | Shadcn   | Carbon    | Open Props   |
| --------------- | --------- | -------- | --------- | -------- | -------- | --------- | ------------ |
| Token Format    | CSS vars  | Config   | JS Object | CSS vars | CSS vars | SCSS/CSS  | CSS vars     |
| Color Scale     | 12-step   | 11-step  | 10-step   | 13-tone  | Semantic | 10-step   | 13-step      |
| Runtime Theming | ✅        | ❌       | ✅        | ✅       | ✅       | ✅        | ✅           |
| Dark Mode       | Data attr | Class    | Provider  | Scheme   | Class    | Data attr | light-dark() |
| Bundle Size     | Medium    | Small    | Large     | Medium   | Tiny     | Large     | Small        |
| JS Required     | No        | Build    | Yes       | Optional | No       | No        | No           |
| Customization   | High      | High     | High      | Medium   | High     | Medium    | High         |

---

## Key Patterns for Blueprint

### 1. Token Architecture (Recommended: 3-Layer)

```
Primitive Tokens → Semantic Tokens → Component Tokens
     ↓                   ↓                  ↓
  --blue-500         --color-primary    --button-bg
  --space-4          --spacing-md       --button-padding
```

**Primitive tokens** (optional exposure):

```css
/* Raw values - users rarely touch these */
--bp-blue-50: #eff6ff;
--bp-blue-500: #3b82f6;
--bp-blue-900: #1e3a8a;
```

**Semantic tokens** (primary API):

```css
/* Meaningful names - main customization point */
--bp-color-primary: var(--bp-blue-500);
--bp-color-primary-hover: var(--bp-blue-600);
--bp-color-background: var(--bp-gray-50);
--bp-color-surface: var(--bp-white);
--bp-color-text: var(--bp-gray-900);
--bp-color-text-muted: var(--bp-gray-600);
```

**Component tokens** (advanced customization):

```css
/* Specific overrides - power users only */
--bp-button-bg: var(--bp-color-primary);
--bp-button-text: var(--bp-color-on-primary);
--bp-button-radius: var(--bp-radius-md);
```

### 2. Color Scale Recommendation

Use an **11-step scale** (50-950) for consistency with Tailwind ecosystem:

```css
--bp-{color}-50   /* Lightest - subtle backgrounds */
--bp-{color}-100  /* Light backgrounds */
--bp-{color}-200  /* Hover states on light */
--bp-{color}-300  /* Active states on light */
--bp-{color}-400  /* Disabled text */
--bp-{color}-500  /* Base color */
--bp-{color}-600  /* Hover on base */
--bp-{color}-700  /* Active on base */
--bp-{color}-800  /* Dark variant */
--bp-{color}-900  /* Darkest */
--bp-{color}-950  /* Near black */
```

### 3. Theme Switching Strategy

**Recommended: Data attributes + CSS custom properties**

```css
/* Default (light) theme */
:root,
[data-theme='light'] {
  --bp-color-background: var(--bp-white);
  --bp-color-surface: var(--bp-gray-50);
  --bp-color-text: var(--bp-gray-900);
  --bp-color-primary: var(--bp-blue-500);
}

/* Dark theme */
[data-theme='dark'] {
  --bp-color-background: var(--bp-gray-950);
  --bp-color-surface: var(--bp-gray-900);
  --bp-color-text: var(--bp-gray-50);
  --bp-color-primary: var(--bp-blue-400);
}

/* System preference (optional) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Dark values */
  }
}
```

**Usage:**

```html
<html data-theme="dark">
  <!-- or -->
  <div data-theme="light" class="panel"></div>
</html>
```

### 4. Spacing System

**Recommended: Named scale with numeric base**

```css
/* Base unit: 4px */
--bp-spacing-0: 0;
--bp-spacing-px: 1px;
--bp-spacing-0.5: 0.125rem; /* 2px */
--bp-spacing-1: 0.25rem; /* 4px */
--bp-spacing-2: 0.5rem; /* 8px */
--bp-spacing-3: 0.75rem; /* 12px */
--bp-spacing-4: 1rem; /* 16px */
--bp-spacing-5: 1.25rem; /* 20px */
--bp-spacing-6: 1.5rem; /* 24px */
--bp-spacing-8: 2rem; /* 32px */
--bp-spacing-10: 2.5rem; /* 40px */
--bp-spacing-12: 3rem; /* 48px */
--bp-spacing-16: 4rem; /* 64px */

/* Semantic aliases */
--bp-spacing-xs: var(--bp-spacing-1);
--bp-spacing-sm: var(--bp-spacing-2);
--bp-spacing-md: var(--bp-spacing-4);
--bp-spacing-lg: var(--bp-spacing-6);
--bp-spacing-xl: var(--bp-spacing-8);
```

### 5. Animation/Motion Tokens

```css
/* Durations */
--bp-duration-instant: 0ms;
--bp-duration-fast: 100ms;
--bp-duration-normal: 200ms;
--bp-duration-slow: 300ms;
--bp-duration-slower: 500ms;

/* Easings */
--bp-ease-linear: linear;
--bp-ease-in: cubic-bezier(0.4, 0, 1, 1);
--bp-ease-out: cubic-bezier(0, 0, 0.2, 1);
--bp-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--bp-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Composite transitions */
--bp-transition-fast: var(--bp-duration-fast) var(--bp-ease-out);
--bp-transition-normal: var(--bp-duration-normal) var(--bp-ease-out);
--bp-transition-slow: var(--bp-duration-slow) var(--bp-ease-in-out);
```

### 6. Border Radius

```css
--bp-radius-none: 0;
--bp-radius-sm: 0.125rem; /* 2px */
--bp-radius-md: 0.375rem; /* 6px */
--bp-radius-lg: 0.5rem; /* 8px */
--bp-radius-xl: 0.75rem; /* 12px */
--bp-radius-2xl: 1rem; /* 16px */
--bp-radius-full: 9999px;
```

### 7. Shadows

```css
--bp-shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--bp-shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--bp-shadow-md:
  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--bp-shadow-lg:
  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--bp-shadow-xl:
  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## Recommendations for Blueprint

### Phase 1: Foundation (Current)

1. **Keep semantic tokens** in `light.css` as the primary API
2. **Add primitive color scales** (50-950) as optional layer
3. **Define dark theme** using data attribute pattern
4. **Add motion tokens** (durations, easings)

### Phase 2: Theming Infrastructure

1. **Create theme presets** (light, dark, high-contrast)
2. **Document customization patterns** for users
3. **Add component tokens** for advanced overrides
4. **Migrate to OKLCH** for perceptually uniform colors with hex fallbacks

### Phase 3: Advanced Features

1. **Theme builder tool** (generate palette from brand color)
2. **CSS-only theme switching** (no JS required)
3. **Multiple theme support** (nested themes for panels, modals)
4. **Print theme** optimization

### File Organization

```
source/themes/
├── primitives/
│   ├── colors.css      # Raw color scales (50-950)
│   ├── spacing.css     # Spacing scale
│   ├── typography.css  # Font sizes, line heights
│   └── motion.css      # Durations, easings
├── semantic/
│   ├── light.css       # Light theme semantic tokens
│   ├── dark.css        # Dark theme semantic tokens
│   └── high-contrast.css
├── components/
│   └── tokens.css      # Component-specific overrides
└── index.css           # Main entry (imports all)
```

---

## Modern Color Spaces: OKLCH vs HSL vs Hex

### OKLCH (Recommended for Modern Browsers)

**What is OKLCH?**

- **Perceptually uniform** color space (unlike HSL/RGB)
- **O**k **L**ightness **C**hroma **H**ue
- Part of CSS Color Module Level 4
- Browser support: Chrome 111+, Firefox 113+, Safari 15.4+ (March 2023+)

**Why OKLCH is superior to HSL:**

1. **Perceptual uniformity** - Same lightness value = same perceived brightness across all hues
2. **Predictable manipulation** - Adjusting lightness/chroma produces expected results
3. **Wider gamut** - Access to P3 and Rec2020 color spaces
4. **Better accessibility** - Consistent contrast ratios when adjusting lightness
5. **Simpler math** - Linear interpolation works correctly

**Example comparison:**

```css
/* HSL - Different hues at L=50% have different perceived brightness */
hsl(0 100% 50%)   /* Red appears bright */
hsl(240 100% 50%) /* Blue appears dark */

/* OKLCH - L=0.5 looks equally bright for all hues */
oklch(0.5 0.2 0)    /* Red at 50% lightness */
oklch(0.5 0.2 240)  /* Blue at 50% lightness - same perceived brightness! */
```

**OKLCH Syntax:**

```css
/* Format: oklch(lightness chroma hue / alpha) */
--primary: 0.5 0.2 240; /* Store as space-separated values */

/* Usage: */
background-color: oklch(var(--primary)); /* Full opacity */
background-color: oklch(var(--primary) / 0.5); /* 50% opacity */
background-color: oklch(
  from oklch(var(--primary)) l c h / 0.5
); /* Using relative color syntax */
```

**Creating color scales with OKLCH:**

```css
/* Single source color */
--blue-base: 0.55 0.15 250;

/* Algorithmically generate scale by adjusting lightness */
--blue-50: oklch(0.95 0.02 250); /* Very light */
--blue-100: oklch(0.9 0.04 250);
--blue-200: oklch(0.8 0.06 250);
--blue-300: oklch(0.7 0.09 250);
--blue-400: oklch(0.65 0.12 250);
--blue-500: oklch(0.55 0.15 250); /* Base */
--blue-600: oklch(0.5 0.15 250);
--blue-700: oklch(0.45 0.14 250);
--blue-800: oklch(0.35 0.12 250);
--blue-900: oklch(0.25 0.1 250);
--blue-950: oklch(0.15 0.06 250); /* Very dark */
```

**Fallback strategy:**

```css
/* Provide hex fallback for older browsers */
--bp-color-primary: #3b82f6; /* Fallback */
--bp-color-primary: oklch(0.55 0.15 250); /* Modern browsers */

/* Or use @supports */
@supports (color: oklch(0 0 0)) {
  :root {
    --bp-color-primary: oklch(0.55 0.15 250);
  }
}
```

### Understanding Color Space Families

**LAB family (Cartesian coordinates):**

- **LAB** - CIE L\*a\*b\*, L=lightness, a=green↔red axis, b=blue↔yellow axis
- **OKLAB** - Improved LAB with better perceptual uniformity (developed by Björn Ottosson, 2020)

**LCH family (Cylindrical/polar coordinates):**

- **LCH** - Cylindrical representation of LAB (L=lightness, C=chroma, H=hue)
- **OKLCH** - Cylindrical representation of OKLAB

**Key difference:** LAB/OKLAB use Cartesian coordinates (a, b axes), while LCH/OKLCH use polar coordinates (chroma, hue angle). They represent the same color spaces, just in different coordinate systems.

**When to use each:**

```css
/* OKLCH - For design tokens (easier to reason about hue and saturation) */
--primary: oklch(0.55 0.15 250); /* L=55%, C=0.15, H=250° */

/* OKLAB - For color mixing and manipulation */
--mixed: color-mix(in oklab, var(--color-a), var(--color-b));

/* LAB - Legacy, prefer OKLAB */
--color: lab(50% -20 30); /* L=50%, a=-20, b=30 */

/* LCH - Legacy, prefer OKLCH */
--color: lch(50% 40 120); /* L=50%, C=40, H=120° */
```

### Comparison: All Modern Color Spaces

| Feature               | OKLCH             | OKLAB             | LCH               | LAB               | HSL              | Hex              |
| --------------------- | ----------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- |
| Perceptual uniformity | ✅ Excellent      | ✅ Excellent      | ⚠️ Good           | ⚠️ Good           | ❌ Poor          | ❌ Poor          |
| Lightness accuracy    | ✅ Best           | ✅ Best           | ⚠️ Good           | ⚠️ Good           | ❌ Inconsistent  | N/A              |
| Wide gamut support    | ✅ Yes            | ✅ Yes            | ✅ Yes            | ✅ Yes            | ❌ sRGB only     | ❌ sRGB only     |
| Coordinate system     | Polar (H, C)      | Cartesian (a, b)  | Polar (H, C)      | Cartesian (a, b)  | Polar (H, S)     | N/A              |
| Hue rotation          | ✅ Easy           | ❌ Complex        | ✅ Easy           | ❌ Complex        | ✅ Easy          | ❌ N/A           |
| Color mixing          | ⚠️ Good           | ✅ Excellent      | ⚠️ Good           | ✅ Excellent      | ❌ Poor          | ❌ Poor          |
| Design tokens         | ✅ Ideal          | ⚠️ Hard to reason | ✅ Good           | ⚠️ Hard to reason | ⚠️ Flawed        | ✅ Familiar      |
| Opacity variants      | ✅ Yes            | ✅ Yes            | ✅ Yes            | ✅ Yes            | ✅ Yes           | ❌ No            |
| Browser support       | ⚠️ Modern (2023+) | ⚠️ Modern (2023+) | ⚠️ Modern (2023+) | ⚠️ Modern (2023+) | ✅ Universal     | ✅ Universal     |
| Human-readable        | ⚠️ Learning curve | ❌ Complex        | ⚠️ Learning curve | ❌ Complex        | ✅ Intuitive     | ✅ Familiar      |
| Predictable scaling   | ✅ Linear         | ✅ Linear         | ⚠️ Good           | ⚠️ Good           | ❌ Unpredictable | ❌ Unpredictable |

**Recommendation hierarchy:**

1. **OKLCH** - Best for design tokens and theme variables (human-friendly hue/chroma)
2. **OKLAB** - Best for color mixing and gradients (perceptually uniform mixing)
3. **LCH/LAB** - Older versions, prefer OK variants
4. **HSL** - Avoid (perceptually non-uniform)
5. **Hex** - Fallbacks only

### Recommendation for Blueprint

**Use OKLCH with hex fallbacks:**

```css
/* Primitive colors - store as space-separated OKLCH values */
--bp-blue-50-fallback: #eff6ff;
--bp-blue-50: 0.95 0.02 250;

--bp-blue-500-fallback: #3b82f6;
--bp-blue-500: 0.55 0.15 250;

/* Semantic tokens with progressive enhancement */
:root {
  --bp-color-primary: var(--bp-blue-500-fallback);
}

@supports (color: oklch(0 0 0)) {
  :root {
    --bp-color-primary: var(--bp-blue-500);
  }
}

/* Usage in components */
.button {
  background-color: oklch(var(--bp-color-primary));
}

/* Opacity variants */
.button:hover {
  background-color: oklch(var(--bp-color-primary) / 0.9);
}
```

**Color mixing with OKLAB:**

```css
/* For gradients and color blending, use OKLAB */
.gradient {
  background: linear-gradient(
    in oklab,
    oklch(var(--color-start)),
    oklch(var(--color-end))
  );
}

/* Color mixing for hover states */
.button:hover {
  background: color-mix(in oklab, oklch(var(--bp-color-primary)), white 10%);
}
```

**Benefits for Blueprint:**

- Future-proof color system
- Better accessibility (predictable contrast)
- Easier to generate color scales programmatically
- Works with wide-gamut displays
- Perceptually accurate color mixing and gradients (via OKLAB)
- Still works in older browsers with fallbacks

---

## Open Questions

1. **OKLCH vs Hex?** OKLCH is superior but requires fallbacks for IE11/older browsers. Worth the complexity?
2. **Color scale generation?** Should we auto-generate 50-950 scales from a single OKLCH source color?
3. **How many color palettes?** Start with gray + primary? Add semantic colors (success, warning, error)?
4. **Component tokens?** Worth the complexity for v1?
5. **CSS layers?** Use `@layer` for specificity control?
6. **Container queries?** For responsive component tokens?
7. **P3 gamut colors?** Should we leverage wide-gamut colors for modern displays?

---

## References

- [Radix Colors](https://www.radix-ui.com/colors)
- [Tailwind CSS Theme](https://tailwindcss.com/docs/theme)
- [Chakra UI Theming](https://chakra-ui.com/docs/styled-system/theme)
- [Material Design 3 Color](https://m3.material.io/styles/color/overview)
- [Shadcn Theming](https://ui.shadcn.com/docs/theming)
- [Carbon Design Tokens](https://carbondesignsystem.com/guidelines/color/tokens/)
- [Open Props](https://open-props.style/)
- [Ant Design Tokens](https://ant.design/docs/react/customize-theme)
