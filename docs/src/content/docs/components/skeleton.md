---
title: Skeleton
description: Placeholder loading component for content
---

The `bp-skeleton` component displays placeholder shapes while content is loading. Use skeletons to improve perceived performance and reduce layout shift.

## Import

```javascript
import 'blueprint/components/skeleton';
```

## Examples

### Default

<div class="component-preview">
  <bp-skeleton></bp-skeleton>
</div>

```html
<bp-skeleton></bp-skeleton>
```

### Variants

<div class="component-preview">
  <div class="component-preview-row">
    <bp-skeleton variant="text" width="200px"></bp-skeleton>
    <bp-skeleton variant="circular" width="48px" height="48px"></bp-skeleton>
    <bp-skeleton variant="rectangular" width="100px" height="60px"></bp-skeleton>
  </div>
</div>

```html
<bp-skeleton variant="text" width="200px"></bp-skeleton>
<bp-skeleton variant="circular" width="48px" height="48px"></bp-skeleton>
<bp-skeleton variant="rectangular" width="100px" height="60px"></bp-skeleton>
```

### Custom Dimensions

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bp-skeleton width="100%" height="20px"></bp-skeleton>
    <bp-skeleton width="80%" height="20px"></bp-skeleton>
    <bp-skeleton width="60%" height="20px"></bp-skeleton>
  </div>
</div>

```html
<bp-skeleton width="100%" height="20px"></bp-skeleton>
<bp-skeleton width="80%" height="20px"></bp-skeleton>
<bp-skeleton width="60%" height="20px"></bp-skeleton>
```

### Without Animation

<div class="component-preview">
  <bp-skeleton width="200px" height="20px" animated="false"></bp-skeleton>
</div>

```html
<bp-skeleton width="200px" animated="false"></bp-skeleton>
```

### Card Skeleton Example

<div class="component-preview">
  <div style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--bp-color-border); border-radius: 0.5rem;">
    <bp-skeleton variant="circular" width="48px" height="48px"></bp-skeleton>
    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
      <bp-skeleton variant="text" width="60%"></bp-skeleton>
      <bp-skeleton variant="text" width="100%"></bp-skeleton>
      <bp-skeleton variant="text" width="80%"></bp-skeleton>
    </div>
  </div>
</div>

```html
<div style="display: flex; gap: 1rem;">
  <bp-skeleton variant="circular" width="48px" height="48px"></bp-skeleton>
  <div style="flex: 1;">
    <bp-skeleton variant="text" width="60%"></bp-skeleton>
    <bp-skeleton variant="text" width="100%"></bp-skeleton>
    <bp-skeleton variant="text" width="80%"></bp-skeleton>
  </div>
</div>
```

### Image Skeleton

<div class="component-preview">
  <bp-skeleton variant="rectangular" width="300px" height="200px"></bp-skeleton>
</div>

```html
<bp-skeleton variant="rectangular" width="300px" height="200px"></bp-skeleton>
```

## API Reference

### Properties

| Property   | Type                                    | Default    | Description          |
| ---------- | --------------------------------------- | ---------- | -------------------- |
| `variant`  | `'text' \| 'circular' \| 'rectangular'` | `'text'`   | Shape variant        |
| `width`    | `string`                                | `'100%'`   | Width (CSS value)    |
| `height`   | `string`                                | `'1em'`    | Height (CSS value)   |
| `animated` | `boolean`                               | `true`     | Show pulse animation |
| `size`     | `'small' \| 'medium' \| 'large'`        | `'medium'` | Preset size          |

### CSS Parts

| Part       | Description          |
| ---------- | -------------------- |
| `skeleton` | The skeleton element |

### Usage Tips

- Match skeleton dimensions to actual content for minimal layout shift
- Use multiple skeletons to represent complex layouts
- Consider disabling animation for users who prefer reduced motion
