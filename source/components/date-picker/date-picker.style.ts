import { css } from 'lit';

export const datePickerStyles = css`
  :host {
    display: inline-block;
    width: 100%;
    max-width: var(--bp-spacing-2xl);
  }

  /* Base */
  .date-picker {
    position: relative;
    width: 100%;
  }

  .date-picker__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .date-picker__input {
    flex: 1;
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    padding-right: var(--bp-spacing-2xl);
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-base);
    color: var(--bp-color-text);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    cursor: pointer;
    transition:
      border-color var(--bp-transition-fast),
      box-shadow var(--bp-transition-fast);
    outline: none;
  }

  .date-picker__input:hover:not(:disabled) {
    border-color: var(--bp-color-primary);
  }

  .date-picker__input:focus {
    border-color: var(--bp-color-focus);
    box-shadow: 0 0 0 var(--bp-focus-width) var(--bp-color-focus);
  }

  .date-picker__input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .date-picker__input::placeholder {
    color: var(--bp-color-text-muted);
  }

  .date-picker__clear {
    position: absolute;
    right: var(--bp-spacing-2xl);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
    padding: 0;
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text-muted);
    background: none;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    cursor: pointer;
    transition:
      color var(--bp-transition-fast),
      background-color var(--bp-transition-fast);
  }

  .date-picker__clear:hover {
    color: var(--bp-color-primary);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .date-picker__indicator {
    position: absolute;
    right: var(--bp-spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
    color: var(--bp-color-text-muted);
    pointer-events: none;
  }

  /* Calendar */
  .date-picker__calendar {
    position: absolute;
    top: calc(100% + var(--bp-spacing-xs));
    left: 0;
    z-index: var(--bp-z-dropdown);
    width: 100%;
    min-width: var(--bp-spacing-2xl);
    padding: var(--bp-spacing-md);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-top: calc(var(--bp-border-width) * 2) solid var(--bp-color-primary);
    border-radius: var(--bp-border-radius-md);
    box-shadow: var(--bp-shadow-md);
  }

  /* Header */
  .date-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--bp-spacing-sm);
  }

  .date-picker__nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
    padding: 0;
    font-size: var(--bp-font-size-xl);
    color: var(--bp-color-text);
    background: none;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    cursor: pointer;
    transition: background-color var(--bp-transition-fast);
  }

  .date-picker__nav-button:hover {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .date-picker__month-year {
    flex: 1;
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-semibold);
    color: var(--bp-color-text);
    text-align: center;
  }

  /* Weekdays */
  .date-picker__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--bp-spacing-xs);
    margin-bottom: var(--bp-spacing-xs);
  }

  .date-picker__weekday {
    padding: var(--bp-spacing-xs);
    font-size: var(--bp-font-size-xs);
    font-weight: var(--bp-font-weight-semibold);
    color: var(--bp-color-text-muted);
    text-align: center;
    text-transform: uppercase;
  }

  /* Days */
  .date-picker__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--bp-spacing-xs);
  }

  .date-picker__day {
    aspect-ratio: 1;
    padding: var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text);
    background: none;
    border: none;
    border-radius: var(--bp-border-radius-sm);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .date-picker__day:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 8%,
      transparent
    );
  }

  .date-picker__day--other-month {
    color: var(--bp-color-text-muted);
    opacity: 0.5;
  }

  .date-picker__day--today {
    font-weight: var(--bp-font-weight-bold);
    color: var(--bp-color-primary);
    background-color: color-mix(
      in srgb,
      var(--bp-color-primary) 4%,
      transparent
    );
  }

  .date-picker__day--selected {
    color: var(--bp-color-text-inverse);
    background-color: var(--bp-color-primary);
  }

  .date-picker__day--selected:hover:not(:disabled) {
    background-color: var(--bp-color-primary-hover);
  }

  .date-picker__day--focused {
    outline: var(--bp-focus-width) solid var(--bp-color-primary);
    outline-offset: calc(-1 * var(--bp-focus-width));
  }

  .date-picker__day--disabled {
    color: var(--bp-color-text-muted);
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Sizes */
  .date-picker--sm .date-picker__input {
    padding: var(--bp-spacing-xs) var(--bp-spacing-sm);
    padding-right: var(--bp-spacing-xl);
    font-size: var(--bp-font-size-sm);
  }

  .date-picker--sm .date-picker__indicator {
    right: var(--bp-spacing-xs);
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  .date-picker--sm .date-picker__clear {
    right: var(--bp-spacing-xl);
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  .date-picker--lg .date-picker__input {
    padding: var(--bp-spacing-md) var(--bp-spacing-lg);
    padding-right: var(--bp-spacing-24);
    font-size: var(--bp-font-size-lg);
  }

  .date-picker--lg .date-picker__indicator {
    right: var(--bp-spacing-md);
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
  }

  .date-picker--lg .date-picker__clear {
    right: var(--bp-spacing-24);
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
  }

  /* States */
  .date-picker--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;
