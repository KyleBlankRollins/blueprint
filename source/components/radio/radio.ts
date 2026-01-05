import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { radioStyles } from './radio.style.js';

export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * A form radio input with label support and group functionality.
 *
 * @element bp-radio
 *
 * @property {boolean} checked - Whether the radio is checked
 * @property {boolean} disabled - Whether the radio is disabled
 * @property {boolean} required - Whether the radio is required
 * @property {string} name - The name of the radio for form submission and grouping
 * @property {string} value - The value of the radio for form submission
 * @property {RadioSize} size - The size of the radio
 * @property {boolean} error - Whether the radio has an error state
 *
 * @slot - The radio label text
 *
 * @fires bp-change - Fired when the checked state changes
 * @fires bp-focus - Fired when the radio receives focus
 * @fires bp-blur - Fired when the radio loses focus
 *
 * @csspart radio - The radio container
 * @csspart input - The native radio input element
 * @csspart circle - The visual circle indicator
 * @csspart label - The label text container
 */
@customElement('bp-radio')
export class BpRadio extends LitElement {
  @query('input[type="radio"]') declare input: HTMLInputElement;

  /**
   * Whether the radio is checked.
   */
  @property({ type: Boolean, reflect: true }) declare checked: boolean;

  /**
   * Whether the radio is disabled.
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Whether the radio is required.
   */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /**
   * The name of the radio for form submission and grouping.
   * Radios with the same name form a group where only one can be selected.
   */
  @property({ type: String, reflect: true }) declare name: string;

  /**
   * The value of the radio for form submission.
   */
  @property({ type: String }) declare value: string;

  /**
   * The size of the radio.
   */
  @property({ type: String, reflect: true }) declare size: RadioSize;

  /**
   * Whether the radio has an error state.
   */
  @property({ type: Boolean, reflect: true }) declare error: boolean;

  @state() private hasFocus = false;

  static styles = [radioStyles];

  static formAssociated = true;
  private internals: globalThis.ElementInternals | null = null;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = '';
    this.size = 'md';
    this.error = false;

    if ('attachInternals' in this) {
      this.internals = (this as HTMLElement).attachInternals();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'radio');
    this.updateAriaAttributes();
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has('checked') ||
      changedProperties.has('disabled') ||
      changedProperties.has('required') ||
      changedProperties.has('error')
    ) {
      this.updateAriaAttributes();
      this.updateFormValue();
    }
  }

  private updateAriaAttributes(): void {
    this.setAttribute('aria-checked', this.checked.toString());
    this.setAttribute('aria-disabled', this.disabled.toString());

    if (this.required) {
      this.setAttribute('aria-required', 'true');
    } else {
      this.removeAttribute('aria-required');
    }

    if (this.error) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }

  private updateFormValue(): void {
    if (!this.internals) return;

    if (this.checked) {
      this.internals.setFormValue(this.value || 'on');
    } else {
      this.internals.setFormValue(null);
    }
  }

  private handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.checked = inputElement.checked;

    // Uncheck other radios in the same group
    if (this.checked && this.name) {
      this.uncheckOtherRadios();
    }

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleFocus(): void {
    this.hasFocus = true;
    this.dispatchEvent(
      new CustomEvent('bp-focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(): void {
    this.hasFocus = false;
    this.dispatchEvent(
      new CustomEvent('bp-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClick(): void {
    if (!this.disabled) {
      this.input?.focus();
    }
  }

  private uncheckOtherRadios(): void {
    if (!this.name) return;

    // Find all radios with the same name in the document
    const root = this.getRootNode() as
      | globalThis.Document
      | globalThis.ShadowRoot;
    const radios = Array.from(
      root.querySelectorAll(`bp-radio[name="${this.name}"]`)
    ) as BpRadio[];

    radios.forEach((radio) => {
      if (radio !== this && radio.checked) {
        radio.checked = false;
      }
    });
  }

  /**
   * Sets focus on the radio.
   */
  focus(options?: globalThis.FocusOptions): void {
    this.input?.focus(options);
  }

  /**
   * Removes focus from the radio.
   */
  blur(): void {
    this.input?.blur();
  }

  /**
   * Checks if the radio satisfies its required constraint.
   */
  checkValidity(): boolean {
    return this.input?.checkValidity() ?? true;
  }

  /**
   * Checks validity and shows validation message if invalid.
   */
  reportValidity(): boolean {
    return this.input?.reportValidity() ?? true;
  }

  render() {
    const classes = [
      'radio',
      `radio--${this.size}`,
      this.disabled ? 'radio--disabled' : '',
      this.error ? 'radio--error' : '',
      this.hasFocus ? 'radio--focused' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <label class=${classes} part="radio" @click=${this.handleClick}>
        <input
          class="radio__input"
          part="input"
          type="radio"
          name=${ifDefined(this.name || undefined)}
          value=${ifDefined(this.value || undefined)}
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          aria-hidden="true"
          tabindex="-1"
        />
        <span class="radio__circle" part="circle">
          <span class="radio__circle-inner"></span>
        </span>
        <span class="radio__label" part="label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-radio': BpRadio;
  }
}
