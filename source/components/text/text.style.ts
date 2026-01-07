import { css } from 'lit';

export const textStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  :host([as='span']) {
    display: inline;
  }

  .text {
    margin: 0;
    padding: 0;
    font-family: var(--bp-font-family);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  /* Sizes */
  .text--xs {
    font-size: var(--bp-font-size-xs);
  }

  .text--sm {
    font-size: var(--bp-font-size-sm);
  }

  .text--base {
    font-size: var(--bp-font-size-base);
  }

  .text--lg {
    font-size: var(--bp-font-size-lg);
  }

  .text--xl {
    font-size: var(--bp-font-size-xl);
  }

  /* Font weights */
  .text--light {
    font-weight: var(--bp-font-weight-light);
  }

  .text--normal {
    font-weight: var(--bp-font-weight-normal);
  }

  .text--medium {
    font-weight: var(--bp-font-weight-medium);
  }

  .text--semibold {
    font-weight: var(--bp-font-weight-semibold);
  }

  .text--bold {
    font-weight: var(--bp-font-weight-bold);
  }

  /* Variants */
  .text--default {
    color: var(--bp-color-text);
  }

  .text--muted {
    color: var(--bp-color-text-muted);
  }

  .text--primary {
    color: var(--bp-color-primary);
  }

  .text--success {
    color: var(--bp-color-success);
  }

  .text--warning {
    color: var(--bp-color-warning);
  }

  .text--error {
    color: var(--bp-color-error);
  }

  /* Alignment */
  .text--align-left {
    text-align: left;
  }

  .text--align-center {
    text-align: center;
  }

  .text--align-right {
    text-align: right;
  }

  .text--align-justify {
    text-align: justify;
  }

  /* Text transform */
  .text--transform-uppercase {
    text-transform: uppercase;
  }

  .text--transform-lowercase {
    text-transform: lowercase;
  }

  .text--transform-capitalize {
    text-transform: capitalize;
  }

  /* Letter spacing (tracking) */
  .text--tracking-tighter {
    letter-spacing: -0.05em;
  }

  .text--tracking-tight {
    letter-spacing: -0.025em;
  }

  .text--tracking-wide {
    letter-spacing: 0.025em;
  }

  .text--tracking-wider {
    letter-spacing: 0.05em;
  }

  /* Line height variants */
  .text--line-height-none {
    line-height: var(--bp-line-height-none);
  }

  .text--line-height-tight {
    line-height: var(--bp-line-height-tight);
  }

  .text--line-height-snug {
    line-height: var(--bp-line-height-snug);
  }

  .text--line-height-relaxed {
    line-height: var(--bp-line-height-relaxed);
  }

  .text--line-height-loose {
    line-height: var(--bp-line-height-loose);
  }

  /* Multi-line clamp */
  .text--clamp-1,
  .text--clamp-2,
  .text--clamp-3,
  .text--clamp-4,
  .text--clamp-5,
  .text--clamp-6 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text--clamp-1 {
    -webkit-line-clamp: 1;
  }

  .text--clamp-2 {
    -webkit-line-clamp: 2;
  }

  .text--clamp-3 {
    -webkit-line-clamp: 3;
  }

  .text--clamp-4 {
    -webkit-line-clamp: 4;
  }

  .text--clamp-5 {
    -webkit-line-clamp: 5;
  }

  .text--clamp-6 {
    -webkit-line-clamp: 6;
  }

  /* States */
  .text--italic {
    font-style: italic;
  }

  .text--truncate {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
`;
