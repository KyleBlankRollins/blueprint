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
