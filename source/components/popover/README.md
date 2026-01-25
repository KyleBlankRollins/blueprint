# Popover

A popover component that displays rich content in a floating panel. Supports multiple trigger modes (click, hover, focus, or manual control) and all edge placements with arrow support.

## Features

- Multiple trigger modes: click, hover, focus, or manual
- 12 placement options (top/bottom/left/right with start/end variants)
- Optional arrow pointing to trigger
- Optional close button
- Header, body, and footer slots for rich content
- Configurable show/hide delays for hover trigger
- Escape key and outside click to close (configurable)
- CSS parts for styling customization
- Full accessibility support

## Usage

### Basic Click Popover

```html
<bp-popover>
  <button>Click me</button>
  <div slot="content">
    <p>Popover content goes here</p>
  </div>
</bp-popover>
```

### With Header and Footer

```html
<bp-popover show-close>
  <button>User Info</button>
  <h3 slot="header">User Profile</h3>
  <div slot="content">
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  </div>
  <div slot="footer">
    <bp-button size="small">View Profile</bp-button>
  </div>
</bp-popover>
```

### Hover Trigger

```html
<bp-popover trigger="hover" show-delay="100" hide-delay="300">
  <span>Hover over me</span>
  <div slot="content">This appears on hover</div>
</bp-popover>
```

### Focus Trigger (for form hints)

```html
<bp-popover trigger="focus" placement="right">
  <input type="text" placeholder="Enter username" />
  <div slot="content">
    <p>Username must be 3-20 characters</p>
  </div>
</bp-popover>
```

### With Arrow

```html
<bp-popover arrow placement="top">
  <button>With Arrow</button>
  <div slot="content">The arrow points to the trigger element</div>
</bp-popover>
```

### Different Placements

```html
<!-- Top placements -->
<bp-popover placement="top">...</bp-popover>
<bp-popover placement="top-start">...</bp-popover>
<bp-popover placement="top-end">...</bp-popover>

<!-- Bottom placements -->
<bp-popover placement="bottom">...</bp-popover>
<bp-popover placement="bottom-start">...</bp-popover>
<bp-popover placement="bottom-end">...</bp-popover>

<!-- Left placements -->
<bp-popover placement="left">...</bp-popover>
<bp-popover placement="left-start">...</bp-popover>
<bp-popover placement="left-end">...</bp-popover>

<!-- Right placements -->
<bp-popover placement="right">...</bp-popover>
<bp-popover placement="right-start">...</bp-popover>
<bp-popover placement="right-end">...</bp-popover>
```

### Programmatic Control

```javascript
const popover = document.querySelector('bp-popover');

// Open programmatically
popover.show();

// Close programmatically
popover.hide();

// Toggle
popover.toggle();

// Manual trigger mode for full control
popover.trigger = 'manual';
popover.show(); // Only opens via API
```

## API

### Properties

| Property              | Type                                        | Default    | Description                                              |
| --------------------- | ------------------------------------------- | ---------- | -------------------------------------------------------- |
| `open`                | `boolean`                                   | `false`    | Whether the popover is currently open                    |
| `placement`           | `PopoverPlacement`                          | `'bottom'` | Placement of the popover relative to the trigger         |
| `trigger`             | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'`  | How the popover is triggered                             |
| `arrow`               | `boolean`                                   | `false`    | Whether to show an arrow pointing to the trigger         |
| `showClose`           | `boolean`                                   | `false`    | Whether to show a close button in the header             |
| `closeOnOutsideClick` | `boolean`                                   | `true`     | Whether clicking outside closes the popover              |
| `closeOnEscape`       | `boolean`                                   | `true`     | Whether pressing Escape closes the popover               |
| `distance`            | `number`                                    | `8`        | Distance in pixels between the trigger and the panel     |
| `showDelay`           | `number`                                    | `200`      | Delay in milliseconds before showing (for hover trigger) |
| `hideDelay`           | `number`                                    | `200`      | Delay in milliseconds before hiding (for hover trigger)  |
| `disabled`            | `boolean`                                   | `false`    | Whether the popover is disabled                          |
| `label`               | `string`                                    | `''`       | Accessible label for the popover panel                   |

### Methods

| Method     | Parameters | Description                |
| ---------- | ---------- | -------------------------- |
| `show()`   | -          | Open the popover           |
| `hide()`   | -          | Close the popover          |
| `toggle()` | -          | Toggle popover open/closed |

### Events

| Event           | Detail | Description                             |
| --------------- | ------ | --------------------------------------- |
| `bp-show`       | -      | Fired when the popover opens            |
| `bp-hide`       | -      | Fired when the popover closes           |
| `bp-after-show` | -      | Fired after the popover open animation  |
| `bp-after-hide` | -      | Fired after the popover close animation |

### Slots

| Slot      | Description              |
| --------- | ------------------------ |
| (default) | The trigger element      |
| `content` | The main popover content |
| `header`  | Optional header content  |
| `footer`  | Optional footer content  |

### CSS Parts

| Part           | Description                 |
| -------------- | --------------------------- |
| `trigger`      | The trigger wrapper element |
| `panel`        | The popover panel container |
| `header`       | The header section          |
| `body`         | The body/content section    |
| `footer`       | The footer section          |
| `arrow`        | The arrow element           |
| `close-button` | The close button            |

## Accessibility

- Uses `role="button"` on trigger with `aria-haspopup="dialog"`
- Uses `role="dialog"` on the popover panel
- `aria-expanded` reflects the open state
- `aria-controls` links trigger to panel when open
- `aria-disabled` when popover is disabled
- Close button has accessible `aria-label`
- Escape key closes the popover
- Tab-focusable trigger element

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface-elevated` - Panel background
- `--bp-color-surface-subdued` - Close button hover
- `--bp-color-text` - Text color
- `--bp-color-text-strong` - Header text
- `--bp-color-text-muted` - Close button icon
- `--bp-color-border` - Border and dividers
- `--bp-color-focus` - Focus ring
- `--bp-font-family` - Typography
- `--bp-shadow-lg` - Panel shadow

### Universal Tokens (Infrastructure)

- `--bp-spacing-md`, `--bp-spacing-lg`, `--bp-spacing-xl` - Padding
- `--bp-spacing-sm` - Arrow positioning
- `--bp-spacing-24` - Min/max width calculations
- `--bp-font-size-base` - Text size
- `--bp-font-weight-semibold` - Header weight
- `--bp-border-width` - Border thickness
- `--bp-border-radius-sm`, `--bp-border-radius-lg` - Border roundness
- `--bp-transition-fast` - Animations
- `--bp-z-popover` - Z-index stacking
- `--bp-opacity-disabled` - Disabled state
- `--bp-focus-width`, `--bp-focus-style`, `--bp-focus-offset` - Focus indicators

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.
