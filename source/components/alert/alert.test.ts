import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './alert.js';
import type { BpAlert } from './alert.js';

describe('bp-alert', () => {
  let element: BpAlert;

  beforeEach(() => {
    element = document.createElement('bp-alert');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-alert');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render alert container to DOM', async () => {
    await element.updateComplete;
    const alert = element.shadowRoot?.querySelector('.alert');
    expect(alert).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.variant).toBe('info');
    expect(element.dismissible).toBe(false);
    expect(element.showIcon).toBe(false);
  });

  // Properties
  it('should set property: variant', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');
  });

  it('should set property: dismissible', async () => {
    element.dismissible = true;
    await element.updateComplete;
    expect(element.dismissible).toBe(true);
  });

  it('should set property: showIcon', async () => {
    element.showIcon = true;
    await element.updateComplete;
    expect(element.showIcon).toBe(true);
  });

  // Attributes
  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('error');
  });

  it('should reflect dismissible attribute to DOM', async () => {
    element.dismissible = true;
    await element.updateComplete;
    expect(element.hasAttribute('dismissible')).toBe(true);
  });

  it('should reflect showIcon attribute to DOM', async () => {
    element.showIcon = true;
    await element.updateComplete;
    expect(element.hasAttribute('showicon')).toBe(true);
  });

  // Events
  it('should emit bp-close event when close button is clicked', async () => {
    element.dismissible = true;
    await element.updateComplete;

    const closeHandler = vi.fn();
    element.addEventListener('bp-close', closeHandler);

    const closeButton = element.shadowRoot?.querySelector('.alert-close');
    closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeHandler).toHaveBeenCalled();
  });

  it('should remove element from DOM when dismissed', async () => {
    element.dismissible = true;
    await element.updateComplete;

    expect(document.body.contains(element)).toBe(true);

    const closeButton = element.shadowRoot?.querySelector('.alert-close');
    closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.body.contains(element)).toBe(false);
  });

  // Slots
  it('should render slotted message content', async () => {
    const message = document.createElement('span');
    message.textContent = 'Alert message';
    element.appendChild(message);

    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('should render slotted custom icon', async () => {
    element.showIcon = true;
    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '!';
    element.appendChild(icon);

    await element.updateComplete;

    const iconSlot = element.shadowRoot?.querySelector('slot[name="icon"]');
    expect(iconSlot).toBeTruthy();
  });

  // CSS Parts
  it('should expose alert part for styling', async () => {
    await element.updateComplete;
    const alert = element.shadowRoot?.querySelector('[part="alert"]');
    expect(alert).toBeTruthy();
  });

  it('should expose message part for styling', async () => {
    await element.updateComplete;
    const message = element.shadowRoot?.querySelector('[part="message"]');
    expect(message).toBeTruthy();
  });

  it('should expose icon part when showIcon is true', async () => {
    element.showIcon = true;
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
  });

  it('should expose close-button part when dismissible', async () => {
    element.dismissible = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '[part="close-button"]'
    );
    expect(closeButton).toBeTruthy();
  });

  // Variants
  it('should apply info variant styles', async () => {
    element.variant = 'info';
    await element.updateComplete;

    const alert = element.shadowRoot?.querySelector('.alert--info');
    expect(alert).toBeTruthy();
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;

    const alert = element.shadowRoot?.querySelector('.alert--success');
    expect(alert).toBeTruthy();
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;

    const alert = element.shadowRoot?.querySelector('.alert--warning');
    expect(alert).toBeTruthy();
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;

    const alert = element.shadowRoot?.querySelector('.alert--error');
    expect(alert).toBeTruthy();
  });

  // Icon rendering
  it('should render default info icon when showIcon is true', async () => {
    element.variant = 'info';
    element.showIcon = true;
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.alert-icon svg');
    expect(icon).toBeTruthy();
  });

  it('should render default success icon when showIcon is true', async () => {
    element.variant = 'success';
    element.showIcon = true;
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.alert-icon svg');
    expect(icon).toBeTruthy();
  });

  it('should render default warning icon when showIcon is true', async () => {
    element.variant = 'warning';
    element.showIcon = true;
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.alert-icon svg');
    expect(icon).toBeTruthy();
  });

  it('should render default error icon when showIcon is true', async () => {
    element.variant = 'error';
    element.showIcon = true;
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.alert-icon svg');
    expect(icon).toBeTruthy();
  });

  it('should not render icon when showIcon is false', async () => {
    element.showIcon = false;
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector('.alert-icon');
    expect(icon).toBeFalsy();
  });

  // Dismissible state
  it('should not render close button when not dismissible', async () => {
    element.dismissible = false;
    await element.updateComplete;

    const closeButton = element.shadowRoot?.querySelector('.alert-close');
    expect(closeButton).toBeFalsy();
  });

  it('should render close button when dismissible', async () => {
    element.dismissible = true;
    await element.updateComplete;

    const closeButton = element.shadowRoot?.querySelector('.alert-close');
    expect(closeButton).toBeTruthy();
  });

  // Accessibility
  it('should have role alert', async () => {
    await element.updateComplete;
    const alert = element.shadowRoot?.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
  });

  it('should have aria-live polite', async () => {
    await element.updateComplete;
    const alert = element.shadowRoot?.querySelector('.alert');
    expect(alert?.getAttribute('aria-live')).toBe('polite');
  });

  it('should have aria-label on close button', async () => {
    element.dismissible = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector('.alert-close');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close alert');
  });
});
