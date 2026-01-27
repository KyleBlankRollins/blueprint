# Blueprint Docs Site Plan

Build a custom documentation site using Astro (without Starlight) that showcases Blueprint components by using them throughout the interface.

## Goals

1. **Dogfooding** - Use Blueprint components for the entire docs UI
2. **Showcase** - Demonstrate component capabilities in real context
3. **Consistency** - Single design system, no style conflicts
4. **Themeable** - Support all Blueprint themes with live switching

---

## Site Structure

```
docs/
├── src/
│   ├── components/         # Astro components wrapping Blueprint
│   │   ├── DocsLayout.astro
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── TableOfContents.astro
│   │   ├── ComponentPreview.astro
│   │   ├── CodeBlock.astro
│   │   └── ThemeSwitcher.astro
│   ├── content/
│   │   └── docs/           # Markdown content (keep existing)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro     # Landing page
│   │   └── [...slug].astro # Dynamic docs pages
│   └── styles/
│       └── docs.css        # Minimal layout CSS
└── astro.config.mjs
```

---

## Component Mapping

### Header

| Element            | Blueprint Component | Props/Notes                     |
| ------------------ | ------------------- | ------------------------------- |
| Site title         | `bp-heading`        | `level="1" size="lg"`           |
| Navigation links   | `bp-link`           | `variant="default"`             |
| Theme switcher     | `bp-select`         | Dropdown with theme options     |
| GitHub link        | `bp-button`         | `variant="secondary"` with icon |
| Mobile menu toggle | `bp-button`         | Icon-only button                |

### Sidebar Navigation

| Element              | Blueprint Component | Props/Notes                             |
| -------------------- | ------------------- | --------------------------------------- |
| Section headers      | `bp-heading`        | `level="2" size="sm" weight="semibold"` |
| Nav links            | `bp-link`           | Style active state via CSS              |
| Collapsible sections | `bp-accordion`      | For component categories                |
| Search               | `bp-input`          | `placeholder="Search..."` with icon     |
| Dividers             | `bp-divider`        | Between major sections                  |

### Main Content Area

| Element          | Blueprint Component      | Props/Notes               |
| ---------------- | ------------------------ | ------------------------- |
| Page title       | `bp-heading`             | `level="1" size="3xl"`    |
| Section headings | `bp-heading`             | `level="2"`, `level="3"`  |
| Body text        | `bp-text`                | Default paragraph styling |
| Inline code      | Native `<code>`          | Styled via CSS            |
| Code blocks      | Custom `CodeBlock.astro` | Shiki + copy button       |
| Info callouts    | `bp-alert`               | `variant="info"`          |
| Warning callouts | `bp-alert`               | `variant="warning"`       |
| Tables           | `bp-table`               | For API reference         |
| Tags/labels      | `bp-tag`                 | For property types        |

### Component Preview Sections

| Element           | Blueprint Component | Props/Notes               |
| ----------------- | ------------------- | ------------------------- |
| Preview container | `bp-card`           | `variant="outlined"`      |
| Preview tabs      | `bp-tabs`           | "Preview" / "Code" toggle |
| Live component    | Direct usage        | Actual component rendered |
| Copy code button  | `bp-button`         | `size="small"` with icon  |

### Table of Contents (Right Sidebar)

| Element     | Blueprint Component | Props/Notes                         |
| ----------- | ------------------- | ----------------------------------- |
| TOC heading | `bp-heading`        | `level="2" size="xs"`               |
| TOC links   | `bp-link`           | `variant="muted"`, highlight active |
| Nesting     | Native list         | Indent via CSS                      |

### Footer

| Element        | Blueprint Component | Props/Notes                 |
| -------------- | ------------------- | --------------------------- |
| Divider        | `bp-divider`        | Separates from content      |
| Copyright text | `bp-text`           | `variant="muted" size="sm"` |
| Footer links   | `bp-link`           | `variant="muted"`           |

### Landing Page (Homepage)

| Element          | Blueprint Component | Props/Notes                 |
| ---------------- | ------------------- | --------------------------- |
| Hero heading     | `bp-heading`        | `level="1" size="4xl"`      |
| Hero subtitle    | `bp-text`           | `size="xl" variant="muted"` |
| CTA buttons      | `bp-button`         | Primary + secondary         |
| Feature cards    | `bp-card`           | `hoverable` with icon       |
| Feature icons    | `bp-icon`           | Various icons               |
| Quick start code | `CodeBlock.astro`   | Install command             |

### Mobile Navigation

| Element       | Blueprint Component | Props/Notes             |
| ------------- | ------------------- | ----------------------- |
| Mobile drawer | `bp-drawer`         | `position="left"`       |
| Close button  | `bp-button`         | Icon button             |
| Nav content   | Same as Sidebar     | Reuse sidebar component |

### Search (Optional/Future)

