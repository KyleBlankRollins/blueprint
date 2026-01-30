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

### 2.1 Semantic Spacing Scale Adjustment ⏸️ DEFERRED

**Problem:** Semantic spacing is too tight (md = 8px, should be 16px)
**Status:** DEFERRED - HIGH RISK change that affects all 42 components. Requires visual review of entire component library before implementing.

| Token              | Current | Proposed |
| ------------------ | ------- | -------- |
| `--bp-spacing-2xs` | 2px     | 4px      |
| `--bp-spacing-xs`  | 4px     | 8px      |
| `--bp-spacing-sm`  | 6px     | 12px     |
| `--bp-spacing-md`  | 8px     | 16px     |
| `--bp-spacing-lg`  | 12px    | 24px     |
| `--bp-spacing-xl`  | 20px    | 32px     |
| `--bp-spacing-2xl` | 32px    | 48px     |

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

## Phase 3: Component Behavior Fixes (Medium Priority)

**Estimated effort:** 2-3 days
**Impact:** Layout stability, polish

### 3.1 Remove Layout-Shifting Hover Effects

**Problem:** `translateY(-2px)` on hover causes layout reflow
**Files to modify:**

- [ ] `source/components/button/bp-button.style.ts`
- [ ] `source/components/card/bp-card.style.ts`

**Before:**

```css
:host(:hover) {
  transform: translateY(-2px);
  box-shadow: var(--bp-shadow-md);
}
```

**After:**

```css
:host(:hover) {
  box-shadow: var(--bp-shadow-md);
  /* Remove translateY - use shadow alone for hover feedback */
}
```

---

### 3.2 Fix Tabs Active State Layout Shift

**Problem:** Active tab uses `translateY(1px)` causing layout shift
**Files to modify:**

- [ ] `source/components/tabs/bp-tabs.style.ts`

**Before:**

```css
:host([active]) {
  transform: translateY(1px);
}
```

**After:**

```css
:host([active]) {
  /* Use visual indicators without transform */
  border-bottom-color: var(--bp-color-primary);
  color: var(--bp-color-primary);
}
```

---

### 3.3 Use Dedicated Hover Color Tokens

**Problem:** Button uses `filter: brightness(1.1)` instead of dedicated hover tokens
**Files to modify:**

- [ ] `source/components/button/bp-button.style.ts`

**Before:**

```css
:host(:hover) {
  filter: brightness(1.1);
}
```

**After:**

```css
:host([variant='primary']:hover) {
  background-color: var(--bp-color-primary-hover);
}
:host([variant='success']:hover) {
  background-color: var(--bp-color-success-hover);
}
/* ... etc for each variant */
```

**Prerequisite:** Add hover tokens for success, warning, error variants to theme files.

---

### 3.4 Move Hardcoded JS Values to CSS Variables

**Problem:** Tooltip delays and dropdown distances are hardcoded in JS
**Files to modify:**

- [ ] `source/themes/light.css` / `source/themes/dark.css` (add tokens)
- [ ] `source/components/tooltip/bp-tooltip.ts`
- [ ] `source/components/dropdown/bp-dropdown.ts`
- [ ] `source/components/popover/bp-popover.ts`

**New tokens:**

```css
--bp-tooltip-show-delay: 200ms;
--bp-tooltip-hide-delay: 100ms;
--bp-dropdown-offset: 4px;
--bp-popover-offset: 8px;
```

**JS implementation:**

```typescript
// Read from CSS custom property
const showDelay = parseInt(
  getComputedStyle(this).getPropertyValue('--bp-tooltip-show-delay') || '200'
);
```

---

## Phase 4: Visual Polish (Low Priority)

**Estimated effort:** 2-3 days
**Impact:** Aesthetic improvements, micro-interactions

### 4.1 Add Inset Shadow to Input Fields

**Problem:** Inputs lack depth/inset feel
**Files to modify:**

- [ ] `source/components/input/bp-input.style.ts`
- [ ] `source/components/textarea/bp-textarea.style.ts`
- [ ] `source/components/select/bp-select.style.ts`

**Add:**

```css
input,
textarea,
select {
  box-shadow: inset 0 1px 2px oklch(0 0 0 / 0.05);
}
```

---

### 4.2 Add Button Active/Pressed State

**Problem:** Missing pressed visual depth
**Files to modify:**

- [ ] `source/components/button/bp-button.style.ts`

**Add:**

```css
:host(:active) {
  box-shadow: inset 0 2px 4px oklch(0 0 0 / 0.15);
}
```

---

### 4.3 Add Micro-Interactions

**Components to enhance:**

- [ ] **Checkbox:** Scale animation on check (`source/components/checkbox/bp-checkbox.style.ts`)
- [ ] **Radio:** Scale-in animation for inner dot (`source/components/radio/bp-radio.style.ts`)
- [ ] **Switch:** Spring animation for toggle (`source/components/switch/bp-switch.style.ts`)

**Example (checkbox):**

```css
.check-icon {
  transform: scale(0);
  transition: transform var(--bp-transition-fast) var(--bp-ease-bounce);
}

:host([checked]) .check-icon {
  transform: scale(1);
}
```

---

### 4.4 Add Switch/Slider Thumb Shadow

**Problem:** Thumbs lack grabbable appearance
**Files to modify:**

- [ ] `source/components/switch/bp-switch.style.ts`
- [ ] `source/components/slider/bp-slider.style.ts`

**Add:**

```css
.thumb {
  box-shadow:
    0 1px 3px oklch(0 0 0 / 0.2),
    0 1px 2px oklch(0 0 0 / 0.1);
}
```

---

### 4.5 Focus Outline Token Usage

**Problem:** Some components hardcode focus outline
**Files to modify:**

- [ ] `source/components/tabs/bp-tabs.style.ts`
- [ ] Any other components with hardcoded `2px solid`

**Before:**

```css
:focus-visible {
  outline: 2px solid var(--bp-color-focus);
}
```

**After:**

```css
:focus-visible {
  outline: var(--bp-focus-ring);
  outline-offset: var(--bp-focus-offset);
}
```

---

### 4.6 Use Line Height Token in Card

**Problem:** Card body uses hardcoded line-height
**Files to modify:**

- [ ] `source/components/card/bp-card.style.ts`

**Before:**

```css
.body {
  line-height: 1.6;
}
```

**After:**

```css
.body {
  line-height: var(--bp-line-height-relaxed);
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
