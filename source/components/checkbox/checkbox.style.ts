import { css } from 'lit';

export const checkboxStyles = css`
  /* Base styles */
  :host {
    display: inline-block;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-sm);
    cursor: pointer;
    font-family: var(--bp-font-family-sans);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
    user-select: none;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .checkbox__checkmark {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: var(--bp-border-width) solid var(--bp-color-border-strong);
    border-radius: var(--bp-border-radius-sm);
    background-color: var(--bp-color-surface);
    transition: all var(--bp-transition-fast);
  }

  .checkbox__checkmark svg {
    width: 100%;
    height: 100%;
    color: var(--bp-color-text-inverse);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--bp-transition-fast);
  }

  .checkbox__label {
    line-height: var(--bp-line-height-normal);
  }

  /* Sizes */
  .checkbox--sm .checkbox__checkmark {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  .checkbox--sm .checkbox__label {
    font-size: var(--bp-font-size-sm);
  }

  .checkbox--md .checkbox__checkmark {
    width: var(--bp-spacing-5);
    height: var(--bp-spacing-5);
  }

  .checkbox--md .checkbox__label {
    font-size: var(--bp-font-size-base);
  }

  .checkbox--lg .checkbox__checkmark {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  .checkbox--lg .checkbox__label {
    font-size: var(--bp-font-size-lg);
  }

  /* States - Checked */
  .checkbox--checked .checkbox__checkmark {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
  }

  .checkbox--checked .checkbox__checkmark svg {
    opacity: 1;
    transform: scale(1);
  }

  /* States - Indeterminate */
  .checkbox--indeterminate .checkbox__checkmark {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
  }

  .checkbox--indeterminate .checkbox__checkmark svg {
    opacity: 1;
    transform: scale(1);
  }

  /* States - Hover */
  .checkbox:hover:not(.checkbox--disabled):not(.checkbox--checked):not(
      .checkbox--indeterminate
    )
    .checkbox__checkmark {
    border-color: var(--bp-color-primary);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .checkbox--checked:hover:not(.checkbox--disabled) .checkbox__checkmark,
  .checkbox--indeterminate:hover:not(.checkbox--disabled) .checkbox__checkmark {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  /* States - Active */
  .checkbox:active:not(.checkbox--disabled) .checkbox__checkmark {
    transform: scale(0.95);
  }

  /* States - Focused */
  .checkbox--focused .checkbox__checkmark {
    outline: 2px solid var(--bp-color-focus);
    outline-offset: 2px;
  }

  /* States - Disabled */
  .checkbox--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* States - Error */
  .checkbox--error .checkbox__checkmark {
    border-color: var(--bp-color-error);
  }

  .checkbox--error.checkbox--checked .checkbox__checkmark,
  .checkbox--error.checkbox--indeterminate .checkbox__checkmark {
    background-color: var(--bp-color-error);
    border-color: var(--bp-color-error);
  }
`;
