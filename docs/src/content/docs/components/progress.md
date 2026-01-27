---
title: Progress
description: Progress bar component for displaying completion status
---

The `bp-progress` component displays progress towards a goal. Use it for file uploads, form completion, loading states, or any operation with measurable progress.

## Import

```javascript
import 'blueprint/components/progress';
```

## Examples

### Default

<div class="component-preview">
  <bp-progress value="60" max="100"></bp-progress>
</div>

```html
<bp-progress value="60" max="100"></bp-progress>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-progress value="60" variant="primary"></bp-progress>
    <bp-progress value="60" variant="success"></bp-progress>
    <bp-progress value="60" variant="warning"></bp-progress>
    <bp-progress value="60" variant="error"></bp-progress>
  </div>
</div>

```html
<bp-progress value="60" variant="primary"></bp-progress>
<bp-progress value="60" variant="success"></bp-progress>
<bp-progress value="60" variant="warning"></bp-progress>
<bp-progress value="60" variant="error"></bp-progress>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-progress value="60" size="small"></bp-progress>
    <bp-progress value="60" size="medium"></bp-progress>
    <bp-progress value="60" size="large"></bp-progress>
  </div>
</div>

```html
<bp-progress value="60" size="small"></bp-progress>
<bp-progress value="60" size="medium"></bp-progress>
<bp-progress value="60" size="large"></bp-progress>
```

### With Value Display

<div class="component-preview">
  <bp-progress value="75" max="100" showValue></bp-progress>
</div>

```html
<bp-progress value="75" max="100" showValue></bp-progress>
```

### With Label

<div class="component-preview">
  <bp-progress value="45" max="100" label="Uploading files..."></bp-progress>
</div>

```html
<bp-progress value="45" max="100" label="Uploading files..."></bp-progress>
```

### Indeterminate

Use for operations with unknown duration.

<div class="component-preview">
  <bp-progress indeterminate></bp-progress>
</div>

```html
<bp-progress indeterminate></bp-progress>
```

### Complete

<div class="component-preview">
  <bp-progress value="100" max="100" variant="success" showValue></bp-progress>
</div>

```html
<bp-progress value="100" max="100" variant="success" showValue></bp-progress>
```

## API Reference

### Properties

| Property        | Type                                             | Default     | Description                       |
| --------------- | ------------------------------------------------ | ----------- | --------------------------------- |
| `value`         | `number`                                         | `0`         | Current progress value            |
| `max`           | `number`                                         | `100`       | Maximum progress value            |
| `variant`       | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Visual variant                    |
| `size`          | `'small' \| 'medium' \| 'large'`                 | `'medium'`  | Size of the progress bar          |
| `label`         | `string`                                         | `''`        | Text label above the progress bar |
| `showValue`     | `boolean`                                        | `false`     | Show percentage value             |
| `indeterminate` | `boolean`                                        | `false`     | Show indeterminate animation      |

### CSS Parts

| Part       | Description             |
| ---------- | ----------------------- |
| `progress` | The progress container  |
| `track`    | The background track    |
| `bar`      | The filled progress bar |
| `label`    | The label text          |
| `value`    | The value text          |

### Accessibility

The progress bar includes proper ARIA attributes (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) for screen reader support.
