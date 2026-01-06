import { css } from 'lit';

export const alertStyles = css`
  /* Base styles */
  :host {
    display: block;
    animation: slideIn var(--bp-transition-base) ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--bp-spacing-md)));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .alert {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--bp-spacing-md);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-family: var(--bp-font-sans);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-relaxed);
    border-radius: var(--bp-border-radius-md);
    border-width: var(--bp-border-width);
    border-style: solid;
  }

  @media (min-width: var(--bp-breakpoint-sm)) {
    .alert {
      padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    }
  }

  .alert-content {
    display: flex;
    align-items: flex-start;
    gap: var(--bp-spacing-md);
    flex: 1;
  }

  .alert-icon {
    display: flex;
    align-items: flex-start;
    padding-top: var(--bp-spacing-0-5);
    flex-shrink: 0;
  }

  .alert-icon svg {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
    flex-shrink: 0;
  }

  .alert-message {
    flex: 1;
  }

  ::slotted([slot='title']) {
    display: block;
    font-weight: var(--bp-font-weight-semibold);
    line-height: var(--bp-line-height-tight);
    margin-bottom: var(--bp-spacing-xs);
  }

  .alert-close {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--bp-spacing-2xs);
    border-radius: var(--bp-border-radius-sm);
    color: inherit;
    opacity: 0.8;
    transition: all var(--bp-transition-fast);
    flex-shrink: 0;
  }

  .alert-close:hover {
    opacity: 1;
    background-color: currentColor;
    opacity: 0.1;
  }

  .alert-close:active {
    opacity: 0.15;
  }

  .alert-close:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: var(--bp-focus-offset);
  }

  /* Variants */
  .alert--info {
    background-color: var(--bp-blue-50);
    border-color: var(--bp-blue-400);
    border-left-width: var(--bp-spacing-1);
    color: var(--bp-blue-900);
  }

  .alert--success {
    background-color: var(--bp-green-100);
    border-color: var(--bp-green-600);
    border-left-width: var(--bp-spacing-1);
    color: var(--bp-green-900);
  }

  .alert--warning {
    background-color: var(--bp-yellow-200);
    border-color: var(--bp-yellow-700);
    border-left-width: var(--bp-spacing-1);
    color: var(--bp-yellow-900);
    box-shadow: var(--bp-shadow-sm);
  }

  .alert--error {
    background-color: var(--bp-red-200);
    border-color: var(--bp-red-700);
    border-left-width: var(--bp-spacing-1);
    color: var(--bp-red-900);
    box-shadow: var(--bp-shadow-sm);
  }
`;
