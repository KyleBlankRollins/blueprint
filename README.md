# Blueprint Component Library

Blueprint is a highly portable and customizable component library built on top of Lit.

## Why use Lit?

Lit is a lightweight library (~5KB minified/compressed) from Google that builds on top of web components, adding a reactive rendering system. There are many pros to using Lit:

- Excellent developer experience with declarative templates using tagged template literals (`html\`...\``)
- Tiny footprint — adds minimal overhead to native web components
- Reactive properties automatically trigger efficient re-renders
- Scoped styles via Shadow DOM with easy opt-out
- First-class TypeScript support with decorators (`@customElement`, `@property`, `@state`)
- Strong ecosystem — used by Adobe, Google, IBM, Cisco, SAP, Red Hat, and many others
- Great documentation and active community
- Outputs standard web components — no lock-in

The only real downsides are introducing a dependency and complicating build tooling.

## Project Status

🚧 **Early Development** - Blueprint is currently in the initial setup phase. The development infrastructure is complete and ready for component development, but **no components have been built yet**.

**What's Ready:**

- ✅ Lit + TypeScript + Vite build system
- ✅ ESLint and Prettier configuration
- ✅ Design token foundation (CSS custom properties)
- ✅ Development server with demo page
- ✅ Project structure and conventions

**What's Next:**

- 🔜 First component (Button recommended)
- 🔜 Component documentation patterns
- 🔜 Testing infrastructure
- 🔜 Additional design system features

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Development Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd blueprint
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173/demo/ to see the component demo page

### Available Scripts

| Script                 | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start development server with hot reload          |
| `npm run build`        | Build library for production (outputs to `dist/`) |
| `npm run preview`      | Preview the built library                         |
| `npm run lint`         | Run ESLint on source code                         |
| `npm run lint:fix`     | Fix auto-fixable ESLint issues                    |
| `npm run format`       | Format code with Prettier                         |
| `npm run format:check` | Check if code is properly formatted               |

## Component Development Workflow

Blueprint uses a multi-agent workflow orchestrated by the `bp agent` CLI command. This workflow ensures components follow best practices, pass quality gates, and maintain consistency across the library.

### Quick Start

```bash
# Start creating a new component
bp agent create modal

# Review code quality
bp agent review modal

# Advance to next phase (runs quality gates automatically)
bp agent next

# Check status anytime
bp agent status
```

### Workflow Phases

Each component progresses through three phases with automated quality enforcement:

#### 1. **Create** — Component Implementation

```bash
bp agent create <component-name>
```

**What happens:**

- ✅ Loads component definition from `.blueprint/features.toml`:
  - Description, category, complexity, priority
  - Dependencies (e.g., modal depends on button, icon)
- ✅ Creates session in `.blueprint/agent-state.json`
- ✅ Opens VS Code with component-creator agent context
- ✅ Agent creates required files:
  - `component-name.ts` - Component logic with @customElement
  - `component-name.style.ts` - Styles using design tokens
  - `component-name.test.ts` - 10+ test cases
  - `component-name.stories.ts` - Storybook documentation
  - `README.md` - API documentation

#### 2. **Code Review** — Quality Verification

```bash
bp agent review <component-name>
# or automatically triggered by: bp agent next
```

**What happens:**

- ✅ Code-review agent checks:
  - Blueprint patterns adherence
  - TypeScript usage
  - Test coverage and quality
  - Documentation completeness
  - Accessibility implementation
- ✅ Increments `iterations_taken` counter
- ✅ Suggests specific improvements with file paths and line numbers

#### 3. **Design Review** — Visual & UX Polish

```bash
bp agent next  # (advances from code-review)
```

**What happens:**

- ✅ Designer agent reviews:
  - Design token usage (colors, spacing, typography)
  - Visual consistency with existing components
  - Responsive behavior
  - UX patterns and interaction feedback
  - Accessibility from user experience perspective

### Quality Gates

Before advancing between phases, **4 automated quality gates** must pass:

| Gate                   | Command                | Blocking?     |
| ---------------------- | ---------------------- | ------------- |
| 1️⃣ **Code Formatting** | `npm run format:check` | ⚠️ Warning    |
| 2️⃣ **Linting**         | `npm run lint`         | 🚫 **BLOCKS** |
| 3️⃣ **Type Checking**   | `npm run typecheck`    | 🚫 **BLOCKS** |
| 4️⃣ **Test Suite**      | `npm test`             | 🚫 **BLOCKS** |

**Quality gates run automatically** when you execute `bp agent next` to advance phases. If any blocking gate fails, the component status becomes `blocked` and you must fix the issues before advancing.

