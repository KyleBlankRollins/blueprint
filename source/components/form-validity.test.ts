import { describe, it, expect, afterEach } from 'vitest';
import './input/input.js';
import './date-picker/date-picker.js';
import './radio-group/radio-group.js';
import './radio/radio.js';
import './number-input/number-input.js';
import './checkbox/checkbox.js';
import './switch/switch.js';
import type { BpInput } from './input/input.js';
import type { BpDatePicker } from './date-picker/date-picker.js';
import type { BpRadioGroup } from './radio-group/radio-group.js';
import type { BpNumberInput } from './number-input/number-input.js';
import type { BpCheckbox } from './checkbox/checkbox.js';
import type { BpSwitch } from './switch/switch.js';

/**
 * `errorMessage` blocks form submission like `setCustomValidity()`.
 *
 * These need real ElementInternals (a browser); environments without it
 * (happy-dom) fall back to never blocking, so the checks are skipped there.
 */
const hasInternals = (el: Element): boolean => {
  const host = el as unknown as { _internals?: unknown; internals?: unknown };
  return (host._internals ?? host.internals) != null;
};

describe('errorMessage form validity', () => {
  let form: HTMLFormElement;

  const mount = async <
    T extends HTMLElement & { updateComplete: Promise<unknown> },
  >(
    markup: string
  ): Promise<T> => {
    form = document.createElement('form');
    form.innerHTML = markup;
    document.body.appendChild(form);
    const el = form.firstElementChild as T;
    await el.updateComplete;
    return el;
  };

  afterEach(() => {
    form?.remove();
  });

  it('blocks the form while set on bp-input, until cleared', async () => {
    const input = await mount<BpInput>('<bp-input name="user"></bp-input>');
    if (!hasInternals(input)) return;

    expect(form.checkValidity()).toBe(true);

    input.errorMessage = 'That username is taken.';
    await input.updateComplete;
    expect(form.checkValidity()).toBe(false);
    expect(input.checkValidity()).toBe(false);
    expect(input.validity?.customError).toBe(true);
    expect(input.validationMessage).toBe('That username is taken.');

    input.errorMessage = '';
    await input.updateComplete;
    expect(form.checkValidity()).toBe(true);
    expect(input.validity?.customError).toBe(false);
    expect(input.validationMessage).toBe('');
  });

  it('takes precedence over native validation, then hands back', async () => {
    const input = await mount<BpInput>(
      '<bp-input name="user" required></bp-input>'
    );
    if (!hasInternals(input)) return;

    input.errorMessage = 'Server says no.';
    await input.updateComplete;
    expect(input.validity?.valueMissing).toBe(false);
    expect(input.validationMessage).toBe('Server says no.');

    input.errorMessage = '';
    await input.updateComplete;
    expect(input.validity?.valueMissing).toBe(true);
    expect(form.checkValidity()).toBe(false);
  });

  it('does not block when the control is disabled', async () => {
    const input = await mount<BpInput>(
      '<bp-input name="user" disabled></bp-input>'
    );
    if (!hasInternals(input)) return;

    input.errorMessage = 'Ignored while disabled';
    await input.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it('applies to controls that override getFormValidity (date picker)', async () => {
    const picker = await mount<BpDatePicker>(
      '<bp-date-picker name="when"></bp-date-picker>'
    );
    if (!hasInternals(picker)) return;

    picker.errorMessage = 'No slots that day.';
    await picker.updateComplete;
    expect(form.checkValidity()).toBe(false);
    expect(picker.validationMessage).toBe('No slots that day.');

    picker.errorMessage = '';
    await picker.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it('applies to controls that override getFormValidity (radio group)', async () => {
    const group = await mount<BpRadioGroup>(
      `<bp-radio-group name="plan" value="free">
        <bp-radio value="free">Free</bp-radio>
        <bp-radio value="team">Team</bp-radio>
      </bp-radio-group>`
    );
    if (!hasInternals(group)) return;

    group.errorMessage = 'Plan unavailable.';
    await group.updateComplete;
    expect(form.checkValidity()).toBe(false);
    expect(group.validity?.customError).toBe(true);
    expect(group.validationMessage).toBe('Plan unavailable.');

    group.errorMessage = '';
    await group.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it("counts number input's deprecated message with variant=error", async () => {
    const num = await mount<BpNumberInput>(
      '<bp-number-input name="qty"></bp-number-input>'
    );
    if (!hasInternals(num)) return;

    num.message = 'Too many';
    await num.updateComplete;
    expect(form.checkValidity()).toBe(true);

    num.variant = 'error';
    await num.updateComplete;
    expect(form.checkValidity()).toBe(false);
    expect(num.validationMessage).toBe('Too many');
  });

  it('blocks the form while set on bp-checkbox', async () => {
    const box = await mount<BpCheckbox>(
      '<bp-checkbox name="terms">Terms</bp-checkbox>'
    );
    if (!hasInternals(box)) return;

    box.errorMessage = 'Accept the terms.';
    await box.updateComplete;
    expect(form.checkValidity()).toBe(false);

    box.errorMessage = '';
    await box.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });

  it('blocks the form while set on bp-switch, unless disabled', async () => {
    const sw = await mount<BpSwitch>('<bp-switch name="alerts">On</bp-switch>');
    if (!hasInternals(sw)) return;

    sw.errorMessage = 'Required for this plan.';
    await sw.updateComplete;
    expect(form.checkValidity()).toBe(false);

    sw.disabled = true;
    await sw.updateComplete;
    expect(form.checkValidity()).toBe(true);

    sw.disabled = false;
    sw.errorMessage = '';
    await sw.updateComplete;
    expect(form.checkValidity()).toBe(true);
  });
});
