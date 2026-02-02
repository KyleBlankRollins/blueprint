import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './tabs.js';
import type { BpTabs, BpTabPanel, TabItem } from './tabs.js';

describe('bp-tabs', () => {
  let element: BpTabs;

  const createTabs = (tabs: TabItem[]) => {
    element.tabs = tabs;
    return element.updateComplete;
  };

  beforeEach(() => {
    element = document.createElement('bp-tabs');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  describe('Registration', () => {
    it('should be registered in HTMLElementTagNameMap', () => {
      const constructor = customElements.get('bp-tabs');
      expect(constructor).toBeDefined();
    });

    it('should register bp-tab-panel custom element', () => {
      const constructor = customElements.get('bp-tab-panel');
      expect(constructor).toBeDefined();
    });
  });

  // Rendering tests
  describe('Rendering', () => {
    it('should have a shadow root', async () => {
      await element.updateComplete;
      expect(element.shadowRoot).not.toBeNull();
    });

    it('should render tab buttons for each tab', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      await element.updateComplete;

      const tabButtons = element.shadowRoot?.querySelectorAll('.tab');
      expect(tabButtons?.length).toBe(3);
    });
  });

  // Default Values tests
  describe('Default Values', () => {
    it('should have correct default property values', () => {
      expect(element.value).toBe('');
      expect(element.tabs).toEqual([]);
      expect(element.size).toBe('md');
      expect(element.variant).toBe('default');
      expect(element.placement).toBe('top');
      expect(element.disabled).toBe(false);
      expect(element.manual).toBe(false);
    });
  });

  // Property tests
  describe('Properties', () => {
    it('should set property: value', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab2';
      await element.updateComplete;

      const activeTab = element.shadowRoot?.querySelector('.tab--active');
      expect(activeTab?.getAttribute('data-tab-id')).toBe('tab2');
    });

    it('should set property: tabs', async () => {
      const tabs = [
        { id: 'first', label: 'First' },
        { id: 'second', label: 'Second' },
      ];
      element.tabs = tabs;
      await element.updateComplete;

      const tabButtons = element.shadowRoot?.querySelectorAll('.tab');
      expect(tabButtons?.length).toBe(2);
      expect(tabButtons?.[0]?.textContent?.trim()).toBe('First');
      expect(tabButtons?.[1]?.textContent?.trim()).toBe('Second');
    });

    it('should set property: size', async () => {
      element.size = 'lg';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.classList.contains('tabs--lg')).toBe(true);
    });

    it('should set property: variant', async () => {
      element.variant = 'pills';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.classList.contains('tabs--pills')).toBe(true);
    });

    it('should set property: placement', async () => {
      element.placement = 'start';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.classList.contains('tabs--start')).toBe(true);
    });

    it('should set property: disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.classList.contains('tabs--disabled')).toBe(true);
    });

    it('should set property: manual', async () => {
      element.manual = true;
      await element.updateComplete;
      expect(element.manual).toBe(true);
    });

    it('should render tab with disabled state', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
      ]);
      await element.updateComplete;

      const tabs = element.shadowRoot?.querySelectorAll('.tab');
      expect(tabs?.[1]?.classList.contains('tab--disabled')).toBe(true);
    });
  });

  // Attribute tests
  describe('Attributes', () => {
    it('should reflect value attribute', async () => {
      await createTabs([{ id: 'test', label: 'Test' }]);
      element.value = 'test';
      await element.updateComplete;
      expect(element.getAttribute('value')).toBe('test');
    });

    it('should reflect size attribute', async () => {
      element.size = 'sm';
      await element.updateComplete;
      expect(element.getAttribute('size')).toBe('sm');
    });

    it('should reflect variant attribute', async () => {
      element.variant = 'underline';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('underline');
    });

    it('should reflect placement attribute', async () => {
      element.placement = 'end';
      await element.updateComplete;
      expect(element.getAttribute('placement')).toBe('end');
    });

    it('should reflect disabled attribute', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should reflect manual attribute', async () => {
      element.manual = true;
      await element.updateComplete;
      expect(element.hasAttribute('manual')).toBe(true);
    });

    it('should set aria-selected on active tab', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1 = element.shadowRoot?.querySelector('[data-tab-id="tab1"]');
      const tab2 = element.shadowRoot?.querySelector('[data-tab-id="tab2"]');

      expect(tab1?.getAttribute('aria-selected')).toBe('true');
      expect(tab2?.getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria-disabled on disabled tabs', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
      ]);
      await element.updateComplete;

      const tab2 = element.shadowRoot?.querySelector('[data-tab-id="tab2"]');
      expect(tab2?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set aria-controls on tab buttons', async () => {
      await createTabs([{ id: 'my-tab', label: 'My Tab' }]);
      await element.updateComplete;

      const tab = element.shadowRoot?.querySelector('.tab');
      expect(tab?.getAttribute('aria-controls')).toBe('panel-my-tab');
    });

    it('should set role="tablist" on host', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('tablist');
    });

    it('should set role="tab" on tab buttons', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1' }]);
      await element.updateComplete;

      const tab = element.shadowRoot?.querySelector('.tab');
      expect(tab?.getAttribute('role')).toBe('tab');
    });

    it('should set aria-orientation based on placement', async () => {
      element.placement = 'start';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  // Event tests
  describe('Events', () => {
    it('should emit bp-tab-change event when tab is clicked', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-change', handler);

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;
      tab2Button?.click();

      await element.updateComplete;

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.value).toBe('tab2');
      expect(handler.mock.calls[0][0].detail.previousValue).toBe('tab1');
    });

    it('should not emit event when clicking already active tab', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-change', handler);

      const tab1Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;
      tab1Button?.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should not emit event when clicking disabled tab', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-change', handler);

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;
      tab2Button?.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should not emit event when tabs are globally disabled', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      element.disabled = true;
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-change', handler);

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;
      tab2Button?.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should emit bp-tab-close event when close button is clicked', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', closable: true }]);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-close', handler);

      const closeButton = element.shadowRoot?.querySelector(
        '.tab__close'
      ) as HTMLButtonElement;
      closeButton?.click();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.tabId).toBe('tab1');
    });

    it('should emit event with bubbles and composed flags', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-tab-change', handler);

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;
      tab2Button?.click();

      expect(handler.mock.calls[0][0].bubbles).toBe(true);
      expect(handler.mock.calls[0][0].composed).toBe(true);
    });
  });

  // CSS Parts tests
  describe('CSS Parts', () => {
    it('should expose tabs part', async () => {
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tabs"]');
      expect(part).toBeTruthy();
    });

    it('should expose tablist part', async () => {
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tablist"]');
      expect(part).toBeTruthy();
    });

    it('should expose tab part', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1' }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tab"]');
      expect(part).toBeTruthy();
    });

    it('should expose tab-active part on active tab', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1' }]);
      element.value = 'tab1';
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tab-active"]');
      expect(part).toBeTruthy();
    });

    it('should expose tab-disabled part on disabled tab', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', disabled: true }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tab-disabled"]');
      expect(part).toBeTruthy();
    });

    it('should expose panels part', async () => {
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="panels"]');
      expect(part).toBeTruthy();
    });

    it('should expose tab-close part on closable tabs', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', closable: true }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="tab-close"]');
      expect(part).toBeTruthy();
    });
  });

  // Keyboard Interaction tests
  describe('Interactions', () => {
    it('should navigate to next tab with ArrowRight', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;

      tab1Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      await element.updateComplete;

      expect(element.value).toBe('tab2');
    });

    it('should navigate to previous tab with ArrowLeft', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      element.value = 'tab2';
      await element.updateComplete;

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;

      tab2Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      );
      await element.updateComplete;

      expect(element.value).toBe('tab1');
    });

    it('should wrap around from last to first with ArrowRight', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab2';
      await element.updateComplete;

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;

      tab2Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      await element.updateComplete;

      expect(element.value).toBe('tab1');
    });

    it('should navigate to first tab with Home key', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      element.value = 'tab3';
      await element.updateComplete;

      const tab3Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab3"]'
      ) as HTMLButtonElement;

      tab3Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
      );
      await element.updateComplete;

      expect(element.value).toBe('tab1');
    });

    it('should navigate to last tab with End key', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;

      tab1Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true })
      );
      await element.updateComplete;

      expect(element.value).toBe('tab3');
    });

    it('should skip disabled tabs during navigation', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
        { id: 'tab3', label: 'Tab 3' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;

      tab1Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      await element.updateComplete;

      // Should skip tab2 (disabled) and go to tab3
      expect(element.value).toBe('tab3');
    });

    it('should select tab on click', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab2Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;
      tab2Button?.click();
      await element.updateComplete;

      expect(element.value).toBe('tab2');
    });

    it('should not change tab in manual mode without Enter/Space', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      element.manual = true;
      await element.updateComplete;

      const tab1Button = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;

      tab1Button?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      await element.updateComplete;

      // In manual mode, arrow keys only move focus, not selection
      expect(element.value).toBe('tab1');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should have role="tablist" on the container', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('tablist');
    });

    it('should have role="tab" on each tab button', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      await element.updateComplete;

      const tabs = element.shadowRoot?.querySelectorAll('.tab');
      tabs?.forEach((tab) => {
        expect(tab.getAttribute('role')).toBe('tab');
      });
    });

    it('should set tabindex=0 on active tab and -1 on others', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1 = element.shadowRoot?.querySelector('[data-tab-id="tab1"]');
      const tab2 = element.shadowRoot?.querySelector('[data-tab-id="tab2"]');

      expect(tab1?.getAttribute('tabindex')).toBe('0');
      expect(tab2?.getAttribute('tabindex')).toBe('-1');
    });

    it('should have aria-controls linking tab to panel', async () => {
      await createTabs([{ id: 'content-tab', label: 'Content' }]);
      await element.updateComplete;

      const tab = element.shadowRoot?.querySelector('.tab');
      expect(tab?.getAttribute('aria-controls')).toBe('panel-content-tab');
    });

    it('should set unique IDs on tab buttons', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      await element.updateComplete;

      const tab1 = element.shadowRoot?.querySelector('[data-tab-id="tab1"]');
      const tab2 = element.shadowRoot?.querySelector('[data-tab-id="tab2"]');

      expect(tab1?.id).toBe('tab-tab1');
      expect(tab2?.id).toBe('tab-tab2');
    });

    it('should have aria-label on close button', async () => {
      await createTabs([{ id: 'tab1', label: 'My Tab', closable: true }]);
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tab__close');
      expect(closeButton?.getAttribute('aria-label')).toBe('Close My Tab');
    });

    it('should support keyboard focus management', async () => {
      await createTabs([
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]);
      element.value = 'tab1';
      await element.updateComplete;

      const tab1 = element.shadowRoot?.querySelector(
        '[data-tab-id="tab1"]'
      ) as HTMLButtonElement;
      const tab2 = element.shadowRoot?.querySelector(
        '[data-tab-id="tab2"]'
      ) as HTMLButtonElement;

      // Active tab should be focusable
      expect(tab1?.tabIndex).toBe(0);
      // Inactive tab should not be in tab order
      expect(tab2?.tabIndex).toBe(-1);
    });

    it('should set aria-orientation for vertical tabs', async () => {
      element.placement = 'start';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.tabs');
      expect(container?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  // Tab icon tests
  describe('Tab Icons', () => {
    it('should render icon when tab has icon property', async () => {
      await createTabs([{ id: 'tab1', label: 'Settings', icon: 'settings' }]);
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.tab__icon');
      expect(icon).toBeTruthy();
    });

    it('should not render icon when tab has no icon property', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1' }]);
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.tab__icon');
      expect(icon).toBeNull();
    });
  });

  // Closable tabs tests
  describe('Closable Tabs', () => {
    it('should render close button for closable tabs', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', closable: true }]);
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tab__close');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button for non-closable tabs', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', closable: false }]);
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tab__close');
      expect(closeButton).toBeNull();
    });

    it('should stop event propagation on close button click', async () => {
      await createTabs([{ id: 'tab1', label: 'Tab 1', closable: true }]);
      element.value = 'tab1';
      await element.updateComplete;

      const tabChangeHandler = vi.fn();
      const tabCloseHandler = vi.fn();
      element.addEventListener('bp-tab-change', tabChangeHandler);
      element.addEventListener('bp-tab-close', tabCloseHandler);

      const closeButton = element.shadowRoot?.querySelector(
        '.tab__close'
      ) as HTMLButtonElement;
      closeButton?.click();

      // Close event should fire but not tab change
      expect(tabCloseHandler).toHaveBeenCalled();
      expect(tabChangeHandler).not.toHaveBeenCalled();
    });
  });
});

