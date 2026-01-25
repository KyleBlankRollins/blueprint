# ColorPicker

A feature-rich color picker component that provides an accessible and intuitive color selection experience. Supports HEX, RGB, and HSL formats with optional alpha channel.

## Features

- **Color area** - 2D gradient for intuitive saturation/value selection
- **Hue slider** - Vertical slider for hue selection (0-360°)
- **Alpha slider** - Horizontal slider for transparency (optional)
- **Multiple formats** - HEX, RGB, and HSL with format toggle
- **Swatches** - Predefined color swatches for quick selection
- **Inline mode** - Render picker directly without popover
- **Eyedropper** - Native color picker on supported browsers (Chrome 95+)
- **Keyboard navigation** - Full keyboard support with arrow keys
- **Form integration** - Works with native form submission
- **Accessibility** - ARIA roles, labels, and keyboard support

## Usage

### Basic Usage

```html
<bp-color-picker value="#3b82f6"></bp-color-picker>
```

### With Swatches

```html
<bp-color-picker
  value="#3b82f6"
  .swatches=${['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']}
></bp-color-picker>
```

### Inline Mode

```html
<bp-color-picker inline value="#3b82f6"></bp-color-picker>
```

### RGB Format with Alpha

```html
<bp-color-picker
  format="rgb"
  alpha
  value="rgba(59, 130, 246, 0.5)"
></bp-color-picker>
```

### Different Sizes

```html
<bp-color-picker size="sm" value="#3b82f6"></bp-color-picker>
<bp-color-picker size="md" value="#3b82f6"></bp-color-picker>
<bp-color-picker size="lg" value="#3b82f6"></bp-color-picker>
```

### With Label

```html
<bp-color-picker label="Theme Color" value="#3b82f6"></bp-color-picker>
```

### Disabled State

```html
<bp-color-picker disabled value="#3b82f6"></bp-color-picker>
```

### Form Integration

```html
<form>
  <bp-color-picker name="primary-color" value="#3b82f6"></bp-color-picker>
  <button type="submit">Save</button>
</form>
```

## API

### Properties

| Property      | Type              | Default     | Description                              |
| ------------- | ----------------- | ----------- | ---------------------------------------- |
| `value`       | `string`          | `'#000000'` | Current color value in specified format  |
| `format`      | `ColorFormat`     | `'hex'`     | Output format: `'hex'`, `'rgb'`, `'hsl'` |
| `alpha`       | `boolean`         | `true`      | Enable alpha channel                     |
| `swatches`    | `string[]`        | `[]`        | Predefined swatch colors                 |
| `inline`      | `boolean`         | `false`     | Render inline instead of popover         |
| `disabled`    | `boolean`         | `false`     | Disable all interactions                 |
| `readonly`    | `boolean`         | `false`     | Show value but prevent editing           |
| `size`        | `ColorPickerSize` | `'md'`      | Size: `'sm'`, `'md'`, `'lg'`             |
| `label`       | `string`          | `''`        | Accessible label shown in trigger        |
| `name`        | `string`          | `''`        | Form field name for submission           |
| `placeholder` | `string`          | `''`        | Placeholder text for trigger             |

### Events

| Event       | Detail              | Description                     |
| ----------- | ------------------- | ------------------------------- |
| `bp-change` | `{ value: string }` | Fired when color value changes  |
| `bp-input`  | `{ value: string }` | Fired on live input during drag |
| `bp-open`   | `undefined`         | Fired when popover opens        |
| `bp-close`  | `undefined`         | Fired when popover closes       |

### Slots

| Slot       | Description                     |
| ---------- | ------------------------------- |
| `trigger`  | Custom trigger element          |
| `swatches` | Custom swatch content           |
| `footer`   | Additional content below picker |

### CSS Parts

| Part           | Description                  |
| -------------- | ---------------------------- |
| `trigger`      | The trigger button           |
| `popover`      | The popover container        |
| `color-area`   | The 2D saturation/value area |
| `hue-slider`   | The vertical hue slider      |
| `alpha-slider` | The horizontal alpha slider  |
| `preview`      | The color preview swatch     |
| `input`        | Input fields (hex, rgb, hsl) |
| `swatches`     | The swatches container       |
| `swatch`       | Individual swatch buttons    |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Component background
- `--bp-color-surface-secondary` - Input backgrounds
- `--bp-color-text` - Text color
- `--bp-color-text-secondary` - Label text
- `--bp-color-border` - Border color
- `--bp-color-border-hover` - Border on hover
- `--bp-color-primary` - Focus ring color
- `--bp-font-family-sans` - Typography
- `--bp-font-size-xs` - Small text
- `--bp-font-size-sm` - Regular text
- `--bp-border-radius-sm` - Small border radius
- `--bp-border-radius-md` - Medium border radius
- `--bp-spacing-xs` - Extra small spacing
- `--bp-spacing-sm` - Small spacing
- `--bp-spacing-md` - Medium spacing
- `--bp-shadow-md` - Popover shadow

## Accessibility

- Trigger button has `aria-haspopup="dialog"` and `aria-expanded`
- Color area and sliders have `role="slider"` with `aria-valuenow`
- Swatches use `role="listbox"` and `role="option"`
- Full keyboard navigation with arrow keys
- Focus visible indicators on all interactive elements
- Tabindex properly managed for disabled state

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
