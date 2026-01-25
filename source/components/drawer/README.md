# Drawer

A slide-in panel component that can appear from any edge of the viewport. Supports both overlay mode (modal-like with backdrop) and inline mode (always visible sidebar as part of document flow).

## Features

- Slide in from left, right, top, or bottom edges
- Multiple size options (small, medium, large, full)
- Overlay mode with backdrop and focus trapping
- Inline mode for persistent sidebars in document flow
- Automatic body scroll lock in overlay mode
- Escape key to close (configurable)
- Click backdrop to close (configurable)
- Header, body, and footer slots
- Focus management for accessibility
- CSS parts for styling customization

## Usage

### Basic Overlay Drawer

```html
<bp-drawer id="nav-drawer" label="Navigation">
  <h2 slot="header">Navigation</h2>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</bp-drawer>

<button onclick="document.getElementById('nav-drawer').show()">
  Open Menu
</button>
```

### Different Placements

```html
<!-- Left (default) -->
<bp-drawer placement="left">Slides in from left</bp-drawer>

<!-- Right -->
<bp-drawer placement="right">Slides in from right</bp-drawer>

<!-- Top -->
<bp-drawer placement="top">Slides down from top</bp-drawer>

<!-- Bottom -->
<bp-drawer placement="bottom">Slides up from bottom</bp-drawer>
```

### Inline Sidebar (Always Visible)

```html
<div style="display: flex;">
  <bp-drawer inline placement="left" size="small">
    <h3 slot="header">Sidebar</h3>
    <nav>
      <a href="/">Dashboard</a>
      <a href="/settings">Settings</a>
    </nav>
  </bp-drawer>
  <main style="flex: 1;">Main content area</main>
</div>
```

### With Footer Actions

```html
<bp-drawer id="settings-drawer" label="Settings">
  <h2 slot="header">Settings</h2>
  <form>
    <!-- Form fields -->
  </form>
  <div slot="footer">
    <bp-button variant="secondary" onclick="this.closest('bp-drawer').hide()">
      Cancel
    </bp-button>
    <bp-button variant="primary">Save</bp-button>
  </div>
</bp-drawer>
```

### Programmatic Control

```javascript
const drawer = document.querySelector('bp-drawer');

// Open the drawer
drawer.show();

// Close the drawer
drawer.hide('api');

// Toggle open/closed
drawer.toggle();

// Listen for events
drawer.addEventListener('bp-close', (e) => {
  console.log('Closed by:', e.detail.reason);
  // reason: 'escape' | 'backdrop' | 'close-button' | 'api'
});
```

## API

### Properties

| Property          | Type                                       | Default    | Description                                                       |
| ----------------- | ------------------------------------------ | ---------- | ----------------------------------------------------------------- |
| `open`            | `boolean`                                  | `false`    | Whether the drawer is open                                        |
| `placement`       | `'left' \| 'right' \| 'top' \| 'bottom'`   | `'left'`   | Which edge the drawer slides in from                              |
| `size`            | `'small' \| 'medium' \| 'large' \| 'full'` | `'medium'` | Size of the drawer (width for left/right, height for top/bottom)  |
| `showClose`       | `boolean`                                  | `true`     | Whether to show the close button                                  |
| `closeOnBackdrop` | `boolean`                                  | `true`     | Whether clicking the backdrop closes the drawer                   |
| `closeOnEscape`   | `boolean`                                  | `true`     | Whether pressing Escape closes the drawer                         |
| `showBackdrop`    | `boolean`                                  | `true`     | Whether to show the backdrop overlay                              |
| `label`           | `string`                                   | `''`       | Accessible label for the drawer                                   |
| `inline`          | `boolean`                                  | `false`    | Renders as inline sidebar (always visible, part of document flow) |

### Methods

| Method     | Parameters                                                   | Description               |
| ---------- | ------------------------------------------------------------ | ------------------------- |
| `show()`   | -                                                            | Open the drawer           |
| `hide()`   | `reason?: 'escape' \| 'backdrop' \| 'close-button' \| 'api'` | Close the drawer          |
| `toggle()` | -                                                            | Toggle drawer open/closed |

### Events

| Event            | Detail                                                          | Description                               |
| ---------------- | --------------------------------------------------------------- | ----------------------------------------- |
| `bp-open`        | -                                                               | Fired when the drawer opens               |
| `bp-close`       | `{ reason: 'escape' \| 'backdrop' \| 'close-button' \| 'api' }` | Fired when the drawer closes (cancelable) |
| `bp-after-open`  | -                                                               | Fired after open animation completes      |
| `bp-after-close` | -                                                               | Fired after close animation completes     |

### Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| (default) | Main content in the drawer body       |
| `header`  | Header content (e.g., title)          |
| `footer`  | Footer content (e.g., action buttons) |

### CSS Parts

| Part           | Description                         |
| -------------- | ----------------------------------- |
| `drawer`       | The drawer container                |
| `backdrop`     | The backdrop overlay (overlay mode) |
| `panel`        | The drawer panel                    |
| `header`       | The header section                  |
| `body`         | The body/content section            |
| `footer`       | The footer section                  |
| `close-button` | The close button                    |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Panel background
- `--bp-color-text` - Text color
- `--bp-color-text-muted` - Close button color
- `--bp-color-border` - Header/footer borders
- `--bp-color-focus` - Focus ring color
- `--bp-color-surface-subdued` - Close button hover background
- `--bp-font-family` - Typography
- `--bp-shadow-lg` - Panel shadow

### Universal Tokens (Infrastructure)

- `--bp-spacing-md` - Header padding
- `--bp-spacing-lg` - Body padding
- `--bp-spacing-xl` - Close button size
- `--bp-spacing-24`, `--bp-spacing-16`, `--bp-spacing-8` - Size calculations
- `--bp-breakpoint-sm` - Large size width
- `--bp-font-size-base` - Base text size
- `--bp-font-size-lg` - Header text size
- `--bp-font-weight-semibold` - Header font weight
- `--bp-border-width` - Border thickness
- `--bp-border-radius-sm`, `--bp-border-radius-md` - Border roundness
- `--bp-transition-base`, `--bp-transition-fast` - Animations
- `--bp-z-modal` - Z-index for overlay mode
- `--bp-focus-width`, `--bp-focus-style`, `--bp-focus-offset` - Focus indicators

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- [Describe ARIA attributes]
- [Describe keyboard support]
- [Describe screen reader behavior]
