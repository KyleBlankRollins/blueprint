import { css } from 'lit';

export const accordionStyles = css`
  /* ===== ACCORDION CONTAINER ===== */

  :host {
    display: block;
  }

  .accordion {
    font-family: var(--bp-font-family);
    display: flex;
    flex-direction: column;
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius);
    overflow: hidden;
  }

  /* Disabled state */
  .accordion--disabled {
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  /* ===== ACCORDION ITEM ===== */

  /* Separators between items */
  :host(:not(:first-of-type)) {
    border-top: var(--bp-border-width) solid var(--bp-color-border);
  }

  .item {
    display: flex;
    flex-direction: column;
  }

  /* Header button */
  .item__header {
    /* Reset */
    appearance: none;
    border: none;
    background: transparent;
    margin: 0;

    /* Layout */
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--bp-spacing-4) var(--bp-spacing-4);
    gap: var(--bp-spacing-3);

    /* Typography */
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-medium);
    text-align: left;
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);

    /* Interaction */
    cursor: pointer;
    transition: background-color var(--bp-transition-fast);
  }

  .item__header:hover:not(:disabled) {
    background-color: var(--bp-color-surface);
  }

  .item__header:focus {
    outline: none;
  }

  .item__header:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }
  .item__header:active:not(:disabled) {
    background-color: var(--bp-color-surface-hover);
    transform: translateY(1px);
  }
  .item__header-content {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-3);
    flex: 1;
  }

  /* Expand/collapse icon */
  .item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--bp-color-text-muted);
    transition: transform var(--bp-transition-fast);
  }

  /* Icon is sized by bp-icon component */

  /* Rotate icon when expanded */
  .item--expanded .item__icon {
    transform: rotate(180deg);
  }

  /* Collapsible content */
  .item__content {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows var(--bp-transition-base);
    content-visibility: hidden;
  }

  .item--expanded .item__content {
    grid-template-rows: 1fr;
    content-visibility: visible;
  }

  .item__body {
    min-height: 0;
    padding: 0 var(--bp-spacing-4) var(--bp-spacing-4) var(--bp-spacing-4);
    color: var(--bp-color-text);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-relaxed);
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--bp-transition-fast);
  }

  .item--expanded .item__body {
    opacity: 1;
    transition-delay: 100ms;
  }

  .item:not(.item--expanded) .item__body {
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    transition-delay: 0ms;
  }

  /* Disabled state */
  .item--disabled .item__header {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
  }

  .item--disabled .item__icon {
    opacity: 1;
  }

  .item--disabled .item__header:hover {
    background-color: transparent;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .item__icon {
      transition: none;
    }

    .item__content {
      transition: none;
    }

    .item__body {
      transition: none;
      opacity: 1;
    }

    .item__header:active:not(:disabled) {
      transform: none;
    }
  }
`;
