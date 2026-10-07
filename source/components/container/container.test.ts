import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './container.js';
import type { BpContainer } from './container.js';

describe('bp-container', () => {
  let element: BpContainer;

  beforeEach(() => {
    element = document.createElement('bp-container');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  const cssText = () =>
    (
      customElements.get('bp-container') as unknown as {
        styles: Array<{ cssText: string }>;
      }
    ).styles
      .map((s) => s.cssText)
      .join('');

  it('should be registered in HTMLElementTagNameMap', () => {
    expect(customElements.get('bp-container')).toBeDefined();
  });

  it('should have correct default property values', () => {
    expect(element.size).toBe('lg');
    expect(element.gutter).toBe('md');
  });

  it('renders a default slot for its content', async () => {
    element.innerHTML = '<p>Page</p>';
    await element.updateComplete;
    expect(
      element.shadowRoot!.querySelector('slot')?.assignedElements()
    ).toHaveLength(1);
  });

  it('should set property: size and gutter and reflect them', async () => {
    element.size = 'xl';
    element.gutter = 'lg';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('xl');
    expect(element.getAttribute('gutter')).toBe('lg');
  });

  it('caps width at the breakpoint tokens', () => {
    for (const size of ['sm', 'md', 'lg', 'xl', '2xl']) {
      expect(cssText()).toContain(`var(--bp-breakpoint-${size})`);
    }
  });
});
