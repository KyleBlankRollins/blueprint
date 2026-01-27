---
title: Breadcrumb
description: Navigation trail showing hierarchical page location
---

The `bp-breadcrumb` component displays a navigation trail that helps users understand their current location within a site hierarchy and navigate back to parent pages.

## Import

```javascript
import 'blueprint/components/breadcrumb';
```

## Examples

### Default

<div class="component-preview">
  <bp-breadcrumb>
    <a href="#">Home</a>
    <a href="#">Products</a>
    <a href="#">Electronics</a>
    <span>Laptops</span>
  </bp-breadcrumb>
</div>

```html
<bp-breadcrumb>
  <a href="#">Home</a>
  <a href="#">Products</a>
  <a href="#">Electronics</a>
  <span>Laptops</span>
</bp-breadcrumb>
```

### Programmatic Items

<div class="component-preview">
  <bp-breadcrumb id="breadcrumb-demo"></bp-breadcrumb>
</div>

```html
<bp-breadcrumb id="breadcrumb-demo"></bp-breadcrumb>

<script>
  document.querySelector('#breadcrumb-demo').items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', current: true },
  ];
</script>
```

### Separator Styles

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-breadcrumb separator="slash">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
    <bp-breadcrumb separator="chevron">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
    <bp-breadcrumb separator="arrow">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
    <bp-breadcrumb separator="dot">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
  </div>
</div>

```html
<bp-breadcrumb separator="slash">...</bp-breadcrumb>
<bp-breadcrumb separator="chevron">...</bp-breadcrumb>
<bp-breadcrumb separator="arrow">...</bp-breadcrumb>
<bp-breadcrumb separator="dot">...</bp-breadcrumb>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-breadcrumb size="small">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
    <bp-breadcrumb size="medium">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
    <bp-breadcrumb size="large">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Page</span>
    </bp-breadcrumb>
  </div>
</div>

```html
<bp-breadcrumb size="small">...</bp-breadcrumb>
<bp-breadcrumb size="medium">...</bp-breadcrumb>
<bp-breadcrumb size="large">...</bp-breadcrumb>
```

### With Icons

<div class="component-preview">
  <bp-breadcrumb id="breadcrumb-icons"></bp-breadcrumb>
</div>

```javascript
document.querySelector('#breadcrumb-icons').items = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
  { label: 'Profile', current: true, icon: 'user' },
];
```

### Collapsed (Max Items)

<div class="component-preview">
  <bp-breadcrumb max-items="4" id="breadcrumb-collapsed"></bp-breadcrumb>
</div>

```javascript
document.querySelector('#breadcrumb-collapsed').items = [
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/category/sub' },
  { label: 'Products', href: '/category/sub/products' },
  { label: 'Electronics', href: '/category/sub/products/electronics' },
  { label: 'Current Page', current: true },
];
```

## API Reference

### Properties

| Property           | Type                                       | Default        | Description                            |
| ------------------ | ------------------------------------------ | -------------- | -------------------------------------- |
| `items`            | `BreadcrumbItem[]`                         | `[]`           | Array of breadcrumb items              |
| `size`             | `'small' \| 'medium' \| 'large'`           | `'medium'`     | Size of the breadcrumb                 |
| `separator`        | `'slash' \| 'chevron' \| 'arrow' \| 'dot'` | `'slash'`      | Separator style between items          |
| `aria-label`       | `string`                                   | `'Breadcrumb'` | Accessible label for navigation        |
| `collapseOnMobile` | `boolean`                                  | `false`        | Collapse middle items on small screens |
| `maxItems`         | `number`                                   | `0`            | Max visible items (0 = no limit)       |

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
}
```

### Events

| Event                 | Detail            | Description                        |
| --------------------- | ----------------- | ---------------------------------- |
| `bp-breadcrumb-click` | `{ item, index }` | Fired when a breadcrumb is clicked |

### Slots

| Slot        | Description              |
| ----------- | ------------------------ |
| (default)   | Custom breadcrumb items  |
| `separator` | Custom separator content |

### CSS Parts

| Part           | Description                   |
| -------------- | ----------------------------- |
| `nav`          | The nav element wrapper       |
| `list`         | The ordered list element      |
| `item`         | Individual breadcrumb item    |
| `item-current` | The current/active item       |
| `link`         | Breadcrumb link element       |
| `separator`    | Separator between items       |
| `ellipsis`     | Ellipsis when items collapsed |

### Accessibility

- Uses `<nav>` element with `aria-label`
- Current page marked with `aria-current="page"`
- Semantic ordered list structure
- Keyboard navigable links
