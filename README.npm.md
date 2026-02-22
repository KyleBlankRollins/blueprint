# @krollins/blueprint

A highly portable and customizable web component library built on [Lit](https://lit.dev).

## Installation

```bash
npm install @krollins/blueprint
```

## Quick Start

```html
<script type="module">
  import '@krollins/blueprint';
</script>

<bp-button variant="primary">Click me</bp-button>
```

Or import individual components:

```typescript
import { BpButton } from '@krollins/blueprint';
```

## Components

| Component    | Tag                 | Description                                                |
| ------------ | ------------------- | ---------------------------------------------------------- |
| Button       | `<bp-button>`       | Primary, secondary, outline, ghost, danger, loading states |
| Input        | `<bp-input>`        | Text input with labels, validation, help text              |
| Textarea     | `<bp-textarea>`     | Multi-line text input with auto-resize                     |
| Checkbox     | `<bp-checkbox>`     | Standard and indeterminate states                          |
| Radio        | `<bp-radio>`        | Radio buttons and radio groups                             |
| Switch       | `<bp-switch>`       | Boolean toggle control                                     |
| Select       | `<bp-select>`       | Dropdown selection                                         |
| Multi-select | `<bp-multi-select>` | Dropdown with multiple selection                           |
| Combobox     | `<bp-combobox>`     | Searchable dropdown                                        |
| Number Input | `<bp-number-input>` | Increment/decrement numeric input                          |
| Slider       | `<bp-slider>`       | Numeric range selection                                    |
| Date Picker  | `<bp-date-picker>`  | Calendar-based date selection                              |
| Time Picker  | `<bp-time-picker>`  | Time input with dropdown                                   |
| File Upload  | `<bp-file-upload>`  | Drag-and-drop file selection                               |
| Color Picker | `<bp-color-picker>` | Color selection tool                                       |
| Icon         | `<bp-icon>`         | SVG icon wrapper with sizing                               |
| Badge        | `<bp-badge>`        | Status indicators and counts                               |
| Tag          | `<bp-tag>`          | Removable labels and filters                               |
| Alert        | `<bp-alert>`        | Informational, success, warning, error messages            |
| Notification | `<bp-notification>` | Non-blocking alerts                                        |
| Card         | `<bp-card>`         | Content container with header, body, footer slots          |
| Modal        | `<bp-modal>`        | Overlay dialogs with focus trapping                        |
| Drawer       | `<bp-drawer>`       | Slide-in panels                                            |
| Tooltip      | `<bp-tooltip>`      | Hover/focus information popups                             |
| Popover      | `<bp-popover>`      | Rich content popovers                                      |
| Dropdown     | `<bp-dropdown>`     | Generic popover trigger                                    |
| Menu         | `<bp-menu>`         | Dropdown and context menus                                 |
| Tabs         | `<bp-tabs>`         | Tabbed content navigation                                  |
| Accordion    | `<bp-accordion>`    | Collapsible content sections                               |
| Breadcrumb   | `<bp-breadcrumb>`   | Navigation path indicator                                  |
| Pagination   | `<bp-pagination>`   | Page navigation controls                                   |
| Stepper      | `<bp-stepper>`      | Multi-step form navigation                                 |
| Table        | `<bp-table>`        | Data tables with sorting, selection                        |
| Tree         | `<bp-tree>`         | Hierarchical data display                                  |
| Progress     | `<bp-progress>`     | Determinate and indeterminate progress                     |
| Spinner      | `<bp-spinner>`      | Loading indicator                                          |
| Skeleton     | `<bp-skeleton>`     | Loading placeholders                                       |
| Avatar       | `<bp-avatar>`       | User/entity image with fallback initials                   |
| Divider      | `<bp-divider>`      | Visual separator                                           |
| Heading      | `<bp-heading>`      | Typography component for headings                          |
| Text         | `<bp-text>`         | Text/paragraph component                                   |
| Link         | `<bp-link>`         | Hyperlink component                                        |

## Design Tokens

Blueprint uses CSS custom properties for theming. All tokens use the `--bp-` prefix:

```css
/* Colors */
--bp-color-primary
--bp-color-danger

/* Spacing */
--bp-spacing-xs, --bp-spacing-sm, --bp-spacing-md, --bp-spacing-lg

/* Typography */
--bp-font-size-sm, --bp-font-weight-bold

/* Borders & Shadows */
--bp-border-radius-sm, --bp-shadow-md
```

Import the default theme CSS:

```typescript
import '@krollins/blueprint';
// Theme CSS is automatically included
```

## Browser Support

Blueprint targets modern browsers that support web components:

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

## Documentation

Full documentation and interactive examples:

- [Blueprint docs](https://blueprint-ui-docs.netlify.app/)
- [GitHub Repository](https://github.com/KyleBlankRollins/blueprint)

## License

MIT
