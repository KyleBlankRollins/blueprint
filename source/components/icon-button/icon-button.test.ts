import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './icon-button.js';
import type { BpIconButton } from './icon-button.js';

describe('bp-icon-button', () => {
  let element: BpIconButton;
  const inner = () =>
    element.shadowRoot?.querySelector('button') as HTMLButtonElement;

  beforeEach(async () => {
    element = document.createElement('bp-icon-button');
    element.label = 'Close';
    element.icon = 'cross';
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered as a custom element', () => {
    expect(customElements.get('bp-icon-button')).toBeDefined();
  });

  // Defaults
  it('should have correct default property values', () => {
    const fresh = document.createElement('bp-icon-button');
    expect(fresh.icon).toBe('');
    expect(fresh.label).toBe('');
    expect(fresh.variant).toBe('ghost');
    expect(fresh.size).toBe('md');
    expect(fresh.shape).toBe('square');
    expect(fresh.disabled).toBe(false);
    expect(fresh.type).toBe('button');
  });

  // Rendering and accessible name
  it('should render a native button named by label', () => {
    expect(inner()).toBeTruthy();
    expect(inner().getAttribute('aria-label')).toBe('Close');
    expect(inner().getAttribute('type')).toBe('button');
  });

  it('should update the accessible name when label changes', async () => {
    element.label = 'Dismiss';
    await element.updateComplete;
    expect(inner().getAttribute('aria-label')).toBe('Dismiss');
  });

  it('should render the named icon hidden from assistive tech', () => {
    const icon = element.shadowRoot?.querySelector('bp-icon');
    expect(icon?.getAttribute('name')).toBe('cross');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.getAttribute('part')).toBe('icon');
  });

  it('should match icon size to button size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(
      element.shadowRoot?.querySelector('bp-icon')?.getAttribute('size')
    ).toBe('lg');
  });

  it('should render a slot for a custom icon when icon is not set', async () => {
    element.icon = '';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('bp-icon')).toBeNull();
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
    expect(slot?.parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  // Attributes
  it('should reflect variant, size, shape and disabled', async () => {
    element.variant = 'primary';
    element.size = 'sm';
    element.shape = 'circle';
    element.disabled = true;
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('primary');
    expect(element.getAttribute('size')).toBe('sm');
    expect(element.getAttribute('shape')).toBe('circle');
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(inner().classList.contains('button--primary')).toBe(true);
    expect(inner().classList.contains('button--sm')).toBe(true);
  });

  it('should render a square of the size token', async () => {
    element.style.setProperty('--bp-spacing-10', '40px');
    await element.updateComplete;
    const rect = inner().getBoundingClientRect();
    expect(rect.width).toBe(40);
    expect(rect.height).toBe(40);
  });

  it('should paint the icon in the button color, not bp-icon text color', async () => {
    element.style.setProperty('--bp-color-text-muted', 'rgb(1, 2, 3)');
    element.style.setProperty('--bp-color-text', 'rgb(9, 9, 9)');
    const icon = element.shadowRoot?.querySelector('bp-icon');
    await (icon as unknown as { updateComplete: Promise<unknown> })
      .updateComplete;
    const span = icon?.shadowRoot?.querySelector('.icon') as HTMLElement;
    expect(getComputedStyle(span).color).toBe('rgb(1, 2, 3)');
  });

  // Events
  it('should emit bp-click when clicked', () => {
    const handler = vi.fn();
    element.addEventListener('bp-click', handler);
    inner().click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('should not emit bp-click when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-click', handler);
    inner().click();
    expect(handler).not.toHaveBeenCalled();
    expect(inner().disabled).toBe(true);
  });

  // Focus
  it('should focus the inner button', () => {
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(inner());
    element.blur();
    expect(element.shadowRoot?.activeElement).toBeNull();
  });

  // Missing label
  it('should warn once when label is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const unnamed = document.createElement('bp-icon-button');
    document.body.appendChild(unnamed);
    await unnamed.updateComplete;
    unnamed.size = 'lg';
    await unnamed.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);
    unnamed.remove();
    warn.mockRestore();
  });

  it('should not warn when label is set', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const named = document.createElement('bp-icon-button');
    named.label = 'Edit';
    document.body.appendChild(named);
    await named.updateComplete;
    expect(warn).not.toHaveBeenCalled();
    named.remove();
    warn.mockRestore();
  });
});
