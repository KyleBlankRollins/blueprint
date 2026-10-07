import { css } from 'lit';

export const notificationStackStyles = css`
  :host {
    position: fixed;
    z-index: var(--bp-z-popover);
    width: min(400px, calc(100vw - 2 * var(--bp-spacing-md)));
    margin: var(--bp-spacing-md);
    /* The empty region must not block clicks on the page beneath it */
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-sm);
  }

  ::slotted(*) {
    pointer-events: auto;
  }

  :host([position='top-left']) {
    top: 0;
    left: 0;
  }
  :host([position='top-center']) {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    margin-inline: 0;
  }
  :host([position='top-right']) {
    top: 0;
    right: 0;
  }
  :host([position='bottom-left']) {
    bottom: 0;
    left: 0;
  }
  :host([position='bottom-center']) {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin-inline: 0;
  }
  :host([position='bottom-right']) {
    bottom: 0;
    right: 0;
  }
`;
