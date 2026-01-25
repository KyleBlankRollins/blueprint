import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './popover.js';
import type { BpPopover } from './popover.js';

describe('bp-popover', () => {
  let element: BpPopover;

  beforeEach(() => {
    element = document.createElement('bp-popover');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-popover');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render popover element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.querySelector('.popover')).toBeTruthy();
  });

  it('should render trigger slot', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger).toBeTruthy();
    expect(trigger?.querySelector('slot:not([name])')).toBeTruthy();
  });

  it('should render panel when open', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.popover__panel');
    expect(panel).toBeTruthy();
  });

  it('should not render panel when closed', async () => {
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.popover__panel');
    expect(panel).toBeNull();
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.open).toBe(false);
    expect(element.placement).toBe('bottom');
    expect(element.trigger).toBe('click');
    expect(element.arrow).toBe(false);
    expect(element.showClose).toBe(false);
    expect(element.closeOnOutsideClick).toBe(true);
    expect(element.closeOnEscape).toBe(true);
    expect(element.distance).toBe(8);
    expect(element.showDelay).toBe(200);
    expect(element.hideDelay).toBe(200);
    expect(element.disabled).toBe(false);
    expect(element.label).toBe('');
  });

  // Property tests
  it('should set property: open', async () => {
    element.open = true;
    await element.updateComplete;
    expect(element.open).toBe(true);
    expect(element.shadowRoot?.querySelector('.popover--open')).toBeTruthy();
  });

  it('should set property: placement', async () => {
    element.placement = 'top-start';
    element.open = true;
    await element.updateComplete;
    expect(element.placement).toBe('top-start');
    const panel = element.shadowRoot?.querySelector('.popover__panel');
    expect(panel?.classList.contains('popover__panel--top-start')).toBe(true);
  });

  it('should set property: trigger', async () => {
    element.trigger = 'hover';
    await element.updateComplete;
    expect(element.trigger).toBe('hover');
  });

  it('should set property: arrow', async () => {
    element.arrow = true;
    element.open = true;
    await element.updateComplete;
    expect(element.arrow).toBe(true);
    expect(element.shadowRoot?.querySelector('.popover__arrow')).toBeTruthy();
  });

  it('should set property: showClose', async () => {
    element.showClose = true;
    element.open = true;
    await element.updateComplete;
    expect(element.showClose).toBe(true);
    expect(element.shadowRoot?.querySelector('.popover__close')).toBeTruthy();
  });

  it('should set property: closeOnOutsideClick', async () => {
    element.closeOnOutsideClick = false;
    await element.updateComplete;
    expect(element.closeOnOutsideClick).toBe(false);
  });

  it('should set property: closeOnEscape', async () => {
    element.closeOnEscape = false;
    await element.updateComplete;
    expect(element.closeOnEscape).toBe(false);
  });

  it('should set property: distance', async () => {
    element.distance = 16;
    element.open = true;
    await element.updateComplete;
    expect(element.distance).toBe(16);
    const panel = element.shadowRoot?.querySelector(
      '.popover__panel'
    ) as HTMLElement;
    expect(panel?.style.getPropertyValue('--popover-distance')).toBe('16px');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    expect(
      element.shadowRoot?.querySelector('.popover--disabled')
    ).toBeTruthy();
  });

  it('should set property: label', async () => {
    element.label = 'User info popover';
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.popover__panel');
    expect(panel?.getAttribute('aria-label')).toBe('User info popover');
  });

  // Method tests
  it('should open popover with show() method', async () => {
    element.show();
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should close popover with hide() method', async () => {
    element.open = true;
    await element.updateComplete;
    element.hide();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should toggle popover with toggle() method', async () => {
    expect(element.open).toBe(false);
    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(true);
    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not open when disabled', async () => {
    element.disabled = true;
    element.show();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  // Event tests
  it('should emit bp-show event when opening', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-show', handler);
    element.show();
    await element.updateComplete;
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-hide event when closing', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-hide', handler);
    element.hide();
    await element.updateComplete;
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-after-show event after opening', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-after-show', handler);
    element.show();
    await element.updateComplete;
    await new Promise((r) => window.setTimeout(r, 10));
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-after-hide event after closing', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-after-hide', handler);
    element.hide();
    await element.updateComplete;
    await new Promise((r) => window.setTimeout(r, 10));
    expect(handler).toHaveBeenCalled();
  });

  // Slot tests
  it('should render default slot for trigger', async () => {
    element.innerHTML = '<span>Click me</span>';
    await element.updateComplete;
    const triggerSlot = element.shadowRoot?.querySelector(
      '.popover__trigger slot:not([name])'
    );
    expect(triggerSlot).toBeTruthy();
  });

  it('should render content slot in panel', async () => {
    element.open = true;
    await element.updateComplete;
    const contentSlot = element.shadowRoot?.querySelector(
      'slot[name="content"]'
    );
    expect(contentSlot).toBeTruthy();
  });

  it('should render header slot in panel', async () => {
    element.open = true;
    await element.updateComplete;
    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]');
    expect(headerSlot).toBeTruthy();
  });

  it('should render footer slot in panel', async () => {
    element.open = true;
    await element.updateComplete;
    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]');
    expect(footerSlot).toBeTruthy();
  });

  // CSS parts tests
  it('should expose all CSS parts for styling customization', async () => {
    element.arrow = true;
    element.showClose = true;
    element.open = true;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('[part="trigger"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="panel"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="body"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="arrow"]')).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector('[part="close-button"]')
    ).toBeTruthy();
  });

  // Interaction tests - click trigger
  it('should toggle on click when trigger is click', async () => {
    element.trigger = 'click';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    expect(element.open).toBe(true);
    trigger?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should toggle on Enter key press', async () => {
    element.trigger = 'click';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should toggle on Space key press', async () => {
    element.trigger = 'click';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  // Interaction tests - close button
  it('should close on close button click', async () => {
    element.showClose = true;
    element.open = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '.popover__close'
    ) as HTMLButtonElement;
    closeButton?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  // Interaction tests - escape key
  it('should close on Escape key press when closeOnEscape is true', async () => {
    element.open = true;
    await element.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not close on Escape when closeOnEscape is false', async () => {
    element.closeOnEscape = false;
    element.open = true;
    await element.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  // Accessibility tests
  it('should have role="button" on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('role')).toBe('button');
  });

  it('should have aria-haspopup="dialog" on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('should have aria-expanded reflecting open state', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    element.open = true;
    await element.updateComplete;
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role="dialog" on panel', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.popover__panel');
    expect(panel?.getAttribute('role')).toBe('dialog');
  });

  it('should have accessible close button label', async () => {
    element.showClose = true;
    element.open = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector('.popover__close');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close popover');
  });

  it('should support keyboard navigation with tabindex on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('0');
  });

  it('should set tabindex to -1 when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.popover__trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('-1');
  });

  // Trigger mode tests
  it('should not open on click when trigger is hover', async () => {
    element.trigger = 'hover';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not open on click when trigger is manual', async () => {
    element.trigger = 'manual';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should open on focus when trigger is focus', async () => {
    element.trigger = 'focus';
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should close on blur when trigger is focus', async () => {
    element.trigger = 'focus';
    element.open = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.popover__trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await element.updateComplete;
    expect(element.open).toBe(false);
  });
});
