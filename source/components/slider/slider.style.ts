import { css } from 'lit';

export const sliderStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .slider {
    font-family: var(--bp-font-family);
  }

  .slider__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--bp-spacing-sm);
  }

  .slider__label {
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  .slider__value {
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text-muted);
    font-variant-numeric: tabular-nums;
  }

  .slider__container {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .slider__track {
    position: relative;
    width: 100%;
    background-color: var(--bp-color-border);
    border-radius: var(--bp-border-radius-full);
    overflow: visible;
  }

  .slider__fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--bp-color-primary);
    border-radius: var(--bp-border-radius-full);
    transition:
      width var(--bp-duration-instant),
      background-color var(--bp-transition-fast);
  }

  .slider__thumb {
    position: absolute;
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-primary);
    border-radius: var(--bp-border-radius-full);
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.2),
      0 1px 2px oklch(0 0 0 / 0.1);
    transform: translateX(-50%);
    cursor: grab;
    transition:
      box-shadow var(--bp-transition-fast),
      transform var(--bp-transition-fast),
      border-color var(--bp-transition-fast);
  }

  .slider__thumb:focus {
    outline: none;
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  .slider__thumb:focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  .slider__ticks {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: var(--bp-spacing-xs);
    pointer-events: none;
  }

  .slider__tick {
    position: absolute;
    top: var(--bp-spacing-xs);
    width: var(--bp-spacing-0-5);
    height: var(--bp-spacing-xs);
    background-color: var(--bp-color-border-strong);
    transform: translateX(-50%);
  }

  /* Size variants */
  .slider--sm .slider__track {
    height: var(--bp-spacing-1);
  }

  .slider--sm .slider__thumb {
    width: var(--bp-spacing-3);
    height: var(--bp-spacing-3);
    top: calc(var(--bp-spacing-1) / 2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .slider--md .slider__track {
    height: var(--bp-spacing-1-5);
  }

  .slider--md .slider__thumb {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    top: calc(var(--bp-spacing-1-5) / 2);
  }

  .slider--lg .slider__track {
    height: var(--bp-spacing-2);
  }

  .slider--lg .slider__thumb {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
    top: calc(var(--bp-spacing-2) / 2);
    box-shadow: var(--bp-shadow-md);
  }

  /* States */
  .slider__container:hover .slider__thumb {
    border-color: var(--bp-color-primary-hover);
    transform: translateX(-50%) scale(1.1);
  }

  .slider__container:hover .slider__fill {
    background-color: var(--bp-color-primary-hover);
  }

  .slider__container:hover .slider__track {
    background-color: color-mix(
      in srgb,
      var(--bp-color-border) 90%,
      var(--bp-color-primary) 10%
    );
  }

  .slider--dragging .slider__thumb {
    cursor: grabbing;
    border-color: var(--bp-color-primary-active);
    box-shadow: var(--bp-shadow-md);
    transform: translateX(-50%) scale(1.15);
  }

  .slider--dragging .slider__fill {
    background-color: var(--bp-color-primary-active);
    transition: none;
  }

  .slider--dragging .slider__track {
    background-color: color-mix(
      in srgb,
      var(--bp-color-border) 85%,
      var(--bp-color-primary) 15%
    );
  }

  .slider--disabled {
    pointer-events: none;
  }

  .slider--disabled .slider__track {
    background-color: var(--bp-color-surface-subdued);
  }

  .slider--disabled .slider__fill {
    background-color: var(--bp-color-border);
  }

  .slider--disabled .slider__thumb {
    background-color: var(--bp-color-surface-subdued);
    border-color: var(--bp-color-border);
    cursor: not-allowed;
    box-shadow: none;
  }

  .slider--disabled .slider__label,
  .slider--disabled .slider__value {
    color: var(--bp-color-text-muted);
    opacity: var(--bp-opacity-disabled);
  }
`;
