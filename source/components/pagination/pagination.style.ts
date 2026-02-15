import { css } from 'lit';

export const paginationStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    font-family: var(--bp-font-sans);
  }

  .pagination__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    background-color: var(--bp-color-background);
    color: var(--bp-color-text);
    font-family: var(--bp-font-sans);
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-medium);
    line-height: var(--bp-line-height-tight);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast),
      color var(--bp-transition-fast),
      transform var(--bp-transition-fast);
    user-select: none;
  }

  .pagination__button:hover:not(:disabled) {
    background-color: var(--bp-color-surface);
    border-color: var(--bp-color-border-strong);
    color: var(--bp-color-text);
  }

  .pagination__button:active:not(:disabled) {
    background-color: var(--bp-color-surface);
    border-color: var(--bp-color-border-strong);
    transform: translateY(1px) scale(0.98);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .pagination__button:focus-visible {
    outline: var(--bp-border-width) solid var(--bp-color-primary);
    outline-offset: var(--bp-spacing-0-5);
  }

  .pagination__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination__button--active {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
    font-weight: var(--bp-font-weight-semibold);
  }

  .pagination__button--active:hover:not(:disabled) {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  .pagination__button--active:focus-visible {
    outline: 2px solid var(--bp-color-text-inverse);
    outline-offset: 2px;
  }

  /* Navigation buttons (first, last, prev, next) - ghost style for visual hierarchy */
  .pagination__button--first,
  .pagination__button--last,
  .pagination__button--prev,
  .pagination__button--next {
    color: var(--bp-color-text-muted);
    background-color: transparent;
  }

  .pagination__button--first:hover:not(:disabled),
  .pagination__button--last:hover:not(:disabled),
  .pagination__button--prev:hover:not(:disabled),
  .pagination__button--next:hover:not(:disabled) {
    color: var(--bp-color-text);
    background-color: var(--bp-color-surface);
  }

  .pagination__ellipsis {
    display: inline-flex;
    align-items: end;
    justify-content: center;
    min-width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-base);
    user-select: none;
  }

  .pagination__info {
    margin-left: var(--bp-spacing-lg);
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-sm);
    white-space: nowrap;
  }

  /* Sizes */
  .pagination--sm .pagination__button {
    min-width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
    padding: var(--bp-spacing-2xs) var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
  }

  .pagination--sm .pagination__ellipsis {
    min-width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
    font-size: var(--bp-font-size-sm);
  }

  .pagination--sm .pagination__info {
    font-size: var(--bp-font-size-xs);
  }

  .pagination--lg .pagination__button {
    min-width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-lg);
  }

  .pagination--lg .pagination__ellipsis {
    min-width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    font-size: var(--bp-font-size-lg);
  }

  .pagination--lg .pagination__info {
    font-size: var(--bp-font-size-base);
  }

  .pagination--lg {
    gap: var(--bp-spacing-md);
  }

  /* Touch target size: ensure 44x44px minimum on touch devices */
  @media (pointer: coarse) {
    .pagination__button {
      min-width: 44px;
      min-height: 44px;
    }
  }
`;
