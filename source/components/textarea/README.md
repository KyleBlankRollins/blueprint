# Textarea

A multi-line text input component with validation states, resizing options, and comprehensive accessibility features.

## Features

- **5 variants**: default, success, error, warning, info
- **3 sizes**: small, medium, large
- **4 resize modes**: none, both, horizontal, vertical
- **Validation states**: Visual feedback with error/helper messages
- **Labels**: Optional label with required indicator
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
- **Disabled and readonly** states
- **Public methods**: focus(), blur(), select()
- **Character limits**: Support for minlength and maxlength
- **Spellcheck**: Configurable spellcheck support

## Usage

```html
<!-- Basic textarea -->
<bp-textarea label="Comment" placeholder="Enter your comment"></bp-textarea>

<!-- With validation state -->
<bp-textarea
  variant="error"
  label="Description"
  errorMessage="Description must be at least 10 characters"
  minlength="10"
  required
></bp-textarea>

<!-- Success state -->
<bp-textarea
  variant="success"
  label="Feedback"
  value="Great work!"
  helperText="Thank you for your feedback"
></bp-textarea>

<!-- Different sizes -->
<bp-textarea size="sm" placeholder="Small textarea"></bp-textarea>
<bp-textarea size="md" placeholder="Medium textarea"></bp-textarea>
<bp-textarea size="lg" placeholder="Large textarea"></bp-textarea>

<!-- Resize options -->
<bp-textarea resize="none" label="No resize"></bp-textarea>
<bp-textarea resize="vertical" label="Vertical resize only"></bp-textarea>
<bp-textarea resize="horizontal" label="Horizontal resize only"></bp-textarea>
<bp-textarea resize="both" label="Both directions"></bp-textarea>

<!-- Custom rows and columns -->
<bp-textarea rows="8" cols="60" label="Custom dimensions"></bp-textarea>

<!-- With character limit -->
<bp-textarea
  label="Bio"
  maxlength="500"
  helperText="Maximum 500 characters"
></bp-textarea>
```

## API

### Properties

| Property       | Type                                                       | Default      | Description                                   |
| -------------- | ---------------------------------------------------------- | ------------ | --------------------------------------------- |
| `variant`      | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'`  | Visual variant (affects border color)         |
| `size`         | `'sm' \| 'md' \| 'lg'`                                     | `'md'`       | Textarea size                                 |
| `value`        | `string`                                                   | `''`         | Textarea value                                |
| `placeholder`  | `string`                                                   | `undefined`  | Placeholder text                              |
| `label`        | `string`                                                   | `undefined`  | Label text (optional)                         |
| `helperText`   | `string`                                                   | `undefined`  | Helper text below textarea                    |
| `errorMessage` | `string`                                                   | `undefined`  | Error message (shown when variant is 'error') |
| `disabled`     | `boolean`                                                  | `false`      | Whether textarea is disabled                  |
| `required`     | `boolean`                                                  | `false`      | Whether textarea is required (shows asterisk) |
| `readonly`     | `boolean`                                                  | `false`      | Whether textarea is readonly                  |
| `name`         | `string`                                                   | `undefined`  | Form textarea name                            |
| `rows`         | `number`                                                   | `undefined`  | Number of visible text rows                   |
| `cols`         | `number`                                                   | `undefined`  | Number of visible text columns                |
| `maxlength`    | `number`                                                   | `undefined`  | Maximum number of characters                  |
| `minlength`    | `number`                                                   | `undefined`  | Minimum number of characters                  |
| `resize`       | `'none' \| 'both' \| 'horizontal' \| 'vertical'`           | `'vertical'` | How the textarea can be resized               |
| `autocomplete` | `string`                                                   | `undefined`  | Autocomplete attribute                        |
| `spellcheck`   | `boolean`                                                  | `true`       | Whether to enable spellcheck                  |
| `wrap`         | `'soft' \| 'hard'`                                         | `undefined`  | Text wrapping behavior                        |

### Events

| Event       | Detail                                         | Description                        |
| ----------- | ---------------------------------------------- | ---------------------------------- |
| `bp-input`  | `{ value: string, originalEvent: InputEvent }` | Fired on every input change        |
| `bp-change` | `{ value: string, originalEvent: Event }`      | Fired when textarea loses focus    |
| `bp-focus`  | `{ originalEvent: FocusEvent }`                | Fired when textarea receives focus |
| `bp-blur`   | `{ originalEvent: FocusEvent }`                | Fired when textarea loses focus    |

### Public Methods

| Method     | Description                      |
| ---------- | -------------------------------- |
| `focus()`  | Focuses the textarea element     |
| `blur()`   | Blurs the textarea element       |
| `select()` | Selects all text in the textarea |

### CSS Parts

| Part       | Description                 |
| ---------- | --------------------------- |
| `textarea` | The native textarea element |

## Design Tokens Used

**Colors:**

- `--bp-color-text` - Textarea text color
- `--bp-color-text-muted` - Placeholder and helper text
- `--bp-color-background` - Textarea background
- `--bp-color-surface` - Readonly background
- `--bp-color-surface-subdued` - Disabled background
- `--bp-color-border` - Default border
- `--bp-color-border-strong` - Hover border
- `--bp-color-focus` - Focus border and ring
- `--bp-color-success` - Success variant border
- `--bp-color-error` - Error variant border and error message
- `--bp-color-warning` - Warning variant border
- `--bp-color-info` - Info variant border

**Spacing:**

- `--bp-spacing-xs` - Small padding, label gap
- `--bp-spacing-sm` - Small/medium textarea padding
- `--bp-spacing-md` - Medium/large textarea padding
- `--bp-spacing-lg` - Large textarea padding
- `--bp-spacing-16` - Small textarea min-height (64px)
- `--bp-spacing-20` - Medium textarea min-height (80px)
- `--bp-spacing-24` - Large textarea min-height (96px)

**Typography:**

- `--bp-font-family` - Font family
- `--bp-font-size-sm` - Small textarea, labels, messages
- `--bp-font-size-base` - Medium textarea
- `--bp-font-size-lg` - Large textarea
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
- **Keyboard support**: Native textarea keyboard behavior (tab, arrow keys, etc.)
- **Focus management**: Clear focus indicators with customizable focus rings
- **Screen reader friendly**: Descriptive labels, linked messages, semantic HTML
