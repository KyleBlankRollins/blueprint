import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './checkbox.js';
import type { BpCheckbox } from './checkbox.js';

describe('bp-checkbox', () => {
  let element: BpCheckbox;

  beforeEach(() => {
    element = document.createElement('bp-checkbox');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-checkbox');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render checkbox input to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const input = element.shadowRoot!.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.checked).toBe(false);
    expect(element.indeterminate).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.name).toBe('');
    expect(element.value).toBe('on');
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

  // Properties - indeterminate
  it('should set property: indeterminate', async () => {
    element.indeterminate = true;
    await element.updateComplete;
    expect(element.indeterminate).toBe(true);
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
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
    element.name = 'test-checkbox';
    await element.updateComplete;
    expect(element.name).toBe('test-checkbox');
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.name).toBe('test-checkbox');
  });

  // Properties - value
  it('should set property: value', async () => {
    element.value = 'custom-value';
    await element.updateComplete;
    expect(element.value).toBe('custom-value');
  });

  // Properties - size
  it('should set property: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--sm')).toBe(true);
  });

  it('should set property: size to lg', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--lg')).toBe(true);
  });

  // Properties - error
  it('should set property: error', async () => {
    element.error = true;
    await element.updateComplete;
    expect(element.error).toBe(true);
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--error')).toBe(true);
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

  // Slots
  it('should render slotted label content', async () => {
    element.textContent = 'Accept terms';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('.checkbox__label');
    const slot = label?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose checkbox part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="checkbox"]');
    expect(part).toBeTruthy();
  });

  it('should expose input part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="input"]');
    expect(part).toBeTruthy();
  });

  it('should expose checkmark part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot!.querySelector('[part="checkmark"]');
    expect(part).toBeTruthy();
  });

  // Sizes
  it('should apply sm size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--sm')).toBe(true);
  });

  it('should apply md size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--md')).toBe(true);
  });

  it('should apply lg size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('label');
    expect(label?.classList.contains('checkbox--lg')).toBe(true);
  });

  // Interactions
  it('should toggle checked state on click', async () => {
    await element.updateComplete;
    expect(element.checked).toBe(false);

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(element.checked).toBe(true);

    input.click();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('should clear indeterminate state when clicked', async () => {
    element.indeterminate = true;
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(element.indeterminate).toBe(false);
  });

  // Accessibility
  it('should have aria-checked attribute', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-checked')).toBe('false');

    element.checked = true;
    await element.updateComplete;
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('should have aria-checked mixed when indeterminate', async () => {
    element.indeterminate = true;
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-checked')).toBe('mixed');
  });

  it('should support keyboard navigation with focus method', async () => {
    await element.updateComplete;
    element.focus();
    await element.updateComplete;
    expect(document.activeElement).toBe(element);
  });

  // Form integration
  it('should participate in form submission', async () => {
    const form = document.createElement('form');
    element.name = 'terms';
    element.value = 'accepted';
    element.checked = true;
    form.appendChild(element);
    document.body.appendChild(form);
    await element.updateComplete;

    // Element internals should have the form value
    expect(element.checked).toBe(true);

    form.remove();
  });

  // Edge cases
  it('should not respond to clicks when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot!.querySelector(
      'input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    // Checkbox should remain unchecked
    expect(element.checked).toBe(false);
  });

  it('should handle rapid state changes', async () => {
    element.checked = true;
    element.checked = false;
    element.checked = true;
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});
