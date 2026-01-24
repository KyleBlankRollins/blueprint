import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './dropdown.js';
import type { BpDropdown } from './dropdown.js';

describe('bp-dropdown', () => {
  let element: BpDropdown;

  beforeEach(() => {
    element = document.createElement('bp-dropdown');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-dropdown');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render trigger element to DOM', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger).toBeTruthy();
  });

  it('should render panel when open', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel).toBeTruthy();
  });

  it('should not render panel when closed', async () => {
    element.open = false;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel).toBeFalsy();
  });

  // Default value tests
  it('should have correct default property values', () => {
    expect(element.open).toBe(false);
    expect(element.placement).toBe('bottom-start');
    expect(element.closeOnClickOutside).toBe(true);
    expect(element.closeOnEscape).toBe(true);
    expect(element.closeOnSelect).toBe(true);
    expect(element.disabled).toBe(false);
    expect(element.distance).toBe(4);
    expect(element.arrow).toBe(false);
  });

  // Attribute reflection tests
  it('should reflect open attribute when property changes', async () => {
    element.open = true;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(true);

    element.open = false;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(false);
  });

  // Event tests
  it('should emit bp-show event when opened', async () => {
    const showHandler = vi.fn();
    element.addEventListener('bp-show', showHandler);

    element.show();
    expect(showHandler).toHaveBeenCalled();
  });

  it('should emit bp-hide event when closed', async () => {
    element.open = true;
    await element.updateComplete;

    const hideHandler = vi.fn();
    element.addEventListener('bp-hide', hideHandler);

    element.hide();
    expect(hideHandler).toHaveBeenCalled();
  });

  it('should emit bp-toggle event with open state', async () => {
    const toggleHandler = vi.fn();
    element.addEventListener('bp-toggle', toggleHandler);

    element.toggle();
    expect(toggleHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    );

    element.toggle();
    expect(toggleHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: false },
      })
    );
  });

  // Slot tests
  it('should render slotted trigger content', async () => {
    element.innerHTML = '<button>Open Menu</button>';
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector(
      '.dropdown__trigger slot:not([name])'
    );
    expect(slot).toBeTruthy();
  });

  it('should render slotted content in panel', async () => {
    element.innerHTML =
      '<span>Trigger</span><div slot="content">Panel Content</div>';
    element.open = true;
    await element.updateComplete;

    const contentSlot = element.shadowRoot?.querySelector(
      'slot[name="content"]'
    );
    expect(contentSlot).toBeTruthy();
  });

  // CSS part tests
  it('should expose trigger part for styling', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
    expect(trigger).toBeTruthy();
  });

  it('should expose panel part for styling', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('[part="panel"]');
    expect(panel).toBeTruthy();
  });

  // Interaction tests
  it('should toggle on click', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.dropdown__trigger'
    ) as HTMLElement;

    trigger.click();
    await element.updateComplete;
    expect(element.open).toBe(true);

    trigger.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not toggle when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const trigger = element.shadowRoot?.querySelector(
      '.dropdown__trigger'
    ) as HTMLElement;
    trigger.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should close on Escape key press', async () => {
    element.open = true;
    await element.updateComplete;

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should not close on Escape when closeOnEscape is false', async () => {
    element.open = true;
    element.closeOnEscape = false;
    await element.updateComplete;

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('should close on click outside', async () => {
    element.open = true;
    await element.updateComplete;

    // Simulate click outside
    document.body.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should not close on click outside when closeOnClickOutside is false', async () => {
    element.open = true;
    element.closeOnClickOutside = false;
    await element.updateComplete;

    // Simulate click outside
    document.body.click();
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  // Keyboard navigation tests
  it('should open on Enter key press', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.dropdown__trigger'
    ) as HTMLElement;

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    trigger.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('should open on Space key press', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.dropdown__trigger'
    ) as HTMLElement;

    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    trigger.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('should open on ArrowDown key press when closed', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.dropdown__trigger'
    ) as HTMLElement;

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
    });
    trigger.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  // Accessibility tests
  it('should have aria-haspopup attribute on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('true');
  });

  it('should have aria-expanded attribute reflecting open state', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    element.open = true;
    await element.updateComplete;
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled attribute when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role="button" on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('role')).toBe('button');
  });

  it('should have default panelRole="menu" on panel', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel?.getAttribute('role')).toBe('menu');
  });

  it('should allow configurable panelRole', async () => {
    element.panelRole = 'dialog';
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel?.getAttribute('role')).toBe('dialog');

    element.panelRole = 'listbox';
    await element.updateComplete;
    expect(panel?.getAttribute('role')).toBe('listbox');
  });

  it('should have tabindex on trigger for keyboard focus', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('0');
  });

  it('should have tabindex -1 on trigger when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.dropdown__trigger');
    expect(trigger?.getAttribute('tabindex')).toBe('-1');
  });

  // Placement tests
  it('should apply bottom-start placement styles by default', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel?.classList.contains('dropdown__panel--bottom-start')).toBe(
      true
    );
  });

  it('should apply correct placement class', async () => {
    element.placement = 'top-end';
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel?.classList.contains('dropdown__panel--top-end')).toBe(true);
  });

  it('should apply open class for transitions', async () => {
    element.open = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.dropdown__panel');
    expect(panel?.classList.contains('dropdown__panel--open')).toBe(true);
  });

  // Public method tests
  it('should open dropdown with show() method', async () => {
    expect(element.open).toBe(false);
    element.show();
    expect(element.open).toBe(true);
  });

  it('should close dropdown with hide() method', async () => {
    element.open = true;
    expect(element.open).toBe(true);
    element.hide();
    expect(element.open).toBe(false);
  });

  it('should toggle dropdown with toggle() method', async () => {
    expect(element.open).toBe(false);
    element.toggle();
    expect(element.open).toBe(true);
    element.toggle();
    expect(element.open).toBe(false);
  });

  it('should not show when already open', async () => {
    element.open = true;
    const showHandler = vi.fn();
    element.addEventListener('bp-show', showHandler);

    element.show();
    expect(showHandler).not.toHaveBeenCalled();
  });

  it('should not hide when already closed', async () => {
    element.open = false;
    const hideHandler = vi.fn();
    element.addEventListener('bp-hide', hideHandler);

    element.hide();
    expect(hideHandler).not.toHaveBeenCalled();
  });

  it('should not show when disabled', async () => {
    element.disabled = true;
    element.show();
    expect(element.open).toBe(false);
  });

  it('should not close when clicking non-selectable content in panel', async () => {
    element.innerHTML =
      '<span>Trigger</span><div slot="content">Panel Content</div>';
    element.open = true;
    element.closeOnSelect = true;
    await element.updateComplete;

    const panel = element.shadowRoot?.querySelector(
      '.dropdown__panel'
    ) as HTMLElement;
    panel.click(); // Click panel background, not a menu-item
    await element.updateComplete;

    expect(element.open).toBe(true); // Should stay open
  });
});
