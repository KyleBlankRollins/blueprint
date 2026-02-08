import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './date-picker.js';
import type { BpDatePicker } from './date-picker.js';

describe('bp-date-picker', () => {
  let element: BpDatePicker;

  beforeEach(() => {
    element = document.createElement('bp-date-picker');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-date-picker');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render date picker element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const control = element.shadowRoot?.querySelector('.date-picker');
    expect(control).toBeTruthy();
  });

  it('should render calendar when opened', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const calendar = element.shadowRoot?.querySelector(
      '.date-picker__calendar'
    );
    expect(calendar).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe('');
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('Select date...');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.size).toBe('md');
    expect(element.min).toBe('');
    expect(element.max).toBe('');
    expect(element.firstDayOfWeek).toBe('0');
  });

  // Properties
  it('should set property: placeholder', async () => {
    element.placeholder = 'Choose a date';
    await element.updateComplete;
    expect(element.placeholder).toBe('Choose a date');
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.getAttribute('placeholder')).toBe('Choose a date');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const picker = element.shadowRoot?.querySelector('.date-picker');
    expect(picker?.classList.contains('date-picker--lg')).toBe(true);
  });

  // Events
  it('should emit bp-change event when date selected', async () => {
    await element.updateComplete;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    // Open calendar
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    // Click on a date
    const dayButtons =
      element.shadowRoot?.querySelectorAll('.date-picker__day');
    const firstCurrentMonthDay = Array.from(dayButtons || []).find(
      (btn) => !btn.classList.contains('date-picker__day--other-month')
    ) as HTMLElement;
    firstCurrentMonthDay?.click();
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(changeEvent!.detail.value).toBeTruthy();
  });

  it('should emit bp-change event with previous value', async () => {
    element.value = '2026-01-01';
    await element.updateComplete;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dayButtons =
      element.shadowRoot?.querySelectorAll('.date-picker__day');
    const firstCurrentMonthDay = Array.from(dayButtons || []).find(
      (btn) => !btn.classList.contains('date-picker__day--other-month')
    ) as HTMLElement;
    firstCurrentMonthDay?.click();
    await element.updateComplete;

    expect(changeEvent!.detail.previousValue).toBe('2026-01-01');
  });

  it('should emit bp-change event when cleared', async () => {
    element.value = '2026-01-21';
    await element.updateComplete;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    const clearBtn = element.shadowRoot?.querySelector(
      '.date-picker__clear'
    ) as HTMLElement;
    clearBtn.click();
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(changeEvent!.detail.value).toBe('');
  });

  it('should dispatch bp-change with bubbles and composed flags', async () => {
    await element.updateComplete;

    let capturedEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      capturedEvent = e as CustomEvent;
    });

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dayButtons =
      element.shadowRoot?.querySelectorAll('.date-picker__day');
    const firstCurrentMonthDay = Array.from(dayButtons || []).find(
      (btn) => !btn.classList.contains('date-picker__day--other-month')
    ) as HTMLElement;
    firstCurrentMonthDay?.click();
    await element.updateComplete;

    expect(capturedEvent!.bubbles).toBe(true);
    expect(capturedEvent!.composed).toBe(true);
  });

  // CSS Parts
  it('should expose control part for styling', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('[part~="control"]');
    expect(control).toBeTruthy();
  });

  it('should expose input part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('[part~="input"]');
    expect(input).toBeTruthy();
  });

  it('should expose calendar part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const calendar = element.shadowRoot?.querySelector('[part~="calendar"]');
    expect(calendar).toBeTruthy();
  });

  it('should expose clear-button part for styling', async () => {
    element.value = '2026-01-21';
    await element.updateComplete;
    const clearBtn = element.shadowRoot?.querySelector(
      '[part~="clear-button"]'
    );
    expect(clearBtn).toBeTruthy();
  });

  it('should expose header part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('[part~="header"]');
    expect(header).toBeTruthy();
  });

  it('should expose nav-button part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const navBtn = element.shadowRoot?.querySelector('[part~="nav-button"]');
    expect(navBtn).toBeTruthy();
  });

  it('should expose day part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const day = element.shadowRoot?.querySelector('[part~="day"]');
    expect(day).toBeTruthy();
  });

  // Sizes
  it('should apply size variant classes', async () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;
      const picker = element.shadowRoot?.querySelector('.date-picker');
      expect(picker?.classList.contains(`date-picker--${size}`)).toBe(true);
    }
  });

  // Interactions
  it('should open calendar on input click', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;

    input.click();
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.date-picker');
    expect(picker?.classList.contains('date-picker--open')).toBe(true);
  });

  it('should close calendar after date selection', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;

    input.click();
    await element.updateComplete;

    const dayButtons =
      element.shadowRoot?.querySelectorAll('.date-picker__day');
    const firstCurrentMonthDay = Array.from(dayButtons || []).find(
      (btn) => !btn.classList.contains('date-picker__day--other-month')
    ) as HTMLElement;
    firstCurrentMonthDay?.click();
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.date-picker');
    expect(picker?.classList.contains('date-picker--open')).toBe(false);
  });

  it('should navigate to previous month when clicking previous button', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const currentMonth = element.shadowRoot?.querySelector(
      '.date-picker__month-year'
    )?.textContent;
    const prevBtn = element.shadowRoot?.querySelectorAll(
      '.date-picker__nav-button'
    )[0] as HTMLElement;
    prevBtn.click();
    await element.updateComplete;

    const newMonth = element.shadowRoot?.querySelector(
      '.date-picker__month-year'
    )?.textContent;
    expect(newMonth).not.toBe(currentMonth);
  });

  it('should navigate to next month when clicking next button', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const currentMonth = element.shadowRoot?.querySelector(
      '.date-picker__month-year'
    )?.textContent;
    const nextBtn = element.shadowRoot?.querySelectorAll(
      '.date-picker__nav-button'
    )[1] as HTMLElement;
    nextBtn.click();
    await element.updateComplete;

    const newMonth = element.shadowRoot?.querySelector(
      '.date-picker__month-year'
    )?.textContent;
    expect(newMonth).not.toBe(currentMonth);
  });

  it('should display selected date in input field', async () => {
    element.value = '2026-01-21';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;
    expect(input.value).toBeTruthy();
    expect(input.value).toContain('2026');
  });

  it('should clear value when clicking clear button', async () => {
    element.value = '2026-01-21';
    await element.updateComplete;

    const clearBtn = element.shadowRoot?.querySelector(
      '.date-picker__clear'
    ) as HTMLElement;
    clearBtn.click();
    await element.updateComplete;

    expect(element.value).toBe('');
  });

  it('should highlight today date', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const todayCell = element.shadowRoot?.querySelector(
      '.date-picker__day--today'
    );
    expect(todayCell).toBeTruthy();
  });

  it('should highlight selected date', async () => {
    const today = new Date();
    element.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const selectedCell = element.shadowRoot?.querySelector(
      '.date-picker__day--selected'
    );
    expect(selectedCell).toBeTruthy();
  });

  it('should disable dates before min date', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    element.min = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const disabledDays = element.shadowRoot?.querySelectorAll(
      '.date-picker__day--disabled'
    );
    expect(disabledDays && disabledDays.length > 0).toBe(true);
  });

  it('should disable dates after max date', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    element.max = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const disabledDays = element.shadowRoot?.querySelectorAll(
      '.date-picker__day--disabled'
    );
    expect(disabledDays && disabledDays.length > 0).toBe(true);
  });

  it('should display weekdays starting with Sunday by default', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const firstWeekday = element.shadowRoot?.querySelector(
      '.date-picker__weekday'
    );
    expect(firstWeekday?.textContent?.trim()).toBe('Sun');
  });

  it('should display weekdays starting with Monday when firstDayOfWeek is 1', async () => {
    element.firstDayOfWeek = '1';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const firstWeekday = element.shadowRoot?.querySelector(
      '.date-picker__weekday'
    );
    expect(firstWeekday?.textContent?.trim()).toBe('Mon');
  });

  it('should close calendar on Escape key', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;

    input.click();
    await element.updateComplete;
    expect(
      element.shadowRoot
        ?.querySelector('.date-picker')
        ?.classList.contains('date-picker--open')
    ).toBe(true);

    const escapeEvent = new window.KeyboardEvent('keydown', { key: 'Escape' });
    input.dispatchEvent(escapeEvent);
    await element.updateComplete;

    expect(
      element.shadowRoot
        ?.querySelector('.date-picker')
        ?.classList.contains('date-picker--open')
    ).toBe(false);
  });

  it('should open calendar on ArrowDown key', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;

    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    expect(
      element.shadowRoot
        ?.querySelector('.date-picker')
        ?.classList.contains('date-picker--open')
    ).toBe(true);
  });

  // Accessibility
  it('should have aria-haspopup attribute', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.getAttribute('aria-haspopup')).toBe('grid');
  });

  it('should have aria-expanded attribute reflecting calendar state', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;

    expect(input.getAttribute('aria-expanded')).toBe('false');

    input.click();
    await element.updateComplete;

    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role combobox on input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.date-picker__input');
    expect(input?.getAttribute('role')).toBe('combobox');
  });

  it('should have role grid on calendar', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const calendar = element.shadowRoot?.querySelector(
      '.date-picker__calendar'
    );
    expect(calendar?.getAttribute('role')).toBe('grid');
  });

  it('should have role columnheader on weekday cells', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const weekday = element.shadowRoot?.querySelector('.date-picker__weekday');
    expect(weekday?.getAttribute('role')).toBe('columnheader');
  });

  it('should have role gridcell on day cells', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const day = element.shadowRoot?.querySelector('.date-picker__day');
    expect(day?.getAttribute('role')).toBe('gridcell');
  });

  it('should have aria-selected on selected day', async () => {
    const today = new Date();
    element.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const selectedDay = element.shadowRoot?.querySelector(
      '.date-picker__day--selected'
    );
    expect(selectedDay?.getAttribute('aria-selected')).toBe('true');
  });

  it('should have clear button with descriptive aria-label', async () => {
    element.value = '2026-01-21';
    await element.updateComplete;
    const clearBtn = element.shadowRoot?.querySelector('.date-picker__clear');
    expect(clearBtn?.getAttribute('aria-label')).toBe('Clear date');
  });

  it('should support keyboard navigation with arrow keys', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;

    // Open calendar
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    // Check calendar opened
    expect(
      element.shadowRoot
        ?.querySelector('.date-picker')
        ?.classList.contains('date-picker--open')
    ).toBe(true);

    // Navigate with arrow keys (test ArrowRight)
    const rightEvent = new window.KeyboardEvent('keydown', {
      key: 'ArrowRight',
    });
    input.dispatchEvent(rightEvent);
    await element.updateComplete;

    // Focused day should exist
    const focusedDay = element.shadowRoot?.querySelector(
      '.date-picker__day--focused'
    );
    expect(focusedDay).toBeTruthy();
  });

  it('should select focused date on Enter key', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.date-picker__input'
    ) as HTMLInputElement;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    // Open and focus on today
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    // Select with Enter
    const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(element.value).toBeTruthy();
  });
});
