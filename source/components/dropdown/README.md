# Dropdown

A generic dropdown component that displays content in a floating panel when triggered. Works with any content including menus, forms, or custom HTML.

## Features

- **Flexible Content**: Display menus, forms, or any custom content
- **Multiple Placements**: 8 placement options (top, bottom, left, right with start/end variants)
- **Keyboard Navigation**: Open with Enter/Space/ArrowDown, close with Escape
- **Click Outside**: Optionally close when clicking outside the dropdown
- **Auto-Close**: Optionally close when selecting menu items
- **Arrow Indicator**: Optional arrow pointing to the trigger
- **Accessible**: Full ARIA support with proper roles and states
- **Public Methods**: Programmatic control via `show()`, `hide()`, and `toggle()`

## Usage

### Basic Dropdown with Menu

```html
<bp-dropdown>
  <bp-button>Open Menu</bp-button>
  <bp-menu slot="content">
    <bp-menu-item value="edit">Edit</bp-menu-item>
    <bp-menu-item value="duplicate">Duplicate</bp-menu-item>
    <bp-menu-divider></bp-menu-divider>
    <bp-menu-item value="delete">Delete</bp-menu-item>
  </bp-menu>
</bp-dropdown>
```

### With Arrow

```html
<bp-dropdown arrow distance="8">
  <bp-button>With Arrow</bp-button>
  <bp-menu slot="content">
    <bp-menu-item value="option1">Option 1</bp-menu-item>
    <bp-menu-item value="option2">Option 2</bp-menu-item>
  </bp-menu>
</bp-dropdown>
```

### Custom Placement

```html
<bp-dropdown placement="top-end">
  <bp-button>Top End</bp-button>
  <bp-menu slot="content">
    <bp-menu-item value="option1">Option 1</bp-menu-item>
  </bp-menu>
</bp-dropdown>
```

### Custom Content

```html
<bp-dropdown close-on-select="false">
  <bp-button>Custom Content</bp-button>
  <div slot="content" style="padding: 16px;">
    <p>Any HTML content can go here</p>
    <bp-button data-dropdown-close>Close</bp-button>
  </div>
</bp-dropdown>
```

### Programmatic Control

```javascript
const dropdown = document.querySelector('bp-dropdown');

// Open the dropdown
dropdown.show();

// Close the dropdown
dropdown.hide();

// Toggle open/closed
dropdown.toggle();
```

## API

### Properties

| Property              | Type      | Default          | Description                                      |
| --------------------- | --------- | ---------------- | ------------------------------------------------ |
| `open`                | `boolean` | `false`          | Whether the dropdown is open                     |
| `placement`           | `string`  | `'bottom-start'` | Placement of the panel (see Placement Options)   |
| `closeOnClickOutside` | `boolean` | `true`           | Whether to close when clicking outside           |
| `closeOnEscape`       | `boolean` | `true`           | Whether to close when pressing Escape            |
| `closeOnSelect`       | `boolean` | `true`           | Whether to close when a menu item is clicked     |
| `disabled`            | `boolean` | `false`          | Whether the dropdown is disabled                 |
| `distance`            | `number`  | `4`              | Distance in pixels between trigger and panel     |
| `arrow`               | `boolean` | `false`          | Whether to show an arrow pointing to the trigger |
| `panelRole`           | `string`  | `'menu'`         | ARIA role for panel (menu/dialog/listbox)        |

### Placement Options

| Placement      | Description                     |
| -------------- | ------------------------------- |
| `top`          | Above trigger, centered         |
| `top-start`    | Above trigger, aligned to start |
| `top-end`      | Above trigger, aligned to end   |
| `bottom`       | Below trigger, centered         |
| `bottom-start` | Below trigger, aligned to start |
| `bottom-end`   | Below trigger, aligned to end   |
| `left`         | Left of trigger, centered       |
| `right`        | Right of trigger, centered      |

### Methods

| Method     | Description                      |
| ---------- | -------------------------------- |
| `show()`   | Opens the dropdown               |
| `hide()`   | Closes the dropdown              |
| `toggle()` | Toggles the dropdown open/closed |

### Events

| Event       | Detail           | Description                        |
| ----------- | ---------------- | ---------------------------------- |
| `bp-show`   | -                | Fired when the dropdown opens      |
| `bp-hide`   | -                | Fired when the dropdown closes     |
| `bp-toggle` | `{ open: bool }` | Fired when the dropdown is toggled |

### Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| (default) | The trigger element (e.g., a button)     |
| `content` | Content to display in the dropdown panel |

### CSS Parts

| Part      | Description                  |
| --------- | ---------------------------- |
| `trigger` | The trigger button container |
| `panel`   | The dropdown panel container |

## Accessibility

- Trigger has `role="button"` with `aria-haspopup="true"`
- `aria-expanded` reflects the open state
- `aria-disabled` set when disabled
- Panel role configurable via `panelRole` property (defaults to `menu`)
- Escape key closes the dropdown and returns focus to trigger
- Enter, Space, and ArrowDown keys open the dropdown
- Visible focus indicator on the trigger

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface-elevated` - Panel background
- `--bp-color-border` - Panel border color
- `--bp-color-focus` - Focus indicator color
- `--bp-border-radius-lg` - Panel border radius
- `--bp-border-radius-sm` - Trigger focus radius
- `--bp-border-width` - Border thickness
- `--bp-shadow-lg` - Panel shadow

### Universal Tokens (Infrastructure)

- `--bp-spacing-0-5` - Focus outline width
- `--bp-spacing-1` - Panel padding and arrow positioning
- `--bp-spacing-2` - Arrow size
- `--bp-spacing-20` - Minimum panel width
- `--bp-duration-fast` - Animation duration
- `--bp-ease-out` - Animation easing

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- [Describe ARIA attributes]
- [Describe keyboard support]
- [Describe screen reader behavior]
