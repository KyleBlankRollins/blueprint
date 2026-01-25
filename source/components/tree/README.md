# Tree

A hierarchical tree component for displaying nested data structures like file systems, organization charts, or navigation menus.

## Features

- **Hierarchical Display**: Render nested tree structures with unlimited depth
- **Expand/Collapse**: Toggle visibility of child nodes with smooth animations
- **Selection**: Single or multi-select mode with visual feedback
- **Sizes**: Small, medium, and large size variants
- **Connecting Lines**: Optional visual lines between parent and child nodes
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Accessibility**: Complete ARIA tree pattern implementation
- **Public API**: Methods for programmatic expand/collapse/select

## Usage

```html
<bp-tree
  .nodes=${[
    {
      id: 'folder1',
      label: 'Documents',
      children: [
        { id: 'file1', label: 'Resume.pdf' },
        { id: 'file2', label: 'Cover Letter.docx' }
      ]
    },
    { id: 'file3', label: 'README.md' }
  ]}
  @bp-select=${(e) => console.log('Selected:', e.detail.node)}
></bp-tree>
```

### Pre-expanded Nodes

```html
<bp-tree
  .nodes=${nodes}
  .expandedIds=${['folder1', 'folder2']}
></bp-tree>
```

### With Connecting Lines

```html
<bp-tree .nodes="${nodes}" showLines></bp-tree>
```

### Multi-Select Mode

```html
<bp-tree .nodes="${nodes}" selectable multiSelect @bp-select="${(e)" ="">
  console.log('Selected IDs:', e.detail.selectedIds)} ></bp-tree
>
```

### Programmatic Control

```javascript
const tree = document.querySelector('bp-tree');

// Expand/collapse
tree.expand('folder1');
tree.collapse('folder1');
tree.toggle('folder1');
tree.expandAll();
tree.collapseAll();

// Selection
tree.selectNode('file1');
tree.clearSelection();
```

## API

### Properties

| Property      | Type                             | Default    | Description                   |
| ------------- | -------------------------------- | ---------- | ----------------------------- |
| `nodes`       | `TreeNode[]`                     | `[]`       | Array of tree node objects    |
| `selectedId`  | `string \| null`                 | `null`     | Currently selected node ID    |
| `expandedIds` | `string[]`                       | `[]`       | Array of expanded node IDs    |
| `multiSelect` | `boolean`                        | `false`    | Allow multiple selections     |
| `showLines`   | `boolean`                        | `false`    | Show connecting lines         |
| `selectable`  | `boolean`                        | `true`     | Whether nodes can be selected |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant                  |

### TreeNode Interface

```typescript
interface TreeNode {
  id: string; // Unique identifier
  label: string; // Display label
  icon?: string; // Optional icon name
  children?: TreeNode[]; // Child nodes
  disabled?: boolean; // Whether node is disabled
  data?: unknown; // Custom data
}
```

### Methods

| Method               | Parameters       | Description                |
| -------------------- | ---------------- | -------------------------- |
| `expand(nodeId)`     | `nodeId: string` | Expand a specific node     |
| `collapse(nodeId)`   | `nodeId: string` | Collapse a specific node   |
| `toggle(nodeId)`     | `nodeId: string` | Toggle node expanded state |
| `expandAll()`        | -                | Expand all nodes           |
| `collapseAll()`      | -                | Collapse all nodes         |
| `selectNode(nodeId)` | `nodeId: string` | Select a node              |
| `clearSelection()`   | -                | Clear all selections       |

### Events

| Event         | Detail                                                      | Description                    |
| ------------- | ----------------------------------------------------------- | ------------------------------ |
| `bp-select`   | `{ node: TreeNode, selectedIds: string[], path: string[] }` | Fired when a node is selected  |
| `bp-expand`   | `{ node: TreeNode, expanded: boolean }`                     | Fired when a node is expanded  |
| `bp-collapse` | `{ node: TreeNode, expanded: boolean }`                     | Fired when a node is collapsed |

### Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| (default) | Custom tree items when not using `nodes` prop |

### CSS Parts

| Part            | Description                      |
| --------------- | -------------------------------- |
| `tree`          | The tree container element       |
| `node`          | Individual tree nodes            |
| `node-content`  | Clickable content area of a node |
| `node-icon`     | The expand/collapse toggle icon  |
| `node-label`    | The node label text              |
| `node-children` | Container for child nodes        |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-text` - Node text color
- `--bp-color-primary` - Selected node highlight
- `--bp-color-surface-subdued` - Hover background
- `--bp-color-border` - Connecting lines color
- `--bp-color-focus` - Focus ring color

### Universal Tokens (Infrastructure)

- `--bp-spacing-xs` - Compact spacing
- `--bp-spacing-sm` - Node padding
- `--bp-spacing-md` - Icon sizing
- `--bp-spacing-lg` - Indentation
- `--bp-font-family` - Font family
- `--bp-font-size-sm` - Small size text
- `--bp-font-size-base` - Default text size
- `--bp-font-size-lg` - Large size text
- `--bp-border-radius-sm` - Node rounding
- `--bp-border-width` - Line thickness
- `--bp-transition-fast` - Expand/collapse animation

## Accessibility

- Uses `role="tree"` on container with `aria-multiselectable` when applicable
- Uses `role="treeitem"` on each node
- Uses `role="group"` on child containers
- `aria-expanded` indicates expandable node state
- `aria-selected` indicates selection state
- `aria-disabled` on disabled nodes
- **Keyboard Navigation**:
  - `Enter` / `Space` - Select focused node
  - `ArrowRight` - Expand node (if collapsed)
  - `ArrowLeft` - Collapse node (if expanded)
- Focus indicators on interactive elements

- [Describe screen reader behavior]
