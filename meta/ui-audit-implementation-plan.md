# UI Audit Implementation Plan

**Created:** January 29, 2026
**Based on:** [component-ui-audit.md](component-ui-audit.md)

---

## Overview

This plan organizes all fixes from the Blueprint Component UI Audit into actionable phases. Work is prioritized by impact on accessibility, usability, and visual consistency.

---

## Phase 1: Critical Accessibility Fixes (High Priority) ✅ COMPLETED

**Estimated effort:** 1-2 days
**Impact:** WCAG compliance, mobile usability
**Status:** Completed January 29, 2026

### 1.1 iOS Zoom Fix for Inputs ✅

**Problem:** Small input sizes (sm = 14px) trigger iOS zoom on focus
**Files modified:**

- [x] `source/components/input/input.style.ts`
- [x] `source/components/textarea/textarea.style.ts`
- [x] `source/components/select/select.style.ts`
- [x] `source/components/combobox/combobox.style.ts`
- [x] `source/components/number-input/number-input.style.ts`

**Implementation:**

```css
/* Add to each input component's small variant */
@media (max-width: 768px) {
  :host([size='sm']) input,
  :host([size='sm']) textarea,
  :host([size='sm']) select {
    font-size: 16px; /* Minimum to prevent iOS zoom */
  }
}
```

---

### 1.2 Dark Theme Primary Color Visibility ✅

**Problem:** Primary color (L=26%) is nearly invisible against dark background (L=15%)
**Files modified:**

- [x] `source/themes/plugins/blueprint-core/index.ts` (source)
- [x] `source/themes/generated/blueprint-core/dark.css` (generated)

**Changes:**

| Token                       | Current                  | New                      |
| --------------------------- | ------------------------ | ------------------------ |
| `--bp-color-primary`        | `oklch(0.26 0.07 233.4)` | `oklch(0.48 0.12 233.4)` |
| `--bp-color-primary-hover`  | `oklch(0.28 0.05 233.4)` | `oklch(0.44 0.10 233.4)` |
| `--bp-color-primary-active` | `oklch(0.32 0.03 233.4)` | `oklch(0.40 0.08 233.4)` |
| `--bp-color-focus`          | `oklch(0.26 0.07 233.4)` | `oklch(0.55 0.15 233.4)` |
| `--bp-color-info`           | `oklch(0.26 0.07 233.4)` | `oklch(0.48 0.12 233.4)` |

---

### 1.3 Light Theme Text-Muted Contrast ✅

**Problem:** `text-muted` at L=55% on L=89% background is borderline WCAG AA (~4:1)
**Files modified:**

- [x] `source/themes/plugins/blueprint-core/index.ts` (source)
- [x] `source/themes/generated/blueprint-core/light.css` (generated)

**Change:**

```css
/* Before */
--bp-color-text-muted: oklch(0.55 0.02 240);

/* After - Darker for 4.5:1 contrast */
--bp-color-text-muted: oklch(0.5 0.02 240);
```

---

### 1.4 Touch Target Sizes ✅

**Problem:** Interactive elements may be smaller than 44x44px on touch devices
**Files modified:**

- [x] `source/components/checkbox/checkbox.style.ts`
- [x] `source/components/radio/radio.style.ts`
- [x] `source/components/switch/switch.style.ts`
- [x] `source/components/pagination/pagination.style.ts`
- [x] `source/components/tag/tag.style.ts` (close button)

**Implementation:**

