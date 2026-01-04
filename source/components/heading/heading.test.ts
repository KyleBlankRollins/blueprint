import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './heading.js';
import type { BpHeading } from './heading.js';

describe('bp-heading', () => {
  let element: BpHeading;

  beforeEach(() => {
    element = document.createElement('bp-heading');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-heading');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render h1 element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const h1 = element.shadowRoot!.querySelector('h1');
    expect(h1).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.level).toBe(1);
    expect(element.size).toBe('4xl');
    expect(element.weight).toBe('bold');
  });

  // Properties - level
  it('should set property: level', async () => {
    element.level = 2;
    await element.updateComplete;
    expect(element.level).toBe(2);
    const h2 = element.shadowRoot!.querySelector('h2');
    expect(h2).toBeTruthy();
  });

  it('should set property: level to h3', async () => {
    element.level = 3;
    await element.updateComplete;
    expect(element.level).toBe(3);
    const h3 = element.shadowRoot!.querySelector('h3');
    expect(h3).toBeTruthy();
  });

  it('should set property: level to h4', async () => {
    element.level = 4;
    await element.updateComplete;
    expect(element.level).toBe(4);
    const h4 = element.shadowRoot!.querySelector('h4');
    expect(h4).toBeTruthy();
  });

  it('should set property: level to h5', async () => {
    element.level = 5;
    await element.updateComplete;
    expect(element.level).toBe(5);
    const h5 = element.shadowRoot!.querySelector('h5');
    expect(h5).toBeTruthy();
  });

  it('should set property: level to h6', async () => {
    element.level = 6;
    await element.updateComplete;
    expect(element.level).toBe(6);
    const h6 = element.shadowRoot!.querySelector('h6');
    expect(h6).toBeTruthy();
  });

  // Properties - size
  it('should set property: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--sm')).toBe(true);
  });

  it('should set property: size to xl', async () => {
    element.size = 'xl';
    await element.updateComplete;
    expect(element.size).toBe('xl');
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--xl')).toBe(true);
  });

  // Properties - weight
  it('should set property: weight', async () => {
    element.weight = 'normal';
    await element.updateComplete;
    expect(element.weight).toBe('normal');
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--normal')).toBe(true);
  });

  it('should set property: weight to semibold', async () => {
    element.weight = 'semibold';
    await element.updateComplete;
    expect(element.weight).toBe('semibold');
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--semibold')).toBe(true);
  });

  // Attributes
  it('should reflect level attribute to DOM', async () => {
    element.level = 3;
    await element.updateComplete;
    expect(element.getAttribute('level')).toBe('3');
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'md';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('md');
  });

  it('should reflect weight attribute to DOM', async () => {
    element.weight = 'light';
    await element.updateComplete;
    expect(element.getAttribute('weight')).toBe('light');
  });

  // Slots
  it('should render slotted content', async () => {
    element.textContent = 'Test Heading';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    const slot = heading?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose heading part for styling', async () => {
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('[part="heading"]');
    expect(heading).toBeTruthy();
  });

  // Sizes
  it('should apply xs size styles', async () => {
    element.size = 'xs';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--xs')).toBe(true);
  });

  it('should apply 2xl size styles', async () => {
    element.size = '2xl';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--2xl')).toBe(true);
  });

  it('should apply 3xl size styles', async () => {
    element.size = '3xl';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--3xl')).toBe(true);
  });

  it('should apply 4xl size styles', async () => {
    element.size = '4xl';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--4xl')).toBe(true);
  });

  // Accessibility
  it('should have proper semantic HTML structure', async () => {
    element.level = 2;
    await element.updateComplete;
    const h2 = element.shadowRoot!.querySelector('h2');
    expect(h2?.tagName.toLowerCase()).toBe('h2');
  });

  it('should maintain semantic meaning with different visual sizes', async () => {
    element.level = 6;
    element.size = '4xl';
    await element.updateComplete;
    const h6 = element.shadowRoot!.querySelector('h6');
    expect(h6?.tagName.toLowerCase()).toBe('h6');
    expect(h6?.classList.contains('heading--4xl')).toBe(true);
  });

  // Edge cases
  it('should handle rapid level property changes', async () => {
    element.level = 2;
    element.level = 4;
    element.level = 1;
    await element.updateComplete;
    expect(element.level).toBe(1);
    const h1 = element.shadowRoot!.querySelector('h1');
    expect(h1).toBeTruthy();
  });

  it('should combine size and weight classes correctly', async () => {
    element.size = 'lg';
    element.weight = 'medium';
    await element.updateComplete;
    const heading = element.shadowRoot!.querySelector('.heading');
    expect(heading?.classList.contains('heading--lg')).toBe(true);
    expect(heading?.classList.contains('heading--medium')).toBe(true);
  });
});
