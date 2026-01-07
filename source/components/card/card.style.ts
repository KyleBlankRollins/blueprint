import { css } from 'lit';

export const cardStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .card {
    font-family: var(--bp-font-family);
    background-color: var(--bp-color-surface-elevated);
    border-radius: var(--bp-border-radius-lg);
    overflow: hidden;
    transition:
      box-shadow var(--bp-transition-fast),
      transform var(--bp-transition-base),
      border-color var(--bp-transition-fast);
  }

  .card-body {
    padding: var(--bp-spacing-lg);
    font-size: var(--bp-font-size-base);
    line-height: 1.6;
    color: var(--bp-color-text);
  }

  .card-body--no-padding {
    padding: 0;
  }

  /* Slot styles */
  ::slotted([slot='header']) {
    display: block;
    padding: var(--bp-spacing-lg);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    font-weight: var(--bp-font-weight-semibold);
    font-size: var(--bp-font-size-lg);
    line-height: 1.4;
    color: var(--bp-color-text-strong);
  }

  ::slotted([slot='footer']) {
    display: block;
    padding: var(--bp-spacing-lg);
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text-muted);
  }

  ::slotted([slot='media']) {
    display: block;
    width: 100%;
  }

  /* Variants */
  .card--default {
    border: var(--bp-border-width) solid var(--bp-color-border);
    box-shadow: var(--bp-shadow-sm);
  }

  .card--outlined {
    border: var(--bp-border-width) solid var(--bp-color-border-strong);
    box-shadow: none;
  }

  .card--elevated {
    border: none;
    box-shadow: var(--bp-shadow-lg);
  }

  /* States */
  .card--default.card--hoverable:hover,
  .card--default.card--clickable:hover {
    box-shadow: var(--bp-shadow-md);
    border-color: var(--bp-color-border-strong);
    transform: translateY(calc(-1 * var(--bp-spacing-2xs)));
  }

  .card--outlined.card--hoverable:hover,
  .card--outlined.card--clickable:hover {
    box-shadow: var(--bp-shadow-md);
    transform: translateY(calc(-1 * var(--bp-spacing-2xs)));
  }

  .card--elevated.card--hoverable:hover,
  .card--elevated.card--clickable:hover {
    box-shadow: var(--bp-shadow-xl);
    transform: translateY(calc(-1 * var(--bp-spacing-xs)));
  }

  .card--clickable {
    cursor: pointer;
    user-select: none;
  }

  .card--clickable:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: var(--bp-focus-offset);
  }

  .card--clickable:active {
    transform: translateY(calc(-1 * var(--bp-spacing-2xs) / 2));
    box-shadow: var(--bp-shadow-sm);
  }
`;
