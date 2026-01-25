import { css } from 'lit';

/**
 * Color Picker Styles
 *
 * INTENTIONAL HARDCODED VALUES (functional, not themed):
 * - Checkerboard pattern (#ccc) - standard transparency visualization
 * - Hue gradient (hsl spectrum) - must be actual hue colors
 * - White (#fff) handles - must contrast on any color background
 * - Black (#000) gradient - value gradient for color area
 * - Component dimensions (280px, 160px) - not semantic spacing
 *
 * All other values use design tokens.
 */
export const colorPickerStyles = css`
  /* ─────────────────────────────────────────────────────────────────────────────
   * Base Styles
   * ───────────────────────────────────────────────────────────────────────────── */

  :host {
    /* Component-specific custom properties */
    /* stylelint-disable blueprint/no-hardcoded-values */
    --color-picker-width: 280px;
    --color-picker-area-height: 160px;
    --color-picker-swatch-size: var(--bp-spacing-lg);
    --color-picker-handle-size: var(--bp-spacing-md);
    /* stylelint-enable blueprint/no-hardcoded-values */

    display: inline-block;
    position: relative;
    font-family: var(--bp-font-family);
  }

  :host([disabled]) {
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  .color-picker {
    position: relative;
  }

  /* Screen reader only text */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Trigger Button
   * ───────────────────────────────────────────────────────────────────────────── */

  .trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    cursor: pointer;
    font-family: inherit;
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
    transition:
      border-color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
  }

  .trigger:hover:not(:disabled) {
    border-color: var(--bp-color-border-strong);
  }

  .trigger:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .trigger:disabled {
    cursor: not-allowed;
  }

  .trigger-swatch {
    display: block;
    width: var(--color-picker-swatch-size);
    height: var(--color-picker-swatch-size);
    border-radius: var(--bp-border-radius-sm);
    border: var(--bp-border-width) solid var(--bp-color-border);
    /* Checkerboard pattern for transparency - functional, not themed */
    /* stylelint-disable blueprint/no-hardcoded-values */
    background-image:
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: var(--bp-spacing-sm) var(--bp-spacing-sm);
    background-position:
      0 0,
      0 calc(var(--bp-spacing-sm) / 2),
      calc(var(--bp-spacing-sm) / 2) calc(var(--bp-spacing-sm) / -2),
      calc(var(--bp-spacing-sm) / -2) 0;
    /* stylelint-enable blueprint/no-hardcoded-values */
    position: relative;
  }

  .trigger-swatch::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    border-radius: inherit;
  }

  .trigger-label {
    color: var(--bp-color-text);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Picker Panel
   * ───────────────────────────────────────────────────────────────────────────── */

  .picker {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: var(--bp-spacing-xs);
    width: var(--color-picker-width);
    background-color: var(--bp-color-surface-elevated);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    box-shadow: var(--bp-shadow-lg);
    z-index: var(--bp-z-popover);
    animation: fadeIn var(--bp-transition-fast) ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(calc(var(--bp-spacing-xs) * -1));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :host([inline]) .picker {
    position: static;
    margin-top: 0;
    box-shadow: none;
  }

  .picker-body {
    padding: var(--bp-spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-md);
  }

  .picker-main {
    display: flex;
    gap: var(--bp-spacing-sm);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Color Area (Saturation/Value)
   * ───────────────────────────────────────────────────────────────────────────── */

  .color-area {
    flex: 1;
    height: var(--color-picker-area-height);
    position: relative;
    border-radius: var(--bp-border-radius-sm);
    background: var(--hue-color);
    cursor: crosshair;
    touch-action: none;
    user-select: none;
  }

  /* White-to-transparent and transparent-to-black gradients - functional for color picking */
  /* stylelint-disable blueprint/no-hardcoded-values */
  .color-area::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #fff, transparent);
    border-radius: inherit;
  }

  .color-area::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, #000);
    border-radius: inherit;
  }
  /* stylelint-enable blueprint/no-hardcoded-values */

  .color-area:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Slider handles use white borders for visibility on any color */
  /* stylelint-disable blueprint/no-hardcoded-values -- white border for contrast on any hue */
  .color-area-handle {
    position: absolute;
    width: var(--color-picker-handle-size);
    height: var(--color-picker-handle-size);
    border: var(--bp-border-width) solid #fff;
    border-radius: 50%;
    box-shadow: var(--bp-shadow-sm);
    transform: translate(-50%, -50%);
    z-index: 1;
    pointer-events: none;
  }

  /* Expand touch target to 44×44px minimum (WCAG 2.2) */
  .color-area-handle::after {
    content: '';
    position: absolute;
    /* 44px touch target with 12px visual handle = 16px padding each side */
    inset: calc(var(--bp-spacing-lg) * -1);
  }
  /* stylelint-enable blueprint/no-hardcoded-values */

  /* ─────────────────────────────────────────────────────────────────────────────
   * Hue Slider
   * ───────────────────────────────────────────────────────────────────────────── */

  .hue-slider {
    width: var(--bp-spacing-lg);
    height: var(--color-picker-area-height);
    position: relative;
    border-radius: var(--bp-border-radius-sm);
    /* Full hue spectrum gradient - functional, not themed */
    /* stylelint-disable blueprint/no-hardcoded-values */
    background: linear-gradient(
      to bottom,
      hsl(0, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(360, 100%, 50%)
    );
    /* stylelint-enable blueprint/no-hardcoded-values */
    cursor: pointer;
    touch-action: none;
    user-select: none;
  }

  .hue-slider:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* stylelint-disable blueprint/no-hardcoded-values -- white border for contrast on hue spectrum */
  .hue-slider-handle {
    position: absolute;
    left: calc(var(--bp-spacing-xs) * -0.5);
    right: calc(var(--bp-spacing-xs) * -0.5);
    height: var(--bp-spacing-sm);
    border: var(--bp-border-width) solid #fff;
    border-radius: var(--bp-border-radius-sm);
    box-shadow: var(--bp-shadow-sm);
    transform: translateY(-50%);
    pointer-events: none;
  }

  /* Expand touch target to 44×44px minimum (WCAG 2.2) */
  .hue-slider-handle::after {
    content: '';
    position: absolute;
    /* 44px touch target with 8px visual handle = 18px padding top/bottom */
    top: calc(var(--bp-spacing-lg) * -2.25);
    bottom: calc(var(--bp-spacing-lg) * -2.25);
    left: 0;
    right: 0;
  }
  /* stylelint-enable blueprint/no-hardcoded-values */

  /* ─────────────────────────────────────────────────────────────────────────────
   * Alpha Slider
   * ───────────────────────────────────────────────────────────────────────────── */

  .alpha-slider {
    height: var(--bp-spacing-md);
    position: relative;
    border-radius: var(--bp-border-radius-sm);
    /* Checkerboard pattern for transparency - functional, not themed */
    /* stylelint-disable blueprint/no-hardcoded-values */
    background-image:
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: var(--bp-spacing-sm) var(--bp-spacing-sm);
    background-position:
      0 0,
      0 calc(var(--bp-spacing-sm) / 2),
      calc(var(--bp-spacing-sm) / 2) calc(var(--bp-spacing-sm) / -2),
      calc(var(--bp-spacing-sm) / -2) 0;
    /* stylelint-enable blueprint/no-hardcoded-values */
    cursor: pointer;
    touch-action: none;
    user-select: none;
  }

  .alpha-slider::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--alpha-gradient);
    border-radius: inherit;
  }

  .alpha-slider:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* stylelint-disable blueprint/no-hardcoded-values -- white border for contrast on alpha gradient */
  .alpha-slider-handle {
    position: absolute;
    top: calc(var(--bp-spacing-xs) * -0.5);
    bottom: calc(var(--bp-spacing-xs) * -0.5);
    width: var(--bp-spacing-sm);
    border: var(--bp-border-width) solid #fff;
    border-radius: var(--bp-border-radius-sm);
    box-shadow: var(--bp-shadow-sm);
    transform: translateX(-50%);
    pointer-events: none;
  }

  /* Expand touch target to 44×44px minimum (WCAG 2.2) */
  .alpha-slider-handle::after {
    content: '';
    position: absolute;
    /* 44px touch target with 8px visual handle = 18px padding left/right */
    left: calc(var(--bp-spacing-lg) * -2.25);
    right: calc(var(--bp-spacing-lg) * -2.25);
    top: 0;
    bottom: 0;
  }
  /* stylelint-enable blueprint/no-hardcoded-values */

  /* ─────────────────────────────────────────────────────────────────────────────
   * Controls Row
   * ───────────────────────────────────────────────────────────────────────────── */

  .picker-controls {
    display: flex;
    align-items: flex-start;
    gap: var(--bp-spacing-sm);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Preview
   * ───────────────────────────────────────────────────────────────────────────── */

  .preview {
    display: flex;
    flex-direction: column;
    width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    border-radius: var(--bp-border-radius-sm);
    overflow: hidden;
    border: var(--bp-border-width) solid var(--bp-color-border);
    /* Checkerboard pattern for transparency - functional, not themed */
    /* stylelint-disable blueprint/no-hardcoded-values */
    background-image:
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: var(--bp-spacing-sm) var(--bp-spacing-sm);
    background-position:
      0 0,
      0 calc(var(--bp-spacing-sm) / 2),
      calc(var(--bp-spacing-sm) / 2) calc(var(--bp-spacing-sm) / -2),
      calc(var(--bp-spacing-sm) / -2) 0;
    /* stylelint-enable blueprint/no-hardcoded-values */
  }

  .preview-swatch {
    flex: 1;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Inputs
   * ───────────────────────────────────────────────────────────────────────────── */

  .inputs-container {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: var(--bp-spacing-xs);
  }

  .input-row {
    display: flex;
    gap: var(--bp-spacing-xs);
    flex: 1;
  }

  .input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-2xs);
  }

  .color-input {
    width: 100%;
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-family: var(--bp-font-family-mono);
    font-size: var(--bp-font-size-sm);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text);
    text-align: center;
    box-sizing: border-box;
  }

  .color-input:focus {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
    border-color: var(--bp-color-primary);
  }

  .color-input::-webkit-inner-spin-button,
  .color-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .color-input[type='number'] {
    -moz-appearance: textfield;
  }

  .hex-input {
    text-transform: uppercase;
  }

  .input-label {
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-text-muted);
    text-align: center;
    text-transform: uppercase;
  }

  .format-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
    padding: 0;
    margin-top: var(--bp-spacing-2xs);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .format-toggle:hover:not(:disabled) {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .format-toggle:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .format-toggle svg {
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Eyedropper
   * ───────────────────────────────────────────────────────────────────────────── */

  .eyedropper-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    padding: 0;
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .eyedropper-button:hover:not(:disabled) {
    background-color: var(--bp-color-surface-subdued);
    color: var(--bp-color-text);
  }

  .eyedropper-button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .eyedropper-button:disabled {
    cursor: not-allowed;
  }

  .eyedropper-button svg {
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Swatches
   * ───────────────────────────────────────────────────────────────────────────── */

  .swatches-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--bp-spacing-xs);
    padding-top: var(--bp-spacing-sm);
    border-top: var(--bp-border-width) solid var(--bp-color-border);
  }

  .swatch {
    width: var(--color-picker-swatch-size);
    height: var(--color-picker-swatch-size);
    padding: 0;
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-sm);
    cursor: pointer;
    transition: transform var(--bp-transition-fast);
  }

  .swatch:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .swatch:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .swatch:disabled {
    cursor: not-allowed;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Sizes
   * ───────────────────────────────────────────────────────────────────────────── */

  .color-picker--sm .trigger {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
  }

  .color-picker--sm .trigger-swatch {
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
  }

  .color-picker--lg .trigger {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    font-size: var(--bp-font-size-lg);
  }

  .color-picker--lg .trigger-swatch {
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Reduced Motion
   * ───────────────────────────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    @keyframes fadeIn {
      from,
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .trigger,
    .format-toggle,
    .eyedropper-button,
    .swatch,
    .color-input {
      transition: none;
    }
  }
`;
