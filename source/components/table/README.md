# Table

A data table component with sorting, row selection, and multiple visual variants.

## Features

- **Variants**: Default, striped, and bordered styles
- **Sizes**: Small, medium, and large sizing options
- **Sorting**: Click column headers to sort ascending/descending
- **Selection**: Single or multi-row selection with checkboxes
- **Sticky Header**: Keep headers visible while scrolling
- **Custom Rendering**: Use render functions for custom cell content
- **Loading State**: Show loading indicator while fetching data
- **Empty State**: Customizable empty state when no data
- **Accessibility**: Full ARIA support with role="grid"

## Usage

```html
<bp-table
  .columns=${[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'center' }
  ]}
  .rows=${[
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' }
  ]}
  variant="striped"
  hoverable
></bp-table>
```

### Selectable Rows

```html
<bp-table
  .columns="${columns}"
  .rows="${rows}"
  selectable
  multiSelect
  @bp-select="${(e)"
  =""
>
  console.log('Selected:', e.detail.selectedRows)} ></bp-table
>
```

### Sortable Columns

```html
<bp-table
  .columns=${[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]}
  .rows=${rows}
  @bp-sort=${(e) => console.log('Sort:', e.detail)}
></bp-table>
```

### Custom Cell Rendering

```html
<bp-table
  .columns=${[
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => `<span class="badge">${value}</span>`
    }
  ]}
  .rows=${rows}
></bp-table>
```

## API

### Properties

| Property       | Type                                   | Default     | Description                  |
| -------------- | -------------------------------------- | ----------- | ---------------------------- |
| `columns`      | `TableColumn[]`                        | `[]`        | Array of column definitions  |
| `rows`         | `TableRow[]`                           | `[]`        | Array of row data objects    |
| `variant`      | `'default' \| 'striped' \| 'bordered'` | `'default'` | Visual variant               |
| `size`         | `'sm' \| 'md' \| 'lg'`                 | `'md'`      | Size variant                 |
| `selectable`   | `boolean`                              | `false`     | Whether rows can be selected |
| `multiSelect`  | `boolean`                              | `false`     | Allow multiple row selection |
| `selectedRows` | `(string \| number)[]`                 | `[]`        | Array of selected row IDs    |
| `sortState`    | `TableSortState \| null`               | `null`      | Current sort state           |
| `stickyHeader` | `boolean`                              | `false`     | Sticky header when scrolling |
| `hoverable`    | `boolean`                              | `true`      | Highlight rows on hover      |
| `loading`      | `boolean`                              | `false`     | Show loading state           |

### Interfaces

```typescript
interface TableColumn {
  key: string; // Property key in row data
  label: string; // Display label
  sortable?: boolean; // Enable sorting
  align?: 'left' | 'center' | 'right'; // Cell alignment
  width?: string; // Column width (CSS value)
  render?: (value: unknown, row: TableRow) => string; // Custom renderer
}

interface TableRow {
  id: string | number; // Unique identifier
  [key: string]: unknown; // Data fields
}

interface TableSortState {
  column: string; // Column key
  direction: 'asc' | 'desc' | 'none'; // Sort direction
}
```

### Methods

| Method          | Parameters | Description                            |
| --------------- | ---------- | -------------------------------------- |
| `selectAll()`   | -          | Select all rows (requires multiSelect) |
| `deselectAll()` | -          | Deselect all rows                      |
| `clearSort()`   | -          | Clear current sort state               |

### Events

| Event          | Detail                                                  | Description                  |
| -------------- | ------------------------------------------------------- | ---------------------------- |
| `bp-sort`      | `{ column: string, direction: string }`                 | Fired when sorting changes   |
| `bp-select`    | `{ selectedRows: (string \| number)[], row: TableRow }` | Fired when selection changes |
| `bp-row-click` | `{ row: TableRow, index: number }`                      | Fired when a row is clicked  |

### Slots

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `empty`   | Content shown when rows array is empty |
| `loading` | Content shown when loading is true     |

### CSS Parts

| Part          | Description             |
| ------------- | ----------------------- |
| `table`       | The table element       |
| `thead`       | The table header        |
| `tbody`       | The table body          |
| `header-row`  | Header row              |
| `header-cell` | Individual header cells |
| `row`         | Data rows               |
| `cell`        | Individual data cells   |
| `checkbox`    | Selection checkboxes    |
| `sort-icon`   | Sort direction icons    |
| `empty-state` | Empty state container   |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Table background
- `--bp-color-surface-subdued` - Striped row background
- `--bp-color-text` - Text color
- `--bp-color-text-muted` - Secondary text
- `--bp-color-border` - Border colors
- `--bp-color-primary` - Selected row highlight
- `--bp-color-focus` - Focus ring color

### Universal Tokens (Infrastructure)

- `--bp-spacing-xs` - Compact padding
- `--bp-spacing-md` - Standard padding
- `--bp-spacing-lg` - Large padding
- `--bp-font-family` - Font family
- `--bp-font-size-sm` - Small text size
- `--bp-font-size-base` - Base text size
- `--bp-font-weight-semibold` - Header weight
- `--bp-border-width` - Border thickness
- `--bp-border-radius` - Container rounding
- `--bp-shadow-sm` - Subtle shadow
- `--bp-transition-fast` - Hover transitions

## Accessibility

- Uses `role="grid"` on table element
- `aria-sort` on sortable header cells indicates current sort direction
- `aria-selected` on selectable rows indicates selection state
- `aria-busy` on table when loading
- `aria-label` on checkboxes for screen readers
- Focus indicators on interactive elements
- Keyboard navigation support for row selection

- `--bp-spacing-md` - Padding/margins
- `--bp-font-size-base` - Text size
- `--bp-line-height-normal` - Line spacing
- `--bp-transition-fast` - Animations

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- [Describe ARIA attributes]
- [Describe keyboard support]
- [Describe screen reader behavior]
