import { css } from 'lit';

export const modalStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  :host([open]) {
    display: block;
  }

  :host(:not([open])) {
    display: none;
  }

  /* Backdrop */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--bp-z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bp-color-backdrop);
    animation: fadeIn var(--bp-duration-fast) var(--bp-ease-out);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(var(--bp-spacing-8));
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Dialog */
  .modal-dialog {
    position: relative;
    background-color: var(--bp-color-surface-elevated);
    border-radius: var(--bp-border-radius-lg);
    box-shadow: var(--bp-shadow-xl);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp var(--bp-duration-normal) var(--bp-ease-out);
    outline: none;
  }

  /* Header */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--bp-spacing-md);
    padding: var(--bp-spacing-6);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    font-family: var(--bp-font-family);
  }

  ::slotted([slot='header']) {
    flex: 1;
    font-size: var(--bp-font-size-xl);
    font-weight: var(--bp-font-weight-semibold);
    color: var(--bp-color-text-strong);
    line-height: var(--bp-line-height-tight);
    margin: 0;
  }

  /* Close button */
  .modal-close {
    appearance: none;
    background: transparent;
    border: none;
    padding: var(--bp-spacing-2);
    cursor: pointer;
    color: var(--bp-color-text-muted);
    border-radius: var(--bp-border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--bp-transition-fast);
    flex-shrink: 0;
  }

  .modal-close:hover {
    background-color: var(--bp-color-surface);
    color: var(--bp-color-text);
  }

  .modal-close:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: var(--bp-focus-offset);
  }

  .modal-close svg {
    display: block;
  }

  /* Body */
  .modal-body {
    flex: 1;
    padding: var(--bp-spacing-6);
    overflow-y: auto;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-relaxed);
    color: var(--bp-color-text);
  }

  /* Footer */
  .modal-footer {
    padding: var(--bp-spacing-6);
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    display: flex;
    gap: var(--bp-spacing-3);
    justify-content: flex-end;
    align-items: center;
  }

  .modal-footer:empty {
    display: none;
  }

  /* Sizes */
  .modal-dialog--sm {
    width: 90%;
    max-width: calc(var(--bp-spacing-24) * 4 + var(--bp-spacing-16));
  }

  .modal-dialog--md {
    width: 90%;
    max-width: var(--bp-breakpoint-sm);
  }

  .modal-dialog--lg {
    width: 90%;
    max-width: var(--bp-breakpoint-md);
  }

  /* States */
  .modal-dialog:focus {
    outline: none;
  }
`;
