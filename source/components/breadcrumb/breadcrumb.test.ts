import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './breadcrumb.js';
import type {
  BpBreadcrumb,
  BpBreadcrumbItem,
  BreadcrumbItem,
} from './breadcrumb.js';

describe('bp-breadcrumb', () => {
  let element: BpBreadcrumb;

  const createItems = (items: BreadcrumbItem[]) => {
    element.items = items;
    return element.updateComplete;
  };

  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Current Page' },
  ];

  beforeEach(() => {
    element = document.createElement('bp-breadcrumb');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  describe('Registration', () => {
    it('should be registered in HTMLElementTagNameMap', () => {
      const constructor = customElements.get('bp-breadcrumb');
      expect(constructor).toBeDefined();
    });

    it('should register bp-breadcrumb-item custom element', () => {
      const constructor = customElements.get('bp-breadcrumb-item');
      expect(constructor).toBeDefined();
    });
  });

  // Rendering tests
  describe('Rendering', () => {
    it('should render with default properties', async () => {
      await element.updateComplete;
      expect(element.shadowRoot).toBeTruthy();
    });

    it('should render nav element to DOM', async () => {
      await element.updateComplete;
      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('should render ordered list element', async () => {
      await element.updateComplete;
      const list = element.shadowRoot?.querySelector('ol');
      expect(list).toBeTruthy();
    });

    it('should render breadcrumb items', async () => {
      await createItems(defaultItems);
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(4);
    });

    it('should render separators between items', async () => {
      await createItems(defaultItems);
      await element.updateComplete;

      const separators = element.shadowRoot?.querySelectorAll('.separator');
      // Should have 3 separators for 4 items
      expect(separators?.length).toBe(3);
    });
  });

  // Default Values tests
  describe('Default Values', () => {
    it('should have correct default property values', () => {
      expect(element.items).toEqual([]);
      expect(element.size).toBe('md');
      expect(element.separator).toBe('slash');
      expect(element.ariaLabel).toBe('Breadcrumb');
      expect(element.collapseOnMobile).toBe(false);
      expect(element.maxItems).toBe(0);
    });

    it('should have default size class applied', async () => {
      await element.updateComplete;
      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.classList.contains('breadcrumb--md')).toBe(true);
    });

    it('should have default separator class applied', async () => {
      await element.updateComplete;
      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.classList.contains('breadcrumb--slash')).toBe(true);
    });
  });

  // Property tests
  describe('Properties', () => {
    it('should set property: items', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Page', href: '/page' },
      ];
      element.items = items;
      await element.updateComplete;

      const renderedItems = element.shadowRoot?.querySelectorAll('.item');
      expect(renderedItems?.length).toBe(2);
    });

    it('should set property: size', async () => {
      element.size = 'lg';
      await element.updateComplete;

      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.classList.contains('breadcrumb--lg')).toBe(true);
    });

    it('should set property: separator', async () => {
      element.separator = 'chevron';
      await element.updateComplete;

      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.classList.contains('breadcrumb--chevron')).toBe(true);
    });

    it('should set property: ariaLabel', async () => {
      element.ariaLabel = 'Site navigation';
      await element.updateComplete;

      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Site navigation');
    });

    it('should set property: maxItems', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Level 3', href: '/3' },
        { label: 'Current' },
      ];
      element.maxItems = 3;
      await element.updateComplete;

      // Should show: Home, ellipsis, Level 3, Current (3 visible + ellipsis)
      const ellipsis = element.shadowRoot?.querySelector('.item--ellipsis');
      expect(ellipsis).toBeTruthy();
    });

    it('should set property: collapseOnMobile', async () => {
      element.collapseOnMobile = true;
      await element.updateComplete;

      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.classList.contains('breadcrumb--collapse-mobile')).toBe(true);
    });

    it('should render links for items with href', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const links = element.shadowRoot?.querySelectorAll('.link');
      expect(links?.length).toBe(1);
      expect(links?.[0]?.getAttribute('href')).toBe('/');
    });

    it('should render text for current item', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const textElements = element.shadowRoot?.querySelectorAll('.text');
      expect(textElements?.length).toBe(1);
    });
  });

  // Attribute tests
  describe('Attributes', () => {
    it('should reflect size attribute', async () => {
      element.size = 'sm';
      await element.updateComplete;
      expect(element.getAttribute('size')).toBe('sm');
    });

    it('should reflect separator attribute', async () => {
      element.separator = 'dot';
      await element.updateComplete;
      expect(element.getAttribute('separator')).toBe('dot');
    });

    it('should set aria-current on current item', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const currentItem = element.shadowRoot?.querySelector(
        '.text[aria-current="page"]'
      );
      expect(currentItem).toBeTruthy();
    });

    it('should set aria-hidden on separators', async () => {
      await createItems(defaultItems);
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.separator');
      expect(separator?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // Event tests
  describe('Events', () => {
    it('should emit bp-breadcrumb-click event when item is clicked', async () => {
      await createItems([
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
      ]);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-breadcrumb-click', handler);

      const link = element.shadowRoot?.querySelector(
        '.link'
      ) as HTMLAnchorElement;
      link?.click();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.item.label).toBe('Home');
      expect(handler.mock.calls[0][0].detail.index).toBe(0);
    });

    it('should emit event with correct item data', async () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/', icon: 'home' },
        { label: 'Products', href: '/products' },
      ];
      await createItems(items);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-breadcrumb-click', handler);

      const link = element.shadowRoot?.querySelector(
        '.link'
      ) as HTMLAnchorElement;
      link?.click();

      expect(handler.mock.calls[0][0].detail.item).toEqual(items[0]);
    });

    it('should emit event with bubbles and composed flags', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-breadcrumb-click', handler);

      const link = element.shadowRoot?.querySelector(
        '.link'
      ) as HTMLAnchorElement;
      link?.click();

      expect(handler).toHaveBeenCalled();
      const eventObject = handler.mock.calls[0][0] as CustomEvent;
      expect(eventObject.bubbles).toBe(true);
      expect(eventObject.composed).toBe(true);
    });

    it('should emit event on Enter key press', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-breadcrumb-click', handler);

      const link = element.shadowRoot?.querySelector(
        '.link'
      ) as HTMLAnchorElement;
      link?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(handler).toHaveBeenCalled();
    });

    it('should emit event on Space key press', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('bp-breadcrumb-click', handler);

      const link = element.shadowRoot?.querySelector(
        '.link'
      ) as HTMLAnchorElement;
      link?.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  // CSS Parts tests
  describe('CSS Parts', () => {
    it('should expose nav part', async () => {
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="nav"]');
      expect(part).toBeTruthy();
    });

    it('should expose list part', async () => {
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="list"]');
      expect(part).toBeTruthy();
    });

    it('should expose item part', async () => {
      await createItems([{ label: 'Home', href: '/' }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="item"]');
      expect(part).toBeTruthy();
    });

    it('should expose item-current part on current item', async () => {
      await createItems([{ label: 'Current' }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="item-current"]');
      expect(part).toBeTruthy();
    });

    it('should expose link part', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="link"]');
      expect(part).toBeTruthy();
    });

    it('should expose separator part', async () => {
      await createItems([{ label: 'Home', href: '/' }, { label: 'Current' }]);
      await element.updateComplete;
      const part = element.shadowRoot?.querySelector('[part~="separator"]');
      expect(part).toBeTruthy();
    });

    it('should expose ellipsis part when items are collapsed', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Current' },
      ];
      element.maxItems = 2;
      await element.updateComplete;

      const part = element.shadowRoot?.querySelector('[part~="ellipsis"]');
      expect(part).toBeTruthy();
    });
  });

  // Separator variants tests
  describe('Variants', () => {
    it('should render slash separator by default', async () => {
      await createItems(defaultItems);
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.separator__icon');
      expect(separator?.textContent?.trim()).toBe('/');
    });

    it('should render chevron separator', async () => {
      element.separator = 'chevron';
      await createItems(defaultItems);
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.separator');
      expect(separator).toBeTruthy();
      // Chevron uses SVG
      const svg =
        separator?.querySelector('svg') ||
        separator?.querySelector('.separator__icon svg');
      expect(svg).toBeTruthy();
    });

    it('should render arrow separator', async () => {
      element.separator = 'arrow';
      await createItems(defaultItems);
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.separator');
      expect(separator).toBeTruthy();
      // Arrow uses SVG
      const svg =
        separator?.querySelector('svg') ||
        separator?.querySelector('.separator__icon svg');
      expect(svg).toBeTruthy();
    });

    it('should render dot separator', async () => {
      element.separator = 'dot';
      await createItems(defaultItems);
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector(
        '.separator__icon--dot'
      );
      expect(separator?.textContent?.trim()).toBe('•');
    });
  });

  // Max items / collapsing tests
  describe('Collapsing', () => {
    it('should show all items when maxItems is 0', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Level 3', href: '/3' },
        { label: 'Current' },
      ];
      element.maxItems = 0;
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(5);
    });

    it('should collapse items when exceeding maxItems', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Level 3', href: '/3' },
        { label: 'Current' },
      ];
      element.maxItems = 3;
      await element.updateComplete;

      // Should show Home, ellipsis, Level 3, Current = 4 items including ellipsis
      const items = element.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(4);
    });

    it('should show ellipsis button with hidden count', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Level 3', href: '/3' },
        { label: 'Current' },
      ];
      element.maxItems = 3;
      await element.updateComplete;

      const ellipsisButton =
        element.shadowRoot?.querySelector('.ellipsis-button');
      expect(ellipsisButton?.getAttribute('aria-label')).toBe(
        'Show 2 more items'
      );
    });

    it('should not show ellipsis when items fit within maxItems', async () => {
      element.items = [{ label: 'Home', href: '/' }, { label: 'Current' }];
      element.maxItems = 3;
      await element.updateComplete;

      const ellipsis = element.shadowRoot?.querySelector('.item--ellipsis');
      expect(ellipsis).toBeNull();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should provide accessible label for ellipsis button', async () => {
      element.items = [
        { label: 'Home', href: '/' },
        { label: 'L1', href: '/1' },
        { label: 'L2', href: '/2' },
        { label: 'L3', href: '/3' },
        { label: 'Current' },
      ];
      element.maxItems = 3;
      await element.updateComplete;

      const ellipsisButton =
        element.shadowRoot?.querySelector('.ellipsis-button');
      expect(ellipsisButton?.getAttribute('aria-label')).toContain(
        'more items'
      );
    });
  });

  // Icon support tests
  describe('Icons', () => {
    it('should render icon when item has icon property', async () => {
      await createItems([{ label: 'Home', href: '/', icon: 'home' }]);
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.item__icon');
      expect(icon).toBeTruthy();
    });

    it('should not render icon when item has no icon property', async () => {
      await createItems([{ label: 'Home', href: '/' }]);
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.item__icon');
      expect(icon).toBeNull();
    });
  });

  // Slot tests
  describe('Slots', () => {
    it('should render default slot when no items provided', async () => {
      await element.updateComplete;

      const slot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).toBeTruthy();
    });

    it('should render separator slot', async () => {
      await createItems(defaultItems);
      await element.updateComplete;

      const separatorSlot = element.shadowRoot?.querySelector(
        'slot[name="separator"]'
      );
      expect(separatorSlot).toBeTruthy();
    });
  });
});

