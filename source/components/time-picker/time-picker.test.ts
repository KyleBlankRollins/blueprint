import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './time-picker.js';
import type { BpTimePicker } from './time-picker.js';

describe('bp-time-picker', () => {
  let element: BpTimePicker;

  beforeEach(() => {
    element = document.createElement('bp-time-picker');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-time-picker');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render time picker element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const picker = element.shadowRoot?.querySelector('.time-picker');
    expect(picker).toBeTruthy();
  });

  it('should render input element', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input');
    expect(input).toBeTruthy();
  });

  it('should render dropdown when opened', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should render time options in dropdown', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll('.time-option');
    expect(options!.length).toBeGreaterThan(0);
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe('');
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('Select time');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.size).toBe('md');
    expect(element.format).toBe('12');
    expect(element.step).toBe(15);
  });

  // Properties
  it('should set property: value', async () => {
    element.value = '10:30 AM';
    await element.updateComplete;
    expect(element.value).toBe('10:30 AM');
  });

  it('should set property: name', async () => {
    element.name = 'appointment-time';
    await element.updateComplete;
    expect(element.name).toBe('appointment-time');
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Choose time';
    await element.updateComplete;
    expect(element.placeholder).toBe('Choose time');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
  });

  it('should set property: format', async () => {
    element.format = '24';
    await element.updateComplete;
    expect(element.format).toBe('24');
  });

  it('should set property: step', async () => {
    element.step = 30;
    await element.updateComplete;
    expect(element.step).toBe(30);
  });

  // Events
  it('should emit bp-change event when time selected', async () => {
    let eventFired = false;
    let eventDetail: unknown;

    element.addEventListener('bp-change', (e) => {
      eventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector(
      '.time-option'
    ) as HTMLElement;
    firstOption.click();
    await element.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventDetail.value).toBeDefined();
  });

  it('should emit bp-change event with time details', async () => {
    let eventDetail: { hours?: number; minutes?: number; value?: string };

    element.addEventListener('bp-change', (e) => {
      eventDetail = (e as CustomEvent).detail;
    });

    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector(
      '.time-option'
    ) as HTMLElement;
    firstOption.click();
    await element.updateComplete;

    expect(eventDetail.hours).toBeDefined();
    expect(eventDetail.minutes).toBeDefined();
  });

  it('should emit bp-change event when cleared', async () => {
    element.value = '10:30 AM';
    await element.updateComplete;

    let eventFired = false;
    let eventDetail: { value?: string };

    element.addEventListener('bp-change', (e) => {
      eventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    const clearButton = element.shadowRoot?.querySelector(
      '.clear-button'
    ) as HTMLElement;
    clearButton.click();
    await element.updateComplete;

    expect(eventFired).toBe(true);
    expect(eventDetail.value).toBe('');
  });

  // Attributes
  it('should reflect disabled attribute to DOM', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'sm';
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.time-picker');
    expect(picker?.classList.contains('time-picker--sm')).toBe(true);
  });

  it('should reflect value attribute to DOM', async () => {
    element.value = '2:00 PM';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.value).toBe('2:00 PM');
  });

  // CSS Parts
  it('should expose input-wrapper part for styling', () => {
    const wrapper = element.shadowRoot?.querySelector('[part="input-wrapper"]');
    expect(wrapper).toBeTruthy();
  });

  it('should expose input part for styling', () => {
    const input = element.shadowRoot?.querySelector('[part="input"]');
    expect(input).toBeTruthy();
  });

  it('should expose dropdown part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('[part="dropdown"]');
    expect(dropdown).toBeTruthy();
  });

  it('should expose clear-button part for styling', async () => {
    element.value = '10:30 AM';
    await element.updateComplete;

    const clearButton = element.shadowRoot?.querySelector(
      '[part="clear-button"]'
    );
    expect(clearButton).toBeTruthy();
  });

  it('should expose icon part for styling', () => {
    const icon = element.shadowRoot?.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
  });

  it('should expose time-option part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const option = element.shadowRoot?.querySelector('[part="time-option"]');
    expect(option).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.time-picker');
    expect(picker?.classList.contains('time-picker--sm')).toBe(true);
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.time-picker');
    expect(picker?.classList.contains('time-picker--lg')).toBe(true);
  });

  it('should apply medium size styles by default', async () => {
    await element.updateComplete;

    const picker = element.shadowRoot?.querySelector('.time-picker');
    expect(picker?.classList.contains('time-picker--md')).toBe(true);
  });

  // Interactions
  it('should open dropdown on input click', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should close dropdown after time selection', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector(
      '.time-option'
    ) as HTMLElement;
    firstOption.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown).toBeNull();
  });

  it('should display selected time in input field', async () => {
    element.value = '3:45 PM';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.value).toBe('3:45 PM');
  });

  it('should clear value when clicking clear button', async () => {
    element.value = '10:30 AM';
    await element.updateComplete;

    const clearButton = element.shadowRoot?.querySelector(
      '.clear-button'
    ) as HTMLElement;
    clearButton.click();
    await element.updateComplete;

    expect(element.value).toBe('');
  });

  it('should highlight selected time in dropdown', async () => {
    element.value = '12:00 PM';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const selectedOption = element.shadowRoot?.querySelector(
      '.time-option--selected'
    );
    expect(selectedOption).toBeTruthy();
  });

  it('should format time based on format property', async () => {
    element.format = '24';
    element.value = '14:30';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.value).toBe('14:30');
  });

  it('should generate time options based on step', async () => {
    element.step = 30;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll('.time-option');
    // 24 hours * 2 (30-minute intervals) = 48 options for 12-hour format
    expect(options!.length).toBe(48);
  });

  it('should close dropdown on Escape key', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector(
      '.input-wrapper'
    ) as HTMLElement;
    const event = new globalThis.KeyboardEvent('keydown', { key: 'Escape' });
    wrapper.dispatchEvent(event);
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown).toBeNull();
  });

  it('should open dropdown on ArrowDown key', async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(
      '.input-wrapper'
    ) as HTMLElement;

    const event = new globalThis.KeyboardEvent('keydown', { key: 'ArrowDown' });
    wrapper.dispatchEvent(event);
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  // Accessibility
  it('should have aria-haspopup attribute', () => {
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should have aria-expanded attribute reflecting dropdown state', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-expanded')).toBe('false');

    input.click();
    await element.updateComplete;

    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role listbox on dropdown', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.dropdown');
    expect(dropdown?.getAttribute('role')).toBe('listbox');
  });

  it('should have role option on time options', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const option = element.shadowRoot?.querySelector('.time-option');
    expect(option?.getAttribute('role')).toBe('option');
  });

  it('should have aria-selected on selected time option', async () => {
    element.value = '10:00 AM';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const selectedOption = element.shadowRoot?.querySelector(
      '.time-option--selected'
    );
    expect(selectedOption?.getAttribute('aria-selected')).toBe('true');
  });

  it('should have clear button with descriptive aria-label', async () => {
    element.value = '10:30 AM';
    await element.updateComplete;

    const clearButton = element.shadowRoot?.querySelector(
      '.clear-button'
    ) as HTMLElement;
    expect(clearButton.getAttribute('aria-label')).toBe('Clear time');
  });
});
