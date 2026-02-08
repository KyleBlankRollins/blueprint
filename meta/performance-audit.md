# Blueprint Component Performance Audit

**Date:** February 6, 2026
**Target:** Modern browsers only (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)
**Scope:** All 43 Lit components in `source/components/`

---

## Executive Summary

This audit identifies concrete performance optimization opportunities in Blueprint's Lit component library. The components have a solid foundation but lack several key optimizations that would significantly improve runtime performance, especially for data-heavy components like `table`, `tree`, and `combobox`.

**Key findings:**
- No use of `shouldUpdate()` lifecycle hook to skip unnecessary renders
- Sorting/filtering recomputed on every render cycle
- No debouncing/throttling on high-frequency events
- No virtual scrolling for large datasets
- Slot change handlers trigger full re-renders
- Document-level event listeners added without passive options

---

## Priority 1: Critical Performance Issues

### 1.1 Implement `shouldUpdate()` for Complex Components

**Affected:** `table`, `tree`, `combobox`, `multi-select`, `select`

**Problem:** Components always re-render when any property changes, even if the change doesn't affect the visible output.

**Current behavior:**
```typescript
// table.ts - Always re-renders on ANY property change
@property({ type: Array }) declare rows: TableRow[];
@property({ type: Array }) declare columns: TableColumn[];
@property({ type: String }) declare variant: TableVariant;
// No shouldUpdate - variant change triggers full table re-render
```

**Task:** Add `shouldUpdate()` to skip renders when only irrelevant properties change:

```typescript
protected shouldUpdate(changedProperties: Map<string, unknown>): boolean {
  // Skip render if only hover/focus state changed and we're not dragging
  const visualOnlyProps = new Set(['hoverable', 'stickyHeader']);

  // If all changes are visual-only and no structural changes, skip render
  if ([...changedProperties.keys()].every(k => visualOnlyProps.has(k))) {
    return false;
  }
  return true;
}
```

**Components to implement:**
- `bp-table`: Skip re-render when only `hoverable` or `stickyHeader` changes
- `bp-tree`: Skip re-render when only `showLines` changes
- `bp-combobox`: Skip re-render when dropdown is closed and value hasn't changed
- `bp-slider`: Skip re-render when only label changes (not value)

---

### 1.2 Cache Sorted/Filtered Data

**Affected:** `table.ts:178-203`, `combobox.ts:123-133`, `tree.ts:215-224`

**Problem:** Sorting and filtering is recomputed on every render, even when input data hasn't changed.

**Current behavior (table.ts:178-203):**
```typescript
private getSortedRows(): TableRow[] {
  // Called on EVERY render, even if rows/sortState unchanged
  if (!this.sortState || this.sortState.direction === 'none') {
    return this.rows;
  }
  return [...this.rows].sort((a, b) => { /* expensive sort */ });
}
```

**Task:** Implement memoization using `willUpdate()` and cached state:

```typescript
@state() private _cachedSortedRows: TableRow[] = [];
@state() private _lastRowsRef: TableRow[] | null = null;
@state() private _lastSortState: TableSortState | null = null;

protected willUpdate(changedProperties: Map<string, unknown>): void {
  // Only recompute if rows or sortState actually changed
  if (changedProperties.has('rows') || changedProperties.has('sortState') ||
      this._lastRowsRef !== this.rows) {
    this._cachedSortedRows = this.computeSortedRows();
    this._lastRowsRef = this.rows;
    this._lastSortState = this.sortState;
  }
}

private get sortedRows(): TableRow[] {
  return this._cachedSortedRows;
}
```

**Components to implement:**
- `bp-table`: Cache sorted rows
- `bp-combobox`: Cache filtered options
- `bp-tree`: Cache flattened tree for rendering
- `bp-multi-select`: Cache filtered options

---

### 1.3 Virtual Scrolling for Large Datasets

**Affected:** `table`, `tree`, `combobox`, `multi-select`, `select`

