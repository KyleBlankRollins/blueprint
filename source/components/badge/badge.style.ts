import { css } from 'lit';

export const badgeStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--bp-font-family-sans);
    font-weight: var(--bp-font-weight-medium);
    line-height: 1;
    border-radius: var(--bp-border-radius-full);
    white-space: nowrap;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  /* Variants */
  .badge--primary {
    background-color: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .badge--success {
    background-color: var(--bp-color-success);
    color: var(--bp-color-text-inverse);
  }

  .badge--error {
    background-color: var(--bp-color-error);
    color: var(--bp-color-text-inverse);
  }

  .badge--warning {
    background-color: var(--bp-color-warning);
    color: var(--bp-color-text-inverse);
  }

  .badge--info {
    background-color: var(--bp-color-info);
    color: var(--bp-color-text-inverse);
  }

  .badge--neutral {
    background-color: var(--bp-color-border-strong);
    color: var(--bp-color-text);
  }

  /* Sizes */
  .badge--small {
    padding: var(--bp-spacing-xs) var(--bp-spacing-xs);
    font-size: var(--bp-font-size-xs);
    min-width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }

  .badge--medium {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
    min-width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  .badge--large {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
    min-width: var(--bp-spacing-8);
    height: var(--bp-spacing-8);
  }

  /* Dot variant */
  .badge--dot {
    padding: 0;
    border-radius: var(--bp-border-radius-full);
  }

  .badge--dot.badge--small {
    width: var(--bp-spacing-2);
    height: var(--bp-spacing-2);
    min-width: var(--bp-spacing-2);
  }

  .badge--dot.badge--medium {
    width: var(--bp-spacing-3);
    height: var(--bp-spacing-3);
    min-width: var(--bp-spacing-3);
  }

  .badge--dot.badge--large {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    min-width: var(--bp-spacing-4);
  }
`;
