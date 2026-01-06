import { css } from 'lit';

export const headingStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .heading {
    margin: 0;
    padding: 0;
    color: var(--bp-color-text);
    font-family: var(--bp-font-sans);
  }

  /* Sizes */
  .heading--xs {
    font-size: var(--bp-font-size-xs);
    line-height: 1.5;
  }

  .heading--sm {
    font-size: var(--bp-font-size-sm);
    line-height: 1.45;
  }

  .heading--md {
    font-size: var(--bp-font-size-base);
    line-height: 1.4;
  }

  .heading--lg {
    font-size: var(--bp-font-size-lg);
    line-height: 1.35;
  }

  .heading--xl {
    font-size: var(--bp-font-size-xl);
    line-height: 1.3;
  }

  .heading--2xl {
    font-size: var(--bp-font-size-2xl);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .heading--3xl {
    font-size: var(--bp-font-size-3xl);
    line-height: 1.2;
    letter-spacing: -0.015em;
  }

  .heading--4xl {
    font-size: var(--bp-font-size-4xl);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* Font weights */
  .heading--light {
    font-weight: var(--bp-font-weight-light);
  }

  .heading--normal {
    font-weight: var(--bp-font-weight-normal);
  }

  .heading--medium {
    font-weight: var(--bp-font-weight-medium);
  }

  .heading--semibold {
    font-weight: var(--bp-font-weight-semibold);
  }

  .heading--bold {
    font-weight: var(--bp-font-weight-bold);
  }
`;