**Problem:** All items render to DOM regardless of visibility. A table with 1000 rows creates 1000+ DOM nodes.

**Current behavior (table.ts:502-556):**
```typescript
// Renders ALL rows, even if only 10 visible in viewport
${sortedRows.map((row) => {
  return html`<tr>...</tr>`;
})}
```

**Task:** Implement virtual scrolling for lists exceeding a threshold (e.g., 50 items):

```typescript
// Properties for virtual scrolling
@state() private scrollTop = 0;
@state() private containerHeight = 0;
private readonly ITEM_HEIGHT = 48; // Estimated row height
private readonly OVERSCAN = 5; // Extra items to render above/below

private get virtualizedRows() {
  const startIndex = Math.max(0,
    Math.floor(this.scrollTop / this.ITEM_HEIGHT) - this.OVERSCAN);
  const visibleCount = Math.ceil(this.containerHeight / this.ITEM_HEIGHT);
  const endIndex = Math.min(
    this.rows.length,
    startIndex + visibleCount + this.OVERSCAN * 2
  );

  return {
    items: this.sortedRows.slice(startIndex, endIndex),
    startIndex,
    totalHeight: this.rows.length * this.ITEM_HEIGHT,
    offsetY: startIndex * this.ITEM_HEIGHT
  };
}
```

**Implementation approach:**
1. Create a `VirtualScrollMixin` or base class
2. Apply to `table`, `tree`, `combobox` dropdowns
3. Use CSS `transform: translateY()` for smooth scrolling
4. Implement dynamic row height measurement for variable-height content

---

## Priority 2: High-Impact Optimizations

### 2.1 Debounce/Throttle High-Frequency Events

**Affected:** `slider.ts:185-203`, `input.ts:102-113`, `combobox.ts:147-169`

**Problem:** Events fire on every interaction frame without throttling, causing excessive re-renders and event dispatches.

**Current behavior (slider.ts:185-187):**
```typescript
const handleMouseMove = (moveEvent: MouseEvent) => {
  // Fires 60+ times per second during drag
  this.updateValueFromPosition(moveEvent.clientX);
};
```

**Task:** Implement throttling for continuous events:

```typescript
// Utility function (add to shared utils)
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

// In slider.ts
private throttledUpdatePosition = throttle(
  (clientX: number) => this.updateValueFromPosition(clientX),
  16 // ~60fps
);
```

**Components to implement:**
- `bp-slider`: Throttle mousemove/touchmove during drag (16ms)
- `bp-input`: Debounce input event for value sync (150ms)
- `bp-combobox`: Debounce search input (200ms)
- `bp-textarea`: Debounce input event (150ms)

---

### 2.2 Optimize Slot Change Handling

**Affected:** `combobox.ts:371`, `select.ts`, `multi-select.ts`, `tabs.ts`, `stepper.ts`

**Problem:** `@slotchange=${() => this.requestUpdate()}` triggers full re-render on any slot change.

**Current behavior (combobox.ts:371):**
```typescript
<slot @slotchange=${() => this.requestUpdate()}></slot>
// Full component re-render just because slot content changed
```

**Task:** Only update derived state, not trigger full re-render:

```typescript
private handleSlotChange() {
  // Only update the options cache, don't trigger full render
  this._cachedOptions = null; // Invalidate cache

  // Only request update if dropdown is open and visible
  if (this.isOpen) {
    this.requestUpdate('_cachedOptions');
  }
}
```

**Alternative: Use `@queryAssignedElements` with `willUpdate()`:**
```typescript
@queryAssignedElements({ flatten: true })
private slotElements!: HTMLElement[];

protected willUpdate(changedProperties: Map<string, unknown>): void {
  // Recompute options only when slot elements actually change
  if (this._previousSlotElements !== this.slotElements) {
    this._cachedOptions = this.computeOptions();
    this._previousSlotElements = this.slotElements;
  }
}
```

---

