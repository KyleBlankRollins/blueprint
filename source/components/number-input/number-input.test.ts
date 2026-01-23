import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './number-input.js';
import type { BpNumberInput } from './number-input.js';

describe('bp-number-input', () => {
  let element: BpNumberInput;

  beforeEach(() => {
    element = document.createElement('bp-number-input');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-number-input');
    expect(constructor).toBeDefined();
  });

  // Default values tests
  it('should have correct default property values', async () => {
    await element.updateComplete;
    expect(element.value).toBe(null);
    expect(element.min).toBe(undefined);
    expect(element.max).toBe(undefined);
    expect(element.step).toBe(1);
    expect(element.name).toBe('');
    expect(element.label).toBe('');
    expect(element.placeholder).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.size).toBe('medium');
    expect(element.variant).toBe('default');
    expect(element.message).toBe('');
    expect(element.hideButtons).toBe(false);
  });

  // Property tests
  it('should set property: value', async () => {
    element.value = 42;
    await element.updateComplete;
    expect(element.value).toBe(42);
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.value).toBe('42');
  });

  it('should set property: name', async () => {
    element.name = 'quantity';
    await element.updateComplete;
    expect(element.name).toBe('quantity');
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.name).toBe('quantity');
  });

  it('should set property: label', async () => {
    element.label = 'Quantity';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.number-input__label');
    expect(label?.textContent?.trim()).toContain('Quantity');
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Enter amount';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.placeholder).toBe('Enter amount');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--disabled')).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    element.label = 'Required Field';
    await element.updateComplete;
    const requiredMarker = element.shadowRoot?.querySelector(
      '.number-input__required'
    );
    expect(requiredMarker).toBeTruthy();
  });

  it('should set property: readonly', async () => {
    element.readonly = true;
    await element.updateComplete;
    expect(element.readonly).toBe(true);
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.readOnly).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--large')).toBe(true);
  });

  it('should set property: variant', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.variant).toBe('error');
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--error')).toBe(true);
  });

  it('should set property: message', async () => {
    element.message = 'Enter a valid number';
    await element.updateComplete;
    const message = element.shadowRoot?.querySelector('.number-input__message');
    expect(message?.textContent?.trim()).toBe('Enter a valid number');
  });

  it('should set property: precision', async () => {
    element.precision = 2;
    element.value = 3.14159;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.value).toBe('3.14');
  });

  it('should set property: hideButtons', async () => {
    element.hideButtons = true;
    await element.updateComplete;
    const buttons = element.shadowRoot?.querySelectorAll(
      '.number-input__button'
    );
    expect(buttons?.length).toBe(0);
  });

  // Size variants
  it('should apply small size styles', async () => {
    element.size = 'small';
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--small')).toBe(true);
  });

  it('should apply medium size styles', async () => {
    element.size = 'medium';
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--medium')).toBe(true);
  });

  it('should apply large size styles', async () => {
    element.size = 'large';
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector('.number-input');
    expect(wrapper?.classList.contains('number-input--large')).toBe(true);
  });

  // Variant tests
  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.number-input__input');
    expect(input?.classList.contains('number-input__input--error')).toBe(true);
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.number-input__input');
    expect(input?.classList.contains('number-input__input--success')).toBe(
      true
    );
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.number-input__input');
    expect(input?.classList.contains('number-input__input--warning')).toBe(
      true
    );
  });

  // Event tests
  it('should emit bp-input event on value change', async () => {
    element.value = 10;
    await element.updateComplete;
    const inputHandler = vi.fn();
    element.addEventListener('bp-input', inputHandler);

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();

    expect(inputHandler).toHaveBeenCalled();
    expect(inputHandler.mock.calls[0][0].detail.value).toBe(11);
  });

  it('should emit bp-change event on button click', async () => {
    element.value = 10;
    await element.updateComplete;
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();

    expect(changeHandler).toHaveBeenCalled();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe(11);
  });

  // Interaction tests
  it('should increment value on increment button click', async () => {
    element.value = 5;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(6);
  });

  it('should decrement value on decrement button click', async () => {
    element.value = 5;
    await element.updateComplete;

    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    ) as HTMLButtonElement;
    decrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(4);
  });

  it('should respect step when incrementing', async () => {
    element.value = 10;
    element.step = 5;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(15);
  });

  it('should respect step when decrementing', async () => {
    element.value = 10;
    element.step = 5;
    await element.updateComplete;

    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    ) as HTMLButtonElement;
    decrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(5);
  });

  it('should clamp value to max on increment', async () => {
    element.value = 99;
    element.max = 100;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(100);

    // Try to increment beyond max
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(100);
  });

  it('should clamp value to min on decrement', async () => {
    element.value = 1;
    element.min = 0;
    await element.updateComplete;

    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    ) as HTMLButtonElement;
    decrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(0);

    // Try to decrement beyond min
    decrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(0);
  });

  it('should disable increment button at max', async () => {
    element.value = 100;
    element.max = 100;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    expect(incrementBtn?.disabled).toBe(true);
  });

  it('should disable decrement button at min', async () => {
    element.value = 0;
    element.min = 0;
    await element.updateComplete;

    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    ) as HTMLButtonElement;
    expect(decrementBtn?.disabled).toBe(true);
  });

  // Keyboard navigation tests
  it('should support keyboard navigation with ArrowUp', async () => {
    element.value = 10;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(11);
  });

  it('should support keyboard navigation with ArrowDown', async () => {
    element.value = 10;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })
    );
    await element.updateComplete;

    expect(element.value).toBe(9);
  });

  it('should support keyboard navigation with Home key', async () => {
    element.value = 50;
    element.min = 10;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', { key: 'Home', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(10);
  });

  it('should support keyboard navigation with End key', async () => {
    element.value = 50;
    element.max = 100;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', { key: 'End', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(100);
  });

  it('should support keyboard navigation with PageUp for large step', async () => {
    element.value = 10;
    element.step = 5;
    element.max = 200;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', { key: 'PageUp', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(60); // 10 + (5 * 10)
  });

  it('should support keyboard navigation with PageDown for large step', async () => {
    element.value = 100;
    element.step = 5;
    element.min = 0;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', {
        key: 'PageDown',
        bubbles: true,
      })
    );
    await element.updateComplete;

    expect(element.value).toBe(50); // 100 - (5 * 10)
  });

  // Accessibility tests
  it('should have aria-valuemin attribute when min is set', async () => {
    element.min = 5;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-valuemin')).toBe('5');
  });

  it('should have aria-valuemax attribute when max is set', async () => {
    element.max = 100;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('should have aria-valuenow attribute when value is set', async () => {
    element.value = 42;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-valuenow')).toBe('42');
  });

  it('should have aria-invalid when variant is error', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('should have aria-label on increment button', async () => {
    await element.updateComplete;
    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    );
    expect(incrementBtn?.getAttribute('aria-label')).toBe('Increase value');
  });

  it('should have aria-label on decrement button', async () => {
    await element.updateComplete;
    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    );
    expect(decrementBtn?.getAttribute('aria-label')).toBe('Decrease value');
  });

  // CSS Parts tests
  it('should expose input part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('[part="input"]');
    expect(input).toBeTruthy();
  });

  it('should expose increment part for styling', async () => {
    await element.updateComplete;
    const incrementBtn =
      element.shadowRoot?.querySelector('[part="increment"]');
    expect(incrementBtn).toBeTruthy();
  });

  it('should expose decrement part for styling', async () => {
    await element.updateComplete;
    const decrementBtn =
      element.shadowRoot?.querySelector('[part="decrement"]');
    expect(decrementBtn).toBeTruthy();
  });

  it('should expose label part for styling', async () => {
    element.label = 'Test Label';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('[part="label"]');
    expect(label).toBeTruthy();
  });

  it('should expose message part for styling', async () => {
    element.message = 'Test message';
    await element.updateComplete;
    const message = element.shadowRoot?.querySelector('[part="message"]');
    expect(message).toBeTruthy();
  });

  // Null value handling
  it('should handle null value correctly', async () => {
    element.value = null;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    expect(input?.value).toBe('');
  });

  it('should start from min when incrementing from null', async () => {
    element.value = null;
    element.min = 10;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(11); // starts from min (10) + step (1)
  });

  it('should start from max when decrementing from null', async () => {
    element.value = null;
    element.max = 100;
    await element.updateComplete;

    const decrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--decrement'
    ) as HTMLButtonElement;
    decrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(99); // starts from max (100) - step (1)
  });

  // Disabled state tests
  it('should not respond to button clicks when disabled', async () => {
    element.disabled = true;
    element.value = 10;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(10);
  });

  it('should not respond to keyboard when disabled', async () => {
    element.disabled = true;
    element.value = 10;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement;
    input?.dispatchEvent(
      new globalThis.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(10);
  });

  // Readonly state tests
  it('should not respond to button clicks when readonly', async () => {
    element.readonly = true;
    element.value = 10;
    await element.updateComplete;

    const incrementBtn = element.shadowRoot?.querySelector(
      '.number-input__button--increment'
    ) as HTMLButtonElement;
    incrementBtn?.click();
    await element.updateComplete;

    expect(element.value).toBe(10);
  });
});
