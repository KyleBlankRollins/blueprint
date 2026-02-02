import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './tree.js';
import type { BpTree, TreeNode } from './tree.js';

describe('bp-tree', () => {
  let element: BpTree;

  const sampleNodes: TreeNode[] = [
    {
      id: 'folder1',
      label: 'Documents',
      children: [
        { id: 'file1', label: 'Resume.pdf' },
        { id: 'file2', label: 'Cover Letter.docx' },
      ],
    },
    {
      id: 'folder2',
      label: 'Images',
      children: [
        { id: 'img1', label: 'photo.jpg' },
        {
          id: 'subfolder1',
          label: 'Screenshots',
          children: [{ id: 'screen1', label: 'screen1.png' }],
        },
      ],
    },
    { id: 'file3', label: 'readme.txt' },
  ];

  beforeEach(() => {
    element = document.createElement('bp-tree');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-tree');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render tree element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const tree = element.shadowRoot?.querySelector('.tree');
    expect(tree).toBeTruthy();
  });

  it('should render nodes from data', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const nodes = element.shadowRoot?.querySelectorAll('.node');
    expect(nodes?.length).toBe(3); // Only top-level nodes visible initially
  });

  it('should render child nodes when expanded', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const nodes = element.shadowRoot?.querySelectorAll('.node');
    expect(nodes?.length).toBe(5); // 3 top-level + 2 children of folder1
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.nodes).toEqual([]);
    expect(element.selectedId).toBe(null);
    expect(element.expandedIds).toEqual([]);
    expect(element.multiSelect).toBe(false);
    expect(element.showLines).toBe(false);
    expect(element.selectable).toBe(true);
    expect(element.size).toBe('md');
  });

  // Property tests
  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const tree = element.shadowRoot?.querySelector('.tree');
    expect(tree?.classList.contains('tree--lg')).toBe(true);
  });

  it('should set property: showLines', async () => {
    element.showLines = true;
    await element.updateComplete;
    const tree = element.shadowRoot?.querySelector('.tree');
    expect(tree?.classList.contains('tree--lines')).toBe(true);
  });

  it('should set property: selectable', async () => {
    element.selectable = false;
    element.nodes = sampleNodes;
    await element.updateComplete;
    expect(element.selectable).toBe(false);
  });

  it('should set property: multiSelect', async () => {
    element.multiSelect = true;
    await element.updateComplete;
    expect(element.multiSelect).toBe(true);
  });

  it('should set property: nodes', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;
    expect(element.nodes).toEqual(sampleNodes);
  });

  it('should set property: expandedIds', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1', 'folder2'];
    await element.updateComplete;
    expect(element.expandedIds).toContain('folder1');
    expect(element.expandedIds).toContain('folder2');
  });

  // CSS Parts tests
  it('should expose all CSS parts for styling', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('[part="tree"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="node"]')).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector('[part="node-content"]')
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector('[part="node-label"]')
    ).toBeTruthy();
  });

  // Event tests
  it('should emit bp-select event when node is clicked', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const selectHandler = vi.fn();
    element.addEventListener('bp-select', selectHandler);

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    nodeContent?.click();

    expect(selectHandler).toHaveBeenCalled();
    expect(selectHandler.mock.calls[0][0].detail.node.id).toBe('folder1');
  });

  it('should emit bp-expand event when node is expanded', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const expandHandler = vi.fn();
    element.addEventListener('bp-expand', expandHandler);

    element.expand('folder1');

    expect(expandHandler).toHaveBeenCalled();
    expect(expandHandler.mock.calls[0][0].detail.expanded).toBe(true);
  });

  it('should emit bp-collapse event when node is collapsed', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const collapseHandler = vi.fn();
    element.addEventListener('bp-collapse', collapseHandler);

    element.collapse('folder1');

    expect(collapseHandler).toHaveBeenCalled();
    expect(collapseHandler.mock.calls[0][0].detail.expanded).toBe(false);
  });

  // Slot tests
  it('should render slotted content when no nodes provided', async () => {
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // Interaction tests - expand/collapse
  it('should expand node on toggle click', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const toggleIcon = element.shadowRoot?.querySelector(
      '.node-toggle--visible'
    ) as HTMLElement;
    toggleIcon?.click();
    await element.updateComplete;

    expect(element.expandedIds).toContain('folder1');
  });

  it('should collapse node when expanded node toggle clicked', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const toggleIcon = element.shadowRoot?.querySelector(
      '.node-toggle--visible'
    ) as HTMLElement;
    toggleIcon?.click();
    await element.updateComplete;

    expect(element.expandedIds).not.toContain('folder1');
  });

  it('should toggle node expansion with toggle() method', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    element.toggle('folder1');
    expect(element.expandedIds).toContain('folder1');

    element.toggle('folder1');
    expect(element.expandedIds).not.toContain('folder1');
  });

  // Interaction tests - selection
  it('should select node on click', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    nodeContent?.click();
    await element.updateComplete;

    expect(element.selectedId).toBe('folder1');
  });

  it('should allow multiple selection when multiSelect is true', async () => {
    element.nodes = sampleNodes;
    element.multiSelect = true;
    await element.updateComplete;

    element.selectNode('folder1');
    element.selectNode('file3');

    expect(element['selectedIds']).toContain('folder1');
    expect(element['selectedIds']).toContain('file3');
  });

  it('should deselect on second click in multiSelect mode', async () => {
    element.nodes = sampleNodes;
    element.multiSelect = true;
    await element.updateComplete;

    element.selectNode('folder1');
    expect(element['selectedIds']).toContain('folder1');

    element.selectNode('folder1');
    expect(element['selectedIds']).not.toContain('folder1');
  });

  // Public method tests
  it('should expand all nodes with expandAll() method', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    element.expandAll();

    expect(element.expandedIds).toContain('folder1');
    expect(element.expandedIds).toContain('folder2');
    expect(element.expandedIds).toContain('subfolder1');
  });

  it('should collapse all nodes with collapseAll() method', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1', 'folder2'];
    await element.updateComplete;

    element.collapseAll();

    expect(element.expandedIds.length).toBe(0);
  });

  it('should clear selection with clearSelection() method', async () => {
    element.nodes = sampleNodes;
    element.selectedId = 'folder1';
    await element.updateComplete;

    element.clearSelection();

    expect(element.selectedId).toBe(null);
  });

  // Keyboard interaction tests
  it('should select node on Enter key press', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    nodeContent?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.selectedId).toBe('folder1');
  });

  it('should select node on Space key press', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    nodeContent?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.selectedId).toBe('folder1');
  });

  it('should expand node on ArrowRight key press', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
    });
    nodeContent?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.expandedIds).toContain('folder1');
  });

  it('should collapse node on ArrowLeft key press', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      bubbles: true,
    });
    nodeContent?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.expandedIds).not.toContain('folder1');
  });

  // Accessibility tests
  it('should have role="tree" on container', async () => {
    await element.updateComplete;
    const tree = element.shadowRoot?.querySelector('.tree');
    expect(tree?.getAttribute('role')).toBe('tree');
  });

  it('should have role="treeitem" on nodes', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;
    const node = element.shadowRoot?.querySelector('.node');
    expect(node?.getAttribute('role')).toBe('treeitem');
  });

  it('should have aria-expanded on expandable nodes', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;
    const node = element.shadowRoot?.querySelector('.node');
    expect(node?.hasAttribute('aria-expanded')).toBe(true);
  });

  it('should update aria-expanded when node expanded', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;
    const node = element.shadowRoot?.querySelector('.node');
    expect(node?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-selected on selectable nodes', async () => {
    element.nodes = sampleNodes;
    element.selectable = true;
    element.selectedId = 'folder1';
    await element.updateComplete;

    const selectedNode = element.shadowRoot?.querySelector(
      '.node-content--selected'
    )?.parentElement;
    expect(selectedNode?.getAttribute('aria-selected')).toBe('true');
  });

  it('should have aria-disabled on disabled nodes', async () => {
    element.nodes = [
      { id: 'disabled', label: 'Disabled Node', disabled: true },
    ];
    await element.updateComplete;

    const node = element.shadowRoot?.querySelector('.node');
    expect(node?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have aria-multiselectable when multiSelect is true', async () => {
    element.multiSelect = true;
    await element.updateComplete;

    const tree = element.shadowRoot?.querySelector('.tree');
    expect(tree?.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('should have role="group" on children containers', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const childContainer = element.shadowRoot?.querySelector('.node-children');
    expect(childContainer?.getAttribute('role')).toBe('group');
  });

  // Disabled node tests
  it('should not select disabled node on click', async () => {
    element.nodes = [{ id: 'disabled', label: 'Disabled', disabled: true }];
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    nodeContent?.click();

    expect(element.selectedId).toBe(null);
  });

  // Path calculation test
  it('should include path in bp-select event detail', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder1'];
    await element.updateComplete;

    const selectHandler = vi.fn();
    element.addEventListener('bp-select', selectHandler);

    // Find and click the file1 node (child of folder1)
    const nodeContents = element.shadowRoot?.querySelectorAll('.node-content');
    const file1Content = Array.from(nodeContents || []).find(
      (n) => n.querySelector('.node-label')?.textContent === 'Resume.pdf'
    ) as HTMLElement;
    file1Content?.click();

    expect(selectHandler).toHaveBeenCalled();
    expect(selectHandler.mock.calls[0][0].detail.path).toContain('folder1');
    expect(selectHandler.mock.calls[0][0].detail.path).toContain('file1');
  });

  // Property validation tests
  it('should validate size from attribute', async () => {
    element.setAttribute('size', 'invalid');
    await element.updateComplete;
    expect(element.size).toBe('md');
  });

  // Disabled node interaction tests
  it('should allow expanding disabled nodes', async () => {
    element.nodes = [
      {
        id: 'disabled-folder',
        label: 'Disabled Folder',
        disabled: true,
        children: [{ id: 'child', label: 'Child' }],
      },
    ];
    await element.updateComplete;

    element.expand('disabled-folder');
    await element.updateComplete;

    expect(element.expandedIds).toContain('disabled-folder');
  });

  it('should block keyboard selection on disabled nodes', async () => {
    element.nodes = [{ id: 'disabled', label: 'Disabled', disabled: true }];
    await element.updateComplete;

    const nodeContent = element.shadowRoot?.querySelector(
      '.node-content'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    nodeContent?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.selectedId).toBe(null);
  });

  // Toggle isolation test
  it('should not trigger node selection when toggle is clicked', async () => {
    element.nodes = sampleNodes;
    await element.updateComplete;

    const selectHandler = vi.fn();
    element.addEventListener('bp-select', selectHandler);

    const toggleIcon = element.shadowRoot?.querySelector(
      '.node-toggle--visible'
    ) as HTMLElement;
    toggleIcon?.click();
    await element.updateComplete;

    expect(selectHandler).not.toHaveBeenCalled();
    expect(element.expandedIds).toContain('folder1');
  });

  // Multi-select mode switching
  it('should maintain selection state when switching multiSelect mode', async () => {
    element.nodes = sampleNodes;
    element.multiSelect = true;
    await element.updateComplete;

    element.selectNode('folder1');
    element.selectNode('file3');

    // Switch to single-select mode
    element.multiSelect = false;
    await element.updateComplete;

    // selectedIds array maintained, but behavior changes to single-select
    expect(element['selectedIds']).toContain('folder1');
    expect(element['selectedIds']).toContain('file3');
  });

  // Nested path edge case
  it('should calculate path for deeply nested nodes', async () => {
    element.nodes = sampleNodes;
    element.expandedIds = ['folder2', 'subfolder1'];
    await element.updateComplete;

    const selectHandler = vi.fn();
    element.addEventListener('bp-select', selectHandler);

    // Find and click screen1.png (nested 3 levels deep)
    const nodeContents = element.shadowRoot?.querySelectorAll('.node-content');
    const screen1Content = Array.from(nodeContents || []).find(
      (n) => n.querySelector('.node-label')?.textContent === 'screen1.png'
    ) as HTMLElement;
    screen1Content?.click();

    expect(selectHandler).toHaveBeenCalled();
    const path = selectHandler.mock.calls[0][0].detail.path;
    expect(path).toContain('folder2');
    expect(path).toContain('subfolder1');
    expect(path).toContain('screen1');
  });
});
