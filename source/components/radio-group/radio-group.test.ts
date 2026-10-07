import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './radio-group.js';
import '../radio/radio.js';
import type { BpRadioGroup } from './radio-group.js';
import type { BpRadio } from '../radio/radio.js';

describe('bp-radio-group', () => {
  let element: BpRadioGroup;
  let radios: BpRadio[];

  beforeEach(async () => {
    element = document.createElement('bp-radio-group');
    element.innerHTML = `
      <bp-radio value="standard" name="ignored">Standard</bp-radio>
      <bp-radio value="express">Express</bp-radio>
      <bp-radio value="overnight">Overnight</bp-radio>
    `;
    document.body.appendChild(element);
    await element.updateComplete;
    radios = Array.from(element.querySelectorAll('bp-radio'));
    await Promise.all(radios.map((r) => r.updateComplete));
  });

  afterEach(() => {
    element.remove();
  });

  const q = <T extends Element>(selector: string) =>
    element.shadowRoot!.querySelector<T>(selector);

  const press = (target: Element, key: string) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

  it('should be registered in HTMLElementTagNameMap', () => {
    expect(customElements.get('bp-radio-group')).toBeDefined();
  });

  it('renders the slotted radios inside the radiogroup', () => {
    const slot = q<HTMLSlotElement>('slot');
    expect(slot?.assignedElements()).toHaveLength(3);
    expect(element.radios).toHaveLength(3);
  });

  it('should set property: label, description, name, required', async () => {
    element.label = 'Speed';
    element.description = 'Pick one';
    element.name = 'speed';
    element.required = true;
    await element.updateComplete;
    expect(q('#label')?.textContent).toContain('Speed');
    expect(q('#description')?.textContent).toContain('Pick one');
    expect(element.getAttribute('name')).toBe('speed');
    expect(q('.radio-group__required')).toBeTruthy();
  });

  it('should expose CSS parts', async () => {
    element.label = 'Speed';
    element.description = 'Pick one';
    element.errorMessage = 'Error';
    await element.updateComplete;
    for (const part of ['group', 'label', 'description', 'options', 'error']) {
      expect(q(`[part~="${part}"]`)).toBeTruthy();
    }
  });

  it('should have correct default property values', () => {
    const fresh = document.createElement('bp-radio-group');
    expect(fresh.value).toBe('');
    expect(fresh.name).toBe('');
    expect(fresh.required).toBe(false);
    expect(fresh.disabled).toBe(false);
    expect(fresh.orientation).toBe('vertical');
  });

  it('exposes a labelled radiogroup', async () => {
    element.label = 'Delivery';
    element.required = true;
    await element.updateComplete;
    const group = q('[role="radiogroup"]');
    expect(group?.getAttribute('aria-labelledby')).toBe('label');
    expect(q('#label')?.textContent).toContain('Delivery');
    expect(group?.getAttribute('aria-required')).toBe('true');
  });

  it('links description and error to the group', async () => {
    element.description = 'Arrives in 2-5 days.';
    element.errorMessage = 'Choose a delivery option.';
    await element.updateComplete;
    const group = q('[role="radiogroup"]');
    expect(group?.getAttribute('aria-describedby')).toBe(
      'description error-message'
    );
    expect(group?.getAttribute('aria-invalid')).toBe('true');
    expect(q('#error-message')?.getAttribute('role')).toBe('alert');
  });

  it('checks the radio matching value', async () => {
    element.value = 'express';
    await element.updateComplete;
    expect(radios.map((r) => r.checked)).toEqual([false, true, false]);
  });

  it('clears name on its radios so only the group submits', () => {
    expect(radios.every((r) => r.name === '')).toBe(true);
  });

  it('keeps one radio in the tab order', async () => {
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
    element.value = 'overnight';
    await element.updateComplete;
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, -1, 0]);
  });

  it('updates value and fires a single group bp-change on selection', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-change', handler);

    radios[1].select();
    await element.updateComplete;

    expect(element.value).toBe('express');
    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.target).toBe(element);
    expect(event.detail).toEqual({ value: 'express' });
    expect(radios.map((r) => r.checked)).toEqual([false, true, false]);
  });

  it('moves and selects with arrow keys, wrapping around', async () => {
    element.value = 'standard';
    await element.updateComplete;

    press(radios[0], 'ArrowDown');
    await element.updateComplete;
    expect(element.value).toBe('express');

    press(radios[1], 'ArrowRight');
    await element.updateComplete;
    expect(element.value).toBe('overnight');

    press(radios[2], 'ArrowDown');
    await element.updateComplete;
    expect(element.value).toBe('standard');

    press(radios[0], 'ArrowUp');
    await element.updateComplete;
    expect(element.value).toBe('overnight');
  });

  it('skips disabled radios with arrow keys', async () => {
    radios[1].disabled = true;
    element.value = 'standard';
    await element.updateComplete;

    press(radios[0], 'ArrowDown');
    await element.updateComplete;
    expect(element.value).toBe('overnight');
  });

  it('disables all radios and restores only those it disabled', async () => {
    radios[2].disabled = true;
    element.disabled = true;
    await element.updateComplete;
    expect(radios.every((r) => r.disabled)).toBe(true);

    element.disabled = false;
    await element.updateComplete;
    expect(radios.map((r) => r.disabled)).toEqual([false, false, true]);
  });

  it('submits nothing until a radio is selected', async () => {
    expect(element.getFormValue()).toBeNull();
    element.value = 'express';
    await element.updateComplete;
    expect(element.getFormValue()).toBe('express');
  });

  it('is missing a value when required and nothing is selected', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.getFormValidity().flags.valueMissing).toBe(true);
    element.value = 'express';
    await element.updateComplete;
    expect(element.getFormValidity().flags).toEqual({});
  });
});
