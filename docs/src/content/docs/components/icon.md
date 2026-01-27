---
title: Icon
description: SVG icon component with size and color variants
---

The `bp-icon` component displays SVG icons from the built-in icon library. Icons support multiple sizes and color variants.

## Import

```javascript
import 'blueprint/components/icon';
```

## Examples

### Default

<div class="component-preview">
  <bp-icon name="check"></bp-icon>
</div>

```html
<bp-icon name="check"></bp-icon>
```

### Sizes

<div class="component-preview">
  <div class="component-preview-row">
    <bp-icon name="check" size="xs"></bp-icon>
    <bp-icon name="check" size="sm"></bp-icon>
    <bp-icon name="check" size="md"></bp-icon>
    <bp-icon name="check" size="lg"></bp-icon>
    <bp-icon name="check" size="xl"></bp-icon>
  </div>
</div>

```html
<bp-icon name="check" size="xs"></bp-icon>
<bp-icon name="check" size="sm"></bp-icon>
<bp-icon name="check" size="md"></bp-icon>
<bp-icon name="check" size="lg"></bp-icon>
<bp-icon name="check" size="xl"></bp-icon>
```

### Colors

<div class="component-preview">
  <div class="component-preview-row">
    <bp-icon name="check" color="default"></bp-icon>
    <bp-icon name="check" color="primary"></bp-icon>
    <bp-icon name="check" color="success"></bp-icon>
    <bp-icon name="check" color="warning"></bp-icon>
    <bp-icon name="check" color="error"></bp-icon>
    <bp-icon name="check" color="muted"></bp-icon>
  </div>
</div>

```html
<bp-icon name="check" color="default"></bp-icon>
<bp-icon name="check" color="primary"></bp-icon>
<bp-icon name="check" color="success"></bp-icon>
<bp-icon name="check" color="warning"></bp-icon>
<bp-icon name="check" color="error"></bp-icon>
<bp-icon name="check" color="muted"></bp-icon>
```

### Common Icons

<div class="component-preview">
  <div class="component-preview-row" style="flex-wrap: wrap; gap: 1rem;">
    <bp-icon name="check" size="lg"></bp-icon>
    <bp-icon name="close" size="lg"></bp-icon>
    <bp-icon name="add" size="lg"></bp-icon>
    <bp-icon name="remove" size="lg"></bp-icon>
    <bp-icon name="chevron-down" size="lg"></bp-icon>
    <bp-icon name="chevron-up" size="lg"></bp-icon>
    <bp-icon name="chevron-left" size="lg"></bp-icon>
    <bp-icon name="chevron-right" size="lg"></bp-icon>
    <bp-icon name="search" size="lg"></bp-icon>
    <bp-icon name="menu" size="lg"></bp-icon>
    <bp-icon name="settings" size="lg"></bp-icon>
    <bp-icon name="info" size="lg"></bp-icon>
    <bp-icon name="warning" size="lg"></bp-icon>
    <bp-icon name="error" size="lg"></bp-icon>
  </div>
</div>

```html
<bp-icon name="check"></bp-icon>
<bp-icon name="close"></bp-icon>
<bp-icon name="add"></bp-icon>
<bp-icon name="search"></bp-icon>
```

### With Accessible Label

<div class="component-preview">
  <bp-icon name="settings" aria-label="Open settings"></bp-icon>
</div>

```html
<bp-icon name="settings" aria-label="Open settings"></bp-icon>
```

### Custom SVG Content

You can provide custom SVG content via the default slot:

<div class="component-preview">
  <bp-icon size="lg">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z"/>
    </svg>
  </bp-icon>
</div>

```html
<bp-icon size="lg">
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z" />
  </svg>
</bp-icon>
```

## API Reference

### Properties

| Property     | Type                                                                     | Default     | Description                         |
| ------------ | ------------------------------------------------------------------------ | ----------- | ----------------------------------- |
| `name`       | `IconName`                                                               | `''`        | Name of the icon from the library   |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                   | `'md'`      | Size of the icon                    |
| `color`      | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'muted'` | `'default'` | Color variant                       |
| `aria-label` | `string`                                                                 | `''`        | Accessible label for screen readers |

### Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| (default) | Custom SVG content (when `name` is empty) |

### CSS Parts

| Part   | Description        |
| ------ | ------------------ |
| `icon` | The icon container |

### Accessibility

For decorative icons, no label is needed. For meaningful icons (e.g., icon-only buttons), provide an `aria-label` attribute.
