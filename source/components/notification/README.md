# Notification

A non-blocking toast/notification component for displaying brief messages to users. Supports multiple variants, positions, auto-close functionality, and custom content through slots.

## Features

- **Four variants**: info, success, warning, error with distinct colors and icons
- **Customizable position**: top-right, top-left, bottom-right, bottom-left
- **Auto-close timer**: Optional duration for automatic dismissal
- **Closable**: Optional close button for manual dismissal
- **Slots**: Custom icon, content, and action button slots
- **CSS Parts**: Full styling control via shadow parts
- **Accessible**: ARIA live region, role="alert", keyboard support
- **Animated**: Smooth slide-in/out animations based on position

## Usage

### Basic Usage

```html
<bp-notification
  variant="info"
  open
  closable
  notificationTitle="Information"
  message="This is an informational notification."
></bp-notification>
```

### Success Notification

```html
<bp-notification
  variant="success"
  open
  closable
  notificationTitle="Success"
  message="Your file has been uploaded successfully."
></bp-notification>
```

### Auto-close Notification

```html
<bp-notification
  variant="success"
  open
  closable
  duration="3000"
  notificationTitle="Saved"
  message="Changes saved successfully."
></bp-notification>
```

### With Custom Content

```html
<bp-notification
  variant="warning"
  open
  closable
  notificationTitle="Session Expiring"
>
  <p>Your session will expire in 5 minutes.</p>
  <button slot="action">Extend Session</button>
</bp-notification>
```

### With Custom Icon

```html
<bp-notification variant="info" open closable notificationTitle="New Message">
  <svg slot="icon" width="20" height="20" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
  You have received a new message.
</bp-notification>
```

### Programmatic Control

```javascript
const notification = document.querySelector('bp-notification');

// Show the notification
notification.show();

// Hide the notification
notification.hide();
```

## API

### Properties

| Property            | Type                                                           | Default       | Description                                   |
| ------------------- | -------------------------------------------------------------- | ------------- | --------------------------------------------- |
| `variant`           | `'info' \| 'success' \| 'warning' \| 'error'`                  | `'info'`      | The visual style variant                      |
| `open`              | `boolean`                                                      | `false`       | Whether the notification is visible           |
| `closable`          | `boolean`                                                      | `false`       | Whether to show a close button                |
| `duration`          | `number`                                                       | `0`           | Auto-close duration in ms (0 = no auto-close) |
| `notificationTitle` | `string`                                                       | `''`          | The notification title text                   |
| `message`           | `string`                                                       | `''`          | The notification message text                 |
| `position`          | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Position of the notification on screen        |

### Methods

| Method   | Parameters | Returns | Description            |
| -------- | ---------- | ------- | ---------------------- |
| `show()` | None       | `void`  | Shows the notification |
| `hide()` | None       | `void`  | Hides the notification |

### Events

| Event      | Detail | Description                             |
| ---------- | ------ | --------------------------------------- |
| `bp-show`  | `{}`   | Emitted when the notification is shown  |
| `bp-hide`  | `{}`   | Emitted when the notification is hidden |
| `bp-close` | `{}`   | Emitted when close button is clicked    |

### Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| (default) | Custom content to display in the message area    |
| `icon`    | Custom icon to replace the default variant icon  |
| `action`  | Action button or link to display in notification |

### CSS Parts

| Part           | Description                |
| -------------- | -------------------------- |
| `base`         | The notification container |
| `icon`         | The icon wrapper           |
| `content`      | The content wrapper        |
| `message`      | The message text area      |
| `action`       | The action slot wrapper    |
| `close-button` | The close button           |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Notification background
- `--bp-color-text` - Primary text color
- `--bp-color-text-muted` - Message text color
- `--bp-color-border` - Notification border
- `--bp-color-info` - Info variant accent color
- `--bp-color-success` - Success variant accent color
- `--bp-color-warning` - Warning variant accent color
- `--bp-color-error` - Error variant accent color
- `--bp-shadow-lg` - Notification shadow
- `--bp-font-sans` - Typography

### Universal Tokens (Infrastructure)

- `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-md`, `--bp-spacing-lg` - Padding and gaps
- `--bp-font-size-sm`, `--bp-font-size-base` - Text sizes
- `--bp-font-weight-semibold` - Title weight
- `--bp-line-height-tight`, `--bp-line-height-relaxed` - Line spacing
- `--bp-border-radius-md` - Border roundness
- `--bp-transition-fast`, `--bp-transition-base` - Animation timing

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Uses `aria-live="polite"` for non-intrusive announcements
- Close button has `aria-label="Close notification"` for screen readers
- Supports keyboard navigation (Tab to close button, Enter/Space to close)
- Focus is managed appropriately when notification appears
- High contrast between text and background for readability
