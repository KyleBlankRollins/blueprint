import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { notificationStackStyles } from './notification-stack.style.js';
import { BpNotification } from '../notification/notification.js';

export type NotificationStackPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

/** Options for `notify()` */
export interface NotifyOptions {
  /** Message text */
  message?: string;
  /** Optional bold title above the message */
  title?: string;
  /** Visual and semantic variant (default `info`) */
  variant?: NotificationVariant;
  /**
   * Milliseconds before it dismisses itself. Defaults to the stack's
   * `duration`, except `error`, which stays until dismissed. `0` never
   * auto-dismisses.
   */
  duration?: number;
  /** Show a close button (default `true`) */
  closable?: boolean;
}

/**
 * A fixed screen region that shows `bp-notification` toasts one above
 * another. Call `notify()` to add one: the stack positions it, caps how many
 * are visible at once (queuing the rest), and removes each one when it closes.
 *
 * Notifications added as children in markup are stacked too, but they are
 * only hidden, not removed, when they close.
 *
 * @element bp-notification-stack
 *
 * @fires bp-notify - A notification from `notify()` became visible. `detail.notification` is the element
 *
 * @slot - `bp-notification` elements
 *
 * @csspart base - The region that lays the notifications out
 */
@customElement('bp-notification-stack')
export class BpNotificationStack extends LitElement {
  static dependencies = [BpNotification];

  /** Corner or edge of the viewport the stack sits in */
  @property({ type: String, reflect: true })
  declare position: NotificationStackPosition;

  /** Most notifications visible at once; the rest wait in a queue */
  @property({ type: Number }) declare max: number;

  /**
   * Default auto-dismiss time in milliseconds for `notify()`. Errors ignore
   * it and stay until dismissed. `0` turns auto-dismiss off.
   */
  @property({ type: Number }) declare duration: number;

  /** Accessible name of the region */
  @property({ type: String }) declare label: string;

  static styles = [notificationStackStyles];

  /** Notifications created by notify(), which the stack removes on close */
  private owned = new WeakSet<BpNotification>();
  private queue: BpNotification[] = [];

  constructor() {
    super();
    this.position = 'bottom-right';
    this.max = 3;
    this.duration = 5000;
    this.label = 'Notifications';
    this.addEventListener('bp-hide', this.handleHide);
  }

  /** Notifications waiting for room in the stack */
  get pending(): number {
    return this.queue.length;
  }

  /** The open notifications currently in the stack */
  get visible(): BpNotification[] {
    return this.notifications.filter((n) => n.open);
  }

  private get notifications(): BpNotification[] {
    return Array.from(this.children).filter(
      (el): el is BpNotification => el instanceof BpNotification
    );
  }

  private get isTop(): boolean {
    return this.position.startsWith('top');
  }

  /**
   * Show a notification. Pass a message string or `NotifyOptions`. Returns
   * the `bp-notification` element, so you can add an `action` slot or close
   * it with `hide()`.
   */
  notify(options: NotifyOptions | string): BpNotification {
    const opts: NotifyOptions =
      typeof options === 'string' ? { message: options } : options;
    const el = document.createElement('bp-notification');
    el.variant = opts.variant ?? 'info';
    el.title = opts.title ?? '';
    el.message = opts.message ?? '';
    el.closable = opts.closable ?? true;
    el.duration = opts.duration ?? (el.variant === 'error' ? 0 : this.duration);
    el.stacked = true;
    this.owned.add(el);
    this.queue.push(el);
    this.drain();
    return el;
  }

  /** Close every notification and empty the queue */
  clear(): void {
    this.queue = [];
    for (const n of this.notifications) n.hide();
  }

  /** Move queued notifications into the stack while there is room */
  private drain() {
    const max = Math.max(1, Math.floor(Number(this.max) || 1));
    while (this.queue.length && this.visible.length < max) {
      const el = this.queue.shift()!;
      el.open = true;
      // Newest sits nearest the screen edge, and DOM order matches.
      if (this.isTop) this.prepend(el);
      else this.append(el);
      this.dispatchEvent(
        new CustomEvent('bp-notify', {
          detail: { notification: el },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleHide = (event: Event) => {
    const el = event.target;
    if (!(el instanceof BpNotification) || el.parentElement !== this) return;
    if (this.owned.has(el)) el.remove();
    this.drain();
  };

  private handleSlotChange() {
    for (const n of this.notifications) n.stacked = true;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('max')) this.drain();
  }

  render() {
    return html`
      <div class="stack" part="base" role="region" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}

/**
 * Show a notification in the page's first `bp-notification-stack`, creating
 * one at the end of `<body>` if there is none.
 */
export function notify(options: NotifyOptions | string): BpNotification {
  let stack = document.querySelector('bp-notification-stack');
  if (!stack) {
    stack = document.createElement('bp-notification-stack');
    document.body.append(stack);
  }
  return stack.notify(options);
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-notification-stack': BpNotificationStack;
  }
}
