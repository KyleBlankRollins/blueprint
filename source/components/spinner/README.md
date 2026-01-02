# Spinner

A loading spinner component that indicates content is being loaded or processed.

## Features

- Multiple sizes (sm, md, lg)
- Multiple variants (primary, success, error, warning, inverse, neutral)
- Smooth CSS animation with size-appropriate speeds
- Accessible with ARIA attributes
- Customizable loading label for screen readers
- CSS parts for advanced styling
- Uses design tokens for consistent theming
- Respects user's motion preferences

## Usage

```html
<!-- Default spinner -->
<bp-spinner></bp-spinner>

<!-- Small spinner -->
<bp-spinner size="sm"></bp-spinner>

<!-- Large spinner -->
<bp-spinner size="lg"></bp-spinner>

<!-- Success variant -->
<bp-spinner variant="success"></bp-spinner>

<!-- Error variant -->
<bp-spinner variant="error"></bp-spinner>

<!-- Inverse for dark backgrounds -->
<bp-spinner variant="inverse"></bp-spinner>

<!-- Custom accessibility label -->
<bp-spinner label="Processing data..."></bp-spinner>

<!-- Combining size and variant -->
<bp-spinner size="lg" variant="success"></bp-spinner>
```

## API

### Properties

| Property  | Type                                                                       | Default        | Description                          |
| --------- | -------------------------------------------------------------------------- | -------------- | ------------------------------------ |
| `size`    | `'sm' \| 'md' \| 'lg'`                                                     | `'md'`         | Size of the spinner.                 |
| `variant` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'inverse' \| 'neutral'` | `'primary'`    | Visual variant of the spinner.       |
| `label`   | `string`                                                                   | `'Loading...'` | Accessible label for screen readers. |

### Events

This component does not emit any events.

### Slots

This component does not use slots.

### CSS Parts

| Part      | Description                 |
| --------- | --------------------------- |
| `spinner` | The outer container element |
| `circle`  | The animated spinner circle |

## Design Tokens Used

**Colors:**

- `--bp-color-primary` - Primary variant color
- `--bp-color-success` - Success variant color
- `--bp-color-error` - Error variant color
- `--bp-color-warning` - Warning variant color
- `--bp-color-text-inverse` - Inverse variant color
- `--bp-color-text-muted` - Neutral variant color

**Spacing:**

- `--bp-spacing-4` - Small size (16px diameter)
- `--bp-spacing-6` - Medium size (24px diameter)
- `--bp-spacing-8` - Large size (32px diameter)

**Borders:**

- `--bp-border-radius-full` - Circular shape
- Border widths scale with size: 1.5px (sm), 2px (md), 2.5px (lg)

**Motion:**

- `--bp-duration-normal` - Small spinner animation (300ms)
- `--bp-duration-slow` - Medium spinner animation (500ms)
- Custom 600ms duration for large spinner
- `--bp-ease-linear` - Constant rotation speed

## Accessibility

- **ARIA Attributes:**
  - `role="status"` - Announces loading state to screen readers
  - `aria-label` - Provides context about what is loading
- **Screen Reader Behavior:**
  - Screen readers announce the loading state when spinner appears
  - Custom labels help users understand what's happening
  - Updates to the label are announced automatically

- **Visual Considerations:**
  - Smooth animation at constant speed to avoid distraction
  - Uses theme colors for consistency across light/dark modes
  - High contrast between track and active segment
