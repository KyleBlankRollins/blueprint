# Badge

A compact status indicator for displaying counts, labels, and notifications.

## Features

- **6 semantic variants** - Primary, success, error, warning, info, and neutral
- **3 size options** - Small, medium, and large
- **Dot mode** - Minimal dot indicator for status displays
- **Flexible content** - Supports text, numbers, and icons
- **Full theme support** - Automatically adapts to active theme
- **Accessible** - Semantic HTML with proper ARIA support

## Usage

### Basic Badge

```html
<bp-badge>New</bp-badge>
```

### With Variants

```html
<bp-badge variant="primary">New</bp-badge>
<bp-badge variant="success">Active</bp-badge>
<bp-badge variant="error">Alert</bp-badge>
<bp-badge variant="warning">Pending</bp-badge>
<bp-badge variant="info">Info</bp-badge>
<bp-badge variant="neutral">Draft</bp-badge>
```

### Count Indicators

```html
<bp-badge variant="error" size="small">3</bp-badge>
<bp-badge variant="primary" size="small">99+</bp-badge>
```

### Status Dots

```html
<bp-badge variant="success" dot></bp-badge> Online
<bp-badge variant="error" dot></bp-badge> Offline
```

### Different Sizes

```html
<bp-badge size="small">Small</bp-badge>
<bp-badge size="medium">Medium</bp-badge>
<bp-badge size="large">Large</bp-badge>
```

## API

### Properties

| Property  | Type                                                                    | Default     | Description                        |
| --------- | ----------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `variant` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'primary'` | Visual variant of the badge        |
| `size`    | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  | Size of the badge                  |
| `dot`     | `boolean`                                                               | `false`     | Display as a minimal dot indicator |

### Events

This component does not emit any custom events.

### Slots

| Slot      | Description                                    |
| --------- | ---------------------------------------------- |
| (default) | Content of the badge (text, numbers, or icons) |

### CSS Parts

| Part    | Description                 |
| ------- | --------------------------- |
| `badge` | The badge container element |

## Design Tokens Used

**Colors:**

- `--bp-color-primary`
- `--bp-color-success`
- `--bp-color-error`
- `--bp-color-warning`
- `--bp-color-info`
- `--bp-color-border-strong`
- `--bp-color-text`
- `--bp-color-text-inverse`

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-weight-medium`
- `--bp-font-size-xs`
- `--bp-font-size-sm`
- `--bp-font-size-base`

**Spacing:**

- `--bp-spacing-xs`
- `--bp-spacing-sm`
- `--bp-spacing-md`
- `--bp-spacing-2` through `--bp-spacing-8`

**Borders:**

- `--bp-border-radius-full`

**Transitions:**

- `--bp-transition-fast`

## Accessibility

- **Semantic HTML** - Uses `<span>` element with proper role
- **High contrast** - All variants meet WCAG contrast requirements
- **Focusable** - Badge itself is not interactive, but can be placed within focusable elements
- **Screen readers** - Content is announced naturally as part of parent element

### Best Practices

- Use semantic variants that match the meaning (e.g., `error` for alerts, `success` for confirmations)
- Keep badge content concise (1-3 characters for counts, 1-2 words for labels)
- For count badges over 99, use "99+" notation
- Use dot badges for minimal status indicators where space is limited
- Ensure adequate spacing around badges when positioned near other elements
