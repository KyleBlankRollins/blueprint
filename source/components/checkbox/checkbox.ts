import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { checkboxStyles } from './checkbox.style.js';

export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * A form checkbox input with label support and multiple states.
 *
 * @element bp-checkbox
 *
 * @property {boolean} checked - Whether the checkbox is checked
 * @property {boolean} indeterminate - Indeterminate state (partial selection)
 * @property {boolean} disabled - Whether the checkbox is disabled
 * @property {boolean} required - Whether the checkbox is required
 * @property {string} name - The name for form submission
 * @property {string} value - The value for form submission
 * @property {CheckboxSize} size - The size of the checkbox
 * @property {boolean} error - Whether the checkbox has an error state
 *
 * @slot - The checkbox label text
 *
 * @fires bp-change - Fired when the checked state changes
 * @fires bp-focus - Fired when the checkbox receives focus
 * @fires bp-blur - Fired when the checkbox loses focus
 *
 * @csspart checkbox - The checkbox container
 * @csspart input - The native checkbox input element
 * @csspart checkmark - The visual checkmark indicator
 * @csspart label - The label text container
 */
@customElement('bp-checkbox')
export class BpCheckbox extends LitElement {
  @query('input[type="checkbox"]') declare input: HTMLInputElement;

  /**
   * Whether the checkbox is checked.
   */
  @property({ type: Boolean, reflect: true }) declare checked: boolean;

  /**
   * Whether the checkbox is in an indeterminate state.
   * This is a visual-only state for "partially checked" appearance.
   */
  @property({ type: Boolean, reflect: true }) declare indeterminate: boolean;

  /**
   * Whether the checkbox is disabled.
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Whether the checkbox is required.
   */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /**
   * The name of the checkbox for form submission.
   */
  @property({ type: String, reflect: true }) declare name: string;

  /**
   * The value of the checkbox for form submission.
   */
  @property({ type: String }) declare value: string;

  /**
   * The size of the checkbox.
   */
  @property({ type: String, reflect: true }) declare size: CheckboxSize;

  /**
   * Whether the checkbox has an error state.
   */
  @property({ type: Boolean, reflect: true }) declare error: boolean;

  @state() private hasFocus = false;

  static styles = [checkboxStyles];

  static formAssociated = true;
  // eslint-disable-next-line no-undef
  private internals: ElementInternals | null = null;

  constructor() {
    super();
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = 'on';
    this.size = 'md';
    this.error = false;

    // attachInternals may not be available in all environments (e.g., test)
    if (typeof this.attachInternals === 'function') {
      this.internals = this.attachInternals();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateFormValue();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('checked')) {
      this.updateFormValue();
      if (this.input) {
        this.input.checked = this.checked;
      }
    }

    if (changedProperties.has('indeterminate') && this.input) {
      this.input.indeterminate = this.indeterminate;
    }
  }

  private updateFormValue() {
    const value = this.checked ? this.value : null;
    this.internals?.setFormValue(value);
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new CustomEvent('bp-focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new CustomEvent('bp-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Sets focus on the checkbox.
   */
  // eslint-disable-next-line no-undef
  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  /**
   * Removes focus from the checkbox.
   */
  blur() {
    this.input?.blur();
  }

  render() {
    const classes = [
      'checkbox',
      `checkbox--${this.size}`,
      this.checked ? 'checkbox--checked' : '',
      this.indeterminate ? 'checkbox--indeterminate' : '',
      this.disabled ? 'checkbox--disabled' : '',
      this.error ? 'checkbox--error' : '',
      this.hasFocus ? 'checkbox--focused' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <label part="checkbox" class="${classes}">
        <input
          part="input"
          type="checkbox"
          class="checkbox__input"
          .checked=${live(this.checked)}
          .indeterminate=${live(this.indeterminate)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${ifDefined(this.name || undefined)}
          value=${this.value}
          aria-checked=${this.indeterminate ? 'mixed' : this.checked}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />
        <span part="checkmark" class="checkbox__checkmark">
          ${this.indeterminate
            ? html`<svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="4"
                  y1="8"
                  x2="12"
                  y2="8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>`
            : html`<svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 4L6 11L3 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`}
        </span>
        <span part="label" class="checkbox__label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-checkbox': BpCheckbox;
  }
}
