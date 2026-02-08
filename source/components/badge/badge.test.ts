import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './badge.js';
import type { BpBadge } from './badge.js';

describe('bp-badge', () => {
  let element: BpBadge;

  beforeEach(() => {
    element = document.createElement('bp-badge');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-badge');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render badge element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge).toBeTruthy();
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.variant).toBe('primary');
    expect(element.size).toBe('md');
    expect(element.dot).toBe(false);
  });

  // Property tests
  it('should set property: variant', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--success')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--lg')).toBe(true);
  });

  it('should set property: dot', async () => {
    element.dot = true;
    await element.updateComplete;
    expect(element.dot).toBe(true);
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--dot')).toBe(true);
  });

  // Attribute reflection tests
  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('error');
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('sm');
  });

  it('should reflect dot attribute to DOM', async () => {
    element.dot = true;
    await element.updateComplete;
    expect(element.hasAttribute('dot')).toBe(true);
  });

  // Variant tests
  it('should apply primary variant styles', async () => {
    element.variant = 'primary';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--primary')).toBe(true);
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--success')).toBe(true);
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--error')).toBe(true);
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--warning')).toBe(true);
  });

  it('should apply info variant styles', async () => {
    element.variant = 'info';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--info')).toBe(true);
  });

  it('should apply neutral variant styles', async () => {
    element.variant = 'neutral';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--neutral')).toBe(true);
  });

  // Size tests
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--sm')).toBe(true);
  });

  it('should apply medium size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--md')).toBe(true);
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--lg')).toBe(true);
  });

  // CSS Parts tests
  it('should expose badge part for styling', async () => {
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('[part="badge"]');
    expect(badge).toBeTruthy();
  });

  // Slot tests
  it('should render slotted content', async () => {
    element.textContent = 'New';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // Dot variant tests
  it('should apply dot styles when dot property is true', async () => {
    element.dot = true;
    await element.updateComplete;
    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.classList.contains('badge--dot')).toBe(true);
  });
});
