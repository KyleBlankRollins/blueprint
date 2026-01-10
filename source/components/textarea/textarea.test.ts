import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './textarea.js';
import type { BpTextarea } from './textarea.js';

describe('bp-textarea', () => {
  let element: BpTextarea;

  beforeEach(() => {
    element = document.createElement('bp-textarea');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-textarea');
    expect(constructor).toBeDefined();
  });

  it('should have a shadow root', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).not.toBeNull();
  });

  // Rendering
  it('should render textarea element to DOM', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  // Default values
  it('should have correct default property values', () => {
    expect(element.variant).toBe('default');
    expect(element.size).toBe('md');
    expect(element.value).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.resize).toBe('vertical');
    expect(element.spellcheck).toBe(true);
  });

  // Properties
  it('should set property: variant', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');
    const textarea = element.shadowRoot?.querySelector('.textarea--success');
    expect(textarea).toBeTruthy();
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const textarea = element.shadowRoot?.querySelector('.textarea--lg');
    expect(textarea).toBeTruthy();
  });

  it('should set property: value', async () => {
    element.value = 'test value';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('test value');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });

  it('should set property: readonly', async () => {
    element.readonly = true;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.readOnly).toBe(true);
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Enter text...';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Enter text...');
  });

  it('should set property: name', async () => {
    element.name = 'comment-field';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.name).toBe('comment-field');
  });

  it('should set property: rows', async () => {
    element.rows = 10;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('rows')).toBe('10');
  });

  it('should set property: cols', async () => {
    element.cols = 50;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('cols')).toBe('50');
  });

  it('should set property: maxlength', async () => {
    element.maxlength = 500;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(500);
  });

  it('should set property: minlength', async () => {
    element.minlength = 10;
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.minLength).toBe(10);
  });

  it('should set property: resize', async () => {
    element.resize = 'both';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      '.textarea--resize-both'
    );
    expect(textarea).toBeTruthy();
  });

  it('should set property: autocomplete', async () => {
    element.autocomplete = 'on';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.autocomplete).toBe('on');
  });

  it('should set property: spellcheck', async () => {
    element.spellcheck = false;
    await element.updateComplete;
    // When spellcheck is false, the boolean attribute is removed
    expect(element.spellcheck).toBe(false);
  });

  it('should set property: wrap', async () => {
    element.wrap = 'hard';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('wrap')).toBe('hard');
  });

  // Variants
  it('should apply default variant styles', async () => {
    element.variant = 'default';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--default');
    expect(textarea).toBeTruthy();
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--success');
    expect(textarea).toBeTruthy();
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--error');
    expect(textarea).toBeTruthy();
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--warning');
    expect(textarea).toBeTruthy();
  });

  it('should apply info variant styles', async () => {
    element.variant = 'info';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--info');
    expect(textarea).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--sm');
    expect(textarea).toBeTruthy();
  });

  it('should apply medium size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--md');
    expect(textarea).toBeTruthy();
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('.textarea--lg');
    expect(textarea).toBeTruthy();
  });

  // Resize variants
  it('should apply resize none styles', async () => {
    element.resize = 'none';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      '.textarea--resize-none'
    );
    expect(textarea).toBeTruthy();
  });

  it('should apply resize both styles', async () => {
    element.resize = 'both';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      '.textarea--resize-both'
    );
    expect(textarea).toBeTruthy();
  });

  it('should apply resize horizontal styles', async () => {
    element.resize = 'horizontal';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      '.textarea--resize-horizontal'
    );
    expect(textarea).toBeTruthy();
  });

  it('should apply resize vertical styles', async () => {
    element.resize = 'vertical';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      '.textarea--resize-vertical'
    );
    expect(textarea).toBeTruthy();
  });

  // Events
  it('should emit bp-input event on input', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const listener = vi.fn();
    element.addEventListener('bp-input', listener);

    textarea.value = 'test';
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].detail.value).toBe('test');
  });

  it('should emit bp-change event on change', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const listener = vi.fn();
    element.addEventListener('bp-change', listener);

    textarea.value = 'test';
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].detail.value).toBe('test');
  });

  it('should emit bp-focus event on focus', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const listener = vi.fn();
    element.addEventListener('bp-focus', listener);

    textarea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
  });

  it('should emit bp-blur event on blur', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const listener = vi.fn();
    element.addEventListener('bp-blur', listener);

    textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    expect(listener).toHaveBeenCalled();
  });

  // Label and helper text
  it('should render label when provided', async () => {
    element.label = 'Comment';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.textarea-label');
    expect(label?.textContent?.trim()).toContain('Comment');
  });

  it('should render required asterisk when required', async () => {
    element.label = 'Comment';
    element.required = true;
    await element.updateComplete;
    const required = element.shadowRoot?.querySelector('.textarea-required');
    expect(required?.textContent).toBe('*');
  });

  it('should render helper text', async () => {
    element.helperText = 'Enter your comment here';
    await element.updateComplete;
    const helper = element.shadowRoot?.querySelector('.textarea-message');
    expect(helper?.textContent?.trim()).toBe('Enter your comment here');
  });

  it('should render error message when variant is error', async () => {
    element.variant = 'error';
    element.errorMessage = 'Comment is required';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.textarea-message--error');
    expect(error?.textContent?.trim()).toBe('Comment is required');
  });

  it('should prioritize error message over helper text', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    element.helperText = 'Helper';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.textarea-message--error');
    const helper = element.shadowRoot?.querySelector('#helper-text');
    expect(error).toBeTruthy();
    expect(helper).toBeFalsy();
  });

  // Accessibility
  it('should have aria-invalid="true" when variant is error', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('should have aria-invalid="false" when variant is not error', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-invalid')).toBe('false');
  });

  it('should link error message with aria-describedby', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('error-message');
  });

  it('should link helper text with aria-describedby', async () => {
    element.helperText = 'Help!';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('helper-text');
  });

  it('should not have aria-describedby when no message', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.hasAttribute('aria-describedby')).toBe(false);
  });

  it('should have role="alert" on error message', async () => {
    element.variant = 'error';
    element.errorMessage = 'Error!';
    await element.updateComplete;
    const error = element.shadowRoot?.querySelector('.textarea-message--error');
    expect(error?.getAttribute('role')).toBe('alert');
  });

  // CSS Parts
  it('should expose textarea part for styling', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector('[part="textarea"]');
    expect(textarea).toBeTruthy();
  });

  // Public methods
  it('should focus the textarea when focus() is called', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const focusSpy = vi.spyOn(textarea, 'focus');
    element.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should blur the textarea when blur() is called', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const blurSpy = vi.spyOn(textarea, 'blur');
    element.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it('should select the text when select() is called', async () => {
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const selectSpy = vi.spyOn(textarea, 'select');
    element.select();
    expect(selectSpy).toHaveBeenCalled();
  });

  // Value synchronization
  it('should sync value when changed programmatically', async () => {
    element.value = 'initial';
    await element.updateComplete;
    const textarea = element.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('initial');

    element.value = 'updated';
    await element.updateComplete;
    expect(textarea.value).toBe('updated');
  });

  // Attributes
  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('error');
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('lg');
  });

  it('should reflect disabled attribute to DOM', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('should reflect readonly attribute to DOM', async () => {
    element.readonly = true;
    await element.updateComplete;
    expect(element.hasAttribute('readonly')).toBe(true);
  });

  it('should reflect required attribute to DOM', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.hasAttribute('required')).toBe(true);
  });
});
