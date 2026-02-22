import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './icon.js';
import type { BpIcon } from './icon.js';
import './icons/all.js';

describe('bp-icon', () => {
  let element: BpIcon;

  beforeEach(() => {
    element = document.createElement('bp-icon');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-icon');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render icon container to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.name).toBe('');
    expect(element.size).toBe('md');
    expect(element.color).toBe('default');
    expect(element.ariaLabel).toBe('');
  });

  // Properties - Size
  it('should set property: size to xs', async () => {
    element.size = 'xs';
    await element.updateComplete;
    expect(element.size).toBe('xs');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--xs');
  });

  it('should set property: size to sm', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--sm');
  });

  it('should set property: size to md', async () => {
    element.size = 'md';
    await element.updateComplete;
    expect(element.size).toBe('md');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--md');
  });

  it('should set property: size to lg', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--lg');
  });

  it('should set property: size to xl', async () => {
    element.size = 'xl';
    await element.updateComplete;
    expect(element.size).toBe('xl');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--xl');
  });

  it('should set property: size to 2xl', async () => {
    element.size = '2xl';
    await element.updateComplete;
    expect(element.size).toBe('2xl');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--2xl');
  });

  it('should set property: size to 3xl', async () => {
    element.size = '3xl';
    await element.updateComplete;
    expect(element.size).toBe('3xl');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--3xl');
  });

  it('should set property: size to 4xl', async () => {
    element.size = '4xl';
    await element.updateComplete;
    expect(element.size).toBe('4xl');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--4xl');
  });

  it('should set property: size to full', async () => {
    element.size = 'full';
    await element.updateComplete;
    expect(element.size).toBe('full');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--full');
  });

  // Properties - Color
  it('should set property: color to default', async () => {
    element.color = 'default';
    await element.updateComplete;
    expect(element.color).toBe('default');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--default');
  });

  it('should set property: color to primary', async () => {
    element.color = 'primary';
    await element.updateComplete;
    expect(element.color).toBe('primary');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--primary');
  });

  it('should set property: color to success', async () => {
    element.color = 'success';
    await element.updateComplete;
    expect(element.color).toBe('success');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--success');
  });

  it('should set property: color to warning', async () => {
    element.color = 'warning';
    await element.updateComplete;
    expect(element.color).toBe('warning');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--warning');
  });

  it('should set property: color to error', async () => {
    element.color = 'error';
    await element.updateComplete;
    expect(element.color).toBe('error');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--error');
  });

  it('should set property: color to muted', async () => {
    element.color = 'muted';
    await element.updateComplete;
    expect(element.color).toBe('muted');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.className).toContain('icon--muted');
  });

  // Properties - Aria Label
  it('should set property: ariaLabel', async () => {
    element.ariaLabel = 'Settings icon';
    await element.updateComplete;
    expect(element.ariaLabel).toBe('Settings icon');

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.getAttribute('aria-label')).toBe('Settings icon');
  });

  // Properties - Name (Icon Registry)
  it('should set property: name', async () => {
    element.name = 'create';
    await element.updateComplete;
    expect(element.name).toBe('create');
  });

  it('should render icon from registry when name is provided', async () => {
    element.name = 'create';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    const svg = icon?.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render different icons based on name', async () => {
    element.name = 'check';
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('.icon');
    const svg1 = icon?.querySelector('svg');
    expect(svg1).toBeTruthy();

    element.name = 'heart';
    await element.updateComplete;
    const svg2 = icon?.querySelector('svg');
    expect(svg2).toBeTruthy();
  });

  it('should fallback to slot when name is empty', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    element.appendChild(svg);

    element.name = '';
    await element.updateComplete;

    const slottedElements = element.querySelectorAll('svg');
    expect(slottedElements.length).toBe(1);
    expect(slottedElements[0]).toBe(svg);
  });

  it('should prefer named icon over slot content', async () => {
    const customSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    customSvg.setAttribute('data-custom', 'true');
    element.appendChild(customSvg);

    element.name = 'create';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    const renderedSvg = icon?.querySelector('svg');
    expect(renderedSvg?.hasAttribute('data-custom')).toBe(false);
  });

  // Slots
  it('should render slotted SVG content', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 2L2 7v10c0 5.5 3.8 10.6 10 12');
    svg.appendChild(path);
    element.appendChild(svg);

    await element.updateComplete;

    const slottedElements = element.querySelectorAll('svg');
    expect(slottedElements.length).toBe(1);
    expect(slottedElements[0]).toBe(svg);
  });

  // CSS Parts
  it('should expose icon part for custom styling', async () => {
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('part')).toBe('icon');
  });

  // Accessibility - Role
  it('should have role="img" when aria-label is provided', async () => {
    element.ariaLabel = 'Warning icon';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.getAttribute('role')).toBe('img');
  });

  it('should have role="presentation" when aria-label is empty', async () => {
    element.ariaLabel = '';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.getAttribute('role')).toBe('presentation');
  });

  // Accessibility - ARIA Label
  it('should have aria-label when provided', async () => {
    element.ariaLabel = 'User profile icon';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.getAttribute('aria-label')).toBe('User profile icon');
  });

  it('should not have aria-label attribute when empty', async () => {
    element.ariaLabel = '';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.hasAttribute('aria-label')).toBe(false);
  });

  // Size variants (visual verification)
  it('should apply xs size styles', async () => {
    element.size = 'xs';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--xs')).toBe(true);
  });

  it('should apply sm size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--sm')).toBe(true);
  });

  it('should apply md size styles', async () => {
    element.size = 'md';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--md')).toBe(true);
  });

  it('should apply lg size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--lg')).toBe(true);
  });

  it('should apply xl size styles', async () => {
    element.size = 'xl';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--xl')).toBe(true);
  });

  it('should apply 2xl size styles', async () => {
    element.size = '2xl';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--2xl')).toBe(true);
  });

  it('should apply 3xl size styles', async () => {
    element.size = '3xl';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--3xl')).toBe(true);
  });

  it('should apply 4xl size styles', async () => {
    element.size = '4xl';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--4xl')).toBe(true);
  });

  // Color variants (visual verification)
  it('should apply default color styles', async () => {
    element.color = 'default';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--default')).toBe(true);
  });

  it('should apply primary color styles', async () => {
    element.color = 'primary';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--primary')).toBe(true);
  });

  it('should apply success color styles', async () => {
    element.color = 'success';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--success')).toBe(true);
  });

  it('should apply warning color styles', async () => {
    element.color = 'warning';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--warning')).toBe(true);
  });

  it('should apply error color styles', async () => {
    element.color = 'error';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--error')).toBe(true);
  });

  it('should apply muted color styles', async () => {
    element.color = 'muted';
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.icon');
    expect(icon?.classList.contains('icon--muted')).toBe(true);
  });
});