### 2.3 Use Passive Event Listeners

**Affected:** All components with document-level listeners (`dropdown`, `modal`, `tooltip`, `popover`, `combobox`, `select`)

**Problem:** Document-level event listeners block scrolling when not marked as passive.

**Current behavior (dropdown.ts:80-81):**
```typescript
connectedCallback() {
  document.addEventListener('click', this.clickOutsideHandler);
  document.addEventListener('keydown', this.keydownHandler);
  // Not passive - blocks browser optimizations
}
```

**Task:** Add passive option where appropriate:

```typescript
connectedCallback() {
  super.connectedCallback();
  // Click handlers that don't preventDefault can be passive
  document.addEventListener('click', this.clickOutsideHandler, { passive: true });
  // Keydown needs to call preventDefault, so capture in separate handler
  document.addEventListener('keydown', this.keydownHandler, { capture: true });
}
```

**Components to update:**
- `bp-dropdown`: click, keydown
- `bp-modal`: keydown (focus trap needs non-passive)
- `bp-tooltip`: mouseover, mouseout (can be passive)
- `bp-popover`: click, mouseover (can be passive)
- `bp-combobox`: click (can be passive)
- `bp-select`: click (can be passive)

---

### 2.4 Avoid Forced Synchronous Layout

**Affected:** `slider.ts:152-159`, `dropdown.ts:144-148`

**Problem:** Reading layout properties (offsetWidth, getBoundingClientRect) immediately after writing causes layout thrashing.

**Current behavior (slider.ts:152-159):**
```typescript
private updateValueFromPosition(clientX: number): void {
  // Forces layout calculation on every mouse move
  const rect = this.trackElement.getBoundingClientRect();
  // ...
}
```

**Task:** Cache layout measurements and use ResizeObserver:

```typescript
private trackRect: DOMRect | null = null;
private resizeObserver: ResizeObserver | null = null;

connectedCallback() {
  super.connectedCallback();
  this.resizeObserver = new ResizeObserver(() => {
    this.trackRect = null; // Invalidate on resize
  });
  this.updateComplete.then(() => {
    if (this.trackElement) {
      this.resizeObserver!.observe(this.trackElement);
    }
  });
}

private getTrackRect(): DOMRect {
  if (!this.trackRect) {
    this.trackRect = this.trackElement.getBoundingClientRect();
  }
  return this.trackRect;
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.resizeObserver?.disconnect();
}
```

---

## Priority 3: Moderate Optimizations

### 3.1 Use `repeat()` Directive Consistently

**Affected:** `table.ts:504`, `tree.ts:408`, `slider.ts:333`

**Problem:** Some components use `.map()` instead of `repeat()` directive, preventing Lit's DOM recycling.

**Current behavior (table.ts:504):**
```typescript
${sortedRows.map((row) => { /* ... */ })}
// No keying - Lit can't efficiently reorder/recycle DOM
```

**Task:** Replace with `repeat()` directive for all list rendering:

```typescript
import { repeat } from 'lit/directives/repeat.js';

${repeat(
  sortedRows,
  (row) => row.id,  // Unique key
  (row) => html`<tr>...</tr>`
)}
```

**Components to update:**
- `bp-table`: Use repeat for rows (already has `id` key)
- `bp-tree`: Use repeat for nodes
- `bp-slider`: Use repeat for tick marks
- `bp-breadcrumb`: Use repeat for items
- `bp-pagination`: Use repeat for page numbers
- `bp-menu`: Use repeat for menu items

---

### 3.2 Lazy Render Closed Dropdowns

**Affected:** `combobox`, `select`, `multi-select`, `dropdown`

**Problem:** Some dropdown panels render content even when closed.

**Current behavior - already good in dropdown.ts:**
```typescript
// Dropdown correctly renders nothing when closed
${this.open ? html`<div class="dropdown__panel">...</div>` : nothing}
```

