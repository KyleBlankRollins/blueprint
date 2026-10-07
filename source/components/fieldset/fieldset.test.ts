import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './fieldset.js';
import '../input/input.js';
import '../checkbox/checkbox.js';
import type { BpFieldset } from './fieldset.js';

describe('bp-fieldset', () => {
  let element: BpFieldset;

  beforeEach(() => {
    element = document.createElement('bp-fieldset');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  const q = <T extends Element>(selector: string) =>
    element.shadowRoot!.querySelector<T>(selector);

  it('should be registered in HTMLElementTagNameMap', () => {
    expect(customElements.get('bp-fieldset')).toBeDefined();
    expect(document.createElement('bp-fieldset')).toBeInstanceOf(
      customElements.get('bp-fieldset')!
    );
  });

  it('should set property: legend, description and errorMessage', async () => {
    element.legend = 'Contact';
    element.description = 'How to reach you';
    element.errorMessage = 'Required';
    await element.updateComplete;
    expect(q('legend')?.textContent).toContain('Contact');
    expect(q('#description')?.textContent).toContain('How to reach you');
    expect(q('#error-message')?.textContent).toContain('Required');
  });

  it('should reflect required, disabled and orientation attributes', async () => {
    element.required = true;
    element.disabled = true;
    element.orientation = 'horizontal';
    await element.updateComplete;
    expect(element.hasAttribute('required')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.getAttribute('orientation')).toBe('horizontal');
  });

  it('should expose CSS parts', async () => {
    element.legend = 'Contact';
    element.description = 'Details';
    element.errorMessage = 'Error';
    await element.updateComplete;
    for (const part of [
      'fieldset',
      'legend',
      'description',
      'content',
      'error',
    ]) {
      expect(q(`[part~="${part}"]`)).toBeTruthy();
    }
  });

  it('should render slotted legend content', async () => {
    element.innerHTML = '<span slot="legend">Rich <b>legend</b></span>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(q<HTMLLegendElement>('legend')?.hidden).toBe(false);
  });

  it('should have correct default property values', () => {
    expect(element.legend).toBe('');
    expect(element.description).toBe('');
    expect(element.errorMessage).toBe('');
    expect(element.required).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.orientation).toBe('vertical');
  });

  it('renders a native fieldset and legend', async () => {
    element.legend = 'Shipping address';
    await element.updateComplete;
    expect(q('fieldset')).toBeTruthy();
    const legend = q<HTMLLegendElement>('legend');
    expect(legend?.textContent?.trim()).toBe('Shipping address');
    expect(legend?.hidden).toBe(false);
  });

  it('hides the legend when there is none', async () => {
    await element.updateComplete;
    expect(q<HTMLLegendElement>('legend')?.hidden).toBe(true);
  });

  it('marks required with a decorative asterisk', async () => {
    element.legend = 'Contact';
    element.required = true;
    await element.updateComplete;
    const mark = q('.fieldset__required');
    expect(mark?.textContent?.trim()).toBe('*');
    expect(mark?.getAttribute('aria-hidden')).toBe('true');
  });

  it('links the description to the group', async () => {
    element.description = 'We only ship within the EU.';
    await element.updateComplete;
    expect(q('#description')?.textContent?.trim()).toBe(
      'We only ship within the EU.'
    );
    expect(q('fieldset')?.getAttribute('aria-describedby')).toBe('description');
  });

  it('announces a group error and marks the group invalid', async () => {
    element.description = 'Pick at least one.';
    element.errorMessage = 'Choose a delivery option.';
    await element.updateComplete;
    const error = q('#error-message');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(error?.textContent?.trim()).toBe('Choose a delivery option.');
    const fieldset = q('fieldset');
    expect(fieldset?.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset?.getAttribute('aria-describedby')).toBe(
      'description error-message'
    );
  });

  it('has no aria-describedby or aria-invalid by default', async () => {
    await element.updateComplete;
    const fieldset = q('fieldset');
    expect(fieldset?.hasAttribute('aria-describedby')).toBe(false);
    expect(fieldset?.hasAttribute('aria-invalid')).toBe(false);
  });

  it('applies the orientation class', async () => {
    element.orientation = 'horizontal';
    await element.updateComplete;
    expect(q('fieldset')?.classList.contains('fieldset--horizontal')).toBe(
      true
    );
  });

  describe('disabled', () => {
    it('disables the controls inside and restores them', async () => {
      element.innerHTML = `
        <bp-input></bp-input>
        <div><bp-checkbox></bp-checkbox></div>
        <button>Save</button>
      `;
      await element.updateComplete;
      const input = element.querySelector('bp-input')!;
      const checkbox = element.querySelector('bp-checkbox')!;
      const button = element.querySelector('button')!;

      element.disabled = true;
      await element.updateComplete;
      expect(input.disabled).toBe(true);
      expect(checkbox.disabled).toBe(true);
      expect(button.disabled).toBe(true);

      element.disabled = false;
      await element.updateComplete;
      expect(input.disabled).toBe(false);
      expect(checkbox.disabled).toBe(false);
      expect(button.disabled).toBe(false);
    });

    it('leaves controls that were already disabled disabled', async () => {
      element.innerHTML = `<button disabled>Locked</button><button>Open</button>`;
      await element.updateComplete;
      const [locked, open] = Array.from(element.querySelectorAll('button'));

      element.disabled = true;
      await element.updateComplete;
      element.disabled = false;
      await element.updateComplete;

      expect(locked.disabled).toBe(true);
      expect(open.disabled).toBe(false);
    });

    it('disables controls added while the group is disabled', async () => {
      element.disabled = true;
      await element.updateComplete;
      const button = document.createElement('button');
      element.appendChild(button);
      // slotchange is async
      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;
      expect(button.disabled).toBe(true);
    });
  });
});
