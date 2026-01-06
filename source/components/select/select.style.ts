import { css } from 'lit';

export const selectStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    width: 100%;
  }

  .select {
    position: relative;
    font-family: var(--bp-font-family-sans);
  }

  .select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    background-color: var(--bp-color-background);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
    cursor: pointer;
    transition:
      border-color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
  }

  .select-value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Placeholder state - when no value is selected */
  .select-trigger:not([aria-label]) .select-value:empty {
    opacity: 0.6;
  }

  .select-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-left: var(--bp-spacing-xs);
    transition:
      transform var(--bp-transition-base),
      color var(--bp-transition-fast);
  }

  .select-dropdown {
    position: absolute;
    top: calc(100% + var(--bp-spacing-2xs));
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    background-color: var(--bp-color-background);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    box-shadow: var(--bp-shadow-lg);
    z-index: var(--bp-z-dropdown);
    animation: slideDown 150ms ease-out;
    transform-origin: top;
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

  .select-option {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    cursor: pointer;
    transition: background-color var(--bp-transition-fast);
  }

  .select-option:hover:not(.select-option--focused) {
    background-color: var(--bp-gray-100);
  }

  .select-option--focused {
    background-color: var(--bp-color-primary-100);
    outline: 2px solid var(--bp-color-primary);
    outline-offset: -2px;
  }

  .select-option--selected {
    background-color: var(--bp-color-primary-50);
    color: var(--bp-color-primary);
    font-weight: var(--bp-font-weight-semibold);
    position: relative;
    padding-right: var(--bp-spacing-2xl);
  }

  /* Checkmark for selected option */
  .select-option--selected::after {
    content: '✓';
    position: absolute;
    right: var(--bp-spacing-md);
    color: var(--bp-color-primary);
    font-weight: var(--bp-font-weight-bold);
    font-size: 1.125em;
  }

  /* Sizes */
  .select--small .select-trigger {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
  }

  .select--small .select-option {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
  }

  .select--medium .select-trigger {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
  }

  .select--medium .select-option {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
  }

  .select--large .select-trigger {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
  }

  .select--large .select-option {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
  }

  /* States */
  .select-trigger:hover:not(.select--disabled .select-trigger) {
    border-color: var(--bp-color-primary);
  }

  .select-trigger:focus {
    outline: none;
  }

  .select-trigger:focus-visible {
    outline: 2px solid var(--bp-color-primary);
    outline-offset: 2px;
    border-color: var(--bp-color-primary);
  }

  .select--open .select-trigger {
    border-color: var(--bp-color-primary);
  }

  .select--open .select-icon {
    transform: rotate(180deg);
    color: var(--bp-color-primary);
  }

  .select--disabled .select-trigger {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--bp-gray-50);
  }
`;
