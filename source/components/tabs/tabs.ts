import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  state,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { tabsStyles } from './tabs.style.js';
import type { IconName } from '../icon/icons/registry.generated.js';

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsVariant = 'default' | 'pills' | 'underline';
export type TabsPlacement = 'top' | 'bottom' | 'start' | 'end';

/**
 * Tab item interface for programmatic tab configuration
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Icon name to display before the label */
  icon?: IconName;
  /** Whether this tab can be closed */
  closable?: boolean;
}

/**
 * A tabs component for organizing content into tabbed sections.
 *
 * @element bp-tabs
 *
 * @property {string} value - The ID of the currently selected tab
 * @property {TabItem[]} tabs - Array of tab items (alternative to slotted tabs)
 * @property {TabsSize} size - The size of the tabs
 * @property {TabsVariant} variant - The visual style of the tabs
 * @property {TabsPlacement} placement - Position of the tab list relative to panels
 * @property {boolean} disabled - Whether all tabs are disabled
 * @property {boolean} manual - Whether activation requires pressing Enter/Space (vs automatic on arrow)
 *
 * @slot - Default slot for bp-tab-panel elements
 * @slot tab - Slot for custom tab buttons (use with data-tab-id attribute)
 *
 * @fires bp-tab-change - Fired when the selected tab changes
 * @fires bp-tab-close - Fired when a closable tab's close button is clicked
 *
 * @csspart tabs - The main container
 * @csspart tablist - The tab button list container
 * @csspart tab - Individual tab button
 * @csspart tab-active - The currently active tab
 * @csspart tab-disabled - A disabled tab
 * @csspart panels - The panel container
 * @csspart panel - Individual panel wrapper
 */
@customElement('bp-tabs')
export class BpTabs extends LitElement {
  /**
   * The ID of the currently selected tab
   */
  @property({ type: String, reflect: true }) declare value: string;

  /**
   * Array of tab items for programmatic tab configuration
   */
  @property({ type: Array }) declare tabs: TabItem[];

  /**
   * The size of the tabs
   */
  @property({ type: String, reflect: true }) declare size: TabsSize;

  /**
   * The visual style of the tabs
   */
  @property({ type: String, reflect: true }) declare variant: TabsVariant;

  /**
   * Position of the tab list relative to panels
   */
  @property({ type: String, reflect: true }) declare placement: TabsPlacement;

  /**
   * Whether all tabs are disabled
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Whether activation requires pressing Enter/Space (manual) vs automatic on arrow navigation
   */
  @property({ type: Boolean, reflect: true }) declare manual: boolean;

  @state() private focusedTabId: string | null = null;

  @queryAssignedElements({ slot: '', flatten: true })
  private panelElements!: HTMLElement[];

  static styles = [tabsStyles];

