# Tag

A removable label or chip component for displaying categories, filters, or selected items.

## Features

- **2 visual variants** - Solid and outlined styles
- **6 color schemes** - Primary, success, error, warning, info, and neutral
- **3 size options** - Small, medium, and large
- **Removable** - Optional close button with click and keyboard support
- **Disabled state** - Prevents interaction when disabled
- **Event handling** - Cancelable remove event for custom behavior
- **Keyboard support** - Delete/Backspace keys to remove when focused
- **Full theme support** - Automatically adapts to active theme
- **Accessible** - Proper ARIA attributes and keyboard navigation

## Usage

### Basic Tag

```html
<bp-tag>Design</bp-tag>
```

### With Colors

```html
<bp-tag color="primary">Frontend</bp-tag>
<bp-tag color="success">Approved</bp-tag>
<bp-tag color="error">Critical</bp-tag>
<bp-tag color="warning">Review Needed</bp-tag>
<bp-tag color="info">Documentation</bp-tag>
<bp-tag color="neutral">Draft</bp-tag>
```

### Removable Tags

```html
<bp-tag color="primary" removable>TypeScript</bp-tag>
<bp-tag color="success" removable>React</bp-tag>
<bp-tag color="info" removable>Web Components</bp-tag>
```

### Outlined Variant

```html
<bp-tag variant="outlined" color="primary">Outlined</bp-tag>
<bp-tag variant="outlined" color="success" removable>Removable</bp-tag>
```

### Different Sizes

```html
<bp-tag size="sm" removable>Small</bp-tag>
<bp-tag size="md" removable>Medium</bp-tag>
<bp-tag size="lg" removable>Large</bp-tag>
```

### Disabled State

```html
<bp-tag disabled>Disabled</bp-tag>
<bp-tag color="primary" removable disabled>Cannot Remove</bp-tag>
```

### Custom Remove Handling

```html
<bp-tag color="primary" removable id="custom-tag">Custom</bp-tag>

<script>
  const tag = document.getElementById('custom-tag');
  tag.addEventListener('bp-remove', (e) => {
    // Prevent default removal
    e.preventDefault();

    // Custom logic (e.g., show confirmation)
    if (confirm('Remove this tag?')) {
      tag.remove();
    }
  });
</script>
```

## API

### Properties

| Property    | Type                                                                    | Default     | Description                    |
| ----------- | ----------------------------------------------------------------------- | ----------- | ------------------------------ |
| `variant`   | `'solid' \| 'outlined'`                                                 | `'solid'`   | Visual variant of the tag      |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`      | Size of the tag                |
| `color`     | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Color scheme of the tag        |
| `removable` | `boolean`                                                               | `false`     | Whether the tag can be removed |
| `disabled`  | `boolean`                                                               | `false`     | Whether the tag is disabled    |

### Events

| Event       | Detail                                 | Description                                |
| ----------- | -------------------------------------- | ------------------------------------------ |
| `bp-remove` | `{ color: string, timestamp: number }` | Fired when the tag is removed (cancelable) |

### Slots

| Slot      | Description               |
| --------- | ------------------------- |
| (default) | Content of the tag (text) |

### CSS Parts

| Part           | Description                     |
| -------------- | ------------------------------- |
| `tag`          | The tag container element       |
| `close-button` | The close/remove button element |

## Design Tokens Used

**Colors:**

- `--bp-color-primary`
- `--bp-color-success`
- `--bp-color-error`
- `--bp-color-warning`
- `--bp-color-info`
- `--bp-color-surface-secondary`
- `--bp-color-border`
- `--bp-color-text`
- `--bp-color-text-inverse`
- `--bp-color-focus`

**Typography:**

- `--bp-font-family`
- `--bp-font-weight-medium`
- `--bp-font-size-xs`
- `--bp-font-size-sm`
- `--bp-font-size-base`

**Spacing:**

- `--bp-spacing-xs`
- `--bp-spacing-sm`
- `--bp-spacing-md`
- `--bp-spacing-lg`
- `--bp-spacing-4` through `--bp-spacing-10`

**Borders:**

- `--bp-border-radius-sm`
- `--bp-border-radius-md`

**Transitions:**

- `--bp-transition-fast`

## Accessibility

- **Semantic HTML** - Uses proper div container with role="status"
- **ARIA attributes** - `aria-disabled` reflects disabled state
- **Keyboard navigation** - Tab to focus, Delete/Backspace to remove
- **Focus indicators** - Clear visual focus states for tag and close button
- **Screen reader friendly** - Close button has descriptive aria-label
- **Interactive states** - Proper tabindex management based on removable/disabled state

## Keyboard Support

| Key                  | Action                         |
| -------------------- | ------------------------------ |
| `Tab`                | Focus the tag (when removable) |
| `Delete`             | Remove the tag (when focused)  |
| `Backspace`          | Remove the tag (when focused)  |
| `Tab` (on close btn) | Focus next element             |

## Common Patterns

### Tag Input / Selection

```html
<div class="tag-list">
  <bp-tag color="primary" removable>JavaScript</bp-tag>
  <bp-tag color="primary" removable>TypeScript</bp-tag>
  <bp-tag color="primary" removable>Web Components</bp-tag>
</div>
```

### Status Labels

```html
<bp-tag color="success">Active</bp-tag>
<bp-tag color="warning">Pending</bp-tag>
<bp-tag color="error">Archived</bp-tag>
```

### Category Filters

```html
<bp-tag variant="outlined" color="info" removable>Frontend</bp-tag>
<bp-tag variant="outlined" color="info" removable>Backend</bp-tag>
<bp-tag variant="outlined" color="info" removable>Design</bp-tag>
```
