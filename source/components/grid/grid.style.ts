import { css } from 'lit';

export const gridStyles = css`
  :host {
    display: grid;
    /* Set from the columns / minColumnWidth properties */
    grid-template-columns: var(--_bp-grid-template, repeat(1, minmax(0, 1fr)));
    gap: var(--bp-spacing-md);
    align-items: stretch;
    min-width: 0;
  }

  :host([hidden]) {
    display: none;
  }

  /* Gap: semantic spacing scale */
  :host([gap='none']) {
    gap: 0;
  }
  :host([gap='2xs']) {
    gap: var(--bp-spacing-2xs);
  }
  :host([gap='xs']) {
    gap: var(--bp-spacing-xs);
  }
  :host([gap='sm']) {
    gap: var(--bp-spacing-sm);
  }
  :host([gap='md']) {
    gap: var(--bp-spacing-md);
  }
  :host([gap='lg']) {
    gap: var(--bp-spacing-lg);
  }
  :host([gap='xl']) {
    gap: var(--bp-spacing-xl);
  }
  :host([gap='2xl']) {
    gap: var(--bp-spacing-2xl);
  }

  :host([align='start']) {
    align-items: start;
  }
  :host([align='center']) {
    align-items: center;
  }
  :host([align='end']) {
    align-items: end;
  }
`;
