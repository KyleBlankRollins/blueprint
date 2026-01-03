import { css } from 'lit';

export const linkStyles = css`
  /* Base styles */
  :host {
    display: inline;
  }

  .link {
    display: inline;
    font-family: var(--bp-font-family-sans);
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
    transform: translateY(1px);
  }

  .link:visited {
    color: var(--bp-color-primary);
  }

  .link:visited:hover {
    color: var(--bp-color-primary-hover);
  }

  .link:focus-visible {
    outline: 2px solid var(--bp-color-focus);
    outline-offset: 2px;
    border-radius: var(--bp-border-radius-sm);
  }

  .link[aria-disabled='true'] {
    color: var(--bp-color-text-disabled);
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
    color: var(--bp-color-text-secondary);
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
    text-decoration-thickness: 1px;
    text-underline-offset: 0.15em;
  }

  .link--underline-hover {
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.15em;
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
    font-size: 0.875em;
  }

  .link--size-md {
    font-size: inherit;
  }

  .link--size-lg {
    font-size: 1.125em;
  }

  /* External link indicator */
  .link[target='_blank']::after {
    content: '↗';
    margin-left: 0.3em;
    font-size: 0.7em;
    vertical-align: super;
    line-height: 0;
    opacity: 0.75;
    transition: opacity var(--bp-transition-fast);
  }

  .link[target='_blank']:hover::after {
    opacity: 1;
  }
`;