| Element       | Blueprint Component | Props/Notes        |
| ------------- | ------------------- | ------------------ |
| Search modal  | `bp-modal`          | Cmd+K trigger      |
| Search input  | `bp-input`          | Autofocus          |
| Results list  | Native list         | Keyboard navigable |
| Result item   | `bp-card`           | `clickable`        |
| Loading state | `bp-spinner`        | While searching    |

---

## Theme Integration

### Theme Switcher Implementation

```html
<bp-select id="theme-switcher" value="light">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="wada-light">Wada Light</option>
  <option value="wada-dark">Wada Dark</option>
</bp-select>
```

### Theme Application

- Set `data-theme` attribute on `<html>` element
- Persist selection in `localStorage`
- Respect `prefers-color-scheme` as default

---

## Content Collections

### Frontmatter Schema

```yaml
---
title: Button
description: Interactive button component with multiple variants
category: components # or "getting-started", "guides"
order: 1 # Sort order within category
---
```

### Categories

1. **Getting Started** - Introduction, Installation, Theming
2. **Components** - Individual component pages
3. **Guides** - Best practices, patterns, examples

---

## Development Phases

### Phase 1: Core Layout

- [ ] Remove Starlight, update config
- [ ] Create BaseLayout with theme support
- [ ] Create Header with theme switcher
- [ ] Create Sidebar navigation
- [ ] Set up content collections

### Phase 2: Content Rendering

- [ ] Markdown rendering with Blueprint typography
- [ ] Code blocks with syntax highlighting
- [ ] Component preview sections
- [ ] Table of contents generation

### Phase 3: Polish

- [ ] Landing page
- [ ] Mobile responsive layout
- [ ] Search functionality
- [ ] 404 page

### Phase 4: Enhancement

- [ ] Component playground (live editing)
- [ ] Prop controls for examples
- [ ] Dark mode transition animations

---

## Technical Notes

