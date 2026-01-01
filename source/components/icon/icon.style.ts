import { css } from 'lit';

export const iconStyles = css`
  /* Base styles */
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: var(--bp-color-text);
  }

  .icon ::slotted(svg) {
    width: 100%;
    height: 100%;
    display: block;
    fill: currentColor;
  }

  /* Color variants */
  .icon--default {
    color: var(--bp-color-text);
  }

  .icon--primary {
    color: var(--bp-color-primary);
  }

  .icon--success {
    color: var(--bp-color-success);
  }

  .icon--warning {
    color: var(--bp-color-warning);
  }

  .icon--error {
    color: var(--bp-color-error);
  }

  .icon--muted {
    color: var(--bp-color-text-muted);
  }

  /* Size variants */
  .icon--xs {
    width: var(--bp-font-size-xs);
    height: var(--bp-font-size-xs);
  }

  .icon--sm {
    width: var(--bp-font-size-sm);
    height: var(--bp-font-size-sm);
  }

  .icon--md {
    width: var(--bp-font-size-lg);
    height: var(--bp-font-size-lg);
  }

  .icon--lg {
    width: var(--bp-font-size-2xl);
    height: var(--bp-font-size-2xl);
  }

  .icon--xl {
    width: var(--bp-font-size-3xl);
    height: var(--bp-font-size-3xl);
  }
`;