**But combobox.ts:335-368 renders the dropdown always:**
```typescript
// Dropdown is always in DOM, just hidden with CSS
<div class="combobox__dropdown" id="listbox" part="dropdown">
  <ul class="combobox__options" role="listbox">
    ${filteredOptions.length === 0 ? /* ... */ : repeat(/* ... */)}
  </ul>
</div>
```

**Task:** Apply consistent lazy rendering pattern:

```typescript
// Only render dropdown contents when open
${this.isOpen ? html`
  <div class="combobox__dropdown" id="listbox" part="dropdown">
    <ul class="combobox__options" role="listbox">
      ${this.renderOptions()}
    </ul>
  </div>
` : nothing}
```

**Components to update:**
- `bp-combobox`: Lazy render dropdown
- `bp-select`: Verify lazy rendering
- `bp-multi-select`: Verify lazy rendering

---

### 3.3 Optimize Tree Node Rendering

**Affected:** `tree.ts:359-416`

**Problem:** Tree recursively re-renders all nodes on any state change.

**Current behavior (tree.ts:359-416):**
```typescript
private renderNode(node: TreeNode, level: number = 0): unknown {
  // Called for EVERY node, even collapsed ones
  return html`
    <div class="node">
      ${hasChildren && isExpanded ? html`
        <div class="node-children">
          ${node.children!.map((child) => this.renderNode(child, level + 1))}
        </div>
      ` : nothing}
    </div>
  `;
}
```

**Task:** Implement incremental rendering and memoization:

```typescript
// Cache rendered nodes by ID
private _renderedNodes = new Map<string, TemplateResult>();

private renderNode(node: TreeNode, level: number = 0): TemplateResult {
  const cacheKey = `${node.id}-${this.isSelected(node.id)}-${this.expandedIds.includes(node.id)}`;

  if (!this._renderedNodes.has(cacheKey)) {
    this._renderedNodes.set(cacheKey, this.createNodeTemplate(node, level));
  }

  return this._renderedNodes.get(cacheKey)!;
}

protected willUpdate(changedProperties: Map<string, unknown>): void {
  // Invalidate cache when structure changes
  if (changedProperties.has('nodes')) {
    this._renderedNodes.clear();
  }
}
```

---

### 3.4 Use CSS `content-visibility` for Off-Screen Content

**Affected:** `table`, `accordion`, `tree`

**Problem:** Browser calculates styles for all elements even when off-screen.

**Task:** Add CSS containment for large lists:

```css
/* table.style.ts */
.row {
  content-visibility: auto;
  contain-intrinsic-size: 0 48px; /* Estimated row height */
}

/* accordion-item.style.ts */
.panel[aria-hidden="true"] {
  content-visibility: hidden;
}

/* tree.style.ts */
.node-children {
  content-visibility: auto;
  contain-intrinsic-size: 0 200px; /* Estimated collapsed height */
}
```

**Browser support:** All modern browsers (Chrome 85+, Edge 85+, Firefox 109+, Safari 17.4+)

---

### 3.5 Optimize Icon Component

**Affected:** `icon.ts` (used throughout all components)

**Problem:** Each icon instance may re-fetch or re-render SVG content.

**Task:** Implement icon caching and use `<use>` references:

```typescript
// Cache loaded icons at module level
const iconCache = new Map<string, string>();

// Use symbol references for repeated icons
private getIconContent(): TemplateResult {
  const iconId = `bp-icon-${this.name}`;

  // First instance defines the symbol
  if (!document.getElementById(iconId)) {
    return html`
      <svg>
        <defs>
          <symbol id="${iconId}">${unsafeSVG(this.svgContent)}</symbol>
        </defs>
        <use href="#${iconId}"></use>
      </svg>
    `;
  }

  // Subsequent instances reference the symbol
  return html`<svg><use href="#${iconId}"></use></svg>`;
}
```

---

## Priority 4: Minor Optimizations

### 4.1 Prebound Event Handlers

**Affected:** Most components use inline arrow functions

