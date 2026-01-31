import { css } from 'lit';

export const notificationStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .notification {
    display: flex;
    align-items: flex-start;
    gap: var(--bp-spacing-3);
    padding: var(--bp-spacing-4);
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    box-shadow: var(--bp-shadow-lg);
    font-family: var(--bp-font-sans);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
    max-width: 400px;
    min-width: 300px;
    animation: notification-slide-in var(--bp-duration-fast) var(--bp-ease-out);
  }

  @keyframes notification-slide-in {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--bp-spacing-2)));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes notification-slide-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(calc(-1 * var(--bp-spacing-2)));
    }
  }

  .notification--exiting {
    animation: notification-slide-out var(--bp-duration-fast) var(--bp-ease-in)
      forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .notification {
      animation: none;
    }

    .notification--exiting {
      animation: none;
      opacity: 0;
    }
  }

  /* Icon */
  .notification__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification__icon svg {
    width: 100%;
    height: 100%;
  }

  /* Content */
  .notification__content {
    flex: 1;
    min-width: 0;
  }

  .notification__title {
    font-weight: var(--bp-font-weight-semibold);
    margin-bottom: var(--bp-spacing-1);
    color: var(--bp-color-text-strong);
  }

  .notification__message {
    color: var(--bp-color-text-muted);
  }

  /* Action */
  .notification__action {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-1);
  }

  .notification__action:empty {
    display: none;
  }

  /* Close button */
  .notification__close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-11);
    height: var(--bp-spacing-11);
    padding: 0;
    margin: calc(-1 * var(--bp-spacing-2));
    background: none;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      color var(--bp-transition-fast),
      background-color var(--bp-transition-fast);
  }

  .notification__close:hover {
    color: var(--bp-color-text);
    background-color: var(--bp-color-surface-subdued);
  }

  .notification__close:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .notification__close svg {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  /* Variants */
  .notification--info {
    border-left: var(--bp-spacing-1) solid var(--bp-color-info);
  }

  .notification--info .notification__icon {
    color: var(--bp-color-info);
  }

  .notification--success {
    border-left: var(--bp-spacing-1) solid var(--bp-color-success);
  }

  .notification--success .notification__icon {
    color: var(--bp-color-success);
  }

  .notification--warning {
    border-left: var(--bp-spacing-1) solid var(--bp-color-warning);
  }

  .notification--warning .notification__icon {
    color: var(--bp-color-warning);
  }

  .notification--error {
    border-left: var(--bp-spacing-1) solid var(--bp-color-error);
  }

  .notification--error .notification__icon {
    color: var(--bp-color-error);
  }

  /* Position classes are handled by the default animation */
  /* Future: Container component will manage positioning */
`;
