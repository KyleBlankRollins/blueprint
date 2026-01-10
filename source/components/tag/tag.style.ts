import { css } from 'lit';

export const tagStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    font-family: var(--bp-font-family);
    font-weight: var(--bp-font-weight-medium);
    line-height: 1.5;
    border-radius: var(--bp-border-radius-md);
    border: var(--bp-border-width) solid transparent;
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast),
      color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
    cursor: default;
  }

  .tag:focus-visible {
    outline: var(--bp-border-width) solid var(--bp-color-focus);
    outline-offset: var(--bp-border-width);
  }

  .tag__content {
    flex: 1;
  }

  .tag__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    transition: opacity var(--bp-transition-fast);
    flex-shrink: 0;
  }

  .tag__close:hover {
    opacity: 1;
  }

  .tag__close:focus-visible {
    outline: var(--bp-border-width) solid currentColor;
    outline-offset: var(--bp-border-width);
    border-radius: var(--bp-border-radius-sm);
    opacity: 1;
  }

  /* Variants - Solid */
  .tag--solid.tag--primary {
    background-color: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .tag--solid.tag--success {
    background-color: var(--bp-color-success);
    color: var(--bp-color-text-inverse);
  }

  .tag--solid.tag--error {
    background-color: var(--bp-color-error);
    color: var(--bp-color-text-inverse);
  }

  .tag--solid.tag--warning {
    background-color: var(--bp-color-warning);
    color: var(--bp-color-text-inverse);
  }

  .tag--solid.tag--info {
    background-color: var(--bp-color-info);
    color: var(--bp-color-text-inverse);
  }

  .tag--solid.tag--neutral {
    background-color: var(--bp-color-border-strong);
    color: var(--bp-color-text);
  }

  /* Variants - Outlined */
  .tag--outlined {
    background-color: transparent;
  }

  .tag--outlined.tag--primary {
    border-color: var(--bp-color-primary);
    color: var(--bp-color-primary);
  }

  .tag--outlined.tag--success {
    border-color: var(--bp-color-success);
    color: var(--bp-color-success);
  }

  .tag--outlined.tag--error {
    border-color: var(--bp-color-error);
    color: var(--bp-color-error);
  }

  .tag--outlined.tag--warning {
    border-color: var(--bp-color-warning);
    color: var(--bp-color-warning);
  }

  .tag--outlined.tag--info {
    border-color: var(--bp-color-info);
    color: var(--bp-color-info);
  }

  .tag--outlined.tag--neutral {
    border-color: var(--bp-color-border);
    color: var(--bp-color-text);
  }

  /* Sizes */
  .tag--small {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-xs);
    height: var(--bp-spacing-6);
  }

  .tag--small .tag__close {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  .tag--medium {
    padding: var(--bp-spacing-xs) var(--bp-spacing-md);
    font-size: var(--bp-font-size-sm);
    height: var(--bp-spacing-8);
  }

  .tag--medium .tag__close {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }

  .tag--large {
    padding: var(--bp-spacing-sm) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-base);
    height: var(--bp-spacing-10);
  }

  .tag--large .tag__close {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  /* States */
  .tag--removable {
    cursor: pointer;
  }

  .tag--removable:hover {
    filter: brightness(0.95);
  }

  .tag--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .tag--disabled .tag__close {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
