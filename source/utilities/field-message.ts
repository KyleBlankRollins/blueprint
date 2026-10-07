import { css, html, nothing, type TemplateResult } from 'lit';

/**
 * Help and error text under a form control.
 *
 * Every Blueprint control takes the same two properties:
 *
 * - `helperText`: a hint shown under the control.
 * - `errorMessage`: when set, the control is invalid. The message replaces
 *   the hint, is announced (`role="alert"`), and the control gets
 *   `aria-invalid="true"` and an error border.
 *
 * The rendered element is referenced from the control's focusable element
 * with `aria-describedby`, using the ids below.
 */
export const HELPER_TEXT_ID = 'helper-text';
export const ERROR_MESSAGE_ID = 'error-message';

export interface FieldMessageOptions {
  helperText?: string | null;
  errorMessage?: string | null;
  /**
   * Treat the control as invalid even without a message, e.g. for
   * `variant="error"` or a boolean `error` flag.
   */
  invalid?: boolean;
}

export interface FieldMessageState {
  /** The control should show its error styling and `aria-invalid="true"` */
  invalid: boolean;
  /** Id to put in the control's `aria-describedby`, if any */
  describedBy: string | undefined;
  showError: boolean;
  showHelper: boolean;
}

export function fieldMessageState(
  options: FieldMessageOptions
): FieldMessageState {
  const showError = Boolean(options.errorMessage);
  const showHelper = Boolean(options.helperText) && !showError;
  return {
    invalid: showError || Boolean(options.invalid),
    describedBy: showError
      ? ERROR_MESSAGE_ID
      : showHelper
        ? HELPER_TEXT_ID
        : undefined,
    showError,
    showHelper,
  };
}

/**
 * Render the help or error text. `extraParts` adds part names for
 * backwards compatibility (e.g. `message` on Number Input).
 */
export function renderFieldMessage(
  options: FieldMessageOptions,
  extraParts = ''
): TemplateResult | typeof nothing {
  const { showError, showHelper } = fieldMessageState(options);
  const extra = extraParts ? ` ${extraParts}` : '';
  if (showError) {
    return html`<div
      id=${ERROR_MESSAGE_ID}
      class="field-message field-message--error"
      part="error-message${extra}"
      role="alert"
    >
      ${options.errorMessage}
    </div>`;
  }
  if (showHelper) {
    return html`<div
      id=${HELPER_TEXT_ID}
      class="field-message"
      part="helper-text${extra}"
    >
      ${options.helperText}
    </div>`;
  }
  return nothing;
}

/** Styles for the help and error text; add to a control's `styles`. */
export const fieldMessageStyles = css`
  .field-message {
    margin-top: var(--bp-spacing-xs);
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-normal);
    color: var(--bp-color-text-muted);
  }

  .field-message--error {
    color: var(--bp-color-error);
  }
`;
