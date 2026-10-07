# Container

Centers page content and caps its width at a breakpoint, with an inline gutter so content never touches the edge of the viewport.

## Usage

```html
<!-- 1024px max, 16px gutters -->
<bp-container>
  <bp-heading level="1">Settings</bp-heading>
</bp-container>

<!-- A narrow reading column -->
<bp-container size="md" gutter="lg">
  <bp-text>Long-form copy reads best at around 70 characters per line.</bp-text>
</bp-container>

<!-- Full width, gutters only -->
<bp-container size="full"></bp-container>
```

## API

### Properties

| Property | Type                                                               | Default | Description                                                      |
| -------- | ------------------------------------------------------------------ | ------- | ---------------------------------------------------------------- |
| `size`   | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'`                  | `'lg'`  | Maximum width, from `--bp-breakpoint-*`. `full` removes the cap. |
| `gutter` | `'none' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'`  | Inline padding, from `--bp-spacing-*`.                           |

| Size   | Max width |
| ------ | --------- |
| `sm`   | 640px     |
| `md`   | 768px     |
| `lg`   | 1024px    |
| `xl`   | 1280px    |
| `2xl`  | 1536px    |
| `full` | none      |

The gutter sits inside the max width (`box-sizing: border-box`).

### Events

This component does not emit any events.

### Slots

| Slot      | Description      |
| --------- | ---------------- |
| (default) | The page content |

### CSS Parts

None. Style the host directly.

## Design Tokens Used

- `--bp-breakpoint-sm` … `--bp-breakpoint-2xl` - Maximum width
- `--bp-spacing-2xs` … `--bp-spacing-2xl` - Inline gutter

## Accessibility

Container adds no role. Put landmarks (`<main>`, `<nav>`) inside or around it as the page needs.
