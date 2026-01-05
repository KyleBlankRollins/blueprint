import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './text.js';
import type { BpText } from './text.js';

describe('bp-text', () => {
  let element: BpText;

  beforeEach(() => {
    element = document.createElement('bp-text');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-text');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render p element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const p = element.shadowRoot!.querySelector('p');
    expect(p).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.as).toBe('p');
    expect(element.size).toBe('base');
    expect(element.weight).toBe('normal');
    expect(element.variant).toBe('default');
    expect(element.align).toBe('left');
    expect(element.italic).toBe(false);
    expect(element.truncate).toBe(false);
  });

  // Properties - as
  it('should set property: as to span', async () => {
    element.as = 'span';
    await element.updateComplete;
    expect(element.as).toBe('span');
    const span = element.shadowRoot!.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('should set property: as to div', async () => {
    element.as = 'div';
    await element.updateComplete;
    expect(element.as).toBe('div');
    const div = element.shadowRoot!.querySelector('div');
    expect(div).toBeTruthy();
  });

  // Properties - size
  it('should set property: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--sm')).toBe(true);
  });

  it('should set property: size to lg', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--lg')).toBe(true);
  });

  // Properties - weight
  it('should set property: weight', async () => {
    element.weight = 'bold';
    await element.updateComplete;
    expect(element.weight).toBe('bold');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--bold')).toBe(true);
  });

  it('should set property: weight to medium', async () => {
    element.weight = 'medium';
    await element.updateComplete;
    expect(element.weight).toBe('medium');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--medium')).toBe(true);
  });

  // Properties - variant
  it('should set property: variant', async () => {
    element.variant = 'primary';
    await element.updateComplete;
    expect(element.variant).toBe('primary');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--primary')).toBe(true);
  });

  it('should set property: variant to muted', async () => {
    element.variant = 'muted';
    await element.updateComplete;
    expect(element.variant).toBe('muted');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--muted')).toBe(true);
  });

  // Properties - align
  it('should set property: align', async () => {
    element.align = 'center';
    await element.updateComplete;
    expect(element.align).toBe('center');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--align-center')).toBe(true);
  });

  it('should set property: align to right', async () => {
    element.align = 'right';
    await element.updateComplete;
    expect(element.align).toBe('right');
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--align-right')).toBe(true);
  });

  // Properties - italic
  it('should set property: italic', async () => {
    element.italic = true;
    await element.updateComplete;
    expect(element.italic).toBe(true);
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--italic')).toBe(true);
  });

  // Properties - truncate
  it('should set property: truncate', async () => {
    element.truncate = true;
    await element.updateComplete;
    expect(element.truncate).toBe(true);
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--truncate')).toBe(true);
  });

  // Attributes
  it('should reflect as attribute to DOM', async () => {
    element.as = 'span';
    await element.updateComplete;
    expect(element.getAttribute('as')).toBe('span');
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'xl';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('xl');
  });

  it('should reflect weight attribute to DOM', async () => {
    element.weight = 'semibold';
    await element.updateComplete;
    expect(element.getAttribute('weight')).toBe('semibold');
  });

  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('error');
  });

  it('should reflect italic attribute to DOM', async () => {
    element.italic = true;
    await element.updateComplete;
    expect(element.hasAttribute('italic')).toBe(true);
  });

  // Slots
  it('should render slotted content', async () => {
    element.textContent = 'Test text content';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    const slot = text?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose text part for styling', async () => {
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('[part="text"]');
    expect(text).toBeTruthy();
  });

  // Sizes
  it('should apply xs size styles', async () => {
    element.size = 'xs';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--xs')).toBe(true);
  });

  it('should apply xl size styles', async () => {
    element.size = 'xl';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--xl')).toBe(true);
  });

  // Variants
  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--success')).toBe(true);
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--warning')).toBe(true);
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--error')).toBe(true);
  });

  // Accessibility
  it('should render semantic HTML elements', async () => {
    element.as = 'p';
    await element.updateComplete;
    const p = element.shadowRoot!.querySelector('p');
    expect(p?.tagName.toLowerCase()).toBe('p');
  });

  it('should support different semantic elements for context', async () => {
    element.as = 'span';
    await element.updateComplete;
    const span = element.shadowRoot!.querySelector('span');
    expect(span?.tagName.toLowerCase()).toBe('span');
  });

  // Edge cases
  it('should handle multiple class combinations', async () => {
    element.size = 'lg';
    element.weight = 'bold';
    element.variant = 'primary';
    element.italic = true;
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--lg')).toBe(true);
    expect(text?.classList.contains('text--bold')).toBe(true);
    expect(text?.classList.contains('text--primary')).toBe(true);
    expect(text?.classList.contains('text--italic')).toBe(true);
  });

  it('should handle truncate with long text', async () => {
    element.truncate = true;
    element.textContent = 'This is a very long text that should be truncated';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--truncate')).toBe(true);
  });

  it('should support all alignment options', async () => {
    element.align = 'justify';
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector('.text');
    expect(text?.classList.contains('text--align-justify')).toBe(true);
  });
});
