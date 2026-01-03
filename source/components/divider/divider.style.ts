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
    font-family: var(--bp-font-family-sans);
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-text-muted);
  }

  .divider__line {
    flex: 1;
    border: none;
    border-top: 1px solid var(--bp-color-border);
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
    color: var(--bp-color-text-secondary);
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
    min-height: 2em;
    height: 100%;
    flex-direction: column;
    align-self: stretch;
  }

  .divider--vertical .divider__line {
    width: 1px;
    height: auto;
    border-top: none;
    border-left: 1px solid var(--bp-color-border);
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
    border-top-width: 1.5px;
  }

  .divider__line--dotted {
    border-style: dotted;
    border-top-width: 2px;
  }

  .divider--vertical .divider__line--dashed {
    border-left-width: 1.5px;
    border-top-width: 0;
  }

  .divider--vertical .divider__line--dotted {
    border-left-width: 2px;
    border-top-width: 0;
  }

  /* Color variants */
  :host([color='default']) .divider__line {
    border-color: var(--bp-color-border);
  }

  :host([color='subtle']) .divider__line {
    border-color: var(--bp-color-neutral-200);
  }

  :host([color='accent']) .divider__line {
    border-color: var(--bp-color-primary);
  }

  /* Weight variants */
  :host([weight='thin']) .divider__line {
    border-top-width: 1px;
  }

  :host([weight='medium']) .divider__line {
    border-top-width: 2px;
  }

  :host([weight='thick']) .divider__line {
    border-top-width: 3px;
  }

  :host([weight='thin'][orientation='vertical']) .divider__line {
    border-left-width: 1px;
    border-top-width: 0;
  }

  :host([weight='medium'][orientation='vertical']) .divider__line {
    border-left-width: 2px;
    border-top-width: 0;
  }

  :host([weight='thick'][orientation='vertical']) .divider__line {
    border-left-width: 3px;
    border-top-width: 0;
  }
`;
