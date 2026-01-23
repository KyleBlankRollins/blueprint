import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './slider.js';
import type { BpSlider } from './slider.js';

describe('bp-slider', () => {
  let element: BpSlider;

  beforeEach(() => {
    element = document.createElement('bp-slider');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-slider');
    expect(constructor).toBeDefined();
  });

  // Default values tests
  it('should have correct default property values', async () => {
    await element.updateComplete;
    expect(element.value).toBe(0);
    expect(element.min).toBe(0);
    expect(element.max).toBe(100);
    expect(element.step).toBe(1);
    expect(element.name).toBe('');
    expect(element.label).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.size).toBe('medium');
    expect(element.showValue).toBe(false);
    expect(element.showTicks).toBe(false);
  });

  // Property tests
  it('should set property: value', async () => {
    element.value = 50;
    await element.updateComplete;
    expect(element.value).toBe(50);
    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    expect(thumb?.style.left).toBe('50%');
  });

  it('should set property: min', async () => {
    element.min = 10;
    element.value = 55;
    await element.updateComplete;
    expect(element.min).toBe(10);
    // 55 is (55-10)/(100-10) = 50% of the way
    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    expect(thumb?.style.left).toBe('50%');
  });

  it('should set property: max', async () => {
    element.max = 200;
    element.value = 100;
    await element.updateComplete;
    expect(element.max).toBe(200);
    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    expect(thumb?.style.left).toBe('50%');
  });

  it('should set property: step', async () => {
    element.step = 10;
    await element.updateComplete;
    expect(element.step).toBe(10);

    // Verify step affects keyboard navigation
    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(10); // Should increase by step amount
  });

  it('should set property: name', async () => {
    element.name = 'volume';
    await element.updateComplete;
    expect(element.name).toBe('volume');
    const input = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    expect(input?.name).toBe('volume');
  });

  it('should set property: label', async () => {
    element.label = 'Volume';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.slider__label');
    expect(label?.textContent).toBe('Volume');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const slider = element.shadowRoot?.querySelector('.slider');
    expect(slider?.classList.contains('slider--disabled')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
    const slider = element.shadowRoot?.querySelector('.slider');
    expect(slider?.classList.contains('slider--large')).toBe(true);
  });

  it('should set property: showValue', async () => {
    element.showValue = true;
    element.value = 42;
    await element.updateComplete;
    const valueDisplay = element.shadowRoot?.querySelector('.slider__value');
    expect(valueDisplay?.textContent).toBe('42');
  });

  it('should set property: showTicks', async () => {
    element.showTicks = true;
    element.step = 25;
    await element.updateComplete;
    const ticks = element.shadowRoot?.querySelectorAll('.slider__tick');
    expect(ticks?.length).toBe(5); // 0, 25, 50, 75, 100
  });

  it('should set property: formatValue', async () => {
    element.showValue = true;
    element.value = 50;
    element.formatValue = (v: number) => `${v}%`;
    await element.updateComplete;
    const valueDisplay = element.shadowRoot?.querySelector('.slider__value');
    expect(valueDisplay?.textContent).toBe('50%');
  });

  // Event tests
  it('should emit bp-input event on keyboard navigation', async () => {
    await element.updateComplete;
    const inputHandler = vi.fn();
    element.addEventListener('bp-input', inputHandler);

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );

    expect(inputHandler).toHaveBeenCalled();
    expect(inputHandler.mock.calls[0][0].detail.value).toBe(1);
  });

  it('should emit bp-change event on keyboard navigation', async () => {
    await element.updateComplete;
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );

    expect(changeHandler).toHaveBeenCalled();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe(1);
  });

  // Keyboard navigation tests
  it('should support keyboard navigation with ArrowRight', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(55);
  });

  it('should support keyboard navigation with ArrowLeft', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(45);
  });

  it('should support keyboard navigation with ArrowUp', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(55);
  });

  it('should support keyboard navigation with ArrowDown', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(45);
  });

  it('should support keyboard navigation with Home key', async () => {
    element.value = 50;
    element.min = 10;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(10);
  });

  it('should support keyboard navigation with End key', async () => {
    element.value = 50;
    element.max = 200;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'End', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(200);
  });

  it('should support keyboard navigation with PageUp for large step', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'PageUp', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(100); // 50 + (5 * 10) = 100, clamped to max
  });

  it('should support keyboard navigation with PageDown for large step', async () => {
    element.value = 50;
    element.step = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'PageDown', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(0); // 50 - (5 * 10) = 0, clamped to min
  });

  // Accessibility tests
  it('should have role="slider" on thumb', async () => {
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('role')).toBe('slider');
  });

  it('should have aria-valuemin attribute', async () => {
    element.min = 10;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-valuemin')).toBe('10');
  });

  it('should have aria-valuemax attribute', async () => {
    element.max = 200;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-valuemax')).toBe('200');
  });

  it('should have aria-valuenow attribute', async () => {
    element.value = 75;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('75');
  });

  it('should have aria-valuetext with formatted value', async () => {
    element.value = 50;
    element.formatValue = (v: number) => `${v} percent`;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-valuetext')).toBe('50 percent');
  });

  it('should have aria-label from label property', async () => {
    element.label = 'Volume Control';
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-label')).toBe('Volume Control');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should be focusable with tabindex', async () => {
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('tabindex')).toBe('0');
  });

  it('should not be focusable when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('.slider__thumb');
    expect(thumb?.getAttribute('tabindex')).toBe('-1');
  });

  // CSS Parts tests
  it('should expose track part for styling', async () => {
    await element.updateComplete;
    const track = element.shadowRoot?.querySelector('[part="track"]');
    expect(track).toBeTruthy();
  });

  it('should expose fill part for styling', async () => {
    await element.updateComplete;
    const fill = element.shadowRoot?.querySelector('[part="fill"]');
    expect(fill).toBeTruthy();
  });

  it('should expose thumb part for styling', async () => {
    await element.updateComplete;
    const thumb = element.shadowRoot?.querySelector('[part="thumb"]');
    expect(thumb).toBeTruthy();
  });

  it('should expose label part for styling', async () => {
    element.label = 'Test Label';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('[part="label"]');
    expect(label).toBeTruthy();
  });

  it('should expose value-display part for styling', async () => {
    element.showValue = true;
    await element.updateComplete;
    const valueDisplay = element.shadowRoot?.querySelector(
      '[part="value-display"]'
    );
    expect(valueDisplay).toBeTruthy();
  });

  // Value clamping tests
  it('should clamp value to min boundary', async () => {
    element.min = 10;
    element.value = 5;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    await element.updateComplete;

    // Value should stay at min
    expect(element.value).toBe(10);
  });

  it('should clamp value to max boundary', async () => {
    element.max = 100;
    element.value = 100;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    await element.updateComplete;

    // Value should stay at max
    expect(element.value).toBe(100);
  });

  // Hidden input tests
  it('should not render hidden input when name is empty', async () => {
    element.name = '';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input[type="hidden"]');
    expect(input).toBeNull();
  });

  it('should render hidden input when name is provided', async () => {
    element.name = 'slider-value';
    element.value = 42;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input?.value).toBe('42');
  });

  // Tick visibility tests
  it('should not render ticks when showTicks is false', async () => {
    element.showTicks = false;
    await element.updateComplete;
    const ticks = element.shadowRoot?.querySelector('.slider__ticks');
    expect(ticks).toBeNull();
  });

  it('should not render ticks when step creates more than 20 ticks', async () => {
    element.showTicks = true;
    element.min = 0;
    element.max = 100;
    element.step = 1; // Would create 101 ticks
    await element.updateComplete;
    const ticks = element.shadowRoot?.querySelectorAll('.slider__tick');
    expect(ticks?.length).toBe(0);
  });

  // Interaction disabled tests
  it('should not respond to keyboard when disabled', async () => {
    element.disabled = true;
    element.value = 50;
    await element.updateComplete;

    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    thumb?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    await element.updateComplete;

    expect(element.value).toBe(50); // Value unchanged
  });

  // Fill width tests
  it('should update fill width based on value percentage', async () => {
    element.min = 0;
    element.max = 100;
    element.value = 25;
    await element.updateComplete;

    const fill = element.shadowRoot?.querySelector(
      '.slider__fill'
    ) as HTMLElement;
    expect(fill?.style.width).toBe('25%');
  });

  it('should calculate correct percentage with custom range', async () => {
    element.min = 100;
    element.max = 200;
    element.value = 150;
    await element.updateComplete;

    const fill = element.shadowRoot?.querySelector(
      '.slider__fill'
    ) as HTMLElement;
    expect(fill?.style.width).toBe('50%');
    const thumb = element.shadowRoot?.querySelector(
      '.slider__thumb'
    ) as HTMLElement;
    expect(thumb?.style.left).toBe('50%');
  });
});
