import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './skeleton.js';
import type { BpSkeleton } from './skeleton.js';

describe('bp-skeleton', () => {
  let element: BpSkeleton;

  beforeEach(() => {
    element = document.createElement('bp-skeleton');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-skeleton');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render skeleton element to DOM', async () => {
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector('.skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should render with animated class by default', async () => {
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--animated')).toBe(true);
  });

  // Default value tests
  it('should have correct default property values', () => {
    expect(element.variant).toBe('text');
    expect(element.width).toBe('');
    expect(element.height).toBe('');
    expect(element.animated).toBe(true);
    expect(element.lines).toBe(1);
    expect(element.size).toBe('medium');
  });

  // Property tests
  it('should set property: variant', async () => {
    element.variant = 'circular';
    await element.updateComplete;
    expect(element.variant).toBe('circular');
    const skeleton = element.shadowRoot?.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--circular')).toBe(true);
  });

  it('should set property: width', async () => {
    element.width = '200px';
    await element.updateComplete;
    expect(element.width).toBe('200px');
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    const styleAttr = skeleton?.getAttribute('style');
    expect(styleAttr).toContain('--skeleton-width: 200px');
  });

  it('should set property: height', async () => {
    element.height = '100px';
    await element.updateComplete;
    expect(element.height).toBe('100px');
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    const styleAttr = skeleton?.getAttribute('style');
    expect(styleAttr).toContain('--skeleton-height: 100px');
  });

  it('should set property: animated', async () => {
    element.animated = false;
    await element.updateComplete;
    expect(element.animated).toBe(false);
    const skeleton = element.shadowRoot?.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--animated')).toBe(false);
  });

  it('should set property: lines', async () => {
    element.lines = 3;
    await element.updateComplete;
    expect(element.lines).toBe(3);
    const skeletons = element.shadowRoot?.querySelectorAll('.skeleton');
    expect(skeletons?.length).toBe(3);
  });

  it('should set property: size', async () => {
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
    const skeleton = element.shadowRoot?.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--large')).toBe(true);
  });

  // Attribute reflection tests
  it('should reflect variant attribute when property changes', async () => {
    element.variant = 'rectangular';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('rectangular');
  });

  it('should reflect animated attribute when property changes', async () => {
    element.animated = true;
    await element.updateComplete;
    expect(element.hasAttribute('animated')).toBe(true);

    element.animated = false;
    await element.updateComplete;
    expect(element.hasAttribute('animated')).toBe(false);
  });

  // Multi-line text tests
  it('should render multiple lines for text variant', async () => {
    element.variant = 'text';
    element.lines = 4;
    await element.updateComplete;
    const skeletons = element.shadowRoot?.querySelectorAll('.skeleton');
    expect(skeletons?.length).toBe(4);
  });

  it('should add last-line class to final line', async () => {
    element.variant = 'text';
    element.lines = 3;
    await element.updateComplete;
    const lastLine = element.shadowRoot?.querySelector('.skeleton--last-line');
    expect(lastLine).toBeTruthy();
  });

  it('should render lines container for multiple lines', async () => {
    element.variant = 'text';
    element.lines = 2;
    await element.updateComplete;
    const container = element.shadowRoot?.querySelector('.skeleton__lines');
    expect(container).toBeTruthy();
  });

  it('should not render lines container for single line', async () => {
    element.variant = 'text';
    element.lines = 1;
    await element.updateComplete;
    const container = element.shadowRoot?.querySelector('.skeleton__lines');
    expect(container).toBeFalsy();
  });

  // Slot tests
  it('should render slotted content', async () => {
    element.innerHTML = '<span>Custom content</span>';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS part tests
  it('should expose base part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="base"]');
    expect(part).toBeTruthy();
  });

  // Custom dimensions tests
  it('should apply custom width and height together', async () => {
    element.width = '300px';
    element.height = '50px';
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    const styleAttr = skeleton?.getAttribute('style');
    expect(styleAttr).toContain('--skeleton-width: 300px');
    expect(styleAttr).toContain('--skeleton-height: 50px');
  });

  it('should accept percentage values for width', async () => {
    element.width = '50%';
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    const styleAttr = skeleton?.getAttribute('style');
    expect(styleAttr).toContain('--skeleton-width: 50%');
  });

  it('should accept rem values for dimensions', async () => {
    element.width = '10rem';
    element.height = '2rem';
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    const styleAttr = skeleton?.getAttribute('style');
    expect(styleAttr).toContain('--skeleton-width: 10rem');
    expect(styleAttr).toContain('--skeleton-height: 2rem');
  });

  // Accessibility tests
  it('should have display block on host for proper layout', async () => {
    await element.updateComplete;
    const styles = window.getComputedStyle(element);
    expect(styles.display).toBe('block');
  });

  it('should be focusable content when providing visual loading state', async () => {
    // Skeleton is a visual indicator, not interactive
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[tabindex]')).toBeFalsy();
  });

  // Edge cases
  it('should ignore lines property for non-text variants', async () => {
    element.variant = 'circular';
    element.lines = 5;
    await element.updateComplete;
    const skeletons = element.shadowRoot?.querySelectorAll('.skeleton');
    expect(skeletons?.length).toBe(1);
  });

  it('should handle lines value of 0', async () => {
    element.variant = 'text';
    element.lines = 0;
    await element.updateComplete;
    const skeletons = element.shadowRoot?.querySelectorAll('.skeleton');
    expect(skeletons?.length).toBe(1); // Falls back to single skeleton
  });

  it('should handle empty width/height gracefully', async () => {
    element.width = '';
    element.height = '';
    await element.updateComplete;
    const skeleton = element.shadowRoot?.querySelector(
      '.skeleton'
    ) as HTMLElement;
    expect(skeleton?.getAttribute('style')).toBeFalsy();
  });
});
