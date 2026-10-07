import { css } from 'lit';

export const radioGroupStyles = css`
  :host {
    display: block;
    font-family: var(--bp-font-family);
  }

  .radio-group__label {
    margin-bottom: var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
  }

  .radio-group__required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
  }

  .radio-group__description {
    margin: 0 0 var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .radio-group__options {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-sm);
  }

  .radio-group--horizontal .radio-group__options {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--bp-spacing-sm) var(--bp-spacing-lg);
  }

  .radio-group__error {
    margin: var(--bp-spacing-xs) 0 0;
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-error);
  }
`;
