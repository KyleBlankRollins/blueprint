# Multi-Select

A dropdown component for selecting multiple options with tag-based display of selected items.

## Features

- Multiple selection with visual tags
- Keyboard navigation (Arrow keys, Enter, Escape)
- Maximum selection limit support
- Clearable with "clear all" button
- Three size variants (sm, md, lg)
- Fully accessible with ARIA attributes
- Form integration with hidden inputs
- Customizable via CSS parts
- Click outside to close

## Usage

```html
<!-- Basic multi-select -->
<bp-multi-select placeholder="Select items">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</bp-multi-select>

<!-- With pre-selected values -->
<bp-multi-select .value=${['1', '2']} placeholder="Select items">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</bp-multi-select>

<!-- With maximum selections -->
<bp-multi-select maxSelections="3" placeholder="Choose up to 3">
  <option value="a">Item A</option>
  <option value="b">Item B</option>
  <option value="c">Item C</option>
  <option value="d">Item D</option>
</bp-multi-select>

<!-- Different sizes -->
<bp-multi-select size="sm" placeholder="Small">
  <option value="1">Option 1</option>
</bp-multi-select>

<bp-multi-select size="lg" placeholder="Large">
  <option value="1">Option 1</option>
</bp-multi-select>

<!-- Disabled state -->
<bp-multi-select disabled placeholder="Disabled">
  <option value="1">Option 1</option>
</bp-multi-select>

<!-- Without clear button -->
<bp-multi-select clearable="false">
  <option value="1">Option 1</option>
</bp-multi-select>

<!-- With validation states -->
<bp-multi-select variant="success" .value=${['1']}>
  <option value="1">Valid option</option>
</bp-multi-select>

<bp-multi-select variant="error">
  <option value="1">Required field</option>
</bp-multi-select>
```

## API

### Properties

| Property        | Type                 | Default            | Description                                                                       |
| --------------- | -------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `value`         | `string[]`           | `[]`               | The current selected values as an array                                           |
| `name`          | `string`             | `''`               | Name attribute for form submission                                                |
| `placeholder`   | `string`             | `'Select options'` | Placeholder text when no values are selected                                      |
| `disabled`      | `boolean`            | `false`            | Whether the multi-select is disabled                                              |
| `required`      | `boolean`            | `false`            | Whether the multi-select is required                                              |
| `size`          | `MultiSelectSize`    | `'md'`             | Size variant: `'sm'`, `'md'`, or `'lg'`                                           |
| `variant`       | `MultiSelectVariant` | `'default'`        | Validation variant: `'default'`, `'success'`, `'error'`, `'warning'`, or `'info'` |
| `maxSelections` | `number`             | `0`                | Maximum number of selections allowed (0 = unlimited)                              |
| `clearable`     | `boolean`            | `true`             | Whether to show a clear all button                                                |

### Events

| Event       | Detail                                         | Description                                           |
| ----------- | ---------------------------------------------- | ----------------------------------------------------- |
| `bp-change` | `{ value: string[], previousValue: string[] }` | Fired when the selection changes (select or deselect) |

### Slots

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| (default) | `<option>` elements representing available choices |

### CSS Parts

| Part              | Description                       |
| ----------------- | --------------------------------- |
| `control`         | The main control/trigger element  |
| `dropdown`        | The dropdown container            |
| `tag`             | Individual selected value tag     |
| `clear-button`    | The clear all button              |
| `indicator`       | The dropdown arrow indicator      |
| `option`          | Individual option in the dropdown |
| `option-selected` | Selected option state             |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Control and dropdown background
- `--bp-color-surface-elevated` - Hovered option background
- `--bp-color-surface-subdued` - Disabled background
- `--bp-color-text` - Text color
- `--bp-color-text-inverse` - Tag text color
- `--bp-color-text-muted` - Placeholder and indicator color
- `--bp-color-primary` - Tag background and selected options
- `--bp-color-primary-hover` - Hovered selected option
- `--bp-color-border` - Border color
- `--bp-color-border-strong` - Hover border color
- `--bp-color-focus` - Focus outline color
- `--bp-shadow-md` - Dropdown shadow

### Universal Tokens (Infrastructure)

- `--bp-font-family` - Typography
- `--bp-font-size-xs`, `--bp-font-size-sm`, `--bp-font-size-base`, `--bp-font-size-lg`, `--bp-font-size-xl` - Font sizes
- `--bp-spacing-0-5`, `--bp-spacing-2xs`, `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-md`, `--bp-spacing-4`, `--bp-spacing-5`, `--bp-spacing-8`, `--bp-spacing-10`, `--bp-spacing-12` - Spacing scale
- `--bp-border-radius` - Border roundness
- `--bp-border-width` - Border thickness
- `--bp-transition-fast` - Transition timing
- `--bp-z-dropdown` - Dropdown z-index

## Accessibility

- Uses `role="combobox"` on the control
- Uses `role="listbox"` with `aria-multiselectable="true"` on options container
- Manages `aria-expanded` state for dropdown visibility
- Sets `aria-disabled` when disabled
- Supports full keyboard navigation:
  - **Arrow Down/Up**: Navigate options and open dropdown
  - **Enter/Space**: Toggle selected option
  - **Escape**: Close dropdown
- Focus management with visible focus indicators
- Remove buttons have descriptive `aria-label` attributes

## Notes

- Selected values are stored as an array of strings in the `value` property
- Options are provided via slotted `<option>` elements (standard HTML)
- For form submission, hidden `<input>` elements are created for each selected value
- The dropdown closes automatically when clicking outside the component
- When `maxSelections` is set, attempting to select more items is prevented silently
- Tags can be removed individually by clicking the × button on each tag
- All selections can be cleared at once using the clear button (if `clearable` is true)
