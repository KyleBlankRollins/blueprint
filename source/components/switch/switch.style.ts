import { css } from 'lit';

export const switchStyles = css`
  /* ─────────────────────────────────────────────────────────────────────────────
   * Base
   * ───────────────────────────────────────────────────────────────────────────── */

  :host {
    display: inline-block;
  }

  .switch {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    cursor: pointer;
    user-select: none;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
    -webkit-tap-highlight-color: transparent;
  }

  .switch__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .switch__label {
    flex: 1;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Track
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch__track {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-radius: var(--bp-border-radius-full);
    background-color: var(--bp-color-border-strong);
    transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Thumb
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch__thumb {
    position: absolute;
    border-radius: var(--bp-border-radius-full);
    background-color: var(--bp-color-surface-elevated);
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.2),
      0 1px 3px oklch(0 0 0 / 0.1);
    transition:
      transform 200ms cubic-bezier(0.2, 0, 0, 1),
      width 200ms cubic-bezier(0.2, 0, 0, 1),
      box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
    will-change: transform, width;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Sizes — proportional track + thumb dimensions
   *
   *   sm: track 32×18, thumb 14, pad 2
   *   md: track 40×22, thumb 18, pad 2
   *   lg: track 48×28, thumb 22, pad 3
   * ───────────────────────────────────────────────────────────────────────────── */

  /* Small */
  .switch--sm .switch__track {
    width: var(--bp-spacing-8);
    height: 18px;
    padding: var(--bp-spacing-0-5);
  }
  .switch--sm .switch__thumb {
    width: 14px;
    height: 14px;
    left: var(--bp-spacing-0-5);
  }
  .switch--sm .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(14px);
  }

  /* Medium */
  .switch--md .switch__track {
    width: var(--bp-spacing-10);
    height: 22px;
    padding: var(--bp-spacing-0-5);
  }
  .switch--md .switch__thumb {
    width: 18px;
    height: 18px;
    left: var(--bp-spacing-0-5);
  }
  .switch--md .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(18px);
  }

  /* Large */
  .switch--lg .switch__track {
    width: var(--bp-spacing-12);
    height: 28px;
    padding: var(--bp-spacing-1);
  }
  .switch--lg .switch__thumb {
    width: 22px;
    height: 22px;
    left: var(--bp-spacing-1);
  }
  .switch--lg .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(22px);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Checked state
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch__input:checked + .switch__track {
    background-color: var(--bp-color-primary);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Hover
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch:hover:not(.switch--disabled) .switch__track {
    background-color: var(--bp-color-text-muted);
  }

  .switch:hover:not(.switch--disabled) .switch__input:checked + .switch__track {
    background-color: var(--bp-color-primary-hover);
  }

  .switch:hover:not(.switch--disabled) .switch__thumb {
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.25),
      0 2px 6px oklch(0 0 0 / 0.1);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Active / Pressed — thumb stretches toward the direction of travel
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch:active:not(.switch--disabled) .switch--sm .switch__thumb,
  .switch--sm .switch__input:active + .switch__track .switch__thumb {
    width: 18px;
  }
  .switch--sm .switch__input:checked:active + .switch__track .switch__thumb {
    width: 18px;
    transform: translateX(10px);
  }

  .switch:active:not(.switch--disabled) .switch--md .switch__thumb,
  .switch--md .switch__input:active + .switch__track .switch__thumb {
    width: 22px;
  }
  .switch--md .switch__input:checked:active + .switch__track .switch__thumb {
    width: 22px;
    transform: translateX(14px);
  }

  .switch:active:not(.switch--disabled) .switch--lg .switch__thumb,
  .switch--lg .switch__input:active + .switch__track .switch__thumb {
    width: 26px;
  }
  .switch--lg .switch__input:checked:active + .switch__track .switch__thumb {
    width: 26px;
    transform: translateX(18px);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Focus
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch--focus .switch__track {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Disabled
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Error
   * ───────────────────────────────────────────────────────────────────────────── */

  .switch--error .switch__track {
    background-color: var(--bp-color-error);
  }

  .switch--error .switch__input:checked + .switch__track {
    background-color: var(--bp-color-error);
  }

  .switch:hover:not(.switch--disabled).switch--error .switch__track {
    background-color: var(--bp-color-error-hover);
  }

  .switch:hover:not(.switch--disabled).switch--error
    .switch__input:checked
    + .switch__track {
    background-color: var(--bp-color-error-hover);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Touch target — ensure 44×44px minimum on touch devices
   * ───────────────────────────────────────────────────────────────────────────── */

  @media (pointer: coarse) {
    .switch {
      min-height: 44px;
      padding: var(--bp-spacing-xs) 0;
    }

    .switch__track::before {
      content: '';
      position: absolute;
      inset: -8px -4px;
    }
  }
`;
