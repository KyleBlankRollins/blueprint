import { css } from 'lit';

export const popoverStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    position: relative;
  }

  .popover {
    position: relative;
    display: inline-block;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
  }

  /* Trigger */
  .popover__trigger {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    user-select: none;
  }

  .popover__trigger:hover {
    opacity: 0.8;
  }

  .popover__trigger:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
    border-radius: var(--bp-border-radius-sm);
  }

  .popover--disabled .popover__trigger {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
  }

  /* Panel base */
  .popover__panel {
    position: absolute;
    z-index: var(--bp-z-popover);
    min-width: 160px;
    max-width: 320px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    box-shadow: var(--bp-shadow-lg);
    opacity: 1;
    animation: popover-fade-in var(--bp-transition-fast) ease-out;
  }

  @keyframes popover-fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Panel placements - Bottom */
  .popover__panel--bottom,
  .popover__panel--bottom-start,
  .popover__panel--bottom-end {
    top: 100%;
    margin-top: var(--popover-distance);
  }

  .popover__panel--bottom {
    left: 50%;
    transform: translateX(-50%);
  }

  .popover__panel--bottom-start {
    left: 0;
  }

  .popover__panel--bottom-end {
    right: 0;
  }

  /* Panel placements - Top */
  .popover__panel--top,
  .popover__panel--top-start,
  .popover__panel--top-end {
    bottom: 100%;
    margin-bottom: var(--popover-distance);
  }

  .popover__panel--top {
    left: 50%;
    transform: translateX(-50%);
  }

  .popover__panel--top-start {
    left: 0;
  }

  .popover__panel--top-end {
    right: 0;
  }

  /* Panel placements - Left */
  .popover__panel--left,
  .popover__panel--left-start,
  .popover__panel--left-end {
    right: 100%;
    margin-right: var(--popover-distance);
  }

  .popover__panel--left {
    top: 50%;
    transform: translateY(-50%);
  }

  .popover__panel--left-start {
    top: 0;
  }

  .popover__panel--left-end {
    bottom: 0;
  }

  /* Panel placements - Right */
  .popover__panel--right,
  .popover__panel--right-start,
  .popover__panel--right-end {
    left: 100%;
    margin-left: var(--popover-distance);
  }

  .popover__panel--right {
    top: 50%;
    transform: translateY(-50%);
  }

  .popover__panel--right-start {
    top: 0;
  }

  .popover__panel--right-end {
    bottom: 0;
  }

  /* Arrow */
  .popover__arrow {
    position: absolute;
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    transform: rotate(45deg);
    z-index: -1;
  }

  /* Arrow positions - bottom placements */
  .popover__panel--bottom .popover__arrow,
  .popover__panel--bottom-start .popover__arrow,
  .popover__panel--bottom-end .popover__arrow {
    top: calc(var(--bp-spacing-2) * -1);
    border-bottom: none;
    border-right: none;
  }

  .popover__panel--bottom .popover__arrow {
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  .popover__panel--bottom-start .popover__arrow {
    left: var(--bp-spacing-5);
  }

  .popover__panel--bottom-end .popover__arrow {
    right: var(--bp-spacing-5);
  }

  /* Arrow positions - top placements */
  .popover__panel--top .popover__arrow,
  .popover__panel--top-start .popover__arrow,
  .popover__panel--top-end .popover__arrow {
    bottom: calc(var(--bp-spacing-2) * -1);
    border-top: none;
    border-left: none;
  }

  .popover__panel--top .popover__arrow {
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  .popover__panel--top-start .popover__arrow {
    left: var(--bp-spacing-5);
  }

  .popover__panel--top-end .popover__arrow {
    right: var(--bp-spacing-5);
  }

  /* Arrow positions - left placements */
  .popover__panel--left .popover__arrow,
  .popover__panel--left-start .popover__arrow,
  .popover__panel--left-end .popover__arrow {
    right: calc(var(--bp-spacing-2) * -1);
    border-left: none;
    border-bottom: none;
  }

  .popover__panel--left .popover__arrow {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }

  .popover__panel--left-start .popover__arrow {
    top: var(--bp-spacing-5);
  }

  .popover__panel--left-end .popover__arrow {
    bottom: var(--bp-spacing-5);
  }

  /* Arrow positions - right placements */
  .popover__panel--right .popover__arrow,
  .popover__panel--right-start .popover__arrow,
  .popover__panel--right-end .popover__arrow {
    left: calc(var(--bp-spacing-2) * -1);
    border-right: none;
    border-top: none;
  }

  .popover__panel--right .popover__arrow {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }

  .popover__panel--right-start .popover__arrow {
    top: var(--bp-spacing-5);
  }

  .popover__panel--right-end .popover__arrow {
    bottom: var(--bp-spacing-5);
  }

  /* Header */
  .popover__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--bp-spacing-4);
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
    border-bottom: var(--bp-border-width) solid var(--bp-color-border);
  }

  .popover__header ::slotted(*) {
    margin: 0;
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-semibold);
    color: var(--bp-color-text-strong);
  }

  /* Body */
  .popover__body {
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
  }

  /* Footer */
  .popover__footer {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-4);
    padding: var(--bp-spacing-4) var(--bp-spacing-5);
    border-top: var(--bp-border-width) solid var(--bp-color-border);
  }

  /* Close button */
  .popover__close {
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

  .popover__close:hover {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .popover__close:active {
    background-color: var(--bp-color-surface-pressed);
    transform: translateY(1px);
  }

  .popover__close:focus {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .popover__close:focus:not(:focus-visible) {
    outline: none;
  }

  .popover__close:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .popover__close bp-icon {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .popover__panel {
      animation: none;
    }

    .popover__close {
      transition: none;
    }
  }
`;
