---
title: Button
description: Interactive button component with multiple variants and sizes
---

The `bp-button` component is a versatile button element supporting multiple variants, sizes, and states.

## Import

```javascript
import 'blueprint/components/button';
```

## Examples

### Default

<div class="component-preview">
  <bp-button>Click me</bp-button>
</div>

```html
<bp-button>Click me</bp-button>
```

### Variants

<div class="component-preview">
  <div class="component-preview-row">
    <bp-button variant="primary">Primary</bp-button>
    <bp-button variant="secondary">Secondary</bp-button>
  </div>
</div>

```html
<bp-button variant="primary">Primary</bp-button>
<bp-button variant="secondary">Secondary</bp-button>
```

### Sizes

<div class="component-preview">
  <div class="component-preview-row">
    <bp-button size="small">Small</bp-button>
    <bp-button size="medium">Medium</bp-button>
    <bp-button size="large">Large</bp-button>
  </div>
</div>

```html
<bp-button size="small">Small</bp-button>
<bp-button size="medium">Medium</bp-button>
<bp-button size="large">Large</bp-button>
```

### Disabled

<div class="component-preview">
  <bp-button disabled>Disabled</bp-button>
</div>

```html
<bp-button disabled>Disabled</bp-button>
```

## API Reference

### Properties

| Property   | Type                              | Default     | Description          |
| ---------- | --------------------------------- | ----------- | -------------------- |
| `variant`  | `'primary' \| 'secondary'`        | `'primary'` | Visual style variant |
| `size`     | `'small' \| 'medium' \| 'large'`  | `'medium'`  | Button size          |
| `disabled` | `boolean`                         | `false`     | Disables the button  |
| `type`     | `'button' \| 'submit' \| 'reset'` | `'button'`  | HTML button type     |

### Events

| Event   | Detail | Description                      |
| ------- | ------ | -------------------------------- |
| `click` | -      | Fired when the button is clicked |

### CSS Custom Properties

| Property                | Description           |
| ----------------------- | --------------------- |
| `--bp-button-padding`   | Button padding        |
| `--bp-button-font-size` | Button font size      |
| `--bp-button-gap`       | Gap between icon/text |

### CSS Parts

| Part     | Description                 |
| -------- | --------------------------- |
| `button` | The internal button element |

## Accessibility

- Uses native `<button>` element for proper semantics
- Supports keyboard activation with Enter and Space
- Disabled state is properly conveyed to assistive technology
