import { css } from 'lit';

export const multiSelectStyles = css`
  /* Base styles */
  :host {
    display: block;
    font-family: var(--bp-font-family);
  }

  .multi-select {
    position: relative;
    width: 100%;
  }

  .multi-select__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--bp-spacing-sm);
    min-height: var(--bp-spacing-10);
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    cursor: pointer;
    transition: border-color var(--bp-transition-fast);
  }

  .multi-select__control:hover:not(
      .multi-select--disabled .multi-select__control
    ) {
    border-color: var(--bp-color-primary);
  }

  .multi-select__control:focus-visible {
    outline: var(--bp-focus-width) solid var(--bp-color-focus);
    outline-offset: var(--bp-focus-width);
  }

  .multi-select__value-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--bp-spacing-xs);
    flex: 1;
    min-width: 0;
  }

  .multi-select__placeholder {
    color: var(--bp-color-text-muted);
    user-select: none;
  }

  .multi-select__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    padding: var(--bp-spacing-2xs) var(--bp-spacing-xs);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
    color: var(--bp-color-primary);
    border: none;
    border-radius: var(--bp-border-radius-md);
    font-size: var(--bp-font-size-sm);
    max-width: 100%;
  }

  .multi-select__tag-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .multi-select__tag-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-primary);
    cursor: pointer;
    font-size: var(--bp-font-size-lg);
    line-height: 1;
    transition: all var(--bp-transition-fast);
  }

  .multi-select__tag-remove:hover {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 15%,
      transparent
    );
    color: var(--bp-color-primary);
  }

  .multi-select__tag-remove:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .multi-select__indicators {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    flex-shrink: 0;
  }

  .multi-select__clear {
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

  .multi-select__clear:hover {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .multi-select__clear:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .multi-select__dropdown-indicator {
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-xs);
    transition: transform var(--bp-transition-fast);
    user-select: none;
  }

  .multi-select--open .multi-select__dropdown-indicator {
    transform: rotate(180deg);
  }

  .multi-select__dropdown {
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
    contain: layout style paint;
  }

  .multi-select--open .multi-select__dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .multi-select__options {
    list-style: none;
    margin: 0;
    padding: var(--bp-spacing-2xs);
  }

  .multi-select__option {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    cursor: pointer;
    border-radius: var(--bp-border-radius-md);
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .multi-select__option:hover {
    background-color: var(--bp-color-surface-elevated);
  }

  .multi-select__option--focused {
    background-color: var(--bp-color-surface-subdued);
    outline: var(--bp-focus-width) solid var(--bp-color-primary);
    outline-offset: calc(-1 * var(--bp-focus-width));
  }

  .multi-select__option--selected {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
    color: var(--bp-color-primary);
  }

  .multi-select__option--selected:hover {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 12%,
      transparent
    );
  }

  .multi-select__option--empty {
    color: var(--bp-color-text-muted);
    cursor: default;
    text-align: center;
    padding: var(--bp-spacing-xl) var(--bp-spacing-lg);
    font-style: italic;
  }

  .multi-select__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-sm);
    font-size: var(--bp-font-size-xs);
    flex-shrink: 0;
    transition: all var(--bp-transition-fast);
  }

  .multi-select__option--selected .multi-select__checkbox {
    border-color: var(--bp-color-primary);
    background-color: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .multi-select__option-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Sizes */
  .multi-select--sm .multi-select__control {
    min-height: var(--bp-spacing-8);
    padding: var(--bp-spacing-2xs) var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
  }

  .multi-select--sm .multi-select__tag {
    padding: var(--bp-spacing-0-5) var(--bp-spacing-2xs);
    font-size: var(--bp-font-size-xs);
  }

  .multi-select--lg .multi-select__control {
    min-height: var(--bp-spacing-12);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-lg);
  }

  .multi-select--lg .multi-select__tag {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-base);
  }

  /* Variants */
  .multi-select--default .multi-select__control {
    border-color: var(--bp-color-border);
  }

  .multi-select--success .multi-select__control {
    border-color: var(--bp-color-success);
  }

  .multi-select--error .multi-select__control {
    border-color: var(--bp-color-error);
  }

  .multi-select--warning .multi-select__control {
    border-color: var(--bp-color-warning);
  }

  .multi-select--info .multi-select__control {
    border-color: var(--bp-color-info);
  }

  .multi-select--success
    .multi-select__control:hover:not(
      .multi-select--disabled .multi-select__control
    ) {
    border-color: var(--bp-color-success);
  }

  .multi-select--error
    .multi-select__control:hover:not(
      .multi-select--disabled .multi-select__control
    ) {
    border-color: var(--bp-color-error);
  }

  .multi-select--warning
    .multi-select__control:hover:not(
      .multi-select--disabled .multi-select__control
    ) {
    border-color: var(--bp-color-warning);
  }

  .multi-select--info
    .multi-select__control:hover:not(
      .multi-select--disabled .multi-select__control
    ) {
    border-color: var(--bp-color-info);
  }

  /* States */
  .multi-select--disabled .multi-select__control {
    background-color: var(--bp-color-surface-subdued);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .multi-select--disabled .multi-select__placeholder {
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