describe('bp-breadcrumb-item', () => {
  let item: BpBreadcrumbItem;

  beforeEach(() => {
    item = document.createElement('bp-breadcrumb-item') as BpBreadcrumbItem;
    document.body.appendChild(item);
  });

  afterEach(() => {
    item.remove();
  });

  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-breadcrumb-item');
    expect(constructor).toBeDefined();
  });

  it('should render with shadow DOM', async () => {
    await item.updateComplete;
    expect(item.shadowRoot).toBeTruthy();
  });

  it('should set property: href', async () => {
    item.href = '/test';
    await item.updateComplete;

    const link = item.shadowRoot?.querySelector('.link');
    expect(link?.getAttribute('href')).toBe('/test');
  });

  it('should set property: current', async () => {
    item.current = true;
    await item.updateComplete;

    expect(item.getAttribute('current')).not.toBeNull();
  });

  it('should render link when href is provided', async () => {
    item.href = '/test';
    await item.updateComplete;

    const link = item.shadowRoot?.querySelector('a.link');
    expect(link).toBeTruthy();
  });

  it('should render text when no href is provided', async () => {
    await item.updateComplete;

    const text = item.shadowRoot?.querySelector('.text');
    expect(text).toBeTruthy();
  });

  it('should render text when current is true even with href', async () => {
    item.href = '/test';
    item.current = true;
    await item.updateComplete;

    const text = item.shadowRoot?.querySelector('.text');
    expect(text).toBeTruthy();
  });

  it('should set aria-current when current is true', async () => {
    item.current = true;
    await item.updateComplete;

    const text = item.shadowRoot?.querySelector('[aria-current="page"]');
    expect(text).toBeTruthy();
  });

  it('should render slotted content', async () => {
    item.innerHTML = 'Test Content';
    await item.updateComplete;

    const slot = item.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('should expose item part', async () => {
    await item.updateComplete;
    const part = item.shadowRoot?.querySelector('[part~="item"]');
    expect(part).toBeTruthy();
  });

  it('should expose item-current part when current', async () => {
    item.current = true;
    await item.updateComplete;
    const part = item.shadowRoot?.querySelector('[part~="item-current"]');
    expect(part).toBeTruthy();
  });

  it('should expose link part when has href', async () => {
    item.href = '/test';
    await item.updateComplete;
    const part = item.shadowRoot?.querySelector('[part~="link"]');
    expect(part).toBeTruthy();
  });
});
