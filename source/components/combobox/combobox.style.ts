import { css } from 'lit';

export const comboboxStyles = css`
  /* Base styles */
  :host {
    display: block;
    font-family: var(--bp-font-family);
  }

  .combobox {
    position: relative;
    width: 100%;
  }

  .combobox__control {
    display: flex;
    align-items: center;
    position: relative;
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    transition: border-color var(--bp-transition-fast);
  }

  .combobox__control:hover:not(.combobox--disabled .combobox__control) {
    border-color: var(--bp-color-primary);
  }

  .combobox__control:focus-within {
    outline: var(--bp-spacing-0-5) solid var(--bp-color-focus);
    outline-offset: var(--bp-spacing-0-5);
    border-color: var(--bp-color-focus);
  }

  .combobox__input {
    flex: 1;
    min-width: 0;
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    background: transparent;
    border: none;
    outline: none;
    color: var(--bp-color-text);
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
  }

  .combobox__input::placeholder {
    color: var(--bp-color-text-muted);
  }

  .combobox__input:disabled {
    cursor: not-allowed;
  }

  .combobox__indicators {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    padding-right: var(--bp-spacing-sm);
    flex-shrink: 0;
  }

  .combobox__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    font-size: var(--bp-font-size-xl);
    line-height: 1;
    transition: all var(--bp-transition-fast);
  }

  .combobox__clear:hover {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .combobox__clear:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .combobox__dropdown-indicator {
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-xs);
    transition: transform var(--bp-transition-fast);
    user-select: none;
  }

  .combobox--open .combobox__dropdown-indicator {
    transform: rotate(180deg);
  }

  .combobox__dropdown {
    position: absolute;
    top: calc(100% + var(--bp-spacing-xs));
    left: 0;
    right: 0;
    z-index: var(--bp-z-dropdown);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    box-shadow: var(--bp-shadow-md);
    max-height: calc(var(--bp-spacing-10) * 6);
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: translateY(calc(-1 * var(--bp-spacing-md)));
    transition:
      opacity var(--bp-transition-fast),
      transform var(--bp-transition-fast),
      visibility var(--bp-transition-fast);
  }

  .combobox--open .combobox__dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .combobox__options {
    list-style: none;
    margin: 0;
    padding: var(--bp-spacing-2xs);
  }

  .combobox__option {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    cursor: pointer;
    border-radius: var(--bp-border-radius-md);
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .combobox__option:hover {
    background-color: var(--bp-color-surface-elevated);
  }

  .combobox__option--focused {
    background-color: var(--bp-color-surface-subdued);
    outline: var(--bp-focus-width) solid var(--bp-color-primary);
    outline-offset: calc(-1 * var(--bp-focus-width));
  }

  .combobox__option--selected {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
    color: var(--bp-color-primary);
  }

  .combobox__option--selected:hover,
  .combobox__option--selected.combobox__option--focused {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 12%,
      transparent
    );
  }

  .combobox__option--empty {
    color: var(--bp-color-text-muted);
    cursor: default;
    text-align: center;
    padding: var(--bp-spacing-lg) var(--bp-spacing-md);
    font-style: italic;
  }

  .combobox__option--empty:hover {
    background-color: transparent;
  }

  /* Sizes */
  .combobox--small .combobox__input {
    padding: var(--bp-spacing-2xs) var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
  }

  .combobox--small .combobox__indicators {
    padding-right: var(--bp-spacing-xs);
  }

  .combobox--large .combobox__input {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
  }

  .combobox--large .combobox__indicators {
    padding-right: var(--bp-spacing-md);
  }

  /* Variants */
  .combobox--default .combobox__control {
    border-color: var(--bp-color-border);
  }

  .combobox--success .combobox__control {
    border-color: var(--bp-color-success);
  }

  .combobox--error .combobox__control {
    border-color: var(--bp-color-error);
  }

  .combobox--warning .combobox__control {
    border-color: var(--bp-color-warning);
  }

  .combobox--info .combobox__control {
    border-color: var(--bp-color-info);
  }

  .combobox--success
    .combobox__control:hover:not(.combobox--disabled .combobox__control) {
    border-color: var(--bp-color-success);
  }

  .combobox--error
    .combobox__control:hover:not(.combobox--disabled .combobox__control) {
    border-color: var(--bp-color-error);
  }

  .combobox--warning
    .combobox__control:hover:not(.combobox--disabled .combobox__control) {
    border-color: var(--bp-color-warning);
  }

  .combobox--info
    .combobox__control:hover:not(.combobox--disabled .combobox__control) {
    border-color: var(--bp-color-info);
  }

  /* States */
  .combobox--disabled .combobox__control {
    background-color: var(--bp-color-surface-subdued);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .combobox--disabled .combobox__input {
    color: var(--bp-color-text-muted);
  }

  /* Hide slot */
  slot {
    display: none;
  }

  /* Hide hidden inputs */
  input[type='hidden'] {
    display: none;
  }
`;
