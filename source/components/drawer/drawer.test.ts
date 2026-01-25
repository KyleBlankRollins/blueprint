import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './drawer.js';
import type { BpDrawer } from './drawer.js';

describe('bp-drawer', () => {
  let element: BpDrawer;

  beforeEach(() => {
    element = document.createElement('bp-drawer');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    document.body.style.overflow = '';
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-drawer');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render drawer element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.querySelector('.drawer')).toBeTruthy();
  });

  it('should render overlay mode by default', async () => {
    await element.updateComplete;
    const drawer = element.shadowRoot?.querySelector('.drawer');
    expect(drawer?.classList.contains('drawer--overlay')).toBe(true);
  });

  it('should render inline mode when inline is true', async () => {
    element.inline = true;
    await element.updateComplete;
    const drawer = element.shadowRoot?.querySelector('.drawer');
    expect(drawer?.classList.contains('drawer--inline')).toBe(true);
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.open).toBe(false);
    expect(element.placement).toBe('left');
    expect(element.size).toBe('medium');
    expect(element.showClose).toBe(true);
    expect(element.closeOnBackdrop).toBe(true);
    expect(element.closeOnEscape).toBe(true);
    expect(element.showBackdrop).toBe(true);
    expect(element.label).toBe('');
    expect(element.inline).toBe(false);
  });

  // Property tests
  it('should set property: open', async () => {
    element.open = true;
    await element.updateComplete;
    expect(element.open).toBe(true);
    const drawer = element.shadowRoot?.querySelector('.drawer');
    expect(drawer?.classList.contains('drawer--open')).toBe(true);
  });

  it('should set property: placement', async () => {
    element.placement = 'right';
    await element.updateComplete;
    expect(element.placement).toBe('right');
    const drawer = element.shadowRoot?.querySelector('.drawer');
    expect(drawer?.classList.contains('drawer--right')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
    const drawer = element.shadowRoot?.querySelector('.drawer');
    expect(drawer?.classList.contains('drawer--large')).toBe(true);
  });

  it('should set property: showClose', async () => {
    element.showClose = false;
    await element.updateComplete;
    expect(element.showClose).toBe(false);
    expect(element.shadowRoot?.querySelector('.close-button')).toBeNull();
  });

  it('should set property: closeOnBackdrop', async () => {
    element.closeOnBackdrop = false;
    await element.updateComplete;
    expect(element.closeOnBackdrop).toBe(false);
  });

  it('should set property: closeOnEscape', async () => {
    element.closeOnEscape = false;
    await element.updateComplete;
    expect(element.closeOnEscape).toBe(false);
  });

  it('should set property: showBackdrop', async () => {
    element.showBackdrop = false;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.backdrop')).toBeNull();
  });

  it('should set property: label', async () => {
    element.label = 'Navigation drawer';
    await element.updateComplete;
    expect(element.label).toBe('Navigation drawer');
    const panel = element.shadowRoot?.querySelector('[role="dialog"]');
    expect(panel?.getAttribute('aria-label')).toBe('Navigation drawer');
  });

  it('should set property: inline', async () => {
    element.inline = true;
    await element.updateComplete;
    expect(element.inline).toBe(true);
  });

  // Property validation tests
  it('should validate placement from attribute', async () => {
    element.setAttribute('placement', 'invalid');
    await element.updateComplete;
    expect(element.placement).toBe('left');
  });

  it('should validate size from attribute', async () => {
    element.setAttribute('size', 'invalid');
    await element.updateComplete;
    expect(element.size).toBe('medium');
  });

  // Method tests
  it('should open drawer with show() method', async () => {
    element.show();
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should close drawer with hide() method', async () => {
    element.open = true;
    await element.updateComplete;
    element.hide('api');
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should toggle drawer with toggle() method', async () => {
    expect(element.open).toBe(false);
    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(true);
    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not emit event when show() called on open drawer', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-open', handler);
    element.show();
    await element.updateComplete;
    expect(handler).not.toHaveBeenCalled();
  });

  it('should not close when hide() called on closed drawer', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-close', handler);
    element.hide('api');
    await element.updateComplete;
    expect(handler).not.toHaveBeenCalled();
  });

  // Event tests
  it('should emit bp-open event when opening', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-open', handler);
    element.show();
    await element.updateComplete;
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-close event when closing', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-close', handler);
    element.hide('api');
    await element.updateComplete;
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-close event with reason: api', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-close', handler);
    element.hide('api');
    await element.updateComplete;
    const event = handler.mock.calls[0][0] as CustomEvent<{ reason: string }>;
    expect(event.detail.reason).toBe('api');
  });

  it('should emit bp-close event with reason: close-button', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-close', handler);
    const closeButton = element.shadowRoot?.querySelector(
      '.close-button'
    ) as HTMLButtonElement;
    closeButton?.click();
    const event = handler.mock.calls[0][0] as CustomEvent<{ reason: string }>;
    expect(event.detail.reason).toBe('close-button');
  });

  it('should emit bp-close event with reason: backdrop', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-close', handler);
    const backdrop = element.shadowRoot?.querySelector(
      '.backdrop'
    ) as HTMLElement;
    backdrop?.click();
    const event = handler.mock.calls[0][0] as CustomEvent<{ reason: string }>;
    expect(event.detail.reason).toBe('backdrop');
  });

  it('should emit bp-after-open event after animation', async () => {
    const handler = vi.fn();
    element.addEventListener('bp-after-open', handler);
    element.show();
    await element.updateComplete;
    await new Promise((r) => window.setTimeout(r, 10));
    expect(handler).toHaveBeenCalled();
  });

  it('should emit bp-after-close event after animation', async () => {
    element.open = true;
    await element.updateComplete;
    const handler = vi.fn();
    element.addEventListener('bp-after-close', handler);
    element.hide('api');
    await element.updateComplete;
    await new Promise((r) => window.setTimeout(r, 10));
    expect(handler).toHaveBeenCalled();
  });

  it('should allow preventing close with event.preventDefault()', async () => {
    element.open = true;
    await element.updateComplete;
    element.addEventListener('bp-close', (e) => e.preventDefault());
    element.hide('api');
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  // Slot tests
  it('should render default slot content', async () => {
    element.innerHTML = '<p>Drawer content</p>';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('should render header slot content', async () => {
    element.innerHTML = '<h2 slot="header">Drawer Title</h2>';
    await element.updateComplete;
    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]');
    expect(headerSlot).toBeTruthy();
  });

  it('should render footer slot content', async () => {
    element.innerHTML = '<div slot="footer"><button>Close</button></div>';
    await element.updateComplete;
    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]');
    expect(footerSlot).toBeTruthy();
  });

  // CSS Parts tests
  it('should expose all CSS parts for styling', async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[part="drawer"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="backdrop"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="panel"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="header"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="body"]')).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector('[part="close-button"]')
    ).toBeTruthy();
  });

  // Interaction tests
  it('should close on backdrop click when closeOnBackdrop is true', async () => {
    element.open = true;
    await element.updateComplete;
    const backdrop = element.shadowRoot?.querySelector(
      '.backdrop'
    ) as HTMLElement;
    backdrop?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not close on backdrop click when closeOnBackdrop is false', async () => {
    element.open = true;
    element.closeOnBackdrop = false;
    await element.updateComplete;
    const backdrop = element.shadowRoot?.querySelector(
      '.backdrop'
    ) as HTMLElement;
    backdrop?.click();
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should close on close button click', async () => {
    element.open = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '.close-button'
    ) as HTMLButtonElement;
    closeButton?.click();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should close on Escape key press when closeOnEscape is true', async () => {
    element.open = true;
    await element.updateComplete;
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should not close on Escape key press when closeOnEscape is false', async () => {
    element.open = true;
    element.closeOnEscape = false;
    await element.updateComplete;
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should not close on Escape in inline mode', async () => {
    element.inline = true;
    element.open = true;
    await element.updateComplete;
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  // Accessibility tests
  it('should have role="dialog" in overlay mode', async () => {
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.panel');
    expect(panel?.getAttribute('role')).toBe('dialog');
  });

  it('should have aria-modal="true" in overlay mode', async () => {
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.panel');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
  });

  it('should have role="complementary" in inline mode', async () => {
    element.inline = true;
    await element.updateComplete;
    const drawer = element.shadowRoot?.querySelector('[role="complementary"]');
    expect(drawer).toBeTruthy();
  });

  it('should have aria-label when label is set', async () => {
    element.label = 'Side navigation';
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector(
      '[aria-label="Side navigation"]'
    );
    expect(panel).toBeTruthy();
  });

  it('should have accessible close button label', async () => {
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector('.close-button');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close drawer');
  });

  it('should support keyboard navigation with close button focus', async () => {
    element.open = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '.close-button'
    ) as HTMLButtonElement;
    closeButton?.focus();
    expect(document.activeElement).toBe(element);
    expect(element.shadowRoot?.activeElement).toBe(closeButton);
  });

  // Body scroll lock tests
  it('should lock body scroll when open in overlay mode', async () => {
    element.open = true;
    await element.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed in overlay mode', async () => {
    element.open = true;
    await element.updateComplete;
    element.hide('api');
    await element.updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  it('should not lock body scroll in inline mode', async () => {
    element.inline = true;
    element.open = true;
    await element.updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  // Panel focus tests
  it('should focus panel when opened in overlay mode', async () => {
    element.open = true;
    await element.updateComplete;
    await new Promise((r) => window.setTimeout(r, 10));
    const panel = element.shadowRoot?.querySelector('.panel') as HTMLElement;
    expect(element.shadowRoot?.activeElement).toBe(panel);
  });

  // Inline mode specific tests
  it('should always render panel in inline mode regardless of open state', async () => {
    element.inline = true;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.panel');
    expect(panel).toBeTruthy();
  });

  it('should not render backdrop in inline mode', async () => {
    element.inline = true;
    await element.updateComplete;
    const backdrop = element.shadowRoot?.querySelector('.backdrop');
    expect(backdrop).toBeNull();
  });
});
