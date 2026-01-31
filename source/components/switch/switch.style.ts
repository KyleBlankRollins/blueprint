import { css } from 'lit';

export const switchStyles = css`
  /* Base styles */
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
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .switch__track {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border-strong);
    border-radius: var(--bp-spacing-6);
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast);
  }

  .switch__thumb {
    display: block;
    background-color: var(--bp-color-text-inverse);
    border-radius: 50%;
    transition: transform var(--bp-transition-fast);
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.2),
      0 1px 2px oklch(0 0 0 / 0.1);
  }

  .switch__label {
    flex: 1;
  }

  /* Sizes */
  .switch--sm .switch__track {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-5);
    padding: var(--bp-spacing-2xs);
  }

  .switch--sm .switch__thumb {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  .switch--md .switch__track {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-6);
    padding: var(--bp-spacing-xs);
  }

  .switch--md .switch__thumb {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }

  .switch--lg .switch__track {
    width: var(--bp-spacing-12);
    height: var(--bp-spacing-6);
    padding: var(--bp-spacing-xs);
  }

  .switch--lg .switch__thumb {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  /* Checked state */
  .switch__input:checked + .switch__track {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
  }

  .switch--sm .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(var(--bp-spacing-4));
  }

  .switch--md .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(var(--bp-spacing-4));
  }

  .switch--lg .switch__input:checked + .switch__track .switch__thumb {
    transform: translateX(var(--bp-spacing-5));
  }

  /* Focus state */
  .switch--focus .switch__track {
    outline: var(--bp-border-width) solid var(--bp-color-focus);
    outline-offset: var(--bp-spacing-2xs);
  }

  /* Hover state */
  .switch:hover:not(.switch--disabled) .switch__track {
    border-color: var(--bp-color-primary);
  }

  .switch:hover:not(.switch--disabled) .switch__input:checked + .switch__track {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  /* Disabled state */
  .switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Error state */
  .switch--error .switch__track {
    border-color: var(--bp-color-error);
  }

  .switch--error .switch__input:checked + .switch__track {
    background-color: var(--bp-color-error);
    border-color: var(--bp-color-error);
  }

  /* Touch target size: ensure 44x44px minimum on touch devices */
  @media (pointer: coarse) {
    .switch {
      min-height: 44px;
      padding: var(--bp-spacing-xs) 0;
    }

    .switch__track {
      position: relative;
    }

    /* Expand touch target with pseudo-element */
    .switch__track::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 44px;
      min-height: 44px;
    }
  }
`;
