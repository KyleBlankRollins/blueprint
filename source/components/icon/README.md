# Icon

## Features

- Built-in icon library with **430 icons** from [System UI Icons](https://www.systemuicons.com/)
- Named icons via `name` property or custom SVG via slot
- Multiple size variants (xs, sm, md, lg, xl)
- Color variants for semantic states (primary, success, warning, error, muted)
- Accessible with ARIA label support
- Automatic role assignment based on context
- Tree-shakeable - only bundle icons you use
- Fully theme-aware using design tokens
- Auto-generated TypeScript types for autocomplete

## Usage

```html
<!-- Using named icon from System UI Icons -->
<bp-icon name="create" size="md" color="primary"></bp-icon>

<!-- Different icons -->
<bp-icon name="check" color="success"></bp-icon>
<bp-icon name="warning" color="warning"></bp-icon>
<bp-icon name="heart" color="error"></bp-icon>

<!-- With size variant -->
<bp-icon name="info" size="lg" color="primary"></bp-icon>

<!-- With accessibility label -->
<bp-icon
  name="warning"
  aria-label="Warning: This action cannot be undone"
  color="error"
></bp-icon>

<!-- Custom SVG (when name is not provided) -->
<bp-icon size="lg" color="primary">
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z" />
  </svg>
</bp-icon>
```

## Available Icons

All **430 icons** from [System UI Icons](https://www.systemuicons.com/) are available. Icon names use kebab-case (e.g., `arrow-down`, `user-circle`).

**Common examples:**

- **Actions:** `check`, `cross`, `create`, `trash`, `search`, `settings`
- **Arrows:** `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`
- **Media:** `play-button`, `video`, `camera`, `microphone`, `volume-high`
- **Communication:** `mail`, `message`, `phone-portrait`, `notification`
- **User:** `user`, `user-circle`, `users`, `user-add`
- **Files:** `document`, `folder-open`, `file-download`, `clipboard`
- **Status:** `info-circle`, `warning-circle`, `check-circle`, `cross-circle`

**View all icons:** Visit [systemuicons.com](https://www.systemuicons.com/) to browse the complete library.

**TypeScript autocomplete:** Icon names are fully typed - your IDE will suggest all available icons when you type `name="..."`

### Adding New Icons

If you need to add SVG files to the icon library:

1. Add new `.svg` files to `source/assets/icons/`
2. Run the generator: `node source/components/icon/generate-icon-registry.js`
3. The registry will be automatically regenerated with all icons

The generator automatically:

- Imports all SVG files using Vite's `?raw` import
- Handles reserved JavaScript keywords (e.g., `import` → `_import`)
- Generates TypeScript types for autocomplete
- Creates a tree-shakeable registry

## API

### Properties

| Property    | Type                                                                     | Default     | Description                                                          |
| ----------- | ------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------- |
| `name`      | `IconName \| ''`                                                         | `''`        | Name of icon from System UI Icons library (takes priority over slot) |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                   | `'md'`      | Size variant of the icon                                             |
| `color`     | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'muted'` | `'default'` | Color variant of the icon                                            |
| `ariaLabel` | `string`                                                                 | `''`        | ARIA label for accessibility (sets role="img" when provided)         |

### Events

This component does not emit any custom events.

### Slots

| Slot      | Description                                               |
| --------- | --------------------------------------------------------- |
| (default) | Custom SVG content (used when `name` property is not set) |

### CSS Parts

| Part   | Description                |
| ------ | -------------------------- |
| `icon` | The icon container element |

## Design Tokens Used

**Colors:**

- `--bp-color-text` - Default icon color
- `--bp-color-primary` - Primary variant color
- `--bp-color-success` - Success variant color
- `--bp-color-warning` - Warning variant color
- `--bp-color-error` - Error variant color
- `--bp-color-text-muted` - Muted variant color

**Sizes (mapped to font sizes for consistent scaling):**

- `--bp-font-size-xs` - Extra small size (12px)
- `--bp-font-size-sm` - Small size (14px)
- `--bp-font-size-lg` - Medium size (18px)
- `--bp-font-size-2xl` - Large size (24px)
- `--bp-font-size-3xl` - Extra large size (30px)

## Accessibility

- **ARIA Label**: When `aria-label` is provided, the icon is given `role="img"` to be announced by screen readers. When no label is provided, it defaults to `role="presentation"` as a decorative element.
- **Semantic Meaning**: Use `aria-label` to provide meaningful descriptions for icons that convey information or actions.
- **Decorative Icons**: Icons used purely for visual decoration should have no `aria-label` (default behavior).
- **Color Independence**: Color variants are supplementary - do not rely solely on color to convey meaning.

### Examples

```html
<!-- Meaningful icon with label -->
<bp-icon aria-label="Delete item" color="error">
  <svg>...</svg>
</bp-icon>

<!-- Decorative icon next to text -->
<button>
  <bp-icon color="primary">
    <svg>...</svg>
  </bp-icon>
  Save Changes
</button>
```
