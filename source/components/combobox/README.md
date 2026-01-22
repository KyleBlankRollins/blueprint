# bp-combobox

A searchable dropdown with autocomplete functionality, allowing users to filter options by typing and optionally enter custom values.

## Features

- ✅ **Search & Filter** - Type to instantly filter available options
- ✅ **Keyboard Navigation** - Full arrow key, Enter, and Escape support
- ✅ **Custom Values** - Optionally allow free-form input with `allowCustomValue`
- ✅ **Clear Button** - Quick value clearing when input has content
- ✅ **Accessibility** - ARIA attributes, keyboard navigation, screen reader support
- ✅ **Form Integration** - Works seamlessly with standard HTML forms
- ✅ **Size Variants** - Small, medium (default), and large sizes
- ✅ **Design Tokens** - Fully themeable using CSS custom properties

## Usage

### Basic Combobox

```html
<bp-combobox placeholder="Select a fruit">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
</bp-combobox>
```

### With Custom Values

```html
<bp-combobox placeholder="Type or select" allowCustomValue>
  <option value="preset1">Preset Option 1</option>
  <option value="preset2">Preset Option 2</option>
</bp-combobox>
```

### Different Sizes

```html
<bp-combobox size="small" placeholder="Small combobox"></bp-combobox>
<bp-combobox size="medium" placeholder="Medium combobox"></bp-combobox>
<bp-combobox size="large" placeholder="Large combobox"></bp-combobox>
```

### In Forms

```html
<form>
  <bp-combobox name="country" required placeholder="Select your country">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </bp-combobox>
  <button type="submit">Submit</button>
</form>
```

### With Validation States

```html
<bp-combobox variant="success" .value="${validValue}">
  <option value="valid">Valid Option</option>
</bp-combobox>

<bp-combobox variant="error" placeholder="Required field">
  <option value="1">Option 1</option>
</bp-combobox>
```

### Listening to Changes

```javascript
const combobox = document.querySelector('bp-combobox');
combobox.addEventListener('bp-change', (e) => {
  console.log('Selected:', e.detail.value);
  console.log('Label:', e.detail.label);
  console.log('Previous:', e.detail.previousValue);
});
```

## API

### Properties

| Property           | Type                             | Default                 | Description                                                                       |
| ------------------ | -------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `value`            | `string`                         | `''`                    | The current value of the combobox                                                 |
| `name`             | `string`                         | `''`                    | Name attribute for form submission                                                |
| `placeholder`      | `string`                         | `'Search or select...'` | Placeholder text when no value is selected                                        |
| `disabled`         | `boolean`                        | `false`                 | Whether the combobox is disabled                                                  |
| `required`         | `boolean`                        | `false`                 | Whether the combobox is required                                                  |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'`              | Size variant of the combobox                                                      |
| `variant`          | `ComboboxVariant`                | `'default'`             | Validation variant: `'default'`, `'success'`, `'error'`, `'warning'`, or `'info'` |
| `allowCustomValue` | `boolean`                        | `false`                 | Whether to allow free-form input (not just from the options list)                 |

### Events

| Event       | Detail                                                    | Description                  |
| ----------- | --------------------------------------------------------- | ---------------------------- |
| `bp-change` | `{ value: string, label: string, previousValue: string }` | Fired when the value changes |

### Slots

| Name      | Description                               |
| --------- | ----------------------------------------- |
| (default) | `<option>` elements for available choices |

### CSS Parts

| Part           | Description                          |
| -------------- | ------------------------------------ |
| `control`      | The outer container                  |
| `input`        | The text input field                 |
| `dropdown`     | The dropdown container               |
| `options`      | The options list container           |
| `option`       | Individual option element            |
| `clear-button` | The clear button (when value exists) |
| `indicator`    | The dropdown indicator icon          |

### Keyboard Shortcuts

| Key         | Action                                    |
| ----------- | ----------------------------------------- |
| `ArrowDown` | Open dropdown and navigate down           |
| `ArrowUp`   | Navigate up through options               |
| `Enter`     | Select focused option                     |
| `Escape`    | Close dropdown and restore previous value |
| `Tab`       | Close dropdown and move to next field     |

## Design Tokens Used

**Colors:**

- `--bp-color-border`
- `--bp-color-border-hover`
- `--bp-color-focus`
- `--bp-color-surface`
- `--bp-color-text`
- `--bp-color-text-muted`
- `--bp-color-primary`
- `--bp-color-primary-hover`

**Spacing:**

- `--bp-spacing-xs`
- `--bp-spacing-sm`
- `--bp-spacing-md`
- `--bp-spacing-lg`

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-size-xs`
- `--bp-font-size-sm`
- `--bp-font-size-base`
- `--bp-font-size-lg`
- `--bp-font-size-xl`

**Effects:**

- `--bp-border-width`
- `--bp-border-radius-sm`
- `--bp-border-radius-md`
- `--bp-shadow-md`
- `--bp-transition-fast`
- `--bp-z-dropdown`

## Accessibility

- Uses `role="combobox"` and `aria-haspopup="listbox"` for proper semantics
- `aria-expanded` reflects dropdown state
- `aria-autocomplete="list"` indicates filtering behavior
- `aria-disabled` when disabled
- Full keyboard navigation support
- Clear button has descriptive `aria-label`
- Options container uses `role="listbox"`
- Focused option indicated with visual styles and CSS classes
