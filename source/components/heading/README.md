# Heading

A semantic typography component for headings (h1-h6) with flexible visual styling.

## Features

- **Semantic HTML** - Renders proper h1-h6 elements for accessibility and SEO
- **Visual flexibility** - Separate `level` (semantic) and `size` (visual) properties
- **Font weight control** - Five weight options from light to bold
- **Design token integration** - Uses Blueprint theme tokens for consistent styling
- **CSS custom properties** - Override color and font family per instance
- **Shadow DOM** - Encapsulated styles with exposed CSS parts

## Usage

### Basic heading

```html
<bp-heading>Default h1 heading</bp-heading>
```

### Different semantic levels

```html
<bp-heading level="1">Page Title (h1)</bp-heading>
<bp-heading level="2">Section Title (h2)</bp-heading>
<bp-heading level="3">Subsection Title (h3)</bp-heading>
```

### Control visual size independently

```html
<!-- Semantic h1, but visually smaller -->
<bp-heading level="1" size="md">Compact page title</bp-heading>

<!-- Semantic h6, but visually large -->
<bp-heading level="6" size="3xl">Emphasized subsection</bp-heading>
```

### Adjust font weight

```html
<bp-heading weight="light">Light heading</bp-heading>
<bp-heading weight="bold">Bold heading</bp-heading>
```

### Custom colors

```html
<bp-heading style="--bp-heading-color: #059669;">
  Custom green heading
</bp-heading>
```

## API

### Properties

| Property | Type                                                              | Default  | Description                                      |
| -------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------ |
| `level`  | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                                      | `1`      | Semantic heading level (determines HTML element) |
| `size`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'4xl'`  | Visual size (independent of semantic level)      |
| `weight` | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'`         | `'bold'` | Font weight                                      |

### Events

This component does not emit custom events.

### Slots

| Slot      | Description              |
| --------- | ------------------------ |
| (default) | The heading text content |

### CSS Parts

| Part      | Description                 |
| --------- | --------------------------- |
| `heading` | The heading element (h1-h6) |

### CSS Custom Properties

Custom properties that can be used to override default styling on a per-instance basis using inline styles or CSS parts.

| Property                   | Description                      |
| -------------------------- | -------------------------------- |
| `--bp-heading-color`       | Override the heading text color  |
| `--bp-heading-font-family` | Override the heading font family |

## Design Tokens Used

**Typography:**

- `--bp-font-family-sans`
- `--bp-font-size-xs`, `--bp-font-size-sm`, `--bp-font-size-base`, `--bp-font-size-lg`
- `--bp-font-size-xl`, `--bp-font-size-2xl`, `--bp-font-size-3xl`, `--bp-font-size-4xl`
- `--bp-font-weight-light`, `--bp-font-weight-normal`, `--bp-font-weight-medium`
- `--bp-font-weight-semibold`, `--bp-font-weight-bold`

**Note:** The component uses size-specific line heights and letter spacing for optimal typography. Large sizes (2xl, 3xl, 4xl) have tighter line height and negative letter spacing for better optical balance.

**Colors:**

- `--bp-color-text`

## Accessibility

- **Semantic HTML** - Uses proper h1-h6 elements for screen readers and SEO
- **Heading hierarchy** - The `level` property ensures correct document outline
- **Visual vs semantic** - Allows visual design freedom without breaking accessibility
- **No ARIA required** - Native heading elements provide proper semantics
- **Screen reader support** - Heading levels are announced correctly by assistive technology

### Best Practices

1. **Maintain heading hierarchy** - Don't skip levels (e.g., h1 → h3)
2. **One h1 per page** - Use `level="1"` only for the main page title
3. **Use visual size for layout** - Adjust `size` for design, keep `level` for structure
4. **Descriptive text** - Ensure heading content clearly describes the section

### Example: Proper heading hierarchy

```html
<bp-heading level="1" size="4xl">Page Title</bp-heading>

<bp-heading level="2" size="2xl">Section 1</bp-heading>
<p>Content...</p>

<bp-heading level="3" size="xl">Subsection 1.1</bp-heading>
<p>Content...</p>

<bp-heading level="2" size="2xl">Section 2</bp-heading>
<p>Content...</p>
```
