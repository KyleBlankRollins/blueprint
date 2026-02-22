import { css } from 'lit';

export const codeBlockStyles = css`
  /* Base styles */
  :host {
    display: block;
    container-type: inline-size;
  }

  .code-block {
    position: relative;
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    overflow: hidden;
    background-color: var(--bp-color-surface);
    font-family: var(--bp-font-family-mono);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-relaxed);
  }

  /* Header */
  .code-block__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--bp-spacing-sm);
    padding: var(--bp-spacing-xs) var(--bp-spacing-md);
    background-color: var(--bp-color-surface-elevated);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    min-height: var(--bp-spacing-10);
  }

  .code-block__title {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-xs);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em; /* Intentional one-off for header label readability */
  }

  .code-block__controls {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    flex-shrink: 0;
  }

  /* Copy button */
  .code-block__copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: var(--bp-spacing-2xs);
    border-radius: var(--bp-border-radius-md);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      color var(--bp-transition-fast),
      background-color var(--bp-transition-fast);
  }

  .code-block__copy:hover {
    color: var(--bp-color-text);
    background-color: var(--bp-color-hover-overlay);
  }

  .code-block__copy:active {
    background-color: var(--bp-color-active-overlay);
  }

  .code-block__copy:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: var(--bp-focus-offset);
  }

  .code-block__copy--copied {
    color: var(--bp-color-success);
  }

  .code-block__copy--error {
    color: var(--bp-color-error);
  }

  .code-block__icon {
    width: var(--bp-icon-size-sm);
    height: var(--bp-icon-size-sm);
  }

  /* Floating copy button (when header is hidden) */
  .code-block__floating-copy {
    position: absolute;
    top: var(--bp-spacing-xs);
    right: var(--bp-spacing-xs);
    z-index: var(--bp-z-base);
    opacity: 0;
    transition: opacity var(--bp-transition-fast);
  }

  .code-block__body:hover .code-block__floating-copy,
  .code-block__body:focus-within .code-block__floating-copy {
    opacity: 1;
  }

  /* Ensure floating copy button is reachable on touch devices (no hover) */
  @media (hover: none) {
    .code-block__floating-copy {
      opacity: 0.7;
    }
  }

  .code-block__floating-copy .code-block__copy {
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    box-shadow: var(--bp-shadow-sm);
  }

  /* Body */
  .code-block__body {
    position: relative;
    overflow: hidden;
  }

  .code-block__body--scroll {
    overflow-x: auto;
  }

  /* Pre / Code */
  .code-block__pre {
    margin: 0;
    padding: var(--bp-spacing-md);
    overflow: visible;
  }

  .code-block__body--wrap .code-block__pre {
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  .code-block__body--scroll .code-block__pre {
    white-space: pre;
    overflow-x: auto;
  }

  .code-block__code {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: var(--bp-color-text);
  }

  /* Line numbers grid layout */
  .code-block__lines {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .code-block__lines--no-gutter {
    grid-template-columns: 1fr;
  }

  .code-block__line-number {
    align-self: start;
    text-align: right;
    padding-right: var(--bp-spacing-md);
    color: var(--bp-color-text-muted);
    user-select: none;
    min-width: var(--bp-spacing-8);
    opacity: var(--bp-opacity-subtle);
  }

  .code-block__line {
    display: block;
    padding-left: var(--bp-spacing-2xs);
    border-left: var(--bp-spacing-0-5) solid transparent;
  }

  .code-block__line--highlighted {
    background-color: var(--bp-color-selected-bg);
    border-left-color: var(--bp-color-primary);
  }

  /* Collapsed / expand */
  /* max-height = (line count × line-height × font-size) + vertical padding */
  .code-block__body--collapsed {
    max-height: calc(
      var(--_max-lines, 10) * var(--bp-line-height-relaxed) * 1em +
        var(--bp-spacing-md) * 2
    );
    overflow: hidden;
  }

  .code-block__gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bp-spacing-16);
    background: linear-gradient(transparent, var(--bp-color-surface));
    pointer-events: none;
  }

  .code-block__expand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--bp-spacing-xs) var(--bp-spacing-md);
    background: none;
    border: none;
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    color: var(--bp-color-primary);
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-xs);
    font-weight: var(--bp-font-weight-medium);
    cursor: pointer;
    transition: background-color var(--bp-transition-fast);
  }

  .code-block__expand:hover {
    background-color: var(--bp-color-hover-overlay);
  }

  .code-block__expand:active {
    background-color: var(--bp-color-active-overlay);
  }

  .code-block__expand:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: calc(-1 * var(--bp-focus-offset));
  }

  /* Visually hidden status for screen readers.
     Uses --bp-spacing-0-5 (2px) instead of the typical 1px sr-only pattern
     to stay consistent with design tokens throughout. */
  .code-block__status {
    position: absolute;
    width: var(--bp-spacing-0-5);
    height: var(--bp-spacing-0-5);
    padding: var(--bp-spacing-0);
    margin: calc(-1 * var(--bp-spacing-0-5));
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: var(--bp-spacing-0);
  }

  /* Container queries for responsive behavior */
  @container (max-width: 480px) {
    /* stylelint-disable-line -- container queries cannot use var() */
    .code-block__header {
      flex-wrap: wrap;
    }

    .code-block__pre {
      padding: var(--bp-spacing-sm);
      font-size: var(--bp-font-size-xs);
    }

    .code-block__line-number {
      min-width: var(--bp-spacing-6);
      padding-right: var(--bp-spacing-sm);
    }
  }
`;
