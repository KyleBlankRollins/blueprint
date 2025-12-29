# Blueprint Architecture Exploration

## What is Blueprint?

Blueprint is meant to be a highly portable and customizable component library. It will start small, only covering the most common patterns in web projects.

The goal is to create reusable, framework-agnostic components that can be used across different projects without rebuilding the same UI patterns repeatedly.

## Technology Options

### 1. Native Web Components Only

Native web components use browser-standard APIs (Custom Elements, Shadow DOM, HTML Templates, ES Modules) without any library.

**Pros:**

- Zero dependencies — works everywhere HTML is supported
- Future-proof — built on web standards that browsers will support indefinitely
- Maximum portability — can be used with any framework (React, Vue, Angular, Svelte) or no framework at all
- Smallest possible bundle size
- No build step required for basic usage

**Cons:**

- Verbose boilerplate code (lots of manual DOM manipulation)
- No built-in reactivity system — you must manually track state changes and update the DOM
- Limited IDE support for templates (no syntax highlighting in template strings)
- Shadow DOM styling can be tricky to customize from outside the component
- Testing requires more setup
- No declarative templating — must use imperative DOM APIs or innerHTML

**Best for:** Simple, standalone components where minimal dependencies are critical.

### 2. Lit

Lit is a lightweight library (~5KB minified/compressed) from Google that builds on top of web components, adding a reactive rendering system.

**Pros:**

- Excellent developer experience with declarative templates using tagged template literals (`html\`...\``)
- Tiny footprint — adds minimal overhead to native web components
- Reactive properties automatically trigger efficient re-renders
- Scoped styles via Shadow DOM with easy opt-out
- First-class TypeScript support with decorators (`@customElement`, `@property`, `@state`)
- Strong ecosystem — used by Adobe, Google, IBM, Cisco, SAP, Red Hat, and many others
- Great documentation and active community
- Outputs standard web components — no lock-in

**Cons:**

