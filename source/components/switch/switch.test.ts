import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './switch.js';
import type { BpSwitch } from './switch.js';

describe('bp-switch', () => {
  let element: BpSwitch;

  beforeEach(() => {
    element = document.createElement('bp-switch');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-switch');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render switch element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
  });

  it('should render input element', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
  });

  it('should render track and thumb elements', async () => {
    await element.updateComplete;
    const track = element.shadowRoot?.querySelector('.switch__track');
    const thumb = element.shadowRoot?.querySelector('.switch__thumb');
    expect(track).toBeTruthy();
    expect(thumb).toBeTruthy();
  });

  it('should render label container', async () => {
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.switch__label');
    expect(label).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.name).toBe('');
    expect(element.value).toBe('on');
    expect(element.size).toBe('md');
    expect(element.error).toBe(false);
  });

  // Properties
  it('should set property: checked', async () => {
    element.checked = true;
    await element.updateComplete;
    expect(element.checked).toBe(true);
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('should set property: name', async () => {
    element.name = 'test-switch';
    await element.updateComplete;
    expect(element.name).toBe('test-switch');
  });

  it('should set property: value', async () => {
    element.value = 'enabled';
    await element.updateComplete;
    expect(element.value).toBe('enabled');
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const switchEl = element.shadowRoot?.querySelector('.switch--lg');
    expect(switchEl).toBeTruthy();
  });

  it('should set property: error', async () => {
    element.error = true;
    await element.updateComplete;
    expect(element.error).toBe(true);
    const errorSwitch = element.shadowRoot?.querySelector('.switch--error');
    expect(errorSwitch).toBeTruthy();
  });

  // Attributes
  it('should reflect attribute: checked', async () => {
    element.checked = true;
    await element.updateComplete;
    expect(element.hasAttribute('checked')).toBe(true);
  });

  it('should reflect attribute: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('should reflect attribute: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.hasAttribute('required')).toBe(true);
  });

  it('should reflect attribute: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('sm');
  });

  it('should reflect attribute: error', async () => {
    element.error = true;
    await element.updateComplete;
    expect(element.hasAttribute('error')).toBe(true);
  });

  // Events
  it('should emit bp-change event when clicked', async () => {
    let changeDetail: { checked: boolean } | null = null;
    element.addEventListener('bp-change', (e: Event) => {
      changeDetail = (e as CustomEvent).detail;
    });

    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(changeDetail).not.toBeNull();
    expect(changeDetail!.checked).toBe(true);
  });

  it('should emit bp-focus event on focus', async () => {
    let focusFired = false;
    element.addEventListener('bp-focus', () => {
      focusFired = true;
    });

    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.focus();
    await element.updateComplete;

    expect(focusFired).toBe(true);
  });

  it('should emit bp-blur event on blur', async () => {
    let blurFired = false;
    element.addEventListener('bp-blur', () => {
      blurFired = true;
    });

    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.focus();
    input.blur();
    await element.updateComplete;

    expect(blurFired).toBe(true);
  });

  it('should update checked state on change event', async () => {
    expect(element.checked).toBe(false);

    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  // Slots
  it('should render slotted content', async () => {
    const switchWithLabel = document.createElement('bp-switch');
    switchWithLabel.textContent = 'Enable notifications';
    document.body.appendChild(switchWithLabel);
    await switchWithLabel.updateComplete;

    const slot = switchWithLabel.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
    switchWithLabel.remove();
  });

  it('should display custom label text', async () => {
    const switchWithLabel = document.createElement('bp-switch');
    switchWithLabel.textContent = 'Custom label';
    document.body.appendChild(switchWithLabel);
    await switchWithLabel.updateComplete;

    expect(switchWithLabel.textContent?.trim()).toBe('Custom label');
    switchWithLabel.remove();
  });

  // CSS Parts
  it('should expose switch part for styling', () => {
    const label = element.shadowRoot?.querySelector('[part="switch"]');
    expect(label).toBeTruthy();
  });

  it('should expose input part for styling', () => {
    const input = element.shadowRoot?.querySelector('[part="input"]');
    expect(input).toBeTruthy();
  });

  it('should expose track part for styling', () => {
    const track = element.shadowRoot?.querySelector('[part="track"]');
    expect(track).toBeTruthy();
  });

  it('should expose thumb part for styling', () => {
    const thumb = element.shadowRoot?.querySelector('[part="thumb"]');
    expect(thumb).toBeTruthy();
  });

  it('should expose label part for styling', () => {
    const label = element.shadowRoot?.querySelector('[part="label"]');
    expect(label).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const switchEl = element.shadowRoot?.querySelector('.switch--sm');
    expect(switchEl).toBeTruthy();
  });

  it('should apply medium size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const switchEl = element.shadowRoot?.querySelector('.switch--md');
    expect(switchEl).toBeTruthy();
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const switchEl = element.shadowRoot?.querySelector('.switch--lg');
    expect(switchEl).toBeTruthy();
  });

  // Accessibility
  it('should have aria-checked attribute', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-checked')).toBe('false');

    element.checked = true;
    await element.updateComplete;
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('should support keyboard navigation with focus method', async () => {
    await element.updateComplete;
    element.focus();
    await element.updateComplete;
    expect(document.activeElement).toBe(element);
  });

  it('should support keyboard navigation with blur method', async () => {
    await element.updateComplete;
    element.focus();
    await element.updateComplete;
    element.blur();
    await element.updateComplete;
    expect(document.activeElement).not.toBe(element);
  });

  it('should be disabled when disabled attribute is set', async () => {
    element.disabled = true;
    await element.updateComplete;

    const switchEl = element.shadowRoot?.querySelector('.switch--disabled');
    expect(switchEl).toBeTruthy();

    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should apply focus styles when focused', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.focus();
    await element.updateComplete;

    const focusSwitch = element.shadowRoot?.querySelector('.switch--focus');
    expect(focusSwitch).toBeTruthy();
  });

  it('should remove focus styles when blurred', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    input.focus();
    await element.updateComplete;
    input.blur();
    await element.updateComplete;

    const focusSwitch = element.shadowRoot?.querySelector('.switch--focus');
    expect(focusSwitch).toBeFalsy();
  });

  // Form integration
  it('should participate in form submission', async () => {
    const form = document.createElement('form');
    element.name = 'notifications';
    element.value = 'enabled';
    element.checked = true;
    form.appendChild(element);
    document.body.appendChild(form);
    await element.updateComplete;

    // Component should have name and value for form submission
    expect(element.name).toBe('notifications');
    expect(element.value).toBe('enabled');
    expect(element.checked).toBe(true);

    form.remove();
  });
});
