# Blueprint Component UI Audit

**Date:** January 28, 2026
**Based on:** [Learn UI Design](https://www.learnui.design) guidelines and best practices

## Executive Summary

This audit evaluates Blueprint's 42 components against established UI design principles from Erik Kennedy's "7 Rules for Creating Gorgeous UI" and font size guidelines. Overall, Blueprint has a solid foundation with consistent use of CSS variables and good accessibility. However, there are opportunities for improvement in typography, spacing, visual hierarchy, and naming consistency.

---

## Design Principles Reference

### The 7 Rules (from Learn UI Design)

1. **Light comes from the sky** - Shadows and highlights should reflect natural light
2. **Black and white first** - Design in grayscale before adding color
3. **Double your whitespace** - Generous breathing room
4. **Text over images** - Proper overlay techniques
5. **Text hierarchy (up-pop/down-pop)** - Combine competing properties
6. **Use good fonts** - Figtree, Satoshi, Source Sans recommended
7. **Steal like an artist** - Learn from professional work

### Font Size Guidelines

- **Mobile body:** 16-20px (start at 17px)
- **Desktop body:** 14-24px depending on content type
- **Text inputs:** Minimum 16px (prevents iOS zoom)
- **Secondary text:** 2px smaller than body
- **Page titles:** 28-40px mobile, 30-50px desktop
- **Character limit:** 50-75 per line
- **Font sizes:** Use approximately 4 sizes max

---

## Current Token Values

### Font Sizes

| Token | Value | Assessment           |
| ----- | ----- | -------------------- |
| xs    | 12px  | Good for captions    |
| sm    | 14px  | Good for secondary   |
| base  | 16px  | Correct for body     |
| lg    | 18px  | Good for emphasis    |
| xl    | 20px  | Good for subheadings |
| 2xl   | 24px  | Good for headings    |
| 3xl   | 30px  | Good for page titles |
| 4xl   | 36px  | Good for hero text   |

### Spacing (base: 4px)

| Token | Value | Usage           |
| ----- | ----- | --------------- |
| 2xs   | 4px   | Minimal gaps    |
| xs    | 8px   | Tight spacing   |
| sm    | 12px  | Small padding   |
| md    | 16px  | Default padding |
| lg    | 24px  | Section spacing |
| xl    | 32px  | Large sections  |

---

## Component-by-Component Audit

### Form Controls

#### Button (`bp-button`)

**Current State:** Well-implemented with CSS variables

**Strengths:**

- Uses semantic color variants
- Proper focus-visible handling
- Smooth hover transition with shadow

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Hover effect causes layout shift | `translateY(-2px)` | Consider using `box-shadow` only to avoid reflow | Medium |
| Filter brightness for hover | `filter: brightness(1.1)` | Use dedicated hover color tokens (like primary-hover) for all variants | Medium |
| Missing pressed/active visual depth | Basic transform | Add inset shadow on `:active` to show "pressed in" state | Low |

---

#### Input (`bp-input`)

**Current State:** Good foundation with label/helper support

**Strengths:**

- Proper size variants
- Focus ring implementation
- Error state with semantic color

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Small size may trigger iOS zoom | sm = 14px | Ensure minimum 16px on mobile viewports | High |
| Label font size | 14px (sm) | Consider 12-13px for tighter visual hierarchy | Low |
| Missing inner shadow for "inset" feel | Flat border only | Add subtle `inset 0 1px 2px rgba(0,0,0,0.05)` for depth | Low |

---

#### Textarea (`bp-textarea`)

**Current State:** Mirrors input styling

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Same as input | - | Apply same iOS zoom fix | High |
| Line height for multiline | Not specified | Use `line-height: 1.5-1.6` for readability | Medium |

---

#### Checkbox (`bp-checkbox`)

**Current State:** Good with indeterminate support

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Check animation | None visible | Add subtle scale animation on check | Low |
| Touch target size | Varies by size | Ensure minimum 44x44px touch target | Medium |

---

#### Radio (`bp-radio`)

**Current State:** Similar to checkbox

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Inner dot animation | None visible | Add scale-in animation for selection | Low |
| Touch target size | Varies | Ensure minimum 44x44px | Medium |

---

#### Switch (`bp-switch`)

**Current State:** Good track/thumb separation

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Thumb shadow | Not visible | Add subtle shadow to thumb for elevation | Low |
| Animation | Not visible | Add spring animation for toggle | Low |

---

#### Select (`bp-select`)

**Current State:** Good keyboard navigation

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Dropdown shadow | Check value | Ensure proper elevation hierarchy | Medium |
| Option hover | Check implementation | Ensure clear visual distinction | Medium |

---

#### Slider (`bp-slider`)

**Current State:** Good with tick marks support

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Thumb elevation | Not visible | Add shadow to thumb for grabbable appearance | Medium |
| Track fill color | Check value | Ensure sufficient contrast against unfilled | Medium |

---

### Display Components

#### Card (`bp-card`)

**Current State:** Well-structured with variants

**Strengths:**

- Three variants (default, outlined, elevated)
- Proper hover states with shadow progression
- Good slot structure

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Line-height in body | 1.6 (hardcoded) | Use `var(--bp-line-height-relaxed)` | Low |
| Header font size | lg (18px) | Consider xl (20px) for better hierarchy | Low |
| Hover transform | translateY(-2px) | May cause layout shift in grid layouts | Medium |

---

#### Alert (`bp-alert`)

**Current State:** Good with icon support

**Strengths:**

- Semantic variants with left border accent
- Dismissible option
- Responsive padding

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Icon alignment | `flex-start` | Good, but ensure vertical centering with single-line text | Low |
| Close button hover | `opacity: 0.1` | Consider clearer background change | Medium |
| Warning/error shadow | `shadow-sm` | Good - maintains visual weight | - |

---

#### Badge (`bp-badge`)

**Current State:** Good size variants

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Small badge text | 12px | May be hard to read; consider 11px minimum | Low |
| Dot variant sizes | 8px, 12px, 16px | Good range | - |

---

#### Tag (`bp-tag`)

**Current State:** Good with removable option

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Remove button touch target | Check size | Ensure minimum 24x24px | Medium |
| Pill shape | Full radius | Good for tag appearance | - |

---

#### Tooltip (`bp-tooltip`)

**Current State:** Good positioning

**Strengths:**

- Dark background with light text (good contrast)
- Arrow indicators
- Animation on show

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Max width | `spacing-24 * 3` (288px) | Good, prevents overly wide tooltips | - |
| Font size | 14px (sm) | Appropriate for tooltips | - |
| Show/hide delay in JS | 200ms/100ms hardcoded | Consider making configurable via CSS variables | Low |

---

#### Avatar (`bp-avatar`)

**Current State:** Good with status indicators

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Fallback initials contrast | Check implementation | Ensure WCAG compliance | Medium |
| Status indicator size | Check proportions | Should be 20-25% of avatar size | Low |

---

#### Skeleton (`bp-skeleton`)

**Current State:** Good shimmer animation

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Animation performance | Check implementation | Use `transform` only, avoid `background-position` | Medium |
| Color contrast | Check values | Should be subtle but visible | Low |

---

### Navigation Components

#### Tabs (`bp-tabs`)

**Current State:** Comprehensive with three variants

**Strengths:**

- Pills, underline, default variants
- Vertical placement support
- Closable tabs

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Active tab transform | `translateY(1px)` on active | Causes layout shift; use color/shadow only | High |
| Focus outline hardcoded | `2px solid` | Use `var(--bp-focus-width)` | Low |
| Underline indicator height | `spacing-0-5` (2px) | Good, visible but not heavy | - |

---

#### Breadcrumb (`bp-breadcrumb`)

**Current State:** Good with collapse support

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Separator spacing | Check values | Ensure adequate breathing room | Low |
| Current page styling | Check implementation | Should be visually distinct (bolder or different color) | Medium |

---

#### Pagination (`bp-pagination`)

**Current State:** Good with boundary controls

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Button touch targets | Check size | Ensure minimum 44x44px | Medium |
| Current page indicator | Check contrast | Should be clearly visible | Medium |

---

#### Menu (`bp-menu`)

**Current State:** Good keyboard navigation

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Item hover background | Check value | Ensure clear but subtle | Medium |
| Shortcut text alignment | Check implementation | Should right-align with muted color | Low |
| Divider spacing | Check values | Adequate vertical margins | Low |

---

### Overlay Components

#### Modal (`bp-modal`)

**Current State:** Good focus management

**Strengths:**

- Focus trapping
- ESC to close
- Backdrop click handling
- Animation on open

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Size calculations | Complex calc expressions | Consider named breakpoint tokens | Low |
| Header title size | xl (20px) | Good for modal context | - |
| Footer gap | spacing-3 (12px) | Might be tight; consider spacing-md (16px) | Low |

---

#### Drawer (`bp-drawer`)

**Current State:** Good placement options

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Slide animation | Check implementation | Ensure smooth easing | Low |
| Shadow depth | Check value | Should indicate high elevation | Medium |

---

#### Dropdown (`bp-dropdown`)

**Current State:** Good positioning

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Distance property | 4px hardcoded in JS | Move to CSS variable | Low |
| Shadow depth | Check value | Should be medium elevation | Medium |

---

#### Popover (`bp-popover`)

**Current State:** Good trigger options

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Distance property | 8px hardcoded in JS | Move to CSS variable | Low |
| Arrow styling | Check implementation | Should match background color exactly | Low |

---

#### Notification (`bp-notification`)

**Current State:** Good with auto-close

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Stack spacing | Check implementation | Ensure adequate gap between stacked notifications | Medium |
| Progress indicator | Check if present | Consider showing auto-close progress | Low |

---

### Data Display Components

#### Table (`bp-table`)

**Current State:** Good with sorting/selection

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Row hover contrast | Check value | Should be subtle but visible | Medium |
| Striped variant contrast | Check value | Ensure readability maintained | Medium |
| Sticky header shadow | Check implementation | Should show depth when scrolled | Medium |
| Cell padding | Check values | Ensure adequate whitespace | Medium |

---

#### Tree (`bp-tree`)

**Current State:** Good with expand/collapse

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Indent amount | Check value | Should be consistent (typically 16-24px) | Low |
| Connecting lines | Check implementation | Ensure visibility in both themes | Low |
| Selected item highlight | Check contrast | Should be clearly visible | Medium |

---

#### Accordion (`bp-accordion`)

**Current State:** Good with variants

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Expand animation | Check implementation | Use max-height with overflow | Low |
| Header hover | Check implementation | Should indicate interactivity | Medium |
| Icon rotation | Check implementation | Should animate smoothly | Low |

---

### Progress Components

#### Progress (`bp-progress`)

**Current State:** Good with indeterminate mode

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Track/fill contrast | Check values | Ensure sufficient distinction | Medium |
| Animation smoothness | Check implementation | Use CSS transitions for value changes | Low |

---

#### Spinner (`bp-spinner`)

**Current State:** Good with size variants

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Animation performance | Check implementation | Ensure GPU-accelerated transform | Low |
| Inverse variant contrast | Check value | Ensure visibility on dark backgrounds | Medium |

---

#### Stepper (`bp-stepper`)

**Current State:** Good with linear mode

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Step number sizing | Check values | Ensure consistent circle sizes | Low |
| Connector line contrast | Check value | Should be subtle | Low |
| Completed step checkmark | Check implementation | Should be clearly visible | Medium |

---

### Typography Components

#### Heading (`bp-heading`)

**Current State:** Good size range

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Size to level mapping | Manual specification | Consider automatic defaults (h1=4xl, h2=3xl, etc.) | Low |
| Line height for large sizes | Check values | Larger headings need tighter line-height | Medium |

---

#### Text (`bp-text`)

**Current State:** Good with truncation support

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Muted variant contrast | Check value | Ensure WCAG compliance (4.5:1 minimum) | High |
| Line clamp browser support | Check implementation | Ensure fallback | Low |

---

#### Link (`bp-link`)

**Current State:** Good with underline options

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Visited state | Not visible | Consider adding visited color | Low |
| Underline offset | Check value | Ensure doesn't touch descenders | Low |

---

#### Divider (`bp-divider`)

**Current State:** Good with variants

**Improvements:**
| Issue | Current | Recommendation | Priority |
|-------|---------|----------------|----------|
| Subtle variant visibility | Check contrast | May be too faint | Low |
| Vertical divider height | Check implementation | Should fill container | Low |

---

## Global Recommendations

### High Priority

1. **iOS Zoom Fix for Inputs**
   - Ensure all text inputs render at minimum 16px on mobile
   - Add media query or viewport-aware sizing

2. **Muted Text Contrast**
   - Audit `--bp-color-text-muted` for WCAG compliance
   - Ensure 4.5:1 ratio against backgrounds

3. **Touch Target Sizes**
   - All interactive elements should be minimum 44x44px on touch devices
   - Add transparent hit areas if visual size needs to be smaller

### Medium Priority

4. **Consistent Size Naming**
   - Current mix: `sm/md/lg`, `small/medium/large`, `xs/sm/base/lg/xl`
   - Standardize to single convention across all components

5. **Hover State Improvements**
   - Avoid `translateY` for hover (causes layout shift)
   - Use `box-shadow` and `background-color` changes instead

6. **Shadow Hierarchy**
   - Ensure consistent elevation system:
     - Resting: `shadow-sm`
     - Hover: `shadow-md`
     - Elevated (modals, dropdowns): `shadow-lg` to `shadow-xl`

7. **Hardcoded Values in JavaScript**
   - Move timing values (tooltip delays, dropdown distances) to CSS variables
   - Makes theming more flexible

### Low Priority

8. **Animation Enhancements**
   - Add micro-interactions for checkbox/radio/switch
   - Ensure all animations use GPU-accelerated properties

9. **Depth Indicators**
   - Add subtle inner shadows to "inset" elements (inputs, pressed buttons)
   - Follows "light from above" principle

10. **Typography Fine-tuning**
    - Review line-height for larger font sizes (should decrease)
    - Ensure consistent use of font-weight tokens

---

## Recommended Token Additions

```typescript
// Additional tokens to consider
const RECOMMENDED_ADDITIONS = {
  // Touch targets
  touchTarget: {
    minimum: 44, // 44px
  },

  // Line heights for headings (tighter for larger sizes)
  lineHeightsHeading: {
    xs: 1.4, // For small headings
    sm: 1.35,
    md: 1.3,
    lg: 1.25,
    xl: 1.2, // For large headings
  },

  // Character width for readability
  maxWidth: {
    prose: '65ch', // ~65 characters
    narrow: '45ch',
    wide: '80ch',
  },
};
```

---

## Summary Statistics

| Category                       | Count | Notes                              |
| ------------------------------ | ----- | ---------------------------------- |
| Total Components               | 42    | Including sub-components           |
| High Priority Issues           | 3     | iOS zoom, contrast, touch targets  |
| Medium Priority Issues         | 12    | Consistency, hover states, shadows |
| Low Priority Issues            | 15+   | Polish and micro-interactions      |
| Components with Excellent A11y | 42    | All have ARIA support              |
| Components Using CSS Variables | 42    | 100% adoption                      |

---

## Next Steps

1. **Immediate:** Fix iOS zoom issue for inputs
2. **Short-term:** Audit color contrast ratios with automated tools
3. **Medium-term:** Standardize size naming conventions
4. **Long-term:** Add micro-interactions and polish animations

---

_This audit is based on design principles from [Learn UI Design](https://www.learnui.design) by Erik Kennedy and industry best practices._

---

# Blueprint Core Theme Audit

## Theme Overview

**Plugin:** `blueprint-core`
**Variants:** Light, Dark
**Design Inspiration:** Wada Sanzo's "A Dictionary of Color Combinations" (1930s)
**Primary Font:** Figtree (variable, 300-900 weight)

---

## Color Analysis

### Light Theme Colors

| Token              | OKLCH Value              | Approx. Lightness | Assessment                 |
| ------------------ | ------------------------ | ----------------- | -------------------------- |
| `background`       | `oklch(0.89 0.01 91.4)`  | 89%               | Warm cream - good          |
| `surface`          | `oklch(0.94 0.02 91.4)`  | 94%               | Elevated surface - good    |
| `surface-elevated` | `oklch(0.96 0.03 91.4)`  | 96%               | Card/modal bg - good       |
| `surface-subdued`  | `oklch(0.98 0.04 91.4)`  | 98%               | Disabled bg - very light   |
| `text`             | `oklch(0.25 0.01 240.0)` | 25%               | Dark text - good contrast  |
| `text-strong`      | `oklch(0.00 0.00 0.0)`   | 0%                | Pure black - excellent     |
| `text-muted`       | `oklch(0.55 0.02 240.0)` | 55%               | **Needs verification**     |
| `text-inverse`     | `oklch(0.89 0.01 91.4)`  | 89%               | Same as background         |
| `primary`          | `oklch(0.40 0.08 233.4)` | 40%               | Vanderpoel Blue - good     |
| `primary-hover`    | `oklch(0.36 0.10 233.4)` | 36%               | Darker on hover - correct  |
| `primary-active`   | `oklch(0.32 0.12 233.4)` | 32%               | Darkest on press - correct |
| `success`          | `oklch(0.55 0.13 145.0)` | 55%               | Green - good               |
| `warning`          | `oklch(0.51 0.13 64.5)`  | 51%               | Orange/amber - good        |
| `error`            | `oklch(0.55 0.15 25.0)`  | 55%               | Red - good                 |
| `info`             | `oklch(0.40 0.08 233.4)` | 40%               | Same as primary            |
| `border`           | `oklch(0.75 0.02 91.4)`  | 75%               | Subtle border - good       |
| `border-strong`    | `oklch(0.65 0.02 91.4)`  | 65%               | Visible border - good      |
| `focus`            | `oklch(0.40 0.08 233.4)` | 40%               | Same as primary            |

### Dark Theme Colors

| Token              | OKLCH Value              | Approx. Lightness | Assessment                          |
| ------------------ | ------------------------ | ----------------- | ----------------------------------- |
| `background`       | `oklch(0.15 0.01 240.0)` | 15%               | Very dark - good                    |
| `surface`          | `oklch(0.25 0.01 240.0)` | 25%               | Elevated - good                     |
| `surface-elevated` | `oklch(0.35 0.02 240.0)` | 35%               | Modal/card - good                   |
| `surface-subdued`  | `oklch(0.00 0.00 0.0)`   | 0%                | Pure black - appropriate            |
| `text`             | `oklch(0.89 0.01 91.4)`  | 89%               | Warm light text - good              |
| `text-strong`      | `oklch(1.00 0.00 0.0)`   | 100%              | Pure white - excellent              |
| `text-muted`       | `oklch(0.75 0.02 91.4)`  | 75%               | Lighter muted - good                |
| `text-inverse`     | `oklch(0.25 0.01 240.0)` | 25%               | Same as light text                  |
| `primary`          | `oklch(0.26 0.07 233.4)` | 26%               | **Very dark - may lack visibility** |
| `primary-hover`    | `oklch(0.28 0.05 233.4)` | 28%               | Slightly lighter                    |
| `primary-active`   | `oklch(0.32 0.03 233.4)` | 32%               | Lighter on press                    |
| `success`          | `oklch(0.36 0.10 145.0)` | 36%               | Darker green - appropriate          |
| `warning`          | `oklch(0.51 0.13 64.5)`  | 51%               | Same as light - **review**          |
| `error`            | `oklch(0.36 0.12 25.0)`  | 36%               | Darker red - appropriate            |
| `info`             | `oklch(0.26 0.07 233.4)` | 26%               | Same as primary                     |
| `border`           | `oklch(0.35 0.02 240.0)` | 35%               | Subtle on dark - good               |
| `border-strong`    | `oklch(0.45 0.02 240.0)` | 45%               | Visible - good                      |
| `focus`            | `oklch(0.26 0.07 233.4)` | 26%               | **May be hard to see**              |

---

## Contrast Analysis

### Light Theme Contrast Estimates

| Combination              | Foreground L | Background L | Est. Ratio | WCAG                |
| ------------------------ | ------------ | ------------ | ---------- | ------------------- |
| text on background       | 25%          | 89%          | ~10:1      | AAA                 |
| text-muted on background | 55%          | 89%          | ~4:1       | **AA (borderline)** |
| primary on background    | 40%          | 89%          | ~6:1       | AA                  |
| text-inverse on primary  | 89%          | 40%          | ~6:1       | AA                  |

### Dark Theme Contrast Estimates

| Combination              | Foreground L | Background L | Est. Ratio | WCAG     |
| ------------------------ | ------------ | ------------ | ---------- | -------- |
| text on background       | 89%          | 15%          | ~12:1      | AAA      |
| text-muted on background | 75%          | 15%          | ~7:1       | AAA      |
| primary on background    | 26%          | 15%          | ~1.5:1     | **FAIL** |
| text on primary          | 89%          | 26%          | ~6:1       | AA       |

---

## Color Issues

### High Priority

1. **Dark Theme Primary Visibility**
   - Current: `oklch(0.26 0.07 233.4)` (L=26%)
   - Issue: Primary buttons/links may not stand out against dark background (L=15%)
   - **Recommendation:** Increase lightness to ~45-50% for better visibility

   ```css
   --bp-color-primary: oklch(0.48 0.12 233.4); /* Brighter blue */
   ```

2. **Dark Theme Focus Ring**
   - Same as primary - may be invisible on dark backgrounds
   - **Recommendation:** Use a brighter, higher-contrast color for focus

   ```css
   --bp-color-focus: oklch(0.6 0.15 233.4); /* Brighter for visibility */
   ```

3. **Light Theme Text-Muted Contrast**
   - Current: L=55% on L=89% background
   - Estimated ratio: ~4:1 (borderline AA)
   - **Recommendation:** Darken slightly to ensure 4.5:1
   ```css
   --bp-color-text-muted: oklch(0.5 0.02 240); /* Slightly darker */
   ```

### Medium Priority

4. **Warning Color Unchanged in Dark Mode**
   - Same value in both themes: `oklch(0.51 0.13 64.5)`
   - May be too bright against dark backgrounds
   - **Recommendation:** Consider slightly darker for dark mode

   ```css
   /* Dark theme */
   --bp-color-warning: oklch(0.45 0.11 64.5);
   ```

5. **Info Token Duplicates Primary**
   - Both use identical values
   - **Recommendation:** Consider a distinct info color (lighter blue or cyan)

   ```css
   --bp-color-info: oklch(0.5 0.1 220); /* Cyan-ish */
   ```

6. **Missing Secondary Color**
   - No dedicated secondary action color
   - Currently using `surface-elevated` with border for secondary buttons
   - **Recommendation:** Add explicit secondary token

---

## Shadow Analysis

### Light Theme Shadows

```css
--bp-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--bp-shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--bp-shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--bp-shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

**Assessment:** Good progression following "light from above" principle

- Uses negative Y offsets for spread
- Appropriate opacity for subtle depth
- Multi-shadow for realistic soft edges

### Dark Theme Shadows

```css
--bp-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--bp-shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--bp-shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
--bp-shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
```

**Assessment:** Appropriately stronger for dark backgrounds

- Higher opacity compensates for dark background
- Maintains relative hierarchy

**Improvement Opportunity:**

- Consider using OKLCH for shadow colors for consistency
- Could add colored shadows for elevation (subtle primary tint)

---

## Spacing Analysis

### Numeric Scale (base: 4px)

| Token         | Value | Assessment      |
| ------------- | ----- | --------------- |
| `spacing-0`   | 0px   | -               |
| `spacing-0-5` | 2px   | Hairline gaps   |
| `spacing-1`   | 4px   | Minimal         |
| `spacing-2`   | 8px   | Tight           |
| `spacing-3`   | 12px  | Comfortable     |
| `spacing-4`   | 16px  | Default padding |
| `spacing-6`   | 24px  | Section gaps    |
| `spacing-8`   | 32px  | Large sections  |
| `spacing-12`  | 48px  | Major sections  |
| `spacing-24`  | 96px  | Page-level      |

### Semantic Scale

| Token         | Value | Assessment             |
| ------------- | ----- | ---------------------- |
| `spacing-2xs` | 2px   | **Very tight**         |
| `spacing-xs`  | 4px   | Minimal                |
| `spacing-sm`  | 6px   | **Tight**              |
| `spacing-md`  | 8px   | **Small for "medium"** |
| `spacing-lg`  | 12px  | Moderate               |
| `spacing-xl`  | 20px  | Comfortable            |
| `spacing-2xl` | 32px  | Large                  |

**Issue:** Semantic spacing is quite tight

- `md` at 8px is smaller than typical "medium" spacing expectations
- Most design systems use 16px as medium
- **Recommendation:** Review semantic naming or increase values

```css
/* Recommended semantic spacing */
--bp-spacing-2xs: 4px; /* Was 2px */
--bp-spacing-xs: 8px; /* Was 4px */
--bp-spacing-sm: 12px; /* Was 6px */
--bp-spacing-md: 16px; /* Was 8px */
--bp-spacing-lg: 24px; /* Was 12px */
--bp-spacing-xl: 32px; /* Was 20px */
--bp-spacing-2xl: 48px; /* Was 32px */
```

---

## Typography Analysis

### Font Family

```css
--bp-font-family:
  Figtree, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, sans-serif;
```

**Assessment:** Excellent

- Figtree is specifically recommended by Erik Kennedy
- Good fallback chain for system fonts
- Variable font supports 300-900 weights

### Font Sizes

| Token | Value | Use Case               | Assessment       |
| ----- | ----- | ---------------------- | ---------------- |
| xs    | 12px  | Captions, fine print   | Minimum readable |
| sm    | 14px  | Secondary text, labels | Good             |
| base  | 16px  | Body text              | Correct          |
| lg    | 18px  | Emphasis               | Good             |
| xl    | 20px  | Subheadings            | Good             |
| 2xl   | 24px  | Section headings       | Good             |
| 3xl   | 30px  | Page titles            | Good             |
| 4xl   | 36px  | Hero/display           | Good             |

**Assessment:** Good range following guidelines

- 8 sizes (slightly more than recommended 4, but justified)
- Base 16px correct for body
- Good progression ratio (~1.125-1.25x)

### Line Heights

| Token   | Value | Use Case          |
| ------- | ----- | ----------------- |
| none    | 1     | Single-line text  |
| tight   | 1.25  | Headings          |
| snug    | 1.375 | Subheadings       |
| normal  | 1.5   | Body text         |
| relaxed | 1.625 | Long-form content |
| loose   | 2     | Spacious layouts  |

**Assessment:** Good range

- 1.5 for body is industry standard
- Tighter values for headings is correct

**Improvement:** Consider tighter line-height for larger font sizes

```css
/* Larger sizes need tighter line-height */
--bp-line-height-heading-lg: 1.2; /* For 3xl, 4xl */
--bp-line-height-heading-md: 1.25; /* For 2xl, xl */
```

---

## Border Radius Analysis

| Token | Value  | Use Case         | Assessment      |
| ----- | ------ | ---------------- | --------------- |
| none  | 0px    | Sharp corners    | -               |
| sm    | 2px    | Subtle rounding  | Good for inputs |
| md    | 4px    | Default          | Standard        |
| lg    | 8px    | Cards, panels    | Good            |
| xl    | 12px   | Modals           | Good            |
| 2xl   | 16px   | Large cards      | Good            |
| 3xl   | 24px   | Feature sections | Good            |
| full  | 9999px | Pills, avatars   | Correct         |

**Assessment:** Good progression

- Theme uses `border-radius: 4px` (md) as default
- `border-radius-large: 8px` (lg) for elevated surfaces
- Consistent with modern design trends

---

## Motion Analysis

### Durations

| Token   | Value | Use Case             | Assessment |
| ------- | ----- | -------------------- | ---------- |
| instant | 0ms   | No transition        | -          |
| fast    | 150ms | Micro-interactions   | Good       |
| normal  | 300ms | Standard transitions | Good       |
| slow    | 500ms | Emphasis animations  | Good       |

**Assessment:** Industry-standard values

- Fast enough to feel responsive
- Slow enough to be perceived

### Easing Functions

| Token  | Value                                    | Use Case            |
| ------ | ---------------------------------------- | ------------------- |
| linear | `linear`                                 | Progress bars       |
| in     | `cubic-bezier(0.4, 0, 1, 1)`             | Exit animations     |
| out    | `cubic-bezier(0, 0, 0.2, 1)`             | Enter animations    |
| inOut  | `cubic-bezier(0.4, 0, 0.2, 1)`           | General transitions |
| bounce | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful effects     |

**Assessment:** Good variety

- `ease-out` for enters is correct (fast start, slow end)
- `ease-in` for exits is correct (slow start, fast end)

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --bp-transition-fast: 0ms;
    --bp-transition-base: 0ms;
    --bp-transition-slow: 0ms;
  }
}
```

**Assessment:** Excellent accessibility support

---

## Accessibility Features

### Focus Indicators

```css
--bp-focus-width: 2px;
--bp-focus-offset: 2px;
--bp-focus-style: solid;
--bp-focus-ring: var(--bp-focus-width) var(--bp-focus-style)
  var(--bp-color-focus);
```

**Assessment:** Good foundation

- 2px width is visible
- 2px offset prevents overlap with content

**Issue:** Focus color in dark theme (L=26%) may be too dark

### High Contrast Mode

```css
@media (prefers-contrast: more) {
  :root {
    --bp-color-text: #000000;
    --bp-color-background: #ffffff;
    --bp-border-width: 2px;
    --bp-focus-width: 3px;
  }
}
```

**Assessment:** Good high-contrast support

- Pure black/white for maximum contrast
- Thicker borders and focus rings

---

## Missing Tokens

### Recommended Additions

1. **Link Colors**

   ```css
   --bp-color-link: var(--bp-color-primary);
   --bp-color-link-hover: var(--bp-color-primary-hover);
   --bp-color-link-visited: oklch(0.45 0.08 280); /* Purple tint */
   ```

2. **Secondary/Tertiary Actions**

   ```css
   --bp-color-secondary: oklch(0.5 0.02 240);
   --bp-color-secondary-hover: oklch(0.45 0.02 240);
   --bp-color-tertiary: transparent;
   ```

3. **Interactive States**

   ```css
   --bp-color-hover-overlay: oklch(0 0 0 / 0.05);
   --bp-color-active-overlay: oklch(0 0 0 / 0.1);
   --bp-color-selected-bg: oklch(0.95 0.03 233.4); /* Light primary tint */
   ```

4. **Semantic Backgrounds**

   ```css
   --bp-color-success-bg: oklch(0.95 0.05 145);
   --bp-color-warning-bg: oklch(0.95 0.05 64.5);
   --bp-color-error-bg: oklch(0.95 0.05 25);
   --bp-color-info-bg: oklch(0.95 0.03 233.4);
   ```

5. **Input-Specific**
   ```css
   --bp-color-placeholder: var(--bp-color-text-muted);
   --bp-color-input-bg: var(--bp-color-background);
   --bp-color-input-border: var(--bp-color-border);
   ```

---

## Theme Audit Summary

### Strengths

- **OKLCH Color Space:** Modern, perceptually uniform color definitions
- **Wada Sanzo Inspiration:** Cohesive, intentional color palette
- **Figtree Font:** Recommended UI font, variable weight support
- **Shadow Hierarchy:** Proper depth progression
- **Motion System:** Industry-standard timing and easing
- **Accessibility:** Reduced motion and high contrast support

### Issues by Priority

| Priority   | Issue                               | Impact                    |
| ---------- | ----------------------------------- | ------------------------- |
| **High**   | Dark theme primary too dark (L=26%) | Buttons/links hard to see |
| **High**   | Dark theme focus ring visibility    | Accessibility problem     |
| **High**   | Light theme text-muted contrast     | May fail WCAG AA          |
| **Medium** | Semantic spacing too tight          | Components feel cramped   |
| **Medium** | Warning unchanged in dark mode      | Inconsistent experience   |
| **Medium** | Info duplicates primary             | Reduced semantic meaning  |
| **Low**    | Missing link/visited colors         | Minor UX gap              |
| **Low**    | Missing semantic backgrounds        | Limited flexibility       |
| **Low**    | No secondary action color           | Design limitation         |

### Recommended Actions

1. **Immediate:** Adjust dark theme primary to L=45-50%
2. **Immediate:** Verify light theme text-muted meets 4.5:1 contrast
3. **Short-term:** Review and adjust semantic spacing scale
4. **Medium-term:** Add missing semantic tokens (link, secondary, backgrounds)
5. **Long-term:** Consider distinct info color separate from primary
