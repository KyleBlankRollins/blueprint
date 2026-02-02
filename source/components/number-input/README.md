# Number Input

A number input component with increment/decrement buttons for precise numeric value entry.

## Features

- **Increment/decrement buttons** - Click to adjust value by step
- **Keyboard navigation** - Arrow keys, Home/End, PageUp/PageDown
- **Min/max constraints** - Automatically clamps values to range
- **Step increment** - Configurable step size for precise control
- **Precision formatting** - Display fixed decimal places
- **Validation variants** - Success, error, warning states
- **Size variants** - sm, md, and lg sizes
- **Optional buttons** - Hide buttons for manual input only
- **Form integration** - Works with native form submission
- **Accessibility** - Full ARIA support and keyboard navigation

## Usage

```html
<!-- Basic number input -->
<bp-number-input value="10"></bp-number-input>

<!-- With label and range -->
<bp-number-input label="Quantity" value="1" min="0" max="100"></bp-number-input>

<!-- With step and precision -->
<bp-number-input
  label="Price"
  value="9.99"
  step="0.01"
  precision="2"
></bp-number-input>

<!-- Error variant with message -->
<bp-number-input
  label="Amount"
  variant="error"
  message="Please enter a valid amount"
></bp-number-input>

<!-- Without buttons -->
<bp-number-input label="Enter value" hide-buttons></bp-number-input>
```

## API

### Properties

| Property      | Type                                             | Default     | Description                               |
| ------------- | ------------------------------------------------ | ----------- | ----------------------------------------- |
| `value`       | `number \| null`                                 | `null`      | Current value of the input                |
| `min`         | `number \| undefined`                            | `undefined` | Minimum allowed value                     |
| `max`         | `number \| undefined`                            | `undefined` | Maximum allowed value                     |
| `step`        | `number`                                         | `1`         | Step increment for buttons and arrow keys |
| `name`        | `string`                                         | `''`        | Name attribute for form association       |
| `label`       | `string`                                         | `''`        | Label text for the input                  |
| `placeholder` | `string`                                         | `''`        | Placeholder text when empty               |
| `disabled`    | `boolean`                                        | `false`     | Whether the input is disabled             |
| `required`    | `boolean`                                        | `false`     | Whether the input is required             |
| `readonly`    | `boolean`                                        | `false`     | Whether the input is readonly             |
| `size`        | `'sm' \| 'md' \| 'lg'`                           | `'md'`      | Size variant                              |
| `variant`     | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` | Validation variant                        |
| `message`     | `string`                                         | `''`        | Help or error message to display          |
| `precision`   | `number \| undefined`                            | `undefined` | Number of decimal places to display       |
| `hideButtons` | `boolean`                                        | `false`     | Hide the increment/decrement buttons      |

### Events

| Event       | Detail              | Description                                   |
| ----------- | ------------------- | --------------------------------------------- |
| `bp-input`  | `{ value: number }` | Fired when the value changes during input     |
| `bp-change` | `{ value: number }` | Fired when the value changes (on blur/button) |

### CSS Parts

| Part        | Description                    |
| ----------- | ------------------------------ |
| `input`     | The native input element       |
| `increment` | The increment (+) button       |
| `decrement` | The decrement (−) button       |
| `label`     | The label element              |
| `message`   | The help/error message element |

### Keyboard Navigation

| Key         | Action                            |
| ----------- | --------------------------------- |
| `ArrowUp`   | Increase value by step            |
| `ArrowDown` | Decrease value by step            |
| `PageUp`    | Increase value by step × 10       |
| `PageDown`  | Decrease value by step × 10       |
| `Home`      | Set to minimum value (if defined) |
| `End`       | Set to maximum value (if defined) |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-background` - Input background
- `--bp-color-surface` - Button background
- `--bp-color-surface-elevated` - Button hover background
- `--bp-color-surface-subdued` - Disabled/readonly background
- `--bp-color-text` - Label and input text color
- `--bp-color-text-muted` - Placeholder and message color
- `--bp-color-border` - Default border color
- `--bp-color-border-strong` - Hover border color
- `--bp-color-focus` - Focus ring color
- `--bp-color-error` - Error variant color
- `--bp-color-success` - Success variant color
- `--bp-color-warning` - Warning variant color
- `--bp-font-family` - Typography

### Universal Tokens (Infrastructure)

- `--bp-spacing-*` - Padding/margins
- `--bp-font-size-*` - Text sizes
- `--bp-font-weight-*` - Font weights
- `--bp-line-height-normal` - Line spacing
- `--bp-border-width` - Border width
- `--bp-border-radius-md` - Border roundness
- `--bp-transition-fast` - Animations
- `--bp-focus-offset` - Focus ring offset
- `--bp-opacity-disabled` - Disabled opacity
- `--bp-opacity-subtle` - Placeholder opacity

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- **ARIA attributes** - `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-invalid`
- **Keyboard support** - Full navigation with arrow keys, Home/End, PageUp/PageDown
- **Button labels** - Increment/decrement buttons have descriptive `aria-label`
- **Required indicator** - Visual asterisk and `required` attribute for form validation
- **Focus management** - Visible focus indicators on input and buttons
