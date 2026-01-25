import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './notification.js';
import type { BpNotification } from './notification.js';

describe('bp-notification', () => {
  let element: BpNotification;

  beforeEach(() => {
    element = document.createElement('bp-notification');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-notification');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render notification element to DOM when open', async () => {
    element.open = true;
    await element.updateComplete;
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification).toBeTruthy();
  });

  it('should not render when closed', async () => {
    element.open = false;
    await element.updateComplete;
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification).toBeFalsy();
  });

  // Default value tests
  it('should have correct default property values', () => {
    expect(element.variant).toBe('info');
    expect(element.open).toBe(false);
    expect(element.closable).toBe(true);
    expect(element.duration).toBe(0);
    expect(element.title).toBe('');
    expect(element.message).toBe('');
    expect(element.position).toBe('top-right');
  });

  // Property tests
  it('should set property: variant', async () => {
    element.variant = 'success';
    element.open = true;
    await element.updateComplete;
    expect(element.variant).toBe('success');
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification?.classList.contains('notification--success')).toBe(
      true
    );
  });

  it('should set property: open', async () => {
    element.open = true;
    await element.updateComplete;
    expect(element.open).toBe(true);
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('should set property: closable', async () => {
    element.closable = false;
    element.open = true;
    await element.updateComplete;
    expect(element.closable).toBe(false);
    const closeButton = element.shadowRoot?.querySelector(
      '.notification__close'
    );
    expect(closeButton).toBeFalsy();
  });

  it('should set property: duration', async () => {
    element.duration = 5000;
    await element.updateComplete;
    expect(element.duration).toBe(5000);
  });

  it('should set property: title', async () => {
    element.title = 'Test Title';
    element.open = true;
    await element.updateComplete;
    const title = element.shadowRoot?.querySelector('.notification__title');
    expect(title?.textContent?.trim()).toBe('Test Title');
  });

  it('should set property: message', async () => {
    element.message = 'Test message content';
    element.open = true;
    await element.updateComplete;
    const messageEl = element.shadowRoot?.querySelector(
      '.notification__message'
    );
    expect(messageEl?.textContent?.trim()).toBe('Test message content');
  });

  it('should set property: position', async () => {
    element.position = 'bottom-left';
    element.open = true;
    await element.updateComplete;
    expect(element.position).toBe('bottom-left');
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification?.classList.contains('notification--bottom-left')).toBe(
      true
    );
  });

  // Attribute reflection tests
  it('should reflect variant attribute when property changes', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('error');
  });

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
    await element.updateComplete;

    expect(showHandler).toHaveBeenCalled();
  });

  it('should emit bp-hide event when closed', async () => {
    element.open = true;
    await element.updateComplete;

    const hideHandler = vi.fn();
    element.addEventListener('bp-hide', hideHandler);

    element.hide();
    await element.updateComplete;

    expect(hideHandler).toHaveBeenCalled();
  });

  it('should emit bp-close event when close button clicked', async () => {
    element.open = true;
    await element.updateComplete;

    const closeHandler = vi.fn();
    element.addEventListener('bp-close', closeHandler);

    const closeButton = element.shadowRoot?.querySelector(
      '.notification__close'
    ) as HTMLButtonElement;
    closeButton.click();
    await element.updateComplete;

    expect(closeHandler).toHaveBeenCalled();
  });

  // Slot tests
  it('should render slotted content', async () => {
    element.innerHTML = '<span>Slotted message</span>';
    element.open = true;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector(
      '.notification__message slot:not([name])'
    );
    expect(slot).toBeTruthy();
  });

  it('should render slotted icon', async () => {
    element.innerHTML = '<bp-icon slot="icon" name="star"></bp-icon>';
    element.open = true;
    await element.updateComplete;

    const iconSlot = element.shadowRoot?.querySelector('slot[name="icon"]');
    expect(iconSlot).toBeTruthy();
  });

  it('should render slotted action', async () => {
    element.innerHTML = '<button slot="action">Undo</button>';
    element.open = true;
    await element.updateComplete;

    const actionSlot = element.shadowRoot?.querySelector('slot[name="action"]');
    expect(actionSlot).toBeTruthy();
  });

  // CSS part tests
  it('should expose base part for styling', async () => {
    element.open = true;
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="base"]');
    expect(part).toBeTruthy();
  });

  it('should expose icon part for styling', async () => {
    element.open = true;
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="icon"]');
    expect(part).toBeTruthy();
  });

  it('should expose content part for styling', async () => {
    element.open = true;
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="content"]');
    expect(part).toBeTruthy();
  });

  it('should expose close-button part for styling', async () => {
    element.closable = true;
    element.open = true;
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="close-button"]');
    expect(part).toBeTruthy();
  });

  // Interaction tests
  it('should close when close button is clicked', async () => {
    element.open = true;
    await element.updateComplete;

    const closeButton = element.shadowRoot?.querySelector(
      '.notification__close'
    ) as HTMLButtonElement;
    closeButton.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should close on Escape key press when closable', async () => {
    element.open = true;
    element.closable = true;
    await element.updateComplete;

    const notification = element.shadowRoot?.querySelector(
      '.notification'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    notification.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should not close on Escape key when not closable', async () => {
    element.open = true;
    element.closable = false;
    await element.updateComplete;

    const notification = element.shadowRoot?.querySelector(
      '.notification'
    ) as HTMLElement;
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    notification.dispatchEvent(event);
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  // Public method tests
  it('should open notification with show() method', async () => {
    expect(element.open).toBe(false);
    element.show();
    expect(element.open).toBe(true);
  });

  it('should close notification with hide() method', async () => {
    element.open = true;
    expect(element.open).toBe(true);
    element.hide();
    expect(element.open).toBe(false);
  });

  it('should not show when already open', async () => {
    element.open = true;
    await element.updateComplete;

    const showHandler = vi.fn();
    element.addEventListener('bp-show', showHandler);

    element.show();
    expect(showHandler).not.toHaveBeenCalled();
  });

  it('should not hide when already closed', async () => {
    element.open = false;
    await element.updateComplete;

    const hideHandler = vi.fn();
    element.addEventListener('bp-hide', hideHandler);

    element.hide();
    expect(hideHandler).not.toHaveBeenCalled();
  });

  // Auto-close tests
  it('should auto-close after duration', async () => {
    vi.useFakeTimers();
    element.duration = 3000;
    element.open = true;
    await element.updateComplete;

    expect(element.open).toBe(true);

    vi.advanceTimersByTime(3000);
    await element.updateComplete;

    expect(element.open).toBe(false);
    vi.useRealTimers();
  });

  it('should not auto-close when duration is 0', async () => {
    vi.useFakeTimers();
    element.duration = 0;
    element.open = true;
    await element.updateComplete;

    vi.advanceTimersByTime(10000);
    await element.updateComplete;

    expect(element.open).toBe(true);
    vi.useRealTimers();
  });

  // Accessibility tests
  it('should have role="alert" for screen readers', async () => {
    element.open = true;
    await element.updateComplete;
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification?.getAttribute('role')).toBe('alert');
  });

  it('should have aria-live="polite"', async () => {
    element.open = true;
    await element.updateComplete;
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification?.getAttribute('aria-live')).toBe('polite');
  });

  it('should have aria-label on close button', async () => {
    element.open = true;
    element.closable = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '.notification__close'
    );
    expect(closeButton?.getAttribute('aria-label')).toBe('Close notification');
  });

  // Animation and state tests
  it('should have aria-live="assertive" for error variant', async () => {
    element.variant = 'error';
    element.open = true;
    await element.updateComplete;
    const notification = element.shadowRoot?.querySelector('.notification');
    expect(notification?.getAttribute('aria-live')).toBe('assertive');
  });

  it('should focus close button when notification opens', async () => {
    element.closable = true;
    element.open = true;
    await element.updateComplete;

    // Wait for focus to be applied in updateComplete.then()
    await new Promise((resolve) => setTimeout(resolve, 50));

    const closeButton = element.shadowRoot?.querySelector(
      '.notification__close'
    ) as HTMLButtonElement;
    expect(element.shadowRoot?.activeElement).toBe(closeButton);
  });

  it('should pause auto-close timer on hover', async () => {
    vi.useFakeTimers();
    element.duration = 3000;
    element.open = true;
    await element.updateComplete;

    // Advance halfway through duration
    vi.advanceTimersByTime(1500);

    // Hover over notification
    const notification = element.shadowRoot?.querySelector(
      '.notification'
    ) as HTMLElement;
    notification.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await element.updateComplete;

    // Advance past original duration
    vi.advanceTimersByTime(2000);
    await element.updateComplete;

    // Should still be open (timer paused)
    expect(element.open).toBe(true);
    vi.useRealTimers();
  });

  it('should resume auto-close timer on mouseleave', async () => {
    vi.useFakeTimers();
    element.duration = 3000;
    element.open = true;
    await element.updateComplete;

    const notification = element.shadowRoot?.querySelector(
      '.notification'
    ) as HTMLElement;

    // Pause timer
    notification.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await element.updateComplete;
    vi.advanceTimersByTime(1000);

    // Resume timer
    notification.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await element.updateComplete;

    // Should close after remaining time
    vi.advanceTimersByTime(3000);
    await element.updateComplete;

    expect(element.open).toBe(false);
    vi.useRealTimers();
  });

  it('should fallback to default variant when invalid', async () => {
    element.setAttribute('variant', 'invalid');
    await element.updateComplete;
    expect(element.variant).toBe('info');
  });

  it('should prioritize message property over slot content', async () => {
    element.innerHTML = '<span>Slotted content</span>';
    element.message = 'Message property';
    element.open = true;
    await element.updateComplete;

    const messageEl = element.shadowRoot?.querySelector(
      '.notification__message'
    );
    expect(messageEl?.textContent?.trim()).toBe('Message property');
  });

  // Title rendering
  it('should not render title element when title is empty', async () => {
    element.title = '';
    element.open = true;
    await element.updateComplete;
    const title = element.shadowRoot?.querySelector('.notification__title');
    expect(title).toBeFalsy();
  });
});
