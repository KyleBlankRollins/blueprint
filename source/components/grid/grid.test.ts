import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './grid.js';
import type { BpGrid } from './grid.js';

describe('bp-grid', () => {
  let element: BpGrid;

  beforeEach(() => {
    element = document.createElement('bp-grid');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  const template = () =>
    element.style.getPropertyValue('--_bp-grid-template').trim();

  it('should be registered in HTMLElementTagNameMap', () => {
    expect(customElements.get('bp-grid')).toBeDefined();
  });

  it('should have correct default property values', () => {
    expect(element.columns).toBe(1);
    expect(element.minColumnWidth).toBe('');
    expect(element.gap).toBe('md');
    expect(element.align).toBe('stretch');
  });

  it('renders a default slot for its children', async () => {
    element.innerHTML = '<div>A</div><div>B</div><div>C</div>';
    await element.updateComplete;
    expect(
      element.shadowRoot!.querySelector('slot')?.assignedElements()
    ).toHaveLength(3);
  });

  it('should set property: columns to a fixed column template', async () => {
    element.columns = 3;
    await element.updateComplete;
    expect(template()).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('should set property: minColumnWidth to an auto-fit template', async () => {
    element.columns = 4;
    element.minColumnWidth = '16rem';
    await element.updateComplete;
    expect(template()).toBe('repeat(auto-fit, minmax(min(16rem, 100%), 1fr))');
  });

  it('falls back to one column for invalid column counts', async () => {
    element.columns = 0;
    await element.updateComplete;
    expect(template()).toBe('repeat(1, minmax(0, 1fr))');
  });

  it('should reflect attributes', async () => {
    element.columns = 2;
    element.minColumnWidth = '200px';
    element.gap = 'lg';
    element.align = 'center';
    await element.updateComplete;
    expect(element.getAttribute('columns')).toBe('2');
    expect(element.getAttribute('min-column-width')).toBe('200px');
    expect(element.getAttribute('gap')).toBe('lg');
    expect(element.getAttribute('align')).toBe('center');
  });

  it('reads attributes set in markup', async () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = '<bp-grid columns="4" gap="xs"></bp-grid>';
    document.body.appendChild(wrap);
    const grid = wrap.querySelector('bp-grid')!;
    await grid.updateComplete;
    expect(grid.columns).toBe(4);
    expect(grid.style.getPropertyValue('--_bp-grid-template').trim()).toBe(
      'repeat(4, minmax(0, 1fr))'
    );
    wrap.remove();
  });
});
