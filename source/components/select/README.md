# Select

A custom dropdown select component that provides an accessible and styleable alternative to native select elements.

## Features

- Native-like select behavior with enhanced styling
- 3 size variants (sm, md, lg)
- Keyboard navigation support (Enter, Space, Escape, Arrow keys)
- Form integration with hidden native select
- ARIA-compliant for screen readers
- Customizable via CSS parts
- Fully accessible with focus management

## Usage

```html
<!-- Basic select -->
<bp-select>
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</bp-select>

<!-- With default value -->
<bp-select value="2">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</bp-select>

<!-- Different sizes -->
<bp-select size="sm">
  <option value="1">Small Select</option>
  <option value="2">Option 2</option>
</bp-select>

<bp-select size="lg">
  <option value="1">Large Select</option>
  <option value="2">Option 2</option>
</bp-select>

<!-- Disabled and required -->
<bp-select disabled>
  <option value="1">Disabled Select</option>
</bp-select>

<bp-select required>
  <option value="">Required Select</option>
  <option value="1">Option 1</option>
</bp-select>

<!-- Form integration -->
<form>
  <bp-select name="country" required>
    <option value="">Select your country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </bp-select>
</form>
```

## API

### Properties

| Property      | Type         | Default              | Description                                |
| ------------- | ------------ | -------------------- | ------------------------------------------ |
| `value`       | `string`     | `''`                 | The current value of the select            |
| `name`        | `string`     | `''`                 | Name attribute for form submission         |
| `placeholder` | `string`     | `'Select an option'` | Placeholder text when no value is selected |
| `disabled`    | `boolean`    | `false`              | Whether the select is disabled             |
| `required`    | `boolean`    | `false`              | Whether the select is required             |
| `size`        | `SelectSize` | `'md'`               | Size variant of the select                 |

**SelectSize:** `'sm' | 'md' | 'lg'`

### Events

| Event       | Detail                                                    | Description                  |
| ----------- | --------------------------------------------------------- | ---------------------------- |
| `bp-change` | `{ value: string, label: string, previousValue: string }` | Fired when selection changes |

### Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| (default) | `<option>` elements for the select |

### CSS Parts

| Part       | Description                   |
| ---------- | ----------------------------- |
| `select`   | The select container          |
| `trigger`  | The clickable trigger element |
| `value`    | The displayed value text      |
| `icon`     | The dropdown chevron icon     |
| `dropdown` | The dropdown menu container   |
| `option`   | Individual option elements    |

## Design Tokens Used

- **Colors:** `--bp-color-background`, `--bp-color-border`, `--bp-color-text`, `--bp-color-primary`, `--bp-gray-50`, `--bp-gray-100`, `--bp-blue-100`, `--bp-blue-200`
- **Spacing:** `--bp-spacing-2xs`, `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-md`, `--bp-spacing-lg`
- **Typography:** `--bp-font-family-sans`, `--bp-font-size-sm`, `--bp-font-size-base`, `--bp-font-size-lg`, `--bp-font-weight-medium`, `--bp-line-height-normal`
- **Borders:** `--bp-border-radius-md`, `--bp-border-width`
- **Shadows:** `--bp-shadow-md`
- **Transitions:** `--bp-transition-fast`
- **Z-index:** `--bp-z-dropdown`

## Accessibility

- Uses `role="combobox"` on trigger for screen readers
- Uses `role="listbox"` on dropdown menu
- Uses `role="option"` on each selectable item
- Includes `aria-expanded` to indicate dropdown state
- Includes `aria-disabled` when disabled
- Includes `aria-required` when required
- Includes `aria-selected` on selected options
- Keyboard navigation: Enter/Space to toggle, Escape to close, Arrow keys to open
- Hidden native `<select>` for form integration and assistive technology fallback
- Focus management with proper tabindex
- Automatically closes when clicking outside
