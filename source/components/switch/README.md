# Switch

A toggle switch component for binary on/off states with form integration and comprehensive accessibility support.

## Features

- **Form integration** - Participates in form submission with ElementInternals API
- **Binary states** - Clear on/off toggle for settings and preferences
- **Size variants** - Small, medium, and large sizes
- **Error state** - Visual error indication for validation
- **Keyboard accessible** - Full keyboard navigation support
- **Custom events** - Emits bp-change, bp-focus, and bp-blur events
- **Design token integration** - Uses Blueprint theme tokens
- **CSS Parts** - Exposed parts for custom styling

## Usage

### Basic switch

```html
<bp-switch>Enable notifications</bp-switch>
```

### Checked state

```html
<bp-switch checked>Dark mode enabled</bp-switch>
```

### Sizes

```html
<bp-switch size="sm">Small switch</bp-switch>
<bp-switch size="md">Medium switch (default)</bp-switch>
<bp-switch size="lg">Large switch</bp-switch>
```

### Disabled state

```html
<bp-switch disabled>Disabled switch (off)</bp-switch>
<bp-switch checked disabled>Disabled switch (on)</bp-switch>
```

### Error state

```html
<bp-switch error required>You must enable this option</bp-switch>
```

### Form integration

```html
<form>
  <bp-switch name="newsletter" value="yes" checked>
    Subscribe to newsletter
  </bp-switch>

  <bp-switch name="notifications" value="enabled">
    Enable notifications
  </bp-switch>

  <button type="submit">Save</button>
</form>
```

### Settings panel

```html
<fieldset>
  <legend>Privacy Settings</legend>
  <bp-switch name="profile-public" checked>Make profile public</bp-switch>
  <bp-switch name="show-email">Show email address</bp-switch>
  <bp-switch name="allow-messages" checked>Allow direct messages</bp-switch>
</fieldset>
```

### With description

```html
<div>
  <bp-switch checked>Enable two-factor authentication</bp-switch>
  <p>Add an extra layer of security to your account</p>
</div>
```

### Event handling

```html
<bp-switch @bp-change="${(e) => console.log('Checked:', e.detail.checked)}">
  Toggle me
</bp-switch>
```

## API

### Properties

| Property   | Type                   | Default | Description                              |
| ---------- | ---------------------- | ------- | ---------------------------------------- |
| `checked`  | `boolean`              | `false` | Whether the switch is in the on position |
| `disabled` | `boolean`              | `false` | Whether the switch is disabled           |
| `required` | `boolean`              | `false` | Whether the switch is required           |
| `name`     | `string`               | `''`    | The name for form submission             |
| `value`    | `string`               | `'on'`  | The value for form submission            |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | The size of the switch                   |
| `error`    | `boolean`              | `false` | Whether the switch has an error state    |

### Events

| Event       | Detail                 | Description                          |
| ----------- | ---------------------- | ------------------------------------ |
| `bp-change` | `{ checked: boolean }` | Fired when the checked state changes |
| `bp-focus`  | -                      | Fired when the switch receives focus |
| `bp-blur`   | -                      | Fired when the switch loses focus    |

### Methods

| Method            | Parameters                  | Description                   |
| ----------------- | --------------------------- | ----------------------------- |
| `focus(options?)` | `FocusOptions \| undefined` | Sets focus on the switch      |
| `blur()`          | -                           | Removes focus from the switch |

### Slots

| Slot      | Description           |
| --------- | --------------------- |
| (default) | The switch label text |

### CSS Parts

| Part     | Description                       |
| -------- | --------------------------------- |
| `switch` | The switch container (label)      |
| `input`  | The native checkbox input element |
| `track`  | The switch track background       |
| `thumb`  | The switch thumb/handle           |
| `label`  | The label text container          |

## Design Tokens Used

**Layout:**

- `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-2xs`
- `--bp-spacing-4`, `--bp-spacing-5`, `--bp-spacing-6`, `--bp-spacing-7`
- `--bp-spacing-9`, `--bp-spacing-10`, `--bp-spacing-12`

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-size-base`
- `--bp-line-height-normal`

**Colors:**

- `--bp-color-text`, `--bp-color-text-inverse`
- `--bp-color-surface`
- `--bp-color-border-strong`
- `--bp-color-primary`, `--bp-color-primary-hover`
- `--bp-color-focus`
- `--bp-color-error`

**Effects:**

- `--bp-border-width`
- `--bp-shadow-sm`
- `--bp-transition-fast`

## Accessibility

- **Semantic HTML** - Uses native `<input type="checkbox">` element with role="switch" semantics
- **ARIA attributes** - `aria-checked` properly reflects on/off state
- **Keyboard navigation** - Full support for Space to toggle, Tab to navigate
- **Focus indicators** - Clear visual focus outline
- **Label association** - Clicking label toggles switch
- **Screen reader support** - Properly announces state changes
- **Form integration** - Works with native form submission and validation

### Best Practices

1. **Use for binary settings** - Switches are for on/off states, use checkboxes for selections
2. **Provide clear labels** - Use the default slot to describe what the switch controls
3. **Immediate effect** - Switches should take effect immediately without requiring a submit button
4. **Group related switches** - Use `<fieldset>` and `<legend>` for related settings
5. **Show current state** - The switch visual should clearly indicate on vs off
6. **Add descriptions when needed** - Provide context for what enabling/disabling does

### When to use Switch vs Checkbox

**Use Switch when:**

- The change takes effect immediately (e.g., "Enable dark mode")
- Toggling a system state or preference
- The action is reversible
- You're turning a feature on or off

**Use Checkbox when:**

- Multiple items can be selected
- The selection is part of a form that requires submission
- You're making a choice or agreement (e.g., "I accept the terms")
- The selection doesn't take immediate effect

### Example: Accessible settings panel

```html
<fieldset>
  <legend>Notification Preferences</legend>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <bp-switch name="email-notifications" checked>
        Email notifications
      </bp-switch>
      <p style="font-size: 14px; opacity: 0.7;">
        Receive updates and announcements via email
      </p>
    </div>

    <div>
      <bp-switch name="push-notifications" error required>
        Push notifications (required)
      </bp-switch>
      <p style="font-size: 14px; color: var(--bp-color-error);">
        At least one notification method must be enabled
      </p>
    </div>

    <div>
      <bp-switch name="sms-notifications"> SMS notifications </bp-switch>
      <p style="font-size: 14px; opacity: 0.7;">
        Get important alerts via text message
      </p>
    </div>
  </div>
</fieldset>
```
