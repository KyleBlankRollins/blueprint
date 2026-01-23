import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { timePickerStyles } from './time-picker.style.js';

export type TimePickerSize = 'small' | 'medium' | 'large';
export type TimeFormat = '12' | '24';

/**
 * A time picker component with dropdown time selection.
 *
 * @element bp-time-picker
 *
 * @fires bp-change - Fired when the selected time changes
 *
 * @csspart input-wrapper - The input wrapper container
 * @csspart input - The text input field
 * @csspart icon - The clock icon indicator
 * @csspart clear-button - The clear button
 * @csspart dropdown - The time options dropdown
 * @csspart time-option - Individual time option in dropdown
 */
@customElement('bp-time-picker')
export class BpTimePicker extends LitElement {
  @property({ type: String }) declare value: string;
  @property({ type: String }) declare name: string;
  @property({ type: String }) declare label: string;
  @property({ type: String }) declare placeholder: string;
  @property({ type: Boolean }) declare disabled: boolean;
  @property({ type: Boolean }) declare required: boolean;
  @property({ type: String }) declare size: TimePickerSize;
  @property({ type: String }) declare format: TimeFormat;
  @property({ type: Number }) declare step: number;

  @state() private isOpen = false;
  @state() private focusedHour: number | null = null;
  @state() private focusedMinute: number | null = null;

  static styles = [timePickerStyles];

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.label = '';
    this.placeholder = 'Select time';
    this.disabled = false;
    this.required = false;
    this.size = 'medium';
    this.format = '12';
    this.step = 15; // 15-minute intervals by default
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.contains(e.target as globalThis.Node)) {
      this.isOpen = false;
    }
  };

  private toggleDropdown = () => {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      // Add document click handler on next tick to avoid immediate close
      globalThis.setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick);
      }, 0);
      // Scroll to selected option
      this.updateComplete.then(() => {
        const selected = this.shadowRoot?.querySelector(
          '.time-option--selected'
        ) as HTMLElement;
        if (selected) {
          selected.scrollIntoView({ block: 'nearest' });
        }
      });
    } else {
      document.removeEventListener('click', this.handleDocumentClick);
    }
  };

  private parseTime(
    timeString: string
  ): { hours: number; minutes: number } | null {
    if (!timeString) return null;

    const match = timeString.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (this.format === '12' && period) {
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return { hours, minutes };
  }

  private formatTime(hours: number, minutes: number): string {
    if (this.format === '24') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  private getDisplayValue(): string {
    if (!this.value) return '';

    const parsed = this.parseTime(this.value);
    if (!parsed) return this.value;

    return this.formatTime(parsed.hours, parsed.minutes);
  }

  private generateTimeOptions(): Array<{
    hours: number;
    minutes: number;
    display: string;
  }> {
    const options: Array<{ hours: number; minutes: number; display: string }> =
      [];
    const maxHours = this.format === '24' ? 23 : 11;

    for (let h = 0; h <= maxHours; h++) {
      for (let m = 0; m < 60; m += this.step) {
        const hours = this.format === '24' ? h : h;
        options.push({
          hours,
          minutes: m,
          display: this.formatTime(hours, m),
        });
      }
    }

    // For 12-hour format, add PM times
    if (this.format === '12') {
      for (let h = 0; h <= 11; h++) {
        for (let m = 0; m < 60; m += this.step) {
          const hours = h + 12;
          options.push({
            hours,
            minutes: m,
            display: this.formatTime(hours, m),
          });
        }
      }
    }

    return options;
  }

  private handleTimeSelect(hours: number, minutes: number) {
    const newValue = this.formatTime(hours, minutes);
    const oldValue = this.value;

    this.value = newValue;
    this.isOpen = false;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value: newValue, hours, minutes, previousValue: oldValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClear(e: MouseEvent) {
    e.stopPropagation();
    const oldValue = this.value;
    this.value = '';

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: '',
          hours: null,
          minutes: null,
          previousValue: oldValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeyDown(e: Event) {
    const event = e as globalThis.KeyboardEvent;
    if (!this.isOpen) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        this.isOpen = true;
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        // Navigate through time options
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.focusedHour !== null && this.focusedMinute !== null) {
          this.handleTimeSelect(this.focusedHour, this.focusedMinute);
        }
        break;
    }
  }

  private isSelected(hours: number, minutes: number): boolean {
    const parsed = this.parseTime(this.value);
    if (!parsed) return false;
    return parsed.hours === hours && parsed.minutes === minutes;
  }

  render() {
    const displayValue = this.getDisplayValue();
    const timeOptions = this.generateTimeOptions();

    return html`
      <div class="time-picker time-picker--${this.size}">
        <div
          class="input-wrapper"
          part="input-wrapper"
          @keydown=${this.handleKeyDown}
        >
          <input
            type="text"
            class="input"
            part="input"
            .value=${displayValue}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            readonly
            aria-haspopup="listbox"
            aria-expanded=${this.isOpen}
            aria-disabled=${this.disabled}
            aria-label=${this.label || this.placeholder || 'Time picker'}
            @click=${this.toggleDropdown}
          />
          ${this.value && !this.disabled
            ? html`
                <button
                  type="button"
                  class="clear-button"
                  part="clear-button"
                  @click=${this.handleClear}
                  aria-label="Clear time"
                  tabindex="-1"
                >
                  ✕
                </button>
              `
            : ''}
          <div class="icon" part="icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 4V8L10.5 10.5M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        ${this.isOpen
          ? html`
              <div class="dropdown" part="dropdown" role="listbox">
                ${timeOptions.map(
                  (option) => html`
                    <div
                      class=${classMap({
                        'time-option': true,
                        'time-option--selected': this.isSelected(
                          option.hours,
                          option.minutes
                        ),
                      })}
                      part="time-option"
                      role="option"
                      aria-selected=${this.isSelected(
                        option.hours,
                        option.minutes
                      )}
                      @click=${() =>
                        this.handleTimeSelect(option.hours, option.minutes)}
                    >
                      ${option.display}
                    </div>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-time-picker': BpTimePicker;
  }
}