### Astro Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [lit()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
      },
    },
  },
});
```

### CSS Strategy

- Minimal custom CSS for layout (grid, positioning)
- All visual styling via Blueprint components and tokens
- Use CSS custom properties from Blueprint themes

### Dependencies

**Keep:**

- `astro`
- `@astrojs/lit`
- `lit`

**Remove:**

- `@astrojs/starlight`

**Add:**

- None required (Shiki comes with Astro)

---

## Component Documentation Status

| Component         | Documented | Notes   |
| ----------------- | ---------- | ------- |
| `bp-accordion`    | ✅         | Batch 6 |
| `bp-alert`        | ✅         |         |
| `bp-avatar`       | ✅         | Batch 2 |
| `bp-badge`        | ✅         | Batch 1 |
| `bp-breadcrumb`   | ✅         | Batch 5 |
| `bp-button`       | ✅         |         |
| `bp-card`         | ✅         |         |
| `bp-checkbox`     | ✅         |         |
| `bp-color-picker` | ✅         | Batch 4 |
| `bp-combobox`     | ✅         | Batch 4 |
| `bp-date-picker`  | ✅         | Batch 4 |
| `bp-divider`      | ✅         | Batch 1 |
| `bp-drawer`       | ✅         | Batch 6 |
| `bp-dropdown`     | ✅         | Batch 6 |
| `bp-file-upload`  | ✅         | Batch 3 |
| `bp-heading`      | ✅         | Batch 2 |
| `bp-icon`         | ✅         | Batch 1 |
| `bp-input`        | ✅         |         |
| `bp-link`         | ✅         | Batch 2 |
| `bp-menu`         | ✅         | Batch 5 |
| `bp-modal`        | ✅         | Batch 6 |
| `bp-multi-select` | ✅         | Batch 4 |
| `bp-notification` | ✅         | Batch 6 |
| `bp-number-input` | ✅         | Batch 3 |
| `bp-pagination`   | ✅         | Batch 5 |
| `bp-popover`      | ✅         | Batch 2 |
| `bp-progress`     | ✅         | Batch 1 |
| `bp-radio`        | ✅         | Batch 3 |
| `bp-select`       | ✅         |         |
| `bp-skeleton`     | ✅         | Batch 1 |
| `bp-slider`       | ✅         | Batch 3 |
| `bp-spinner`      | ✅         | Batch 1 |
| `bp-stepper`      | ✅         | Batch 5 |
| `bp-switch`       | ✅         | Batch 3 |
| `bp-table`        | ❌         |         |
| `bp-tabs`         | ✅         | Batch 5 |
| `bp-tag`          | ✅         | Batch 1 |
| `bp-text`         | ✅         | Batch 2 |
| `bp-textarea`     | ✅         | Batch 3 |
| `bp-time-picker`  | ✅         | Batch 4 |
| `bp-tooltip`      | ✅         | Batch 2 |
| `bp-tree`         | ❌         |         |

**Summary:** 40 of 42 components documented (95%)

## Suggested Documentation Batches

### Batch 1: Simple Display (Low Complexity)

Single-purpose components with few props, easy to document quickly.

| Component     | Complexity | Notes                                                         |
| ------------- | ---------- | ------------------------------------------------------------- |
| `bp-divider`  | ⭐         | 5 props (orientation, spacing, variant, color, weight)        |
| `bp-spinner`  | ⭐         | 2 props (size, variant)                                       |
| `bp-skeleton` | ⭐         | 4 props (variant, width, height, animation)                   |
| `bp-badge`    | ⭐         | 4 props (variant, size, pill, dot)                            |
| `bp-tag`      | ⭐         | 3 props (variant, size, removable)                            |
| `bp-icon`     | ⭐         | 4 props (name, size, color, label)                            |
| `bp-progress` | ⭐         | 6 props (value, max, variant, size, indeterminate, showValue) |

**Estimate:** ~1 hour total

---

### Batch 2: Typography & Links (Low Complexity)

Text-related components, important for content authoring.

| Component    | Complexity | Notes                                                      |
| ------------ | ---------- | ---------------------------------------------------------- |
| `bp-heading` | ⭐         | 3 props (level, size, weight)                              |
| `bp-text`    | ⭐         | 10+ props (size, weight, variant, align, transform, etc.)  |
| `bp-link`    | ⭐         | 6 props (href, variant, underline, size, disabled, target) |
| `bp-avatar`  | ⭐         | 5 props (src, alt, initials, size, shape, status)          |

**Estimate:** ~45 min total

---

### Batch 3: Form Controls (Medium Complexity)

Remaining input components with events and validation.

| Component         | Complexity | Notes                               |
| ----------------- | ---------- | ----------------------------------- |
| `bp-radio`        | ⭐⭐       | Similar to checkbox, group behavior |
| `bp-switch`       | ⭐⭐       | Similar to checkbox                 |
| `bp-textarea`     | ⭐⭐       | Multi-line input, resize            |
| `bp-number-input` | ⭐⭐       | Min/max, step, increment buttons    |
| `bp-slider`       | ⭐⭐       | Range input, value display          |
| `bp-file-upload`  | ⭐⭐       | Drag/drop, file list, validation    |

**Estimate:** ~1.5 hours total

---

### Batch 4: Selection Components (Medium-High Complexity)

Dropdown/picker patterns with complex state.

| Component         | Complexity | Notes                                 |
| ----------------- | ---------- | ------------------------------------- |
| `bp-combobox`     | ⭐⭐⭐     | Autocomplete, filtering, custom input |
| `bp-multi-select` | ⭐⭐⭐     | Multiple selection, chips             |
| `bp-date-picker`  | ⭐⭐⭐     | Calendar, date formatting, validation |
| `bp-time-picker`  | ⭐⭐⭐     | Hour/minute selection, formats        |
| `bp-color-picker` | ⭐⭐⭐     | Color formats, swatches, gradients    |

**Estimate:** ~2 hours total

---

### Batch 5: Navigation (Medium Complexity)

Multi-step/multi-item navigation patterns.

| Component       | Complexity | Notes                           |
| --------------- | ---------- | ------------------------------- |
| `bp-breadcrumb` | ⭐⭐       | Items, separators               |
| `bp-pagination` | ⭐⭐       | Page numbers, prev/next         |
| `bp-tabs`       | ⭐⭐       | Tab panels, placement, variants |
| `bp-menu`       | ⭐⭐       | Menu items, nested menus        |
| `bp-stepper`    | ⭐⭐       | Steps, linear vs non-linear     |

**Estimate:** ~1.5 hours total

---

### Batch 6: Overlays & Popups (High Complexity)

Positioning, focus trapping, portal behavior.

| Component         | Complexity | Notes                             |
| ----------------- | ---------- | --------------------------------- |
| `bp-tooltip`      | ⭐⭐       | Placement, triggers, delay        |
| `bp-popover`      | ⭐⭐⭐     | Rich content, triggers            |
| `bp-dropdown`     | ⭐⭐⭐     | Trigger + panel pattern           |
| `bp-modal`        | ⭐⭐⭐     | Focus trap, close behavior, sizes |
| `bp-drawer`       | ⭐⭐⭐     | Placement, sizes, overlay         |
| `bp-notification` | ⭐⭐⭐     | Stacking, auto-dismiss, variants  |

**Estimate:** ~2 hours total

---

### Batch 7: Complex Data (High Complexity)

Components with many features and sub-components.

| Component      | Complexity | Notes                               |
| -------------- | ---------- | ----------------------------------- |
| `bp-accordion` | ⭐⭐⭐     | Expand/collapse, multiple mode      |
| `bp-table`     | ⭐⭐⭐⭐   | Sorting, selection, pagination      |
| `bp-tree`      | ⭐⭐⭐⭐   | Nested nodes, expand, select, check |

**Estimate:** ~2 hours total
