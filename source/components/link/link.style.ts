import { css } from 'lit';

export const linkStyles = css`
  /* Base styles */
  :host {
    display: inline;
  }

  .link {
    display: inline;
    font-family: var(--bp-font-sans);
    font-size: inherit;
    font-weight: inherit;
    color: var(--bp-color-primary);
    text-decoration: none;
    cursor: pointer;
    transition: color var(--bp-transition-fast);
  }

  .link:hover {
    color: var(--bp-color-primary-hover);
  }

  .link:active {
    color: var(--bp-color-primary-active);
    transform: translateY(var(--bp-spacing-0-5));
  }

  .link:visited {
    color: var(--bp-color-primary);
  }

  .link:visited:hover {
    color: var(--bp-color-primary-hover);
  }

  .link:focus-visible {
    outline: var(--bp-focus-width) solid var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
    border-radius: var(--bp-border-radius-sm);
  }

  .link[aria-disabled='true'] {
    color: var(--bp-color-text-muted);
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variants */
  .link--primary {
    font-weight: var(--bp-font-weight-semibold);
  }

  .link--muted {
    color: var(--bp-color-text-muted);
  }

  .link--muted:hover {
    color: var(--bp-color-text);
  }

  .link--muted:active {
    color: var(--bp-color-text);
  }

  .link--muted:visited {
    color: var(--bp-color-text-muted);
  }

  /* Underline variants */
  .link--underline-always {
    text-decoration: underline;
  }

  .link--underline-hover {
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color var(--bp-transition-fast);
  }

  .link--underline-hover:hover {
    text-decoration-color: currentColor;
  }

  .link--underline-none {
    text-decoration: none;
  }

  .link--underline-none:hover {
    text-decoration: none;
  }

  /* Size variants */
  .link--size-sm {
    font-size: var(--bp-font-size-sm);
  }

  .link--size-md {
    font-size: inherit;
  }

  .link--size-lg {
    font-size: var(--bp-font-size-lg);
  }

  /* External link indicator */
  .link[target='_blank']::after {
    content: '↗';
    margin-left: var(--bp-spacing-1);
    vertical-align: super;
    line-height: 0;
    opacity: 0.75;
    transition: opacity var(--bp-transition-fast);
  }

  .link[target='_blank']:hover::after {
    opacity: 1;
  }
`;