**Problem:** Inline arrow functions create new function instances on each render.

**Current behavior (table.ts:424-430):**
```typescript
@click=${(e: Event) => this.handleHeaderClick(column, e)}
@keydown=${(e: KeyboardEvent) => {
  if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    this.handleHeaderClick(column, e);
  }
}}
```

**Task:** Use pre-bound methods or class field arrow functions:

```typescript
// Option 1: Pre-bind in constructor (for methods needing arguments)
private handleHeaderClickBound = (column: TableColumn) => (e: Event) =>
  this.handleHeaderClick(column, e);

// Option 2: Use data attributes for simpler cases
<th data-column-key=${column.key} @click=${this.handleHeaderClickFromEvent}>

private handleHeaderClickFromEvent(e: Event) {
  const key = (e.currentTarget as HTMLElement).dataset.columnKey!;
  const column = this.columns.find(c => c.key === key)!;
  this.handleHeaderClick(column, e);
}
```

---

### 4.2 Use `guard()` Directive for Expensive Templates

**Affected:** Complex template sections in `table`, `tree`, `modal`

**Task:** Wrap expensive template sections with `guard()`:

```typescript
import { guard } from 'lit/directives/guard.js';

render() {
  return html`
    ${guard([this.columns], () => this.renderHeader())}
    ${guard([this.sortedRows, this.selectedRows], () => this.renderBody())}
  `;
}
```

---

### 4.3 Avoid Spread Operators in Hot Paths

**Affected:** `table.ts:280`, `tree.ts:98,120,178`

**Problem:** Array spread creates new arrays on every operation.

**Current behavior (table.ts:280):**
```typescript
newSelection = [...this.selectedRows, rowId];
```

**Task:** Consider using Set for frequent add/remove operations:

```typescript
// Use Set internally for O(1) lookups
@state() private _selectedRowsSet = new Set<string | number>();

// Sync with array property
updated(changedProperties: Map<string, unknown>) {
  if (changedProperties.has('selectedRows')) {
    this._selectedRowsSet = new Set(this.selectedRows);
  }
}

private toggleRowSelection(row: TableRow) {
  const rowId = row.id;
  if (this._selectedRowsSet.has(rowId)) {
    this._selectedRowsSet.delete(rowId);
  } else {
    this._selectedRowsSet.add(rowId);
  }
  this.selectedRows = [...this._selectedRowsSet];
}
```

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 days)
1. Add passive event listeners to all document-level handlers
2. Implement consistent lazy rendering for closed dropdowns
3. Replace `.map()` with `repeat()` directive where missing
4. Add CSS `content-visibility` to tables and accordions

### Phase 2: Core Optimizations (3-5 days)
1. Implement memoization for sorted/filtered data (table, combobox)
2. Add debouncing to input and slider components
3. Optimize slot change handlers
4. Cache layout measurements with ResizeObserver

### Phase 3: Advanced Features (1-2 weeks)
1. Create `VirtualScrollMixin` for large lists
2. Apply virtual scrolling to table, tree, and dropdown lists
3. Implement icon caching with SVG symbols
4. Add `shouldUpdate()` to complex components

### Phase 4: Polish (ongoing)
1. Add performance benchmarks to test suite
2. Document performance patterns for future components
3. Create shared utility functions (throttle, debounce, memoize)

---

## Benchmarking Recommendations

### Key Metrics to Track
1. **First Contentful Paint (FCP)** - Initial render time
2. **Time to Interactive (TTI)** - When component responds to input
3. **Re-render Duration** - Time for property change to reflect in DOM
4. **Memory Usage** - Heap size with large datasets

### Testing Scenarios
1. Table with 1000 rows, sorting enabled
2. Tree with 500 nodes, 5 levels deep
3. Combobox with 200 options, filtering
4. 50 modals opened/closed rapidly
5. Slider dragged continuously for 5 seconds

