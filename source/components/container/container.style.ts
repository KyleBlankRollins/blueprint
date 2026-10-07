import { css } from 'lit';

export const containerStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: var(--bp-breakpoint-lg);
    margin-inline: auto;
    padding-inline: var(--bp-spacing-md);
  }

  :host([hidden]) {
    display: none;
  }

  /* Max width: the breakpoint scale */
  :host([size='sm']) {
    max-width: var(--bp-breakpoint-sm);
  }
  :host([size='md']) {
    max-width: var(--bp-breakpoint-md);
  }
  :host([size='lg']) {
    max-width: var(--bp-breakpoint-lg);
  }
  :host([size='xl']) {
    max-width: var(--bp-breakpoint-xl);
  }
  :host([size='2xl']) {
    max-width: var(--bp-breakpoint-2xl);
  }
  :host([size='full']) {
    max-width: none;
  }

  /* Inline padding (gutter): semantic spacing scale */
  :host([gutter='none']) {
    padding-inline: 0;
  }
  :host([gutter='2xs']) {
    padding-inline: var(--bp-spacing-2xs);
  }
  :host([gutter='xs']) {
    padding-inline: var(--bp-spacing-xs);
  }
  :host([gutter='sm']) {
    padding-inline: var(--bp-spacing-sm);
  }
  :host([gutter='md']) {
    padding-inline: var(--bp-spacing-md);
  }
  :host([gutter='lg']) {
    padding-inline: var(--bp-spacing-lg);
  }
  :host([gutter='xl']) {
    padding-inline: var(--bp-spacing-xl);
  }
  :host([gutter='2xl']) {
    padding-inline: var(--bp-spacing-2xl);
  }
`;
