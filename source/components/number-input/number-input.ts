import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { numberInputStyles } from './number-input.style.js';

/**
 * Size variants for the number input
 */
export type NumberInputSize = 'small' | 'medium' | 'large';

/**
 * Validation variant for the number input
 */
export type NumberInputVariant = 'default' | 'success' | 'error' | 'warning';

/**
 * A number input component with increment/decrement buttons.
 *
 * @element bp-number-input
 *
 * @fires bp-input - Fired when the value changes during input
 * @fires bp-change - Fired when the value changes (on blur or button click)
 *
 * @csspart input - The native input element
 * @csspart decrement - The decrement button
 * @csspart increment - The increment button
 * @csspart label - The label element
 * @csspart message - The help/error message element
 */
@customElement('bp-number-input')
export class BpNumberInput extends LitElement {
  /**
   * Current value of the input
   */
  @property({ type: Number }) declare value: number | null;

  /**
   * Minimum allowed value
   */
  @property({ type: Number }) declare min: number | undefined;

  /**
   * Maximum allowed value
   */
  @property({ type: Number }) declare max: number | undefined;

  /**
   * Step increment for buttons and arrow keys
   */
  @property({ type: Number }) declare step: number;

  /**
   * Name attribute for form association
   */
  @property({ type: String }) declare name: string;

  /**
   * Label text for the input
   */
  @property({ type: String }) declare label: string;

  /**
   * Placeholder text when empty
   */
  @property({ type: String }) declare placeholder: string;

  /**
   * Whether the input is disabled
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Whether the input is required
   */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /**
   * Whether the input is readonly
   */
  @property({ type: Boolean, reflect: true }) declare readonly: boolean;

  /**
   * Size variant
   */
  @property({ type: String }) declare size: NumberInputSize;

  /**
   * Validation variant
   */
  @property({ type: String }) declare variant: NumberInputVariant;

  /**
   * Help or error message to display
   */
  @property({ type: String }) declare message: string;

  /**
   * Number of decimal places to display
   */
  @property({ type: Number }) declare precision: number | undefined;

  /**
   * Hide the increment/decrement buttons
   */
  @property({ type: Boolean, attribute: 'hide-buttons' })
  declare hideButtons: boolean;

  @query('input') private inputElement!: HTMLInputElement;

  static styles = [numberInputStyles];

  constructor() {
    super();
    this.value = null;
    this.min = undefined;
    this.max = undefined;
    this.step = 1;
    this.name = '';
    this.label = '';
    this.placeholder = '';
    this.disabled = false;
    this.required = false;
    this.readonly = false;
    this.size = 'medium';
    this.variant = 'default';
    this.message = '';
    this.precision = undefined;
    this.hideButtons = false;
  }

  /**
   * Check if decrement is allowed
   */
  private get canDecrement(): boolean {
    if (this.disabled || this.readonly) return false;
    if (this.value === null) return true;
    if (this.min !== undefined) return this.value > this.min;
    return true;
  }

  /**
   * Check if increment is allowed
   */
  private get canIncrement(): boolean {
    if (this.disabled || this.readonly) return false;
    if (this.value === null) return true;
    if (this.max !== undefined) return this.value < this.max;
    return true;
  }

  /**
   * Format value for display
   */
  private formatValue(value: number | null): string {
    if (value === null) return '';
    if (this.precision !== undefined) {
      return value.toFixed(this.precision);
    }
    return String(value);
  }

  /**
   * Clamp value to min/max range
   */
  private clampValue(value: number): number {
    let result = value;
    if (this.min !== undefined) result = Math.max(this.min, result);
    if (this.max !== undefined) result = Math.min(this.max, result);
    return result;
  }

  /**
   * Round value to step precision
   */
  private roundToStep(value: number): number {
    if (this.precision !== undefined) {
      const factor = Math.pow(10, this.precision);
      return Math.round(value * factor) / factor;
    }
    // Handle floating point precision for step
    const stepDecimals = (String(this.step).split('.')[1] || '').length;
    const factor = Math.pow(10, stepDecimals);
    return Math.round(value * factor) / factor;
  }

