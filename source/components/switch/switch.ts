import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { switchStyles } from './switch.style.js';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * A toggle switch component for binary on/off states with form integration.
 *
 * @element bp-switch
 *
 * @fires {CustomEvent} bp-change - Fired when the checked state changes
 * @fires {CustomEvent} bp-focus - Fired when the switch receives focus
 * @fires {CustomEvent} bp-blur - Fired when the switch loses focus
 *
 * @slot - The label text for the switch
 *
 * @csspart switch - The switch container (label)
 * @csspart input - The native checkbox input element
 * @csspart track - The switch track background
 * @csspart thumb - The switch thumb/handle
 * @csspart label - The label text container
 */
@customElement('bp-switch')
export class BpSwitch extends LitElement {
  /**
   * Whether the switch is in the on (checked) position
   */
  @property({ type: Boolean, reflect: true })
  declare checked: boolean;

  /**
   * Whether the switch is disabled
   */
  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  /**
   * Whether the switch is required
   */
  @property({ type: Boolean, reflect: true })
  declare required: boolean;

  /**
   * The name attribute for form submission
   */
  @property({ type: String })
  declare name: string;

  /**
   * The value attribute for form submission
   */
  @property({ type: String })
  declare value: string;

  /**
   * The size of the switch
   */
  @property({ type: String, reflect: true })
  declare size: SwitchSize;

  /**
   * Whether the switch has an error state
   */
  @property({ type: Boolean, reflect: true })
  declare error: boolean;

  @state()
  private hasFocus = false;

  @query('input[type="checkbox"]')
  private input!: HTMLInputElement;

  static styles = [switchStyles];

  static formAssociated = true;

  private internals: ElementInternals | null = null;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = 'on';
    this.size = 'md';
    this.error = false;

    // Attach internals for form integration (with safety check for tests)
    if (typeof this.attachInternals === 'function') {
      this.internals = this.attachInternals();
    }
  }

  /**
   * Handle input change events
   */
  private handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;

    // Update form value
    if (!this.disabled && this.internals) {
      this.internals.setFormValue(this.checked ? this.value : null);
    }

    // Emit custom change event
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle focus events
   */
  private handleFocus(): void {
    this.hasFocus = true;
    this.dispatchEvent(
      new CustomEvent('bp-focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle blur events
   */
  private handleBlur(): void {
    this.hasFocus = false;
    this.dispatchEvent(
      new CustomEvent('bp-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle label click to toggle the switch
   */
  private handleLabelClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
  }

  /**
   * Sets focus on the switch.
   */

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  /**
   * Removes focus from the switch.
   */
  blur() {
    this.input?.blur();
  }

  /**
   * Lifecycle callback when properties change
   */
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('checked') && this.internals) {
      this.internals.setFormValue(this.checked ? this.value : null);
    }
  }

  render() {
    return html`
      <label
        part="switch"
        class="switch switch--${this.size} ${this.disabled
          ? 'switch--disabled'
          : ''} ${this.error ? 'switch--error' : ''} ${this.hasFocus
          ? 'switch--focus'
          : ''}"
        @click=${this.handleLabelClick}
      >
        <input
          part="input"
          type="checkbox"
          class="switch__input"
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${ifDefined(this.name || undefined)}
          value=${this.value}
          aria-checked=${this.checked ? 'true' : 'false'}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />
        <span part="track" class="switch__track">
          <span part="thumb" class="switch__thumb"></span>
        </span>
        <span part="label" class="switch__label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-switch': BpSwitch;
  }
}