```css
/* Add touch target wrapper or minimum size */
@media (pointer: coarse) {
  :host {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## Phase 2: Theme Token Improvements (Medium Priority) ✅ COMPLETED

**Estimated effort:** 1-2 days
**Impact:** Consistency, design system coherence
**Status:** Completed January 29, 2026

### 2.1 Semantic Spacing Scale Adjustment ✅

**Problem:** Semantic spacing is too tight (md = 8px, should be 16px)
**Status:** COMPLETED - January 29, 2026
**Files modified:**

- [x] `source/themes/builder/defaults.ts` (DEFAULT_SPACING.semantic indexes)
- [x] `source/themes/generated/utilities.css` (regenerated)

| Token              | Before | After |
| ------------------ | ------ | ----- |
| `--bp-spacing-2xs` | 2px    | 4px   |
| `--bp-spacing-xs`  | 4px    | 8px   |
| `--bp-spacing-sm`  | 6px    | 12px  |
| `--bp-spacing-md`  | 8px    | 16px  |
| `--bp-spacing-lg`  | 12px   | 24px  |
| `--bp-spacing-xl`  | 20px   | 32px  |
| `--bp-spacing-2xl` | 32px   | 48px  |

---

### 2.2 Add Missing Semantic Tokens ✅

**Files modified:**

- [x] `source/themes/core/types.ts` (SemanticTokens interface)
- [x] `source/themes/generator/generateCSS.ts` (colorTokens list)
- [x] `source/themes/plugins/blueprint-core/index.ts` (light and dark values)
- [x] `source/themes/builder/defaults.ts` (heading line heights)

**New tokens added:**

```css
/* Secondary actions */
--bp-color-secondary, --bp-color-secondary-hover

/* Link colors */
--bp-color-link, --bp-color-link-hover, --bp-color-link-visited

/* Semantic hover states */
--bp-color-success-hover, --bp-color-warning-hover, --bp-color-error-hover, --bp-color-info-hover

/* Semantic backgrounds */
--bp-color-success-bg, --bp-color-warning-bg, --bp-color-error-bg, --bp-color-info-bg

/* Interactive overlays */
--bp-color-hover-overlay, --bp-color-active-overlay, --bp-color-selected-bg

/* Input-specific */
--bp-color-placeholder, --bp-color-input-bg, --bp-color-input-border

/* Heading line heights */
--bp-line-height-heading-sm: 1.3
--bp-line-height-heading-md: 1.25
--bp-line-height-heading-lg: 1.2
```

---

### 2.3 Dark Theme Warning Color Adjustment ✅

**Problem:** Warning color unchanged between themes, may be too bright in dark mode
**Status:** Completed in Phase 1.2
**Files to modify:**

- [ ] `source/themes/dark.css`

**Change:**

```css
/* Before */
--bp-color-warning: oklch(0.51 0.13 64.5);

