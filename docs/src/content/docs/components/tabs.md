---
title: Tabs
description: Tabbed interface for organizing content into sections
---

The `bp-tabs` component organizes content into tabbed sections, allowing users to switch between different views without leaving the page.

## Import

```javascript
import 'blueprint/components/tabs';
```

## Examples

### Default

<div class="component-preview">
  <bp-tabs id="tabs-demo"></bp-tabs>
</div>

```html
<bp-tabs id="tabs-demo">
  <div data-tab-id="tab1">Content for Tab 1</div>
  <div data-tab-id="tab2">Content for Tab 2</div>
  <div data-tab-id="tab3">Content for Tab 3</div>
</bp-tabs>

<script>
  document.querySelector('#tabs-demo').tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];
</script>
```

### Variants

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-tabs variant="default" id="tabs-default"></bp-tabs>
    <bp-tabs variant="pills" id="tabs-pills"></bp-tabs>
    <bp-tabs variant="underline" id="tabs-underline"></bp-tabs>
  </div>
</div>

```html
<bp-tabs variant="default">...</bp-tabs>
<bp-tabs variant="pills">...</bp-tabs>
<bp-tabs variant="underline">...</bp-tabs>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-tabs size="small" id="tabs-small"></bp-tabs>
    <bp-tabs size="medium" id="tabs-medium"></bp-tabs>
    <bp-tabs size="large" id="tabs-large"></bp-tabs>
  </div>
</div>

```html
<bp-tabs size="small">...</bp-tabs>
<bp-tabs size="medium">...</bp-tabs>
<bp-tabs size="large">...</bp-tabs>
```

### Tab Placement

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-tabs placement="top" id="tabs-top"></bp-tabs>
    <bp-tabs placement="bottom" id="tabs-bottom"></bp-tabs>
  </div>
</div>

```html
<bp-tabs placement="top">...</bp-tabs>
<bp-tabs placement="bottom">...</bp-tabs>
<bp-tabs placement="start">...</bp-tabs>
<bp-tabs placement="end">...</bp-tabs>
```

### With Icons

<div class="component-preview">
  <bp-tabs id="tabs-icons"></bp-tabs>
</div>

```javascript
document.querySelector('#tabs-icons').tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];
```

### Disabled Tabs

<div class="component-preview">
  <bp-tabs id="tabs-disabled"></bp-tabs>
</div>

```javascript
document.querySelector('#tabs-disabled').tabs = [
  { id: 'active', label: 'Active Tab' },
  { id: 'disabled', label: 'Disabled Tab', disabled: true },
  { id: 'another', label: 'Another Tab' },
];
```

### Closable Tabs

<div class="component-preview">
  <bp-tabs id="tabs-closable"></bp-tabs>
</div>

```javascript
document.querySelector('#tabs-closable').tabs = [
  { id: 'file1', label: 'document.txt', closable: true },
  { id: 'file2', label: 'styles.css', closable: true },
  { id: 'file3', label: 'script.js', closable: true },
];
```

### Manual Activation

With `manual` mode, tabs are only activated when pressing Enter or Space:

<div class="component-preview">
  <bp-tabs manual id="tabs-manual"></bp-tabs>
</div>

```html
<bp-tabs manual>...</bp-tabs>
```

## API Reference

### Properties

| Property    | Type                                    | Default     | Description                      |
| ----------- | --------------------------------------- | ----------- | -------------------------------- |
| `value`     | `string`                                | `''`        | ID of the currently selected tab |
| `tabs`      | `TabItem[]`                             | `[]`        | Array of tab configurations      |
| `size`      | `'small' \| 'medium' \| 'large'`        | `'medium'`  | Size of the tabs                 |
| `variant`   | `'default' \| 'pills' \| 'underline'`   | `'default'` | Visual style variant             |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'`     | Position of tab list             |
| `disabled`  | `boolean`                               | `false`     | Disable all tabs                 |
| `manual`    | `boolean`                               | `false`     | Require Enter/Space to activate  |

### TabItem Interface

```typescript
interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
  closable?: boolean;
}
```

### Events

| Event           | Detail   | Description                     |
| --------------- | -------- | ------------------------------- |
| `bp-tab-change` | `{ id }` | Fired when selected tab changes |
| `bp-tab-close`  | `{ id }` | Fired when close button clicked |

### Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| (default) | Tab panels with `data-tab-id` attribute |
| `tab`     | Custom tab buttons                      |

### CSS Parts

| Part           | Description              |
| -------------- | ------------------------ |
| `tabs`         | Main container           |
| `tablist`      | Tab button list          |
| `tab`          | Individual tab button    |
| `tab-active`   | Currently active tab     |
| `tab-disabled` | Disabled tab             |
| `panels`       | Panel container          |
| `panel`        | Individual panel wrapper |

### Keyboard Navigation

- **Arrow Left/Up**: Focus previous tab
- **Arrow Right/Down**: Focus next tab
- **Home**: Focus first tab
- **End**: Focus last tab
- **Enter/Space**: Activate tab (in manual mode)
- **Delete**: Close tab (if closable)

### Accessibility

- Uses `role="tablist"` and `role="tab"` pattern
- `aria-selected` indicates active tab
- `aria-controls` links tabs to panels
- Panels have `aria-labelledby` pointing to tab
- Full keyboard navigation support
