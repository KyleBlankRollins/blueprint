---
title: Accordion
description: Collapsible content sections
---

The `bp-accordion` component organizes content into collapsible sections. Users can expand and collapse sections to show or hide content, reducing visual clutter.

## Import

```javascript
import 'blueprint/components/accordion';
```

## Examples

### Default

<div class="component-preview">
  <bp-accordion>
    <bp-accordion-item item-id="item1">
      <span slot="header">Section 1</span>
      <p>Content for the first section. This is the expanded panel content.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="item2">
      <span slot="header">Section 2</span>
      <p>Content for the second section.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="item3">
      <span slot="header">Section 3</span>
      <p>Content for the third section.</p>
    </bp-accordion-item>
  </bp-accordion>
</div>

```html
<bp-accordion>
  <bp-accordion-item item-id="item1">
    <span slot="header">Section 1</span>
    <p>Content for the first section.</p>
  </bp-accordion-item>
  <bp-accordion-item item-id="item2">
    <span slot="header">Section 2</span>
    <p>Content for the second section.</p>
  </bp-accordion-item>
</bp-accordion>
```

### Multiple Expansion

Allow multiple sections to be open simultaneously:

<div class="component-preview">
  <bp-accordion multiple>
    <bp-accordion-item item-id="multi1">
      <span slot="header">First Section</span>
      <p>This section can be open at the same time as others.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="multi2">
      <span slot="header">Second Section</span>
      <p>Multiple sections can be expanded.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="multi3">
      <span slot="header">Third Section</span>
      <p>Try opening all three!</p>
    </bp-accordion-item>
  </bp-accordion>
</div>

```html
<bp-accordion multiple>
  <bp-accordion-item item-id="multi1">...</bp-accordion-item>
  <bp-accordion-item item-id="multi2">...</bp-accordion-item>
</bp-accordion>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-accordion variant="default">
      <bp-accordion-item item-id="def1">
        <span slot="header">Default Variant</span>
        <p>Standard accordion styling.</p>
      </bp-accordion-item>
    </bp-accordion>
    
    <bp-accordion variant="bordered">
      <bp-accordion-item item-id="bord1">
        <span slot="header">Bordered Variant</span>
        <p>With visible borders.</p>
      </bp-accordion-item>
    </bp-accordion>
    
    <bp-accordion variant="separated">
      <bp-accordion-item item-id="sep1">
        <span slot="header">Separated Variant</span>
        <p>Items are visually separated.</p>
      </bp-accordion-item>
      <bp-accordion-item item-id="sep2">
        <span slot="header">Another Item</span>
        <p>With gaps between items.</p>
      </bp-accordion-item>
    </bp-accordion>
  </div>
</div>

```html
<bp-accordion variant="default">...</bp-accordion>
<bp-accordion variant="bordered">...</bp-accordion>
<bp-accordion variant="separated">...</bp-accordion>
```

### Default Expanded

<div class="component-preview">
  <bp-accordion id="expanded-demo">
    <bp-accordion-item item-id="exp1" expanded>
      <span slot="header">Open by Default</span>
      <p>This section starts expanded.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="exp2">
      <span slot="header">Closed by Default</span>
      <p>This section starts collapsed.</p>
    </bp-accordion-item>
  </bp-accordion>
</div>

```html
<bp-accordion>
  <bp-accordion-item item-id="exp1" expanded>
    <span slot="header">Open by Default</span>
    <p>This section starts expanded.</p>
  </bp-accordion-item>
</bp-accordion>
```

### Disabled

<div class="component-preview">
  <bp-accordion disabled>
    <bp-accordion-item item-id="dis1">
      <span slot="header">Disabled Section</span>
      <p>Cannot be expanded.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="dis2">
      <span slot="header">Also Disabled</span>
      <p>All items are disabled.</p>
    </bp-accordion-item>
  </bp-accordion>
</div>

```html
<bp-accordion disabled>...</bp-accordion>
```

### Disabled Individual Items

<div class="component-preview">
  <bp-accordion>
    <bp-accordion-item item-id="mix1">
      <span slot="header">Enabled Section</span>
      <p>This can be toggled.</p>
    </bp-accordion-item>
    <bp-accordion-item item-id="mix2" disabled>
      <span slot="header">Disabled Section</span>
      <p>This cannot be toggled.</p>
    </bp-accordion-item>
  </bp-accordion>
</div>

```html
<bp-accordion>
  <bp-accordion-item item-id="mix1">...</bp-accordion-item>
  <bp-accordion-item item-id="mix2" disabled>...</bp-accordion-item>
</bp-accordion>
```

### Programmatic Control

```javascript
const accordion = document.querySelector('bp-accordion');

// Expand a specific item
accordion.expand('item1');

// Collapse a specific item
accordion.collapse('item1');

// Expand all (only works with multiple mode)
accordion.expandAll();

// Collapse all
accordion.collapseAll();
```

## API Reference

### bp-accordion Properties

| Property        | Type                                     | Default     | Description                   |
| --------------- | ---------------------------------------- | ----------- | ----------------------------- |
| `variant`       | `'default' \| 'bordered' \| 'separated'` | `'default'` | Visual style variant          |
| `multiple`      | `boolean`                                | `false`     | Allow multiple expanded items |
| `expandedItems` | `string[]`                               | `[]`        | Array of expanded item IDs    |
| `disabled`      | `boolean`                                | `false`     | Disable all items             |

### bp-accordion Methods

| Method          | Description                           |
| --------------- | ------------------------------------- |
| `expand(id)`    | Expand item by ID                     |
| `collapse(id)`  | Collapse item by ID                   |
| `expandAll()`   | Expand all items (multiple mode only) |
| `collapseAll()` | Collapse all items                    |

### bp-accordion Events

| Event         | Detail   | Description                  |
| ------------- | -------- | ---------------------------- |
| `bp-expand`   | `{ id }` | Fired when an item expands   |
| `bp-collapse` | `{ id }` | Fired when an item collapses |

### bp-accordion-item Properties

| Property   | Type      | Default | Description              |
| ---------- | --------- | ------- | ------------------------ |
| `itemId`   | `string`  | `''`    | Unique identifier        |
| `expanded` | `boolean` | `false` | Whether item is expanded |
| `disabled` | `boolean` | `false` | Whether item is disabled |

### Slots

#### bp-accordion

| Slot      | Description                  |
| --------- | ---------------------------- |
| (default) | `bp-accordion-item` elements |

#### bp-accordion-item

| Slot      | Description            |
| --------- | ---------------------- |
| `header`  | Header/trigger content |
| (default) | Panel content          |

### CSS Parts

| Part        | Description              |
| ----------- | ------------------------ |
| `accordion` | Main accordion container |
| `item`      | Individual item wrapper  |
| `header`    | Item header/trigger      |
| `icon`      | Expand/collapse icon     |
| `panel`     | Collapsible content area |

### Keyboard Navigation

- **Enter/Space**: Toggle focused item
- **Arrow Down**: Focus next item header
- **Arrow Up**: Focus previous item header
- **Home**: Focus first item header
- **End**: Focus last item header

### Accessibility

- Uses `role="region"` with `aria-labelledby`
- Headers use `aria-expanded` and `aria-controls`
- Panels are hidden with `aria-hidden` when collapsed
- Full keyboard navigation support
