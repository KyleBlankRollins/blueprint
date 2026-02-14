import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { textareaStyles } from './textarea.style.js';
import { debounce } from '../../utilities/debounce.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';

/**
 * Visual variant that affects the textarea border color and validation state
 */
export type TextareaVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

/**
 * Size of the textarea affecting padding, font size, and minimum height
 */
export type TextareaSize = 'sm' | 'md' | 'lg';

/**
 * Resize mode determining how users can resize the textarea
 */
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * Valid autocomplete values for textarea elements
 */
export type TextareaAutocomplete =
  | 'off'
  | 'on'
  | 'name'
  | 'email'
  | 'username'
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
  | 'organization'
  | 'organization-title';

/**
 * A multi-line text input component with support for various states and configurations.
 *
 * @fires bp-input - Dispatched when the textarea value changes (on every keystroke)
 * @fires bp-change - Dispatched when the textarea loses focus after being changed
 * @fires bp-focus - Dispatched when the textarea receives focus
 * @fires bp-blur - Dispatched when the textarea loses focus
 */
@customElement('bp-textarea')
export class BpTextarea extends LitElement {
  /** Visual variant of the textarea */
  @property({ type: String, reflect: true }) declare variant: TextareaVariant;

  /** Size of the textarea */
  @property({ type: String, reflect: true }) declare size: TextareaSize;

  /** Current value of the textarea */
  @property({ type: String, reflect: true }) declare value: string;

  /** Placeholder text shown when textarea is empty */
  @property({ type: String, reflect: true }) declare placeholder:
    | string
    | undefined;

  /** Label text displayed above the textarea */
  @property({ type: String, reflect: true }) declare label: string | undefined;

  /** Helper text displayed below the textarea */
  @property({ type: String, reflect: true }) declare helperText:
    | string
    | undefined;

  /** Error message displayed when variant is 'error' */
  @property({ type: String, reflect: true }) declare errorMessage:
    | string
    | undefined;

  /** Whether the textarea is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Whether the textarea is required */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /** Whether the textarea is readonly */
  @property({ type: Boolean, reflect: true }) declare readonly: boolean;

  /** Name attribute for form submission */
  @property({ type: String, reflect: true }) declare name: string | undefined;

  /** Number of visible text rows */
  @property({ type: Number, reflect: true }) declare rows: number | undefined;

  /** Number of visible text columns */
  @property({ type: Number, reflect: true }) declare cols: number | undefined;

  /** Maximum number of characters allowed */
  @property({ type: Number, reflect: true }) declare maxlength:
    | number
    | undefined;

  /** Minimum number of characters required */
  @property({ type: Number, reflect: true }) declare minlength:
    | number
    | undefined;

  /** How the textarea can be resized by the user */
  @property({ type: String, reflect: true }) declare resize: TextareaResize;

  /** Autocomplete attribute for browser suggestions */
  @property({ type: String, reflect: true }) declare autocomplete:
    | TextareaAutocomplete
    | undefined;

  /** Whether to enable spellcheck */
  @property({ converter: booleanConverter, reflect: true })
  declare spellcheck: boolean;

  /** Wrap attribute for text wrapping behavior */
  @property({ type: String, reflect: true }) declare wrap:
    | 'soft'
    | 'hard'
    | undefined;

  @query('textarea') private textareaElement?: HTMLTextAreaElement;

  private debouncedDispatchInput = debounce(
    (value: string, originalEvent: InputEvent) => {
      this.dispatchEvent(
        new CustomEvent('bp-input', {
          detail: { value, originalEvent },
          bubbles: true,
          composed: true,
        })
      );
    },
    150
  );

  static styles = [textareaStyles];

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'md';
    this.value = '';
    this.disabled = false;
    this.required = false;
    this.readonly = false;
    this.resize = 'vertical';
    this.spellcheck = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.debouncedDispatchInput.cancel();
  }

  private handleInput(event: InputEvent): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.debouncedDispatchInput(this.value, event);
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleFocus(event: FocusEvent): void {
    this.dispatchEvent(
      new CustomEvent('bp-focus', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(event: FocusEvent): void {
    this.debouncedDispatchInput.flush();
    this.dispatchEvent(
      new CustomEvent('bp-blur', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Focuses the textarea element
   */
  public focus(): void {
    this.textareaElement?.focus();
  }

  /**
   * Blurs the textarea element
   */
  public blur(): void {
    this.textareaElement?.blur();
  }

  /**
   * Selects the text in the textarea
   */
  public select(): void {
    this.textareaElement?.select();
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
      <div class="textarea-wrapper">
        ${this.label
          ? html`
              <label class="textarea-label" for="textarea">
                ${this.label}
                ${this.required
                  ? html`<span class="textarea-required">*</span>`
                  : ''}
              </label>
            `
          : ''}

        <textarea
          part="textarea"
          id="textarea"
          class="textarea textarea--${this.variant} textarea--${this
            .size} textarea--resize-${this.resize}"
          .value=${live(this.value)}
          placeholder=${ifDefined(this.placeholder)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          name=${ifDefined(this.name)}
          rows=${ifDefined(this.rows)}
          cols=${ifDefined(this.cols)}
          maxlength=${ifDefined(this.maxlength)}
          minlength=${ifDefined(this.minlength)}
          autocomplete=${ifDefined(this.autocomplete)}
          ?spellcheck=${this.spellcheck}
          wrap=${ifDefined(this.wrap)}
          aria-invalid=${this.variant === 'error' ? 'true' : 'false'}
          aria-describedby=${this.messageId || nothing}
          @input=${this.handleInput}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        ></textarea>

        ${showError
          ? html`
              <div
                id="error-message"
                class="textarea-message textarea-message--error"
                role="alert"
              >
                ${this.errorMessage}
              </div>
            `
          : ''}
        ${showHelper
          ? html`<div id="helper-text" class="textarea-message">
              ${this.helperText}
            </div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-textarea': BpTextarea;
  }
}
