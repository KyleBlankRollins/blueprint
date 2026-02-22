import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { treeStyles } from './tree.style.js';
import { memoizeOne } from '../../utilities/memoize.js';
import { chevronRightSvg } from '../icon/icons/entries/chevron-right.js';
import '../icon/icon.js';

/**
 * Tree node data structure
 */
export interface TreeNode {
  /** Unique identifier for the node */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon name */
  icon?: string;
  /** URL to navigate to when the node is clicked */
  href?: string;
  /** Child nodes */
  children?: TreeNode[];
  /** Whether the node is disabled */
  disabled?: boolean;
  /** Custom data attached to the node */
  data?: unknown;
}

/**
 * A hierarchical tree component for displaying nested data structures.
 *
 * @fires bp-select - Fired when a node is selected. Detail: { node: TreeNode, path: string[] }
 * @fires bp-expand - Fired when a node is expanded. Detail: { node: TreeNode, expanded: boolean }
 * @fires bp-collapse - Fired when a node is collapsed. Detail: { node: TreeNode, expanded: boolean }
 * @fires bp-navigate - Fired when a node with href is clicked. Detail: { node: TreeNode, href: string, path: string[] }. Call preventDefault() to handle navigation yourself.
 *
 * @slot - Default slot for custom tree items (when not using data prop)
 *
 * @csspart tree - The tree container
 * @csspart node - Individual tree nodes
 * @csspart node-content - The clickable content area of a node
 * @csspart node-icon - The expand/collapse icon
 * @csspart node-label - The node label text
 * @csspart node-children - Container for child nodes
 */
@customElement('bp-tree')
export class BpTree extends LitElement {
  /** Array of tree nodes to render */
  @property({ type: Array }) declare nodes: TreeNode[];

  /** Currently selected node ID */
  @property({ type: String, reflect: true }) declare selectedId: string | null;

  /** Array of expanded node IDs */
  @property({ type: Array }) declare expandedIds: string[];

  /** Whether multiple nodes can be selected */
  @property({ type: Boolean, reflect: true, attribute: 'multi-select' })
  declare multiSelect: boolean;

  /** Whether to show connecting lines between nodes */
  @property({ type: Boolean, reflect: true, attribute: 'show-lines' })
  declare showLines: boolean;

  /** Whether nodes can be selected */
  @property({ type: Boolean, reflect: true }) declare selectable: boolean;

