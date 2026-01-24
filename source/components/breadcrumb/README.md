# Breadcrumb

A breadcrumb navigation component showing the user's location in a hierarchy.

## Features

- **Multiple separators** - Slash, chevron, arrow, and dot separator styles
- **Size variants** - Small, medium, and large sizes
- **Collapsible** - Automatically collapse middle items with ellipsis when `maxItems` is set
- **Keyboard accessible** - Full keyboard navigation support
- **Icon support** - Optional icons for each breadcrumb item
- **Dual modes** - Use `items` array for programmatic control or slots for declarative markup
- **ARIA support** - Proper navigation landmarks and `aria-current` for current page

## Usage

### Programmatic (items array)

```html
<bp-breadcrumb
  .items=${[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Current Page' }
  ]}
></bp-breadcrumb>
```

### Declarative (slots)

```html
<bp-breadcrumb>
  <bp-breadcrumb-item href="/">Home</bp-breadcrumb-item>
  <bp-breadcrumb-item href="/products">Products</bp-breadcrumb-item>
  <bp-breadcrumb-item current>Current Page</bp-breadcrumb-item>
</bp-breadcrumb>
```

### With max items (collapsing)

```html
<bp-breadcrumb
  max-items="3"
  .items=${[
    { label: 'Home', href: '/' },
    { label: 'Level 1', href: '/1' },
    { label: 'Level 2', href: '/2' },
    { label: 'Level 3', href: '/3' },
    { label: 'Current Page' }
  ]}
></bp-breadcrumb>
```

## API

### Properties (bp-breadcrumb)

| Property           | Type                                       | Default        | Description                                            |
| ------------------ | ------------------------------------------ | -------------- | ------------------------------------------------------ |
| `items`            | `BreadcrumbItem[]`                         | `[]`           | Array of breadcrumb items                              |
| `size`             | `'small' \| 'medium' \| 'large'`           | `'medium'`     | Size of the breadcrumb                                 |
| `separator`        | `'slash' \| 'chevron' \| 'arrow' \| 'dot'` | `'slash'`      | Separator style between items                          |
| `ariaLabel`        | `string`                                   | `'Breadcrumb'` | Accessible label for the navigation landmark           |
| `collapseOnMobile` | `boolean`                                  | `false`        | Whether to collapse middle items on small screens      |
| `maxItems`         | `number`                                   | `0`            | Maximum visible items before collapsing (0 = no limit) |

### Properties (bp-breadcrumb-item)

| Property  | Type      | Default | Description                      |
| --------- | --------- | ------- | -------------------------------- |
| `href`    | `string`  | -       | URL for the breadcrumb link      |
| `current` | `boolean` | `false` | Whether this is the current page |

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  label: string; // Display label
  href?: string; // URL (omit for current page)
  icon?: string; // Icon name to display
  current?: boolean; // Whether this is the current page
}
```

### Events

| Event                 | Detail                                    | Description                             |
| --------------------- | ----------------------------------------- | --------------------------------------- |
| `bp-breadcrumb-click` | `{ item: BreadcrumbItem, index: number }` | Fired when a breadcrumb item is clicked |

### Slots

| Slot        | Description              |
| ----------- | ------------------------ |
| (default)   | Custom breadcrumb items  |
| `separator` | Custom separator content |

### CSS Parts

| Part              | Description                              |
| ----------------- | ---------------------------------------- |
| `nav`             | The nav element wrapper                  |
| `list`            | The ordered list element                 |
| `item`            | Individual breadcrumb item               |
| `item-current`    | The current/active breadcrumb item       |
| `link`            | Breadcrumb link element                  |
| `separator`       | Separator between items                  |
| `ellipsis`        | The ellipsis button when items collapsed |
| `ellipsis-button` | The ellipsis button element              |

## Design Tokens Used

### Color Tokens

- `--bp-color-text` - Default text color
- `--bp-color-text-muted` - Muted text for separators
- `--bp-color-primary` - Link color on hover
- `--bp-color-surface` - Ellipsis button background on hover
- `--bp-color-focus` - Focus ring color

### Typography Tokens

- `--bp-font-family` - Font family
- `--bp-font-size-sm` - Small size font
- `--bp-font-size-base` - Base size font
- `--bp-font-size-lg` - Large size font
- `--bp-font-weight-normal` - Normal font weight
- `--bp-line-height-normal` - Line height

### Spacing Tokens

- `--bp-spacing-xs` - Extra small spacing
- `--bp-spacing-sm` - Small spacing
- `--bp-spacing-md` - Medium spacing

### Other Tokens

- `--bp-border-radius` - Border radius for ellipsis button
- `--bp-duration-fast` - Transition duration
- `--bp-focus-width` - Focus ring width
- `--bp-focus-style` - Focus ring style
- `--bp-focus-offset` - Focus ring offset

## Accessibility

- Uses `<nav>` with `aria-label` for navigation landmark
- Uses ordered list (`<ol>`) for semantic structure
- Current page marked with `aria-current="page"`
- Separators hidden from screen readers with `aria-hidden="true"`
- Ellipsis button has descriptive `aria-label`
- Full keyboard navigation support (Tab, Enter, Space)

### Universal Tokens (Infrastructure)

- `--bp-spacing-md` - Padding/margins
- `--bp-font-size-base` - Text size
- `--bp-line-height-normal` - Line spacing
- `--bp-transition-fast` - Animations

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- [Describe ARIA attributes]
- [Describe keyboard support]
- [Describe screen reader behavior]
