import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './multi-select.js';
import type { BpMultiSelect } from './multi-select.js';

describe('bp-multi-select', () => {
  let element: BpMultiSelect;

  beforeEach(() => {
    element = document.createElement('bp-multi-select');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-multi-select');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render multi-select element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const control = element.shadowRoot?.querySelector('.multi-select__control');
    expect(control).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toEqual([]);
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('Select options');
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.size).toBe('md');
    expect(element.variant).toBe('default');
    expect(element.maxSelections).toBe(0);
    expect(element.clearable).toBe(true);
  });

  // Properties
  it('should set property: value', async () => {
    const option1 = document.createElement('option');
    option1.value = 'option1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'option2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);

    element.value = ['option1', 'option2'];
    await element.updateComplete;

    expect(element.value).toEqual(['option1', 'option2']);
    const tags = element.shadowRoot?.querySelectorAll('.multi-select__tag');
    expect(tags?.length).toBe(2);
  });

  it('should set property: name', async () => {
    element.name = 'test-name';
    await element.updateComplete;
    expect(element.name).toBe('test-name');
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Choose items';
    await element.updateComplete;
    expect(element.placeholder).toBe('Choose items');
    const placeholder = element.shadowRoot?.querySelector(
      '.multi-select__placeholder'
    );
    expect(placeholder?.textContent).toBe('Choose items');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const control = element.shadowRoot?.querySelector('.multi-select__control');
    expect(control?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const multiSelect = element.shadowRoot?.querySelector('.multi-select');
    expect(multiSelect?.classList.contains('multi-select--lg')).toBe(true);
  });

  it('should set property: maxSelections', async () => {
    element.maxSelections = 3;
    await element.updateComplete;
    expect(element.maxSelections).toBe(3);
  });

  it('should set property: clearable', async () => {
    element.clearable = false;
    await element.updateComplete;
    expect(element.clearable).toBe(false);
  });

  it('should set property: variant', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.variant).toBe('error');
    expect(element.getAttribute('variant')).toBe('error');

    const multiSelect = element.shadowRoot?.querySelector('.multi-select');
    expect(multiSelect?.classList.contains('multi-select--error')).toBe(true);
  });

  // Events
  it('should emit bp-change event when option selected', async () => {
    // Add options
    const option1 = document.createElement('option');
    option1.value = 'opt1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);
    await element.updateComplete;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    // Open dropdown
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    // Click option
    const optionEl = element.shadowRoot?.querySelector(
      '.multi-select__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(changeEvent).toBeTruthy();
    expect(changeEvent!.detail.value).toEqual(['opt1']);
  });

  it('should emit bp-change event with previous value', async () => {
    element.value = ['opt1'];
    const option2 = document.createElement('option');
    option2.value = 'opt2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);
    await element.updateComplete;

    let changeEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      changeEvent = e as CustomEvent;
    });

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.multi-select__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(changeEvent!.detail.previousValue).toEqual(['opt1']);
    expect(changeEvent!.detail.value).toEqual(['opt1', 'opt2']);
  });

  // Event composition
  it('should dispatch bp-change with bubbles and composed flags', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    let capturedEvent: CustomEvent<Record<string, unknown>> | null = null;
    element.addEventListener('bp-change', (e) => {
      capturedEvent = e as CustomEvent;
    });

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.multi-select__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(capturedEvent!.bubbles).toBe(true);
    expect(capturedEvent!.composed).toBe(true);
  });

  // CSS Parts
  it('should expose control part for styling', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('[part~="control"]');
    expect(control).toBeTruthy();
  });

  it('should expose dropdown part for styling', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;
    const dropdown = element.shadowRoot?.querySelector('[part~="dropdown"]');
    expect(dropdown).toBeTruthy();
  });

  it('should expose tag part for styling', async () => {
    element.value = ['opt1'];
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const tag = element.shadowRoot?.querySelector('[part~="tag"]');
    expect(tag).toBeTruthy();
  });

  it('should expose clear-button part for styling', async () => {
    element.value = ['opt1'];
    await element.updateComplete;
    const clearBtn = element.shadowRoot?.querySelector(
      '[part~="clear-button"]'
    );
    expect(clearBtn).toBeTruthy();
  });

  // Sizes
  it('should apply size variant classes', async () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;
      const multiSelect = element.shadowRoot?.querySelector('.multi-select');
      expect(multiSelect?.classList.contains(`multi-select--${size}`)).toBe(
        true
      );
    }
  });

  // Interactions
  it('should open dropdown on click', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    control.click();
    await element.updateComplete;

    const multiSelect = element.shadowRoot?.querySelector('.multi-select');
    expect(multiSelect?.classList.contains('multi-select--open')).toBe(true);
  });

  it('should close dropdown on escape key press', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    // Open dropdown
    control.click();
    await element.updateComplete;
    expect(
      element.shadowRoot
        ?.querySelector('.multi-select')
        ?.classList.contains('multi-select--open')
    ).toBe(true);

    // Press escape
    const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
    control.dispatchEvent(event);
    await element.updateComplete;

    expect(
      element.shadowRoot
        ?.querySelector('.multi-select')
        ?.classList.contains('multi-select--open')
    ).toBe(false);
  });

  it('should select option on keyboard enter', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    // Open dropdown with arrow down
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    control.dispatchEvent(downEvent);
    await element.updateComplete;

    // Select with enter
    const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' });
    control.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.value).toEqual(['opt1']);
  });

  it('should remove tag when clicking remove button', async () => {
    element.value = ['opt1'];
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const removeBtn = element.shadowRoot?.querySelector(
      '.multi-select__tag-remove'
    ) as HTMLElement;
    removeBtn.click();
    await element.updateComplete;

    expect(element.value).toEqual([]);
  });

  it('should clear all selections when clicking clear button', async () => {
    element.value = ['opt1', 'opt2'];
    await element.updateComplete;

    const clearBtn = element.shadowRoot?.querySelector(
      '.multi-select__clear'
    ) as HTMLElement;
    clearBtn.click();
    await element.updateComplete;

    expect(element.value).toEqual([]);
  });

  it('should deselect option when clicking selected option', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    element.value = ['opt1'];
    await element.updateComplete;

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    const optionEl = element.shadowRoot?.querySelector(
      '.multi-select__option'
    ) as HTMLElement;
    optionEl.click();
    await element.updateComplete;

    expect(element.value).toEqual([]);
  });

  it('should respect maxSelections limit', async () => {
    element.maxSelections = 2;

    const option1 = document.createElement('option');
    option1.value = 'opt1';
    option1.textContent = 'Option 1';
    element.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'opt2';
    option2.textContent = 'Option 2';
    element.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = 'opt3';
    option3.textContent = 'Option 3';
    element.appendChild(option3);

    await element.updateComplete;

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    // Select first two options
    const options = element.shadowRoot?.querySelectorAll(
      '.multi-select__option'
    );
    (options?.[0] as HTMLElement)?.click();
    await element.updateComplete;
    (options![1] as HTMLElement).click();
    await element.updateComplete;

    expect(element.value).toEqual(['opt1', 'opt2']);

    // Try to select third - should be prevented
    (options![2] as HTMLElement).click();
    await element.updateComplete;

    expect(element.value).toEqual(['opt1', 'opt2']);
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

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll(
      '.multi-select__option'
    );
    expect(options?.length).toBe(2);
  });

  // Accessibility
  it('should have aria-haspopup attribute', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('.multi-select__control');
    expect(control?.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should have aria-expanded attribute reflecting dropdown state', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    expect(control.getAttribute('aria-expanded')).toBe('false');

    control.click();
    await element.updateComplete;

    expect(control.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('.multi-select__control');
    expect(control?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role combobox on control', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector('.multi-select__control');
    expect(control?.getAttribute('role')).toBe('combobox');
  });

  it('should have role listbox on options container', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;
    const optionsList = element.shadowRoot?.querySelector(
      '.multi-select__options'
    );
    expect(optionsList?.getAttribute('role')).toBe('listbox');
  });

  it('should have aria-multiselectable on listbox', async () => {
    await element.updateComplete;
    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;
    control.click();
    await element.updateComplete;
    const optionsList = element.shadowRoot?.querySelector(
      '.multi-select__options'
    );
    expect(optionsList?.getAttribute('aria-multiselectable')).toBe('true');
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

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    // Open with arrow down
    const downEvent = new window.KeyboardEvent('keydown', { key: 'ArrowDown' });
    control.dispatchEvent(downEvent);
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector(
      '.multi-select__option'
    );
    expect(
      firstOption?.classList.contains('multi-select__option--focused')
    ).toBe(true);

    // Navigate to second option
    control.dispatchEvent(downEvent);
    await element.updateComplete;

    const options = element.shadowRoot?.querySelectorAll(
      '.multi-select__option'
    );
    expect(
      options?.[1]?.classList.contains('multi-select__option--focused')
    ).toBe(true);
  });

  it('should reset focus index when closing dropdown', async () => {
    const option = document.createElement('option');
    option.value = 'opt1';
    option.textContent = 'Option 1';
    element.appendChild(option);
    await element.updateComplete;

    const control = element.shadowRoot?.querySelector(
      '.multi-select__control'
    ) as HTMLElement;

    // Open dropdown and focus an option
    control.click();
    await element.updateComplete;

    // Close with escape
    const escapeEvent = new window.KeyboardEvent('keydown', { key: 'Escape' });
    control.dispatchEvent(escapeEvent);
    await element.updateComplete;

    // Reopen and verify focus starts at first option again
    control.click();
    await element.updateComplete;

    const firstOption = element.shadowRoot?.querySelector(
      '.multi-select__option'
    );
    expect(
      firstOption?.classList.contains('multi-select__option--focused')
    ).toBe(true);
  });

  it('should show placeholder when value is empty', async () => {
    element.value = [];
    element.placeholder = 'Choose items';
    await element.updateComplete;

    const placeholder = element.shadowRoot?.querySelector(
      '.multi-select__placeholder'
    );
    expect(placeholder).toBeTruthy();
    expect(placeholder?.textContent).toBe('Choose items');

    const tags = element.shadowRoot?.querySelectorAll('.multi-select__tag');
    expect(tags?.length).toBe(0);
  });
});
