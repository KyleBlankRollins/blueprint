# Accordion

A collapsible content component that allows users to show and hide sections of related content. Consists of a container (`bp-accordion`) and individual items (`bp-accordion-item`).

## Features

- **Three variants**: default (connected), bordered (individual borders), separated (with gaps and shadows)
- **Single or multiple expansion**: Control whether one or multiple items can be open at once
- **Keyboard navigation**: Full keyboard support with Enter/Space to toggle
- **Accessible**: ARIA attributes, roles, and proper focus management
- **Programmatic control**: Methods to expand, collapse, expandAll, collapseAll
- **Customizable**: Slots for custom headers, icons, and content
- **CSS Parts**: Style internal elements from outside the shadow DOM
- **Smooth animations**: CSS-based expand/collapse transitions

## Usage

### Basic Usage

```html
<bp-accordion>
  <bp-accordion-item item-id="item-1" header="Section 1">
    Content for the first section.
  </bp-accordion-item>
  <bp-accordion-item item-id="item-2" header="Section 2">
    Content for the second section.
  </bp-accordion-item>
  <bp-accordion-item item-id="item-3" header="Section 3">
    Content for the third section.
  </bp-accordion-item>
</bp-accordion>
```

### Multiple Expansion Mode

```html
<bp-accordion multiple>
  <bp-accordion-item item-id="item-1" header="Section 1">
    Multiple items can be expanded simultaneously.
  </bp-accordion-item>
  <bp-accordion-item item-id="item-2" header="Section 2">
    This can be open at the same time as Section 1.
  </bp-accordion-item>
</bp-accordion>
```

### With Variants

```html
<!-- Bordered variant - each item has its own border -->
<bp-accordion variant="bordered">
  <bp-accordion-item item-id="item-1" header="Item 1"
    >Content 1</bp-accordion-item
  >
  <bp-accordion-item item-id="item-2" header="Item 2"
    >Content 2</bp-accordion-item
  >
</bp-accordion>

<!-- Separated variant - items with gaps and shadows -->
<bp-accordion variant="separated">
  <bp-accordion-item item-id="item-1" header="Item 1"
    >Content 1</bp-accordion-item
  >
  <bp-accordion-item item-id="item-2" header="Item 2"
    >Content 2</bp-accordion-item
  >
</bp-accordion>
```

### Programmatic Control

```javascript
const accordion = document.querySelector('bp-accordion');

// Expand a specific item
accordion.expand('item-1');

// Collapse a specific item
accordion.collapse('item-1');

// Expand all items (requires multiple mode)
accordion.expandAll();

// Collapse all items
accordion.collapseAll();
```

### With Custom Header Content

```html
<bp-accordion>
  <bp-accordion-item item-id="item-1">
    <span slot="header">
      <span class="status-dot"></span>
      Custom Header with Icon
    </span>
    Content goes here.
  </bp-accordion-item>
</bp-accordion>
```

## API

### bp-accordion Properties

| Property        | Type                                     | Default     | Description                                    |
| --------------- | ---------------------------------------- | ----------- | ---------------------------------------------- |
| `variant`       | `'default' \| 'bordered' \| 'separated'` | `'default'` | Visual style variant                           |
| `multiple`      | `boolean`                                | `false`     | Whether multiple items can be expanded at once |
| `expandedItems` | `string[]`                               | `[]`        | Array of expanded item IDs                     |
| `disabled`      | `boolean`                                | `false`     | Whether all items are disabled                 |

### bp-accordion Methods

| Method          | Parameters   | Returns | Description                                    |
| --------------- | ------------ | ------- | ---------------------------------------------- |
| `expand(id)`    | `id: string` | `void`  | Expand an item by ID                           |
| `collapse(id)`  | `id: string` | `void`  | Collapse an item by ID                         |
| `expandAll()`   | None         | `void`  | Expand all items (only works in multiple mode) |
| `collapseAll()` | None         | `void`  | Collapse all items                             |

### bp-accordion Events

| Event         | Detail   | Description                     |
| ------------- | -------- | ------------------------------- |
| `bp-expand`   | `{ id }` | Fired when an item is expanded  |
| `bp-collapse` | `{ id }` | Fired when an item is collapsed |

### bp-accordion-item Properties

| Property   | Type      | Default | Description                                   |
| ---------- | --------- | ------- | --------------------------------------------- |
| `item-id`  | `string`  | `''`    | Unique identifier (auto-generated if not set) |
| `header`   | `string`  | `''`    | Header text displayed in the trigger          |
| `expanded` | `boolean` | `false` | Whether the content is expanded               |
| `disabled` | `boolean` | `false` | Whether this item is disabled                 |

### Slots

#### bp-accordion

| Slot      | Description                |
| --------- | -------------------------- |
| (default) | bp-accordion-item elements |

#### bp-accordion-item

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| (default) | Collapsible content                           |
| `header`  | Custom header content (overrides header prop) |
| `icon`    | Custom icon for the header                    |

### CSS Parts

#### bp-accordion

| Part        | Description                  |
| ----------- | ---------------------------- |
| `accordion` | The main accordion container |

#### bp-accordion-item

| Part      | Description                     |
| --------- | ------------------------------- |
| `item`    | The accordion item container    |
| `header`  | The header/trigger button       |
| `icon`    | The expand/collapse icon        |
| `content` | The collapsible content wrapper |
| `body`    | The inner content container     |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Header hover background, separated variant background
- `--bp-color-text` - Primary text color
- `--bp-color-text-muted` - Chevron icon color
- `--bp-color-border` - Item borders
- `--bp-color-focus` - Focus ring color
- `--bp-font-family` - Typography
- `--bp-border-radius` - Border roundness
- `--bp-shadow-sm` - Separated variant shadow

### Universal Tokens (Infrastructure)

- `--bp-spacing-sm`, `--bp-spacing-md`, `--bp-spacing-lg` - Padding and gaps
- `--bp-font-size-base` - Text size
- `--bp-font-weight-medium` - Header font weight
- `--bp-line-height-normal`, `--bp-line-height-relaxed` - Line spacing
- `--bp-transition-fast`, `--bp-transition-base` - Animation timing
- `--bp-border-width` - Border thickness
- `--bp-opacity-disabled` - Disabled state opacity
- `--bp-focus-width`, `--bp-focus-style`, `--bp-focus-offset` - Focus ring

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- Uses `role="region"` on content panels for semantic structure
- Uses `role="presentation"` on accordion container
- Header buttons have `aria-expanded` to indicate current state
- Header buttons have `aria-controls` linking to content panel IDs
- Content panels have `aria-labelledby` linking to header IDs
- Chevron icon has `aria-hidden="true"` to hide from screen readers
- Full keyboard support: Tab to navigate, Enter/Space to toggle
- Focus indicator visible for keyboard navigation
- Disabled items have `aria-disabled="true"` and prevent interaction
