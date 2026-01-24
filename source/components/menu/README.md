# Menu

A composable menu system for displaying lists of actions or options. Includes three components: `bp-menu` (container), `bp-menu-item` (action items), and `bp-menu-divider` (separators).

## Features

- **Composable Design** - Build menus with `bp-menu`, `bp-menu-item`, and `bp-menu-divider` components
- **Keyboard Navigation** - Full arrow key, Home/End, Enter/Space support
- **Submenu Support** - Indicate nested menus with `hasSubmenu` property
- **Keyboard Shortcuts** - Display shortcut hints with `shortcut` property
- **Icon Support** - Prefix and suffix slots for icons and custom content
- **Size Variants** - Small, medium, and large sizes
- **Disabled States** - Disable individual menu items
- **Fully Accessible** - Proper ARIA roles and keyboard support

## Usage

### Basic Menu

```html
<bp-menu>
  <bp-menu-item value="cut">Cut</bp-menu-item>
  <bp-menu-item value="copy">Copy</bp-menu-item>
  <bp-menu-item value="paste">Paste</bp-menu-item>
</bp-menu>
```

### Menu with Dividers

```html
<bp-menu>
  <bp-menu-item value="new">New File</bp-menu-item>
  <bp-menu-item value="open">Open</bp-menu-item>
  <bp-menu-divider></bp-menu-divider>
  <bp-menu-item value="save">Save</bp-menu-item>
  <bp-menu-item value="save-as">Save As...</bp-menu-item>
</bp-menu>
```

### Menu with Shortcuts

```html
<bp-menu>
  <bp-menu-item value="cut" shortcut="Ctrl+X">Cut</bp-menu-item>
  <bp-menu-item value="copy" shortcut="Ctrl+C">Copy</bp-menu-item>
  <bp-menu-item value="paste" shortcut="Ctrl+V">Paste</bp-menu-item>
</bp-menu>
```

### Menu with Icons

```html
<bp-menu>
  <bp-menu-item value="edit">
    <bp-icon slot="prefix" name="edit"></bp-icon>
    Edit
  </bp-menu-item>
  <bp-menu-item value="delete">
    <bp-icon slot="prefix" name="trash"></bp-icon>
    Delete
  </bp-menu-item>
</bp-menu>
```

### Menu with Submenu Indicator

```html
<bp-menu>
  <bp-menu-item value="format" hasSubmenu>Format</bp-menu-item>
  <bp-menu-item value="view" hasSubmenu>View</bp-menu-item>
</bp-menu>
```

### Disabled Items

```html
<bp-menu>
  <bp-menu-item value="undo" disabled>Undo</bp-menu-item>
  <bp-menu-item value="redo">Redo</bp-menu-item>
</bp-menu>
```

### Selected State

```html
<bp-menu>
  <bp-menu-item value="home">Home</bp-menu-item>
  <bp-menu-item value="about" selected>About</bp-menu-item>
  <bp-menu-item value="contact">Contact</bp-menu-item>
</bp-menu>
```

### Small Size

```html
<bp-menu size="small">
  <bp-menu-item value="option1">Option 1</bp-menu-item>
  <bp-menu-item value="option2">Option 2</bp-menu-item>
</bp-menu>
```

### Handling Selection

```javascript
const menu = document.querySelector('bp-menu');
menu.addEventListener('bp-menu-select', (e) => {
  console.log('Selected:', e.detail.value);
});
```

## API

### bp-menu Properties

| Property | Type     | Default  | Description |
| -------- | -------- | -------- | ----------- | ---------- | ------------------------------- |
| `size`   | `'small' | 'medium' | 'large'`    | `'medium'` | Size variant for all menu items |

### bp-menu Events

| Event            | Detail              | Description                             |
| ---------------- | ------------------- | --------------------------------------- |
| `bp-menu-select` | `{ value: string }` | Dispatched when a menu item is selected |

### bp-menu-item Properties

| Property     | Type      | Default  | Description                                  |
| ------------ | --------- | -------- | -------------------------------------------- | ---------- | ------------------------------------ |
| `value`      | `string`  | `''`     | Value associated with this menu item         |
| `disabled`   | `boolean` | `false`  | Whether the item is disabled                 |
| `selected`   | `boolean` | `false`  | Whether the item is selected/active          |
| `hasSubmenu` | `boolean` | `false`  | Whether the item has a submenu (shows arrow) |
| `shortcut`   | `string`  | `''`     | Keyboard shortcut hint to display            |
| `size`       | `'small'  | 'medium' | 'large'`                                     | `'medium'` | Size variant (inherited from parent) |

### bp-menu-item Events

| Event            | Detail              | Description                      |
| ---------------- | ------------------- | -------------------------------- |
| `bp-menu-select` | `{ value: string }` | Dispatched when item is selected |

### Slots

#### bp-menu

| Slot      | Description                                    |
| --------- | ---------------------------------------------- |
| (default) | Menu items (`bp-menu-item`, `bp-menu-divider`) |

#### bp-menu-item

| Slot      | Description                                  |
| --------- | -------------------------------------------- |
| (default) | Item label content                           |
| `prefix`  | Content before the label (typically an icon) |
| `suffix`  | Content after the label (custom content)     |

### CSS Parts

#### bp-menu

| Part        | Description        |
| ----------- | ------------------ |
| `container` | The menu container |

#### bp-menu-item

| Part     | Description               |
| -------- | ------------------------- |
| `base`   | The menu item container   |
| `prefix` | The prefix slot container |
| `label`  | The label container       |
| `suffix` | The suffix slot container |

#### bp-menu-divider

| Part      | Description         |
| --------- | ------------------- |
| `divider` | The divider element |

## Design Tokens Used

### Colors

- `--bp-color-surface-elevated` - Menu background
- `--bp-color-surface` - Item hover background
- `--bp-color-surface-subdued` - Item active background
- `--bp-color-text` - Item text color
- `--bp-color-text-muted` - Shortcut and arrow color
- `--bp-color-border` - Menu border and divider color
- `--bp-color-primary` - Focus outline color

### Spacing

- `--bp-spacing-xs` - Menu padding, item margin
- `--bp-spacing-sm` - Item padding, gaps
- `--bp-spacing-md` - Item padding
- `--bp-spacing-lg` - Large item padding
- `--bp-spacing-12` - Small menu min-width
- `--bp-spacing-16` - Medium menu min-width
- `--bp-spacing-20` - Large menu min-width

### Typography

- `--bp-font-sans` - Font family
- `--bp-font-mono` - Shortcut font family
- `--bp-font-size-sm` - Small size, shortcut text
- `--bp-font-size-base` - Medium size
- `--bp-font-size-lg` - Large size, arrow icon
- `--bp-font-weight-normal` - Item font weight
- `--bp-line-height-normal` - Item line height

### Borders

- `--bp-border-width` - Menu border, focus outline, divider height
- `--bp-border-radius-sm` - Item border radius
- `--bp-border-radius-md` - Menu border radius

### Shadows

- `--bp-shadow-lg` - Menu shadow

### Transitions

- `--bp-transition-fast` - Item background transition

## Accessibility

- `bp-menu` has `role="menu"` for proper menu semantics
- `bp-menu-item` has `role="menuitem"` with proper tabindex
- `bp-menu-divider` has `role="separator"`
- Disabled items have `aria-disabled="true"` and `tabindex="-1"`
- Full keyboard navigation support:
  - **Arrow Down/Up**: Navigate between items
  - **Home/End**: Jump to first/last item
  - **Enter/Space**: Activate focused item
- Focus is visually indicated with primary color outline
- Disabled items are skipped during keyboard navigation
