import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { popoverStyles } from './popover.style.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';
import '../icon/icon.js';
import '../icon/icons/entries/close.js';

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';

/**
 * A popover component that displays rich content in a floating panel.
 * Supports multiple trigger modes: click, hover, focus, or manual control.
 *
 * @fires bp-show - Fired when the popover opens
 * @fires bp-hide - Fired when the popover closes
 * @fires bp-after-show - Fired after the popover open animation completes
 * @fires bp-after-hide - Fired after the popover close animation completes
 *
 * @slot - The trigger element that controls the popover
 * @slot content - The rich content to display in the popover panel
 * @slot header - Optional header content for the popover
 * @slot footer - Optional footer content for the popover
 *
 * @csspart trigger - The trigger wrapper element
 * @csspart panel - The popover panel container
 * @csspart header - The header section
 * @csspart body - The body/content section
 * @csspart footer - The footer section
 * @csspart arrow - The arrow pointing to the trigger
 * @csspart close-button - The close button (when showClose is true)
 */
@customElement('bp-popover')
export class BpPopover extends LitElement {
  /** Whether the popover is currently open */
  @property({ type: Boolean, reflect: true }) declare open: boolean;

  /** Placement of the popover relative to the trigger */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null): PopoverPlacement => {
        const validPlacements: PopoverPlacement[] = [
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
          'right',
          'right-start',
          'right-end',
        ];
        return validPlacements.includes(value as PopoverPlacement)
          ? (value as PopoverPlacement)
          : 'bottom';
      },
    },
  })
  declare placement: PopoverPlacement;

  /** How the popover is triggered */
  @property({
    type: String,
    converter: {
      fromAttribute: (value: string | null): PopoverTrigger => {
        const validTriggers: PopoverTrigger[] = [
          'click',
          'hover',
          'focus',
          'manual',
        ];
        return validTriggers.includes(value as PopoverTrigger)
          ? (value as PopoverTrigger)
          : 'click';
      },
    },
  })
  declare trigger: PopoverTrigger;

  /** Whether to show an arrow pointing to the trigger */
  @property({ type: Boolean }) declare arrow: boolean;

  /** Whether to show a close button in the popover */
  @property({ type: Boolean, attribute: 'show-close' })
  declare showClose: boolean;

  /** Whether clicking outside closes the popover */
  @property({
    converter: booleanConverter,
    attribute: 'close-on-outside-click',
    reflect: true,
  })
  declare closeOnOutsideClick: boolean;

  /** Whether pressing Escape closes the popover */
  @property({
    converter: booleanConverter,
    attribute: 'close-on-escape',
    reflect: true,
  })
  declare closeOnEscape: boolean;

  /** Distance in pixels between the trigger and the panel */
  @property({ type: Number }) declare distance: number;

  /** Delay in milliseconds before showing (for hover trigger) */
  @property({ type: Number, attribute: 'show-delay' })
  declare showDelay: number;

  /** Delay in milliseconds before hiding (for hover trigger) */
  @property({ type: Number, attribute: 'hide-delay' })
  declare hideDelay: number;

  /** Whether the popover is disabled */
  @property({ type: Boolean }) declare disabled: boolean;

  /** Accessible label for the popover panel */
  @property({ type: String }) declare label: string;

  /** Whether the popover has header slot content */
  @state() private hasHeader = false;

  /** Whether the popover has footer slot content */
  @state() private hasFooter = false;

  @query('.popover__trigger') private triggerElement!: HTMLElement;

  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private popoverId = `popover-${Math.random().toString(36).substring(2, 11)}`;

  static styles = [popoverStyles];

  constructor() {
    super();
    this.open = false;
    this.placement = 'bottom';
    this.trigger = 'click';
    this.arrow = false;
    this.showClose = false;
    this.closeOnOutsideClick = true;
    this.closeOnEscape = true;
    this.distance = 8;
    this.showDelay = 200;
    this.hideDelay = 200;
    this.disabled = false;
    this.label = '';
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick, {
      passive: true,
    });
    document.addEventListener('keydown', this.handleDocumentKeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick, {
      passive: true,
    } as EventListenerOptions);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    this.clearTimeouts();
  }

  /** Show the popover */
  show(): void {
    if (this.disabled || this.open) return;

    this.clearTimeouts();
    this.open = true;

    this.dispatchEvent(
      new CustomEvent('bp-show', { bubbles: true, composed: true })
    );

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent('bp-after-show', { bubbles: true, composed: true })
      );
    });
  }

  /** Hide the popover */
  hide(): void {
    if (!this.open) return;

    this.clearTimeouts();
    this.open = false;

    this.dispatchEvent(
      new CustomEvent('bp-hide', { bubbles: true, composed: true })
    );

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent('bp-after-hide', { bubbles: true, composed: true })
      );
    });
  }

  /** Toggle the popover open/closed */
  toggle(): void {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Clears any pending show/hide timeout operations.
   * Prevents race conditions with rapid trigger interactions.
   */
  private clearTimeouts(): void {
    if (this.showTimeout !== null) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout !== null) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Handles click events on the trigger element.
   * Toggles popover state for click trigger mode.
   * @param event - The mouse click event
   */
  private handleTriggerClick = (event: MouseEvent): void => {
    if (this.disabled || this.trigger !== 'click') return;
    event.stopPropagation();
    this.toggle();
  };

  /**
   * Handles keyboard events on the trigger element.
   * Toggles popover on Enter or Space key for click trigger mode.
   * @param event - The keyboard event
   */
  private handleTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (
      this.trigger === 'click' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      this.toggle();
    }
  };

  /**
   * Handles mouse enter events on the trigger element.
   * Starts the show delay timer for hover trigger mode.
   */
  private handleTriggerMouseEnter = (): void => {
    if (this.disabled || this.trigger !== 'hover') return;

    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      this.show();
    }, this.showDelay);
  };

  /**
   * Handles mouse leave events on the trigger element.
   * Starts the hide delay timer for hover trigger mode.
   */
  private handleTriggerMouseLeave = (): void => {
    if (this.trigger !== 'hover') return;

    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  };

  /**
   * Handles mouse enter events on the popover panel.
   * Prevents the popover from hiding when hovering over panel content in hover trigger mode.
   */
  private handlePanelMouseEnter = (): void => {
    if (this.trigger !== 'hover') return;
    this.clearTimeouts();
  };

  /**
   * Handles mouse leave events on the popover panel.
   * Starts the hide delay timer when leaving panel in hover trigger mode.
   */
  private handlePanelMouseLeave = (): void => {
    if (this.trigger !== 'hover') return;

    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  };

  /**
   * Handles focus events on the trigger element.
   * Shows popover immediately for focus trigger mode.
   */
  private handleTriggerFocus = (): void => {
    if (this.disabled || this.trigger !== 'focus') return;
    this.show();
  };

  /**
   * Handles blur events on the trigger element.
   * Hides popover immediately for focus trigger mode.
   */
  private handleTriggerBlur = (): void => {
    if (this.trigger !== 'focus') return;
    this.hide();
  };

  /**
   * Handles click events on the document.
   * Closes popover when clicking outside if closeOnOutsideClick is true.
   * @param event - The mouse click event
   */
  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.closeOnOutsideClick || !this.open) return;
    if (this.trigger === 'manual') return;

    const path = event.composedPath();
    if (!path.includes(this)) {
      this.hide();
    }
  };

  /**
   * Handles keyboard events on the document.
   * Closes popover on Escape key if closeOnEscape is true and returns focus to trigger.
   * @param event - The keyboard event
   */
  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.closeOnEscape || !this.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.hide();
      this.triggerElement?.focus();
    }
  };

  /**
   * Handles click events on the close button.
   * Closes the popover immediately.
   */
  private handleCloseClick = (): void => {
    this.hide();
  };

  /**
   * Handles changes to the header slot.
   * Updates internal state to conditionally render header wrapper.
   * @param event - The slotchange event
   */
  private handleHeaderSlotChange = (event: Event): void => {
    const slot = event.target as HTMLElement & {
      assignedNodes: (options?: { flatten?: boolean }) => Node[];
    };
    this.hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
  };

  /**
   * Handles changes to the footer slot.
   * Updates internal state to conditionally render footer wrapper.
   * @param event - The slotchange event
   */
  private handleFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLElement & {
      assignedNodes: (options?: { flatten?: boolean }) => Node[];
    };
    this.hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
  };

  render() {
    return html`
      <div
        class="popover ${this.open ? 'popover--open' : ''} ${this.disabled
          ? 'popover--disabled'
          : ''}"
      >
        <div
          class="popover__trigger"
          part="trigger"
          tabindex=${this.disabled ? -1 : 0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded=${this.open}
          aria-controls=${this.open ? this.popoverId : nothing}
          aria-disabled=${this.disabled}
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeydown}
          @mouseenter=${this.handleTriggerMouseEnter}
          @mouseleave=${this.handleTriggerMouseLeave}
          @focus=${this.handleTriggerFocus}
          @blur=${this.handleTriggerBlur}
        >
          <slot></slot>
        </div>
        ${this.open
          ? html`
              <div
                id=${this.popoverId}
                class="popover__panel popover__panel--${this.placement}"
                part="panel"
                role="dialog"
                aria-label=${this.label || nothing}
                aria-modal="false"
                style="--popover-distance: ${this.distance}px;"
                @mouseenter=${this.handlePanelMouseEnter}
                @mouseleave=${this.handlePanelMouseLeave}
              >
                ${this.arrow
                  ? html`<div class="popover__arrow" part="arrow"></div>`
                  : nothing}
                ${this.hasHeader || this.showClose
                  ? html`
                      <div class="popover__header" part="header">
                        <slot
                          name="header"
                          @slotchange=${this.handleHeaderSlotChange}
                        ></slot>
                        ${this.showClose
                          ? html`
                              <button
                                class="popover__close"
                                part="close-button"
                                type="button"
                                aria-label="Close popover"
                                @click=${this.handleCloseClick}
                              >
                                <bp-icon name="close" size="sm"></bp-icon>
                              </button>
                            `
                          : nothing}
                      </div>
                    `
                  : html`<slot
                      name="header"
                      @slotchange=${this.handleHeaderSlotChange}
                    ></slot>`}
                <div class="popover__body" part="body">
                  <slot name="content"></slot>
                </div>
                ${this.hasFooter
                  ? html`
                      <div class="popover__footer" part="footer">
                        <slot
                          name="footer"
                          @slotchange=${this.handleFooterSlotChange}
                        ></slot>
                      </div>
                    `
                  : html`<slot
                      name="footer"
                      @slotchange=${this.handleFooterSlotChange}
                    ></slot>`}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-popover': BpPopover;
  }
}
