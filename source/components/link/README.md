# bp-link

A versatile link component that provides styled anchor elements with multiple visual variants and accessibility features. Supports internal and external links with automatic security attributes for external links.

## Features

- **Visual Variants**: Default, primary, and muted styles to match different contexts
- **Underline Styles**: Always, hover, or never underline to fit different design needs
- **Size Variants**: Small, medium, and large sizes to match surrounding text
- **Disabled State**: Prevents navigation and indicates non-interactive state
- **External Link Handling**: Automatically adds `rel="noopener noreferrer"` for `target="_blank"` links
- **External Link Indicator**: Visual indicator (↗) for links opening in new tabs
- **Keyboard Accessible**: Full keyboard navigation support
- **Screen Reader Support**: Proper ARIA attributes for disabled state
- **Customizable**: CSS parts for advanced styling

## Usage

### Basic Link

```html
<bp-link href="https://example.com">Click here</bp-link>
```

### Visual Variants

```html
<!-- Default variant (primary color, inherits font-weight) -->
<bp-link href="/page" variant="default">Default link</bp-link>

<!-- Primary variant (primary color, semibold weight) -->
<bp-link href="/page" variant="primary">Primary link</bp-link>

<!-- Muted variant (muted text color) -->
<bp-link href="/page" variant="muted">Muted link</bp-link>
```

### Underline Styles

```html
<!-- Always underlined -->
<bp-link href="/page" underline="always">Always underlined</bp-link>

<!-- Underlined on hover (default) -->
<bp-link href="/page" underline="hover">Hover to underline</bp-link>

<!-- Never underlined -->
<bp-link href="/page" underline="none">No underline</bp-link>
```

### Size Variants

```html
<!-- Small size (87.5% of inherited size) -->
<bp-link href="/page" size="sm">Small link</bp-link>

<!-- Medium size (inherits from context - default) -->
<bp-link href="/page" size="md">Medium link</bp-link>

<!-- Large size (112.5% of inherited size) -->
<bp-link href="/page" size="lg">Large link</bp-link>
```

### External Links

```html
<!-- Opens in new tab with automatic security attributes -->
<bp-link href="https://github.com" target="_blank"> Visit GitHub </bp-link>

<!-- Custom rel attribute -->
<bp-link href="https://example.com" target="_blank" rel="nofollow">
  External link
</bp-link>
```

### Disabled State

```html
<bp-link href="/page" disabled>Disabled link</bp-link>
```

## API

### Properties

| Property    | Type                                | Default     | Description                                                                           |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `href`      | `string`                            | `''`        | The URL the link points to                                                            |
| `target`    | `string`                            | `''`        | Where to display the linked URL (e.g., `_blank` for new tab)                          |
| `rel`       | `string`                            | `''`        | Relationship of the linked URL (auto-set to `noopener noreferrer` for external links) |
| `variant`   | `'default' \| 'primary' \| 'muted'` | `'default'` | Visual variant (default: primary color, primary: semibold, muted: muted color)        |
| `underline` | `'always' \| 'hover' \| 'none'`     | `'hover'`   | Underline style for the link                                                          |
| `size`      | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Size of the link text                                                                 |
| `disabled`  | `boolean`                           | `false`     | Whether the link is disabled (prevents navigation)                                    |

### Events

| Event | Detail | Description |
| ----- | ------ | ----------- |
| -     | -      | -           |

### Slots

| Name      | Description                              |
| --------- | ---------------------------------------- |
| (default) | The text content or elements of the link |

### CSS Parts

| Part   | Description                                     |
| ------ | ----------------------------------------------- |
| `link` | The anchor element, for advanced custom styling |

## Design Tokens

This component uses the following design tokens:

**Colors:**

- `--bp-color-primary` - Default and primary variant base color
- `--bp-color-primary-hover` - Hover state color
- `--bp-color-primary-active` - Active state color
- `--bp-color-text` - Muted variant hover color
- `--bp-color-text-muted` - Muted variant color
- `--bp-color-text-disabled` - Disabled state color
- `--bp-color-focus` - Focus ring color

**Typography:**

- `--bp-font-family-sans` - Font family
- `--bp-font-weight-semibold` - Primary variant weight
- Sizes use relative em units (sm: 0.875em, md: inherit, lg: 1.125em)

**Borders:**

- `--bp-border-radius-sm` - Focus ring border radius

**Transitions:**

- `--bp-transition-fast` - Color and underline transition duration

**Other:**

- Fixed 2px focus outline width
- Fixed 1px underline thickness with smooth color transition
- Fixed 0.15em underline offset
- External link indicator (↗) with 0.7em size and opacity transition
- Subtle 1px translateY on active state for tactile feedback
- Visited links maintain primary color (don't change color after visit)

## Accessibility

- **ARIA Disabled**: Uses `aria-disabled="true"` when link is disabled
- **Focus Indicators**: Clear focus ring with appropriate contrast
- **Keyboard Navigation**: Full support for keyboard interaction
- **Screen Readers**: Announces disabled state appropriately
- **Visited State**: Maintains consistent color scheme for visited links
- **Motion**: Smooth transitions respect `prefers-reduced-motion`

### Best Practices

1. **Use semantic HTML**: This component renders as an anchor element (`<a>`)
2. **Provide meaningful text**: Avoid generic text like "click here"
3. **External link indicators**: Consider adding visual indicators for external links
4. **Disabled vs hidden**: Use disabled state for temporary unavailability, hide links that are permanently unavailable

## Behavior

### Disabled State

When `disabled` is `true`:

- The `href` attribute is removed from the anchor element
- Click events are prevented with `preventDefault()` and `stopPropagation()`
- Visual styling indicates the disabled state (reduced opacity, no hover effects)
- `aria-disabled="true"` is set for screen readers

### External Links

When `target="_blank"` is set:

- Automatically adds `rel="noopener noreferrer"` for security (unless custom `rel` is provided)
- Opens link in a new browser tab/window
- Custom `rel` attribute will override the automatic value

## Examples

### Navigation Menu

```html
<nav>
  <bp-link href="/" variant="primary">Home</bp-link>
  <bp-link href="/about">About</bp-link>
  <bp-link href="/services">Services</bp-link>
  <bp-link href="/contact">Contact</bp-link>
</nav>
```

### In Body Text

```html
<p>
  To learn more, visit our
  <bp-link href="/docs" variant="primary" underline="always">
    documentation
  </bp-link>
  or
  <bp-link href="https://github.com" target="_blank">
    view the source code
  </bp-link>
  on GitHub.
</p>
```

### Custom Styling with Parts

```css
bp-link::part(link) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```
