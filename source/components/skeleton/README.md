# Skeleton

A loading placeholder component that indicates content is being loaded. Skeletons reduce perceived loading time and provide visual feedback to users.

## Features

- **Multiple Variants**: Text, circular, rectangular, and rounded shapes
- **Animated Shimmer**: Smooth shimmer animation for loading indication
- **Multi-line Text**: Support for multiple text lines with automatic last-line styling
- **Size Presets**: Small, medium, and large size options
- **Custom Dimensions**: Override with any CSS width/height values
- **Theme Integration**: Uses design tokens for consistent appearance

## Usage

### Basic Text Skeleton

```html
<bp-skeleton></bp-skeleton>
```

### Text with Multiple Lines

```html
<bp-skeleton variant="text" lines="4" width="400px"></bp-skeleton>
```

### Circular (Avatar Placeholder)

```html
<bp-skeleton variant="circular" size="large"></bp-skeleton>
```

### Rectangular (Image Placeholder)

```html
<bp-skeleton variant="rectangular" width="200px" height="150px"></bp-skeleton>
```

### Rounded (Card Placeholder)

```html
<bp-skeleton variant="rounded" width="100%" height="200px"></bp-skeleton>
```

### Without Animation

```html
<bp-skeleton animated="false"></bp-skeleton>
```

### Card Loading Placeholder

```html
<div class="card">
  <div class="card-header">
    <bp-skeleton variant="circular" size="medium"></bp-skeleton>
    <div>
      <bp-skeleton variant="text" width="120px"></bp-skeleton>
      <bp-skeleton variant="text" size="small" width="80px"></bp-skeleton>
    </div>
  </div>
  <bp-skeleton variant="rectangular" height="150px"></bp-skeleton>
  <bp-skeleton variant="text" lines="3"></bp-skeleton>
</div>
```

## API

### Properties

| Property   | Type      | Default    | Description                                                 |
| ---------- | --------- | ---------- | ----------------------------------------------------------- |
| `variant`  | `string`  | `'text'`   | Shape variant: `text`, `circular`, `rectangular`, `rounded` |
| `width`    | `string`  | `''`       | Custom width (any CSS value)                                |
| `height`   | `string`  | `''`       | Custom height (any CSS value)                               |
| `animated` | `boolean` | `true`     | Whether to show shimmer animation                           |
| `lines`    | `number`  | `1`        | Number of lines (text variant only)                         |
| `size`     | `string`  | `'medium'` | Size preset: `small`, `medium`, `large`                     |

### Variant Options

| Variant       | Description                                  | Use Case                  |
| ------------- | -------------------------------------------- | ------------------------- |
| `text`        | Thin horizontal bar with small border radius | Text content placeholders |
| `circular`    | Perfect circle                               | Avatars, icons            |
| `rectangular` | Rectangle with no border radius              | Images, videos            |
| `rounded`     | Rectangle with large border radius           | Cards, containers         |

### Size Presets

| Size     | Text Height | Circular Size | Rectangular Height |
| -------- | ----------- | ------------- | ------------------ |
| `small`  | 12px        | 32px × 32px   | 40px               |
| `medium` | 16px        | 40px × 40px   | 64px               |
| `large`  | 24px        | 48px × 48px   | 96px               |

### Slots

| Slot      | Description                      |
| --------- | -------------------------------- |
| (default) | Optional custom skeleton content |

### CSS Parts

| Part   | Description                    |
| ------ | ------------------------------ |
| `base` | The skeleton container element |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface-subdued` - Skeleton background color
- `--bp-color-surface-elevated` - Shimmer highlight color
- `--bp-border-radius-sm` - Text variant corners
- `--bp-border-radius-lg` - Rounded variant corners
- `--bp-border-radius-full` - Circular variant
- `--bp-border-radius-none` - Rectangular variant

### Universal Tokens (Infrastructure)

- `--bp-spacing-2` - Gap between multi-line text
- `--bp-spacing-3` - Small text height
- `--bp-spacing-4` - Medium text height
- `--bp-spacing-6` - Large text height
- `--bp-spacing-8` - Small circular size
- `--bp-spacing-10` - Medium circular size
- `--bp-spacing-12` - Large circular size
- `--bp-spacing-16` - Medium rectangular height
- `--bp-spacing-24` - Large rectangular height
- `--bp-duration-slow` - Shimmer animation duration

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- Skeletons are purely visual indicators and don't require ARIA attributes
- The animation is CSS-only and respects `prefers-reduced-motion` if added
- Use alongside proper loading states in your application
- Consider adding `aria-busy="true"` to parent containers while loading
- Ensure sufficient color contrast between skeleton and background