describe('bp-tab-panel', () => {
  let panel: BpTabPanel;

  beforeEach(() => {
    panel = document.createElement('bp-tab-panel') as BpTabPanel;
    document.body.appendChild(panel);
  });

  afterEach(() => {
    panel.remove();
  });

  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-tab-panel');
    expect(constructor).toBeDefined();
  });

  it('should render with shadow DOM', async () => {
    await panel.updateComplete;
    expect(panel.shadowRoot).toBeTruthy();
  });

  it('should set role="tabpanel" on host', async () => {
    await panel.updateComplete;
    expect(panel.getAttribute('role')).toBe('tabpanel');
  });

  it('should set property: tabId', async () => {
    panel.tabId = 'my-panel';
    await panel.updateComplete;

    expect(panel.getAttribute('data-tab-id')).toBe('my-panel');
    expect(panel.getAttribute('tab-id')).toBe('my-panel');
  });

  it('should set id based on tabId', async () => {
    panel.tabId = 'content';
    await panel.updateComplete;

    expect(panel.id).toBe('panel-content');
  });

  it('should set aria-labelledby based on tabId', async () => {
    panel.tabId = 'content';
    await panel.updateComplete;

    expect(panel.getAttribute('aria-labelledby')).toBe('tab-content');
  });

  it('should render slotted content', async () => {
    panel.innerHTML = '<p>Panel content</p>';
    await panel.updateComplete;

    const slot = panel.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });
});
