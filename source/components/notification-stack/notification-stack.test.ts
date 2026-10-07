import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './notification-stack.js';
import { notify } from './notification-stack.js';
import type { BpNotificationStack } from './notification-stack.js';
import type { BpNotification } from '../notification/notification.js';

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

describe('bp-notification-stack', () => {
  let element: BpNotificationStack;

  beforeEach(async () => {
    element = document.createElement('bp-notification-stack');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document
      .querySelectorAll('bp-notification-stack')
      .forEach((el) => el.remove());
  });

  // Registration
  it('should be registered as a custom element', () => {
    expect(customElements.get('bp-notification-stack')).toBeDefined();
  });

  // Defaults
  it('should have correct default property values', () => {
    expect(element.position).toBe('bottom-right');
    expect(element.max).toBe(3);
    expect(element.duration).toBe(5000);
    expect(element.label).toBe('Notifications');
    expect(element.pending).toBe(0);
  });

  it('should reflect position to an attribute', async () => {
    element.position = 'top-center';
    await element.updateComplete;
    expect(element.getAttribute('position')).toBe('top-center');
  });

  // Rendering
  it('should render a labelled region with a base part', async () => {
    element.label = 'Alerts';
    await element.updateComplete;
    const base = element.shadowRoot?.querySelector('[part="base"]');
    expect(base?.getAttribute('role')).toBe('region');
    expect(base?.getAttribute('aria-label')).toBe('Alerts');
    expect(element.shadowRoot?.querySelector('slot')).toBeTruthy();
  });

  // notify()
  it('should add an open, stacked notification from a string', async () => {
    const n = element.notify('Saved');
    await n.updateComplete;
    expect(n.parentElement).toBe(element);
    expect(n.open).toBe(true);
    expect(n.stacked).toBe(true);
    expect(n.message).toBe('Saved');
    expect(n.variant).toBe('info');
  });

  it('should apply notify() options', () => {
    const n = element.notify({
      title: 'Upload failed',
      message: 'Try again',
      variant: 'warning',
      duration: 1234,
      closable: false,
    });
    expect(n.title).toBe('Upload failed');
    expect(n.message).toBe('Try again');
    expect(n.variant).toBe('warning');
    expect(n.duration).toBe(1234);
    expect(n.closable).toBe(false);
  });

  it('should use the stack duration by default, but keep errors open', () => {
    element.duration = 4000;
    expect(element.notify('a').duration).toBe(4000);
    expect(element.notify({ message: 'b', variant: 'error' }).duration).toBe(0);
  });

  it('should dispatch bp-notify with the notification', () => {
    let detail: { notification: BpNotification } | undefined;
    element.addEventListener('bp-notify', (e) => {
      detail = (e as CustomEvent).detail;
    });
    const n = element.notify('Hello');
    expect(detail?.notification).toBe(n);
  });

  // Ordering
  it('should put the newest notification last at the bottom', () => {
    const a = element.notify('a');
    const b = element.notify('b');
    expect(Array.from(element.children)).toEqual([a, b]);
  });

  it('should put the newest notification first at the top', async () => {
    element.position = 'top-right';
    await element.updateComplete;
    const a = element.notify('a');
    const b = element.notify('b');
    expect(Array.from(element.children)).toEqual([b, a]);
  });

  // Queue
  it('should queue notifications beyond max', () => {
    element.max = 2;
    element.notify('a');
    element.notify('b');
    const c = element.notify('c');
    expect(element.visible.length).toBe(2);
    expect(element.pending).toBe(1);
    expect(c.isConnected).toBe(false);
  });

  it('should show a queued notification when one closes', async () => {
    element.max = 1;
    const a = element.notify('a');
    const b = element.notify('b');
    await a.updateComplete;
    a.hide();
    await a.updateComplete;
    expect(a.isConnected).toBe(false);
    expect(b.parentElement).toBe(element);
    expect(b.open).toBe(true);
    expect(element.pending).toBe(0);
  });

  it('should show more queued notifications when max grows', async () => {
    element.max = 1;
    element.notify('a');
    element.notify('b');
    element.max = 3;
    await element.updateComplete;
    expect(element.visible.length).toBe(2);
    expect(element.pending).toBe(0);
  });

  // Removal
  it('should remove a notification when its close button is clicked', async () => {
    const n = element.notify('Bye');
    await n.updateComplete;
    const close = n.shadowRoot?.querySelector(
      '.notification__close'
    ) as HTMLButtonElement;
    close.click();
    await n.updateComplete;
    expect(n.isConnected).toBe(false);
  });

  it('should remove a notification when it times out', async () => {
    const n = element.notify({ message: 'Quick', duration: 30 });
    await n.updateComplete;
    await wait(80);
    expect(n.isConnected).toBe(false);
  });

  it('should keep markup children in place when they close', async () => {
    const n = document.createElement('bp-notification');
    n.open = true;
    element.appendChild(n);
    await n.updateComplete;
    await element.updateComplete;
    await wait(0);
    expect(n.stacked).toBe(true);
    n.hide();
    await n.updateComplete;
    expect(n.parentElement).toBe(element);
  });

  it('should clear all notifications and the queue', async () => {
    element.max = 1;
    const a = element.notify('a');
    element.notify('b');
    await a.updateComplete;
    element.clear();
    await a.updateComplete;
    expect(element.children.length).toBe(0);
    expect(element.pending).toBe(0);
  });

  // Focus
  it('should not move focus when a notification appears', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    const n = element.notify('Background task done');
    await n.updateComplete;
    await wait(20);
    expect(document.activeElement).toBe(button);
    button.remove();
  });

  // Helper
  it('notify() should use the page stack, or create one', () => {
    const n = notify('From helper');
    expect(n.parentElement).toBe(element);
    element.remove();
    const m = notify('New stack');
    const created = document.querySelector('bp-notification-stack');
    expect(created).toBeTruthy();
    expect(m.parentElement).toBe(created);
  });
});
