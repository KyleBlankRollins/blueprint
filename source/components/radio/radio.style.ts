import { css } from 'lit';

export const radioStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .radio {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    cursor: pointer;
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
    user-select: none;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .radio__circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: var(--bp-border-width) solid var(--bp-color-border-strong);
    border-radius: 50%;
    background-color: var(--bp-color-surface);
    transition: all var(--bp-transition-fast);
  }

  .radio__circle-inner {
    width: 50%;
    height: 50%;
    border-radius: 50%;
    background-color: var(--bp-color-text-inverse);
    opacity: 0;
    transform: scale(0);
    transition:
      opacity var(--bp-duration-fast) var(--bp-ease-out),
      transform var(--bp-duration-fast) var(--bp-ease-bounce);
  }

  .radio__label {
    line-height: var(--bp-line-height-normal);
  }

  /* Sizes */
  .radio--sm .radio__circle {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  .radio--sm .radio__label {
    font-size: var(--bp-font-size-sm);
  }

  .radio--md .radio__circle {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }

  .radio--md .radio__label {
    font-size: var(--bp-font-size-base);
  }

  .radio--lg .radio__circle {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  .radio--lg .radio__label {
    font-size: var(--bp-font-size-lg);
  }

  /* States - Checked */
  .radio__input:checked ~ .radio__circle {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
  }

  .radio__input:checked ~ .radio__circle .radio__circle-inner {
    opacity: 1;
    transform: scale(1);
  }

  /* States - Focus */
  .radio--focused .radio__circle {
    outline: var(--bp-spacing-xs) solid var(--bp-color-focus);
    outline-offset: var(--bp-spacing-xs);
  }

  /* States - Hover */
  .radio:hover:not(.radio--disabled) .radio__circle {
    border-color: var(--bp-color-primary);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .radio:hover:not(.radio--disabled) .radio__input:checked ~ .radio__circle {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  /* States - Active */
  .radio:active:not(.radio--disabled) .radio__circle {
    transform: scale(0.95);
  }

  /* States - Error */
  .radio--error .radio__circle {
    border-color: var(--bp-color-error);
  }

  .radio--error.radio--focused .radio__circle {
    outline-color: var(--bp-color-error);
  }

  .radio--error .radio__input:checked ~ .radio__circle {
    background-color: var(--bp-color-error);
    border-color: var(--bp-color-error);
  }

  /* States - Disabled */
  .radio--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Touch target size: ensure 44x44px minimum on touch devices */
  @media (pointer: coarse) {
    .radio {
      min-height: 44px;
      padding: var(--bp-spacing-xs) 0;
    }

    .radio__circle {
      position: relative;
    }

    /* Expand touch target with pseudo-element */
    .radio__circle::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 44px;
      height: 44px;
    }
  }
`;
