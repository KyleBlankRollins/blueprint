import { css } from 'lit';

export const menuStyles = css`
  /* Base styles - Menu Container */
  :host {
    display: block;
  }

  .menu {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    padding: var(--bp-spacing-xs) 0;
    margin: 0;
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    box-shadow: var(--bp-shadow-lg);
    font-family: var(--bp-font-sans);
    list-style: none;
    outline: none;
  }

  /* Menu Sizes */
  .menu--small {
    min-width: 160px;
  }

  .menu--large {
    min-width: 280px;
  }

  /* Menu Item Base */
  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    margin: 0 var(--bp-spacing-xs);
    min-height: 40px;
    border-radius: var(--bp-border-radius-sm);
    background-color: transparent;
    color: var(--bp-color-text);
    font-family: var(--bp-font-sans);
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-normal);
    line-height: var(--bp-line-height-normal);
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      transform var(--bp-transition-fast);
    user-select: none;
    outline: none;
  }

  /* Menu Item Sizes */
  .menu-item--small {
    padding: var(--bp-spacing-sm) var(--bp-spacing-sm);
    min-height: 36px;
    font-size: var(--bp-font-size-sm);
  }

  .menu-item--large {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    min-height: 48px;
    font-size: var(--bp-font-size-lg);
  }

  /* Menu Item States */
  .menu-item:hover:not(.menu-item--disabled) {
    background-color: var(--bp-color-surface);
  }

  .menu-item:focus-visible:not(.menu-item--disabled) {
    background-color: var(--bp-color-surface);
    outline: 2px solid var(--bp-color-primary);
    outline-offset: 2px;
  }

  .menu-item:active:not(.menu-item--disabled) {
    background-color: var(--bp-color-surface);
    transform: scale(0.98);
  }

  .menu-item--selected {
    background-color: var(--bp-color-surface);
    font-weight: var(--bp-font-weight-medium);
  }

  .menu-item--selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--bp-color-primary);
    border-radius: 0 var(--bp-border-radius-sm) var(--bp-border-radius-sm) 0;
  }

  .menu-item--disabled {
    color: var(--bp-color-text-muted);
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Menu Item Parts */
  .menu-item__prefix {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .menu-item__prefix:empty {
    display: none;
  }

  .menu-item__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-item__suffix {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    flex-shrink: 0;
    margin-left: auto;
  }

  .menu-item__suffix:empty {
    display: none;
  }

  .menu-item__shortcut {
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-sm);
    font-family: var(--bp-font-mono);
    padding: 2px var(--bp-spacing-xs);
    background-color: var(--bp-color-surface);
    border-radius: var(--bp-border-radius-sm);
    border: var(--bp-border-width) solid var(--bp-color-border);
  }

  .menu-item__arrow {
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-lg);
    line-height: 1;
  }

  /* Menu Divider */
  .menu-divider {
    height: var(--bp-border-width);
    margin: var(--bp-spacing-sm) var(--bp-spacing-sm);
    background-color: var(--bp-color-border);
  }
`;
