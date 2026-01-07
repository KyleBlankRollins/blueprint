import { css } from 'lit';

export const dividerStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  :host([orientation='vertical']) {
    display: inline-flex;
    height: 100%;
  }

  .divider {
    display: flex;
    align-items: center;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-text-muted);
  }

  .divider__line {
    flex: 1;
    border: none;
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    transition:
      border-color 150ms ease,
      border-width 150ms ease;
  }

  .divider__content {
    display: inline-flex;
    padding: 0 var(--bp-spacing-md);
    white-space: nowrap;
    min-width: fit-content;
  }

  .divider__content:not(:empty) {
    font-weight: var(--bp-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--bp-color-text-muted);
  }

  .divider__content:empty {
    display: none;
  }

  /* Orientations */
  .divider--horizontal {
    width: 100%;
    flex-direction: row;
  }

  .divider--vertical {
    height: 100%;
    flex-direction: column;
    align-self: stretch;
  }

  .divider--vertical .divider__line {
    width: var(--bp-border-width);
    height: auto;
    border-top: none;
    border-left: var(--bp-border-width) solid var(--bp-color-border);
  }

  /* Spacing */
  .divider--spacing-sm {
    margin: var(--bp-spacing-sm) 0;
  }

  .divider--spacing-sm.divider--vertical {
    margin: 0 var(--bp-spacing-sm);
  }

  .divider--spacing-md {
    margin: var(--bp-spacing-md) 0;
  }

  .divider--spacing-md.divider--vertical {
    margin: 0 var(--bp-spacing-md);
  }

  .divider--spacing-lg {
    margin: var(--bp-spacing-lg) 0;
  }

  .divider--spacing-lg.divider--vertical {
    margin: 0 var(--bp-spacing-lg);
  }

  /* Variants */
  .divider__line--dashed {
    border-style: dashed;
  }

  .divider__line--dotted {
    border-style: dotted;
  }

  .divider--vertical .divider__line--dashed {
    border-top-width: 0;
  }

  .divider--vertical .divider__line--dotted {
    border-top-width: 0;
  }

  /* Color variants */
  :host([color='default']) .divider__line {
    border-color: var(--bp-color-border);
  }

  :host([color='subtle']) .divider__line {
    border-color: var(--bp-color-border);
    opacity: 0.5;
  }

  :host([color='accent']) .divider__line {
    border-color: var(--bp-color-primary);
  }

  /* Weight variants */
  :host([weight='thin']) .divider__line {
    border-top-width: var(--bp-border-width);
  }

  :host([weight='medium']) .divider__line {
    border-top-width: calc(var(--bp-border-width) * 2);
  }

  :host([weight='thick']) .divider__line {
    border-top-width: calc(var(--bp-border-width) * 3);
  }

  :host([weight='thin'][orientation='vertical']) .divider__line {
    border-left-width: var(--bp-border-width);
    border-top-width: 0;
  }

  :host([weight='medium'][orientation='vertical']) .divider__line {
    border-left-width: calc(var(--bp-border-width) * 2);
    border-top-width: 0;
  }

  :host([weight='thick'][orientation='vertical']) .divider__line {
    border-left-width: calc(var(--bp-border-width) * 3);
    border-top-width: 0;
  }
`;
