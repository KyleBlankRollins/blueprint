# Pagination

A pagination component for navigating through multiple pages of content with customizable controls and appearance.

## Features

- **Smart Page Numbers** - Shows intelligently condensed page numbers with ellipsis for large page counts
- **Navigation Controls** - First, last, previous, and next page buttons (all optional)
- **Page Info Display** - Optional text showing "Page X of Y"
- **Flexible Configuration** - Control number of boundary and sibling page buttons shown
- **Size Variants** - Small, medium, and large sizes
- **Fully Accessible** - ARIA labels, keyboard navigation, and screen reader support
- **Event-Driven** - Emits `bp-page-change` event for easy integration
- **Customizable Styling** - CSS parts for granular style control

## Usage

### Basic Pagination

```html
<bp-pagination currentPage="1" totalPages="10"></bp-pagination>
```

### With Page Info

```html
<bp-pagination currentPage="3" totalPages="20" showInfo></bp-pagination>
```

### Compact (No First/Last Buttons)

```html
<bp-pagination
  currentPage="5"
  totalPages="15"
  showFirstLast="false"
></bp-pagination>
```

### Small Size

```html
<bp-pagination currentPage="2" totalPages="8" size="sm"></bp-pagination>
```

### Custom Sibling and Boundary Counts

```html
<bp-pagination
  currentPage="10"
  totalPages="50"
  siblingCount="2"
  boundaryCount="2"
></bp-pagination>
```

### Handling Page Changes

```javascript
const pagination = document.querySelector('bp-pagination');
pagination.addEventListener('bp-page-change', (e) => {
  console.log('New page:', e.detail.page);
  // Fetch new data, update URL, etc.
});
```

## API

### Properties

| Property        | Type      | Default  | Description                                            |
| --------------- | --------- | -------- | ------------------------------------------------------ | -------- | ------------ |
| `currentPage`   | `number`  | `1`      | Current page number (1-indexed)                        |
| `totalPages`    | `number`  | `1`      | Total number of pages                                  |
| `siblingCount`  | `number`  | `1`      | Number of page buttons to show around the current page |
| `boundaryCount` | `number`  | `1`      | Number of page buttons to show at the start and end    |
| `showFirstLast` | `boolean` | `true`   | Show first/last page buttons                           |
| `showPrevNext`  | `boolean` | `true`   | Show previous/next page buttons                        |
| `showInfo`      | `boolean` | `false`  | Show page info text (e.g., "Page 1 of 10")             |
| `disabled`      | `boolean` | `false`  | Disable all pagination controls                        |
| `size`          | `'sm'  | 'md' | 'lg'`                                               | `medium` | Size variant |

### Events

| Event            | Detail             | Description                      |
| ---------------- | ------------------ | -------------------------------- |
| `bp-page-change` | `{ page: number }` | Dispatched when the page changes |

### Slots

This component does not use slots.

### CSS Parts

| Part              | Description                             |
| ----------------- | --------------------------------------- |
| `container`       | The main pagination container (`<nav>`) |
| `button`          | All pagination buttons                  |
| `button-first`    | The first page button («)               |
| `button-prev`     | The previous page button (‹)            |
| `button-next`     | The next page button (›)                |
| `button-last`     | The last page button (»)                |
| `button-page`     | Individual page number buttons          |
| `button-ellipsis` | Ellipsis indicators (…)                 |
| `info`            | The page info text ("Page X of Y")      |

## Design Tokens Used

### Colors

- `--bp-color-background` - Button background
- `--bp-color-surface` - Button hover background
- `--bp-color-primary` - Active page button background
- `--bp-color-primary-hover` - Active page button hover background
- `--bp-color-primary-active` - Active page button active background
- `--bp-color-text` - Button text color
- `--bp-color-text-inverse` - Active button text color
- `--bp-color-text-muted` - Info text and ellipsis color
- `--bp-color-border` - Button border color
- `--bp-color-border-strong` - Button border hover color

### Spacing

- `--bp-spacing-2xs` - Small button padding
- `--bp-spacing-xs` - Button padding, gap between buttons
- `--bp-spacing-sm` - Button padding, info text margin
- `--bp-spacing-md` - Large button padding
- `--bp-spacing-xl` - Small button size
- `--bp-spacing-2xl` - Medium button size
- `--bp-spacing-3xl` - Large button size

### Typography

- `--bp-font-sans` - Font family
- `--bp-font-size-xs` - Small info text
- `--bp-font-size-sm` - Small buttons and info text
- `--bp-font-size-base` - Medium buttons
- `--bp-font-size-lg` - Large buttons
- `--bp-font-weight-medium` - Button font weight
- `--bp-font-weight-semibold` - Active button font weight
- `--bp-line-height-tight` - Button line height

### Borders

- `--bp-border-width` - Button border width
- `--bp-border-radius-md` - Button border radius

### Transitions

- `--bp-transition-fast` - Button state transitions

## Accessibility

- Uses semantic `<nav>` element with `aria-label="Pagination"`
- Each button has descriptive `aria-label` (e.g., "First page", "Page 3")
- Active page button has `aria-current="page"`
- Page info has `aria-live="polite"` for screen reader announcements
- Disabled buttons cannot be activated
- Full keyboard navigation support (Tab, Enter/Space to activate)
- Ellipsis has `aria-hidden="true"` to prevent screen reader announcement
