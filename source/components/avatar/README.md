# Avatar

An avatar component that displays user profile images with fallback to initials or a default icon.

## Features

- Image display with error handling
- Initials fallback when no image is provided
- Default icon fallback when no image or initials
- Multiple sizes (xs, sm, md, lg, xl)
- Multiple shapes (circle, square)
- Status indicators (online, offline, busy, away)
- Interactive states with clickable mode
- Tooltip support via name property
- Vibrant colored backgrounds for initials
- CSS parts for advanced styling
- Accessible with alt text, ARIA labels, and proper roles
- Uses design tokens for consistent theming

## Usage

```html
<!-- Avatar with image -->
<bp-avatar src="https://example.com/avatar.jpg" alt="John Doe"></bp-avatar>

<!-- Avatar with initials -->
<bp-avatar initials="JD"></bp-avatar>

<!-- Avatar with fallback icon (no src or initials) -->
<bp-avatar></bp-avatar>

<!-- Large square avatar -->
<bp-avatar size="lg" shape="square" initials="AB"></bp-avatar>

<!-- Small circular avatar with image -->
<bp-avatar size="sm" src="https://example.com/user.jpg" alt="User"></bp-avatar>

<!-- Avatar with status indicator -->
<bp-avatar initials="JD" status="online"></bp-avatar>

<!-- Clickable avatar with tooltip -->
<bp-avatar
  initials="JD"
  clickable
  name="John Doe"
  @click="${handleClick}"
></bp-avatar>

<!-- Extra large avatar for profile pages -->
<bp-avatar size="xl" initials="AB" status="busy"></bp-avatar>
```

## API

### Properties

| Property    | Type                                                     | Default     | Description                                     |
| ----------- | -------------------------------------------------------- | ----------- | ----------------------------------------------- |
| `src`       | `string`                                                 | `''`        | Image source URL for the avatar.                |
| `alt`       | `string`                                                 | `''`        | Alt text for the avatar image (accessibility).  |
| `initials`  | `string`                                                 | `''`        | Initials to display when no image is provided.  |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                   | `'md'`      | Size of the avatar.                             |
| `shape`     | `'circle' \| 'square'`                                   | `'circle'`  | Shape of the avatar.                            |
| `status`    | `'online' \| 'offline' \| 'busy' \| 'away' \| undefined` | `undefined` | Status indicator for the avatar.                |
| `clickable` | `boolean`                                                | `false`     | Makes the avatar interactive with hover states. |
| `name`      | `string`                                                 | `''`        | Name for tooltip display on hover.              |

### Events

This component does not emit any events.

### Slots

This component does not use slots.

### CSS Parts

| Part       | Description                                   |
| ---------- | --------------------------------------------- |
| `avatar`   | The outer container element                   |
| `image`    | The image element (when src is provided)      |
| `initials` | The initials element (when initials are used) |
| `fallback` | The fallback bp-icon element (users icon)     |
| `status`   | The status indicator element                  |

## Design Tokens Used

**Colors:**

- `--bp-color-primary` - Background color for initials/fallback avatars
- `--bp-color-text-inverse` - Text color for initials on colored background
- `--bp-color-surface` - Background color for image avatars
- `--bp-color-text` - Text color for image contexts
- `--bp-color-success` - Online status indicator
- `--bp-color-error` - Busy status indicator
- `--bp-color-warning` - Away status indicator
- `--bp-color-border-strong` - Offline status indicator
- `--bp-color-surface-elevated` - Status indicator border
- `--bp-color-focus` - Focus outline color

**Spacing:**

- `--bp-spacing-6` - Extra small avatar size (24px)
- `--bp-spacing-8` - Small avatar size (32px)
- `--bp-spacing-10` - Medium avatar size (40px)
- `--bp-spacing-12` - Large avatar size (48px)
- `--bp-spacing-16` - Extra large avatar size (64px)

**Typography:**

- `--bp-font-family-sans` - Font family for initials
- `--bp-font-weight-semibold` - Font weight for initials
- Font sizes scale proportionally: 10px (xs), 13px (sm), 16px (md), 19px (lg), 26px (xl)
- Letter spacing: 0.02em for better legibility

**Borders:**

- `--bp-border-radius-full` - Circle shape
- `--bp-border-radius-sm` - Square shape (2px for more distinct corners)

**Motion:**

- `--bp-duration-fast` - Transition duration for hover/focus states

## Accessibility

- **Image Alt Text:**
  - Always provide `alt` attribute when using `src` for proper screen reader support
  - Alt text should describe the person or purpose of the avatar

- **Initials as Images:**
  - Initials have `role="img"` to indicate they represent a visual element
  - `aria-label` provides context for screen readers (uses `alt` prop or defaults to "User avatar")

- **ARIA Attributes:**
  - Fallback uses bp-icon component with `users` icon and `aria-label="User avatar"` for screen reader context

- **Visual Considerations:**
  - High contrast between initials and background
  - Border provides visual definition against various backgrounds
  - Initials are automatically uppercased for consistency

## Behavior

**Image Loading:**

- When `src` is provided and image loads successfully, the image is displayed
- If image fails to load, component falls back to initials (if provided) or users icon (bp-icon component)
- Image errors are tracked internally without mutating the `src` property
- When `src` changes, error state is reset automatically
- Image has `object-fit: cover` to maintain aspect ratio

**Display Priority:**

1. Image (if `src` is provided and loads successfully)
2. Initials (if no image and `initials` is provided)
3. Users icon via bp-icon (if no image and no initials)
