# Button

A versatile button component with multiple variants, sizes, and states. Fully themed using Blueprint's semantic design tokens.

## Features

- 6 semantic variants (primary, success, error, warning, info, secondary)
- 3 size options (sm, md, lg)
- Full keyboard and screen reader support
- Disabled state with proper accessibility
- Custom event emission
- Themeable with semantic design tokens

## Usage

```html
<!-- Primary button (default) -->
<bp-button>Click me</bp-button>

<!-- Semantic variants -->
<bp-button variant="success">Save</bp-button>
<bp-button variant="error">Delete</bp-button>
<bp-button variant="warning">Warning</bp-button>
<bp-button variant="info">Learn more</bp-button>
<bp-button variant="secondary">Cancel</bp-button>

<!-- Sizes -->
<bp-button size="sm">Small</bp-button>
<bp-button size="md">Medium</bp-button>
<bp-button size="lg">Large</bp-button>

<!-- Disabled state -->
<bp-button disabled>Disabled</bp-button>

<!-- Form integration -->
<bp-button type="submit">Submit Form</bp-button>
<bp-button type="reset">Reset</bp-button>
```

## API

### Properties

| Property   | Type                                                                      | Default     | Description                |
| ---------- | ------------------------------------------------------------------------- | ----------- | -------------------------- |
| `variant`  | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'secondary'` | `'primary'` | Visual style variant       |
| `size`     | `'sm' \| 'md' \| 'lg'`                                                    | `'md'`      | Button size                |
| `disabled` | `boolean`                                                                 | `false`     | Disables the button        |
| `type`     | `'button' \| 'submit' \| 'reset'`                                         | `'button'`  | HTML button type attribute |

### Events

| Event      | Detail                          | Description                                                |
| ---------- | ------------------------------- | ---------------------------------------------------------- |
| `bp-click` | `{ originalEvent: MouseEvent }` | Emitted when button is clicked (not emitted when disabled) |

### Slots

| Slot      | Description              |
| --------- | ------------------------ |
| (default) | Button label and content |

### CSS Parts

| Part     | Description               |
| -------- | ------------------------- |
| `button` | The native button element |

## Design Tokens Used

### Colors (Semantic)

- `--bp-color-primary` / `--bp-color-primary-hover` / `--bp-color-primary-active`
- `--bp-color-success`
- `--bp-color-error`
- `--bp-color-warning`
- `--bp-color-info`
- `--bp-color-text-inverse` (for button text on colored backgrounds)
- `--bp-color-text` (for secondary variant)
- `--bp-color-surface` / `--bp-color-surface-elevated` (for secondary variant)
- `--bp-color-border-strong` (for secondary variant border)
- `--bp-color-focus` (for focus ring)

### Spacing

- `--bp-spacing-xs` / `--bp-spacing-sm` / `--bp-spacing-md` / `--bp-spacing-lg`

### Typography

- `--bp-font-family-sans`
- `--bp-font-weight-medium`
- `--bp-font-size-sm` / `--bp-font-size-base` / `--bp-font-size-lg`
- `--bp-line-height-tight` / `--bp-line-height-normal`

### Border & Radius

- `--bp-border-radius-md`

### Focus

- `--bp-focus-width`
- `--bp-focus-style`
- `--bp-focus-offset`

### Motion

- `--bp-duration-fast`

### Opacity

- `--bp-opacity-disabled`

## Accessibility

- **Semantic HTML**: Uses native `<button>` element for proper keyboard and screen reader support
- **ARIA**: `aria-disabled` attribute reflects disabled state
- **Keyboard**: Full keyboard support (Space/Enter to activate)
- **Focus**: Visible focus ring using `--bp-color-focus` token with proper offset
- **Disabled**: Prevents interaction and emits no events when disabled
- **Screen readers**: Proper button role and label announcement
