import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .button {
    appearance: none;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: var(--bp-border-width) solid transparent;
    border-radius: var(--bp-border-radius);
    background: transparent;
    color: var(--bp-color-text-muted);
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast),
      border-color var(--bp-transition-fast);
  }

  :host([shape='circle']) .button {
    border-radius: var(--bp-border-radius-full);
  }

  /* Sizes: square, on the 4px grid */
  .button--sm {
    width: var(--bp-spacing-8);
    height: var(--bp-spacing-8);
  }
  .button--md {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
  }
  .button--lg {
    width: var(--bp-spacing-12);
    height: var(--bp-spacing-12);
  }

  .icon-slot {
    display: inline-flex;
  }

  /* bp-icon paints its own text color by default; follow the button's */
  bp-icon::part(icon) {
    color: inherit;
  }
  .button--sm .icon-slot ::slotted(svg) {
    width: var(--bp-icon-size-sm);
    height: var(--bp-icon-size-sm);
  }
  .button--md .icon-slot ::slotted(svg) {
    width: var(--bp-icon-size-md);
    height: var(--bp-icon-size-md);
  }
  .button--lg .icon-slot ::slotted(svg) {
    width: var(--bp-icon-size-lg);
    height: var(--bp-icon-size-lg);
  }

  /* Ghost: no fill until hovered */
  .button--ghost:hover:not(:disabled) {
    color: var(--bp-color-text);
    background-image: linear-gradient(
      var(--bp-color-hover-overlay),
      var(--bp-color-hover-overlay)
    );
  }
  .button--ghost:active:not(:disabled) {
    background-image: linear-gradient(
      var(--bp-color-active-overlay),
      var(--bp-color-active-overlay)
    );
  }

  /* Secondary: outlined surface */
  .button--secondary {
    background-color: var(--bp-color-surface-elevated);
    border-color: var(--bp-color-border-strong);
    color: var(--bp-color-text);
  }
  .button--secondary:hover:not(:disabled) {
    background-image: linear-gradient(
      var(--bp-color-hover-overlay),
      var(--bp-color-hover-overlay)
    );
  }
  .button--secondary:active:not(:disabled) {
    background-image: linear-gradient(
      var(--bp-color-active-overlay),
      var(--bp-color-active-overlay)
    );
  }

  /* Filled */
  .button--primary,
  .button--success,
  .button--error,
  .button--warning,
  .button--info {
    color: var(--bp-color-text-inverse);
  }
  .button--primary {
    background-color: var(--bp-color-primary);
  }
  .button--primary:hover:not(:disabled) {
    background-color: var(--bp-color-primary-hover);
  }
  .button--primary:active:not(:disabled) {
    background-color: var(--bp-color-primary-active);
  }
  .button--success {
    background-color: var(--bp-color-success);
  }
  .button--success:hover:not(:disabled) {
    background-color: var(--bp-color-success-hover);
  }
  .button--error {
    background-color: var(--bp-color-error);
  }
  .button--error:hover:not(:disabled) {
    background-color: var(--bp-color-error-hover);
  }
  .button--warning {
    background-color: var(--bp-color-warning);
  }
  .button--warning:hover:not(:disabled) {
    background-color: var(--bp-color-warning-hover);
  }
  .button--info {
    background-color: var(--bp-color-info);
  }
  .button--info:hover:not(:disabled) {
    background-color: var(--bp-color-info-hover);
  }

  .button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
  }
`;
