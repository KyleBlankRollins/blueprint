import { css } from 'lit';

export const timePickerStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    width: 100%;
  }

  .time-picker {
    position: relative;
    font-family: var(--bp-font-family);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .input {
    width: 100%;
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    padding-right: var(--bp-spacing-2xl);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    font-size: var(--bp-font-size-base);
    font-family: var(--bp-font-family);
    color: var(--bp-color-text);
    background-color: var(--bp-color-surface);
    cursor: pointer;
    transition: border-color var(--bp-transition-fast);
  }

  .input::placeholder {
    color: var(--bp-color-text-muted);
  }

  .icon {
    position: absolute;
    right: var(--bp-spacing-sm);
    pointer-events: none;
    font-size: var(--bp-font-size-lg);
    color: var(--bp-color-text-muted);
  }

  .clear-button {
    position: absolute;
    right: var(--bp-spacing-xl);
    background: none;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    font-size: var(--bp-font-size-xl);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    padding: 0;
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color var(--bp-transition-fast),
      background-color var(--bp-transition-fast);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + var(--bp-spacing-xs));
    left: 0;
    right: 0;
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-top: calc(var(--bp-border-width) * 2) solid var(--bp-color-primary);
    border-radius: var(--bp-border-radius-sm);
    box-shadow: var(--bp-shadow-md);
    max-height: 320px;
    overflow-y: auto;
    z-index: var(--bp-z-dropdown);
    animation: slideDown var(--bp-transition-fast) ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .time-option {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    min-height: 44px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
    transition: background-color var(--bp-transition-fast);
  }

  /* Variants */
  .time-option--selected {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
    color: var(--bp-color-primary);
    font-weight: var(--bp-font-weight-semibold);
  }

  /* Sizes */
  .time-picker--sm .input {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    padding-right: var(--bp-spacing-xl);
    font-size: var(--bp-font-size-sm);
  }

  .time-picker--sm .icon {
    font-size: var(--bp-font-size-base);
  }

  .time-picker--sm .clear-button {
    right: var(--bp-spacing-lg);
  }

  .time-picker--lg .input {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    padding-right: var(--bp-spacing-24);
    font-size: var(--bp-font-size-lg);
  }

  .time-picker--lg .icon {
    font-size: var(--bp-font-size-xl);
  }

  .time-picker--lg .clear-button {
    right: var(--bp-spacing-2xl);
  }

  /* States */
  .input:hover:not(:disabled) {
    border-color: var(--bp-color-primary);
  }

  .input[aria-expanded='true'] {
    border-color: var(--bp-color-primary);
  }

  .input:focus {
    outline: none;
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .clear-button:hover {
    color: var(--bp-color-primary);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .time-option:hover {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .time-option--selected:hover {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 12%,
      transparent
    );
  }
`;
