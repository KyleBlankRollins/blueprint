import { css } from 'lit';

export const numberInputStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .number-input {
    font-family: var(--bp-font-family);
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-xs);
  }

  .number-input__label {
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  .number-input__required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
  }

  .number-input__container {
    display: flex;
    align-items: stretch;
  }

  .number-input__input {
    flex: 1;
    min-width: 0;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
    background-color: var(--bp-color-background);
    border: var(--bp-border-width) solid var(--bp-color-border);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    text-align: center;
    font-variant-numeric: tabular-nums;
    transition:
      border-color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
  }

  .number-input__input::placeholder {
    color: var(--bp-color-text-muted);
    opacity: var(--bp-opacity-subtle);
  }

  .number-input__input:hover:not(:disabled):not(:readonly) {
    border-color: var(--bp-color-border-strong);
  }

  .number-input__input:focus {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  .number-input__input:focus-visible {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  /* Button styling */
  .number-input__button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    color: var(--bp-color-text);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast);
    padding: 0;
  }

  .number-input__button:hover:not(:disabled) {
    background-color: var(--bp-color-surface-elevated);
    border-color: var(--bp-color-border-strong);
  }

  .number-input__button:active:not(:disabled) {
    background-color: var(--bp-color-surface-subdued);
  }

  .number-input__button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
    z-index: 1;
  }

  .number-input__button:disabled {
    opacity: var(--bp-opacity-disabled);
    background-color: var(--bp-color-surface-subdued);
    cursor: not-allowed;
  }

  .number-input__button--decrement {
    border-right: none;
    border-radius: var(--bp-border-radius-md) 0 0 var(--bp-border-radius-md);
  }

  .number-input__button--increment {
    border-left: none;
    border-radius: 0 var(--bp-border-radius-md) var(--bp-border-radius-md) 0;
  }

  .number-input__button-icon {
    font-size: var(--bp-font-size-lg);
    font-weight: var(--bp-font-weight-bold);
    line-height: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Input border radius adjustment when buttons visible */
  .number-input:not(.number-input--hide-buttons) .number-input__input {
    border-radius: 0;
  }

  .number-input--hide-buttons .number-input__input {
    border-radius: var(--bp-border-radius-md);
  }

  /* Size variants */
  .number-input--small .number-input__input {
    font-size: var(--bp-font-size-sm);
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
  }

  .number-input--small .number-input__button {
    width: var(--bp-spacing-8);
  }

  .number-input--small .number-input__button-icon {
    font-size: var(--bp-font-size-base);
  }

  .number-input--medium .number-input__input {
    font-size: var(--bp-font-size-base);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
  }

  .number-input--medium .number-input__button {
    width: var(--bp-spacing-10);
  }

  .number-input--large .number-input__input {
    font-size: var(--bp-font-size-lg);
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
  }

  .number-input--large .number-input__button {
    width: var(--bp-spacing-12);
  }

  .number-input--large .number-input__button-icon {
    font-size: var(--bp-font-size-xl);
  }

  /* Variant styles */
  .number-input__input--default {
    border-color: var(--bp-color-border);
  }

  .number-input__input--success {
    border-color: var(--bp-color-success);
  }

  .number-input__input--success:focus,
  .number-input__input--success:focus-visible {
    border-color: var(--bp-color-success);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-success);
  }

  .number-input__input--error {
    border-color: var(--bp-color-error);
  }

  .number-input__input--error:focus,
  .number-input__input--error:focus-visible {
    border-color: var(--bp-color-error);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-error);
  }

  .number-input__input--warning {
    border-color: var(--bp-color-warning);
  }

  .number-input__input--warning:focus,
  .number-input__input--warning:focus-visible {
    border-color: var(--bp-color-warning);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-warning);
  }

  /* Match button border color to input variant */
  .number-input--success .number-input__button {
    border-color: var(--bp-color-success);
  }

  .number-input--error .number-input__button {
    border-color: var(--bp-color-error);
  }

  .number-input--warning .number-input__button {
    border-color: var(--bp-color-warning);
  }

  /* States */
  .number-input--disabled {
    pointer-events: none;
  }

  .number-input--disabled .number-input__input {
    opacity: var(--bp-opacity-disabled);
    background-color: var(--bp-color-surface-subdued);
    cursor: not-allowed;
  }

  .number-input--disabled .number-input__label {
    opacity: var(--bp-opacity-disabled);
  }

  .number-input--readonly .number-input__input {
    background-color: var(--bp-color-surface-subdued);
    cursor: default;
  }

  .number-input--readonly .number-input__button {
    background-color: var(--bp-color-surface-subdued);
    pointer-events: none;
  }

  /* Message styles */
  .number-input__message {
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .number-input__message--error {
    color: var(--bp-color-error);
  }

  .number-input__message--success {
    color: var(--bp-color-success);
  }

  .number-input__message--warning {
    color: var(--bp-color-warning);
  }

  /* iOS zoom prevention: ensure 16px minimum on touch devices */
  @media (max-width: 768px) {
    .number-input--small .number-input__input {
      font-size: 16px;
    }
  }
`;
