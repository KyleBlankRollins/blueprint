import { css } from 'lit';

export const drawerStyles = css`
  /* Base styles */
  :host {
    display: contents;
  }

  .drawer {
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
  }

  /* Overlay mode */
  .drawer--overlay {
    position: fixed;
    inset: 0;
    z-index: var(--bp-z-modal);
    pointer-events: none;
  }

  .drawer--overlay.drawer--open {
    pointer-events: auto;
  }

  /* Backdrop */
  .backdrop {
    position: absolute;
    inset: 0;
    background-color: oklch(from var(--bp-color-text) l c h / 0.5);
    opacity: 0;
    transition: opacity var(--bp-transition-base) ease-out;
  }

  .backdrop--visible {
    opacity: 1;
  }

  /* Panel base */
  .panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: var(--bp-color-surface);
    box-shadow: var(--bp-shadow-lg);
    transition: transform var(--bp-transition-base) ease-out;
    overflow: hidden;
  }

  .drawer--overlay .panel:focus {
    outline: none;
  }

  /* Horizontal drawers (left/right) */
  .drawer--horizontal .panel {
    top: 0;
    bottom: 0;
    height: 100%;
  }

  .drawer--left .panel {
    left: 0;
    transform: translateX(-100%);
  }

  .drawer--left .panel--open {
    transform: translateX(0);
  }

  .drawer--right .panel {
    right: 0;
    transform: translateX(100%);
  }

  .drawer--right .panel--open {
    transform: translateX(0);
  }

  /* Vertical drawers (top/bottom) */
  .drawer--vertical .panel {
    left: 0;
    right: 0;
    width: 100%;
  }

  .drawer--top .panel {
    top: 0;
    transform: translateY(-100%);
  }

  .drawer--top .panel--open {
    transform: translateY(0);
  }

  .drawer--bottom .panel {
    bottom: 0;
    transform: translateY(100%);
  }

  .drawer--bottom .panel--open {
    transform: translateY(0);
  }

  /* Sizes - horizontal (width) */
  .drawer--horizontal.drawer--small .panel {
    width: calc(var(--bp-spacing-24) * 3);
  }

  .drawer--horizontal.drawer--medium .panel {
    width: calc(var(--bp-spacing-24) * 4 + var(--bp-spacing-16));
  }

  .drawer--horizontal.drawer--large .panel {
    width: var(--bp-breakpoint-sm);
  }

  .drawer--horizontal.drawer--full .panel {
    width: 100%;
  }

  /* Sizes - vertical (height) */
  .drawer--vertical.drawer--small .panel {
    height: calc(var(--bp-spacing-24) * 2);
  }

  .drawer--vertical.drawer--medium .panel {
    height: calc(var(--bp-spacing-24) * 3 + var(--bp-spacing-8));
  }

  .drawer--vertical.drawer--large .panel {
    height: calc(var(--bp-spacing-24) * 5);
  }

  .drawer--vertical.drawer--full .panel {
    height: 100%;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--bp-spacing-4);
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    flex-shrink: 0;
  }

  .header--empty {
    display: none;
  }

  .header ::slotted(*) {
    margin: 0;
    font-size: var(--bp-font-size-lg);
    font-weight: var(--bp-font-weight-semibold);
  }

  /* Body */
  .body {
    flex: 1;
    overflow-y: auto;
    padding: var(--bp-spacing-5);
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-4);
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    flex-shrink: 0;
  }

  /* Close button */
  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    margin-left: auto;
    background: transparent;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast),
      transform var(--bp-transition-fast);
  }

  .close-button:hover {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .close-button:active {
    background-color: var(--bp-color-surface-pressed);
    transform: translateY(1px);
  }

  .close-button:focus {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .close-button:focus:not(:focus-visible) {
    outline: none;
  }

  .close-button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Inline mode - static sidebar */
  .drawer--inline {
    display: block;
  }

  .drawer--inline .panel {
    position: relative;
    transform: none;
    box-shadow: none;
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
  }

  .drawer--inline.drawer--horizontal {
    height: 100%;
  }

  .drawer--inline.drawer--vertical {
    width: 100%;
  }

  /* Inline sizes - horizontal */
  .drawer--inline.drawer--horizontal.drawer--small {
    width: calc(var(--bp-spacing-24) * 3);
  }

  .drawer--inline.drawer--horizontal.drawer--medium {
    width: calc(var(--bp-spacing-24) * 4 + var(--bp-spacing-16));
  }

  .drawer--inline.drawer--horizontal.drawer--large {
    width: var(--bp-breakpoint-sm);
  }

  .drawer--inline.drawer--horizontal.drawer--full {
    width: 100%;
  }

  /* Inline sizes - vertical */
  .drawer--inline.drawer--vertical.drawer--small .panel {
    height: calc(var(--bp-spacing-24) * 2);
  }

  .drawer--inline.drawer--vertical.drawer--medium .panel {
    height: calc(var(--bp-spacing-24) * 3 + var(--bp-spacing-8));
  }

  .drawer--inline.drawer--vertical.drawer--large .panel {
    height: calc(var(--bp-spacing-24) * 5);
  }

  .drawer--inline.drawer--vertical.drawer--full .panel {
    height: auto;
  }

  /* Border positioning for inline drawers */
  .drawer--inline.drawer--left .panel {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .drawer--inline.drawer--right .panel {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .drawer--inline.drawer--top .panel {
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .drawer--inline.drawer--bottom .panel {
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none;
    }

    .backdrop {
      transition: none;
    }
  }
`;
