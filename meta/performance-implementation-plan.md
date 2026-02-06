# Blueprint Performance Optimization — Agent Implementation Plan

**Date:** February 6, 2026
**Model:** Claude Opus 4.6
**Strategy:** Parallel agent workstreams with minimal cross-dependencies

---

## Architecture Overview

The codebase has **44 Lit components** under `source/components/`, all extending `LitElement` directly. There are no shared utility modules or mixin patterns today. Components follow a consistent 4-file structure: `{name}.ts`, `{name}.style.ts`, `{name}.test.ts`, `{name}.stories.ts`.

This plan is organized into **5 independent workstreams** that can execute as parallel agents, plus a final integration pass. Dependencies between workstreams are noted explicitly.

---

## Workstream 0: Shared Infrastructure (runs first, blocks some later work)

**Agent scope:** Create the shared utilities module that other workstreams depend on.

### Tasks

#### 0.1 Create `source/utilities/` module

Create the following files:

| File | Contents |
|------|----------|
| `source/utilities/index.ts` | Barrel exports |
| `source/utilities/throttle.ts` | `throttle<T>(fn, limitMs)` — returns throttled function |
| `source/utilities/debounce.ts` | `debounce<T>(fn, delayMs)` — returns debounced function with `.cancel()` |
| `source/utilities/memoize.ts` | `memoizeWeak<T>(fn)` — single-arg memoize using WeakMap for object keys |

Implementation notes:
- `throttle` should use `requestAnimationFrame` when `limit <= 16` (frame-aligned) and `Date.now()` otherwise
- `debounce` must return an object with `.cancel()` for cleanup in `disconnectedCallback()`
- All utilities must be typed generically with proper inference
- Keep it minimal — no over-abstraction

#### 0.2 Export from main index

Add `export * from './utilities/index.js';` to `source/index.ts`.

#### 0.3 Write tests

Create `source/utilities/throttle.test.ts`, `debounce.test.ts`, `memoize.test.ts` using vitest with `vi.useFakeTimers()`.

**Verification:** `npm run test:run -- --reporter=verbose source/utilities/`

---

## Workstream 1: CSS-Only Optimizations (fully independent)

**Agent scope:** Style files only. No TypeScript logic changes. Zero risk of breaking behavior.

### Tasks

#### 1.1 Add `content-visibility` to table rows

**File:** `source/components/table/table.style.ts`

Add to the `.row` / `tr` selector:
```css
content-visibility: auto;
contain-intrinsic-size: auto 48px;
```

For the `sm` size variant use `36px`, for `lg` use `56px`.

#### 1.2 Add `content-visibility` to accordion panels

**File:** `source/components/accordion/accordion.style.ts` (or `accordion-item.style.ts`)

Add to the collapsed panel selector (when `aria-hidden="true"` or equivalent):
```css
content-visibility: hidden;
```

#### 1.3 Add `content-visibility` to tree node children

**File:** `source/components/tree/tree.style.ts`

Add to `.node-children`:
```css
content-visibility: auto;
contain-intrinsic-size: auto 200px;
```

#### 1.4 Add CSS containment to dropdown panels

**Files:** Style files for `combobox`, `select`, `multi-select`, `dropdown`

Add to dropdown panel containers:
```css
contain: layout style paint;
```

**Verification:** Visual inspection via Storybook (`npm run dev`). No functional tests needed — these are rendering hints.

---

## Workstream 2: Passive Listeners & Event Optimization (independent)

**Agent scope:** `connectedCallback`/`disconnectedCallback` event registration in components with document-level listeners.

### Tasks

#### 2.1 Audit and fix document-level listeners

For each component below, find `document.addEventListener` / `window.addEventListener` calls and add `{ passive: true }` where the handler does **not** call `preventDefault()`. Where `preventDefault()` is used, leave as non-passive but add `{ capture: true }` if appropriate.

| Component | File | Listeners to audit |
|-----------|------|--------------------|
| dropdown | `source/components/dropdown/dropdown.ts` | click, keydown |
| modal | `source/components/modal/modal.ts` | keydown (focus trap — must stay non-passive) |
| tooltip | `source/components/tooltip/tooltip.ts` | mouseover, mouseout → passive |
| popover | `source/components/popover/popover.ts` | click, mouseover → passive where possible |
| combobox | `source/components/combobox/combobox.ts` | click → passive |
| select | `source/components/select/select.ts` | click → passive |

**Rules:**
- Read the handler to determine if `preventDefault()` or `stopPropagation()` is called
- If yes → leave non-passive (cannot be passive)
- If no → add `{ passive: true }`
- Ensure `disconnectedCallback` uses matching options (browsers require matching options for `removeEventListener`)
- If the third argument was previously omitted, `removeEventListener` must also pass the same options object or a matching boolean

