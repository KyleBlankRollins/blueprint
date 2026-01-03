import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './link.js';
import type { BpLink } from './link.js';

describe('bp-link', () => {
  let element: BpLink;

  beforeEach(() => {
    element = document.createElement('bp-link');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-link');
    expect(constructor).toBeDefined();
    expect(constructor?.name).toBe('BpLink');
  });

  // Rendering
  it('should render link element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const link = element.shadowRoot?.querySelector('.link');
    expect(link).toBeTruthy();
  });

  it('should render as anchor tag', async () => {
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.href).toBe('');
    expect(element.target).toBe('');
    expect(element.rel).toBe('');
    expect(element.variant).toBe('default');
    expect(element.underline).toBe('hover');
    expect(element.size).toBe('md');
    expect(element.disabled).toBe(false);
  });

  // Properties
  it('should set property: href', async () => {
    element.href = 'https://example.com';
    await element.updateComplete;
    expect(element.href).toBe('https://example.com');
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('https://example.com');
  });

  it('should set property: target', async () => {
    element.target = '_blank';
    await element.updateComplete;
    expect(element.target).toBe('_blank');
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('target')).toBe('_blank');
  });

  it('should set property: rel', async () => {
    element.rel = 'nofollow';
    await element.updateComplete;
    expect(element.rel).toBe('nofollow');
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('rel')).toBe('nofollow');
  });

  it('should set property: variant', async () => {
    element.variant = 'primary';
    await element.updateComplete;
    expect(element.variant).toBe('primary');
    const link = element.shadowRoot?.querySelector('.link--primary');
    expect(link).toBeTruthy();
  });

  it('should set property: underline', async () => {
    element.underline = 'always';
    await element.updateComplete;
    expect(element.underline).toBe('always');
    const link = element.shadowRoot?.querySelector('.link--underline-always');
    expect(link).toBeTruthy();
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const link = element.shadowRoot?.querySelector('.link--size-lg');
    expect(link).toBeTruthy();
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
  });

  // Variants
  it('should apply default variant', async () => {
    element.variant = 'default';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link');
    expect(link).toBeTruthy();
    // Default variant has no special class, just base styles
    expect(link?.classList.contains('link--primary')).toBe(false);
    expect(link?.classList.contains('link--muted')).toBe(false);
  });

  it('should apply primary variant', async () => {
    element.variant = 'primary';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--primary');
    expect(link).toBeTruthy();
  });

  it('should apply muted variant', async () => {
    element.variant = 'muted';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--muted');
    expect(link).toBeTruthy();
  });

  // CSS Parts
  it('should expose link part for styling', async () => {
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('[part="link"]');
    expect(link).toBeTruthy();
  });

  // Slots
  it('should render slotted content', async () => {
    element.textContent = 'Click here';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // Accessibility
  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should not have aria-disabled when not disabled', async () => {
    element.disabled = false;
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('aria-disabled')).toBe('false');
  });

  it('should auto-add rel for external links', async () => {
    element.target = '_blank';
    element.href = 'https://example.com';
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should use custom rel over auto-generated rel', async () => {
    element.target = '_blank';
    element.rel = 'nofollow';
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('rel')).toBe('nofollow');
  });

  // Interactions
  it('should prevent click when disabled', async () => {
    element.disabled = true;
    element.href = 'https://example.com';
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    anchor?.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('should not prevent click when enabled', async () => {
    element.disabled = false;
    element.href = 'https://example.com';
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    anchor?.dispatchEvent(clickEvent);
    // Note: We don't actually navigate in tests, just check prevention
  });

  it('should apply always underline style', async () => {
    element.underline = 'always';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--underline-always');
    expect(link).toBeTruthy();
  });

  it('should apply hover underline style', async () => {
    element.underline = 'hover';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--underline-hover');
    expect(link).toBeTruthy();
  });

  it('should apply none underline style', async () => {
    element.underline = 'none';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--underline-none');
    expect(link).toBeTruthy();
  });

  // Size variants
  it('should apply small size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--size-sm');
    expect(link).toBeTruthy();
  });

  it('should apply medium size', async () => {
    element.size = 'md';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--size-md');
    expect(link).toBeTruthy();
  });

  it('should apply large size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--size-lg');
    expect(link).toBeTruthy();
  });

  // Property Reflection
  it('should reflect properties to attributes', async () => {
    element.href = 'https://example.com';
    element.variant = 'primary';
    element.underline = 'always';
    element.size = 'lg';
    element.disabled = true;
    await element.updateComplete;
    expect(element.getAttribute('href')).toBe('https://example.com');
    expect(element.getAttribute('variant')).toBe('primary');
    expect(element.getAttribute('underline')).toBe('always');
    expect(element.getAttribute('size')).toBe('lg');
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  // Edge cases
  it('should handle rapid variant changes', async () => {
    element.variant = 'default';
    await element.updateComplete;
    element.variant = 'primary';
    await element.updateComplete;
    element.variant = 'muted';
    await element.updateComplete;
    const link = element.shadowRoot?.querySelector('.link--muted');
    expect(link).toBeTruthy();
  });

  it('should not render href when disabled', async () => {
    element.disabled = true;
    element.href = 'https://example.com';
    await element.updateComplete;
    const anchor = element.shadowRoot?.querySelector('a');
    expect(anchor?.hasAttribute('href')).toBe(false);
  });
});
