import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { datePickerStyles } from './date-picker.style.js';

export type DatePickerSize = 'sm' | 'md' | 'lg';

/**
 * A calendar-based date picker component.
 *
 * @element bp-date-picker
 *
 * @fires bp-change - Fired when the selected date changes
 *
 * @csspart control - The outer container
 * @csspart input - The text input field
 * @csspart indicator - The calendar icon
 * @csspart clear-button - The clear button
 * @csspart calendar - The calendar dropdown
 * @csspart header - The calendar header with navigation
 * @csspart nav-button - Month/year navigation buttons
 * @csspart month-year - Month and year display
 * @csspart weekday - Day of week header cell
 * @csspart day - Individual day cell
 */
@customElement('bp-date-picker')
export class BpDatePicker extends LitElement {
  @property({ type: String, reflect: true }) declare value: string;
  @property({ type: String }) declare name: string;
  @property({ type: String }) declare label: string;
  @property({ type: String }) declare placeholder: string;
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;
  @property({ type: Boolean, reflect: true }) declare required: boolean;
  @property({ type: String, reflect: true }) declare size: DatePickerSize;
  @property({ type: String }) declare min: string;
  @property({ type: String }) declare max: string;
  @property({ type: String, attribute: 'first-day-of-week' })
  declare firstDayOfWeek: '0' | '1';

  @state() private isOpen = false;
  @state() private displayMonth = new Date().getMonth();
  @state() private displayYear = new Date().getFullYear();
  @state() private focusedDate: Date | null = null;

