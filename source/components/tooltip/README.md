# Tooltip

A contextual hint component that displays helpful information when users hover over or focus on an element.

## Features

- Multiple placement options (top, bottom, left, right)
- Automatic show/hide on hover and focus events
- Configurable show delay
- Arrow pointer indicating the trigger element
- Accessible with proper ARIA roles
- Disabled state support
- Customizable via CSS parts

## Usage

```html
<!-- Basic tooltip -->
<bp-tooltip content="This is a helpful hint">
  <button>Hover me</button>
</bp-tooltip>

<!-- Bottom placement -->
<bp-tooltip content="Bottom tooltip" placement="bottom">
  <span>Hover for info</span>
</bp-tooltip>

<!-- Custom delay -->
<bp-tooltip content="Delayed tooltip" delay="500">
  <button>Slow reveal</button>
</bp-tooltip>

<!-- Disabled tooltip -->
<bp-tooltip content="Won't show" disabled>
  <button>No tooltip</button>
</bp-tooltip>
```

## API

### Properties

| Property    | Type               | Default | Description                                      |
| ----------- | ------------------ | ------- | ------------------------------------------------ |
| `content`   | `string`           | `''`    | The text content to display in the tooltip       |
| `placement` | `TooltipPlacement` | `'top'` | Placement of the tooltip relative to the trigger |
| `disabled`  | `boolean`          | `false` | Whether the tooltip is disabled                  |
| `delay`     | `number`           | `200`   | Delay in milliseconds before showing the tooltip |

**TooltipPlacement**: `'top' | 'bottom' | 'left' | 'right'`

### Events

| Event     | Detail | Description                        |
| --------- | ------ | ---------------------------------- |
| `bp-show` | -      | Fired when tooltip becomes visible |
| `bp-hide` | -      | Fired when tooltip becomes hidden  |

### Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| (default) | The trigger element that shows tooltip on hover |

### CSS Parts

| Part      | Description                     |
| --------- | ------------------------------- |
| `trigger` | The wrapper for slotted content |
| `content` | The tooltip content container   |

## Design Tokens Used

- `--bp-color-text` - Tooltip background color
- `--bp-color-text-inverse` - Tooltip text color
- `--bp-border-radius-sm` - Tooltip corner radius
- `--bp-font-family-sans` - Tooltip font family
- `--bp-font-size-sm` - Tooltip text size
- `--bp-line-height-tight` - Tooltip line height
- `--bp-spacing-xs` - Padding and spacing
- `--bp-spacing-sm` - Horizontal padding
- `--bp-shadow-md` - Tooltip shadow
- `--bp-z-tooltip` - Tooltip z-index
- `--bp-transition-fast` - Animation duration

## Accessibility

- Uses `role="tooltip"` for proper semantic meaning
- Sets `aria-hidden="false"` when visible
- Supports keyboard navigation via focus/blur events
- Automatically shows on focus for keyboard users
- No delay on focus (immediate feedback)
