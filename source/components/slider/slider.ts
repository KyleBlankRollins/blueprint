import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { sliderStyles } from './slider.style.js';

/**
 * Size variants for the slider
 */
export type SliderSize = 'small' | 'medium' | 'large';

/**
 * A slider component for selecting numeric values within a range.
 *
 * @element bp-slider
 *
 * @fires bp-input - Fired continuously while dragging
 * @fires bp-change - Fired when the value changes (after interaction ends)
 *
 * @csspart track - The slider track element
 * @csspart fill - The filled portion of the track
 * @csspart thumb - The draggable thumb element
 * @csspart label - The label element
 * @csspart value-display - The current value display
 */
@customElement('bp-slider')
export class BpSlider extends LitElement {
  /**
   * Current value of the slider
   */
  @property({ type: Number }) declare value: number;

  /**
   * Minimum value
   */
  @property({ type: Number }) declare min: number;

  /**
   * Maximum value
   */
  @property({ type: Number }) declare max: number;

  /**
   * Step increment
   */
  @property({ type: Number }) declare step: number;

  /**
   * Name attribute for form association
   */
  @property({ type: String }) declare name: string;

  /**
   * Label text for the slider
   */
  @property({ type: String }) declare label: string;

  /**
   * Whether the slider is disabled
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Size variant
   */
  @property({ type: String }) declare size: SliderSize;

  /**
   * Whether to show the current value
   */
  @property({ type: Boolean, attribute: 'show-value' })
  declare showValue: boolean;

  /**
   * Whether to show tick marks at step intervals
   */
  @property({ type: Boolean, attribute: 'show-ticks' })
  declare showTicks: boolean;

  /**
   * Format function for displaying the value
   */
  @property({ attribute: false }) declare formatValue: (
    value: number
  ) => string;

  /**
   * Whether the thumb is currently being dragged
   */
  @state() private isDragging = false;

  @query('.slider__thumb') private thumbElement!: HTMLElement;
  @query('.slider__track') private trackElement!: HTMLElement;

  static styles = [sliderStyles];

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.name = '';
    this.label = '';
    this.disabled = false;
    this.size = 'medium';
    this.showValue = false;
    this.showTicks = false;
    this.formatValue = (value: number) => String(value);
  }

  /**
   * Calculate the percentage position of the current value
   */
  private get percentage(): number {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.value - this.min) / range) * 100;
  }

  /**
   * Get tick positions based on step
   */
  private get tickPositions(): number[] {
    if (!this.showTicks) return [];
    const ticks: number[] = [];
    const range = this.max - this.min;
    const numTicks = Math.floor(range / this.step);

    // Limit to reasonable number of ticks
    if (numTicks > 20) return [];

    for (let i = 0; i <= numTicks; i++) {
      ticks.push(((i * this.step) / range) * 100);
    }
    return ticks;
  }

  /**
   * Clamp value to min/max and round to step
   */
  private clampValue(rawValue: number): number {
    // Round to nearest step
    const steppedValue =
      Math.round((rawValue - this.min) / this.step) * this.step + this.min;
    // Clamp to range
    return Math.max(this.min, Math.min(this.max, steppedValue));
  }

  /**
   * Update value from a position on the track
   */
  private updateValueFromPosition(clientX: number): void {
    if (!this.trackElement || this.disabled) return;

    const rect = this.trackElement.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const rawValue = this.min + percentage * (this.max - this.min);
    const newValue = this.clampValue(rawValue);

    if (newValue !== this.value) {
      this.value = newValue;
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
   * Handle mouse down on track or thumb
   */
  private handleMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    event.preventDefault();

    this.isDragging = true;
    this.updateValueFromPosition(event.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      this.updateValueFromPosition(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.dispatchEvent(
        new CustomEvent('bp-change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * Handle touch start on track or thumb
   */
  private handleTouchStart(event: globalThis.TouchEvent): void {
    if (this.disabled) return;
    event.preventDefault();

    this.isDragging = true;
    const touch = event.touches[0];
    this.updateValueFromPosition(touch.clientX);

    const handleTouchMove = (moveEvent: globalThis.TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      this.updateValueFromPosition(moveTouch.clientX);
    };

    const handleTouchEnd = () => {
      this.isDragging = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      this.dispatchEvent(
        new CustomEvent('bp-change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown(event: globalThis.KeyboardEvent): void {
    if (this.disabled) return;

    let newValue = this.value;
    const largeStep = this.step * 10;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = this.clampValue(this.value + this.step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = this.clampValue(this.value - this.step);
        break;
      case 'PageUp':
        newValue = this.clampValue(this.value + largeStep);
        break;
      case 'PageDown':
        newValue = this.clampValue(this.value - largeStep);
        break;
      case 'Home':
        newValue = this.min;
        break;
      case 'End':
        newValue = this.max;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(
        new CustomEvent('bp-input', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
      this.dispatchEvent(
        new CustomEvent('bp-change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const wrapperClasses = {
      slider: true,
      [`slider--${this.size}`]: true,
      'slider--disabled': this.disabled,
      'slider--dragging': this.isDragging,
    };

    return html`
      <div class=${classMap(wrapperClasses)}>
        ${this.label || this.showValue
          ? html`
              <div class="slider__header">
                ${this.label
                  ? html`<label class="slider__label" part="label"
                      >${this.label}</label
                    >`
                  : nothing}
                ${this.showValue
                  ? html`<span class="slider__value" part="value-display"
                      >${this.formatValue(this.value)}</span
                    >`
                  : nothing}
              </div>
            `
          : nothing}
        <div
          class="slider__container"
          @mousedown=${this.handleMouseDown}
          @touchstart=${this.handleTouchStart}
        >
          <div class="slider__track" part="track">
            <div
              class="slider__fill"
              part="fill"
              style="width: ${this.percentage}%"
            ></div>
            ${this.showTicks
              ? html`
                  <div class="slider__ticks">
                    ${this.tickPositions.map(
                      (pos) =>
                        html`<div
                          class="slider__tick"
                          style="left: ${pos}%"
                        ></div>`
                    )}
                  </div>
                `
              : nothing}
          </div>
          <div
            class="slider__thumb"
            part="thumb"
            role="slider"
            tabindex=${this.disabled ? -1 : 0}
            aria-label=${this.label || 'Slider'}
            aria-valuemin=${this.min}
            aria-valuemax=${this.max}
            aria-valuenow=${this.value}
            aria-valuetext=${this.formatValue(this.value)}
            aria-disabled=${this.disabled}
            style="left: ${this.percentage}%"
            @keydown=${this.handleKeyDown}
          ></div>
        </div>
        ${this.name
          ? html`<input
              type="hidden"
              name=${this.name}
              .value=${String(this.value)}
            />`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-slider': BpSlider;
  }
}
