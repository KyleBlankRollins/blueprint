---
title: Tree
description: Hierarchical tree view for nested data
---

The `bp-tree` component displays hierarchical data in an expandable/collapsible tree structure. It supports selection, multi-select, custom icons, and connecting lines between nodes.

## Import

```javascript
import 'blueprint/components/tree';
```

## Examples

### Default

<div class="component-preview">
  <bp-tree id="tree-demo"></bp-tree>
</div>

```html
<bp-tree id="tree-demo"></bp-tree>

<script>
  const tree = document.querySelector('#tree-demo');
  tree.nodes = [
    {
      id: 'documents',
      label: 'Documents',
      children: [
        { id: 'work', label: 'Work' },
        { id: 'personal', label: 'Personal' },
      ],
    },
    {
      id: 'photos',
      label: 'Photos',
      children: [
        { id: '2023', label: '2023' },
        { id: '2024', label: '2024' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];
</script>
```

### With Icons

<div class="component-preview">
  <bp-tree id="tree-icons"></bp-tree>
</div>

```javascript
const tree = document.querySelector('#tree-icons');
tree.nodes = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { id: 'index', label: 'index.ts', icon: 'file' },
      { id: 'app', label: 'app.ts', icon: 'file' },
    ],
  },
  { id: 'package', label: 'package.json', icon: 'file' },
  { id: 'readme', label: 'README.md', icon: 'file' },
];
```

### Sizes

<div class="component-preview">
  <div style="display: flex; gap: 2rem;">
    <bp-tree size="small" id="tree-small"></bp-tree>
    <bp-tree size="medium" id="tree-medium"></bp-tree>
    <bp-tree size="large" id="tree-large"></bp-tree>
  </div>
</div>

```html
<bp-tree size="small">...</bp-tree>
<bp-tree size="medium">...</bp-tree>
<bp-tree size="large">...</bp-tree>
```

### With Connecting Lines

<div class="component-preview">
  <bp-tree show-lines id="tree-lines"></bp-tree>
</div>

```html
<bp-tree show-lines>...</bp-tree>
```

### Selectable

<div class="component-preview">
  <bp-tree selectable id="tree-selectable"></bp-tree>
</div>

```javascript
const tree = document.querySelector('#tree-selectable');

tree.addEventListener('bp-select', (e) => {
  console.log('Selected:', e.detail.node);
  console.log('Path:', e.detail.path);
});
```

### Multi-Select

<div class="component-preview">
  <bp-tree selectable multi-select id="tree-multiselect"></bp-tree>
</div>

```html
<bp-tree selectable multi-select>...</bp-tree>

<script>
  tree.addEventListener('bp-select', (e) => {
    console.log('Selected IDs:', e.detail.selectedIds);
  });
</script>
```

### Default Expanded

<div class="component-preview">
  <bp-tree id="tree-expanded"></bp-tree>
</div>

```javascript
const tree = document.querySelector('#tree-expanded');
tree.nodes = [...];
tree.expandedIds = ['documents', 'photos']; // Pre-expand these nodes
```

### Disabled Nodes

<div class="component-preview">
  <bp-tree id="tree-disabled"></bp-tree>
</div>

```javascript
tree.nodes = [
  { id: 'active', label: 'Active Node' },
  { id: 'disabled', label: 'Disabled Node', disabled: true },
  {
    id: 'folder',
    label: 'Folder',
    children: [
      { id: 'child1', label: 'Child 1' },
      { id: 'child2', label: 'Child 2', disabled: true },
    ],
  },
];
```

### Deep Nesting

<div class="component-preview">
  <bp-tree show-lines id="tree-deep"></bp-tree>
</div>

```javascript
tree.nodes = [
  {
    id: 'root',
    label: 'Root',
    children: [
      {
        id: 'level1',
        label: 'Level 1',
        children: [
          {
            id: 'level2',
            label: 'Level 2',
            children: [{ id: 'level3', label: 'Level 3 Item' }],
          },
        ],
      },
    ],
  },
];
```

### Programmatic Control

```javascript
const tree = document.querySelector('#tree');

// Expand a node
tree.expand('documents');

// Collapse a node
tree.collapse('documents');

// Toggle a node
tree.toggle('documents');

// Expand all nodes
tree.expandAll();

// Collapse all nodes
tree.collapseAll();

// Select a node
tree.selectNode('readme');

// Clear selection
tree.clearSelection();
```

## API Reference

### Properties

| Property      | Type                             | Default    | Description                 |
| ------------- | -------------------------------- | ---------- | --------------------------- |
| `nodes`       | `TreeNode[]`                     | `[]`       | Array of tree node objects  |
| `selectedId`  | `string \| null`                 | `null`     | Currently selected node ID  |
| `expandedIds` | `string[]`                       | `[]`       | Array of expanded node IDs  |
| `multiSelect` | `boolean`                        | `false`    | Enable multi-node selection |
| `showLines`   | `boolean`                        | `false`    | Show connecting lines       |
| `selectable`  | `boolean`                        | `true`     | Enable node selection       |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant                |

### TreeNode Interface

```typescript
interface TreeNode {
  id: string; // Unique identifier
  label: string; // Display text
  icon?: string; // Icon name
  children?: TreeNode[]; // Child nodes
  disabled?: boolean; // Disable selection
  data?: unknown; // Custom data
}
```

### Methods

| Method             | Description                |
| ------------------ | -------------------------- |
| `expand(id)`       | Expand a node by ID        |
| `collapse(id)`     | Collapse a node by ID      |
| `toggle(id)`       | Toggle node expanded state |
| `expandAll()`      | Expand all nodes           |
| `collapseAll()`    | Collapse all nodes         |
| `selectNode(id)`   | Select a node by ID        |
| `clearSelection()` | Clear all selections       |

### Events

| Event         | Detail                        | Description                  |
| ------------- | ----------------------------- | ---------------------------- |
| `bp-select`   | `{ node, selectedIds, path }` | Fired when selection changes |
| `bp-expand`   | `{ node, expanded }`          | Fired when a node expands    |
| `bp-collapse` | `{ node, expanded }`          | Fired when a node collapses  |

### Slots

| Slot      | Description       |
| --------- | ----------------- |
| (default) | Custom tree items |

### CSS Parts

| Part            | Description            |
| --------------- | ---------------------- |
| `tree`          | Main tree container    |
| `node`          | Individual tree node   |
| `node-content`  | Clickable content area |
| `node-icon`     | Expand/collapse icon   |
| `node-label`    | Node label text        |
| `node-children` | Container for children |

### Keyboard Navigation

- **Arrow Up/Down**: Navigate between visible nodes
- **Arrow Right**: Expand node or move to first child
- **Arrow Left**: Collapse node or move to parent
- **Enter/Space**: Select/toggle node
- **Home**: Move to first node
- **End**: Move to last visible node
- **\***: Expand all siblings

### Accessibility

- Uses `role="tree"` and `role="treeitem"`
- `aria-expanded` indicates expand state
- `aria-selected` indicates selection
- `aria-disabled` for disabled nodes
- Full keyboard navigation support