#### 2.2 Throttle slider drag events

**File:** `source/components/slider/slider.ts`
**Depends on:** Workstream 0 (throttle utility)

- Import `throttle` from `../../utilities/throttle.js`
- Wrap `mousemove`/`touchmove` handler in `throttle(fn, 16)` (frame-aligned)
- Store throttled function reference for cleanup
- Cache `getBoundingClientRect()` at drag start (`mousedown`/`touchstart`), invalidate on `mouseup`/`touchend`

#### 2.3 Debounce combobox search input

**File:** `source/components/combobox/combobox.ts`
**Depends on:** Workstream 0 (debounce utility)

- Import `debounce` from `../../utilities/debounce.js`
- Debounce the filtering logic (not the input event itself) by 150ms
- Call `.cancel()` in `disconnectedCallback()`

#### 2.4 Debounce input/textarea value sync

**Files:** `source/components/input/input.ts`, `source/components/textarea/textarea.ts`
**Depends on:** Workstream 0 (debounce utility)

- Only debounce the `bp-input` custom event dispatch, not the native input binding
- Use 150ms delay
- Ensure the final value is always dispatched (trailing edge)

**Verification:** `npm run test:run -- source/components/{dropdown,modal,tooltip,popover,combobox,select,slider,input,textarea}/`

---

## Workstream 3: Render Optimization — Memoization & Lazy Rendering (independent)

**Agent scope:** `willUpdate()`, `shouldUpdate()`, caching, and conditional rendering in component `.ts` files.

### Tasks

#### 3.1 Cache sorted rows in table

**File:** `source/components/table/table.ts`

- Add `@state()` private `_cachedSortedRows` field
- In `willUpdate()`, recompute only when `changedProperties.has('rows')` or `changedProperties.has('sortState')` (find the actual property name by reading the file)
- Replace all calls to `getSortedRows()` (or equivalent) in `render()` with the cached value

#### 3.2 Cache filtered options in combobox

**File:** `source/components/combobox/combobox.ts`

- Same pattern as 3.1 but for the filtered options list
- Invalidate when the search string or the options array changes

#### 3.3 Cache flattened tree

**File:** `source/components/tree/tree.ts`

- Cache the flattened visible node list in `willUpdate()`
- Invalidate on `nodes` property change or expand/collapse state change

#### 3.4 Cache filtered options in multi-select

**File:** `source/components/multi-select/multi-select.ts`

- Same pattern as 3.2

#### 3.5 Add `shouldUpdate()` to table

**File:** `source/components/table/table.ts`

- Identify visual-only properties (those that only affect CSS classes, not structure)
- Skip render when only those properties change
- **Be conservative:** when in doubt, allow the render. A missed optimization is better than a broken component.

#### 3.6 Lazy-render closed dropdowns

**Files:** `source/components/combobox/combobox.ts`, `source/components/select/select.ts`, `source/components/multi-select/multi-select.ts`

- Read each file to check current behavior
- If dropdown content is always rendered (even when closed), wrap it in `${this.isOpen ? html`...` : nothing}`
- Import `nothing` from `lit` if not already imported
- Ensure that opening the dropdown triggers an update so content renders

#### 3.7 Optimize slot change handlers

**Files:** `source/components/combobox/combobox.ts`, `source/components/select/select.ts`, `source/components/multi-select/multi-select.ts`, `source/components/tabs/tabs.ts`, `source/components/stepper/stepper.ts`

- Replace `@slotchange=${() => this.requestUpdate()}` with a targeted handler that only invalidates cached derived state
- Only call `requestUpdate()` if the component is in a state where the slot content is visible

**Verification:** `npm run test:run -- source/components/{table,combobox,tree,multi-select,select,tabs,stepper}/`

---

## Workstream 4: `repeat()` Directive & DOM Recycling (independent)

**Agent scope:** Replace `.map()` with `repeat()` in template rendering for keyed lists.

### Tasks

For each component below:
1. Read the component file
2. Find `.map()` calls in the `render()` method or helper render methods that produce lists of `html` templates
3. Replace with `repeat()` from `lit/directives/repeat.js`
4. Use the most stable unique key available (prefer `id`, then `value`, then `index` as last resort)

| Component | File | What to key on |
|-----------|------|---------------|
| table | `source/components/table/table.ts` | `row.id` for rows, `column.key` for headers |
| tree | `source/components/tree/tree.ts` | `node.id` |
| slider | `source/components/slider/slider.ts` | tick mark value |
| breadcrumb | `source/components/breadcrumb/breadcrumb.ts` | Read file to determine key |
| pagination | `source/components/pagination/pagination.ts` | page number |
| menu | `source/components/menu/menu.ts` | Read file to determine key |
| select | `source/components/select/select.ts` | option value |
| tabs | `source/components/tabs/tabs.ts` | tab identifier |

