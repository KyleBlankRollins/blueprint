---
title: Divider
description: Visual separator component for content sections
---

The `bp-divider` component provides visual separation between content sections. It supports horizontal and vertical orientations, various line styles, and optional text labels.

## Import

```javascript
import 'blueprint/components/divider';
```

## Examples

### Default

<div class="component-preview">
  <bp-divider></bp-divider>
</div>

```html
<bp-divider></bp-divider>
```

### Orientations

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-divider orientation="horizontal"></bp-divider>
  </div>
  <div style="display: flex; height: 60px; align-items: stretch; gap: 1rem; margin-top: 1rem;">
    <span>Left</span>
    <bp-divider orientation="vertical"></bp-divider>
    <span>Right</span>
  </div>
</div>

```html
<bp-divider orientation="horizontal"></bp-divider>

<bp-divider orientation="vertical"></bp-divider>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-divider variant="solid"></bp-divider>
    <bp-divider variant="dashed"></bp-divider>
    <bp-divider variant="dotted"></bp-divider>
  </div>
</div>

```html
<bp-divider variant="solid"></bp-divider>
<bp-divider variant="dashed"></bp-divider>
<bp-divider variant="dotted"></bp-divider>
```

### Spacing

<div class="component-preview">
  <div style="display: flex; flex-direction: column;">
    <span>Small spacing</span>
    <bp-divider spacing="sm"></bp-divider>
    <span>Medium spacing</span>
    <bp-divider spacing="md"></bp-divider>
    <span>Large spacing</span>
    <bp-divider spacing="lg"></bp-divider>
    <span>End</span>
  </div>
</div>

```html
<bp-divider spacing="sm"></bp-divider>
<bp-divider spacing="md"></bp-divider>
<bp-divider spacing="lg"></bp-divider>
```

### Weight

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-divider weight="thin"></bp-divider>
    <bp-divider weight="medium"></bp-divider>
    <bp-divider weight="thick"></bp-divider>
  </div>
</div>

```html
<bp-divider weight="thin"></bp-divider>
<bp-divider weight="medium"></bp-divider>
<bp-divider weight="thick"></bp-divider>
```

### With Text Label

<div class="component-preview">
  <bp-divider>OR</bp-divider>
</div>

```html
<bp-divider>OR</bp-divider>
```

## API Reference

### Properties

| Property      | Type                                | Default        | Description                |
| ------------- | ----------------------------------- | -------------- | -------------------------- |
| `orientation` | `'horizontal' \| 'vertical'`        | `'horizontal'` | Orientation of the divider |
| `spacing`     | `'sm' \| 'md' \| 'lg'`              | `'md'`         | Spacing around the divider |
| `variant`     | `'solid' \| 'dashed' \| 'dotted'`   | `'solid'`      | Line style variant         |
| `color`       | `'default' \| 'subtle' \| 'accent'` | `'default'`    | Color variant              |
| `weight`      | `'thin' \| 'medium' \| 'thick'`     | `'thin'`       | Border weight              |

### Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| (default) | Optional text label (horizontal orientation only) |

### CSS Parts

| Part      | Description              |
| --------- | ------------------------ |
| `divider` | The divider container    |
| `line`    | The divider line element |
| `content` | The text label container |
