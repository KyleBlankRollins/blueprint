import { css } from 'lit';

export const tableStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: var(--bp-border-radius);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text);
    background: var(--bp-color-surface);
  }

  /* Header styles */
  .header-row {
    background: var(--bp-color-surface-subdued);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
  }

  .header-cell {
    font-weight: var(--bp-font-weight-semibold);
    text-align: left;
    color: var(--bp-color-text);
  }

  .header-cell--sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color var(--bp-transition-fast);
    position: relative;
  }

  .header-cell--sortable::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    transition: background var(--bp-transition-fast);
  }

  .header-cell--sortable:hover::after {
    background: var(--bp-color-primary);
    opacity: 0.3;
  }

  .header-cell--sortable:hover {
    background: var(--bp-color-surface);
  }

  .header-cell--sortable:active {
    background: var(--bp-color-surface-subdued);
    transform: translateY(1px);
  }

  .header-cell__content {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-1);
  }

  .header-cell__label {
    flex: 1;
  }

  /* Sort icon */
  .sort-icon {
    display: flex;
    align-items: center;
    color: var(--bp-color-text-muted);
    transition: color var(--bp-transition-fast);
  }

  .sort-icon--active {
    color: var(--bp-color-primary);
  }

  /* Cell styles */
  .cell {
    padding: var(--bp-spacing-3) var(--bp-spacing-4);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    vertical-align: middle;
  }

  .cell--checkbox {
    width: var(--bp-spacing-10);
    text-align: center;
    padding-left: var(--bp-spacing-3);
    padding-right: 0;
  }

  .cell--checkbox input[type='checkbox'] {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
    cursor: pointer;
  }

  /* Row styles */
  .row {
    transition: background-color var(--bp-transition-fast);
    content-visibility: auto;
    contain-intrinsic-size: auto 48px;
  }

  .row--hoverable:hover {
    background: var(--bp-color-surface-subdued);
  }

  .row--selected {
    background: oklch(from var(--bp-color-primary) l c h / 0.15);
  }

  .row--selected:hover {
    background: oklch(from var(--bp-color-primary) l c h / 0.2);
  }

  /* Remove border from last row */
  tbody tr:last-child .cell {
    border-bottom: none;
  }

  /* Variants */
  .table--striped tbody tr:nth-child(even) {
    background: var(--bp-color-surface-subdued);
  }

  .table--striped tbody tr:nth-child(even):hover {
    background: var(--bp-color-surface);
  }

  .table--striped .row--selected {
    background: oklch(from var(--bp-color-primary) l c h / 0.15) !important;
  }

  .table--striped .row--selected:hover {
    background: oklch(from var(--bp-color-primary) l c h / 0.2) !important;
  }

  .table--bordered {
    border: var(--bp-border-width) solid var(--bp-color-border);
  }

  .table--bordered .cell {
    border: var(--bp-border-width) solid var(--bp-color-border);
  }

  /* Sizes */
  .table--sm .cell {
    padding: var(--bp-spacing-1) var(--bp-spacing-3);
    font-size: var(--bp-font-size-xs);
  }

  .table--sm .row {
    contain-intrinsic-size: auto 36px;
  }

  .table--md .cell {
    padding: var(--bp-spacing-3) var(--bp-spacing-4);
    font-size: var(--bp-font-size-sm);
  }

  .table--md .row {
    contain-intrinsic-size: auto 48px;
  }

  .table--lg .cell {
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
    font-size: var(--bp-font-size-base);
  }

  .table--lg .row {
    contain-intrinsic-size: auto 56px;
  }

  /* Sticky header */
  .table--sticky-header thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .table--sticky-header .header-row {
    box-shadow: var(--bp-shadow-sm);
  }

  /* Selectable - add pointer cursor */
  .table--selectable .row {
    cursor: pointer;
  }

  /* Loading state */
  .table--loading {
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: var(--bp-spacing-10);
    color: var(--bp-color-text-muted);
    background: var(--bp-color-surface-subdued);
  }

  .state-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--bp-spacing-3);
    padding: var(--bp-spacing-5);
  }

  .sort-icon--inactive {
    opacity: 0.4;
  }

  /* Focus styles for keyboard navigation */
  .header-cell--sortable:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .row:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: calc(-1 * var(--bp-focus-offset));
  }

  .cell--checkbox input[type='checkbox']:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .row,
    .header-cell--sortable,
    .sort-icon {
      transition: none;
    }

    .header-cell--sortable:active {
      transform: none;
    }

    .header-cell--sortable::after {
      transition: none;
    }
  }
`;
