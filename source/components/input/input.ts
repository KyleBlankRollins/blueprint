import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { inputStyles } from './input.style.js';

export type InputVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

export type InputModeType =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search';

export type AutocompleteType =
  | 'on'
  | 'off'
  | 'name'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'tel'
  | 'url'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level1'
  | 'address-level2'
  | 'address-level3'
  | 'address-level4'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-extension'
  | 'organization'
  | 'organization-title';

@customElement('bp-input')
export class BpInput extends LitElement {
  @property({ type: String, reflect: true }) variant: InputVariant = 'default';
  @property({ type: String, reflect: true }) size: InputSize = 'md';
  @property({ type: String, reflect: true }) type: InputType = 'text';
  @property({ type: String, reflect: true }) value: string = '';
  @property({ type: String, reflect: true }) placeholder?: string;
  @property({ type: String, reflect: true }) label?: string;
  @property({ type: String, reflect: true }) helperText?: string;
  @property({ type: String, reflect: true }) errorMessage?: string;
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) readonly: boolean = false;
  @property({ type: String, reflect: true }) name?: string;
  @property({ type: String, reflect: true }) autocomplete?: AutocompleteType;
  @property({ type: Number, reflect: true }) minlength?: number;
  @property({ type: Number, reflect: true }) maxlength?: number;
  @property({ type: String, reflect: true }) pattern?: string;
  @property({ type: Number, reflect: true }) step?: number;
  @property({ type: Number, reflect: true }) min?: number;
  @property({ type: Number, reflect: true }) max?: number;
  @property({ type: String, reflect: true }) inputmode?: InputModeType;

  @query('input') private inputElement?: HTMLInputElement;

  static styles = [inputStyles];

  private handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent('bp-input', {
        detail: { value: this.value, originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value: this.value, originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleFocus(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent('bp-focus', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent('bp-blur', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Focuses the input element
   */
  public focus() {
    this.inputElement?.focus();
  }

  /**
   * Blurs the input element
   */
  public blur() {
    this.inputElement?.blur();
  }

  /**
   * Selects the text in the input
   */
  public select() {
    this.inputElement?.select();
  }

  private get messageId(): string {
    const showError = this.variant === 'error' && this.errorMessage;
    const showHelper = this.helperText && !showError;
    if (showError) return 'error-message';
    if (showHelper) return 'helper-text';
    return '';
  }

  render() {
    const showError = this.variant === 'error' && this.errorMessage;
    const showHelper = this.helperText && !showError;

    return html`
      <div class="input-wrapper">
        ${this.label
          ? html`
              <label class="input-label" for="input">
                ${this.label}
                ${this.required
                  ? html`<span class="input-required">*</span>`
                  : ''}
              </label>
            `
          : ''}

        <input
          part="input"
          id="input"
          class="input input--${this.variant} input--${this.size}"
          type=${this.type}
          .value=${live(this.value)}
          placeholder=${ifDefined(this.placeholder)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          name=${ifDefined(this.name)}
          autocomplete=${ifDefined(this.autocomplete)}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          pattern=${ifDefined(this.pattern)}
          step=${ifDefined(this.step)}
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          inputmode=${ifDefined(this.inputmode)}
          aria-invalid=${this.variant === 'error' ? 'true' : 'false'}
          aria-describedby=${this.messageId || nothing}
          @input=${this.handleInput}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />

        ${showError
          ? html`
              <div
                id="error-message"
                class="input-message input-message--error"
                role="alert"
              >
                ${this.errorMessage}
              </div>
            `
          : ''}
        ${showHelper
          ? html`<div id="helper-text" class="input-message">
              ${this.helperText}
            </div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-input': BpInput;
  }
}