  constructor() {
    super();
    this.value = '';
    this.tabs = [];
    this.size = 'md';
    this.variant = 'default';
    this.placement = 'top';
    this.disabled = false;
    this.manual = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tablist');
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this.updatePanelVisibility();
    }
  }

  private handleSlotChange = () => {
    // Auto-select first tab if none selected
    if (!this.value && this.tabs.length > 0) {
      const firstEnabled = this.tabs.find((tab) => !tab.disabled);
      if (firstEnabled) {
        this.value = firstEnabled.id;
      }
    } else if (!this.value) {
      // Check for panels with data-tab-id
      const panels = this.getPanels();
      if (panels.length > 0) {
        this.value = panels[0].getAttribute('data-tab-id') || '';
      }
    }

    this.updatePanelVisibility();
  };

  private getPanels(): HTMLElement[] {
    return this.panelElements.filter(
      (el) => el.hasAttribute('data-tab-id') || el.tagName === 'BP-TAB-PANEL'
    );
  }

  private getEnabledTabs(): TabItem[] {
    return this.tabs.filter((tab) => !tab.disabled);
  }

  private updatePanelVisibility() {
    const panels = this.getPanels();
    panels.forEach((panel) => {
      const panelId = panel.getAttribute('data-tab-id') || '';
      const isActive = panelId === this.value;
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
      if (isActive) {
        panel.setAttribute('tabindex', '0');
      } else {
        panel.removeAttribute('tabindex');
      }
    });
  }

  private handleTabClick = (tabId: string, disabled: boolean) => {
    if (disabled || this.disabled) return;

    this.selectTab(tabId);
  };

  private handleTabKeyDown = (event: KeyboardEvent, tabId: string) => {
    if (this.disabled) return;

    const enabledTabs = this.getEnabledTabs();
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === tabId);

    let newIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        handled = true;
        newIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        handled = true;
        newIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        break;

      case 'Home':
        event.preventDefault();
        handled = true;
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        handled = true;
        newIndex = enabledTabs.length - 1;
        break;

      case 'Enter':
      case ' ':
        if (this.manual && this.focusedTabId) {
          event.preventDefault();
          handled = true;
          this.selectTab(this.focusedTabId);
        }
        break;

      case 'Delete':
      case 'Backspace': {
        const tab = this.tabs.find((t) => t.id === tabId);
        if (tab?.closable) {
          event.preventDefault();
          handled = true;
          this.handleTabClose(event, tabId);
        }
        break;
      }
    }

    if (handled && newIndex !== currentIndex) {
      const newTab = enabledTabs[newIndex];
      if (newTab) {
        this.focusedTabId = newTab.id;
        this.focusTab(newTab.id);

        // In automatic mode, select the tab on arrow navigation
        if (!this.manual) {
          this.selectTab(newTab.id);
        }
      }
    }
  };

  private focusTab(tabId: string) {
    const tabButton = this.shadowRoot?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLElement | null;
    tabButton?.focus();
  }

  private selectTab(tabId: string) {
    const previousValue = this.value;
    if (previousValue === tabId) return;

    this.value = tabId;
    this.updatePanelVisibility();

    this.dispatchEvent(
      new CustomEvent('bp-tab-change', {
        detail: {
          value: tabId,
          previousValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleTabClose = (event: Event, tabId: string) => {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('bp-tab-close', {
        detail: { tabId },
        bubbles: true,
        composed: true,
      })
    );

    // Remove the closed tab
    const closedIndex = this.tabs.findIndex((t) => t.id === tabId);
    this.tabs = this.tabs.filter((t) => t.id !== tabId);

    // If the closed tab was active, activate an adjacent tab
    if (this.value === tabId && this.tabs.length > 0) {
      const nextIndex = Math.min(closedIndex, this.tabs.length - 1);
      this.value = this.tabs[nextIndex].id;
    }
  };

  private handleTabFocus = (tabId: string) => {
    this.focusedTabId = tabId;
  };

  private handleTabBlur = () => {
    this.focusedTabId = null;
  };

  private renderTab(tab: TabItem) {
    const isActive = this.value === tab.id;
    const isDisabled = tab.disabled || this.disabled;

    const tabClasses = {
      tab: true,
      'tab--active': isActive,
      'tab--disabled': isDisabled,
    };

    return html`
      <button
        class=${classMap(tabClasses)}
        part="tab ${isActive ? 'tab-active' : ''} ${isDisabled
          ? 'tab-disabled'
          : ''}"
        role="tab"
        data-tab-id=${tab.id}
        id="tab-${tab.id}"
        aria-selected=${isActive}
        aria-controls="panel-${tab.id}"
        aria-disabled=${isDisabled}
        tabindex=${isActive ? 0 : -1}
        ?disabled=${isDisabled}
        @click=${() => this.handleTabClick(tab.id, isDisabled)}
        @keydown=${(e: KeyboardEvent) => this.handleTabKeyDown(e, tab.id)}
        @focus=${() => this.handleTabFocus(tab.id)}
        @blur=${this.handleTabBlur}
      >
        ${tab.icon
          ? html`<bp-icon name=${tab.icon} class="tab__icon"></bp-icon>`
          : nothing}
        <span class="tab__label">${tab.label}</span>
        ${tab.closable
          ? html`
              <button
                class="tab__close"
                part="tab-close"
                aria-label="Close ${tab.label}"
                @click=${(e: Event) => this.handleTabClose(e, tab.id)}
                @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            `
          : nothing}
      </button>
    `;
  }

  render() {
    const containerClasses = {
      tabs: true,
      [`tabs--${this.size}`]: true,
      [`tabs--${this.variant}`]: true,
      [`tabs--${this.placement}`]: true,
      'tabs--disabled': this.disabled,
    };

    const isVertical = this.placement === 'start' || this.placement === 'end';

    return html`
      <div
        class=${classMap(containerClasses)}
        part="tabs"
        aria-orientation=${isVertical ? 'vertical' : 'horizontal'}
      >
        <div class="tablist" part="tablist" role="tablist">
          ${repeat(
            this.tabs,
            (tab) => tab.id,
            (tab) => this.renderTab(tab)
          )}
        </div>
        <div class="panels" part="panels">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

/**
 * A tab panel component for use with bp-tabs.
 *
 * @element bp-tab-panel
 *
 * @property {string} tabId - The ID that links this panel to its tab
 *
 * @slot - Content of the panel
 *
 * @csspart panel - The panel container
 */
@customElement('bp-tab-panel')
export class BpTabPanel extends LitElement {
  /**
   * The ID that links this panel to its tab
   */
  @property({ type: String, attribute: 'tab-id', reflect: true })
  declare tabId: string;

  constructor() {
    super();
    this.tabId = '';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    this.setAttribute('data-tab-id', this.tabId);
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('tabId')) {
      this.setAttribute('data-tab-id', this.tabId);
      this.id = `panel-${this.tabId}`;
      this.setAttribute('aria-labelledby', `tab-${this.tabId}`);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-tabs': BpTabs;
    'bp-tab-panel': BpTabPanel;
  }
}
