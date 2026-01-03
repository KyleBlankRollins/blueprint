# Divider

A divider component that provides visual separation between content sections. Supports both horizontal and vertical orientations with optional text labels.

## Features

- Horizontal and vertical orientations
- Optional text labels for horizontal dividers
- Multiple spacing variants (sm, md, lg)
- Line style variants (solid, dashed, dotted)
- Color variants (default, subtle, accent)
- Border weight variants (thin, medium, thick)
- CSS parts for advanced styling
- Accessible with ARIA attributes
- Uses design tokens for consistent theming

## Usage

```html
<!-- Simple horizontal divider -->
<bp-divider></bp-divider>

<!-- Horizontal divider with text -->
<bp-divider>Section Title</bp-divider>

<!-- Vertical divider -->
<bp-divider orientation="vertical"></bp-divider>

<!-- Divider with custom spacing -->
<bp-divider spacing="lg"></bp-divider>

<!-- Divider with line style variant -->
<bp-divider variant="dashed"></bp-divider>

<!-- Divider with color variant -->
<bp-divider color="accent"></bp-divider>

<!-- Divider with border weight -->
<bp-divider weight="thick"></bp-divider>

<!-- Combined variants -->
<bp-divider variant="dashed" color="accent" weight="medium"></bp-divider>

<!-- Example in context -->
<div>
  <p>First section</p>
  <bp-divider>OR</bp-divider>
  <p>Second section</p>
</div>

<!-- Vertical divider in flex layout -->
<div style="display: flex; align-items: center;">
  <span>Left</span>
  <bp-divider orientation="vertical"></bp-divider>
  <span>Right</span>
</div>
```

## API

### Properties

| Property      | Type                                | Default        | Description                         |
| ------------- | ----------------------------------- | -------------- | ----------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'`        | `'horizontal'` | Orientation of the divider.         |
| `spacing`     | `'sm' \| 'md' \| 'lg'`              | `'md'`         | Spacing variant for the divider.    |
| `variant`     | `'solid' \| 'dashed' \| 'dotted'`   | `'solid'`      | Line style variant.                 |
| `color`       | `'default' \| 'subtle' \| 'accent'` | `'default'`    | Color variant for the divider line. |
| `weight`      | `'thin' \| 'medium' \| 'thick'`     | `'thin'`       | Border weight for the divider line. |

### Events

This component does not emit any events.

### Slots

| Slot      | Description                                               |
| --------- | --------------------------------------------------------- |
| (default) | Text content to display in horizontal dividers (optional) |

### CSS Parts

| Part      | Description                                         |
| --------- | --------------------------------------------------- |
| `divider` | The outer container element                         |
| `line`    | The divider line element(s)                         |
| `content` | The content container (horizontal orientation only) |

## Design Tokens Used

**Colors:**

- `--bp-color-border` - Default divider line color
- `--bp-color-neutral-200` - Subtle variant divider color
- `--bp-color-primary` - Accent variant divider color
- `--bp-color-text-secondary` - Text label color

**Spacing:**

- `--bp-spacing-sm` - Small spacing margin
- `--bp-spacing-md` - Medium spacing margin and content padding
- `--bp-spacing-lg` - Large spacing margin

**Typography:**

- `--bp-font-family-sans` - Font family for text labels
- `--bp-font-size-xs` - Font size for text labels
- `--bp-font-weight-semibold` - Font weight for text labels

**Border:**

- Base: 1px border width for thin lines
- Dashed: 1.5px for better visibility
- Dotted: 2px for better visibility
- Medium: 2px border width
- Thick: 3px border width

## Accessibility

- **ARIA Attributes:**
  - `role="separator"` - Identifies the element as a separator
  - `aria-orientation` - Indicates horizontal or vertical orientation for screen readers

- **Visual Considerations:**
  - Sufficient contrast between divider line and background
  - Text labels use muted color to indicate secondary importance
  - Spacing variants provide visual hierarchy

## Behavior

**Horizontal Divider:**

- Spans full width of container
- Can include optional text label centered in the line
- Renders two line segments when text is present (left and right of text)

**Vertical Divider:**

- Spans full height of container (requires parent with defined height)
- Does not support text labels
- Best used in flex layouts with `align-items: center` or `align-items: stretch`

**Spacing:**

- Small (sm): Minimal spacing for compact layouts
- Medium (md): Standard spacing for most use cases
- Large (lg): Generous spacing for prominent section breaks

**Line Variants:**

- Solid: Default continuous line style
- Dashed: Dashed line for subtle separation (1.5px for visibility)
- Dotted: Dotted line for decorative separation (2px for visibility)

**Color Variants:**

- Default: Standard border color for neutral separation
- Subtle: Lighter color for minimal visual weight
- Accent: Primary color for emphasized separation

**Weight Variants:**

- Thin: 1px border for subtle separation
- Medium: 2px border for standard emphasis
- Thick: 3px border for strong visual breaks
