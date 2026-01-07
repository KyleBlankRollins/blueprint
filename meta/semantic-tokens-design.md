# Design: Semantic-Only Token Output

## Status

**Proposed** | January 2026

## Problem

Blueprint components use CSS custom properties like `--bp-color-primary` and `--bp-color-text`. Theme plugins can define arbitrary color scales (e.g., `vandarPoelBlue`, `sulphurYellow`) which get emitted as primitive tokens (`--bp-vandarPoelBlue-500`).

This creates a disconnect:

1. **Components don't consume primitives** — No component uses `--bp-vandarPoelBlue-500` directly
2. **Themes aren't interchangeable** — If Theme A defines `coral` and Theme B defines `salmon`, switching themes breaks any code that referenced `--bp-coral-500`
3. **Broken tokens after merges** — When we merged Wada Sanzo colors into blueprint-core, components referencing removed color scales broke silently

The theme system is overengineered for flexibility we don't need, at the cost of reliability we do need.

## Solution

**Constrain CSS output to semantic tokens only.**

Theme plugins continue to define colors internally for ergonomics, but the generated CSS only emits the semantic tokens that components actually consume.

### Before (Current)

```css
/* Generated primitives (components don't use these) */
:root {
  --bp-vandarPoelBlue-50: oklch(...);
  --bp-vandarPoelBlue-100: oklch(...);
  /* ... 11 steps × N colors = lots of unused tokens */
  --bp-vandarPoelBlue-950: oklch(...);
}

/* Semantic tokens (components use these) */
:root {
  --bp-color-primary: var(--bp-vandarPoelBlue-500);
  --bp-color-primary-hover: var(--bp-vandarPoelBlue-600);
}
```

### After (Proposed)

```css
/* Semantic tokens only */
:root {
  --bp-color-primary: oklch(0.4025 0.0836 233.38);
  --bp-color-primary-hover: oklch(0.35 0.0836 233.38);
  --bp-color-text: oklch(0.15 0.02 240);
  /* ... only tokens components actually use */
}
```

## Benefits

1. **Themes are truly interchangeable** — Any theme that implements `SemanticTokens` works with any Blueprint component
2. **Smaller CSS output** — ~20 semantic tokens vs ~60+ primitive tokens per theme
3. **Build-time validation** — Missing semantic tokens fail the build, not silently break at runtime
4. **Clear contract** — The `SemanticTokens` interface IS the public API

## Changes Required

### 1. Update `generateCSS.ts`

Remove `generatePrimitivesCSS()` from the default output pipeline. Semantic tokens should resolve to direct OKLCH values, not `var()` references to primitives.

```typescript
// Before: emits var(--bp-vandarPoelBlue-500)
// After:  emits oklch(0.4025 0.0836 233.38)
```

### 2. Make `SemanticTokens` fully required

Update `source/themes/core/types.ts` to remove optional markers from semantic tokens that components depend on:

```typescript
export interface SemanticTokens<TColorRef = ColorRef | string> {
  // All color tokens required (no ?)
  background: TColorRef;
  surface: TColorRef;
  surfaceElevated: TColorRef;
  surfaceSubdued: TColorRef;
  text: TColorRef;
  textStrong: TColorRef; // Remove ?
  textMuted: TColorRef;
  textInverse: TColorRef;
  primary: TColorRef;
  primaryHover: TColorRef;
  primaryActive: TColorRef;
  success: TColorRef;
  warning: TColorRef;
  error: TColorRef;
  info: TColorRef;
  border: TColorRef;
  borderStrong: TColorRef;
  focus: TColorRef;

  // Non-color tokens (keep optional or move to separate interface)
  borderWidth?: string;
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
  shadowXl?: string;
}
```

### 3. Add build-time validation

Enforce that all required semantic tokens are provided before generating CSS. Fail fast with clear errors:

```
Error: Theme 'my-theme' is missing required semantic tokens:
  - textStrong
  - surfaceElevated
```

### 4. Update theme plugin authoring guide

Document that:

- `builder.addColor()` is for internal convenience only
- Primitive colors are NOT emitted to CSS
- All `SemanticTokens` fields must be mapped in `addThemeVariant()`

### 5. Audit existing components

Run `bp validate tokens` against all components to ensure they only use semantic tokens. Any component using a primitive token is a bug.

## What Theme Authors Lose

Theme plugins **cannot** expose arbitrary custom colors for external consumption. This is intentional.

If a consumer needs `--bp-accentTeal-400`, that's either:

