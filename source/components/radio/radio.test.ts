import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './radio.js';
import type { BpRadio } from './radio.js';

describe('bp-radio', () => {
  let element: BpRadio;

  beforeEach(() => {
    element = document.createElement('bp-radio');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-radio');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render radio input to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const input = element.shadowRoot!.querySelector('input[type="radio"]');
    expect(input).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.name).toBe('');
    expect(element.value).toBe('');
    expect(element.size).toBe('md');
    expect(element.error).toBe(false);
  });

  // Properties - checked
  it('should set property: checked', async () => {
    element.checked = true;
    await element.updateComplete;
    expect(element.checked).toBe(true);
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('should set property: checked to false', async () => {
    element.checked = true;
    await element.updateComplete;
    element.checked = false;
    await element.updateComplete;
    expect(element.checked).toBe(false);
  });

  // Properties - disabled
  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  // Properties - required
  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  // Properties - name
  it('should set property: name', async () => {
    element.name = 'test-radio';
    await element.updateComplete;
    expect(element.name).toBe('test-radio');
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.name).toBe('test-radio');
  });

  // Properties - value
  it('should set property: value', async () => {
    element.value = 'custom-value';
    await element.updateComplete;
    expect(element.value).toBe('custom-value');
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.value).toBe('custom-value');
  });

  // Properties - size
  it('should set property: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--sm')).toBe(true);
  });

  it('should set property: size to lg', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--lg')).toBe(true);
  });

  // Properties - error
  it('should set property: error', async () => {
    element.error = true;
    await element.updateComplete;
    expect(element.error).toBe(true);
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--error')).toBe(true);
  });

  // Attributes
  it('should reflect checked attribute to DOM', async () => {
    element.checked = true;
    await element.updateComplete;
    expect(element.hasAttribute('checked')).toBe(true);
  });

  it('should reflect disabled attribute to DOM', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('lg');
  });

  // Events
  it('should emit bp-change event when checked state changes', async () => {
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(changeHandler).toHaveBeenCalled();
    expect(element.checked).toBe(true);
  });

  it('should emit bp-focus event when focused', async () => {
    const focusHandler = vi.fn();
    element.addEventListener('bp-focus', focusHandler);
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.focus();
    await element.updateComplete;

    expect(focusHandler).toHaveBeenCalled();
  });

  it('should emit bp-blur event when blurred', async () => {
    const blurHandler = vi.fn();
    element.addEventListener('bp-blur', blurHandler);
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.focus();
    input.blur();
    await element.updateComplete;

    expect(blurHandler).toHaveBeenCalled();
  });

  it('should emit bp-change event with correct detail', async () => {
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);
    element.value = 'option1';
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(changeHandler).toHaveBeenCalledTimes(1);
    const event = changeHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.checked).toBe(true);
    expect(event.detail.value).toBe('option1');
  });

  // Slots
  it('should render slotted label content', async () => {
    element.textContent = 'Option A';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('.radio__label');
    const slot = label?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose radio part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="radio"]');
    expect(part).toBeTruthy();
  });

  it('should expose input part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="input"]');
    expect(part).toBeTruthy();
  });

  it('should expose circle part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="circle"]');
    expect(part).toBeTruthy();
  });

  it('should expose label part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="label"]');
    expect(part).toBeTruthy();
  });

  // Sizes
  it('should apply sm size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--sm')).toBe(true);
  });

  it('should apply md size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--md')).toBe(true);
  });

  it('should apply lg size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('radio--lg')).toBe(true);
  });

  // Interactions
  it('should focus input when label is clicked', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    const label = element.shadowRoot!.querySelector('label') as HTMLElement;
    label.click();
    await element.updateComplete;

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should not focus when disabled and clicked', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    const label = element.shadowRoot!.querySelector('label') as HTMLElement;
    label.click();
    await element.updateComplete;

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should uncheck other radios in same group when checked', async () => {
    // Create a group of radios
    const radio1 = document.createElement('bp-radio') as BpRadio;
    const radio2 = document.createElement('bp-radio') as BpRadio;
    const radio3 = document.createElement('bp-radio') as BpRadio;

    radio1.name = 'group1';
    radio2.name = 'group1';
    radio3.name = 'group1';

    document.body.appendChild(radio1);
    document.body.appendChild(radio2);
    document.body.appendChild(radio3);

    await radio1.updateComplete;
    await radio2.updateComplete;
    await radio3.updateComplete;

    // Check radio1
    radio1.checked = true;
    await radio1.updateComplete;

    // Check radio2 - should uncheck radio1
    const input2 = radio2.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input2.click();
    await radio2.updateComplete;
    await radio1.updateComplete;

    expect(radio2.checked).toBe(true);
    expect(radio1.checked).toBe(false);

    // Cleanup
    radio1.remove();
    radio2.remove();
    radio3.remove();
  });

  // Accessibility
  it('should have role="radio" attribute', async () => {
    await element.updateComplete;
    expect(element.getAttribute('role')).toBe('radio');
  });

  it('should have aria-checked attribute', async () => {
    element.checked = false;
    await element.updateComplete;
    expect(element.getAttribute('aria-checked')).toBe('false');

    element.checked = true;
    await element.updateComplete;
    expect(element.getAttribute('aria-checked')).toBe('true');
  });

  it('should have aria-disabled attribute when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have aria-required attribute when required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.getAttribute('aria-required')).toBe('true');

    element.required = false;
    await element.updateComplete;
    expect(element.hasAttribute('aria-required')).toBe(false);
  });

  // Public Methods
  it('should support focus() method', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    element.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should support blur() method', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    const blurSpy = vi.spyOn(input, 'blur');

    element.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it('should support checkValidity() method', async () => {
    await element.updateComplete;
    const result = element.checkValidity();
    expect(typeof result).toBe('boolean');
  });

  it('should support reportValidity() method', async () => {
    await element.updateComplete;
    const result = element.reportValidity();
    expect(typeof result).toBe('boolean');
  });
});
