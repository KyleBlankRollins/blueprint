# Checkbox

A form checkbox input component with label support, indeterminate state, and comprehensive form integration.

## Features

- **Form integration** - Participates in form submission with ElementInternals API
- **Three states** - Unchecked, checked, and indeterminate (partial selection)
- **Size variants** - Small, medium, and large sizes
- **Error state** - Visual error indication for validation
- **Keyboard accessible** - Full keyboard navigation support
- **Custom events** - Emits bp-change, bp-focus, and bp-blur events
- **Design token integration** - Uses Blueprint theme tokens
- **CSS Parts** - Exposed parts for custom styling

## Usage

### Basic checkbox

```html
<bp-checkbox>Accept terms and conditions</bp-checkbox>
```

### Checked state

```html
<bp-checkbox checked>Subscribe to newsletter</bp-checkbox>
```

### Indeterminate state

```html
<bp-checkbox indeterminate>Select all (partial)</bp-checkbox>
```

### Sizes

```html
<bp-checkbox size="sm">Small checkbox</bp-checkbox>
<bp-checkbox size="md">Medium checkbox (default)</bp-checkbox>
<bp-checkbox size="lg">Large checkbox</bp-checkbox>
```

### Disabled state

```html
<bp-checkbox disabled>Disabled checkbox</bp-checkbox>
<bp-checkbox checked disabled>Disabled checked</bp-checkbox>
```

### Error state

```html
<bp-checkbox error required>You must accept to continue</bp-checkbox>
```

### Form integration

```html
<form>
  <bp-checkbox name="newsletter" value="yes" checked>
    Subscribe to newsletter
  </bp-checkbox>

  <bp-checkbox name="notifications" value="enabled">
    Enable notifications
  </bp-checkbox>

  <button type="submit">Submit</button>
</form>
```

### Checkbox group

```html
<fieldset>
  <legend>Select your interests</legend>
  <bp-checkbox name="interests" value="design">Design</bp-checkbox>
  <bp-checkbox name="interests" value="development">Development</bp-checkbox>
  <bp-checkbox name="interests" value="marketing">Marketing</bp-checkbox>
</fieldset>
```

### Event handling

```html
<bp-checkbox @bp-change="${(e) => console.log('Checked:', e.detail.checked)}">
  Notify me
</bp-checkbox>
```

## API

### Properties

| Property        | Type                   | Default | Description                                       |
| --------------- | ---------------------- | ------- | ------------------------------------------------- |
| `checked`       | `boolean`              | `false` | Whether the checkbox is checked                   |
| `indeterminate` | `boolean`              | `false` | Whether the checkbox is in an indeterminate state |
| `disabled`      | `boolean`              | `false` | Whether the checkbox is disabled                  |
| `required`      | `boolean`              | `false` | Whether the checkbox is required                  |
| `name`          | `string`               | `''`    | The name for form submission                      |
| `value`         | `string`               | `'on'`  | The value for form submission                     |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`  | The size of the checkbox                          |
| `error`         | `boolean`              | `false` | Whether the checkbox has an error state           |

### Events

| Event       | Detail                 | Description                            |
| ----------- | ---------------------- | -------------------------------------- |
| `bp-change` | `{ checked: boolean }` | Fired when the checked state changes   |
| `bp-focus`  | -                      | Fired when the checkbox receives focus |
| `bp-blur`   | -                      | Fired when the checkbox loses focus    |

### Methods

| Method            | Parameters                  | Description                     |
| ----------------- | --------------------------- | ------------------------------- |
| `focus(options?)` | `FocusOptions \| undefined` | Sets focus on the checkbox      |
| `blur()`          | -                           | Removes focus from the checkbox |

### Slots

| Slot      | Description             |
| --------- | ----------------------- |
| (default) | The checkbox label text |

### CSS Parts

| Part        | Description                       |
| ----------- | --------------------------------- |
| `checkbox`  | The checkbox container (label)    |
| `input`     | The native checkbox input element |
| `checkmark` | The visual checkmark indicator    |
| `label`     | The label text container          |

## Design Tokens Used

**Layout:**

- `--bp-spacing-sm`, `--bp-spacing-4`, `--bp-spacing-5`, `--bp-spacing-6`

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-size-sm`, `--bp-font-size-base`, `--bp-font-size-lg`
- `--bp-line-height-normal`

**Colors:**

- `--bp-color-text`, `--bp-color-text-inverse`
- `--bp-color-surface`
- `--bp-color-border-strong`
- `--bp-color-primary`, `--bp-color-primary-hover`
- `--bp-color-focus`
- `--bp-color-error`

**Borders & Effects:**

- `--bp-border-width`
- `--bp-border-radius-sm`
- `--bp-transition-fast`

## Accessibility

- **Semantic HTML** - Uses native `<input type="checkbox">` element
- **ARIA attributes** - `aria-checked` reflects state including indeterminate ("mixed")
- **Keyboard navigation** - Full support for Space to toggle, Tab to navigate
- **Focus indicators** - Clear visual focus outline
- **Label association** - Clicking label toggles checkbox
- **Screen reader support** - Properly announces state changes
- **Form integration** - Works with native form submission and validation

### Best Practices

1. **Always provide a label** - Use the default slot to describe what the checkbox controls
2. **Use indeterminate for parent selections** - Show partial selection in hierarchies
3. **Provide clear error messages** - Use `error` prop with descriptive text nearby
4. **Group related checkboxes** - Use `<fieldset>` and `<legend>` for checkbox groups
5. **Don't use for exclusive selections** - Use radio buttons when only one option can be selected
6. **Make clickable area large** - The entire label is clickable, not just the box

### Example: Accessible checkbox group

```html
<fieldset>
  <legend>Notification preferences</legend>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <bp-checkbox name="notifications" value="email" checked>
      Email notifications
    </bp-checkbox>
    <bp-checkbox name="notifications" value="sms">
      SMS notifications
    </bp-checkbox>
    <bp-checkbox name="notifications" value="push" error required>
      Push notifications (required)
    </bp-checkbox>
  </div>
  <p style="color: var(--bp-color-error);">
    Please enable at least one notification method
  </p>
</fieldset>
```
