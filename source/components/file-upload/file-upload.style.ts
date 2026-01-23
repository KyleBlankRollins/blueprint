import { css } from 'lit';

export const fileUploadStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .file-upload {
    font-family: var(--bp-font-family);
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-md);
  }

  /* Hidden file input - standard sr-only pattern */
  input[type='file'] {
    position: absolute;
    width: var(--bp-spacing-0-5);
    height: var(--bp-spacing-0-5);
    padding: var(--bp-spacing-0);
    margin: calc(var(--bp-spacing-0-5) * -1);
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Visually hidden but accessible - standard sr-only pattern */
  .visually-hidden {
    position: absolute;
    width: var(--bp-spacing-0-5);
    height: var(--bp-spacing-0-5);
    padding: var(--bp-spacing-0);
    margin: calc(var(--bp-spacing-0-5) * -1);
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Dropzone */
  .file-upload__dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--bp-spacing-sm);
    padding: var(--bp-spacing-xl);
    border: var(--bp-focus-width) dashed var(--bp-color-border);
    border-radius: var(--bp-border-radius-lg);
    background-color: var(--bp-color-surface);
    cursor: pointer;
    transition:
      border-color var(--bp-transition-fast),
      background-color var(--bp-transition-fast);
    text-align: center;
  }

  .file-upload__dropzone:hover:not(.file-upload__dropzone--disabled) {
    border-color: var(--bp-color-primary);
    background-color: var(--bp-color-surface-elevated);
  }

  .file-upload__dropzone:focus-visible {
    outline: 2px solid var(--bp-color-focus);
    outline-offset: 2px;
    border-color: var(--bp-color-primary);
  }

  .file-upload__dropzone:active:not(.file-upload__dropzone--disabled) {
    transform: scale(0.995);
  }

  /* Drag over state */
  .file-upload__dropzone--drag-over {
    border-color: var(--bp-color-primary);
    background-color: var(--bp-color-surface-elevated);
    border-style: solid;
  }

  /* Disabled state */
  .file-upload__dropzone--disabled {
    opacity: var(--bp-opacity-disabled);
    cursor: not-allowed;
    background-color: var(--bp-color-surface-subdued);
  }

  /* Icon */
  .file-upload__icon {
    width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    color: var(--bp-color-text-muted);
    transition: color var(--bp-transition-fast);
  }

  .file-upload__dropzone:hover:not(.file-upload__dropzone--disabled)
    .file-upload__icon,
  .file-upload__dropzone--drag-over .file-upload__icon {
    color: var(--bp-color-primary);
  }

  /* Label */
  .file-upload__label {
    font-size: var(--bp-font-size-base);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-normal);
  }

  /* Description */
  .file-upload__description {
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text-muted);
    line-height: var(--bp-line-height-normal);
  }

  /* Variants */
  .file-upload__dropzone--success {
    border-color: var(--bp-color-success);
  }

  .file-upload__dropzone--success:hover:not(.file-upload__dropzone--disabled) {
    border-color: var(--bp-color-success);
  }

  .file-upload__dropzone--error {
    border-color: var(--bp-color-error);
  }

  .file-upload__dropzone--error:hover:not(.file-upload__dropzone--disabled) {
    border-color: var(--bp-color-error);
  }

  .file-upload__dropzone--warning {
    border-color: var(--bp-color-warning);
  }

  .file-upload__dropzone--warning:hover:not(.file-upload__dropzone--disabled) {
    border-color: var(--bp-color-warning);
  }

  /* Size variants */
  .file-upload__dropzone--small {
    padding: var(--bp-spacing-lg);
    gap: var(--bp-spacing-xs);
  }

  .file-upload__dropzone--small .file-upload__icon {
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
  }

  .file-upload__dropzone--small .file-upload__label {
    font-size: var(--bp-font-size-sm);
  }

  .file-upload__dropzone--small .file-upload__description {
    font-size: var(--bp-font-size-xs);
  }

  .file-upload__dropzone--medium {
    padding: var(--bp-spacing-xl);
  }

  .file-upload__dropzone--large {
    padding: var(--bp-spacing-2xl);
    gap: var(--bp-spacing-md);
  }

  .file-upload__dropzone--large .file-upload__icon {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
  }

  .file-upload__dropzone--large .file-upload__label {
    font-size: var(--bp-font-size-lg);
  }

  /* File list */
  .file-upload__file-list {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-sm);
  }

  .file-upload__file-item {
    display: flex;
    align-items: center;
    gap: var(--bp-spacing-md);
    padding: var(--bp-spacing-md);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast),
      transform var(--bp-transition-fast);
  }

  .file-upload__file-item:hover {
    background-color: var(--bp-color-surface-elevated);
    border-color: var(--bp-color-border-strong);
  }

  .file-upload__file-item:active {
    transform: scale(0.99);
  }

  /* File preview */
  .file-upload__preview {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
    object-fit: cover;
    border-radius: var(--bp-border-radius-sm);
    flex-shrink: 0;
  }

  .file-upload__file-icon {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--bp-color-text-muted);
    transition: color var(--bp-transition-fast);
  }

  .file-upload__file-icon svg {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  /* File info */
  .file-upload__file-info {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-2xs);
    flex: 1;
    min-width: 0;
  }

  .file-upload__file-name {
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: var(--bp-line-height-normal);
  }

  .file-upload__file-size {
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-text-muted);
    line-height: var(--bp-line-height-normal);
  }

  /* Remove button */
  .file-upload__remove-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
    padding: 0;
    border: none;
    background: transparent;
    border-radius: var(--bp-border-radius-sm);
    color: var(--bp-color-text-muted);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
    flex-shrink: 0;
  }

  .file-upload__remove-button:hover:not(:disabled) {
    background-color: var(--bp-color-error);
    color: var(--bp-color-text-inverse);
  }

  .file-upload__remove-button:focus-visible {
    outline: 2px solid var(--bp-color-focus);
    outline-offset: 2px;
  }

  .file-upload__remove-button:disabled {
    cursor: not-allowed;
    opacity: var(--bp-opacity-disabled);
  }

  .file-upload__remove-button svg {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
  }

  /* Message */
  .file-upload__message {
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text-muted);
    line-height: var(--bp-line-height-normal);
  }

  .file-upload__message--success {
    color: var(--bp-color-success);
  }

  .file-upload__message--error {
    color: var(--bp-color-error);
  }

  .file-upload__message--warning {
    color: var(--bp-color-warning);
  }
`;
