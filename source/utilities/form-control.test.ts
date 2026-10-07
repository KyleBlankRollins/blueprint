import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  FormControlMixin,
  customErrorValidity,
  syncCustomValidity,
} from './form-control.js';

@customElement('test-form-control')
class TestFormControl extends FormControlMixin(LitElement) {
  @property({ type: String }) declare name: string;
  @property() declare value: string | string[] | null;
  @property({ type: Boolean }) declare required: boolean;
  @property({ type: Boolean }) declare disabled: boolean;
  @property({ type: String }) declare errorMessage: string;

  constructor() {
    super();
    this.errorMessage = '';
    this.name = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
  }

  render() {
    return html`<input />`;
  }
}

describe('FormControlMixin', () => {
  let element: TestFormControl;

  beforeEach(() => {
    element = document.createElement('test-form-control') as TestFormControl;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('marks the element as form-associated', () => {
    expect(
      (
        customElements.get('test-form-control') as unknown as {
          formAssociated: boolean;
        }
      ).formAssociated
    ).toBe(true);
  });

  it('reflects name to the attribute form submission reads', async () => {
    element.name = 'email';
    await element.updateComplete;
    expect(element.getAttribute('name')).toBe('email');
  });

  describe('getFormValue', () => {
    it('submits string values as-is', async () => {
      element.value = 'hello';
      await element.updateComplete;
      expect(element.getFormValue()).toBe('hello');
    });

    it('submits nothing for null', async () => {
      element.value = null;
      await element.updateComplete;
      expect(element.getFormValue()).toBeNull();
    });

    it('submits one entry per item for arrays', async () => {
      element.name = 'toppings';
      element.value = ['cheese', 'olives'];
      await element.updateComplete;
      const data = element.getFormValue() as FormData;
      expect(data.getAll('toppings')).toEqual(['cheese', 'olives']);
    });

    it('submits nothing for an array without a name', async () => {
      element.value = ['a'];
      await element.updateComplete;
      expect(element.getFormValue()).toBeNull();
    });
  });

  describe('getFormValidity', () => {
    it('is valid when not required', () => {
      expect(element.getFormValidity().flags).toEqual({});
    });

    it('reports valueMissing when required and empty', async () => {
      element.required = true;
      await element.updateComplete;
      const { flags, message } = element.getFormValidity();
      expect(flags.valueMissing).toBe(true);
      expect(message).not.toBe('');
    });

    it('reports valueMissing for an empty array', async () => {
      element.required = true;
      element.value = [];
      await element.updateComplete;
      expect(element.getFormValidity().flags.valueMissing).toBe(true);
    });

    it('is valid when required and filled', async () => {
      element.required = true;
      element.value = 'x';
      await element.updateComplete;
      expect(element.getFormValidity().flags).toEqual({});
    });
  });

  it('restores the first rendered value on form reset', async () => {
    const fresh = document.createElement(
      'test-form-control'
    ) as TestFormControl;
    fresh.value = 'initial';
    document.body.appendChild(fresh);
    await fresh.updateComplete;

    fresh.value = 'edited';
    await fresh.updateComplete;
    fresh.formResetCallback();
    expect(fresh.value).toBe('initial');
    fresh.remove();
  });

  it('restores a copy of array values on reset', async () => {
    const fresh = document.createElement(
      'test-form-control'
    ) as TestFormControl;
    const initial = ['a'];
    fresh.value = initial;
    document.body.appendChild(fresh);
    await fresh.updateComplete;

    fresh.value = ['b'];
    await fresh.updateComplete;
    fresh.formResetCallback();
    expect(fresh.value).toEqual(['a']);
    expect(fresh.value).not.toBe(initial);
    fresh.remove();
  });

  it('restores string state from the browser', () => {
    element.formStateRestoreCallback('saved');
    expect(element.value).toBe('saved');
  });

  describe('errorMessage', () => {
    /** Records what syncFormState() passes to ElementInternals */
    const fakeInternals = () => {
      const calls: Array<{ flags: ValidityStateFlags; message?: string }> = [];
      return {
        calls,
        setFormValue() {},
        setValidity(flags: ValidityStateFlags, message?: string) {
          calls.push({ flags, message });
        },
      };
    };

    const last = <T>(items: T[]): T | undefined => items[items.length - 1];

    const sync = (el: TestFormControl) => {
      const internals = fakeInternals();
      (el as unknown as { _internals: unknown })._internals = internals;
      el.syncFormState();
      return last(internals.calls);
    };

    it('defaults the custom validity message to errorMessage', async () => {
      expect(element.getCustomValidityMessage()).toBe('');
      element.errorMessage = 'Taken';
      await element.updateComplete;
      expect(element.getCustomValidityMessage()).toBe('Taken');
    });

    it('reports customError with the message', async () => {
      element.errorMessage = 'That username is taken.';
      await element.updateComplete;
      expect(sync(element)).toEqual({
        flags: { customError: true },
        message: 'That username is taken.',
      });
    });

    it('takes precedence over valueMissing', async () => {
      element.required = true;
      element.errorMessage = 'Server error';
      await element.updateComplete;
      expect(sync(element)).toEqual({
        flags: { customError: true },
        message: 'Server error',
      });
    });

    it('returns to the normal validity when cleared', async () => {
      element.required = true;
      element.errorMessage = 'Server error';
      await element.updateComplete;
      element.errorMessage = '';
      await element.updateComplete;
      expect(sync(element)?.flags).toEqual({ valueMissing: true });
    });

    it('does not apply to disabled controls', async () => {
      element.disabled = true;
      element.errorMessage = 'Server error';
      await element.updateComplete;
      expect(sync(element)).toEqual({ flags: {}, message: undefined });
    });

    it('syncCustomValidity sets and clears customError', () => {
      const internals = fakeInternals();
      const asInternals = internals as unknown as ElementInternals;
      syncCustomValidity(asInternals, 'Bad', false);
      expect(last(internals.calls)).toEqual(customErrorValidity('Bad'));
      syncCustomValidity(asInternals, 'Bad', true);
      expect(last(internals.calls)?.flags).toEqual({});
      syncCustomValidity(asInternals, '', false);
      expect(last(internals.calls)?.flags).toEqual({});
      expect(() => syncCustomValidity(null, 'Bad', false)).not.toThrow();
    });
  });

  it('falls back gracefully without ElementInternals', () => {
    // happy-dom has no attachInternals; the control must still work.
    expect(() => element.checkValidity()).not.toThrow();
    expect(typeof element.checkValidity()).toBe('boolean');
  });
});
