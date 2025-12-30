# Input

A form input component with validation states, sizes, and comprehensive accessibility features.

## Features

- **5 variants**: default, success, error, warning, info
- **3 sizes**: small, medium, large
- **Validation states**: Visual feedback with error/helper messages
- **Labels**: Optional label with required indicator
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
- **Multiple input types**: text, email, password, number, tel, url, search
- **Disabled and readonly** states
- **Public methods**: focus(), blur(), select()

## Usage

```html
<!-- Basic input -->
<bp-input label="Email" placeholder="Enter your email"></bp-input>

<!-- With validation state -->
<bp-input
  variant="error"
  label="Password"
  type="password"
  errorMessage="Password must be at least 8 characters"
  required
></bp-input>

<!-- Success state -->
<bp-input
  variant="success"
  label="Username"
  value="john_doe"
  helperText="Username is available"
></bp-input>

<!-- Different sizes -->
<bp-input size="sm" placeholder="Small input"></bp-input>
<bp-input size="md" placeholder="Medium input"></bp-input>
<bp-input size="lg" placeholder="Large input"></bp-input>
```

## API

### Properties

| Property       | Type                                                          | Default     | Description                                   |
| -------------- | ------------------------------------------------------------- | ----------- | --------------------------------------------- |
| `variant`      | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'`    | `'default'` | Visual variant (affects border color)         |
| `size`         | `'sm' \| 'md' \| 'lg'`                                        | `'md'`      | Input size                                    |
| `type`         | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| ...` | `'text'`    | Native input type                             |
| `value`        | `string`                                                      | `''`        | Input value                                   |
| `placeholder`  | `string`                                                      | `''`        | Placeholder text                              |
| `label`        | `string`                                                      | `''`        | Label text (optional)                         |
| `helperText`   | `string`                                                      | `''`        | Helper text below input                       |
| `errorMessage` | `string`                                                      | `''`        | Error message (shown when variant is 'error') |
| `disabled`     | `boolean`                                                     | `false`     | Whether input is disabled                     |
| `required`     | `boolean`                                                     | `false`     | Whether input is required (shows asterisk)    |
| `readonly`     | `boolean`                                                     | `false`     | Whether input is readonly                     |
| `name`         | `string`                                                      | `''`        | Form input name                               |
| `autocomplete` | `string`                                                      | `''`        | Autocomplete attribute                        |

### Events

| Event       | Detail                                         | Description                     |
| ----------- | ---------------------------------------------- | ------------------------------- |
| `bp-input`  | `{ value: string, originalEvent: InputEvent }` | Fired on every input change     |
| `bp-change` | `{ value: string, originalEvent: Event }`      | Fired when input loses focus    |
| `bp-focus`  | `{ originalEvent: FocusEvent }`                | Fired when input receives focus |
| `bp-blur`   | `{ originalEvent: FocusEvent }`                | Fired when input loses focus    |

### Public Methods

| Method     | Description                   |
| ---------- | ----------------------------- |
| `focus()`  | Focuses the input element     |
| `blur()`   | Blurs the input element       |
| `select()` | Selects all text in the input |

### CSS Parts

| Part    | Description              |
| ------- | ------------------------ |
| `input` | The native input element |

## Design Tokens Used

**Colors:**

- `--bp-color-text` - Input text color
- `--bp-color-text-muted` - Placeholder and helper text
- `--bp-color-background` - Input background
- `--bp-color-surface` - Readonly background
- `--bp-color-surface-subdued` - Disabled background
- `--bp-color-border` - Default border
- `--bp-color-border-strong` - Hover border
- `--bp-color-focus` - Focus border and ring
- `--bp-color-primary` - (for focus when default variant)
- `--bp-color-success` - Success variant border
- `--bp-color-error` - Error variant border and error message
- `--bp-color-warning` - Warning variant border
- `--bp-color-info` - Info variant border

**Spacing:**

- `--bp-spacing-xs` - Small padding, label gap
- `--bp-spacing-sm` - Small/medium input padding
- `--bp-spacing-md` - Medium/large input padding
- `--bp-spacing-lg` - Large input padding

**Typography:**

- `--bp-font-family-sans` - Font family
- `--bp-font-size-sm` - Small input, labels, messages
- `--bp-font-size-base` - Medium input
- `--bp-font-size-lg` - Large input
- `--bp-font-weight-medium` - Label weight
- `--bp-line-height-normal` - Line height

**Other:**

- `--bp-border-radius-md` - Corner rounding
- `--bp-border-width` - Border thickness
- `--bp-focus-offset` - Focus ring offset
- `--bp-transition-fast` - Transition duration
- `--bp-opacity-disabled` - Disabled opacity
- `--bp-opacity-subtle` - Placeholder opacity

## Accessibility

- **ARIA attributes**: `aria-invalid`, `aria-describedby` link error/helper messages
- **Labels**: Proper `<label for="...">` association
- **Required indicator**: Visual asterisk when `required` prop is true
- **Error announcements**: Error messages have `role="alert"` for screen readers
- **Keyboard support**: Native input keyboard behavior (tab, arrow keys, etc.)
- **Focus management**: Clear focus indicators with customizable focus rings
- **Screen reader friendly**: Descriptive labels, linked messages, semantic HTML
