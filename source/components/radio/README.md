# Radio

A form radio input with label support and group functionality. Radio buttons allow users to select a single option from a group of mutually exclusive choices.

## Features

- Single selection within named groups
- Multiple sizes (sm, md, lg)
- Error state styling
- Form integration with ElementInternals API
- Keyboard navigation support
- ARIA attributes for accessibility
- Label support via default slot
- CSS Parts for custom styling

## Usage

```html
<!-- Basic radio group -->
<bp-radio name="color" value="red" checked>Red</bp-radio>
<bp-radio name="color" value="blue">Blue</bp-radio>
<bp-radio name="color" value="green">Green</bp-radio>

<!-- Different sizes -->
<bp-radio size="sm" name="size" value="small">Small</bp-radio>
<bp-radio size="md" name="size" value="medium">Medium</bp-radio>
<bp-radio size="lg" name="size" value="large">Large</bp-radio>

<!-- Error state -->
<bp-radio error name="choice" value="a">Option A</bp-radio>

<!-- Disabled state -->
<bp-radio disabled name="choice" value="b">Option B</bp-radio>

<!-- Required -->
<bp-radio required name="required" value="yes">I agree</bp-radio>
```

## API

### Properties

| Property   | Type                   | Default | Description                                                                                                        |
| ---------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `checked`  | `boolean`              | `false` | Whether the radio is checked.                                                                                      |
| `disabled` | `boolean`              | `false` | Whether the radio is disabled.                                                                                     |
| `required` | `boolean`              | `false` | Whether the radio is required.                                                                                     |
| `name`     | `string`               | `''`    | The name of the radio for form submission and grouping. Radios with the same name form a mutually exclusive group. |
| `value`    | `string`               | `''`    | The value of the radio for form submission.                                                                        |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | The size of the radio.                                                                                             |
| `error`    | `boolean`              | `false` | Whether the radio has an error state.                                                                              |

### Events

| Event       | Detail                                | Description                          |
| ----------- | ------------------------------------- | ------------------------------------ |
| `bp-change` | `{ checked: boolean, value: string }` | Fired when the checked state changes |
| `bp-focus`  | -                                     | Fired when the radio receives focus  |
| `bp-blur`   | -                                     | Fired when the radio loses focus     |

### Methods

| Method             | Parameters               | Returns   | Description                                             |
| ------------------ | ------------------------ | --------- | ------------------------------------------------------- |
| `focus()`          | `options?: FocusOptions` | `void`    | Sets focus on the radio                                 |
| `blur()`           | -                        | `void`    | Removes focus from the radio                            |
| `checkValidity()`  | -                        | `boolean` | Checks if the radio satisfies its required constraint   |
| `reportValidity()` | -                        | `boolean` | Checks validity and shows validation message if invalid |

### Slots

| Slot      | Description          |
| --------- | -------------------- |
| (default) | The radio label text |

### CSS Parts

| Part     | Description                    |
| -------- | ------------------------------ |
| `radio`  | The radio container            |
| `input`  | The native radio input element |
| `circle` | The visual circle indicator    |
| `label`  | The label text container       |

## Design Tokens Used

- `--bp-spacing-1` - Focus outline offset
- `--bp-spacing-4` - Small radio size
- `--bp-spacing-5` - Medium radio size
- `--bp-spacing-6` - Large radio size
- `--bp-spacing-sm` - Gap between radio and label
- `--bp-font-family-sans` - Font family
- `--bp-font-size-sm` - Small label font size
- `--bp-font-size-base` - Base and medium label font size
- `--bp-font-size-lg` - Large label font size
- `--bp-line-height-normal` - Label line height
- `--bp-color-text` - Label text color
- `--bp-color-text-inverse` - Inner circle color when checked
- `--bp-color-surface` - Radio background
- `--bp-color-surface-disabled` - Disabled radio background
- `--bp-color-border-strong` - Radio border color
- `--bp-color-primary` - Checked state and focus colors
- `--bp-color-error` - Error state color
- `--bp-border-width` - Radio border width
- `--bp-border-width-thick` - Focus outline width
- `--bp-border-radius-md` - Border radius (not used, radios are circular)
- `--bp-transition-fast` - Transition duration

## Accessibility

### ARIA Attributes

- `role="radio"` - Identifies the element as a radio button
- `aria-checked` - Reflects the checked state (`true` or `false`)
- `aria-disabled` - Reflects the disabled state
- `aria-required` - Present when the radio is required

### Keyboard Support

- **Click/Space**: When focused, toggles the radio (handled by native input)
- **Tab**: Moves focus to the next focusable element
- **Shift+Tab**: Moves focus to the previous focusable element

### Screen Reader Behavior

Screen readers will announce:

- The radio's label text from the default slot
- The current checked state
- Whether the radio is required
- Whether the radio is disabled

### Radio Groups

When multiple radios share the same `name` attribute, they form a mutually exclusive group. Selecting one radio will automatically deselect all other radios in the same group. This behavior is consistent with native radio buttons.
