import { css } from 'lit';

export const treeStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .tree {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
  }

  /* Node structure */
  .node {
    position: relative;
  }

  .node-content {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-2);
    padding: var(--bp-spacing-2) var(--bp-spacing-3);
    padding-left: calc(
      var(--bp-spacing-3) + var(--node-level, 0) * var(--bp-spacing-5)
    );
    border-radius: var(--bp-border-radius-sm);
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .node-content:hover {
    background-color: var(--bp-color-surface-subdued);
  }

  .node-content:focus {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .node-content:focus:not(:focus-visible) {
    outline: none;
  }

  .node-content:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Selected state */
  .node-content--selected {
    background-color: oklch(from var(--bp-color-primary) l c h / 0.15);
    color: var(--bp-color-primary);
  }

  .node-content--selected:hover {
    background-color: oklch(from var(--bp-color-primary) l c h / 0.2);
  }

  /* Active state */
  .node-content:active {
    background-color: var(--bp-color-surface-subdued);
    transform: translateY(1px);
  }

  .node-content--selected:active {
    background-color: oklch(from var(--bp-color-primary) l c h / 0.25);
  }

  /* Toggle icon */
  .node-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
    flex-shrink: 0;
    visibility: hidden;
  }

  .node-toggle--visible {
    visibility: visible;
  }

  .node-toggle--visible:hover {
    background-color: var(--bp-color-surface-subdued);
    border-radius: var(--bp-border-radius-sm);
  }

  .toggle-icon {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    transition: transform var(--bp-transition-fast) ease-out;
  }

  .toggle-icon--expanded {
    transform: rotate(90deg);
  }

  /* Node custom icon */
  .node-icon {
    flex-shrink: 0;
    color: var(--bp-color-text-muted);
  }

  /* Node label */
  .node-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Children container */
  .node-children {
    position: relative;
    content-visibility: auto;
    contain-intrinsic-size: auto 200px;
  }

  /* Expanded state visual cue */
  .node--expanded > .node-content {
    background-color: var(--bp-color-surface);
  }

  /* Disabled state */
  .node--disabled .node-content {
    cursor: not-allowed;
  }

  .node--disabled .node-label {
    opacity: var(--bp-opacity-disabled);
  }

  .node--disabled .node-content:hover {
    background-color: transparent;
  }

  /* Show lines variant */
  .tree--lines .node-children {
    margin-left: calc(var(--bp-spacing-4) + var(--bp-spacing-4));
    padding-left: var(--bp-spacing-4);
    border-left: var(--bp-border-width) solid var(--bp-color-border);
  }

  /* Sizes */
  .tree--sm {
    font-size: var(--bp-font-size-sm);
  }

  .tree--sm .node-content {
    padding: var(--bp-spacing-1) var(--bp-spacing-2);
    padding-left: calc(
      var(--bp-spacing-2) + var(--node-level, 0) * var(--bp-spacing-4)
    );
  }

  .tree--sm .node-toggle {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  .tree--sm .toggle-icon {
    width: var(--bp-spacing-3);
    height: var(--bp-spacing-3);
  }

  .tree--lg {
    font-size: var(--bp-font-size-lg);
  }

  .tree--lg .node-content {
    padding: var(--bp-spacing-3) var(--bp-spacing-4);
    padding-left: calc(
      var(--bp-spacing-4) + var(--node-level, 0) * var(--bp-spacing-6)
    );
  }

  .tree--lg .node-toggle {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  .tree--lg .toggle-icon {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .node-content,
    .toggle-icon {
      transition: none;
    }

    .node-content:active {
      transform: none;
    }
  }
`;
