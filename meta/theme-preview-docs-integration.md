# Theme Preview Integration with Docs Site

**Status: Implemented (Option 1)**

## Current State

The `bp theme preview` command currently:
1. Starts the Vite dev server
2. Opens `demo/theme-preview.html` with query parameters
3. Supports `--theme <name>` to select a specific theme variant
4. Supports `--all` to show all themes side-by-side

With the removal of the `demo/` directory, we need an alternative approach.

## Options

### Option 1: Dedicated Theme Preview Page in Docs (Recommended)

Create a new page at `docs/src/pages/theme-preview.astro` that serves as the theme preview destination.

**Pros:**
- Keeps theme preview functionality within the docs ecosystem
- Can reuse existing docs site infrastructure (layouts, components)
- Single source of truth for component rendering
- Already has theme switching mechanism in place

**Cons:**
- Requires docs site to be running (port 4321 vs 5173)
- Slightly more complex setup

**Implementation:**

1. Create `docs/src/pages/theme-preview.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
// Import all Blueprint components
import '../../../source/index.ts';
---

<BaseLayout title="Theme Preview">
  <div class="theme-preview">
    <header class="preview-header">
      <h1>Theme Preview</h1>
      <div class="controls">
        <bp-select id="theme-selector" label="Theme">
          <!-- Dynamically populated -->
        </bp-select>
        <bp-checkbox id="show-all">Show all themes</bp-checkbox>
      </div>
    </header>

    <main class="preview-content">
      <!-- Component showcase grid -->
      <section class="component-grid">
        <div class="component-card">
          <h3>Buttons</h3>
          <bp-button variant="primary">Primary</bp-button>
          <bp-button variant="secondary">Secondary</bp-button>
        </div>
        <!-- More component examples... -->
      </section>
    </main>
  </div>

  <script>
    // Read query params and apply theme
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    const showAll = params.get('all') === 'true';

    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    // ... theme switcher logic
  </script>
</BaseLayout>
```

2. Update `previewServer.ts` to start docs dev server instead:

```typescript
// Change from:
const viteProcess = spawn('npm', ['run', 'dev'], { ... });
const baseUrl = `http://localhost:${port}/${DEMO_DIR}/${THEME_PREVIEW_HTML}`;

// To:
const docsProcess = spawn('npm', ['run', 'dev'], { cwd: 'docs', ... });
const baseUrl = `http://localhost:4321/theme-preview`;
```

3. Update constants:

```typescript
// Remove:
export const DEMO_DIR = 'demo';
export const THEME_PREVIEW_HTML = 'theme-preview.html';

