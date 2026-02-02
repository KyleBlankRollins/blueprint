# Slider

A slider component for selecting numeric values within a range. Supports keyboard navigation, custom formatting, tick marks, and full accessibility.

## Features

- **Range selection** - Define min, max, and step values
- **Keyboard navigation** - Arrow keys, Home/End, PageUp/PageDown
- **Value display** - Optional current value display with custom formatting
- **Tick marks** - Optional visual tick marks at step intervals
- **Size variants** - sm, md, and lg sizes
- **Accessibility** - Full ARIA slider pattern with screen reader support
- **Form integration** - Hidden input for form submission
- **Touch support** - Works on touch devices

## Usage

```html
<!-- Basic slider -->
<bp-slider value="50" min="0" max="100"></bp-slider>

<!-- With label and value display -->
<bp-slider label="Volume" value="75" show-value></bp-slider>

<!-- With ticks and custom step -->
<bp-slider min="0" max="100" step="25" show-ticks></bp-slider>

<!-- Disabled state -->
<bp-slider value="30" disabled></bp-slider>
```

## API

### Properties

| Property      | Type                        | Default  | Description                                  |
| ------------- | --------------------------- | -------- | -------------------------------------------- |
| `value`       | `number`                    | `0`      | Current value of the slider                  |
| `min`         | `number`                    | `0`      | Minimum value                                |
| `max`         | `number`                    | `100`    | Maximum value                                |
| `step`        | `number`                    | `1`      | Step increment                               |
| `name`        | `string`                    | `''`     | Name attribute for form association          |
| `label`       | `string`                    | `''`     | Label text for the slider                    |
| `disabled`    | `boolean`                   | `false`  | Whether the slider is disabled               |
| `size`        | `'sm' \| 'md' \| 'lg'`      | `'md'`   | Size variant                                 |
| `showValue`   | `boolean`                   | `false`  | Whether to show the current value            |
| `showTicks`   | `boolean`                   | `false`  | Whether to show tick marks at step intervals |
| `formatValue` | `(value: number) => string` | `String` | Format function for displaying the value     |

### Events

| Event       | Detail              | Description                                      |
| ----------- | ------------------- | ------------------------------------------------ |
| `bp-input`  | `{ value: number }` | Fired continuously while dragging                |
| `bp-change` | `{ value: number }` | Fired when the value changes (after interaction) |

### CSS Parts

| Part            | Description                     |
| --------------- | ------------------------------- |
| `track`         | The slider track element        |
| `fill`          | The filled portion of the track |
| `thumb`         | The draggable thumb element     |
| `label`         | The label element               |
| `value-display` | The current value display       |

### Keyboard Navigation

| Key          | Action                      |
| ------------ | --------------------------- |
| `ArrowRight` | Increase value by step      |
| `ArrowUp`    | Increase value by step      |
| `ArrowLeft`  | Decrease value by step      |
| `ArrowDown`  | Decrease value by step      |
| `PageUp`     | Increase value by step × 10 |
| `PageDown`   | Decrease value by step × 10 |
| `Home`       | Set to minimum value        |
| `End`        | Set to maximum value        |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-primary` - Fill and thumb border color
- `--bp-color-primary-hover` - Thumb border on hover
- `--bp-color-primary-active` - Thumb border while dragging
- `--bp-color-surface-elevated` - Thumb background
- `--bp-color-surface-subdued` - Disabled background
- `--bp-color-text` - Label text color
- `--bp-color-text-muted` - Value display color
- `--bp-color-border` - Track background color
- `--bp-color-border-strong` - Tick mark color
- `--bp-color-focus` - Focus ring color
- `--bp-font-family` - Typography

### Universal Tokens (Infrastructure)

- `--bp-spacing-*` - Thumb and track sizing
- `--bp-border-radius-full` - Track and thumb roundness
- `--bp-border-width` - Thumb border
- `--bp-shadow-sm`, `--bp-shadow-md` - Thumb shadows
- `--bp-transition-fast` - Animation timing
- `--bp-duration-instant` - Fill transition
- `--bp-focus-width` - Focus ring width
- `--bp-opacity-disabled` - Disabled opacity
- `--bp-font-size-sm` - Label and value text size
- `--bp-font-weight-medium` - Label weight
- `--bp-line-height-normal` - Line spacing

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

This component follows the [ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) with full keyboard and screen reader support.

**ARIA Attributes:**

- `role="slider"` on thumb element
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` reflect current range and value
- `aria-valuetext` provides formatted value for screen readers
- `aria-label` describes the slider purpose (uses label property or "Slider")
- `aria-disabled` indicates disabled state
- `tabindex` controls focus (0 when enabled, -1 when disabled)

**Keyboard Support:**
Full keyboard navigation documented in [Keyboard Navigation](#keyboard-navigation) section above.

**Screen Reader Behavior:**
Screen readers announce the slider's label, current value (using `aria-valuetext`), and range. As users navigate with arrow keys, updated values are announced dynamically. Custom `formatValue` function can be provided to enhance value announcements (e.g., "50 percent" or "$250").