**Rules:**
- Only add `repeat()` where the import doesn't already exist **and** `.map()` is used for list rendering in templates
- If a component already uses `repeat()` (combobox, multi-select), skip it
- Don't change `.map()` calls that are used for data transformation (not template rendering)

**Verification:** `npm run test:run -- source/components/{table,tree,slider,breadcrumb,pagination,menu,select,tabs}/`

---

## Execution Strategy for Agent Teams

### Phase 1 — Parallel launch (4 agents)

```
Agent A: Workstream 0 (shared utilities)
Agent B: Workstream 1 (CSS-only changes)
Agent C: Workstream 4 (repeat() directive)
Agent D: Workstream 2, tasks 2.1 only (passive listeners — no dependency on utils)
```

Workstreams 1, 4, and 2.1 have **zero dependencies** and can start immediately.
Workstream 0 is the critical path for later work.

### Phase 2 — After Workstream 0 completes (2 agents)

```
Agent D (continued): Workstream 2, tasks 2.2–2.4 (throttle/debounce — needs utils)
Agent E: Workstream 3 (memoization & lazy rendering)
```

These depend on the utilities module from Workstream 0.

### Phase 3 — Integration (1 agent)

```
Agent F: Run full test suite, fix any failures, verify no regressions
```

- `npm run test:run`
- `npm run build`
- Spot-check Storybook for visual regressions

---

## What This Plan Intentionally Excludes

The audit document includes several items that are **deferred** from this implementation round:

| Item | Reason for deferral |
|------|-------------------|
| **Virtual scrolling** (Audit 1.3) | Architectural change requiring new mixin, extensive testing, and API design. Should be its own project. |
| **Icon SVG caching** (Audit 3.5) | Needs investigation into current icon loading mechanism. Low impact per-component. |
| **Prebound event handlers** (Audit 4.1) | Micro-optimization. Lit's event binding is efficient enough. Risk of introducing bugs outweighs benefit. |
| **`guard()` directive** (Audit 4.2) | Overlaps with memoization in Workstream 3. Adding both creates complexity. |
| **Set for selections** (Audit 4.3) | API-breaking change (changes property type). Needs deprecation strategy. |
| **Performance benchmarks** (Audit Phase 4) | Important but orthogonal. Should be a separate effort with proper CI integration. |

These items are deferred, not rejected. They can be planned as follow-up work once the current optimizations are verified.

---

## File Inventory (all paths relative to repo root)

### Files to CREATE
```
source/utilities/index.ts
source/utilities/throttle.ts
source/utilities/debounce.ts
source/utilities/memoize.ts
source/utilities/throttle.test.ts
source/utilities/debounce.test.ts
source/utilities/memoize.test.ts
```

### Files to MODIFY
```
source/index.ts                                    (add utilities export)
source/components/table/table.ts                   (memoize, shouldUpdate, repeat)
source/components/table/table.style.ts             (content-visibility)
source/components/tree/tree.ts                     (memoize, repeat)
source/components/tree/tree.style.ts               (content-visibility)
source/components/combobox/combobox.ts              (memoize, lazy render, slot, debounce)
source/components/multi-select/multi-select.ts      (memoize, lazy render, slot)
source/components/select/select.ts                  (lazy render, slot, passive, repeat)
source/components/slider/slider.ts                  (throttle, repeat)
source/components/dropdown/dropdown.ts              (passive listeners)
source/components/modal/modal.ts                    (passive listeners)
source/components/tooltip/tooltip.ts                (passive listeners)
source/components/popover/popover.ts                (passive listeners)
source/components/input/input.ts                    (debounce)
source/components/textarea/textarea.ts              (debounce)
source/components/accordion/accordion.style.ts      (content-visibility)
source/components/breadcrumb/breadcrumb.ts          (repeat)
source/components/pagination/pagination.ts          (repeat)
source/components/menu/menu.ts                      (repeat)
source/components/tabs/tabs.ts                      (slot, repeat)
source/components/stepper/stepper.ts                (slot)
```

**Total:** 7 new files, 21 modified files across 5 workstreams.

---

## Agent Instructions Template

When spawning each agent, provide:

1. **The workstream section** from this plan (copy the relevant tasks)
2. **The constraint:** "Read every file before modifying it. Do not change code you haven't read. Run the verification command when done."
3. **The style rule:** "Follow existing patterns. Match the code style of the file you're editing. No new dependencies beyond `lit`."
4. **The safety rule:** "If a test fails after your change, fix it. If you're unsure whether a change is safe, skip it and note it in your output."
