import { css } from 'lit';

export const tabsStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .tabs {
    font-family: var(--bp-font-family);
    display: flex;
    flex-direction: column;
  }

  /* Tablist - horizontal by default */
  .tablist {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--bp-spacing-xs);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
    padding-bottom: var(--bp-spacing-xs);
  }

  /* Tab button base */
  .tab {
    /* Reset */
    appearance: none;
    border: none;
    background: transparent;
    margin: 0;

    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--bp-spacing-xs);
    cursor: pointer;
    flex-shrink: 0;

    /* Typography */
    font-family: var(--bp-font-family);
    font-weight: var(--bp-font-weight-medium);
    white-space: nowrap;

    /* Visual */
    color: var(--bp-color-text-muted);
    border-radius: var(--bp-border-radius);
    transition: all var(--bp-transition-fast);

    /* Focus */
    outline: none;
  }

  .tab__icon {
    flex-shrink: 0;
  }

  .tab__label {
    display: inline-block;
  }

  .tab__close {
    /* Reset */
    appearance: none;
    border: none;
    background: transparent;
    padding: var(--bp-spacing-xs);
    margin: calc(-1 * var(--bp-spacing-xs));
    margin-left: var(--bp-spacing-xs);
    cursor: pointer;
    border-radius: var(--bp-border-radius);

    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);

    /* Visual */
    color: var(--bp-color-text-muted);
    transition: all var(--bp-transition-fast);
  }

  .tab__close svg {
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  .tab__close:hover {
    background: var(--bp-color-surface);
    color: var(--bp-color-text);
  }

  .tab__close:active {
    transform: scale(0.95);
  }

  /* Panels container */
  .panels {
    flex: 1;
    padding: var(--bp-spacing-md);
  }

  /* Sizes */
  .tabs--small .tab {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-tight);
  }

  .tabs--medium .tab {
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
  }

  .tabs--large .tab {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
    line-height: var(--bp-line-height-normal);
  }

  /* Default variant */
  .tabs--default .tab--active {
    color: var(--bp-color-primary);
    background: var(--bp-color-surface);
  }

  .tabs--default .tab:hover:not(.tab--disabled):not(.tab--active) {
    color: var(--bp-color-text);
    background: var(--bp-color-surface-subdued);
  }

  .tab:active:not(.tab--disabled) {
    opacity: 0.8;
  }

  /* Underline variant */
  .tabs--underline .tablist {
    gap: var(--bp-spacing-md);
  }

  .tabs--underline .tab {
    border-radius: 0;
    position: relative;
    padding-bottom: var(--bp-spacing-sm);
    margin-bottom: calc(-1 * var(--bp-spacing-xs) - var(--bp-border-width));
  }

  .tabs--underline .tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bp-spacing-0-5);
    background: transparent;
    transition: background var(--bp-transition-fast);
  }

  .tabs--underline .tab--active::after {
    background: var(--bp-color-primary);
  }

  .tabs--underline .tab--active {
    color: var(--bp-color-primary);
  }

  .tabs--underline .tab:hover:not(.tab--disabled):not(.tab--active) {
    color: var(--bp-color-text);
  }

  .tabs--underline .tab:hover:not(.tab--disabled):not(.tab--active)::after {
    background: var(--bp-color-border);
  }

  /* Pills variant */
  .tabs--pills .tablist {
    border-bottom: none;
    gap: var(--bp-spacing-xs);
    padding-bottom: 0;
    background: var(--bp-color-surface);
    padding: var(--bp-spacing-xs);
    border-radius: var(--bp-border-radius-large);
  }

  .tabs--pills .tab {
    border-radius: var(--bp-border-radius);
  }

  .tabs--pills .tab--active {
    background: var(--bp-color-background);
    color: var(--bp-color-text);
    box-shadow: var(--bp-shadow-sm);
  }

  .tabs--pills .tab:hover:not(.tab--disabled):not(.tab--active) {
    color: var(--bp-color-text);
  }

  /* Placement: bottom */
  .tabs--bottom {
    flex-direction: column-reverse;
  }

  .tabs--bottom .tablist {
    border-bottom: none;
    border-top: var(--bp-border-width) solid var(--bp-color-border);
    padding-bottom: 0;
    padding-top: var(--bp-spacing-xs);
  }

  .tabs--bottom.tabs--underline .tab {
    margin-bottom: 0;
    margin-top: calc(-1 * var(--bp-spacing-xs) - var(--bp-border-width));
    padding-bottom: var(--bp-spacing-sm);
    padding-top: var(--bp-spacing-sm);
  }

  .tabs--bottom.tabs--underline .tab::after {
    top: 0;
    bottom: auto;
  }

  /* Placement: start (vertical left) */
  .tabs--start {
    flex-direction: row;
  }

  .tabs--start .tablist {
    flex-direction: column;
    border-bottom: none;
    border-right: var(--bp-border-width) solid var(--bp-color-border);
    padding-bottom: 0;
    padding-right: var(--bp-spacing-xs);
  }

  .tabs--start .tab {
    justify-content: flex-start;
  }

  .tabs--start.tabs--underline .tab {
    margin-bottom: 0;
    margin-right: calc(-1 * var(--bp-spacing-xs) - var(--bp-border-width));
    padding-right: var(--bp-spacing-sm);
  }

  .tabs--start.tabs--underline .tab::after {
    left: auto;
    right: 0;
    top: 0;
    bottom: 0;
    width: var(--bp-spacing-0-5);
    height: auto;
  }

  /* Placement: end (vertical right) */
  .tabs--end {
    flex-direction: row-reverse;
  }

  .tabs--end .tablist {
    flex-direction: column;
    border-bottom: none;
    border-left: var(--bp-border-width) solid var(--bp-color-border);
    padding-bottom: 0;
    padding-left: var(--bp-spacing-xs);
  }

  .tabs--end .tab {
    justify-content: flex-start;
  }

  .tabs--end.tabs--underline .tab {
    margin-bottom: 0;
    margin-left: calc(-1 * var(--bp-spacing-xs) - var(--bp-border-width));
    padding-left: var(--bp-spacing-sm);
  }

  .tabs--end.tabs--underline .tab::after {
    right: auto;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--bp-spacing-0-5);
    height: auto;
  }

  /* States */
  .tab--disabled {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  .tabs--disabled .tab {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  .tab:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }
`;
