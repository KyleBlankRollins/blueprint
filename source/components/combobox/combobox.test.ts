import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './combobox.js';
import type { BpCombobox } from './combobox.js';

describe('bp-combobox', () => {
  let element: BpCombobox;

  beforeEach(() => {
    element = document.createElement('bp-combobox');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-combobox');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render combobox element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const control = element.shadowRoot?.querySelector('.combobox__control');
    expect(control).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe('');
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('Search or select...');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.size).toBe('medium');
    expect(element.variant).toBe('default');
    expect(element.allowCustomValue).toBe(false);
  });

  // Properties
  it('should set property: placeholder', async () => {
    element.placeholder = 'Type to search';
    await element.updateComplete;
    expect(element.placeholder).toBe('Type to search');
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.getAttribute('placeholder')).toBe('Type to search');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('should set property: variant', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.variant).toBe('error');
    expect(element.getAttribute('variant')).toBe('error');
    const combobox = element.shadowRoot?.querySelector('.combobox');
    expect(combobox?.classList.contains('combobox--error')).toBe(true);
  });

  // Events
  it('should emit bp-change event when option selected', async () => {
    const option1 = document.createElement('option');
    option1.value = 'opt1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);
    await element.updateComplete;

    let changeEvent: CustomEvent | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    // Open dropdown
    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    // Click option
    const optionEl = element.shadowRoot?.querySelector(
      '.combobox__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(changeEvent?.detail.value).toBe('opt1');
    expect(changeEvent?.detail.label).toBe('Option 1');
  });

  it('should emit bp-change event with previous value', async () => {
    element.value = 'opt1';
    const option2 = document.createElement('option');
    option2.value = 'opt2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);
    await element.updateComplete;

    let changeEvent: CustomEvent | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.combobox__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(changeEvent?.detail.previousValue).toBe('opt1');
    expect(changeEvent?.detail.value).toBe('opt2');
  });

  it('should emit bp-change event when custom value entered and allowCustomValue is true', async () => {
    element.allowCustomValue = true;
    await element.updateComplete;

    let changeEvent: CustomEvent | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.value = 'custom text';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(changeEvent?.detail.value).toBe('custom text');
  });

  // Event composition
  it('should dispatch bp-change with bubbles and composed flags', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    let capturedEvent: CustomEvent | null = null;
    element.addEventListener('bp-change', (e) => {
      capturedEvent = e as CustomEvent;
    });

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.combobox__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(capturedEvent?.bubbles).toBe(true);
    expect(capturedEvent?.composed).toBe(true);
  });

  // CSS Parts
  it('should expose control part for styling', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('[part~="control"]');
    expect(control).toBeTruthy();
  });

  it('should expose input part for styling', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('[part~="input"]');
    expect(input).toBeTruthy();
  });

  it('should expose dropdown part for styling', async () => {
    await element.updateComplete;
    const dropdown = element.shadowRoot?.querySelector('[part~="dropdown"]');
    expect(dropdown).toBeTruthy();
  });

  it('should expose clear-button part for styling', async () => {
    element.value = 'test';
    await element.updateComplete;
    const clearBtn = element.shadowRoot?.querySelector(
      '[part~="clear-button"]'
    );
    expect(clearBtn).toBeTruthy();
  });

  it('should expose indicator part for styling', async () => {
    await element.updateComplete;
    const indicator = element.shadowRoot?.querySelector('[part~="indicator"]');
    expect(indicator).toBeTruthy();
  });

  // Slots
  it('should render slotted option elements', async () => {
    const option1 = document.createElement('option');
    option1.value = 'opt1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'opt2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);

    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLElement;
    input.click();
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll(
      '.combobox__option:not(.combobox__option--empty)'
    );
    expect(options?.length).toBe(2);
  });

  // Sizes
  it('should apply size variant classes', async () => {
    const sizes: Array<'small' | 'medium' | 'large'> = [
      'small',
      'medium',
      'large',
    ];

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;
      const combobox = element.shadowRoot?.querySelector('.combobox');
      expect(combobox?.classList.contains(`combobox--${size}`)).toBe(true);
    }
  });

  // Interactions
  it('should open dropdown on input focus', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    input.focus();
    await element.updateComplete;

    const combobox = element.shadowRoot?.querySelector('.combobox');
    expect(combobox?.classList.contains('combobox--open')).toBe(true);
  });

  it('should open dropdown on input click', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLElement;

    input.click();
    await element.updateComplete;

    const combobox = element.shadowRoot?.querySelector('.combobox');
    expect(combobox?.classList.contains('combobox--open')).toBe(true);
  });

  it('should close dropdown on escape key press', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    // Open dropdown
    input.click();
    await element.updateComplete;
    expect(
      element.shadowRoot
        ?.querySelector('.combobox')
        ?.classList.contains('combobox--open')
    ).toBe(true);

    // Press escape
    const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
    input.dispatchEvent(event);
    await element.updateComplete;

    expect(
      element.shadowRoot
        ?.querySelector('.combobox')
        ?.classList.contains('combobox--open')
    ).toBe(false);
  });

  it('should select option on keyboard enter', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    // Open dropdown with arrow down
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    // Select with enter
    const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.value).toBe('opt1');
  });

  it('should clear value when clicking clear button', async () => {
    element.value = 'test';
    await element.updateComplete;

    const clearBtn = element.shadowRoot?.querySelector(
      '.combobox__clear'
    ) as HTMLElement;
    clearBtn.click();
    await element.updateComplete;

    expect(element.value).toBe('');
  });

  it('should filter options based on search text', async () => {
    const option1 = document.createElement('option');
    option1.value = 'apple';
    option1.textContent = 'Apple';
    element.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'banana';
    option2.textContent = 'Banana';
    element.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = 'apricot';
    option3.textContent = 'Apricot';
    element.appendChild(option3);

    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    // Should only show Apple and Apricot
    const options = element.shadowRoot?.querySelectorAll(
      '.combobox__option:not(.combobox__option--empty)'
    );
    expect(options?.length).toBe(2);
  });

  it('should show "No results found" when filter returns no matches', async () => {
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test Option';
    element.appendChild(option);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.value = 'xyz';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    const emptyOption = element.shadowRoot?.querySelector(
      '.combobox__option--empty'
    );
    expect(emptyOption).toBeTruthy();
    expect(emptyOption?.textContent?.trim()).toBe('No results found');
  });

  it('should update input text when option is selected', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;
    input.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.combobox__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(input.value).toBe('Option 1');
  });

  it('should restore selected label when dropdown closes without selection', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    element.value = 'opt1';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    // Type something different
    input.value = 'something else';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    // Close dropdown with Escape
    const escapeEvent = new window.KeyboardEvent('keydown', { key: 'Escape' });
    input.dispatchEvent(escapeEvent);
    await element.updateComplete;

    // Should restore to "Option 1"
    expect(input.value).toBe('Option 1');
  });

  // Accessibility
  it('should have aria-haspopup attribute', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should have aria-expanded attribute reflecting dropdown state', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    expect(input.getAttribute('aria-expanded')).toBe('false');

    input.click();
    await element.updateComplete;

    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role combobox on input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.getAttribute('role')).toBe('combobox');
  });

  it('should have role listbox on options container', async () => {
    await element.updateComplete;
    const optionsList = element.shadowRoot?.querySelector('.combobox__options');
    expect(optionsList?.getAttribute('role')).toBe('listbox');
  });

  it('should have aria-autocomplete attribute', async () => {
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('.combobox__input');
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');
  });

  it('should support keyboard navigation with arrow keys', async () => {
    const option1 = document.createElement('option');
    option1.value = 'opt1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'opt2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);

    await element.updateComplete;

    const input = element.shadowRoot?.querySelector(
      '.combobox__input'
    ) as HTMLInputElement;

    // Open with arrow down
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector('.combobox__option');
    expect(firstOption?.classList.contains('combobox__option--focused')).toBe(
      true
    );

    // Navigate to second option
    input.dispatchEvent(downEvent);
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll(
      '.combobox__option:not(.combobox__option--empty)'
    );
    expect(options?.[1]?.classList.contains('combobox__option--focused')).toBe(
      true
    );
  });

  it('should have clear button with descriptive aria-label', async () => {
    element.value = 'test';
    await element.updateComplete;
    const clearBtn = element.shadowRoot?.querySelector('.combobox__clear');
    expect(clearBtn?.getAttribute('aria-label')).toBe('Clear selection');
  });
});
