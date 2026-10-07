import { css } from 'lit';

export const fieldsetStyles = css`
  :host {
    display: block;
    font-family: var(--bp-font-family);
  }

  .fieldset {
    margin: 0;
    padding: 0;
    border: none;
    min-width: 0;
  }

  .fieldset__legend {
    padding: 0;
    margin-bottom: var(--bp-spacing-xs);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text);
  }

  .fieldset__legend[hidden] {
    display: none;
  }

  .fieldset__required {
    color: var(--bp-color-error);
    margin-left: var(--bp-spacing-xs);
  }

  .fieldset__description {
    margin: 0 0 var(--bp-spacing-sm);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .fieldset__content {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-sm);
  }

  .fieldset--horizontal .fieldset__content {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--bp-spacing-sm) var(--bp-spacing-lg);
  }

  .fieldset__error {
    margin: var(--bp-spacing-xs) 0 0;
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-error);
  }
`;
