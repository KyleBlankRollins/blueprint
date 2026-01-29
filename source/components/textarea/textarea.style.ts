import { css } from 'lit';

export const textareaStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-xs);
  }

  .textarea-label {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  .textarea-required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
  }

  .textarea {
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
    min-height: var(--bp-spacing-20);
  }

  .textarea::placeholder {
    color: var(--bp-color-text-muted);
    opacity: var(--bp-opacity-subtle);
  }

  /* Variants */
  .textarea--default {
    border-color: var(--bp-color-border);
  }

  .textarea--success {
    border-color: var(--bp-color-success);
  }

  .textarea--error {
    border-color: var(--bp-color-error);
  }

  .textarea--warning {
    border-color: var(--bp-color-warning);
  }

  .textarea--info {
    border-color: var(--bp-color-info);
  }

  /* Sizes */
  .textarea--sm {
    font-size: var(--bp-font-size-sm);
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    min-height: var(--bp-spacing-16);
  }

  .textarea--md {
    font-size: var(--bp-font-size-base);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    min-height: var(--bp-spacing-20);
  }

  .textarea--lg {
    font-size: var(--bp-font-size-lg);
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    min-height: var(--bp-spacing-24);
  }

  /* Resize variants */
  .textarea--resize-none {
    resize: none;
  }

  .textarea--resize-both {
    resize: both;
  }

  .textarea--resize-horizontal {
    resize: horizontal;
  }

  .textarea--resize-vertical {
    resize: vertical;
  }

  /* States */
  .textarea:hover:not(:disabled):not(:focus) {
    border-color: var(--bp-color-border-strong);
  }

  .textarea:focus {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-focus);
  }

  .textarea:focus-visible {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-focus);
  }

  .textarea:disabled {
    opacity: var(--bp-opacity-disabled);
    cursor: not-allowed;
    background-color: var(--bp-color-surface-subdued);
  }

  .textarea:read-only {
    background-color: var(--bp-color-surface);
    cursor: default;
  }

  /* Variant-specific focus states */
  .textarea--success:focus,
  .textarea--success:focus-visible {
    border-color: var(--bp-color-success);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-success);
  }

  .textarea--error:focus,
  .textarea--error:focus-visible {
    border-color: var(--bp-color-error);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-error);
  }

  .textarea--warning:focus,
  .textarea--warning:focus-visible {
    border-color: var(--bp-color-warning);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-warning);
  }

  .textarea--info:focus,
  .textarea--info:focus-visible {
    border-color: var(--bp-color-info);
    box-shadow: 0 0 0 var(--bp-focus-offset) var(--bp-color-info);
  }

  /* Messages */
  .textarea-message {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .textarea-message--error {
    color: var(--bp-color-error);
  }

  /* iOS zoom prevention: ensure 16px minimum on touch devices */
  @media (max-width: 768px) {
    .textarea--sm {
      font-size: 16px;
    }
  }
`;
