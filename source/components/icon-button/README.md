# Icon Button

A square button that shows only an icon, for compact actions like close, edit, delete or settings. Because there is no visible text, `label` is required: it becomes the button's accessible name.

## Usage

```html
<!-- Ghost by default: no fill until hovered -->
<bp-icon-button icon="cross" label="Close"></bp-icon-button>

<!-- Outlined and filled -->
<bp-icon-button
  icon="trash"
  label="Delete row"
  variant="secondary"
></bp-icon-button>
<bp-icon-button
  icon="plus"
  label="Add item"
  variant="primary"
  shape="circle"
></bp-icon-button>

<!-- A custom icon -->
<bp-icon-button label="Blueprint">
  <svg viewBox="0 0 21 21" fill="none" stroke="currentColor">…</svg>
</bp-icon-button>

<!-- Show the label to sighted users too -->
<bp-tooltip content="Copy link">
  <bp-icon-button icon="link" label="Copy link"></bp-icon-button>
</bp-tooltip>
```

## When to use

- Use an icon button only for actions whose icon is widely understood (close, delete, edit, settings, more) or that repeat in a dense layout like a table row or toolbar.
- When the meaning isn't obvious, use `<bp-button>` with text, or wrap the icon button in `<bp-tooltip>` with the same words as the label.
- Write the label as the action, not the icon: "Delete row", not "Trash can".

## API

### Properties

| Property   | Type                                                                                 | Default    | Description                                                       |
| ---------- | ------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------- |
| `icon`     | `IconName`                                                                           | `''`       | Name of a built-in icon. When empty, the default slot is used.    |
| `label`    | `string`                                                                             | `''`       | **Required.** Accessible name. Warns in the console when missing. |
| `variant`  | `'ghost' \| 'secondary' \| 'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'ghost'`  | Visual style.                                                     |
| `size`     | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`     | Square of 32, 40 or 48px, with a 16, 20 or 24px icon.             |
| `shape`    | `'square' \| 'circle'`                                                               | `'square'` | Corner shape.                                                     |
| `disabled` | `boolean`                                                                            | `false`    | Disables the button. A disabled button never fires `bp-click`.    |
| `type`     | `'button' \| 'submit' \| 'reset'`                                                    | `'button'` | Native button type.                                               |

### Methods

| Method    | Description                    |
| --------- | ------------------------------ |
| `focus()` | Moves focus to the button.     |
| `blur()`  | Removes focus from the button. |

### Events

| Event      | Detail                          | Description                                         |
| ---------- | ------------------------------- | --------------------------------------------------- |
| `bp-click` | `{ originalEvent: MouseEvent }` | The button was activated. Not fired while disabled. |

### Slots

| Slot      | Description                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------- |
| (default) | A custom icon (`<svg>` or `<bp-icon>`), used when `icon` is empty. Sized to the button's icon size. |

### CSS Parts

| Part     | Description       |
| -------- | ----------------- |
| `button` | The native button |
| `icon`   | The icon          |

## Design Tokens Used

- `--bp-spacing-8`, `--bp-spacing-10`, `--bp-spacing-12` - Button size
- `--bp-icon-size-sm`, `--bp-icon-size-md`, `--bp-icon-size-lg` - Icon size
- `--bp-color-text-muted`, `--bp-color-text` - Ghost icon color, resting and hovered
- `--bp-color-hover-overlay`, `--bp-color-active-overlay` - Ghost and secondary hover and press
- `--bp-color-surface-elevated`, `--bp-color-border-strong` - Secondary fill and outline
- `--bp-color-primary`, `-success`, `-error`, `-warning`, `-info` (and `-hover`) - Filled variants
- `--bp-color-text-inverse` - Icon on filled variants
- `--bp-border-radius`, `--bp-border-radius-full` - Shape
- `--bp-color-focus`, `--bp-focus-width`, `--bp-focus-offset` - Focus ring

## Accessibility

- `label` is set as `aria-label` on the native button, and the icon is hidden from assistive tech, so screen readers announce only the label.
- The component logs a console warning once if `label` is empty.
- Sizes are 32px and up. Prefer `md` (40px) or larger for touch, or keep at least 8px between `sm` buttons.
- The ghost icon uses `--bp-color-text-muted`, which meets 3:1 against every ground.
