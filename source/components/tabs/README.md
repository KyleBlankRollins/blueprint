# Tabs

A tabs component for organizing content into tabbed sections with full keyboard navigation and ARIA support.

## Features

- Multiple visual variants: default, pills, and underline
- Flexible placement: top, bottom, start (vertical left), end (vertical right)
- Three sizes: sm, md, lg
- Full keyboard navigation (Arrow keys, Home, End)
- Closable tabs with close events
- Icon support in tabs
- Manual or automatic activation modes
- Comprehensive ARIA attributes
- CSS parts for deep customization

## Usage

```html
<!-- Basic tabs -->
<bp-tabs
  .tabs=${[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' }
  ]}
  value="tab1"
>
  <div data-tab-id="tab1">Content for tab 1</div>
  <div data-tab-id="tab2">Content for tab 2</div>
  <div data-tab-id="tab3">Content for tab 3</div>
</bp-tabs>

<!-- Pills variant -->
<bp-tabs
  .tabs=${tabs}
  value="overview"
  variant="pills"
>
  <!-- Panel content -->
</bp-tabs>

<!-- Vertical tabs -->
<bp-tabs
  .tabs=${tabs}
  value="settings"
  placement="start"
>
  <!-- Panel content -->
</bp-tabs>

<!-- Closable tabs -->
<bp-tabs
  .tabs=${[
    { id: 'doc1', label: 'Document 1', closable: true },
    { id: 'doc2', label: 'Document 2', closable: true }
  ]}
  value="doc1"
  @bp-tab-close=${(e) => handleClose(e.detail.tabId)}
>
  <!-- Panel content -->
</bp-tabs>
```

## API

### Properties

| Property    | Type            | Default     | Description                                                     |
| ----------- | --------------- | ----------- | --------------------------------------------------------------- |
| `value`     | `string`        | `''`        | The ID of the currently selected tab                            |
| `tabs`      | `TabItem[]`     | `[]`        | Array of tab items (id, label, disabled, icon, closable)        |
| `size`      | `TabsSize`      | `'md'`      | Size of the tabs: `'sm'` \| `'md'` \| `'lg'`                    |
| `variant`   | `TabsVariant`   | `'default'` | Visual style: `'default'` \| `'pills'` \| `'underline'`         |
| `placement` | `TabsPlacement` | `'top'`     | Position: `'top'` \| `'bottom'` \| `'start'` \| `'end'`         |
| `disabled`  | `boolean`       | `false`     | Whether all tabs are disabled                                   |
| `manual`    | `boolean`       | `false`     | Whether activation requires Enter/Space (vs automatic on arrow) |

### TabItem Interface

```typescript
interface TabItem {
  id: string; // Unique identifier for the tab
  label: string; // Display label for the tab
  disabled?: boolean; // Whether the tab is disabled
  icon?: string; // Icon name to display before the label
  closable?: boolean; // Whether this tab can be closed
}
```

### Events

| Event           | Detail                                     | Description                                         |
| --------------- | ------------------------------------------ | --------------------------------------------------- |
| `bp-tab-change` | `{ value: string, previousValue: string }` | Fired when the selected tab changes                 |
| `bp-tab-close`  | `{ tabId: string }`                        | Fired when a closable tab's close button is clicked |

### Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| (default) | Panel content. Use `data-tab-id` attribute to link to tabs |

### CSS Parts

| Part           | Description                       |
| -------------- | --------------------------------- |
| `tabs`         | The main container                |
| `tablist`      | The tab button list container     |
| `tab`          | Individual tab button             |
| `tab-active`   | The currently active tab          |
| `tab-disabled` | A disabled tab                    |
| `tab-close`    | The close button on closable tabs |
| `panels`       | The panel container               |

## Keyboard Navigation

| Key         | Action                                              |
| ----------- | --------------------------------------------------- |
| Arrow Right | Move to next tab (and select in automatic mode)     |
| Arrow Left  | Move to previous tab (and select in automatic mode) |
| Arrow Down  | Move to next tab (vertical orientation)             |
| Arrow Up    | Move to previous tab (vertical orientation)         |
| Home        | Move to first tab                                   |
| End         | Move to last tab                                    |
| Enter/Space | Select focused tab (required in manual mode)        |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-primary` - Active tab indicator color
- `--bp-color-surface` - Pills background
- `--bp-color-surface-subdued` - Hover background
- `--bp-color-background` - Active pill background
- `--bp-color-text` - Tab text color
- `--bp-color-text-muted` - Inactive tab text
- `--bp-color-border` - Tab list border
- `--bp-color-focus` - Focus ring color

### Universal Tokens

- `--bp-font-family` - Typography
- `--bp-font-size-*` - Text sizing (sm, base, lg)
- `--bp-font-weight-medium` - Tab label weight
- `--bp-spacing-*` - Padding and gaps
- `--bp-border-width` - Border thickness
- `--bp-border-radius` - Tab rounding
- `--bp-border-radius-large` - Pills container rounding
- `--bp-duration-fast` - Transition speed
- `--bp-opacity-disabled` - Disabled state opacity
- `--bp-shadow-sm` - Active pill shadow
- `--bp-focus-width`, `--bp-focus-style`, `--bp-focus-offset` - Focus indicators

## Accessibility

- Uses proper ARIA roles: `tablist`, `tab`, `tabpanel`
- `aria-selected` indicates the active tab
- `aria-controls` and `aria-labelledby` link tabs to panels
- `aria-disabled` on disabled tabs
- `aria-orientation` for vertical tabs
- Roving tabindex: only active tab is in tab order
- Full keyboard navigation support
- Focus management on arrow key navigation

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