  /** Size variant */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = ['sm', 'md', 'lg'];
        return value && valid.includes(value) ? value : 'md';
      },
    },
  })
  declare size: 'sm' | 'md' | 'lg';

  /** Selected node IDs when multiSelect is true */
  @state() private selectedIds: string[] = [];

  /**
   * Memoized computation of expanded IDs as a Set for O(1) lookups.
   * Only recomputes when expandedIds reference changes.
   */
  private computeExpandedSet = memoizeOne(
    (expandedIds: string[]): Set<string> => new Set(expandedIds)
  );

  /**
   * Get the memoized expanded set for fast lookups during rendering.
   */
  private get expandedSet(): Set<string> {
    return this.computeExpandedSet(this.expandedIds);
  }

  static styles = [treeStyles];

  constructor() {
    super();
    this.nodes = [];
    this.selectedId = null;
    this.expandedIds = [];
    this.multiSelect = false;
    this.showLines = false;
    this.selectable = true;
    this.size = 'md';
  }

  /**
   * Expand a node by ID.
   * Adds the node to expandedIds and dispatches bp-expand event.
   *
   * @param nodeId - The ID of the node to expand
   */
  expand(nodeId: string): void {
    if (!this.expandedSet.has(nodeId)) {
      this.expandedIds = [...this.expandedIds, nodeId];
      const node = this.findNode(nodeId, this.nodes);
      if (node) {
        this.dispatchEvent(
          new CustomEvent('bp-expand', {
            detail: { node, expanded: true },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  /**
   * Collapse a node by ID.
   * Removes the node from expandedIds and dispatches bp-collapse event.
   *
   * @param nodeId - The ID of the node to collapse
   */
  collapse(nodeId: string): void {
    if (this.expandedSet.has(nodeId)) {
      this.expandedIds = this.expandedIds.filter((id) => id !== nodeId);
      const node = this.findNode(nodeId, this.nodes);
      if (node) {
        this.dispatchEvent(
          new CustomEvent('bp-collapse', {
            detail: { node, expanded: false },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  /**
   * Toggle a node's expanded state.
   * Calls expand() if collapsed, collapse() if expanded.
   *
   * @param nodeId - The ID of the node to toggle
   */
  toggle(nodeId: string): void {
    if (this.expandedSet.has(nodeId)) {
      this.collapse(nodeId);
    } else {
      this.expand(nodeId);
    }
  }

  /**
   * Expand all nodes in the tree.
   * Sets expandedIds to include all nodes with children.
   */
  expandAll(): void {
    const allIds = this.getAllNodeIds(this.nodes);
    this.expandedIds = allIds;
  }

  /**
   * Collapse all nodes in the tree.
   * Clears the expandedIds array.
   */
  collapseAll(): void {
    this.expandedIds = [];
  }

  /**
   * Select a node by ID.
   * Respects multiSelect setting and disabled state.
   * Dispatches bp-select event with node, selectedIds, and path.
   *
   * @param nodeId - The ID of the node to select
   */
  selectNode(nodeId: string): void {
    const node = this.findNode(nodeId, this.nodes);
    if (!node || node.disabled) return;

    if (this.multiSelect) {
      if (this.selectedIds.includes(nodeId)) {
        this.selectedIds = this.selectedIds.filter((id) => id !== nodeId);
      } else {
        this.selectedIds = [...this.selectedIds, nodeId];
      }
    } else {
      this.selectedId = nodeId;
    }

    this.dispatchEvent(
      new CustomEvent('bp-select', {
        detail: {
          node,
          selectedIds: this.multiSelect ? this.selectedIds : [nodeId],
          path: this.getNodePath(nodeId, this.nodes),
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Clear all selections.
   * Resets both selectedId and selectedIds.
   */
  clearSelection(): void {
    this.selectedId = null;
    this.selectedIds = [];
  }

  /**
   * Recursively finds a node by ID in the tree structure.
   *
   * @param nodeId - The ID to search for
   * @param nodes - The array of nodes to search within
   * @returns The found node or null if not found
   */
  private findNode(nodeId: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = this.findNode(nodeId, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Recursively collects all node IDs that have children.
   * Used for expandAll functionality.
   *
   * @param nodes - The array of nodes to collect IDs from
   * @returns Array of node IDs that have children
   */
  private getAllNodeIds(nodes: TreeNode[]): string[] {
    const ids: string[] = [];
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        ids.push(...this.getAllNodeIds(node.children));
      }
    }
    return ids;
  }

  /**
   * Gets the path from root to a specific node.
   * Returns an array of node IDs representing the path.
   *
   * @param nodeId - The target node ID
   * @param nodes - The array of nodes to search within
   * @param path - Accumulator for the current path (used in recursion)
   * @returns Array of node IDs from root to target
   */
  private getNodePath(
    nodeId: string,
    nodes: TreeNode[],
    path: string[] = []
  ): string[] {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return [...path, node.id];
      }
      if (node.children) {
        const foundPath = this.getNodePath(nodeId, node.children, [
          ...path,
          node.id,
        ]);
        if (foundPath.length > path.length + 1) {
          return foundPath;
        }
      }
    }
    return path;
  }

  /**
   * Handles click events on tree nodes.
   * For nodes with href, dispatches bp-navigate and follows the link unless prevented.
   * For other nodes, selects the node if selectable and not disabled.
   *
   * @param event - The click event
   * @param node - The node that was clicked
   */
  private handleNodeClick(event: Event, node: TreeNode): void {
    event.stopPropagation();

    if (node.href && !node.disabled) {
      const navigateEvent = new CustomEvent('bp-navigate', {
        detail: {
          node,
          href: node.href,
          path: this.getNodePath(node.id, this.nodes),
        },
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      const allowed = this.dispatchEvent(navigateEvent);
      if (allowed) {
        // Default navigation — let the <a> handle it naturally
        return;
      }
      // Consumer called preventDefault(); suppress default link behavior
      event.preventDefault();
      return;
    }

    if (this.selectable && !node.disabled) {
      this.selectNode(node.id);
    }
  }

  /**
   * Handles click events on the expand/collapse toggle icon.
   * Prevents event propagation to avoid triggering node selection.
   *
   * @param event - The click event
   * @param node - The node whose toggle was clicked
   */
  private handleToggleClick(event: Event, node: TreeNode): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggle(node.id);
  }

  /**
   * Handles keyboard navigation on tree nodes.
   * Enter/Space: select node
   * ArrowRight: expand node (if has children and collapsed)
   * ArrowLeft: collapse node (if has children and expanded)
   *
   * @param event - The keyboard event
   * @param node - The node that received the keyboard event
   */
  private handleKeyDown(event: KeyboardEvent, node: TreeNode): void {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedSet.has(node.id);

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (node.href && !node.disabled) {
          this.handleNodeClick(event, node);
        } else if (this.selectable && !node.disabled) {
          this.selectNode(node.id);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (hasChildren && !isExpanded) {
          this.expand(node.id);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (hasChildren && isExpanded) {
          this.collapse(node.id);
        }
        break;
    }
  }

  /**
   * Checks if a node is currently selected.
   * Handles both single and multi-select modes.
   *
   * @param nodeId - The node ID to check
   * @returns True if the node is selected
   */
  private isSelected(nodeId: string): boolean {
    if (this.multiSelect) {
      return this.selectedIds.includes(nodeId);
    }
    return this.selectedId === nodeId;
  }

  /**
   * Recursively renders a tree node and its children.
   * Handles expand/collapse state, selection, and disabled state.
   *
   * @param node - The node to render
   * @param level - The nesting level (0 for root)
   * @returns Lit template result
   */
  private renderNode(node: TreeNode, level: number = 0): unknown {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedSet.has(node.id);
    const isSelected = this.isSelected(node.id);

    const contentClasses = `node-content ${isSelected ? 'node-content--selected' : ''} ${node.href ? 'node-content--link' : ''}`;

    const contentInner = html`
      <span
        class="node-toggle ${hasChildren ? 'node-toggle--visible' : ''}"
        part="node-icon"
        @click=${(e: Event) => this.handleToggleClick(e, node)}
      >
        ${hasChildren
          ? html`<bp-icon
              class="toggle-icon ${isExpanded ? 'toggle-icon--expanded' : ''}"
              .svg=${chevronRightSvg}
              size="sm"
            ></bp-icon>`
          : nothing}
      </span>
      ${node.icon
        ? html`<bp-icon
            class="node-icon"
            part="node-custom-icon"
            name=${node.icon}
            size="sm"
          ></bp-icon>`
        : nothing}
      <span class="node-label" part="node-label">${node.label}</span>
    `;

    const nodeContent = node.href
      ? html`
          <a
            class=${contentClasses}
            part="node-content"
            href=${node.href}
            tabindex=${node.disabled ? -1 : 0}
            @click=${(e: Event) => this.handleNodeClick(e, node)}
            @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, node)}
          >
            ${contentInner}
          </a>
        `
      : html`
          <div
            class=${contentClasses}
            part="node-content"
            tabindex=${node.disabled ? -1 : 0}
            @click=${(e: Event) => this.handleNodeClick(e, node)}
            @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, node)}
          >
            ${contentInner}
          </div>
        `;

    return html`
      <div
        class="node ${node.disabled ? 'node--disabled' : ''} ${hasChildren &&
        isExpanded
          ? 'node--expanded'
          : ''}"
        part="node"
        role="treeitem"
        aria-expanded=${ifDefined(
          hasChildren ? (isExpanded ? 'true' : 'false') : undefined
        )}
        aria-selected=${ifDefined(
          this.selectable ? (isSelected ? 'true' : 'false') : undefined
        )}
        aria-disabled=${ifDefined(node.disabled ? 'true' : undefined)}
        style="--node-level: ${level}"
      >
        ${nodeContent}
        ${hasChildren && isExpanded
          ? html`
              <div class="node-children" part="node-children" role="group">
                ${repeat(
                  node.children!,
                  (child) => child.id,
                  (child) => this.renderNode(child, level + 1)
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  render() {
    const hasNodes = this.nodes && this.nodes.length > 0;

    return html`
      <div
        class="tree tree--${this.size} ${this.showLines ? 'tree--lines' : ''}"
        part="tree"
        role="tree"
        aria-multiselectable=${ifDefined(this.multiSelect ? 'true' : undefined)}
      >
        ${hasNodes
          ? repeat(
              this.nodes,
              (node) => node.id,
              (node) => this.renderNode(node, 0)
            )
          : html`<slot></slot>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-tree': BpTree;
  }
}
