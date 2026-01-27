---
title: Text
description: Typography component for body text with flexible styling
---

The `bp-text` component provides flexible body text styling with support for sizes, weights, colors, alignment, and text transformations.

## Import

```javascript
import 'blueprint/components/text';
```

## Examples

### Default

<div class="component-preview">
  <bp-text>This is default body text.</bp-text>
</div>

```html
<bp-text>This is default body text.</bp-text>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text size="xs">Extra small text</bp-text>
    <bp-text size="sm">Small text</bp-text>
    <bp-text size="base">Base text (default)</bp-text>
    <bp-text size="lg">Large text</bp-text>
    <bp-text size="xl">Extra large text</bp-text>
  </div>
</div>

```html
<bp-text size="xs">Extra small text</bp-text>
<bp-text size="sm">Small text</bp-text>
<bp-text size="base">Base text (default)</bp-text>
<bp-text size="lg">Large text</bp-text>
<bp-text size="xl">Extra large text</bp-text>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text variant="default">Default variant</bp-text>
    <bp-text variant="muted">Muted variant</bp-text>
    <bp-text variant="primary">Primary variant</bp-text>
    <bp-text variant="success">Success variant</bp-text>
    <bp-text variant="warning">Warning variant</bp-text>
    <bp-text variant="error">Error variant</bp-text>
  </div>
</div>

```html
<bp-text variant="default">Default variant</bp-text>
<bp-text variant="muted">Muted variant</bp-text>
<bp-text variant="primary">Primary variant</bp-text>
<bp-text variant="success">Success variant</bp-text>
<bp-text variant="warning">Warning variant</bp-text>
<bp-text variant="error">Error variant</bp-text>
```

### Weights

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text weight="light">Light weight</bp-text>
    <bp-text weight="normal">Normal weight</bp-text>
    <bp-text weight="medium">Medium weight</bp-text>
    <bp-text weight="semibold">Semibold weight</bp-text>
    <bp-text weight="bold">Bold weight</bp-text>
  </div>
</div>

```html
<bp-text weight="light">Light weight</bp-text>
<bp-text weight="normal">Normal weight</bp-text>
<bp-text weight="medium">Medium weight</bp-text>
<bp-text weight="semibold">Semibold weight</bp-text>
<bp-text weight="bold">Bold weight</bp-text>
```

### Text Alignment

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text align="left">Left aligned text</bp-text>
    <bp-text align="center">Center aligned text</bp-text>
    <bp-text align="right">Right aligned text</bp-text>
  </div>
</div>

```html
<bp-text align="left">Left aligned text</bp-text>
<bp-text align="center">Center aligned text</bp-text>
<bp-text align="right">Right aligned text</bp-text>
```

### Text Transform

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text transform="uppercase">Uppercase text</bp-text>
    <bp-text transform="lowercase">LOWERCASE TEXT</bp-text>
    <bp-text transform="capitalize">capitalize each word</bp-text>
  </div>
</div>

```html
<bp-text transform="uppercase">Uppercase text</bp-text>
<bp-text transform="lowercase">LOWERCASE TEXT</bp-text>
<bp-text transform="capitalize">capitalize each word</bp-text>
```

### Italic

<div class="component-preview">
  <bp-text italic>This text is italicized.</bp-text>
</div>

```html
<bp-text italic>This text is italicized.</bp-text>
```

### Truncation

<div class="component-preview">
  <bp-text truncate style="max-width: 200px;">This is a very long text that will be truncated with an ellipsis when it overflows the container.</bp-text>
</div>

```html
<bp-text truncate style="max-width: 200px;">
  This is a very long text that will be truncated...
</bp-text>
```

### Line Clamping

<div class="component-preview">
  <bp-text clamp="2" style="max-width: 300px;">
    This is a long paragraph that will be clamped to 2 lines. Any text beyond the second line will be hidden with an ellipsis at the end.
  </bp-text>
</div>

```html
<bp-text clamp="2">
  This is a long paragraph that will be clamped to 2 lines...
</bp-text>
```

### Element Types

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-text as="p">Rendered as paragraph</bp-text>
    <bp-text as="span">Rendered as span</bp-text>
    <bp-text as="div">Rendered as div</bp-text>
  </div>
</div>

```html
<bp-text as="p">Rendered as paragraph</bp-text>
<bp-text as="span">Rendered as span</bp-text>
<bp-text as="div">Rendered as div</bp-text>
```

## API Reference

### Properties

| Property     | Type                                                                     | Default     | Description                 |
| ------------ | ------------------------------------------------------------------------ | ----------- | --------------------------- |
| `as`         | `'p' \| 'span' \| 'div'`                                                 | `'p'`       | HTML element type to render |
| `size`       | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'`                                 | `'base'`    | Text size                   |
| `weight`     | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'`                | `'normal'`  | Font weight                 |
| `variant`    | `'default' \| 'muted' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color variant               |
| `align`      | `'left' \| 'center' \| 'right' \| 'justify'`                             | `'left'`    | Text alignment              |
| `transform`  | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'`                   | `'none'`    | Text transformation         |
| `tracking`   | `'tighter' \| 'tight' \| 'normal' \| 'wide' \| 'wider'`                  | `'normal'`  | Letter spacing              |
| `lineHeight` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'`        | `'normal'`  | Line height                 |
| `clamp`      | `number`                                                                 | `0`         | Number of lines to clamp    |
| `italic`     | `boolean`                                                                | `false`     | Italic style                |
| `truncate`   | `boolean`                                                                | `false`     | Truncate with ellipsis      |

### Slots

| Slot      | Description      |
| --------- | ---------------- |
| (default) | The text content |

### CSS Parts

| Part   | Description                |
| ------ | -------------------------- |
| `text` | The text container element |
