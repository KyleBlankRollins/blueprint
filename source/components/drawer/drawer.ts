import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { drawerStyles } from './drawer.style.js';
import '../icon/icon.js';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'small' | 'medium' | 'large' | 'full';

/**
 * A slide-in panel component that can appear from any edge of the viewport.
 *
 * @fires bp-open - Fired when the drawer opens
 * @fires bp-close - Fired when the drawer closes (includes reason: 'escape' | 'backdrop' | 'close-button' | 'api')
 * @fires bp-after-open - Fired after open animation completes
 * @fires bp-after-close - Fired after close animation completes
 *
 * @slot - Default slot for drawer content
 * @slot header - Optional header content
 * @slot footer - Optional footer content
 *
 * @csspart drawer - The drawer container
 * @csspart backdrop - The backdrop overlay (when not inline)
 * @csspart panel - The drawer panel
 * @csspart header - The header section
 * @csspart body - The body/content section
 * @csspart footer - The footer section
 * @csspart close-button - The close button
 */
@customElement('bp-drawer')
export class BpDrawer extends LitElement {
  /** Whether the drawer is open */
  @property({ type: Boolean, reflect: true }) declare open: boolean;

  /** Which edge the drawer slides in from */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = ['left', 'right', 'top', 'bottom'];
        return value && valid.includes(value)
          ? (value as DrawerPlacement)
          : 'left';
      },
    },
  })
  declare placement: DrawerPlacement;

  /** Size of the drawer (width for left/right, height for top/bottom) */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = ['small', 'medium', 'large', 'full'];
        return value && valid.includes(value)
          ? (value as DrawerSize)
          : 'medium';
      },
    },
  })
  declare size: DrawerSize;

  /** Whether to show the close button */
  @property({ type: Boolean, attribute: 'show-close' })
  declare showClose: boolean;

  /** Whether clicking the backdrop closes the drawer */
  @property({ type: Boolean, attribute: 'close-on-backdrop' })
  declare closeOnBackdrop: boolean;

  /** Whether pressing Escape closes the drawer */
  @property({ type: Boolean, attribute: 'close-on-escape' })
  declare closeOnEscape: boolean;

  /** Whether to show the backdrop overlay */
  @property({ type: Boolean, attribute: 'show-backdrop' })
  declare showBackdrop: boolean;

  /** Accessible label for the drawer */
  @property({ type: String }) declare label: string;

  /**
   * Whether the drawer is rendered inline (always visible, part of document flow).
   * When true, the drawer acts as a static sidebar without overlay behavior.
   */
  @property({ type: Boolean, reflect: true }) declare inline: boolean;

  /** Whether the drawer has a header slot content */
  @property({ type: Boolean, attribute: false }) private hasHeader = false;

  /** Whether the drawer has a footer slot content */
  @property({ type: Boolean, attribute: false }) private hasFooter = false;

  private previouslyFocusedElement: HTMLElement | null = null;

  static styles = [drawerStyles];

  constructor() {
    super();
    this.open = false;
    this.placement = 'left';
    this.size = 'medium';
    this.showClose = true;
    this.closeOnBackdrop = true;
    this.closeOnEscape = true;
    this.showBackdrop = true;
    this.label = '';
    this.inline = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Open the drawer.
   * Sets open property to true and manages focus/scroll behavior.
   *
   * @fires bp-open - Emitted when the drawer opens
   * @fires bp-after-open - Emitted after open animation completes
   */
  show(): void {
    if (this.open) return;
    this.open = true;
  }

  /**
   * Close the drawer.
   * Sets open property to false if bp-close event is not prevented.
   *
   * @param reason - The reason the drawer was closed
   * @fires bp-close - Emitted when the drawer closes (cancelable)
   * @fires bp-after-close - Emitted after close animation completes
   */
  hide(reason: 'escape' | 'backdrop' | 'close-button' | 'api' = 'api'): void {
    if (!this.open) return;

    const event = new CustomEvent('bp-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(event);

    if (!event.defaultPrevented) {
      this.open = false;
    }
  }

  /**
   * Toggle the drawer open/closed state.
   * Calls hide() if open, show() if closed.
   */
  toggle(): void {
    if (this.open) {
      this.hide('api');
    } else {
      this.show();
    }
  }

  protected updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  private handleOpen(): void {
    if (!this.inline) {
      // Store currently focused element
      this.previouslyFocusedElement = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    this.dispatchEvent(
      new CustomEvent('bp-open', {
        bubbles: true,
        composed: true,
      })
    );

    // Focus the drawer panel for accessibility
    this.updateComplete.then(() => {
      const panel = this.shadowRoot?.querySelector('.panel') as HTMLElement;
      panel?.focus();

      this.dispatchEvent(
        new CustomEvent('bp-after-open', {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  private handleClose(): void {
    if (!this.inline) {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent('bp-after-close', {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === 'Escape' &&
      this.closeOnEscape &&
      this.open &&
      !this.inline
    ) {
      event.preventDefault();
      this.hide('escape');
    }
  };

  /**
   * Handles click events on the backdrop overlay.
   * Closes the drawer if closeOnBackdrop is true.
   */
  private handleBackdropClick = (): void => {
    if (this.closeOnBackdrop) {
      this.hide('backdrop');
    }
  };

  /**
   * Handles click events on the close button.
   * Closes the drawer with reason 'close-button'.
   */
  private handleCloseClick = (): void => {
    this.hide('close-button');
  };

  /**
   * Handles slot change events for the header slot.
   * Updates hasHeader state to control header visibility.
   *
   * @param event - The slotchange event
   */
  private handleHeaderSlotChange = (event: Event): void => {
    const slot = event.target as HTMLElement & {
      assignedNodes: (options?: { flatten?: boolean }) => Node[];
    };
    this.hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
  };

  /**
   * Handles slot change events for the footer slot.
   * Updates hasFooter state to control footer visibility.
   *
   * @param event - The slotchange event
   */
  private handleFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLElement & {
      assignedNodes: (options?: { flatten?: boolean }) => Node[];
    };
    this.hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
  };

  render() {
    const isHorizontal =
      this.placement === 'left' || this.placement === 'right';

    // Inline mode: always visible, no backdrop, no overlay behavior
    if (this.inline) {
      return html`
        <aside
          class="drawer drawer--inline drawer--${this.placement} drawer--${this
            .size} ${isHorizontal ? 'drawer--horizontal' : 'drawer--vertical'}"
          part="drawer"
          role="complementary"
          aria-label=${this.label || nothing}
        >
          <div class="panel" part="panel">
            ${this.hasHeader || this.showClose
              ? html`
                  <header class="header" part="header">
                    <slot
                      name="header"
                      @slotchange=${this.handleHeaderSlotChange}
                    ></slot>
                  </header>
                `
              : html`<slot
                  name="header"
                  @slotchange=${this.handleHeaderSlotChange}
                ></slot>`}
            <div class="body" part="body">
              <slot></slot>
            </div>
            ${this.hasFooter
              ? html`
                  <footer class="footer" part="footer">
                    <slot
                      name="footer"
                      @slotchange=${this.handleFooterSlotChange}
                    ></slot>
                  </footer>
                `
              : html`<slot
                  name="footer"
                  @slotchange=${this.handleFooterSlotChange}
                ></slot>`}
          </div>
        </aside>
      `;
    }

    // Overlay mode: slide-in panel with backdrop
    return html`
      <div
        class="drawer drawer--overlay drawer--${this.placement} drawer--${this
          .size} ${isHorizontal
          ? 'drawer--horizontal'
          : 'drawer--vertical'} ${this.open ? 'drawer--open' : ''}"
        part="drawer"
      >
        ${this.showBackdrop
          ? html`
              <div
                class="backdrop ${this.open ? 'backdrop--visible' : ''}"
                part="backdrop"
                @click=${this.handleBackdropClick}
                aria-hidden="true"
              ></div>
            `
          : nothing}
        <aside
          class="panel ${this.open ? 'panel--open' : ''}"
          part="panel"
          role="dialog"
          aria-modal="true"
          aria-label=${this.label || nothing}
          tabindex="-1"
        >
          <header
            class="header ${this.hasHeader || this.showClose
              ? ''
              : 'header--empty'}"
            part="header"
          >
            <slot
              name="header"
              @slotchange=${this.handleHeaderSlotChange}
            ></slot>
            ${this.showClose
              ? html`
                  <button
                    class="close-button"
                    part="close-button"
                    type="button"
                    aria-label="Close drawer"
                    @click=${this.handleCloseClick}
                  >
                    <bp-icon name="close" size="sm"></bp-icon>
                  </button>
                `
              : nothing}
          </header>
          <div class="body" part="body">
            <slot></slot>
          </div>
          ${this.hasFooter
            ? html`
                <footer class="footer" part="footer">
                  <slot
                    name="footer"
                    @slotchange=${this.handleFooterSlotChange}
                  ></slot>
                </footer>
              `
            : html`<slot
                name="footer"
                @slotchange=${this.handleFooterSlotChange}
              ></slot>`}
        </aside>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-drawer': BpDrawer;
  }
}