### Tools
- Chrome DevTools Performance tab
- Lighthouse performance audit
- `window.performance.measure()` for micro-benchmarks
- Memory profiler for leak detection

---

## Appendix: Modern Browser APIs to Leverage

Since we target modern browsers only, these APIs are available:

| API | Use Case | Browser Support |
|-----|----------|-----------------|
| `ResizeObserver` | Layout measurement caching | All modern |
| `IntersectionObserver` | Virtual scrolling, lazy loading | All modern |
| `content-visibility` | Skip off-screen rendering | Chrome 85+, FF 109+, Safari 17.4+ |
| `CSS.registerProperty()` | Animatable custom properties | All modern |
| `requestIdleCallback()` | Non-urgent work scheduling | Chrome, Edge, Firefox |
| `Scheduler.postTask()` | Priority-based task scheduling | Chrome 94+ |
| `CSS Layers` | Style isolation | All modern |
| `View Transitions` | Smooth state transitions | Chrome 111+, Safari 18+ |

---

*This audit focuses on runtime performance optimizations. For bundle size and load performance, see build configuration and tree-shaking documentation.*

---

## Addendum: Implementation Notes (February 2026)

All optimizations from this audit have been implemented. Three required test updates because they changed observable component behavior. Each is documented below with design rationale.

### A.1 Lazy Rendering of Closed Dropdowns (Audit 3.2)

**Components:** `bp-combobox`, `bp-multi-select`

Dropdown content is only rendered to the DOM when the component is open (`${this.isOpen ? this.renderDropdown() : nothing}`). When closed, the dropdown subtree does not exist in the shadow DOM at all.

**Design implication:** Code that queries dropdown internals (e.g., `shadowRoot.querySelector('[role="listbox"]')`) must first open the component. Tests were updated to click the trigger before asserting on dropdown structure.

**Combined with CSS containment:** When open, the dropdown panel also has `contain: layout style paint` applied via the style file, so the browser isolates its rendering from the rest of the page.

---

### A.2 Debounced Custom Event Dispatch on `bp-input` / `bp-textarea` (Audit 2.1)

**Behavior:** The `bp-input` custom event is dispatched on a 150ms trailing-edge debounce. The native input value binding (`this.value`) still updates synchronously on every keystroke. On blur, the debounce is flushed so the final value is always emitted before `bp-blur`.

**Design rationale:** High-frequency `bp-input` events during rapid typing cause unnecessary downstream work (validation, API calls, re-renders in parent components). Debouncing at the component level provides the ideal default. Consumers that genuinely need per-keystroke events can listen to the native `input` event on the inner element instead.

**Test pattern:** Tests that assert on `bp-input` dispatch use `vi.useFakeTimers()` and advance by 150ms:
```typescript
vi.useFakeTimers();
input.dispatchEvent(new InputEvent('input', { bubbles: true }));
vi.advanceTimersByTime(150);
expect(listener).toHaveBeenCalled();
vi.useRealTimers();
```

---

### A.3 Debounced Filter Computation in `bp-combobox` (Audit 2.1)

**Behavior:** The combobox's filter computation is debounced by 150ms during search input. The `searchText` property and the open state update immediately (so the input feels responsive), but the filtered options list updates after a 150ms pause in typing. Direct actions (selecting an option, clearing, closing) cancel the debounce and refresh the filter synchronously.

**Combined with memoization:** The underlying filter function uses `memoizeOne`, so even when the debounce fires, it only recomputes if `(options, searchText)` actually changed. The two techniques are complementary: debounce reduces how often the filter is called, memoization ensures each call is a no-op when inputs haven't changed.

**Test pattern:** Filter tests use fake timers and advance past the debounce:
```typescript
vi.useFakeTimers();
input.value = 'ap';
input.dispatchEvent(new Event('input', { bubbles: true }));
vi.advanceTimersByTime(150);
await element.updateComplete;
expect(options?.length).toBe(2);
vi.useRealTimers();
```
