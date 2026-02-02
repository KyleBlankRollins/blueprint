# Modal

Dialog overlay component for displaying content in a layer above the main page.

## Features

- Multiple size variants: sm, md, lg
- Backdrop overlay that blocks page interaction
- Built-in close button with icon
- ESC key support to close modal
- Click outside (backdrop) to close
- Focus trapping within modal when open
- Prevents body scroll when open
- Restores focus to triggering element on close
- Customizable header, body, and footer sections
- Comprehensive ARIA attributes for accessibility
- CSS parts for advanced styling
- Custom close event

## Usage

```html
<bp-modal open size="md">
  <h2 slot="header">Modal Title</h2>
  <p>This is the modal body content.</p>
  <div slot="footer">
    <bp-button variant="secondary">Cancel</bp-button>
    <bp-button variant="primary">Confirm</bp-button>
  </div>
</bp-modal>
```

### Opening and Closing

```javascript
const modal = document.querySelector('bp-modal');

// Open modal
modal.open = true;

// Close modal
modal.open = false;

// Listen for close event
modal.addEventListener('bp-close', () => {
  console.log('Modal was closed');
});
```

## API

### Properties

| Property         | Type                   | Default | Description                                    |
| ---------------- | ---------------------- | ------- | ---------------------------------------------- |
| `open`           | `boolean`              | `false` | Whether the modal is currently displayed       |
| `size`           | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant of the modal                      |
| `ariaLabelledby` | `string`               | `''`    | ID of element that labels the modal (for a11y) |

### Events

| Event      | Detail | Description                                                   |
| ---------- | ------ | ------------------------------------------------------------- |
| `bp-close` | none   | Fired when the modal is closed (via button, ESC, or backdrop) |

### Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `header`  | Content for the modal header (typically `<h2>`) |
| (default) | Main content area (modal body)                  |
| `footer`  | Footer content (typically action buttons)       |

### CSS Parts

| Part           | Description                           |
| -------------- | ------------------------------------- |
| `backdrop`     | The overlay backdrop behind the modal |
| `dialog`       | The main modal dialog container       |
| `header`       | The header section                    |
| `body`         | The main content area                 |
| `footer`       | The footer section                    |
| `close-button` | The close button in the header        |

### CSS Custom Properties

You can style parts using the `::part()` selector:

```css
bp-modal::part(dialog) {
  /* Custom dialog styles */
}

bp-modal::part(backdrop) {
  /* Custom backdrop styles */
}
```

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface-elevated` - Dialog background
- `--bp-color-text` - Body text color
- `--bp-color-text-strong` - Header text color
- `--bp-color-text-muted` - Close button color
- `--bp-color-border` - Border between sections
- `--bp-color-focus` - Focus ring color
- `--bp-font-family` - Typography
- `--bp-font-size-base` - Body text size
- `--bp-font-size-xl` - Header text size
- `--bp-font-weight-semibold` - Header font weight
- `--bp-border-radius-lg` - Dialog border radius
- `--bp-border-radius-md` - Button border radius
- `--bp-border-width` - Border thickness
- `--bp-shadow-xl` - Dialog shadow
- `--bp-spacing-2` - Close button padding
- `--bp-spacing-3` - Footer gap
- `--bp-spacing-6` - Section padding
- `--bp-spacing-8` - Slide animation distance
- `--bp-spacing-md` - Header gap
- `--bp-line-height-tight` - Header line height
- `--bp-line-height-relaxed` - Body line height
- `--bp-transition-fast` - Button hover transition
- `--bp-transition-base` - Animation preset
- `--bp-duration-fast` - Backdrop fade duration
- `--bp-duration-normal` - Dialog slide duration
- `--bp-ease-out` - Animation easing
- `--bp-focus-ring` - Focus outline style
- `--bp-focus-offset` - Focus outline offset
- `--bp-z-modal` - Z-index for modal layer
- `--bp-opacity-overlay` - Backdrop opacity

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Supports `aria-labelledby` for proper labeling
- Traps focus within modal when open
- Restores focus to triggering element when closed
- Keyboard navigation support (ESC to close, Tab to navigate)
- Close button has `aria-label="Close"`
- Prevents body scroll to avoid confusion

### Keyboard Support

| Key         | Action                                                 |
| ----------- | ------------------------------------------------------ |
| `ESC`       | Closes the modal                                       |
| `Tab`       | Moves focus to next element (trapped within modal)     |
| `Shift+Tab` | Moves focus to previous element (trapped within modal) |

## Examples

### Confirmation Dialog

```html
<bp-modal open size="sm">
  <h2 slot="header">Confirm Action</h2>
  <p>Are you sure you want to delete this item?</p>
  <div slot="footer">
    <bp-button variant="secondary">Cancel</bp-button>
    <bp-button variant="error">Delete</bp-button>
  </div>
</bp-modal>
```

### Form Modal

```html
<bp-modal open size="md">
  <h2 slot="header">Edit Profile</h2>
  <form>
    <bp-input label="Name" value="John Doe"></bp-input>
    <bp-input label="Email" type="email" value="john@example.com"></bp-input>
    <bp-textarea label="Bio" rows="4"></bp-textarea>
  </form>
  <div slot="footer">
    <bp-button variant="secondary">Cancel</bp-button>
    <bp-button variant="primary" type="submit">Save Changes</bp-button>
  </div>
</bp-modal>
```

### Information Modal (No Footer)

```html
<bp-modal open size="md">
  <h2 slot="header">About</h2>
  <p>This application was built with Blueprint components.</p>
  <p>Version 1.0.0</p>
</bp-modal>
```

### Universal Tokens (Infrastructure)

- `--bp-spacing-md` - Padding/margins
- `--bp-font-size-base` - Text size
- `--bp-line-height-normal` - Line spacing
- `--bp-transition-fast` - Animations

> **Note:** Use semantic tokens for visual style (colors, fonts, shadows) and universal tokens for structure (spacing, sizing). See [Best Practices](../../docs/best-practices.md#design-token-strategy) for guidance.

## Accessibility

- [Describe ARIA attributes]
- [Describe keyboard support]
- [Describe screen reader behavior]
