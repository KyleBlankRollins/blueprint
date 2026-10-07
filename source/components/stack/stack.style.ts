import { css } from 'lit';

export const stackStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: var(--bp-spacing-md);
    min-width: 0;
  }

  :host([hidden]) {
    display: none;
  }

  :host([direction='horizontal']) {
    flex-direction: row;
  }

  :host([wrap]) {
    flex-wrap: wrap;
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

  /* Cross-axis alignment */
  :host([align='start']) {
    align-items: flex-start;
  }
  :host([align='center']) {
    align-items: center;
  }
  :host([align='end']) {
    align-items: flex-end;
  }
  :host([align='baseline']) {
    align-items: baseline;
  }

  /* Main-axis distribution */
  :host([justify='center']) {
    justify-content: center;
  }
  :host([justify='end']) {
    justify-content: flex-end;
  }
  :host([justify='between']) {
    justify-content: space-between;
  }
  :host([justify='around']) {
    justify-content: space-around;
  }
  :host([justify='evenly']) {
    justify-content: space-evenly;
  }
`;