- A component concern (add it as a component-level token)
- A signal that `SemanticTokens` needs a new field (add `accent`, `accentHover`, etc.)

## Open Questions

1. **Should we keep primitive output as an opt-in?** Some advanced use cases might want access to the full color scale. Could add a `emitPrimitives: true` flag.
   - No, not now. If there's a need in the future, we can add it.

2. **Do we need more semantic tokens?** Current set covers most UI needs, but we may discover gaps. Adding tokens is non-breaking.
   - We can add more as needed.

3. **What beyond colors should be semantic tokens?**

   Currently `utilities.css` defines many tokens that are **universal** (same across all themes). But some should arguably be **semantic** (theme-specific). Let's categorize:

   ### Currently Theme-Specific (in SemanticTokens)
   - ✅ Colors (all `--bp-color-*`)
   - ✅ Shadows (`shadowSm`, `shadowMd`, `shadowLg`, `shadowXl`)
   - ✅ Border width (`borderWidth`)

   ### Should Become Theme-Specific

   **Border Radius** — Different themes have different personalities (sharp vs rounded)
   - Current: Universal scale in utilities.css
   - Proposed: Add to SemanticTokens as `borderRadius`, `borderRadiusLarge`, `borderRadiusFull`
   - Rationale: A "sharp" theme wants 0-2px radii, a "soft" theme wants 8-16px radii

   **Spacing** — Compact vs spacious themes
   - Current: Universal scale in utilities.css
   - Proposed: Keep universal scale, but add semantic overrides? Or stay universal?
   - Concern: Changing spacing affects layout significantly. Maybe too dangerous for themes to override.
   - Decision: **Keep universal for now.** Spacing is structural, not stylistic.

   **Typography** — Font families, sizes, weights, line heights
   - Current: Universal scale in utilities.css
   - Proposed: Add semantic overrides for high-level choices
   - Rationale: Typography has a **major** effect on theme personality. A technical theme wants monospace, an editorial theme wants serif, a modern theme wants geometric sans.
   - Approach: Keep the universal scale (`--bp-font-size-xs` through `--bp-font-size-4xl`) but add semantic tokens that themes can override:
     - `fontFamily` — Primary UI font (default: system sans)
     - `fontFamilyMono` — Code/technical font (default: system mono)
     - `fontFamilyHeading` — Display/heading font (default: same as body, but themes can differentiate)
   - This allows themes to define typography personality while components still use the universal size/weight scales.

   ### Should Stay Universal (Infrastructure)

   **Motion** — Durations, easings, transitions
   - Keep universal. Motion should be consistent for predictable UX.
   - `prefers-reduced-motion` already handles accessibility.

   **Focus indicators** — Width, offset, style
   - Keep universal. Accessibility requirement, must be consistent.

   **Z-index** — Layering scale
   - Keep universal. Essential for stacking to work correctly.

   **Opacity** — Standard opacity values
   - Keep universal. Consistent transparency aids predictability.

   **Breakpoints** — Responsive design breakpoints
   - Keep universal. Responsive behavior must be consistent.

   ### Recommendation

   Expand `SemanticTokens` to include:

   ```typescript
   export interface SemanticTokens<TColorRef = ColorRef | string> {
     // Colors (existing)
     background: TColorRef;
     surface: TColorRef;
     // ... all existing color tokens

     // Typography
     fontFamily: string; // Primary UI font (e.g., system-ui, serif, custom)
     fontFamilyMono: string; // Code/technical font
     fontFamilyHeading: string; // Display/heading font (can match body or differ)

     // Borders
     borderWidth: string; // e.g., '1px' or '2px'
     borderRadius: string; // Default radius (e.g., '4px')
     borderRadiusLarge: string; // Larger radius (e.g., '8px')
     borderRadiusFull: string; // Full/pill shape (e.g., '9999px')

     // Shadows (existing)
     shadowSm: string;
     shadowMd: string;
     shadowLg: string;
     shadowXl: string;
   }
   ```

   This gives themes control over:
   - Color palette (already have)
   - Typography personality (font families for UI, code, headings)
   - Border styling (width + radius = theme personality)
   - Elevation/depth (shadows)

   Everything else (spacing, typography, motion, z-index) stays universal as infrastructure tokens.

## Files to Modify

- `source/themes/generator/generateCSS.ts` — Stop emitting primitives
- `source/themes/core/types.ts` — Make semantic tokens required
- `source/themes/builder/ThemeBuilder.ts` — Add validation
- `source/cli/commands/validate.ts` — Enhance token validation
- `source/docs/plugin-authoring-guide.md` — Update documentation
