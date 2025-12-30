import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './button.js';
import type { BpButton } from './button.js';

describe('bp-button', () => {
  let element: BpButton;

  beforeEach(() => {
    element = document.createElement('bp-button');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should be registered as a custom element', () => {
    const constructor = customElements.get('bp-button');
    expect(constructor).toBeDefined();
  });

  it('should render with default properties', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
  });

  it('should have a shadow root', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).not.toBeNull();
  });

  // Default property values
  it('should have default variant "primary"', () => {
    expect(element.variant).toBe('primary');
  });

  it('should have default size "md"', () => {
    expect(element.size).toBe('md');
  });

  it('should have default disabled false', () => {
    expect(element.disabled).toBe(false);
  });

  it('should have default type "button"', () => {
    expect(element.type).toBe('button');
  });

  // Property reactivity
  it('should update variant property', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('button--success');
  });

  it('should update size property', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('button--lg');
  });

  it('should update disabled property', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  // Event handling
  it('should emit bp-click event when clicked', async () => {
    let eventFired = false;
    let eventDetail: any = null;

    element.addEventListener('bp-click', (e: Event) => {
      eventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    await element.updateComplete;
    const button = element.shadowRoot?.querySelector('button');
    button?.click();

    expect(eventFired).toBe(true);
    expect(eventDetail).toBeDefined();
    expect(eventDetail.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('should not emit bp-click event when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('bp-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot?.querySelector('button');
    button?.click();

    expect(eventFired).toBe(false);
  });

  // Accessibility
  it('should set aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should expose button part', () => {
    const button = element.shadowRoot?.querySelector('[part="button"]');
    expect(button).toBeTruthy();
  });

  // All variants
  it('should apply all variant classes', async () => {
    const variants = [
      'primary',
      'success',
      'error',
      'warning',
      'info',
      'secondary',
    ] as const;

    for (const variant of variants) {
      element.variant = variant;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.className).toContain(`button--${variant}`);
    }
  });

  // All sizes
  it('should apply all size classes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.className).toContain(`button--${size}`);
    }
  });
});
