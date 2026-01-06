import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './select.js';
import type { BpSelect } from './select.js';

describe('bp-select', () => {
  let element: BpSelect;

  beforeEach(() => {
    element = document.createElement('bp-select');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-select');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render select trigger to DOM', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe('');
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('Select an option');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.size).toBe('medium');
  });

  // Properties
  it('should set property: value', async () => {
    element.value = 'option1';
    await element.updateComplete;
    expect(element.value).toBe('option1');
  });

  it('should set property: name', async () => {
    element.name = 'test-select';
    await element.updateComplete;
    expect(element.name).toBe('test-select');
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Choose one';
    await element.updateComplete;
    expect(element.placeholder).toBe('Choose one');
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
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
  });

  // Attributes
  it('should reflect value attribute to DOM', async () => {
    element.value = 'test';
    await element.updateComplete;
    expect(element.getAttribute('value')).toBe('test');
  });

  it('should reflect disabled attribute to DOM', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('should reflect required attribute to DOM', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.hasAttribute('required')).toBe(true);
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'small';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('small');
  });

  // Events
  it('should emit bp-change event when option is selected', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test Option';
    element.appendChild(option);
    await element.updateComplete;

    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const optionElement = element.shadowRoot?.querySelector(
      '.select-option'
    ) as HTMLElement;
    optionElement?.click();

    expect(changeHandler).toHaveBeenCalled();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe('test');
  });

  // Slots
  it('should render slotted options', async () => {
    const option1 = document.createElement('option');
    option1.value = '1';
    option1.textContent = 'Option 1';
    const option2 = document.createElement('option');
    option2.value = '2';
    option2.textContent = 'Option 2';

    element.appendChild(option1);
    element.appendChild(option2);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose select part for styling', async () => {
    await element.updateComplete;
    const select = element.shadowRoot?.querySelector('[part="container"]');
    expect(select).toBeTruthy();
  });

  it('should expose trigger part for styling', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
    expect(trigger).toBeTruthy();
  });

  it('should expose value part for styling', async () => {
    await element.updateComplete;
    const value = element.shadowRoot?.querySelector('[part="display"]');
    expect(value).toBeTruthy();
  });

  it('should expose icon part for styling', async () => {
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
  });

  it('should expose dropdown part when open', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('[part="dropdown"]');
    expect(dropdown).toBeTruthy();
  });

  it('should expose option part for styling', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test';
    element.appendChild(option);

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const optionElement = element.shadowRoot?.querySelector('[part="option"]');
    expect(optionElement).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'small';
    await element.updateComplete;

    const select = element.shadowRoot?.querySelector('.select--small');
    expect(select).toBeTruthy();
  });

  it('should apply medium size styles', async () => {
    element.size = 'medium';
    await element.updateComplete;

    const select = element.shadowRoot?.querySelector('.select--medium');
    expect(select).toBeTruthy();
  });

  it('should apply large size styles', async () => {
    element.size = 'large';
    await element.updateComplete;

    const select = element.shadowRoot?.querySelector('.select--large');
    expect(select).toBeTruthy();
  });

  // Variants
  // Note: Select component does not have variants (e.g., primary/secondary)
  // It uses sizes (small/medium/large) for visual variations

  // Interactions
  it('should toggle dropdown on click', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;

    trigger?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeTruthy();

    trigger?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeFalsy();
  });

  it('should open dropdown on Enter key press', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    const event = new window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });

    trigger?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeTruthy();
  });

  it('should open dropdown on Space key press', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    const event = new window.KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
    });

    trigger?.dispatchEvent(event);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeTruthy();
  });

  it('should close dropdown on Escape key press', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;

    trigger?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeTruthy();

    const escapeEvent = new window.KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    trigger?.dispatchEvent(escapeEvent);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeFalsy();
  });

  it('should not open dropdown when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.select-dropdown')).toBeFalsy();
  });

  // Accessibility
  it('should have role combobox on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.getAttribute('role')).toBe('combobox');
  });

  it('should have aria-expanded attribute', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.hasAttribute('aria-expanded')).toBe(true);
  });

  it('should update aria-expanded when opened', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    trigger?.click();
    await element.updateComplete;
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have aria-required when required', async () => {
    element.required = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.getAttribute('aria-required')).toBe('true');
  });

  it('should have tabindex 0 when enabled', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('0');
  });

  it('should have tabindex -1 when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.select-trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have role listbox on dropdown', async () => {
    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const dropdown = element.shadowRoot?.querySelector('.select-dropdown');
    expect(dropdown?.getAttribute('role')).toBe('listbox');
  });

  it('should have role option on options', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test';
    element.appendChild(option);

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const optionElement = element.shadowRoot?.querySelector('.select-option');
    expect(optionElement?.getAttribute('role')).toBe('option');
  });

  it('should have aria-selected on options', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test';
    element.appendChild(option);
    element.value = 'test';

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const optionElement = element.shadowRoot?.querySelector('.select-option');
    expect(optionElement?.getAttribute('aria-selected')).toBe('true');
  });

  // Form integration
  it('should render hidden input for form integration', async () => {
    await element.updateComplete;
    const hiddenInput = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    );
    expect(hiddenInput).toBeTruthy();
  });

  it('should set name on hidden input', async () => {
    element.name = 'test-field';
    await element.updateComplete;
    const hiddenInput = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    );
    expect(hiddenInput?.getAttribute('name')).toBe('test-field');
  });

  it('should display placeholder when no value selected', async () => {
    element.placeholder = 'Pick one';
    await element.updateComplete;

    const displayValue = element.shadowRoot?.querySelector('.select-value');
    expect(displayValue?.textContent).toBe('Pick one');
  });

  it('should display selected option label', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test Label';
    element.appendChild(option);

    const trigger = element.shadowRoot?.querySelector(
      '.select-trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    const optionElement = element.shadowRoot?.querySelector(
      '.select-option'
    ) as HTMLElement;
    optionElement?.click();
    await element.updateComplete;

    const displayValue = element.shadowRoot?.querySelector('.select-value');
    expect(displayValue?.textContent).toBe('Test Label');
  });
});
