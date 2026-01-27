---
title: Tag
description: Removable label component for categories and filters
---

The `bp-tag` component displays removable labels, chips, or category markers. Tags are useful for displaying selected filters, categories, or user-generated labels.

## Import

```javascript
import 'blueprint/components/tag';
```

## Examples

### Default

<div class="component-preview">
  <bp-tag>Design</bp-tag>
</div>

```html
<bp-tag>Design</bp-tag>
```

### Variants

<div class="component-preview">
  <div class="component-preview-row">
    <bp-tag variant="solid">Solid</bp-tag>
    <bp-tag variant="outlined">Outlined</bp-tag>
  </div>
</div>

```html
<bp-tag variant="solid">Solid</bp-tag>
<bp-tag variant="outlined">Outlined</bp-tag>
```

### Colors

<div class="component-preview">
  <div class="component-preview-row">
    <bp-tag color="primary">Primary</bp-tag>
    <bp-tag color="success">Success</bp-tag>
    <bp-tag color="error">Error</bp-tag>
    <bp-tag color="warning">Warning</bp-tag>
    <bp-tag color="info">Info</bp-tag>
    <bp-tag color="neutral">Neutral</bp-tag>
  </div>
</div>

```html
<bp-tag color="primary">Primary</bp-tag>
<bp-tag color="success">Success</bp-tag>
<bp-tag color="error">Error</bp-tag>
<bp-tag color="warning">Warning</bp-tag>
<bp-tag color="info">Info</bp-tag>
<bp-tag color="neutral">Neutral</bp-tag>
```

### Sizes

<div class="component-preview">
  <div class="component-preview-row">
    <bp-tag size="small">Small</bp-tag>
    <bp-tag size="medium">Medium</bp-tag>
    <bp-tag size="large">Large</bp-tag>
  </div>
</div>

```html
<bp-tag size="small">Small</bp-tag>
<bp-tag size="medium">Medium</bp-tag>
<bp-tag size="large">Large</bp-tag>
```

### Removable

<div class="component-preview">
  <div class="component-preview-row">
    <bp-tag removable>Removable</bp-tag>
    <bp-tag removable color="primary">Primary</bp-tag>
    <bp-tag removable variant="outlined">Outlined</bp-tag>
  </div>
</div>

```html
<bp-tag removable>Removable</bp-tag>
<bp-tag removable color="primary">Primary</bp-tag>
<bp-tag removable variant="outlined">Outlined</bp-tag>
```

### Disabled

<div class="component-preview">
  <div class="component-preview-row">
    <bp-tag disabled>Disabled</bp-tag>
    <bp-tag disabled removable>Disabled Removable</bp-tag>
  </div>
</div>

```html
<bp-tag disabled>Disabled</bp-tag>
<bp-tag disabled removable>Disabled Removable</bp-tag>
```

## API Reference

### Properties

| Property    | Type                                                                    | Default     | Description        |
| ----------- | ----------------------------------------------------------------------- | ----------- | ------------------ |
| `variant`   | `'solid' \| 'outlined'`                                                 | `'solid'`   | Visual variant     |
| `size`      | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  | Size of the tag    |
| `color`     | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Color scheme       |
| `removable` | `boolean`                                                               | `false`     | Show remove button |
| `disabled`  | `boolean`                                                               | `false`     | Disable the tag    |

### Slots

| Slot      | Description        |
| --------- | ------------------ |
| (default) | Tag content (text) |

### Events

| Event       | Detail | Description                                          |
| ----------- | ------ | ---------------------------------------------------- |
| `bp-remove` | -      | Fired when the remove button is clicked (cancelable) |

### CSS Parts

| Part           | Description       |
| -------------- | ----------------- |
| `tag`          | The tag container |
| `close-button` | The remove button |
