import { css } from 'lit';

export const iconStyles = css`
  /* Base styles */
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  :host([size='full']) {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: var(--bp-color-text);
  }

  .icon svg,
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
    width: var(--bp-icon-size-xs);
    height: var(--bp-icon-size-xs);
  }

  .icon--sm {
    width: var(--bp-icon-size-sm);
    height: var(--bp-icon-size-sm);
  }

  .icon--md {
    width: var(--bp-icon-size-md);
    height: var(--bp-icon-size-md);
  }

  .icon--lg {
    width: var(--bp-icon-size-lg);
    height: var(--bp-icon-size-lg);
  }

  .icon--xl {
    width: var(--bp-icon-size-xl);
    height: var(--bp-icon-size-xl);
  }

  .icon--2xl {
    width: var(--bp-icon-size-2xl);
    height: var(--bp-icon-size-2xl);
  }

  .icon--3xl {
    width: var(--bp-icon-size-3xl);
    height: var(--bp-icon-size-3xl);
  }

  .icon--4xl {
    width: var(--bp-icon-size-4xl);
    height: var(--bp-icon-size-4xl);
  }

  .icon--full {
    width: 100%;
    height: 100%;
  }
`;
