import { css } from 'lit';

export const tooltipStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    position: relative;
  }

  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .tooltip-trigger {
    display: inline-block;
  }

  .tooltip-content {
    position: absolute;
    z-index: var(--bp-z-tooltip);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    background-color: var(--bp-color-text);
    color: var(--bp-color-text-inverse);
    border-radius: var(--bp-border-radius-sm);
    font-size: var(--bp-font-size-sm);
    font-family: var(--bp-font-family);
    line-height: var(--bp-line-height-tight);
    max-width: calc(var(--bp-spacing-24) * 3);
    white-space: normal;
    box-shadow: var(--bp-shadow-md);
    pointer-events: none;
    animation: tooltip-fade-in var(--bp-transition-fast);
  }

  @keyframes tooltip-fade-in {
    from {
      opacity: 0;
      scale: 0.95;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  /* Placement variants */
  .tooltip-content--top {
    bottom: calc(100% + var(--bp-spacing-xs));
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-content--top::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: var(--bp-spacing-sm);
    border-style: solid;
    border-color: var(--bp-color-text) transparent transparent transparent;
  }

  .tooltip-content--bottom {
    top: calc(100% + var(--bp-spacing-xs));
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip-content--bottom::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: var(--bp-spacing-sm);
    border-style: solid;
    border-color: transparent transparent var(--bp-color-text) transparent;
  }

  .tooltip-content--left {
    right: calc(100% + var(--bp-spacing-xs));
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip-content--left::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: var(--bp-spacing-sm);
    border-style: solid;
    border-color: transparent transparent transparent var(--bp-color-text);
  }

  .tooltip-content--right {
    left: calc(100% + var(--bp-spacing-xs));
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip-content--right::after {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: var(--bp-spacing-sm);
    border-style: solid;
    border-color: transparent var(--bp-color-text) transparent transparent;
  }

  /* States */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
