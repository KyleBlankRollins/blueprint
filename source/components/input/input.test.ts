import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './input.js';
import type { BpInput } from './input.js';

describe('bp-input', () => {
  let element: BpInput;

  beforeEach(() => {
    element = document.createElement('bp-input');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-input');
    expect(constructor).toBeDefined();
  });

  it('should have a shadow root', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).not.toBeNull();
  });

  // Rendering
  it('should render input element to DOM', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input).toBeTruthy();
  });

  // Default values
  it('should have correct default property values', () => {
    expect(element.variant).toBe('default');
    expect(element.size).toBe('md');
    expect(element.type).toBe('text');
    expect(element.value).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.readonly).toBe(false);
  });

  // Properties
  it('should update variant property reactively', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');
    const input = element.shadowRoot?.querySelector('.input--success');
    expect(input).toBeTruthy();
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const input = element.shadowRoot?.querySelector('.input--lg');
    expect(input).toBeTruthy();
  });

  it('should set property: value', async () => {
    element.value = 'test value';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should set property: readonly', async () => {
    element.readonly = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Enter text...';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.placeholder).toBe('Enter text...');
  });

  it('should set property: name', async () => {
    element.name = 'email-field';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.name).toBe('email-field');
  });

  it('should set property: autocomplete', async () => {
    element.autocomplete = 'email';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.autocomplete).toBe('email');
  });

  it('should set property: minlength', async () => {
    element.minlength = 5;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.minLength).toBe(5);
  });

  it('should set property: maxlength', async () => {
    element.maxlength = 100;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.maxLength).toBe(100);
  });

  it('should set property: pattern', async () => {
    element.pattern = '[a-z]+';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.pattern).toBe('[a-z]+');
  });

  it('should set property: inputmode', async () => {
    element.inputmode = 'numeric';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.inputMode).toBe('numeric');
  });

  it('should set property: min/max/step for number inputs', async () => {
    element.type = 'number';
    element.min = 0;
    element.max = 100;
    element.step = 5;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.step).toBe('5');
  });

  // Variants
  it('should apply default variant styles', async () => {
    element.variant = 'default';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--default');
    expect(input).toBeTruthy();
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--success');
    expect(input).toBeTruthy();
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--error');
    expect(input).toBeTruthy();
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--warning');
    expect(input).toBeTruthy();
  });

  it('should apply info variant styles', async () => {
    element.variant = 'info';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--info');
    expect(input).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--sm');
    expect(input).toBeTruthy();
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.input--lg');
    expect(input).toBeTruthy();
  });

  // Events
  it('should emit bp-input event on input', async () => {
    vi.useFakeTimers();
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const listener = vi.fn();
    element.addEventListener('bp-input', listener);

    input.value = 'test';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].detail.value).toBe('test');
    vi.useRealTimers();
  });

  it('should emit bp-change event on change', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const listener = vi.fn();
    element.addEventListener('bp-change', listener);

    input.value = 'test';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].detail.value).toBe('test');
  });

  it('should emit bp-focus event on focus', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const listener = vi.fn();
    element.addEventListener('bp-focus', listener);

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
  });

  it('should emit bp-blur event on blur', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const listener = vi.fn();
    element.addEventListener('bp-blur', listener);

    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
  });

  // Label and helper text
  it('should render label when provided', async () => {
    element.label = 'Email';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.input-label');
    expect(label?.textContent?.trim()).toContain('Email');
  });

  it('should render required asterisk when required', async () => {
    element.label = 'Email';
    element.required = true;
    await element.updateComplete;
    const required = element.shadowRoot?.querySelector('.input-required');
    expect(required?.textContent).toBe('*');
  });

  it('should render helper text', async () => {
    element.helperText = 'Enter your email address';
    await element.updateComplete;
    const helper = element.shadowRoot?.querySelector('.input-message');
    expect(helper?.textContent?.trim()).toBe('Enter your email address');
  });

  it('should render error message when variant is error', async () => {
    element.variant = 'error';
    element.errorMessage = 'Invalid email';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.input-message--error');
    expect(error?.textContent?.trim()).toBe('Invalid email');
  });

  it('should prioritize error message over helper text', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    element.helperText = 'Helper';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.input-message--error');
    const helper = element.shadowRoot?.querySelector('#helper-text');
    expect(error).toBeTruthy();
    expect(helper).toBeFalsy();
  });

  // Accessibility
  it('should have aria-invalid="true" when variant is error', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should have aria-invalid="false" when variant is not error', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('should link error message with aria-describedby', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('error-message');
  });

  it('should link helper text with aria-describedby', async () => {
    element.helperText = 'Help!';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('helper-text');
  });

  it('should not render aria-describedby when no message', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('should have role="alert" on error message', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.input-message--error');
    expect(error?.getAttribute('role')).toBe('alert');
  });

  // CSS Parts
  it('should expose input part', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('[part="input"]');
    expect(input).toBeTruthy();
  });

  // Public methods
  it('should focus the input when focus() is called', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    element.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should blur the input when blur() is called', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const blurSpy = vi.spyOn(input, 'blur');
    element.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it('should select the text when select() is called', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    const selectSpy = vi.spyOn(input, 'select');
    element.select();
    expect(selectSpy).toHaveBeenCalled();
  });

  // Input types
  it('should support different input types', async () => {
    element.type = 'email';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  // Value synchronization
  it('should sync value when changed programmatically', async () => {
    element.value = 'initial';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input.value).toBe('initial');

    element.value = 'updated';
    await element.updateComplete;
    expect(input.value).toBe('updated');
  });
});
