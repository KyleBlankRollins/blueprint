import { css } from 'lit';

export const inputStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-xs);
  }

  .input-label {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  .input-required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
  }

  .input {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
    background-color: var(--bp-color-background);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    transition:
      border-color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
    width: 100%;
    box-sizing: border-box;
  }

  .input::placeholder {
    color: var(--bp-color-text-muted);
    opacity: var(--bp-opacity-subtle);
  }

  /* Variants */
  .input--default {
    border-color: var(--bp-color-border);
  }

  .input--success {
    border-color: var(--bp-color-success);
  }

  .input--error {
    border-color: var(--bp-color-error);
  }

  .input--warning {
    border-color: var(--bp-color-warning);
  }

  .input--info {
    border-color: var(--bp-color-info);
  }

  /* Sizes */
  .input--sm {
    font-size: var(--bp-font-size-sm);
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
  }

  .input--md {
    font-size: var(--bp-font-size-base);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
  }

  .input--lg {
    font-size: var(--bp-font-size-lg);
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
  }

  /* States */
  .input:hover:not(:disabled):not(:focus) {
    border-color: var(--bp-color-border-strong);
  }

  .input:focus {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-focus);
  }

  .input:focus-visible {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-focus);
  }

  .input:disabled {
    opacity: var(--bp-opacity-disabled);
    cursor: not-allowed;
    background-color: var(--bp-color-surface-subdued);
  }

  .input:read-only {
    background-color: var(--bp-color-surface);
    cursor: default;
  }

  /* Variant-specific focus states */
  .input--success:focus,
  .input--success:focus-visible {
    border-color: var(--bp-color-success);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-success);
  }

  .input--error:focus,
  .input--error:focus-visible {
    border-color: var(--bp-color-error);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-error);
  }

  .input--warning:focus,
  .input--warning:focus-visible {
    border-color: var(--bp-color-warning);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-warning);
  }

  .input--info:focus,
  .input--info:focus-visible {
    border-color: var(--bp-color-info);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-info);
  }

  /* Messages */
  .input-message {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .input-message--error {
    color: var(--bp-color-error);
  }
`;