  /**
   * Update value and emit events
   */
  private updateValue(
    newValue: number | null,
    emitChange: boolean = true
  ): void {
    const oldValue = this.value;

    if (newValue !== null) {
      newValue = this.clampValue(newValue);
      newValue = this.roundToStep(newValue);
    }

    if (newValue !== oldValue) {
      this.value = newValue;

      this.dispatchEvent(
        new CustomEvent('bp-input', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );

      if (emitChange) {
        this.dispatchEvent(
          new CustomEvent('bp-change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  /**
   * Handle increment button click
   */
  private handleIncrement(): void {
    if (!this.canIncrement) return;
    const currentValue = this.value ?? this.min ?? 0;
    this.updateValue(currentValue + this.step);
  }

  /**
   * Handle decrement button click
   */
  private handleDecrement(): void {
    if (!this.canDecrement) return;
    const currentValue = this.value ?? this.max ?? 0;
    this.updateValue(currentValue - this.step);
  }

  /**
   * Handle direct input
   */
  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value.trim();

    if (inputValue === '') {
      this.updateValue(null, false);
      return;
    }

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Don't clamp during input, only on blur
      this.value = numValue;
      this.dispatchEvent(
        new CustomEvent('bp-input', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Handle blur - validate and clamp
   */
  private handleBlur(): void {
    if (this.value !== null) {
      const clampedValue = this.clampValue(this.value);
      const roundedValue = this.roundToStep(clampedValue);

      if (roundedValue !== this.value) {
        this.value = roundedValue;
      }

      // Update input display
      if (this.inputElement) {
        this.inputElement.value = this.formatValue(this.value);
      }
    }

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown(event: globalThis.KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.handleIncrement();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.handleDecrement();
        break;
      case 'PageUp':
        event.preventDefault();
        if (this.canIncrement) {
          const currentValue = this.value ?? this.min ?? 0;
          this.updateValue(currentValue + this.step * 10);
        }
        break;
      case 'PageDown':
        event.preventDefault();
        if (this.canDecrement) {
          const currentValue = this.value ?? this.max ?? 0;
          this.updateValue(currentValue - this.step * 10);
        }
        break;
      case 'Home':
        event.preventDefault();
        if (this.min !== undefined) {
          this.updateValue(this.min);
        }
        break;
      case 'End':
        event.preventDefault();
        if (this.max !== undefined) {
          this.updateValue(this.max);
        }
        break;
    }
  }

  render() {
    const wrapperClasses = {
      'number-input': true,
      [`number-input--${this.size}`]: true,
      [`number-input--${this.variant}`]: true,
      'number-input--disabled': this.disabled,
      'number-input--readonly': this.readonly,
      'number-input--hide-buttons': this.hideButtons,
    };

    const inputClasses = {
      'number-input__input': true,
      [`number-input__input--${this.variant}`]: true,
    };

    return html`
      <div class=${classMap(wrapperClasses)}>
        ${this.label
          ? html`
              <label class="number-input__label" part="label">
                ${this.label}
                ${this.required
                  ? html`<span class="number-input__required">*</span>`
                  : nothing}
              </label>
            `
          : nothing}

        <div class="number-input__container">
          ${!this.hideButtons
            ? html`
                <button
                  type="button"
                  class="number-input__button number-input__button--decrement"
                  part="decrement"
                  tabindex="-1"
                  ?disabled=${!this.canDecrement}
                  aria-label="Decrease value"
                  @click=${this.handleDecrement}
                >
                  <span class="number-input__button-icon">−</span>
                </button>
              `
            : nothing}

          <input
            type="text"
            inputmode="decimal"
            class=${classMap(inputClasses)}
            part="input"
            .value=${this.formatValue(this.value)}
            name=${this.name || nothing}
            placeholder=${this.placeholder || nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            aria-valuemin=${this.min ?? nothing}
            aria-valuemax=${this.max ?? nothing}
            aria-valuenow=${this.value ?? nothing}
            aria-invalid=${this.variant === 'error' ? 'true' : nothing}
            @input=${this.handleInput}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeyDown}
          />

          ${!this.hideButtons
            ? html`
                <button
                  type="button"
                  class="number-input__button number-input__button--increment"
                  part="increment"
                  tabindex="-1"
                  ?disabled=${!this.canIncrement}
                  aria-label="Increase value"
                  @click=${this.handleIncrement}
                >
                  <span class="number-input__button-icon">+</span>
                </button>
              `
            : nothing}
        </div>

        ${this.message
          ? html`
              <div
                class="number-input__message number-input__message--${this
                  .variant}"
                part="message"
              >
                ${this.message}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-number-input': BpNumberInput;
  }
}