/* After - Slightly darker for dark theme */
--bp-color-warning: oklch(0.45 0.11 64.5);
```

---

### 2.4 Add Heading Line Height Tokens ✅

**Problem:** Large headings need tighter line-height
**Files modified:**

- [x] `source/themes/builder/defaults.ts`

**Tokens added:**

```css
--bp-line-height-heading-lg: 1.2; /* For 3xl, 4xl */
--bp-line-height-heading-md: 1.25; /* For 2xl, xl */
--bp-line-height-heading-sm: 1.3; /* For lg, base */
```

---

## Phase 3: Component Behavior Fixes (Medium Priority) ✅ COMPLETED

**Estimated effort:** 2-3 days
**Impact:** Layout stability, polish
**Status:** Completed January 29, 2026

### 3.1 Remove Layout-Shifting Hover Effects ✅

**Problem:** `translateY(-2px)` on hover causes layout reflow
**Files modified:**

- [x] `source/components/button/button.style.ts`
- [x] `source/components/card/card.style.ts`

**Changes:**

- Removed `transform: translateY()` from hover states
- Button now uses `box-shadow` alone for hover feedback
- Card hover effects use shadow elevation changes only
- Added `box-shadow: inset` on button `:active` for pressed state

---

### 3.2 Fix Tabs Active State Layout Shift ✅

**Problem:** Active tab uses `translateY(1px)` causing layout shift
**Files modified:**

- [x] `source/components/tabs/tabs.style.ts`

**Changes:**

- Replaced `transform: translateY(1px)` with `opacity: 0.8` for active state
- No layout shift on tab press

---

### 3.3 Use Dedicated Hover Color Tokens ✅

**Problem:** Button uses `filter: brightness(1.1)` instead of dedicated hover tokens
**Files modified:**

- [x] `source/components/button/button.style.ts`

**Changes:**

- `success:hover` now uses `var(--bp-color-success-hover)`
- `error:hover` now uses `var(--bp-color-error-hover)`
- `warning:hover` now uses `var(--bp-color-warning-hover)`
- `info:hover` now uses `var(--bp-color-info-hover)`
- Removed all `filter: brightness(1.1)` usage

---

### 3.4 Move Hardcoded JS Values to CSS Variables ⏭️ SKIPPED

**Problem:** Tooltip delays and dropdown distances are hardcoded in JS
**Status:** SKIPPED BY DESIGN

**Rationale:** The tooltip, dropdown, and popover components already expose `delay` and `distance` as properties (e.g., `<bp-tooltip delay="300">`). This is the idiomatic approach for web components, giving consumers direct control. Reading CSS custom properties would add complexity without benefit.

---

### Bonus: 4.6 Card Line Height Token ✅

**Problem:** Card body used hardcoded `line-height: 1.6`
**Files modified:**

- [x] `source/components/card/card.style.ts`

**Changes:**

- Changed to `line-height: var(--bp-line-height-relaxed)`

---

## Phase 4: Visual Polish (Low Priority) ✅ COMPLETED

**Estimated effort:** 2-3 days
**Impact:** Aesthetic improvements, micro-interactions
**Status:** Completed January 30, 2026

### 4.1 Add Inset Shadow to Input Fields ✅

**Problem:** Inputs lack depth/inset feel
**Files modified:**

- [x] `source/components/input/input.style.ts`
- [x] `source/components/textarea/textarea.style.ts`
- [x] `source/components/select/select.style.ts`

**Changes:**

- Added `box-shadow: inset 0 1px 2px oklch(0 0 0 / 0.05)` to all form inputs

---

### 4.2 Add Button Active/Pressed State ✅

**Problem:** Missing pressed visual depth
**Status:** Completed in Phase 3.1

**Changes:**

- Button `:active` state now has `box-shadow: inset 0 2px 4px oklch(0 0 0 / 0.15)`

---

### 4.3 Add Micro-Interactions ✅

**Problem:** Form controls need satisfying feedback animations
**Files modified:**

- [x] `source/components/checkbox/checkbox.style.ts`
- [x] `source/components/radio/radio.style.ts`

**Changes:**

- Checkbox checkmark uses `--bp-ease-bounce` easing for satisfying pop-in
- Radio inner dot uses `--bp-ease-bounce` easing for satisfying pop-in
- Both start from `scale(0)` instead of `scale(0.5)` for more dramatic effect

---

### 4.4 Add Switch/Slider Thumb Shadow ✅

**Problem:** Thumbs lack grabbable appearance
**Files modified:**

- [x] `source/components/switch/switch.style.ts`
- [x] `source/components/slider/slider.style.ts`

**Changes:**

- Enhanced shadow to `0 1px 3px oklch(0 0 0 / 0.2), 0 1px 2px oklch(0 0 0 / 0.1)`
- More prominent shadow for grabbable appearance

---

### 4.5 Focus Outline Token Usage ✅

**Problem:** Some components hardcode focus outline
**Files modified:**

- [x] `source/components/tabs/tabs.style.ts`
- [x] `source/components/number-input/number-input.style.ts`
- [x] `source/components/notification/notification.style.ts`
- [x] `source/components/menu/menu.style.ts`
- [x] `source/components/file-upload/file-upload.style.ts`
- [x] `source/components/dropdown/dropdown.style.ts`
- [x] `source/components/breadcrumb/breadcrumb.style.ts`

**Changes:**

- Replaced `outline: 2px solid` with `outline: var(--bp-focus-width) var(--bp-focus-style)`
- Replaced `outline-offset: 2px` with `outline-offset: var(--bp-focus-offset)`

---

### 4.6 Use Line Height Token in Card ✅

**Problem:** Card body uses hardcoded line-height
**Status:** Completed in Phase 3 as bonus

**Changes:**

- Card body now uses `line-height: var(--bp-line-height-relaxed)`

```css
.body {
  line-height: 1.6;
}
```

---

## Phase 5: Consistency Standardization (Low Priority)

**Estimated effort:** 1-2 days
**Impact:** Developer experience, maintainability

### 5.1 Standardize Size Naming Convention

**Problem:** Mixed conventions: `sm/md/lg`, `small/medium/large`, `xs/sm/base/lg/xl`
**Decision needed:** Choose ONE convention and apply everywhere

**Recommended:** `xs | sm | md | lg | xl | 2xl`

**Files to audit and update:**

- [ ] All component `.ts` files with size props
- [ ] All component `.style.ts` files with size selectors
- [ ] Update Storybook stories for consistency

---

### 5.2 Shadow Elevation Consistency

**Ensure consistent usage:**

| State                   | Shadow Token     |
| ----------------------- | ---------------- |
| Resting                 | `--bp-shadow-sm` |
| Hover                   | `--bp-shadow-md` |
| Elevated (dropdowns)    | `--bp-shadow-lg` |
| High elevation (modals) | `--bp-shadow-xl` |

**Files to audit:**

- [ ] `source/components/dropdown/bp-dropdown.style.ts`
- [ ] `source/components/popover/bp-popover.style.ts`
- [ ] `source/components/modal/bp-modal.style.ts`
- [ ] `source/components/drawer/bp-drawer.style.ts`
- [ ] `source/components/notification/bp-notification.style.ts`

---

## Implementation Checklist

### Pre-Implementation

- [ ] Run visual regression baseline: `npm run storybook` and screenshot all components
- [ ] Document current token values for rollback

### Phase 1 (Critical)

- [ ] 1.1 iOS zoom fix
- [ ] 1.2 Dark theme primary visibility
- [ ] 1.3 Light theme text-muted contrast
- [ ] 1.4 Touch target sizes
- [ ] **Test:** Run contrast checker on all themes
- [ ] **Test:** Verify on iOS Safari

### Phase 2 (Theme Tokens)

- [ ] 2.1 Semantic spacing adjustment
- [ ] **Visual review:** All 42 components after spacing change
- [ ] 2.2 Add missing semantic tokens
- [ ] 2.3 Dark warning adjustment
- [ ] 2.4 Heading line height tokens

### Phase 3 (Component Behavior)

- [ ] 3.1 Remove layout-shifting hovers
- [ ] 3.2 Fix tabs layout shift
- [ ] 3.3 Use dedicated hover tokens
- [ ] 3.4 Move JS values to CSS variables

### Phase 4 (Polish)

- [ ] 4.1 Input inset shadows
- [ ] 4.2 Button active state
- [ ] 4.3 Micro-interactions
- [ ] 4.4 Thumb shadows
- [ ] 4.5 Focus outline tokens
- [ ] 4.6 Card line height token

### Phase 5 (Consistency)

- [ ] 5.1 Size naming convention
- [ ] 5.2 Shadow elevation consistency

### Post-Implementation

- [ ] Run `npm run lint` and `npm run format`
- [ ] Visual regression comparison
- [ ] Accessibility audit with axe/Lighthouse
- [ ] Update component documentation

---

## Risk Assessment

| Change                      | Risk Level | Mitigation                        |
| --------------------------- | ---------- | --------------------------------- |
| Semantic spacing update     | **High**   | Visual review all components      |
| Dark theme colors           | Medium     | Test in Storybook dark mode       |
| Remove translateY hovers    | Medium     | Ensure hover is still perceivable |
| Size naming standardization | Medium     | Bulk find/replace with review     |
| Micro-interactions          | Low        | Additive, non-breaking            |
| Token additions             | Low        | Additive, non-breaking            |

---

## Estimated Total Effort

| Phase     | Description              | Days          |
| --------- | ------------------------ | ------------- |
| Phase 1   | Critical Accessibility   | 1-2           |
| Phase 2   | Theme Token Improvements | 1-2           |
| Phase 3   | Component Behavior       | 2-3           |
| Phase 4   | Visual Polish            | 2-3           |
| Phase 5   | Consistency              | 1-2           |
| **Total** |                          | **7-12 days** |

---

_Implementation plan generated from UI audit based on [Learn UI Design](https://www.learnui.design) guidelines._
