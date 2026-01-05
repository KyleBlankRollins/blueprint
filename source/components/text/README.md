# Text

A flexible typography component for body text with comprehensive styling options.

## Features

- **Multiple element types** - Render as `p`, `span`, or `div` for different contexts
- **Size variants** - Five size options (xs, sm, base, lg, xl)
- **Font weight control** - Five weight options from light to bold
- **Color variants** - Semantic color variants (default, muted, primary, success, warning, error)
- **Text alignment** - Left, center, right, and justify
- **Text transformation** - Uppercase, lowercase, capitalize
- **Letter spacing** - Five tracking options for precise typography
- **Line height control** - Six line height variants
- **Multi-line clamp** - Truncate text to a specific number of lines
- **Italic support** - Optional italic styling
- **Truncation** - Automatic ellipsis for overflowing text
- **Design token integration** - Uses Blueprint theme tokens
- **CSS custom properties** - Override color and font family per instance

## Usage

### Basic text

```html
<bp-text>This is a paragraph of body text.</bp-text>
```

### Different sizes

```html
<bp-text size="xs">Extra small text</bp-text>
<bp-text size="sm">Small text</bp-text>
<bp-text size="base">Base text (default)</bp-text>
<bp-text size="lg">Large text</bp-text>
<bp-text size="xl">Extra large text</bp-text>
```

### Font weights

```html
<bp-text weight="light">Light text</bp-text>
<bp-text weight="normal">Normal text (default)</bp-text>
<bp-text weight="medium">Medium text</bp-text>
<bp-text weight="semibold">Semibold text</bp-text>
<bp-text weight="bold">Bold text</bp-text>
```

### Color variants

```html
<bp-text variant="default">Default color</bp-text>
<bp-text variant="muted">Muted/secondary text</bp-text>
<bp-text variant="primary">Primary color text</bp-text>
<bp-text variant="success">Success message</bp-text>
<bp-text variant="warning">Warning message</bp-text>
<bp-text variant="error">Error message</bp-text>
```

### Text alignment

```html
<bp-text align="left">Left aligned (default)</bp-text>
<bp-text align="center">Center aligned</bp-text>
<bp-text align="right">Right aligned</bp-text>
<bp-text align="justify">Justified text</bp-text>
```

### Text transformation

```html
<bp-text transform="uppercase">Uppercase text</bp-text>
<bp-text transform="lowercase">LOWERCASE TEXT</bp-text>
<bp-text transform="capitalize">capitalize each word</bp-text>
```

### Letter spacing

```html
<bp-text tracking="tight">Tight letter spacing</bp-text>
<bp-text tracking="wide">Wide letter spacing</bp-text>
```

### Line height control

```html
<bp-text line-height="tight">Tight line height for compact text</bp-text>
<bp-text line-height="relaxed">Relaxed line height for readability</bp-text>
```

### Multi-line truncation

```html
<!-- Clamp text to 2 lines -->
<bp-text clamp="2">
  Long text that will be truncated after two lines with an ellipsis...
</bp-text>

<!-- Clamp text to 3 lines -->
<bp-text clamp="3">
  Even longer text that will be truncated after three lines...
</bp-text>
```

### Italic and single-line truncate

```html
<bp-text italic>This text is italic</bp-text>

<!-- Truncate works best with a defined container width -->
<div style="max-width: 300px;">
  <bp-text truncate>
    This long text will be truncated with ellipsis when it exceeds the container
    width
  </bp-text>
</div>
```

### Different element types

```html
<!-- Paragraph (default, block-level) -->
<bp-text as="p">Paragraph element</bp-text>

<!-- Span (inline) - useful for inline styling within paragraphs -->
<p>
  This is regular text with
  <bp-text as="span" variant="primary">inline primary text</bp-text> in the
  middle.
</p>

<!-- Div (block-level) -->
<bp-text as="div">Div block element</bp-text>
```

### Combinations

```html
<bp-text size="lg" weight="bold" variant="primary">
  Large, bold, primary text
</bp-text>

<bp-text size="sm" weight="medium" variant="muted" italic>
  Small, medium, muted, italic text
</bp-text>
```

## API

### Properties

| Property     | Type                                                                     | Default     | Description                                                                           |
| ------------ | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------- |
| `as`         | `'p' \| 'span' \| 'div'`                                                 | `'p'`       | The HTML element type to render                                                       |
| `size`       | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'`                                 | `'base'`    | The size of the text                                                                  |
| `weight`     | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'`                | `'normal'`  | The font weight                                                                       |
| `variant`    | `'default' \| 'muted' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | The color variant                                                                     |
| `align`      | `'left' \| 'center' \| 'right' \| 'justify'`                             | `'left'`    | Text alignment                                                                        |
| `transform`  | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'`                   | `'none'`    | Text transformation                                                                   |
| `tracking`   | `'tighter' \| 'tight' \| 'normal' \| 'wide' \| 'wider'`                  | `'normal'`  | Letter spacing (tracking)                                                             |
| `lineHeight` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'`        | `'normal'`  | Line height variant                                                                   |
| `clamp`      | `number`                                                                 | `0`         | Number of lines to clamp (multi-line truncation). 0 means no clamping                 |
| `italic`     | `boolean`                                                                | `false`     | Whether the text is italic                                                            |
| `truncate`   | `boolean`                                                                | `false`     | Whether to truncate with ellipsis on overflow (requires container with defined width) |

### Events

This component does not emit custom events.

### Slots

| Slot      | Description      |
| --------- | ---------------- |
| (default) | The text content |

### CSS Parts

| Part   | Description                |
| ------ | -------------------------- |
| `text` | The text container element |

## Design Tokens Used

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-size-xs`, `--bp-font-size-sm`, `--bp-font-size-base`
- `--bp-font-size-lg`, `--bp-font-size-xl`
- `--bp-font-weight-light`, `--bp-font-weight-normal`, `--bp-font-weight-medium`
- `--bp-font-weight-semibold`, `--bp-font-weight-bold`
- `--bp-line-height-none`, `--bp-line-height-tight`, `--bp-line-height-snug`
- `--bp-line-height-normal`, `--bp-line-height-relaxed`, `--bp-line-height-loose`

**Colors:**

- `--bp-color-text`
- `--bp-color-text-muted`
- `--bp-color-primary`
- `--bp-color-success`
- `--bp-color-warning`
- `--bp-color-error`

## Accessibility

- **Semantic HTML** - Uses appropriate element types (`p`, `span`, `div`)
- **Color contrast** - All color variants meet WCAG contrast requirements
- **No interactive behavior** - Pure presentational component
- **Screen reader support** - Text content is naturally accessible

### Best Practices

1. **Choose the right element** - Use `as="p"` for paragraphs, `as="span"` for inline text, `as="div"` for generic containers
2. **Use semantic variants** - Use `variant="error"` for errors, `variant="success"` for success messages, etc.
3. **Don't rely on color alone** - When conveying meaning with color (error, warning), also use text or icons
4. **Ensure sufficient contrast** - When using custom colors, verify they meet WCAG AA standards
5. **Use truncate sparingly** - Only truncate when necessary, as it hides content from users. Always ensure the parent container has a defined width for truncate to work properly.
6. **Inline spans** - Use `as="span"` when you need to style text within a paragraph without breaking text flow

### Example: Accessible error message

```html
<bp-text variant="error" weight="medium">
  <bp-icon name="warning-circle"></bp-icon>
  Error: Please enter a valid email address
</bp-text>
```
