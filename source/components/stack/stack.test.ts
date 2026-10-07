import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './stack.js';
import type { BpStack } from './stack.js';

describe('bp-stack', () => {
  let element: BpStack;

  beforeEach(() => {
    element = document.createElement('bp-stack');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should be registered in HTMLElementTagNameMap', () => {
    expect(customElements.get('bp-stack')).toBeDefined();
  });

  it('should have correct default property values', () => {
    expect(element.direction).toBe('vertical');
    expect(element.gap).toBe('md');
    expect(element.align).toBe('stretch');
    expect(element.justify).toBe('start');
    expect(element.wrap).toBe(false);
  });

  it('renders a default slot for its children', async () => {
    element.innerHTML = '<div>One</div><div>Two</div>';
    await element.updateComplete;
    const slot = element.shadowRoot!.querySelector('slot');
    expect(slot?.assignedElements()).toHaveLength(2);
  });

  it('should set property: direction, gap, align, justify, wrap', async () => {
    element.direction = 'horizontal';
    element.gap = 'xs';
    element.align = 'center';
    element.justify = 'between';
    element.wrap = true;
    await element.updateComplete;
    expect(element.direction).toBe('horizontal');
    expect(element.gap).toBe('xs');
  });

  it('should reflect layout properties as attributes for styling', async () => {
    element.direction = 'horizontal';
    element.gap = 'lg';
    element.align = 'center';
    element.justify = 'between';
    element.wrap = true;
    await element.updateComplete;
    expect(element.getAttribute('direction')).toBe('horizontal');
    expect(element.getAttribute('gap')).toBe('lg');
    expect(element.getAttribute('align')).toBe('center');
    expect(element.getAttribute('justify')).toBe('between');
    expect(element.hasAttribute('wrap')).toBe(true);
  });

  it('reads attributes set in markup', async () => {
    const fresh = document.createElement('div');
    fresh.innerHTML =
      '<bp-stack direction="horizontal" gap="none" wrap></bp-stack>';
    document.body.appendChild(fresh);
    const stack = fresh.querySelector('bp-stack')!;
    await stack.updateComplete;
    expect(stack.direction).toBe('horizontal');
    expect(stack.gap).toBe('none');
    expect(stack.wrap).toBe(true);
    fresh.remove();
  });

  it('maps every gap to a spacing token in its styles', () => {
    const css = (
      customElements.get('bp-stack') as unknown as {
        styles: Array<{ cssText: string }>;
      }
    ).styles
      .map((s) => s.cssText)
      .join('');
    for (const gap of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']) {
      expect(css).toContain(`var(--bp-spacing-${gap})`);
    }
  });
});
