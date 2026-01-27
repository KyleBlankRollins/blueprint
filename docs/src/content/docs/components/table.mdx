---
title: Table
description: Data table with sorting, selection, and custom rendering
---

The `bp-table` component displays tabular data with features like sorting, row selection, custom cell rendering, and various visual styles. It's ideal for presenting structured data that users need to browse, sort, or act upon.

## Import

```javascript
import 'blueprint/components/table';
```

## Examples

### Default

<div class="component-preview">
  <bp-table id="table-demo"></bp-table>
</div>

```html
<bp-table id="table-demo"></bp-table>

<script>
  const table = document.querySelector('#table-demo');
  table.columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];
  table.rows = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor' },
  ];
</script>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-table variant="default" id="table-default"></bp-table>
    <bp-table variant="striped" id="table-striped"></bp-table>
    <bp-table variant="bordered" id="table-bordered"></bp-table>
  </div>
</div>

```html
<bp-table variant="default">...</bp-table>
<bp-table variant="striped">...</bp-table>
<bp-table variant="bordered">...</bp-table>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-table size="small" id="table-small"></bp-table>
    <bp-table size="medium" id="table-medium"></bp-table>
    <bp-table size="large" id="table-large"></bp-table>
  </div>
</div>

```html
<bp-table size="small">...</bp-table>
<bp-table size="medium">...</bp-table>
<bp-table size="large">...</bp-table>
```

### Sortable Columns

<div class="component-preview">
  <bp-table id="table-sortable"></bp-table>
</div>

```javascript
const table = document.querySelector('#table-sortable');
table.columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true, align: 'right' },
  { key: 'email', label: 'Email' },
];
table.rows = [
  { id: 1, name: 'Alice', age: 28, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 35, email: 'bob@example.com' },
  { id: 3, name: 'Carol', age: 24, email: 'carol@example.com' },
];

// Listen for sort events
table.addEventListener('bp-sort', (e) => {
  console.log('Sorted:', e.detail.column, e.detail.direction);
});
```

### Row Selection

<div class="component-preview">
  <bp-table selectable multi-select id="table-selectable"></bp-table>
</div>

```html
<bp-table selectable multi-select id="table-selectable"></bp-table>

<script>
  const table = document.querySelector('#table-selectable');

  // Listen for selection changes
  table.addEventListener('bp-select', (e) => {
    console.log('Selected rows:', e.detail.selectedRows);
  });

  // Pre-select rows
  table.selectedRows = [1, 3];
</script>
```

### Custom Cell Rendering

```javascript
const table = document.querySelector('#table-custom');
table.columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    render: (value) => {
      const color = value === 'Active' ? 'success' : 'default';
      return html`<bp-badge variant="${color}">${value}</bp-badge>`;
    },
  },
  {
    key: 'actions',
    label: '',
    render: (value, row) => {
      return html`
        <bp-button size="small" variant="secondary">Edit</bp-button>
      `;
    },
  },
];
```

### Column Alignment and Width

```javascript
table.columns = [
  { key: 'name', label: 'Name', width: '200px' },
  { key: 'price', label: 'Price', align: 'right', width: '100px' },
  { key: 'quantity', label: 'Qty', align: 'center', width: '80px' },
];
```

### Sticky Header

<div class="component-preview" style="max-height: 200px; overflow: auto;">
  <bp-table sticky-header id="table-sticky"></bp-table>
</div>

```html
<div style="max-height: 300px; overflow: auto;">
  <bp-table sticky-header>...</bp-table>
</div>
```

### Loading State

<div class="component-preview">
  <bp-table loading id="table-loading"></bp-table>
</div>

```html
<bp-table loading>...</bp-table>
```

### Empty State

<div class="component-preview">
  <bp-table id="table-empty">
    <div slot="empty">
      <p>No data available</p>
      <bp-button size="small">Add Item</bp-button>
    </div>
  </bp-table>
</div>

```html
<bp-table>
  <div slot="empty">
    <p>No data available</p>
    <bp-button size="small">Add Item</bp-button>
  </div>
</bp-table>
```

## API Reference

### Properties

| Property       | Type                                   | Default     | Description                 |
| -------------- | -------------------------------------- | ----------- | --------------------------- |
| `columns`      | `TableColumn[]`                        | `[]`        | Array of column definitions |
| `rows`         | `TableRow[]`                           | `[]`        | Array of row data objects   |
| `variant`      | `'default' \| 'striped' \| 'bordered'` | `'default'` | Visual style variant        |
| `size`         | `'small' \| 'medium' \| 'large'`       | `'medium'`  | Cell size                   |
| `selectable`   | `boolean`                              | `false`     | Enable row selection        |
| `multiSelect`  | `boolean`                              | `false`     | Enable multi-row selection  |
| `selectedRows` | `(string \| number)[]`                 | `[]`        | Array of selected row IDs   |
| `sortState`    | `TableSortState \| null`               | `null`      | Current sort state          |
| `stickyHeader` | `boolean`                              | `false`     | Sticky header on scroll     |
| `hoverable`    | `boolean`                              | `true`      | Highlight rows on hover     |
| `loading`      | `boolean`                              | `false`     | Show loading state          |

### TableColumn Interface

```typescript
interface TableColumn {
  key: string; // Matches data property
  label: string; // Header text
  sortable?: boolean; // Enable sorting
  align?: 'left' | 'center' | 'right';
  width?: string; // CSS width value
  render?: (value, row) => TemplateResult | string;
}
```

### TableRow Interface

```typescript
interface TableRow {
  id: string | number; // Required unique ID
  [key: string]: unknown; // Data fields matching column keys
}
```

### TableSortState Interface

```typescript
interface TableSortState {
  column: string; // Column key
  direction: 'asc' | 'desc' | 'none';
}
```

### Events

| Event          | Detail                            | Description                  |
| -------------- | --------------------------------- | ---------------------------- |
| `bp-sort`      | `{ column, direction }`           | Fired when sorting changes   |
| `bp-select`    | `{ selectedRows, row, selected }` | Fired when selection changes |
| `bp-row-click` | `{ row, originalEvent }`          | Fired when a row is clicked  |

### Slots

| Slot      | Description              |
| --------- | ------------------------ |
| `empty`   | Content when no data     |
| `loading` | Custom loading indicator |

### CSS Parts

| Part          | Description           |
| ------------- | --------------------- |
| `table`       | The table element     |
| `thead`       | Table header section  |
| `tbody`       | Table body section    |
| `header-row`  | Header row            |
| `header-cell` | Header cell           |
| `row`         | Data row              |
| `cell`        | Data cell             |
| `checkbox`    | Selection checkbox    |
| `sort-icon`   | Sort direction icon   |
| `empty-state` | Empty state container |

### Keyboard Navigation

- **Arrow Up/Down**: Navigate between rows
- **Space**: Toggle row selection (when selectable)
- **Enter**: Activate row click
- **Tab**: Navigate between interactive elements

### Accessibility

- Uses semantic `<table>` markup
- `aria-sort` on sortable headers
- `aria-selected` on selected rows
- Screen reader announces sort changes
