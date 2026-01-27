---
title: Dropdown
description: Floating panel triggered by a button
---

The `bp-dropdown` component displays content in a floating panel that appears when a trigger element is clicked. It's commonly used for menus, action lists, and contextual options.

## Import

```javascript
import 'blueprint/components/dropdown';
```

## Examples

### Default

<div class="component-preview">
  <bp-dropdown>
    <bp-button slot="trigger">Open Menu</bp-button>
    <bp-menu slot="content">
      <bp-menu-item value="edit">Edit</bp-menu-item>
      <bp-menu-item value="duplicate">Duplicate</bp-menu-item>
      <bp-menu-item value="delete">Delete</bp-menu-item>
    </bp-menu>
  </bp-dropdown>
</div>

```html
<bp-dropdown>
  <bp-button slot="trigger">Open Menu</bp-button>
  <bp-menu slot="content">
    <bp-menu-item value="edit">Edit</bp-menu-item>
    <bp-menu-item value="duplicate">Duplicate</bp-menu-item>
    <bp-menu-item value="delete">Delete</bp-menu-item>
  </bp-menu>
</bp-dropdown>
```

### Placement Options

<div class="component-preview">
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <bp-dropdown placement="bottom-start">
      <bp-button slot="trigger">Bottom Start</bp-button>
      <div slot="content" style="padding: 1rem;">Dropdown content</div>
    </bp-dropdown>
    <bp-dropdown placement="bottom-end">
      <bp-button slot="trigger">Bottom End</bp-button>
      <div slot="content" style="padding: 1rem;">Dropdown content</div>
    </bp-dropdown>
    <bp-dropdown placement="top">
      <bp-button slot="trigger">Top</bp-button>
      <div slot="content" style="padding: 1rem;">Dropdown content</div>
    </bp-dropdown>
  </div>
</div>

```html
<bp-dropdown placement="bottom-start">...</bp-dropdown>
<bp-dropdown placement="bottom-end">...</bp-dropdown>
<bp-dropdown placement="top">...</bp-dropdown>
<bp-dropdown placement="left">...</bp-dropdown>
<bp-dropdown placement="right">...</bp-dropdown>
```

### With Arrow

<div class="component-preview">
  <bp-dropdown arrow>
    <bp-button slot="trigger">With Arrow</bp-button>
    <div slot="content" style="padding: 1rem;">
      Arrow points to the trigger
    </div>
  </bp-dropdown>
</div>

```html
<bp-dropdown arrow>
  <bp-button slot="trigger">With Arrow</bp-button>
  <div slot="content">Arrow points to the trigger</div>
</bp-dropdown>
```

### Custom Distance

<div class="component-preview">
  <bp-dropdown distance="16">
    <bp-button slot="trigger">16px Distance</bp-button>
    <div slot="content" style="padding: 1rem;">More space from trigger</div>
  </bp-dropdown>
</div>

```html
<bp-dropdown distance="16">...</bp-dropdown>
```

### Stay Open on Select

<div class="component-preview">
  <bp-dropdown close-on-select="false">
    <bp-button slot="trigger">Multi-Select</bp-button>
    <bp-menu slot="content">
      <bp-menu-item value="1">Option 1</bp-menu-item>
      <bp-menu-item value="2">Option 2</bp-menu-item>
      <bp-menu-item value="3">Option 3</bp-menu-item>
    </bp-menu>
  </bp-dropdown>
</div>

```html
<bp-dropdown close-on-select="false">...</bp-dropdown>
```

### Disabled

<div class="component-preview">
  <bp-dropdown disabled>
    <bp-button slot="trigger">Disabled</bp-button>
    <div slot="content">This won't open</div>
  </bp-dropdown>
</div>

```html
<bp-dropdown disabled>...</bp-dropdown>
```

### Controlled State

<div class="component-preview">
  <bp-dropdown id="controlled-dropdown">
    <bp-button slot="trigger">Controlled</bp-button>
    <div slot="content" style="padding: 1rem;">
      <p>Controlled dropdown</p>
      <bp-button size="small" onclick="this.closest('bp-dropdown').hide()">Close</bp-button>
    </div>
  </bp-dropdown>
</div>

```javascript
const dropdown = document.querySelector('#controlled-dropdown');

// Programmatic control
dropdown.show();
dropdown.hide();
dropdown.toggle();
```

## API Reference

### Properties

| Property              | Type                                                                                                   | Default          | Description                          |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------------ |
| `open`                | `boolean`                                                                                              | `false`          | Whether the dropdown is open         |
| `placement`           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'bottom-start'` | Position of the panel                |
| `closeOnClickOutside` | `boolean`                                                                                              | `true`           | Close when clicking outside          |
| `closeOnEscape`       | `boolean`                                                                                              | `true`           | Close when pressing Escape           |
| `closeOnSelect`       | `boolean`                                                                                              | `true`           | Close when an item is selected       |
| `disabled`            | `boolean`                                                                                              | `false`          | Disable the dropdown                 |
| `distance`            | `number`                                                                                               | `4`              | Space between trigger and panel (px) |
| `arrow`               | `boolean`                                                                                              | `false`          | Show arrow pointing to trigger       |
| `panelRole`           | `'menu' \| 'dialog' \| 'listbox'`                                                                      | `'menu'`         | ARIA role for the panel              |

### Methods

| Method     | Description              |
| ---------- | ------------------------ |
| `show()`   | Open the dropdown        |
| `hide()`   | Close the dropdown       |
| `toggle()` | Toggle open/closed state |

### Events

| Event       | Detail     | Description                |
| ----------- | ---------- | -------------------------- |
| `bp-show`   | -          | Fired when dropdown opens  |
| `bp-hide`   | -          | Fired when dropdown closes |
| `bp-toggle` | `{ open }` | Fired on open/close toggle |

### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| (default) | Trigger element        |
| `content` | Dropdown panel content |

### CSS Parts

| Part      | Description              |
| --------- | ------------------------ |
| `trigger` | Trigger button container |
| `panel`   | Dropdown panel container |

### Keyboard Navigation

- **Enter/Space**: Toggle dropdown on trigger
- **Arrow Down**: Open dropdown (when closed)
- **Escape**: Close dropdown
- **Tab**: Navigate within panel, closes on blur

### Accessibility

- Uses appropriate ARIA attributes (`aria-expanded`, `aria-haspopup`)
- Focus returns to trigger on close
- Supports keyboard navigation
