import { css } from 'lit';

export const buttonStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .button {
    /* Reset */
    appearance: none;
    border: none;
    margin: 0;

    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--bp-spacing-sm);
    cursor: pointer;
    user-select: none;

    /* Typography */
    font-family: var(--bp-font-sans);
    font-weight: var(--bp-font-weight-medium);
    text-decoration: none;
    white-space: nowrap;

    /* Visual */
    border-radius: var(--bp-border-radius-md);
    transition: all var(--bp-duration-fast);

    /* Accessibility */
    outline: none;
  }

  /* Variants */
  .button--primary {
    background: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .button--success {
    background: var(--bp-color-success);
    color: var(--bp-color-text-inverse);
  }

  .button--error {
    background: var(--bp-color-error);
    color: var(--bp-color-text-inverse);
  }

  .button--warning {
    background: var(--bp-color-warning);
    color: var(--bp-color-text-inverse);
  }

  .button--info {
    background: var(--bp-color-info);
    color: var(--bp-color-text-inverse);
  }

  .button--secondary {
    background: var(--bp-color-surface-elevated);
    color: var(--bp-color-text);
    border: var(--bp-border-width) solid var(--bp-color-border-strong);
  }

  /* Sizes */
  .button--sm {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-tight);
  }

  .button--md {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
  }

  .button--lg {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
    line-height: var(--bp-line-height-normal);
  }

  /* States */
  .button:hover:not(:disabled) {
    transform: translateY(calc(-1 * var(--bp-spacing-0-5)));
    box-shadow: var(--bp-shadow-md);
  }

  .button--primary:hover:not(:disabled) {
    background: var(--bp-color-primary-hover);
  }

  .button--success:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .button--error:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .button--warning:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .button--info:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .button--secondary:hover:not(:disabled) {
    background: var(--bp-color-surface);
    border-color: var(--bp-color-border-strong);
  }

  .button:active:not(:disabled) {
    transform: translateY(0);
  }

  .button--primary:active:not(:disabled) {
    background: var(--bp-color-primary-active);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
  }

  .button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }
`;
