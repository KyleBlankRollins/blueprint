import { describe, it, expect, afterEach } from 'vitest';
import './input/input.js';
import './textarea/textarea.js';
import './select/select.js';
import './combobox/combobox.js';
import './multi-select/multi-select.js';
import './number-input/number-input.js';
import './date-picker/date-picker.js';
import './time-picker/time-picker.js';
import './slider/slider.js';
import './color-picker/color-picker.js';
import './file-upload/file-upload.js';
import './checkbox/checkbox.js';
import './switch/switch.js';
import './radio-group/radio-group.js';

/**
 * Every control shows help and error text the same way: `helperText` under
 * the control, replaced by `errorMessage`, which is announced and marks the
 * control invalid. The text is linked with aria-describedby.
 */
const tags = [
  'bp-input',
  'bp-textarea',
  'bp-select',
  'bp-combobox',
  'bp-multi-select',
  'bp-number-input',
  'bp-date-picker',
  'bp-time-picker',
  'bp-slider',
  'bp-color-picker',
  'bp-file-upload',
  'bp-checkbox',
  'bp-switch',
  'bp-radio-group',
] as const;

type Field = HTMLElement & {
  helperText: string;
  errorMessage: string;
  updateComplete: Promise<unknown>;
};

const make = async (tag: string): Promise<Field> => {
  const el = document.createElement(tag) as Field;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

describe('field messages', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each(tags)('%s shows helper text linked to the control', async (tag) => {
    const el = await make(tag);
    el.helperText = 'Shown under the control';
    await el.updateComplete;
    const root = el.shadowRoot!;
    const help = root.querySelector('#helper-text');
    expect(help?.textContent?.trim()).toBe('Shown under the control');
    expect(help?.getAttribute('part')).toContain('helper-text');
    expect(
      root.querySelector('[aria-describedby~="helper-text"]')
    ).toBeTruthy();
    expect(root.querySelector('[aria-invalid="true"]')).toBeNull();
  });

  it.each(tags)(
    '%s replaces helper text with an announced error',
    async (tag) => {
      const el = await make(tag);
      el.helperText = 'Hint';
      el.errorMessage = 'Something is wrong';
      await el.updateComplete;
      const root = el.shadowRoot!;
      expect(root.querySelector('#helper-text')).toBeNull();
      const error = root.querySelector('#error-message');
      expect(error?.textContent?.trim()).toBe('Something is wrong');
      expect(error?.getAttribute('role')).toBe('alert');
      expect(error?.getAttribute('part')).toContain('error-message');
      const control = root.querySelector('[aria-describedby~="error-message"]');
      expect(control?.getAttribute('aria-invalid')).toBe('true');
    }
  );

  it.each(tags)('%s renders nothing when both are empty', async (tag) => {
    const el = await make(tag);
    const root = el.shadowRoot!;
    expect(root.querySelector('.field-message')).toBeNull();
  });
});