// Add:
export const DOCS_DIR = 'docs';
export const THEME_PREVIEW_PATH = '/theme-preview';
export const DEFAULT_DOCS_PORT = 4321;
```

---

### Option 2: Add Theme Preview to Getting Started Section

Instead of a standalone page, add theme preview as part of the Theming documentation page.

**Implementation:**
- Enhance `docs/src/content/docs/getting-started/theming.mdx`
- Add interactive theme switcher component
- Show live component examples that respond to theme changes

**Pros:**
- Integrates naturally with existing documentation
- Users learn about theming while seeing it in action

**Cons:**
- Less focused preview experience
- May not support `--all` flag easily

---

### Option 3: Leverage Storybook

Use Storybook's built-in theming support instead of a custom preview page.

**Implementation:**
1. Configure Storybook theme addon
2. Update `bp theme preview` to launch Storybook with theme param
3. Create a "Theme Preview" story that showcases all components

```typescript
// In previewServer.ts
const storybookProcess = spawn('npm', ['run', 'storybook'], { ... });
const baseUrl = `http://localhost:6006/?path=/story/theme-preview`;
```

**Pros:**
- Leverages existing Storybook infrastructure
- Rich component showcasing already exists
- Hot reload works out of the box

**Cons:**
- Slower startup than a simple page
- May be overkill for quick theme checks
- Different UX from documentation

---

### Option 4: Standalone HTML in Docs Public Folder

Create a self-contained HTML file in `docs/public/theme-preview.html` that doesn't need Astro processing.

**Implementation:**
- Place static HTML in `docs/public/theme-preview.html`
- Import components via script tag
- Handle theme switching with vanilla JS

**Pros:**
- Simple, no build step required
- Fast to load
- Can work with either Vite or Astro server

**Cons:**
- Duplicates component imports/setup
- Not integrated with docs site styling
- Maintenance burden

---

## Recommended Approach

**Option 1 (Dedicated Theme Preview Page)** is recommended because:

1. **Consistency**: Uses the same rendering context as the docs site
2. **Maintenance**: Single source of truth for component examples
3. **UX**: Familiar navigation within docs ecosystem
4. **Flexibility**: Can support all current features (single theme, all themes)

## Migration Steps

1. Create `docs/src/pages/theme-preview.astro`
2. Update `source/cli/lib/constants.ts`:
   - Remove `DEMO_DIR` and `THEME_PREVIEW_HTML`
   - Add `DOCS_DIR`, `THEME_PREVIEW_PATH`, `DEFAULT_DOCS_PORT`
3. Update `source/cli/lib/theme/previewServer.ts`:
   - Change to spawn docs dev server (`npm run dev` in `docs/` directory)
   - Update URL construction for new path
   - Update port default to 4321
4. Delete `demo/` directory
5. Update documentation references

## Theme Preview Page Features

The new theme preview page should support:

- [ ] Query param `?theme=<name>` to set initial theme
- [ ] Query param `?all=true` to show side-by-side comparison
- [ ] Theme selector dropdown (populated from available themes)
- [ ] Component showcase grid showing:
  - Buttons (all variants)
  - Form controls (input, select, checkbox, radio)
  - Feedback components (alert, badge, notification)
  - Navigation (tabs, breadcrumb, pagination)
  - Data display (card, table, avatar)
- [ ] Color palette visualization
- [ ] Typography samples
- [ ] Spacing/sizing examples

## Alternative: Deprecate Theme Preview Command

If the preview functionality isn't heavily used, consider:

1. Removing `bp theme preview` command entirely
2. Directing users to:
   - Storybook for component preview (`npm run storybook`)
   - Docs site theming page for theme documentation
   - Direct CSS file inspection for token values

This simplifies the CLI but loses the dedicated preview experience.

---

## Implementation Notes (Completed)

Option 1 was implemented with the following changes:

### Files Created
- `docs/src/pages/theme-preview.astro` - Full component showcase page with:
  - Buttons (variants, sizes, states)
  - Form controls (input, select, textarea, checkbox, radio, switch, slider)
  - Feedback components (alerts, badges, tags, progress, spinner)
  - Navigation (tabs, breadcrumb, pagination)
  - Data display (card, avatar, tooltip, skeleton)
  - Typography (headings, text, links)
  - Layout (divider, accordion)
  - Query param support (`?theme=<name>`, `?all=true`)
  - Theme selector dropdown with URL sync

### Files Modified
- `source/cli/lib/constants.ts`:
  - Removed: `DEMO_DIR`, `THEME_PREVIEW_HTML`
  - Added: `DOCS_DIR`, `THEME_PREVIEW_PATH`, `DEFAULT_DOCS_PORT`

- `source/cli/lib/theme/previewServer.ts`:
  - Changed to spawn docs dev server instead of Vite
  - Updated port default to 4321
  - Updated URL construction for new path
  - Changed working directory to `docs/`

### Usage
```bash
# Preview with default theme (light)
bp theme preview

# Preview specific theme
bp theme preview --theme dark

# Preview without auto-opening browser
bp theme preview --no-open
```

### Remaining Work
- Delete `demo/` directory (user will do manually)
- Implement side-by-side "all themes" comparison view (currently shows placeholder)
