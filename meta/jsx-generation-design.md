# Design: Auto-generate `jsx.d.ts`

## Problem

`source/jsx.d.ts` is hand-maintained. It provides JSX type declarations so that Blueprint components have IntelliSense in Astro, React, and Solid. Because it's manual, it drifts from the actual component APIs — the recent audit found **36 of 44 components** had mismatches (ghost props, missing props, wrong names, wrong types).

Every time a component is created, modified, or deleted, someone must remember to update `jsx.d.ts` separately. They don't.

## Goals

1. **Single source of truth.** Component `@property()` declarations are the authority. `jsx.d.ts` is derived, never authored.
2. **Always accurate.** Generated output matches every public property on every component, including type, name, and optionality.
3. **Zero maintenance.** Adding a new component or changing a prop requires zero manual steps in `jsx.d.ts`.
4. **CI-enforceable.** Can be run in CI to verify the checked-in file is up to date (fail if stale).
5. **Readable output.** The generated file should be well-formatted and look like something a human would write — organized imports, grouped interfaces, clear comments.

## Non-goals

- Generating types for events, slots, or CSS parts (these aren't part of JSX prop interfaces).
- Supporting frameworks beyond Astro, React, and Solid (the current three namespace augmentations).
- Replacing the existing `extractAPI()` function — we'll reuse its proven property-parsing logic.

## Design

### CLI integration

New subcommand under the existing `generate` command:

```
bp generate jsx            # Generate source/jsx.d.ts
bp generate jsx --check    # Exit 1 if the file would change (for CI)
```

Matching npm script:

```json
"generate:jsx": "npm run build:cli && node dist/cli/index.js generate jsx"
```

### Architecture

```
source/cli/
├── commands/
│   └── generate.ts              # Add 'jsx' subcommand here
├── lib/
│   └── component/
│       ├── extractAPI.ts        # Existing — reuse extractProperties()
│       └── generateJsx.ts       # NEW — orchestrator + emitter
```

One new file: `generateJsx.ts`. It handles discovery, extraction, and code emission.

### Processing pipeline

```
1. Discover components
       ↓
2. Parse each component file
       ↓
3. Build intermediate representation
       ↓
4. Emit jsx.d.ts
```

#### Step 1: Discover components

Scan `source/components/` for directories containing a matching `.ts` file (same logic as `list.ts`). For each directory `foo/`, look for `foo.ts`.

#### Step 2: Parse each component file

For each component file, extract:

| Data               | Source                              | Example                       |
| ------------------ | ----------------------------------- | ----------------------------- |
| Tag name(s)        | `@customElement('bp-xxx')`          | `bp-button`, `bp-tab-panel`   |
| Class name(s)      | `class BpXxx extends LitElement`    | `BpButton`, `BpTabPanel`      |
| Properties         | `@property({ ... }) declare xxx: T` | `variant: ButtonVariant`      |
| Property options   | `type`, `reflect`, `attribute`      | `attribute: 'show-close'`     |
| Type alias exports | `export type XxxYyy = ...`          | `ButtonVariant`, `DrawerSize` |
| Interface exports  | `export interface Xxx { ... }`      | `TreeNode`, `TableColumn`     |

**Multi-component files.** Some files define sub-components (tabs → `bp-tab-panel`, menu → `bp-menu-item` + `bp-menu-divider`, accordion → `bp-accordion-item`, breadcrumb → `bp-breadcrumb-item`). The parser scans for _all_ `@customElement()` decorators in a file and associates each with its class's `@property()` declarations.

**Property filtering rules:**

- Include: all `@property()` fields that are **not** `private` and **not** `attribute: false`.
- Exclude: `private` properties (like drawer's `hasHeader`, `hasFooter`).
- Special case: `attribute: false` public properties (only slider's `formatValue` currently). Exclude these — they're function types that can't be set via JSX attributes, and Astro (our primary consumer) treats JSX as HTML attributes. If we later need React-style property setting, we can revisit.

#### Step 3: Build intermediate representation

```typescript
interface ComponentInfo {
  /** e.g. 'bp-button' */
  tagName: string;
  /** e.g. 'BpButton' */
  className: string;
  /** e.g. 'button' — the directory/file name */
  componentName: string;
  /** Public properties */
  properties: PropertyDef[];
  /** Type aliases to import (e.g. 'ButtonVariant') */
  typeImports: string[];
  /** Interface imports (e.g. 'TreeNode') */
  interfaceImports: string[];
}

interface PropertyDef {
  /** JS property name (camelCase), used as the JSX prop name */
  name: string;
  /** TypeScript type as written in source */
  rawType: string;
  /** The Lit `type` option: String, Boolean, Number, Array, Object */
  litType: string;
  /** Custom HTML attribute name, if different from property name */
  attribute?: string;
}
```

#### Step 4: Emit `jsx.d.ts`

The emitter generates the file in sections, matching the structure of the current hand-written file:

1. **Header comment** — describes purpose, marks as auto-generated with a `DO NOT EDIT` warning.
2. **Imports** — import type aliases and interfaces from component files. Only import what's actually referenced. Grouped by component.
3. **Helper types** — `BaseHTMLAttributes`, `StringAttr<T>`, `BooleanAttr`, `NumberAttr<T>` (static, always emitted).
4. **Component prop interfaces** — one `BpXxxProps` interface per tag name, extending `BaseHTMLAttributes`.
5. **`BlueprintElements` map** — maps tag names to prop interfaces.
6. **Namespace augmentations** — Astro, React/global JSX, Solid.

### Type mapping rules

The emitter maps Lit property types to JSX prop types:

| Lit `type` | TS type in source        | JSX prop type                     |
| ---------- | ------------------------ | --------------------------------- |
| `String`   | `string`                 | `string`                          |
| `String`   | `FooVariant` (alias)     | `StringAttr<FooVariant>`          |
| `String`   | `'a' \| 'b' \| 'c'`      | `StringAttr<'a' \| 'b' \| 'c'>`   |
| `Boolean`  | `boolean`                | `BooleanAttr`                     |
| `Number`   | `number`                 | `NumberAttr`                      |
| `Number`   | `HeadingLevel` (numeric) | `NumberAttr<HeadingLevel>`        |
| `Array`    | `string[]`               | `string[]`                        |
| `Array`    | `TableColumn[]`          | `TableColumn[]`                   |
| `Object`   | `TableSortState \| null` | `TableSortState \| null`          |
| —          | `(v: number) => string`  | _(excluded — `attribute: false`)_ |

**How to detect named type aliases vs inline unions:**

- If the raw type matches `^[A-Z][A-Za-z]+$` (single PascalCase identifier), it's a named type → import it and wrap in the appropriate helper.
- If the raw type contains `|` (pipe), it's an inline union → wrap in `StringAttr<...>` or `NumberAttr<...>`.
- If the raw type is `boolean`, use `BooleanAttr`.
- If the raw type is `number`, use `NumberAttr`.
- If the raw type is `string`, use `string` (no wrapper — already accepts any string).
- Arrays and objects pass through as-is.

**Nullable types:** If the raw type includes `| null` (e.g., `string | null`, `TableSortState | null`), preserve the null in the output.

### Import generation

The emitter collects all referenced type aliases and interfaces, then generates import statements grouped by component file:

```typescript
import type { ButtonVariant, ButtonSize } from './components/button/button.js';
import type {
  TableColumn,
  TableRow,
  TableSortState,
  TableVariant,
  TableSize,
} from './components/table/table.js';
```

**Rules:**

- Only import types that are actually referenced in the generated interfaces.
- Use relative paths from `source/` (since `jsx.d.ts` lives in `source/`).
- Sort imports alphabetically by component path.
- Sort type names alphabetically within each import.

### Property name handling

JSX props use the **JS property name** (camelCase), not the HTML attribute name:

| JS property (used in JSX) | HTML attribute      | `@property()` config             |
| ------------------------- | ------------------- | -------------------------------- |
| `showClose`               | `show-close`        | `attribute: 'show-close'`        |
| `closeOnBackdrop`         | `close-on-backdrop` | `attribute: 'close-on-backdrop'` |
| `ariaLabel`               | `aria-label`        | `attribute: 'aria-label'`        |
| `noPadding`               | `nopadding`         | _(default, no custom attribute)_ |

The attribute name is irrelevant for JSX generation. We always use the JS property name.

### `--check` mode

When `--check` is passed:

1. Generate the content to a string (don't write to disk).
2. Read the existing `source/jsx.d.ts`.
3. Compare. If different, print a diff summary and exit with code 1.
4. If identical, exit with code 0.

This enables a CI step:

```yaml
- run: npx bp generate jsx --check
```

### Formatting

The generated file will be formatted with Prettier via the project's existing config. The generator emits clean, readable code, but Prettier gets the final say on formatting. The `--check` mode compares against the Prettier-formatted output.

## File structure changes

```
source/cli/lib/component/
  generateJsx.ts         # NEW — core generation logic

source/cli/commands/
  generate.ts            # MODIFIED — add 'jsx' subcommand
```

## Example output (abbreviated)

```typescript
/**
 * JSX type declarations for Blueprint components.
 *
 * ⚠️  AUTO-GENERATED — DO NOT EDIT
 * Run `bp generate jsx` to regenerate.
 */

import type { ButtonVariant, ButtonSize } from './components/button/button.js';
import type {
  DrawerPlacement,
  DrawerSize,
} from './components/drawer/drawer.js';
// ... more imports

interface BaseHTMLAttributes {
  /* ... static content ... */
}
type StringAttr<T extends string> = T | (string & {});
type BooleanAttr = boolean | 'true' | 'false' | '';
type NumberAttr<T extends number = number> = T | `${number}`;

interface BpButtonProps extends BaseHTMLAttributes {
  variant?: StringAttr<ButtonVariant>;
  size?: StringAttr<ButtonSize>;
  disabled?: BooleanAttr;
  type?: StringAttr<'button' | 'submit' | 'reset'>;
}

// ... more interfaces

export interface BlueprintElements {
  'bp-button': BpButtonProps;
  // ...
}

// Astro, React, Solid namespace augmentations
```

## Open questions

1. **Should `attribute: false` public properties be included?** Current plan: exclude. The only case is slider's `formatValue` (a function). If a component later adds a public `attribute: false` property with a serializable type, we may want to include it for React/Solid (which set properties, not attributes). Astro would still ignore it.

2. **Should we also auto-generate the `HTMLElementTagNameMap` declarations in each component file?** These are currently hand-written at the bottom of each component. Not in scope for this feature, but could be a follow-up.