- Lit becomes a runtime dependency for consumers (though it's very small)
- Decorators require TypeScript or Babel configuration
- Learning curve for developers unfamiliar with web components

**Best for:** Full-featured component libraries where developer experience and productivity matter.

### 3. Stencil

Stencil is a compiler (not a runtime library) created by the Ionic team that generates standard web components.

**Pros:**

- Compiles to vanilla web components with zero runtime in production
- JSX templating — familiar syntax for React developers
- Built-in TypeScript support
- Automatic documentation generation from JSDoc comments
- First-class framework integration wrappers for React, Vue, and Angular
- Lazy loading and automatic code splitting
- Built-in unit testing with Jest
- Generates framework-specific output targets (React components, Angular modules, etc.)

**Cons:**

- More complex build tooling and configuration
- Larger initial setup compared to Lit
- JSX diverges from HTML — may confuse developers expecting standard HTML
- Smaller community than Lit

**Best for:** Enterprise design systems that need to support multiple frameworks with optimized bundles.

### 4. FAST (by Microsoft)

FAST is Microsoft's web component library, powering Fluent UI Web Components.

**Pros:**

- High performance with a unique reactive DOM approach
- Adaptive UI system for theming
- Accessibility built into the foundation
- Enterprise-backed by Microsoft
- Design-token-driven customization

**Cons:**

- Steeper learning curve
- Smaller community compared to Lit
- More opinionated architecture

**Best for:** Enterprise applications requiring deep theming and accessibility compliance.

### 5. Hybrid Approach: Lit Core + Framework Wrappers

Many successful libraries (like Shoelace) use Lit to build the core components and then provide thin wrapper packages for React, Vue, etc.

**Pros:**

- Best developer experience for authoring components (Lit)
- Native integration for framework users (no awkward web component usage in React)
- Single source of truth for component logic

**Cons:**

- More packages to maintain
- Additional build complexity

## Recommendation

For Blueprint, **Lit** is the recommended choice because:

1. **Minimal overhead** — ~5KB is negligible for most projects
2. **Excellent DX** — Reactive properties, declarative templates, TypeScript support
3. **Proven at scale** — Used by Google, Adobe, IBM, SAP, and many design systems
4. **Standards-based** — Outputs real web components with no lock-in
5. **Active development** — Now part of the OpenJS Foundation (as of October 2025)

If zero-dependency is a hard requirement, native web components can work, but expect 2-3x more boilerplate code.

## What Does a Component Library Need?

### Core Infrastructure

- **Theming system** — CSS custom properties (design tokens) for colors, spacing, typography, shadows
- **Dark mode support** — Theme switching capability
- **Accessibility (a11y)** — ARIA attributes, keyboard navigation, focus management
- **Localization (i18n)** — RTL support, translatable strings
- **Documentation** — Interactive examples, API references, usage guidelines
- **Testing** — Unit tests, visual regression tests, accessibility audits

### Design Tokens

A well-structured token system typically includes:

| Category    | Examples                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| Colors      | `--bp-color-primary`, `--bp-color-danger`, `--bp-color-neutral-100`        |
| Spacing     | `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-md`, `--bp-spacing-lg` |
| Typography  | `--bp-font-size-sm`, `--bp-font-weight-bold`, `--bp-line-height-normal`    |
| Borders     | `--bp-border-radius-sm`, `--bp-border-width`                               |
| Shadows     | `--bp-shadow-sm`, `--bp-shadow-md`, `--bp-shadow-lg`                       |
| Transitions | `--bp-transition-fast`, `--bp-transition-slow`                             |

## Suggested Component List

Based on analysis of popular design systems (Shoelace, Carbon, Spectrum, Material, Fluent, Chakra, Radix, Open UI research), here are recommended components organized by priority:

### Phase 1: Foundation (Essential)

These components cover 80% of common UI patterns:

| Component           | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| **Button**          | Primary, secondary, outline, ghost, danger, loading states, icon support |
| **Input**           | Text input with labels, validation, help text, prefix/suffix slots       |
| **Textarea**        | Multi-line text input with auto-resize option                            |
| **Checkbox**        | Standard and indeterminate states                                        |
| **Radio**           | Radio buttons and radio groups                                           |
| **Switch / Toggle** | Boolean toggle control                                                   |
| **Select**          | Dropdown selection (single)                                              |
| **Icon**            | SVG icon wrapper with sizing                                             |
| **Spinner**         | Loading indicator                                                        |
| **Badge**           | Status indicators and counts                                             |
| **Alert**           | Informational, success, warning, error messages                          |
| **Card**            | Content container with header, body, footer slots                        |
| **Dialog / Modal**  | Overlay dialogs with focus trapping                                      |
| **Tooltip**         | Hover/focus information popups                                           |

### Phase 2: Enhanced Inputs & Navigation

| Component                   | Description                               |
| --------------------------- | ----------------------------------------- |
| **Multi-select**            | Dropdown with multiple selection and tags |
| **Combobox / Autocomplete** | Searchable dropdown                       |
| **Date Picker**             | Calendar-based date selection             |
| **Time Picker**             | Time input with dropdown                  |
| **Slider / Range**          | Numeric range selection                   |
| **Number Input**            | Increment/decrement numeric input         |
| **File Upload**             | Drag-and-drop file selection              |
| **Tabs**                    | Tabbed content navigation                 |
| **Breadcrumb**              | Navigation path indicator                 |
| **Pagination**              | Page navigation controls                  |
| **Menu**                    | Dropdown and context menus                |
| **Dropdown**                | Generic popover trigger                   |

### Phase 3: Layout & Data Display

| Component                | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **Avatar**               | User/entity image with fallback initials                |
| **Tag / Chip**           | Removable labels and filters                            |
| **Progress Bar**         | Determinate and indeterminate progress                  |
| **Skeleton**             | Loading placeholders                                    |
| **Toast / Notification** | Non-blocking alerts                                     |
| **Accordion**            | Collapsible content sections                            |
| **Table**                | Data tables with sorting, selection (consider headless) |
| **Tree**                 | Hierarchical data display                               |
| **Divider**              | Visual separator                                        |

### Phase 4: Advanced Components

| Component            | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **Drawer / Sidebar** | Slide-in panels                                            |
| **Popover**          | Rich content popovers                                      |
| **Color Picker**     | Color selection tool                                       |
| **Carousel**         | Image/content slider                                       |
| **Calendar**         | Full calendar display                                      |
| **Stepper / Wizard** | Multi-step form navigation                                 |
| **Rating**           | Star/icon rating input                                     |
| **Rich Text Editor** | WYSIWYG text editing (complex, consider wrapping existing) |

## Reference Design Systems

These are excellent resources for API design, accessibility patterns, and component structure:

| Library                                                                         | Technology | Notes                                                                                |
| ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| [Shoelace](https://shoelace.style)                                              | Lit        | Excellent reference for Lit-based components, now part of Font Awesome (Web Awesome) |
| [Carbon Web Components](https://carbondesignsystem.com)                         | Lit        | IBM's design system, enterprise-grade                                                |
| [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components) | Lit        | Adobe's design system                                                                |
| [Lion](https://lion.js.org)                                                     | Lit        | ING Bank's white-label components                                                    |
| [Ionic](https://ionicframework.com)                                             | Stencil    | Mobile-first components                                                              |
| [Radix UI](https://radix-ui.com)                                                | React      | Headless primitives, great a11y patterns                                             |
| [Open UI](https://open-ui.org)                                                  | Research   | W3C community group defining component standards                                     |

## Next Steps

1. **Set up project structure** — TypeScript, build tooling (Vite or Rollup), testing (Web Test Runner)
2. **Define design tokens** — Create the theming foundation
3. **Build Button component** — Start with the most fundamental component
4. **Establish patterns** — Document coding conventions, testing approach, accessibility requirements
5. **Iterate** — Add components based on actual project needs
