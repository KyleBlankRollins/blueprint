# Card

A versatile card component for organizing and displaying content with optional header, body, footer, and media sections.

## Features

- Multiple visual variants (default, outlined, elevated)
- Named slots for header, body, footer, and media
- Hoverable and clickable states
- Optional padding removal for custom layouts
- Keyboard navigation support for clickable cards
- Smooth hover animations
- Accessible with proper ARIA roles
- Customizable via CSS parts

## Usage

```html
<!-- Basic card -->
<bp-card>
  <p>Simple card content</p>
</bp-card>

<!-- Card with header and footer -->
<bp-card>
  <div slot="header">Card Title</div>
  <p>Main content goes here</p>
  <div slot="footer">
    <button>Action</button>
  </div>
</bp-card>

<!-- Elevated variant with media -->
<bp-card variant="elevated">
  <img slot="media" src="image.jpg" alt="Card image" />
  <div slot="header">Featured Post</div>
  <p>This is an elevated card with an image.</p>
</bp-card>

<!-- Clickable card -->
<bp-card clickable>
  <div slot="header">Click me!</div>
  <p>This entire card is clickable and keyboard accessible.</p>
</bp-card>

<!-- Card with no padding for custom layout -->
<bp-card no-padding>
  <img src="full-width-image.jpg" style="width: 100%" />
</bp-card>

<!-- Hoverable outlined card -->
<bp-card variant="outlined" hoverable>
  <p>This card shows a hover effect</p>
</bp-card>
```

## API

### Properties

| Property    | Type          | Default     | Description                                                                 |
| ----------- | ------------- | ----------- | --------------------------------------------------------------------------- |
| `variant`   | `CardVariant` | `'default'` | Visual variant of the card                                                  |
| `hoverable` | `boolean`     | `false`     | Whether the card should display a hover effect                              |
| `clickable` | `boolean`     | `false`     | Whether the card is clickable (shows pointer cursor and emits click events) |
| `noPadding` | `boolean`     | `false`     | Whether to remove default padding from the card body                        |

**CardVariant**: `'default' | 'outlined' | 'elevated'`

### Events

| Event      | Detail                     | Description                          |
| ---------- | -------------------------- | ------------------------------------ |
| `bp-click` | `{ originalEvent: event }` | Fired when clickable card is clicked |

### Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| (default) | Main content area (card body)             |
| `header`  | Optional header section with border       |
| `footer`  | Optional footer section with border       |
| `media`   | Optional media section (typically images) |

### CSS Parts

| Part     | Description                |
| -------- | -------------------------- |
| `card`   | The main card container    |
| `header` | The header slot container  |
| `body`   | The body content container |
| `footer` | The footer slot container  |
| `media`  | The media slot container   |

## Design Tokens Used

- `--bp-color-surface-elevated` - Card background color
- `--bp-color-border` - Border color for variants and sections
- `--bp-color-border-strong` - Stronger border for outlined variant and hover
- `--bp-color-text` - Body text color
- `--bp-color-text-strong` - Header text color
- `--bp-color-text-muted` - Footer text color
- `--bp-border-radius-lg` - Card corner radius
- `--bp-border-width` - Border thickness
- `--bp-font-family-sans` - Font family
- `--bp-font-size-base` - Body font size
- `--bp-font-size-lg` - Header font size
- `--bp-font-size-sm` - Footer font size
- `--bp-font-weight-semibold` - Header font weight
- `--bp-spacing-lg` - Padding for sections
- `--bp-spacing-2xs` - Hover transform and active state offset
- `--bp-spacing-xs` - Elevated variant hover transform
- `--bp-shadow-sm` - Default variant base shadow and active state
- `--bp-shadow-md` - Default/outlined variant hover shadow
- `--bp-shadow-lg` - Elevated variant base shadow
- `--bp-shadow-xl` - Elevated variant hover shadow
- `--bp-transition-fast` - Box shadow and border color animation
- `--bp-transition-base` - Transform animation duration
- `--bp-focus-ring` - Focus outline style
- `--bp-focus-offset` - Focus outline offset

## Accessibility

- Uses `role="article"` by default for semantic meaning
- Changes to `role="button"` when clickable
- Adds `tabindex="0"` when clickable for keyboard navigation
- Supports Enter and Space key activation for clickable cards
- Focus visible indicator for keyboard users
- Proper focus outline on clickable cards