Run quality gates manually without advancing:

```bash
bp agent verify <component-name>
```

### Dependency Tracking

Components can declare dependencies in `.blueprint/features.toml`:

```toml
[[component]]
name = "modal"
description = "Dialog overlay"
depends_on = ["button", "icon"]  # Won't start until these are complete
```

The workflow automatically checks dependencies before allowing components to advance.

### Example: Creating a Modal Component

```bash
# Step 1: Start creation
bp agent create modal

# Output shows feature metadata:
# 🏗️ Starting component creation for: bp-modal
# 📋 Feature: Dialog overlay
# 📊 Category: composite | Complexity: large | Priority: 4
# 🔗 Dependencies: button, icon
# 💡 Instructions sent to VS Code Copilot...

# Step 2: Component-creator builds files
# (agent creates modal.ts, modal.style.ts, modal.test.ts, etc.)

# Step 3: Advance to code review
bp agent next

# Quality gates run automatically:
# 🔍 Verifying quality gates...
#   📐 Quality Gate 1/4: Code Formatting
#   ✅ Formatting check passed
#   🔎 Quality Gate 2/4: Linting (BLOCKING)
#   ✅ Linting passed
#   🔤 Quality Gate 3/4: Type Checking (BLOCKING)
#   ✅ Type checking passed
#   🧪 Quality Gate 4/4: Test Suite (BLOCKING)
#   ✅ All tests passed
# ✅ ALL QUALITY GATES PASSED
# ✅ Component creation phase complete
# 🔍 Starting code review phase...

# Step 4: Code review suggests improvements
# (make changes based on feedback)

# Step 5: Advance to design review
bp agent next

# Step 6: Complete component
bp agent next
# 🎉 Component bp-modal is complete!
```

### Agent Commands Reference

| Command                                        | Description                                |
| ---------------------------------------------- | ------------------------------------------ |
| `bp agent create <name>`                       | Start component creation workflow          |
| `bp agent review <name> [--type code\|design]` | Start code or design review                |
| `bp agent next`                                | Advance to next phase (runs quality gates) |
| `bp agent verify [name]`                       | Run quality gates without advancing        |
| `bp agent status [name]`                       | Show component development status          |

### Workflow State Files

The workflow maintains state in `.blueprint/`:

- **`features.toml`** - Component definitions (name, description, category, complexity, priority, dependencies)
- **`agent-state.json`** - Current sessions and phase status
- **`progress.txt`** - Append-only log of all workflow events

### Project Structure

```
blueprint/
├── source/
│   ├── components/          # Individual components (Button, Input, etc.)
│   ├── themes/
│   │   ├── light.css       # Design tokens and CSS variables
│   │   └── index.ts        # Theme utilities
│   └── index.ts            # Main library export
├── demo/
│   └── index.html          # Development demo page
├── dist/                   # Built library output (ESM only)
├── meta/                   # Documentation and architecture notes
└── [configuration files]   # TypeScript, ESLint, Prettier, Vite config
```

### Technology Stack

- **Lit 3.3** — Web component library with reactive properties
- **TypeScript** — Type safety and developer experience
- **Vite** — Fast development server and build tool
- **ESLint + Prettier** — Code quality and formatting
- **CSS Custom Properties** — Design token system

## Roadmap

### Implemented Features

- ✅ **Theming system** — CSS custom properties (design tokens) for colors, spacing, typography, shadows, transitions, and z-index
- ✅ **Development environment** — Vite dev server with hot reload
- ✅ **Code quality** — ESLint and Prettier integration
- ✅ **TypeScript** — Full type safety with decorators support

### Planned Features

- 🔜 **Component library** — Starting with Phase 1 foundation components
- 🔜 **Testing infrastructure** — Unit tests, visual regression tests, accessibility audits
- 🔜 **Dark mode support** — Theme switching capability
- 🔜 **Accessibility (a11y)** — ARIA attributes, keyboard navigation, focus management
- 🔜 **Localization (i18n)** — RTL support, translatable strings
- 🔜 **Documentation** — Interactive examples, API references, usage guidelines

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

All design tokens are defined in [`source/themes/light.css`](source/themes/light.css) and follow the `--bp-*` naming convention.

## Planned Components

Based on analysis of popular design systems (Shoelace, Carbon, Spectrum, Material, Fluent, Chakra, Radix, Open UI research), here are the components we plan to build, organized by priority:

> **Note:** No components have been implemented yet. The infrastructure is ready for development to begin.

### Phase 1: Foundation (Essential)

These components cover 80% of common UI patterns:

| Component           | Status | Description                                                              |
| ------------------- | ------ | ------------------------------------------------------------------------ |
| **Button**          | ✅     | Primary, secondary, outline, ghost, danger, loading states, icon support |
| **Input**           | ✅     | Text input with labels, validation, help text, prefix/suffix slots       |
| **Textarea**        | ✅     | Multi-line text input with auto-resize option                            |
| **Checkbox**        | ✅     | Standard and indeterminate states                                        |
| **Radio**           | ✅     | Radio buttons and radio groups                                           |
| **Switch / Toggle** | ✅     | Boolean toggle control                                                   |
| **Select**          | ✅     | Dropdown selection (single)                                              |
| **Icon**            | ✅     | SVG icon wrapper with sizing                                             |
| **Spinner**         | ✅     | Loading indicator                                                        |
| **Badge**           | ✅     | Status indicators and counts                                             |
| **Alert**           | ✅     | Informational, success, warning, error messages                          |
| **Card**            | ✅     | Content container with header, body, footer slots                        |
| **Dialog / Modal**  | ✅     | Overlay dialogs with focus trapping                                      |
| **Tooltip**         | ✅     | Hover/focus information popups                                           |

### Phase 2: Enhanced Inputs & Navigation

| Component                   | Status | Description                               |
| --------------------------- | ------ | ----------------------------------------- |
| **Multi-select**            | ✅     | Dropdown with multiple selection and tags |
| **Combobox / Autocomplete** | ✅     | Searchable dropdown                       |
| **Date Picker**             | ✅     | Calendar-based date selection             |
| **Time Picker**             | ✅     | Time input with dropdown                  |
| **Slider / Range**          | ✅     | Numeric range selection                   |
| **Number Input**            | ✅     | Increment/decrement numeric input         |
| **File Upload**             | ✅     | Drag-and-drop file selection              |
| **Tabs**                    | ✅     | Tabbed content navigation                 |
| **Breadcrumb**              | ✅     | Navigation path indicator                 |
| **Pagination**              | ✅     | Page navigation controls                  |
| **Menu**                    | ✅     | Dropdown and context menus                |
| **Dropdown**                | ✅     | Generic popover trigger                   |

### Phase 3: Layout & Data Display

| Component                | Status | Description                                             |
| ------------------------ | ------ | ------------------------------------------------------- |
| **Avatar**               | ✅     | User/entity image with fallback initials                |
| **Tag / Chip**           | ✅     | Removable labels and filters                            |
| **Progress Bar**         | ✅     | Determinate and indeterminate progress                  |
| **Divider**              | ✅     | Visual separator                                        |
| **Heading**              | ✅     | Typography component for headings                       |
| **Link**                 | ✅     | Hyperlink component                                     |
| **Text**                 | ✅     | Text/paragraph component                                |
| **Skeleton**             | ✅     | Loading placeholders                                    |
| **Toast / Notification** | ✅     | Non-blocking alerts                                     |
| **Accordion**            | ✅     | Collapsible content sections                            |
| **Table**                | ✅     | Data tables with sorting, selection (consider headless) |
| **Tree**                 | ✅     | Hierarchical data display                               |

### Phase 4: Advanced Components

| Component            | Status | Description                |
| -------------------- | ------ | -------------------------- |
| **Drawer / Sidebar** | ✅     | Slide-in panels            |
| **Popover**          | ✅     | Rich content popovers      |
| **Color Picker**     | ✅     | Color selection tool       |
| **Stepper / Wizard** | ✅     | Multi-step form navigation |

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

Ready to start building? Here's the recommended path:

1. **Build the Button component** - Start with the most fundamental component from Phase 1
   - Create `source/components/bp-button/` folder
   - Implement component logic, styles, and TypeScript types
   - Add examples to the demo page
   - Export from `source/components/index.ts`

2. **Establish patterns** - Use Button as the reference for:
   - Component structure and file organization
   - Style architecture and design token usage
   - TypeScript patterns and decorators
   - Accessibility implementation

3. **Build remaining Phase 1 components** - Input, Checkbox, Radio, etc.

4. **Add testing infrastructure** - Set up Web Test Runner or Vitest

5. **Expand to Phase 2** - Enhanced inputs and navigation components

## Contributing

### Creating a Component

1. Create a new folder in `source/components/[component-name]/`
2. Add the component implementation with proper TypeScript types
3. Export the component from `source/components/index.ts`
4. Add examples to the demo page
5. Ensure accessibility and responsive design

### Code Quality

- All code must pass ESLint and Prettier checks
- Components should use design tokens from the theme system
- Follow semantic HTML and ARIA best practices
- Include TypeScript types for all public APIs

## License

MIT License - see [LICENSE](LICENSE) file for details.
