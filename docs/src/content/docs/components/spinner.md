---
title: Spinner
description: Loading indicator component for async operations
---

The `bp-spinner` component displays a loading indicator to show that content is being loaded or an operation is in progress.

## Import

```javascript
import 'blueprint/components/spinner';
```

## Examples

### Default

<div class="component-preview">
  <bp-spinner></bp-spinner>
</div>

```html
<bp-spinner></bp-spinner>
```

### Sizes

<div class="component-preview">
  <div class="component-preview-row">
    <bp-spinner size="sm"></bp-spinner>
    <bp-spinner size="md"></bp-spinner>
    <bp-spinner size="lg"></bp-spinner>
  </div>
</div>

```html
<bp-spinner size="sm"></bp-spinner>
<bp-spinner size="md"></bp-spinner>
<bp-spinner size="lg"></bp-spinner>
```

### Variants

<div class="component-preview">
  <div class="component-preview-row">
    <bp-spinner variant="primary"></bp-spinner>
    <bp-spinner variant="success"></bp-spinner>
    <bp-spinner variant="error"></bp-spinner>
    <bp-spinner variant="warning"></bp-spinner>
    <bp-spinner variant="neutral"></bp-spinner>
  </div>
</div>

```html
<bp-spinner variant="primary"></bp-spinner>
<bp-spinner variant="success"></bp-spinner>
<bp-spinner variant="error"></bp-spinner>
<bp-spinner variant="warning"></bp-spinner>
<bp-spinner variant="neutral"></bp-spinner>
```

### With Custom Label

<div class="component-preview">
  <bp-spinner label="Loading data..."></bp-spinner>
</div>

```html
<bp-spinner label="Loading data..."></bp-spinner>
```

### Inverse (for dark backgrounds)

<div class="component-preview" style="background: var(--bp-color-primary); padding: 1rem; border-radius: 0.5rem;">
  <bp-spinner variant="inverse"></bp-spinner>
</div>

```html
<bp-spinner variant="inverse"></bp-spinner>
```

## API Reference

### Properties

| Property  | Type                                                                       | Default        | Description                         |
| --------- | -------------------------------------------------------------------------- | -------------- | ----------------------------------- |
| `size`    | `'sm' \| 'md' \| 'lg'`                                                     | `'md'`         | Size of the spinner                 |
| `variant` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'inverse' \| 'neutral'` | `'primary'`    | Visual variant                      |
| `label`   | `string`                                                                   | `'Loading...'` | Accessible label for screen readers |

### CSS Parts

| Part      | Description           |
| --------- | --------------------- |
| `spinner` | The spinner container |
| `circle`  | The spinning circle   |

### Accessibility

The spinner includes `role="status"` and an `aria-label` for screen reader support. Customize the label using the `label` property.
