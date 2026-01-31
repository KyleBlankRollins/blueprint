import { css } from 'lit';

export const dropdownStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
    position: relative;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Trigger */
  .dropdown__trigger {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    user-select: none;
  }

  .dropdown__trigger:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
    border-radius: var(--bp-border-radius-sm);
  }

  /* Panel */
  .dropdown__panel {
    position: absolute;
    z-index: 1000; /* Overlay layer - above page content, below modals */
    min-width: 200px;
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    box-shadow: var(--bp-shadow-lg);
    padding: var(--bp-spacing-sm);
    opacity: 0;
    will-change: opacity, transform;
    transition:
      opacity var(--bp-transition-fast) var(--bp-ease-out),
      transform var(--bp-transition-fast) var(--bp-ease-out);
  }

  /* Placement: Bottom variants */
  .dropdown__panel--bottom-start {
    top: 100%;
    left: 0;
    margin-top: var(--dropdown-distance, 4px);
    transform: translateY(-8px);
  }

  .dropdown__panel--bottom-start.dropdown__panel--open {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown__panel--bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    margin-top: var(--dropdown-distance, 4px);
  }

  .dropdown__panel--bottom.dropdown__panel--open {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .dropdown__panel--bottom-end {
    top: 100%;
    right: 0;
    margin-top: var(--dropdown-distance, 4px);
    transform: translateY(-8px);
  }

  .dropdown__panel--bottom-end.dropdown__panel--open {
    opacity: 1;
    transform: translateY(0);
  }

  /* Placement: Top variants */
  .dropdown__panel--top-start {
    bottom: 100%;
    left: 0;
    margin-bottom: var(--dropdown-distance, 4px);
    transform: translateY(8px);
  }

  .dropdown__panel--top-start.dropdown__panel--open {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown__panel--top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    margin-bottom: var(--dropdown-distance, 4px);
  }

  .dropdown__panel--top.dropdown__panel--open {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .dropdown__panel--top-end {
    bottom: 100%;
    right: 0;
    margin-bottom: var(--dropdown-distance, 4px);
    transform: translateY(8px);
  }

  .dropdown__panel--top-end.dropdown__panel--open {
    opacity: 1;
    transform: translateY(0);
  }

  /* Placement: Side variants */
  .dropdown__panel--left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: var(--dropdown-distance, 4px);
  }

  .dropdown__panel--left.dropdown__panel--open {
    opacity: 1;
  }

  .dropdown__panel--right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: var(--dropdown-distance, 4px);
  }

  .dropdown__panel--right.dropdown__panel--open {
    opacity: 1;
  }

  /* Arrow */
  .dropdown__arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    transform: rotate(45deg);
    border-bottom: none;
    border-right: none;
  }

  /* Arrow positioning: Bottom variants */
  .dropdown__panel--bottom .dropdown__arrow {
    top: -7px;
    left: 50%;
    margin-left: -6px;
  }

  .dropdown__panel--bottom-start .dropdown__arrow {
    top: -7px;
    left: 16px;
  }

  .dropdown__panel--bottom-end .dropdown__arrow {
    top: -7px;
    right: 16px;
  }

  /* Arrow positioning: Top variants */
  .dropdown__panel--top .dropdown__arrow {
    bottom: -7px;
    left: 50%;
    margin-left: -6px;
    transform: rotate(225deg);
  }

  .dropdown__panel--top-start .dropdown__arrow {
    bottom: -7px;
    left: 16px;
    transform: rotate(225deg);
  }

  .dropdown__panel--top-end .dropdown__arrow {
    bottom: -7px;
    right: 16px;
    transform: rotate(225deg);
  }

  /* Arrow positioning: Side variants */
  .dropdown__panel--left .dropdown__arrow {
    right: -7px;
    top: 50%;
    margin-top: -6px;
    transform: rotate(135deg);
  }

  .dropdown__panel--right .dropdown__arrow {
    left: -7px;
    top: 50%;
    margin-top: -6px;
    transform: rotate(-45deg);
  }

  /* Disabled state */
  .dropdown--disabled .dropdown__trigger {
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(50%);
    pointer-events: none;
  }
`;
