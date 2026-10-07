import { describe, it, expect } from 'vitest';
import { render, html } from 'lit';
import {
  fieldMessageState,
  renderFieldMessage,
  HELPER_TEXT_ID,
  ERROR_MESSAGE_ID,
} from './field-message.js';

describe('fieldMessageState', () => {
  it('is valid with nothing to show by default', () => {
    expect(fieldMessageState({})).toEqual({
      invalid: false,
      describedBy: undefined,
      showError: false,
      showHelper: false,
    });
  });

  it('describes the control with the helper text', () => {
    const s = fieldMessageState({ helperText: 'Hint' });
    expect(s.showHelper).toBe(true);
    expect(s.describedBy).toBe(HELPER_TEXT_ID);
    expect(s.invalid).toBe(false);
  });

  it('lets the error replace the helper text and marks invalid', () => {
    const s = fieldMessageState({ helperText: 'Hint', errorMessage: 'Bad' });
    expect(s.showHelper).toBe(false);
    expect(s.showError).toBe(true);
    expect(s.describedBy).toBe(ERROR_MESSAGE_ID);
    expect(s.invalid).toBe(true);
  });

  it('can be invalid without a message', () => {
    const s = fieldMessageState({ helperText: 'Hint', invalid: true });
    expect(s.invalid).toBe(true);
    expect(s.showHelper).toBe(true);
    expect(s.describedBy).toBe(HELPER_TEXT_ID);
  });
});

describe('renderFieldMessage', () => {
  const mount = (tpl: unknown) => {
    const host = document.createElement('div');
    render(html`${tpl}`, host);
    return host;
  };

  it('renders the error with role="alert" and extra parts', () => {
    const host = mount(renderFieldMessage({ errorMessage: 'Bad' }, 'message'));
    const el = host.querySelector(`#${ERROR_MESSAGE_ID}`);
    expect(el?.getAttribute('role')).toBe('alert');
    expect(el?.getAttribute('part')).toBe('error-message message');
    expect(el?.classList.contains('field-message--error')).toBe(true);
  });

  it('renders the helper text', () => {
    const host = mount(renderFieldMessage({ helperText: 'Hint' }));
    const el = host.querySelector(`#${HELPER_TEXT_ID}`);
    expect(el?.textContent?.trim()).toBe('Hint');
    expect(el?.getAttribute('part')).toBe('helper-text');
  });

  it('renders nothing without text', () => {
    const host = mount(renderFieldMessage({ invalid: true }));
    expect(host.querySelector('.field-message')).toBeNull();
  });
});
