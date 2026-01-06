# Alert

A notification message component to display important information, feedback, or status updates to users.

## Features

- 4 semantic variants (info, success, warning, error)
- Optional dismiss functionality
- Built-in icons or custom icon slot
- ARIA-compliant for screen readers
- Flexible content through default slot
- Fully customizable via CSS parts
- Keyboard accessible

## Usage

```html
<!-- Basic info alert -->
<bp-alert>Your changes have been saved automatically.</bp-alert>

<!-- Success alert with icon -->
<bp-alert variant="success" showIcon> Profile updated successfully! </bp-alert>

<!-- Dismissible warning alert -->
<bp-alert variant="warning" dismissible showIcon>
  Your session will expire in 5 minutes.
</bp-alert>

<!-- Error alert with custom icon -->
<bp-alert variant="error" dismissible>
  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
    />
  </svg>
  Failed to connect to server. Please try again.
</bp-alert>

<!-- Alert with title -->
<bp-alert variant="warning" showIcon>
  <strong slot="title">Session Expiring Soon</strong>
  Your session will expire in 5 minutes due to inactivity.
</bp-alert>
```

## API

### Properties

| Property      | Type           | Default  | Description                                    |
| ------------- | -------------- | -------- | ---------------------------------------------- |
| `variant`     | `AlertVariant` | `'info'` | Visual variant indicating the type of alert    |
| `dismissible` | `boolean`      | `false`  | Whether the alert can be dismissed by the user |
| `showIcon`    | `boolean`      | `false`  | Whether to show a default icon for the variant |

**AlertVariant:** `'info' | 'success' | 'warning' | 'error'`

### Events

| Event      | Detail                   | Description                                      |
| ---------- | ------------------------ | ------------------------------------------------ |
| `bp-close` | `{ variant, timestamp }` | Fired when alert is dismissed (cancelable event) |

### Slots

| Slot      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| (default) | The alert message content                                               |
| `title`   | Optional title/heading for the alert (appears before message)           |
| `icon`    | Custom icon to display (overrides default icon when `showIcon` is true) |

### CSS Parts

| Part           | Description                           |
| -------------- | ------------------------------------- |
| `alert`        | The alert container                   |
| `icon`         | The icon container                    |
| `message`      | The message content container         |
| `close-button` | The dismiss button (when dismissible) |

## Design Tokens Used

- **Colors:** `--bp-blue-50`, `--bp-blue-400`, `--bp-blue-900`, `--bp-green-100`, `--bp-green-600`, `--bp-green-900`, `--bp-yellow-200`, `--bp-yellow-700`, `--bp-yellow-900`, `--bp-red-200`, `--bp-red-700`, `--bp-red-900`
- **Spacing:** `--bp-spacing-md`, `--bp-spacing-lg`, `--bp-spacing-sm`, `--bp-spacing-xs`, `--bp-spacing-2xs`
- **Typography:** `--bp-font-family-sans`, `--bp-font-size-base`, `--bp-font-weight-semibold`, `--bp-line-height-relaxed`, `--bp-line-height-tight`
- **Borders:** `--bp-border-radius-md`, `--bp-border-radius-sm`, `--bp-border-width`
- **Shadows:** `--bp-shadow-sm`
- **Focus:** `--bp-focus-ring`, `--bp-focus-offset`
- **Transitions:** `--bp-transition-fast`, `--bp-transition-base`

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Uses `aria-live="polite"` to announce changes without interrupting
- Close button includes `aria-label="Close alert"` for clarity
- Semantic color variants help convey meaning beyond color alone
- Keyboard accessible dismiss button
