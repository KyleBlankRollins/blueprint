import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './divider.js';
import type { BpDivider } from './divider.js';

describe('bp-divider', () => {
  let element: BpDivider;

  beforeEach(() => {
    element = document.createElement('bp-divider');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-divider');
    expect(constructor).toBeDefined();
    expect(constructor?.name).toBe('BpDivider');
  });

  // Rendering
  it('should render divider element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const divider = element.shadowRoot?.querySelector('.divider');
    expect(divider).toBeTruthy();
  });

  it('should render divider line elements', async () => {
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    expect(lines).toBeTruthy();
    expect(lines!.length).toBeGreaterThan(0);
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.orientation).toBe('horizontal');
    expect(element.spacing).toBe('md');
    expect(element.variant).toBe('solid');
    expect(element.color).toBe('default');
    expect(element.weight).toBe('thin');
  });

  // Properties
  it('should set property: orientation', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    expect(element.orientation).toBe('vertical');
    const divider = element.shadowRoot?.querySelector('.divider--vertical');
    expect(divider).toBeTruthy();
  });

  it('should set property: spacing', async () => {
    element.spacing = 'lg';
    await element.updateComplete;
    expect(element.spacing).toBe('lg');
    const divider = element.shadowRoot?.querySelector('.divider--spacing-lg');
    expect(divider).toBeTruthy();
  });

  // Variants
  it('should apply horizontal orientation variant', async () => {
    element.orientation = 'horizontal';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--horizontal');
    expect(divider).toBeTruthy();
  });

  it('should apply vertical orientation variant', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--vertical');
    expect(divider).toBeTruthy();
  });

  // Sizes
  it('should apply small spacing styles', async () => {
    element.spacing = 'sm';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--spacing-sm');
    expect(divider).toBeTruthy();
  });

  it('should apply medium spacing styles', async () => {
    element.spacing = 'md';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--spacing-md');
    expect(divider).toBeTruthy();
  });

  it('should apply large spacing styles', async () => {
    element.spacing = 'lg';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--spacing-lg');
    expect(divider).toBeTruthy();
  });

  // CSS Parts
  it('should expose divider part for styling', async () => {
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('[part="divider"]');
    expect(divider).toBeTruthy();
  });

  it('should expose line part for styling', async () => {
    await element.updateComplete;
    const line = element.shadowRoot?.querySelector('[part="line"]');
    expect(line).toBeTruthy();
  });

  it('should expose content part for styling', async () => {
    element.textContent = 'Section';
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('[part="content"]');
    expect(content).toBeTruthy();
  });

  // Slots
  it('should render slotted content in horizontal orientation', async () => {
    element.textContent = 'Section Break';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // Accessibility
  it('should have role="separator" for screen readers', async () => {
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider');
    expect(divider?.getAttribute('role')).toBe('separator');
  });

  it('should have aria-orientation attribute', async () => {
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider');
    expect(divider?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should update aria-orientation when orientation changes', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider');
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });

  // Interactions
  it('should render content slot for horizontal divider', async () => {
    element.orientation = 'horizontal';
    element.textContent = 'Section';
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.divider__content');
    expect(content).toBeTruthy();
  });

  it('should not render content wrapper when no content is slotted', async () => {
    element.orientation = 'horizontal';
    element.textContent = '';
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.divider__content');
    expect(content).toBeFalsy();
  });

  it('should not render content slot for vertical divider', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.divider__content');
    expect(content).toBeFalsy();
  });

  it('should render multiple lines for horizontal divider with content', async () => {
    element.orientation = 'horizontal';
    element.textContent = 'Section';
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    expect(lines!.length).toBe(2);
  });

  it('should render single line for horizontal divider without content', async () => {
    element.orientation = 'horizontal';
    element.textContent = '';
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    expect(lines!.length).toBe(1);
  });

  it('should render single line for vertical divider', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    expect(lines!.length).toBe(1);
  });

  // Edge cases
  it('should handle rapid orientation changes', async () => {
    element.orientation = 'horizontal';
    await element.updateComplete;
    element.orientation = 'vertical';
    await element.updateComplete;
    element.orientation = 'horizontal';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--horizontal');
    expect(divider).toBeTruthy();
  });

  it('should handle rapid spacing changes', async () => {
    element.spacing = 'sm';
    await element.updateComplete;
    element.spacing = 'lg';
    await element.updateComplete;
    element.spacing = 'md';
    await element.updateComplete;
    const divider = element.shadowRoot?.querySelector('.divider--spacing-md');
    expect(divider).toBeTruthy();
  });

  // Variants
  it('should set property: variant', async () => {
    element.variant = 'dashed';
    await element.updateComplete;
    expect(element.variant).toBe('dashed');
    const lines = element.shadowRoot?.querySelectorAll(
      '.divider__line--dashed'
    );
    expect(lines!.length).toBeGreaterThan(0);
  });

  it('should apply dashed variant styles', async () => {
    element.variant = 'dashed';
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    lines?.forEach((line) => {
      expect(line.classList.contains('divider__line--dashed')).toBe(true);
    });
  });

  it('should apply dotted variant styles', async () => {
    element.variant = 'dotted';
    await element.updateComplete;
    const lines = element.shadowRoot?.querySelectorAll('.divider__line');
    lines?.forEach((line) => {
      expect(line.classList.contains('divider__line--dotted')).toBe(true);
    });
  });

  it('should set property: color', async () => {
    element.color = 'accent';
    await element.updateComplete;
    expect(element.color).toBe('accent');
    expect(element.getAttribute('color')).toBe('accent');
  });

  it('should apply subtle color variant', async () => {
    element.color = 'subtle';
    await element.updateComplete;
    expect(element.getAttribute('color')).toBe('subtle');
  });

  it('should apply accent color variant', async () => {
    element.color = 'accent';
    await element.updateComplete;
    expect(element.getAttribute('color')).toBe('accent');
  });

  it('should set property: weight', async () => {
    element.weight = 'thick';
    await element.updateComplete;
    expect(element.weight).toBe('thick');
    expect(element.getAttribute('weight')).toBe('thick');
  });

  it('should apply thin weight variant', async () => {
    element.weight = 'thin';
    await element.updateComplete;
    expect(element.getAttribute('weight')).toBe('thin');
  });

  it('should apply medium weight variant', async () => {
    element.weight = 'medium';
    await element.updateComplete;
    expect(element.getAttribute('weight')).toBe('medium');
  });

  it('should apply thick weight variant', async () => {
    element.weight = 'thick';
    await element.updateComplete;
    expect(element.getAttribute('weight')).toBe('thick');
  });

  it('should reflect properties to attributes', async () => {
    element.orientation = 'vertical';
    element.spacing = 'sm';
    element.variant = 'dashed';
    element.color = 'accent';
    element.weight = 'medium';
    await element.updateComplete;
    expect(element.getAttribute('orientation')).toBe('vertical');
    expect(element.getAttribute('spacing')).toBe('sm');
    expect(element.getAttribute('variant')).toBe('dashed');
    expect(element.getAttribute('color')).toBe('accent');
    expect(element.getAttribute('weight')).toBe('medium');
  });
});
