import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { modalStyles } from './modal.style.js';

export type ModalSize = 'small' | 'medium' | 'large';

@customElement('bp-modal')
export class BpModal extends LitElement {
  /** Whether the modal is currently open */
  @property({ type: Boolean, reflect: true }) declare open: boolean;

  /** Size variant of the modal */
  @property({ type: String, reflect: true }) declare size: ModalSize;

  /** ID for aria-labelledby attribute - should match header content */
  @property({ type: String, attribute: 'aria-labelledby' })
  declare ariaLabelledby: string;

  /** Dialog element reference for focus management */
  @query('.modal-dialog') private dialogElement!: HTMLElement;

  /** Store the element that had focus before modal opened */
  @state() private previouslyFocusedElement: HTMLElement | null = null;

  /** Track if body scroll is prevented */
  @state() private bodyScrollPrevented = false;

  static styles = [modalStyles];

  constructor() {
    super();
    this.open = false;
    this.size = 'medium';
    this.ariaLabelledby = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
    this.restoreFocus();
    this.restoreBodyScroll();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  private handleOpen() {
    // Store previously focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Prevent body scroll
    this.preventBodyScroll();

    // Set focus to dialog after it's rendered
    this.updateComplete.then(() => {
      this.setFocusToDialog();
    });
  }

  private handleClose() {
    this.restoreFocus();
    this.restoreBodyScroll();
  }

  private preventBodyScroll() {
    if (!this.bodyScrollPrevented) {
      document.body.style.overflow = 'hidden';
      this.bodyScrollPrevented = true;
    }
  }

  private restoreBodyScroll() {
    if (this.bodyScrollPrevented) {
      document.body.style.overflow = '';
      this.bodyScrollPrevented = false;
    }
  }

  private setFocusToDialog() {
    if (this.dialogElement) {
      this.dialogElement.focus();
    }
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  private handleKeyDown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.close();
    }

    // Trap focus within modal
    if (event.key === 'Tab' && this.open) {
      this.trapFocus(event);
    }
  };

  private trapFocus(event: globalThis.KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.shadowRoot) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const elements = this.shadowRoot.querySelectorAll(
      focusableSelectors.join(',')
    );
    return Array.from(elements) as HTMLElement[];
  }

  private handleBackdropClick = (event: MouseEvent) => {
    // Only close if clicking directly on backdrop (not bubbled from dialog)
    if (event.target === event.currentTarget) {
      this.close();
    }
  };

  private handleCloseButtonClick = () => {
    this.close();
  };

  private close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('bp-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.open) {
      return html``;
    }

    const dialogClasses = {
      'modal-dialog': true,
      [`modal-dialog--${this.size}`]: true,
    };

    return html`
      <div
        class="modal-backdrop"
        part="backdrop"
        @click=${this.handleBackdropClick}
      >
        <div
          class=${classMap(dialogClasses)}
          part="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this.ariaLabelledby || 'modal-header'}
          tabindex="-1"
        >
          <div class="modal-header" part="header">
            <slot name="header"></slot>
            <button
              class="modal-close"
              part="close-button"
              type="button"
              aria-label="Close"
              @click=${this.handleCloseButtonClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body" part="body">
            <slot></slot>
          </div>
          <div class="modal-footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-modal': BpModal;
  }
}
