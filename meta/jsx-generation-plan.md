# Implementation Plan: Auto-generate `jsx.d.ts`

Based on [jsx-generation-design.md](jsx-generation-design.md).

## Architecture for concurrent work

The design specifies a single `generateJsx.ts` file. To enable concurrent implementation, we split it into three files with clearly defined contracts:

```
source/cli/lib/component/
├── extractAPI.ts           # EXISTING — untouched
├── jsxParser.ts            # NEW — Agent A
├── jsxEmitter.ts           # NEW — Agent B
└── generateJsx.ts          # NEW — Agent C (thin orchestrator)

source/cli/commands/
└── generate.ts             # MODIFIED — Agent C

source/cli/lib/component/__tests__/
├── jsxParser.test.ts       # NEW — Agent A
├── jsxEmitter.test.ts      # NEW — Agent B
└── generateJsx.test.ts     # NEW — Agent C

package.json                # MODIFIED — Agent C
source/jsx.d.ts             # REGENERATED — final verification step
```

### File ownership rules

Each agent owns specific files. **No agent writes to another agent's files.** The orchestrator (Agent C) depends on A and B being complete, so it runs last.

---

## Shared contracts (define before any agent starts)

These interfaces are the contract between the parser and emitter. Both agents import them. They live in `jsxParser.ts` (Agent A's file) since the parser produces them and the emitter consumes them.

```typescript
/** Represents one parsed component (or sub-component) */
export interface ComponentInfo {
  tagName: string; // 'bp-button'
  className: string; // 'BpButton'
  componentName: string; // 'button' (directory name)
  sourceFile: string; // 'components/button/button.ts'
  properties: PropertyDef[];
  exportedTypes: ExportedType[];
}

/** A single @property() declaration */
export interface PropertyDef {
  name: string; // JS property name (camelCase)
  rawType: string; // TypeScript type as written ('ButtonVariant', 'boolean', "'a' | 'b'")
  litType: string; // 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'
}

/** A type alias or interface exported from the component file */
export interface ExportedType {
  name: string; // 'ButtonVariant', 'TableColumn'
  kind: 'type' | 'interface'; // whether it's `export type` or `export interface`
}
```

---

## Agent A: Parser (`jsxParser.ts` + `jsxParser.test.ts`)

**Owns:** `source/cli/lib/component/jsxParser.ts`, `source/cli/lib/component/__tests__/jsxParser.test.ts`

**Depends on:** Nothing. Reads component source files from disk.

### Responsibilities

1. **Export the shared interfaces** (`ComponentInfo`, `PropertyDef`, `ExportedType`) from the top of the file.
2. **Implement `discoverComponents(rootDir: string): string[]`** — scan `source/components/` for valid component directories (directories containing a matching `.ts` file). Return sorted list of component names (e.g., `['accordion', 'alert', 'avatar', ...]`).
3. **Implement `parseComponentFile(rootDir: string, componentName: string): ComponentInfo[]`** — parse a single component source file, returning one `ComponentInfo` per `@customElement()` found. Returns an array because some files define sub-components (tabs.ts → 2, menu.ts → 3).

### Parsing requirements

The parser reads the raw `.ts` file as a string (no AST — follow the project's existing `extractAPI.ts` pattern of regex-based parsing).

**Extract from each file:**

| Data                | Regex pattern                                                                | Notes                                     |
| ------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- |
| Tag names           | `@customElement\(['"](.+?)['"]\)`                                            | Multiple per file possible                |
| Class declarations  | `class\s+(\w+)\s+extends\s+LitElement`                                       | Associate with preceding `@customElement` |
| Properties          | `@property\(\{([^}]*)\}\)\s*(private\s+)?declare\s+(\w+)\s*:\s*([^;]+)`      | Skip `private`. Skip `attribute: false`.  |
| Lit type            | `type:\s*(String\|Boolean\|Number\|Array\|Object)` inside `@property({...})` | Defaults to `String` if absent            |
| Exported types      | `export\s+type\s+(\w+)\s*=`                                                  | Collect name                              |
| Exported interfaces | `export\s+interface\s+(\w+)`                                                 | Collect name                              |

**Property filtering:**

- If `private` keyword appears between `@property(...)` and `declare`, exclude.
- If `attribute:\s*false` appears in the `@property({...})` options, exclude.

**Multi-component association:**

- Track which class each property belongs to by scanning sequentially: when a new `@customElement` + `class` is found, subsequent `@property()` declarations belong to that class, until the next `@customElement` + `class`.

### Test cases (`jsxParser.test.ts`)

Write tests using the real component files on disk (not mocks). This ensures the parser stays accurate as components evolve.

| #   | Test                                                                    | Validates                 |
| --- | ----------------------------------------------------------------------- | ------------------------- |
| 1   | `discoverComponents` returns all component directories                  | Discovery                 |
| 2   | `discoverComponents` skips `index.ts`-only directories                  | Discovery edge case       |
| 3   | Parse `button.ts` → 1 ComponentInfo, 4 properties                       | Simple component          |
| 4   | Parse `button.ts` → exports `ButtonVariant`, `ButtonSize`               | Type extraction           |
| 5   | Parse `tabs.ts` → 2 ComponentInfos (`bp-tabs`, `bp-tab-panel`)          | Multi-component           |
| 6   | Parse `menu.ts` → 3 ComponentInfos                                      | Multi-component (3)       |
| 7   | Parse `drawer.ts` → excludes `hasHeader`, `hasFooter` (private)         | Private filtering         |
| 8   | Parse `slider.ts` → excludes `formatValue` (attribute: false)           | attribute:false filtering |
| 9   | Parse `drawer.ts` → `showClose` property name (not `show-close`)        | Property name = JS name   |
| 10  | Parse `table.ts` → includes array/object types (`columns`, `sortState`) | Complex types             |
| 11  | Parse all components without errors                                     | Smoke test                |

---

## Agent B: Emitter (`jsxEmitter.ts` + `jsxEmitter.test.ts`)

**Owns:** `source/cli/lib/component/jsxEmitter.ts`, `source/cli/lib/component/__tests__/jsxEmitter.test.ts`

**Depends on:** The `ComponentInfo`, `PropertyDef`, `ExportedType` interfaces from Agent A. Agent B can import these types — but since Agent A may not be done yet, Agent B should **copy the interface definitions into a comment or test fixture** during development, then switch to the real import when wiring up in Agent C's phase.

**Practical approach:** Agent B should define its own local copies of the interfaces at the top of `jsxEmitter.ts` (re-exported from jsxParser), with an import: `import type { ComponentInfo, PropertyDef, ExportedType } from './jsxParser.js';`. If Agent A isn't done yet, Agent B can temporarily define these inline, but the final version **must** import from `jsxParser.ts`.

### Responsibilities

1. **Implement `emitJsxDeclarations(components: ComponentInfo[]): string`** — takes the full list of parsed components and returns the complete `jsx.d.ts` file content as a string.

### Emission sections (in order)

The emitter builds the output string by concatenating these sections:

#### Section 1: Header

```typescript
/**
 * JSX type declarations for Blueprint components.
 *
 * This file augments global JSX namespaces so that Blueprint custom elements
 * have proper IntelliSense in JSX/TSX environments (Astro, React, Solid, etc.).
 *
 * For HTML environments, the HTMLElementTagNameMap declarations in each
 * component file provide type information.
 *
 * ⚠️  AUTO-GENERATED — DO NOT EDIT
 * Run `npx bp generate jsx` to regenerate from component source files.
 */
```

#### Section 2: Imports

Generate `import type { ... } from './components/xxx/xxx.js';` statements.

**Logic:**

- For each `ComponentInfo`, look at its `properties[].rawType` values and check which match entries in `exportedTypes[].name`.
- Only import types that are actually used in property declarations.
- Group imports by source file path, sort types alphabetically within each import.
- Sort import statements alphabetically by path.
- Also scan for types referenced inside union types (e.g., if rawType is `'TableSortState | null'`, extract `TableSortState`).

Special import: `IconName` from `./components/icon/icons/registry.generated.js` — detect if any property references `IconName` and add this import.

#### Section 3: Helper types (static content)

Emit the `BaseHTMLAttributes`, `StringAttr<T>`, `BooleanAttr`, `NumberAttr<T>` definitions verbatim. These don't change.

```typescript
interface BaseHTMLAttributes {
  id?: string;
  class?: string;
  style?: string;
  slot?: string;
  hidden?: boolean;
  title?: string;
  children?: unknown;
  onclick?: string | ((event: MouseEvent) => void);
  onchange?: string | ((event: Event) => void);
  oninput?: string | ((event: Event) => void);
  onfocus?: string | ((event: FocusEvent) => void);
  onblur?: string | ((event: FocusEvent) => void);
  onkeydown?: string | ((event: KeyboardEvent) => void);
  onkeyup?: string | ((event: KeyboardEvent) => void);
  onsubmit?: string | ((event: Event) => void);
}

type StringAttr<T extends string> = T | (string & {});
type BooleanAttr = boolean | 'true' | 'false' | '';
type NumberAttr<T extends number = number> = T | `${number}`;
```

#### Section 4: Component prop interfaces

For each `ComponentInfo`, emit one interface:

```typescript
interface BpXxxProps extends BaseHTMLAttributes {
  propName?: JsxType;
  // ...
}
```

**Type mapping function `mapPropertyType(prop: PropertyDef, exportedTypes: ExportedType[]): string`:**

| Condition                                                      | Output                                                                                       |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `rawType === 'boolean'`                                        | `BooleanAttr`                                                                                |
| `rawType === 'number'`                                         | `NumberAttr`                                                                                 |
| `rawType === 'string'`                                         | `string`                                                                                     |
| `rawType` ends with `[]`                                       | Pass through as-is (e.g., `string[]`, `TableColumn[]`)                                       |
| `rawType` contains `\| null` and is not a string union         | Strip `\| null`, map the base type, then re-add `\| null`                                    |
| `rawType` matches a single PascalCase name that's a type alias | `StringAttr<TypeName>` (for String lit type) or `NumberAttr<TypeName>` (for Number lit type) |
| `rawType` contains `\|` (inline union of string literals)      | `StringAttr<raw_type_here>`                                                                  |
| Anything else (Object types, interfaces)                       | Pass through as-is                                                                           |

All properties are optional (`?`).

**Interface naming:** Convert tag name to PascalCase + "Props": `bp-button` → `BpButtonProps`, `bp-tab-panel` → `BpTabPanelProps`, `bp-menu-divider` → `BpMenuDividerProps`.

**Empty interfaces** (components with no properties, like `bp-menu-divider`):

```typescript
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BpMenuDividerProps extends BaseHTMLAttributes {}
```

**Ordering:** Sort interfaces alphabetically by tag name.

#### Section 5: BlueprintElements map

```typescript
export interface BlueprintElements {
  'bp-accordion': BpAccordionProps;
  'bp-accordion-item': BpAccordionItemProps;
  // ... sorted alphabetically by tag name
}
```

#### Section 6: Namespace augmentations (static content)

Emit the three namespace augmentation blocks verbatim (Astro, global JSX, Solid).

### Test cases (`jsxEmitter.test.ts`)

Use hand-crafted `ComponentInfo[]` fixtures — don't depend on the parser or disk.

| #   | Test                                                                               | Validates        |
| --- | ---------------------------------------------------------------------------------- | ---------------- |
| 1   | Empty components array → still emits header, helpers, empty BlueprintElements      | Minimal output   |
| 2   | Single simple component (button-like) → correct interface with StringAttr wrapping | Basic emission   |
| 3   | Boolean prop → `BooleanAttr`                                                       | Type mapping     |
| 4   | Number prop → `NumberAttr`                                                         | Type mapping     |
| 5   | Plain `string` prop → `string` (no wrapper)                                        | Type mapping     |
| 6   | Named type alias prop → `StringAttr<TypeName>`                                     | Type mapping     |
| 7   | Inline union prop → `StringAttr<'a' \| 'b'>`                                       | Type mapping     |
| 8   | Array prop → pass-through (`TableColumn[]`)                                        | Type mapping     |
| 9   | Nullable object prop → pass-through (`TableSortState \| null`)                     | Type mapping     |
| 10  | Component with no properties → empty interface with eslint-disable comment         | Edge case        |
| 11  | Import generation → only imports referenced types                                  | Import filtering |
| 12  | Import generation → sorts alphabetically                                           | Import ordering  |
| 13  | Multiple components → sorted alphabetically in BlueprintElements                   | Ordering         |
| 14  | Tag name → interface name conversion (`bp-tab-panel` → `BpTabPanelProps`)          | Naming           |
| 15  | Output includes all three namespace augmentations                                  | Namespaces       |

---

## Agent C: Orchestrator + CLI integration

**Owns:** `source/cli/lib/component/generateJsx.ts`, `source/cli/lib/component/__tests__/generateJsx.test.ts`, modifications to `source/cli/commands/generate.ts`, modifications to `package.json`

**Depends on:** Agents A and B must be complete before Agent C begins.

### Responsibilities

#### 1. Create `generateJsx.ts` (thin orchestrator)

```typescript
import { discoverComponents, parseComponentFile } from './jsxParser.js';
import { emitJsxDeclarations } from './jsxEmitter.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface GenerateJsxOptions {
  rootDir?: string; // defaults to process.cwd()
  check?: boolean; // compare-only mode
}

export interface GenerateJsxResult {
  success: boolean;
  outputPath: string;
  componentCount: number;
  changed: boolean; // true if file content differs from what's on disk
  errors: string[];
}

export function generateJsxDeclarations(
  options?: GenerateJsxOptions
): GenerateJsxResult;
```

**Logic:**

1. Call `discoverComponents(rootDir)` to get component names.
2. For each name, call `parseComponentFile(rootDir, name)` and flatten results.
3. Call `emitJsxDeclarations(allComponents)` to get the file content string.
4. If `--check`: read existing `source/jsx.d.ts`, compare, return `{ changed: content !== existing }`.
5. If not `--check`: write to `source/jsx.d.ts`, return success.

#### 2. Modify `generate.ts` — add `jsx` subcommand

Add after the existing `stories` subcommand:

```typescript
generate
  .command('jsx')
  .description('Auto-generate JSX type declarations from component properties')
  .option('--check', 'Verify jsx.d.ts is up to date without modifying it')
  .action((options: { check?: boolean }) => {
    const result = generateJsxDeclarations({ check: options.check });
    // ... logging, exit codes
  });
```

#### 3. Modify `package.json` — add npm script

Add to `"scripts"`:

```json
"generate:jsx": "npm run build:cli && node dist/cli/index.js generate jsx"
```

#### 4. Tests (`generateJsx.test.ts`)

| #   | Test                                                                | Validates      |
| --- | ------------------------------------------------------------------- | -------------- |
| 1   | `generateJsxDeclarations()` returns success with componentCount > 0 | End-to-end     |
| 2   | Output contains `AUTO-GENERATED` header                             | Header present |
| 3   | Output contains `BlueprintElements` interface                       | Structure      |
| 4   | Output contains all three namespace augmentations                   | Namespaces     |
| 5   | `--check` mode returns `changed: false` after a fresh generate      | Check mode     |
| 6   | Output is valid TypeScript (no syntax errors)                       | Validity       |

---

## Execution order

```
 Phase 1 (parallel)          Phase 2 (sequential)         Phase 3
┌─────────────────┐
│   Agent A       │
│   jsxParser.ts  │──┐
│   + tests       │  │
└─────────────────┘  │     ┌──────────────────┐     ┌──────────────────┐
                     ├────▶│   Agent C         │────▶│   Verify         │
┌─────────────────┐  │     │   generateJsx.ts  │     │   Run generator  │
│   Agent B       │──┘     │   generate.ts mod │     │   Diff output    │
│   jsxEmitter.ts │        │   package.json    │     │   Run all tests  │
│   + tests       │        │   + tests         │     │   Lint + format  │
└─────────────────┘        └──────────────────┘     └──────────────────┘
```

**Phase 1** — Agents A and B work concurrently. They own separate files and have no write conflicts.

**Phase 2** — Agent C wires everything together. It depends on A and B being done. It's the only agent that touches `generate.ts` and `package.json`.

**Phase 3** — Verification (can be the same agent as C, or a reviewer):

1. Build CLI: `npm run build:cli`
2. Run generator: `node dist/cli/index.js generate jsx`
3. Diff the generated `jsx.d.ts` against the current hand-written version to inspect changes.
4. Run all tests: `npx vitest run source/cli`
5. Run lint + format: `npm run lint && npm run format:check`

---

## Acceptance criteria

- [ ] `npm run build:cli` succeeds with no TypeScript errors
- [ ] `npx vitest run source/cli` — all tests pass (parser, emitter, orchestrator)
- [ ] `node dist/cli/index.js generate jsx` writes `source/jsx.d.ts` without errors
- [ ] Generated `jsx.d.ts` includes every `@customElement` in `source/components/`
- [ ] Generated `jsx.d.ts` includes every public, non-`attribute:false` property on every component
- [ ] No ghost props (every prop in the generated file exists as a `@property()` on the component)
- [ ] `node dist/cli/index.js generate jsx --check` exits 0 immediately after generation
- [ ] Generated file passes `npm run lint` and `npm run format:check`
- [ ] The docs site builds successfully with the generated `jsx.d.ts`: `cd docs && npm run build`

---

## Risk notes

- **Regex fragility.** The existing `extractAPI.ts` uses regex parsing and works reliably. The new parser follows the same approach. If a component uses an unusual property declaration pattern not covered by the regex, the smoke test (parse all components) will catch it.
- **Import path for `IconName`.** This type lives in `./components/icon/icons/registry.generated.js`, not the component file itself. The emitter needs a special case for this. The parser should detect `IconName` references in the icon component's property types and record the correct source path.
- **Prettier formatting.** The generator should emit reasonably formatted code, but the final step should run Prettier on the output. The `--check` mode must compare against Prettier-formatted content to avoid false positives from whitespace differences.
