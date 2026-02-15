import { css } from 'lit';

export const selectStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .select {
    position: relative;
    font-family: var(--bp-font-family);
  }

  .select-label {
    display: block;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
    margin-bottom: var(--bp-spacing-xs);
  }

  .select-required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
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
    box-shadow: inset 0 1px 2px oklch(0 0 0 / 0.05);
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
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
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
    overflow-y: auto;
    background-color: var(--bp-color-background);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    box-shadow: var(--bp-shadow-lg);
    z-index: var(--bp-z-dropdown);
    animation: slideDown 150ms ease-out;
    transform-origin: top;
    contain: layout style paint;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--bp-spacing-2)));
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
    background-color: var(--bp-color-surface-elevated);
  }

  .select-option--focused {
    background-color: var(--bp-color-surface-subdued);
    outline: var(--bp-focus-width) solid var(--bp-color-primary);
    outline-offset: calc(-1 * var(--bp-focus-width));
  }

  .select-option--selected {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
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
    font-size: var(--bp-font-size-lg);
  }

  /* Sizes */
  .select--sm .select-trigger {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
  }

  .select--sm .select-option {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
  }

  .select--md .select-trigger {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
  }

  .select--md .select-option {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
  }

  .select--lg .select-trigger {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
  }

  .select--lg .select-option {
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
    outline: var(--bp-focus-width) solid var(--bp-color-primary);
    outline-offset: var(--bp-focus-offset);
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
    background-color: var(--bp-color-surface-subdued);
  }

  /* iOS zoom prevention: ensure 16px minimum on touch devices */
  @media (max-width: 768px) {
    .select--sm .select-trigger {
      font-size: 16px;
    }

    .select--sm .select-option {
      font-size: 16px;
    }
  }
`;