  static styles = [datePickerStyles];

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.label = '';
    this.placeholder = 'Select date...';
    this.disabled = false;
    this.required = false;
    this.size = 'md';
    this.min = '';
    this.max = '';
    this.firstDayOfWeek = '0';
  }

  private handleInputClick() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  private handlePreviousMonth() {
    if (this.displayMonth === 0) {
      this.displayMonth = 11;
      this.displayYear--;
    } else {
      this.displayMonth--;
    }
  }

  private handleNextMonth() {
    if (this.displayMonth === 11) {
      this.displayMonth = 0;
      this.displayYear++;
    } else {
      this.displayMonth++;
    }
  }

  private handleDateSelect(date: Date) {
    const previousValue = this.value;
    this.value = this.formatDate(date);
    this.isOpen = false;
    this.focusedDate = null;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: this.value,
          previousValue,
          date,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClear(e: Event) {
    e.stopPropagation();
    const previousValue = this.value;
    this.value = '';
    this.focusedDate = null;

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: '',
          previousValue,
          date: null,
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
        this.focusedDate = this.getSelectedDate() || this.getTodayDate();
      }
      return;
    }

    const currentFocus =
      this.focusedDate || this.getSelectedDate() || this.getTodayDate();

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        this.focusedDate = null;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.focusedDate = this.addDays(currentFocus, -1);
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.focusedDate = this.addDays(currentFocus, 1);
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusedDate = this.addDays(currentFocus, -7);
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusedDate = this.addDays(currentFocus, 7);
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'Home':
        event.preventDefault();
        this.focusedDate = new Date(
          currentFocus.getFullYear(),
          currentFocus.getMonth(),
          1
        );
        break;

      case 'End':
        event.preventDefault();
        this.focusedDate = new Date(
          currentFocus.getFullYear(),
          currentFocus.getMonth() + 1,
          0
        );
        break;

      case 'PageUp':
        event.preventDefault();
        this.focusedDate = this.addMonths(
          currentFocus,
          event.shiftKey ? -12 : -1
        );
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'PageDown':
        event.preventDefault();
        this.focusedDate = this.addMonths(
          currentFocus,
          event.shiftKey ? 12 : 1
        );
        this.updateDisplayMonth(this.focusedDate);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.focusedDate && !this.isDateDisabled(this.focusedDate)) {
          this.handleDateSelect(this.focusedDate);
        }
        break;
    }
  }

  private updateDisplayMonth(date: Date) {
    this.displayMonth = date.getMonth();
    this.displayYear = date.getFullYear();
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(value: string): Date | null {
    if (!value) return null;
    // Parse YYYY-MM-DD format in local timezone to avoid UTC offset issues
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      date.setHours(0, 0, 0, 0);
      return date;
    }
    // Fallback for other formats
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      console.warn(
        `bp-date-picker: Invalid date format "${value}". Expected YYYY-MM-DD.`
      );
      return null;
    }
    return date;
  }

  private getSelectedDate(): Date | null {
    return this.parseDate(this.value);
  }

  private getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isDateDisabled(date: Date): boolean {
    if (this.min) {
      const minDate = this.parseDate(this.min);
      if (minDate && date < minDate) return true;
    }
    if (this.max) {
      const maxDate = this.parseDate(this.max);
      if (maxDate && date > maxDate) return true;
    }
    return false;
  }

  private getCalendarDays(): Date[] {
    const CALENDAR_GRID_SIZE = 42; // 6 weeks × 7 days for consistent grid
    const firstDay = new Date(this.displayYear, this.displayMonth, 1);
    const lastDay = new Date(this.displayYear, this.displayMonth + 1, 0);

    const startDayOfWeek = this.firstDayOfWeek === '1' ? 1 : 0;
    let dayOfWeek = firstDay.getDay() - startDayOfWeek;
    if (dayOfWeek < 0) dayOfWeek += 7;

    const days: Date[] = [];

    // Add previous month's days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.displayYear, this.displayMonth, -i);
      days.push(date);
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(this.displayYear, this.displayMonth, i));
    }

    // Add next month's days to complete the grid
    const remainingDays = CALENDAR_GRID_SIZE - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(this.displayYear, this.displayMonth + 1, i));
    }

    return days;
  }

  private checkValidity(): boolean {
    // Check required validation
    if (this.required && !this.value) {
      return false;
    }
    // Check min/max validation
    if (this.value) {
      const date = this.parseDate(this.value);
      if (date && this.isDateDisabled(date)) {
        return false;
      }
    }
    return true;
  }

  private getWeekdayNames(): string[] {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (this.firstDayOfWeek === '1') {
      return [...weekdays.slice(1), weekdays[0]];
    }
    return weekdays;
  }

  private getMonthName(month: number): string {
    return new Date(2000, month, 1).toLocaleString('default', {
      month: 'long',
    });
  }

  private getFormattedValue(): string {
    const selectedDate = this.getSelectedDate();
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString();
  }

  render() {
    const selectedDate = this.getSelectedDate();
    const today = this.getTodayDate();
    const calendarDays = this.getCalendarDays();
    const weekdays = this.getWeekdayNames();
    const hasValue = !!this.value;

    const datePickerClasses = {
      'date-picker': true,
      'date-picker--open': this.isOpen,
      'date-picker--disabled': this.disabled,
      [`date-picker--${this.size}`]: true,
    };

    return html`
      <div class=${classMap(datePickerClasses)} part="control">
        <div class="date-picker__input-wrapper">
          <input
            type="text"
            class="date-picker__input"
            part="input"
            .value=${this.getFormattedValue()}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            readonly
            @click=${this.handleInputClick}
            @keydown=${this.handleKeyDown}
            role="combobox"
            aria-haspopup="grid"
            aria-expanded=${this.isOpen}
            aria-disabled=${this.disabled}
            aria-label=${this.label || this.placeholder || 'Date picker'}
          />
          ${hasValue && !this.disabled
            ? html`
                <button
                  type="button"
                  class="date-picker__clear"
                  part="clear-button"
                  @click=${this.handleClear}
                  aria-label="Clear date"
                  tabindex="-1"
                >
                  ✕
                </button>
              `
            : ''}
          <div class="date-picker__indicator" part="indicator">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 2V4M11 2V4M3 6H13M4 4H12C12.5523 4 13 4.44772 13 5V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V5C3 4.44772 3.44772 4 4 4Z"
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
              <div class="date-picker__calendar" part="calendar" role="grid">
                <div class="date-picker__header" part="header">
                  <button
                    type="button"
                    class="date-picker__nav-button"
                    part="nav-button"
                    @click=${this.handlePreviousMonth}
                    aria-label="Previous month"
                    tabindex="-1"
                  >
                    ‹
                  </button>
                  <div class="date-picker__month-year" part="month-year">
                    ${this.getMonthName(this.displayMonth)} ${this.displayYear}
                  </div>
                  <button
                    type="button"
                    class="date-picker__nav-button"
                    part="nav-button"
                    @click=${this.handleNextMonth}
                    aria-label="Next month"
                    tabindex="-1"
                  >
                    ›
                  </button>
                </div>

                <div class="date-picker__weekdays">
                  ${weekdays.map(
                    (day) => html`
                      <div
                        class="date-picker__weekday"
                        part="weekday"
                        role="columnheader"
                      >
                        ${day}
                      </div>
                    `
                  )}
                </div>

                <div class="date-picker__days">
                  ${calendarDays.map((date) => {
                    const isCurrentMonth =
                      date.getMonth() === this.displayMonth;
                    const isSelected =
                      selectedDate && this.isSameDay(date, selectedDate);
                    const isToday = this.isSameDay(date, today);
                    const isFocused =
                      this.focusedDate &&
                      this.isSameDay(date, this.focusedDate);
                    const isDisabled = this.isDateDisabled(date);

                    const dayClasses = {
                      'date-picker__day': true,
                      'date-picker__day--other-month': !isCurrentMonth,
                      'date-picker__day--selected': isSelected,
                      'date-picker__day--today': isToday,
                      'date-picker__day--focused': isFocused,
                      'date-picker__day--disabled': isDisabled,
                    };

                    return html`
                      <button
                        type="button"
                        class=${classMap(dayClasses)}
                        part="day"
                        @click=${() =>
                          !isDisabled && this.handleDateSelect(date)}
                        ?disabled=${isDisabled}
                        tabindex="-1"
                        role="gridcell"
                        aria-selected=${isSelected}
                        aria-label=${date.toLocaleDateString()}
                      >
                        ${date.getDate()}
                      </button>
                    `;
                  })}
                </div>
              </div>
            `
          : ''}
        ${this.name
          ? html`
              <input type="hidden" name=${this.name} .value=${this.value} />
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-date-picker': BpDatePicker;
  }
}
