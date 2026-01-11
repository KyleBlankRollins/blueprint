import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './modal.js';
import type { BpModal } from './modal.js';

describe('bp-modal', () => {
  let element: BpModal;

  beforeEach(() => {
    element = document.createElement('bp-modal');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    // Restore body overflow
    document.body.style.overflow = '';
  });

  describe('Registration', () => {
    it('should be registered in HTMLElementTagNameMap', () => {
      const constructor = customElements.get('bp-modal');
      expect(constructor).toBeDefined();
    });
  });

  describe('Rendering', () => {
    it('should renders with default properties to DOM', async () => {
      await element.updateComplete;
      expect(element.shadowRoot).toBeTruthy();
    });

    it('should have a shadow root', async () => {
      await element.updateComplete;
      expect(element.shadowRoot).not.toBeNull();
    });

    it('should not renders when open is false', async () => {
      element.open = false;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('.modal-backdrop');
      expect(backdrop).toBeNull();
    });
  });

  describe('Variants', () => {
    it('should set property: size to small', async () => {
      element.size = 'small';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('.modal-dialog');
      expect(dialog?.className).toContain('modal-dialog--small');
    });

    it('should set property: size to large', async () => {
      element.size = 'large';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('.modal-dialog');
      expect(dialog?.className).toContain('modal-dialog--large');
    });
  });

  describe('Default Values', () => {
    it('should have default open false', () => {
      expect(element.open).toBe(false);
    });

    it('should have default size "medium"', () => {
      expect(element.size).toBe('medium');
    });
  });

  describe('Properties', () => {
    it('should set property: open', async () => {
      element.open = true;
      await element.updateComplete;
      expect(element.open).toBe(true);

      const backdrop = element.shadowRoot?.querySelector('.modal-backdrop');
      expect(backdrop).toBeTruthy();
    });
  });

  describe('Events', () => {
    it('should emit bp-close event when close method is called', async () => {
      let eventFired = false;

      element.addEventListener('bp-close', () => {
        eventFired = true;
      });

      element.open = true;
      await element.updateComplete;

      // Call close method via close button
      const closeButton = element.shadowRoot?.querySelector(
        '.modal-close'
      ) as globalThis.HTMLButtonElement;
      closeButton?.click();

      expect(eventFired).toBe(true);
      expect(element.open).toBe(false);
    });

    it('should close modal when clicking backdrop', async () => {
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector(
        '.modal-backdrop'
      ) as HTMLElement;
      backdrop?.click();

      await element.updateComplete;
      expect(element.open).toBe(false);
    });
  });

  describe('Interactions', () => {
    it('should close modal when pressing Escape key', async () => {
      element.open = true;
      await element.updateComplete;

      const escapeEvent = new globalThis.KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      element.dispatchEvent(escapeEvent);

      await element.updateComplete;
      expect(element.open).toBe(false);
    });

    it('should trap focus with Tab key', async () => {
      element.open = true;
      await element.updateComplete;

      const tabEvent = new globalThis.KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      // Should not throw error
      expect(() => element.dispatchEvent(tabEvent)).not.toThrow();
    });

    it('should prevent body scroll when open', async () => {
      element.open = true;
      await element.updateComplete;

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when closed', async () => {
      element.open = true;
      await element.updateComplete;
      expect(document.body.style.overflow).toBe('hidden');

      element.open = false;
      await element.updateComplete;
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', async () => {
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('.modal-dialog');
      expect(dialog?.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', async () => {
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('.modal-dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-labelledby attribute', async () => {
      element.ariaLabelledby = 'my-modal-title';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('.modal-dialog');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('my-modal-title');
    });
  });

  describe('CSS Parts', () => {
    it('should expose "backdrop" part', async () => {
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]');
      expect(backdrop).toBeTruthy();
    });

    it('should expose "dialog" part', async () => {
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[part="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should expose "header" part', async () => {
      element.open = true;
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('[part="header"]');
      expect(header).toBeTruthy();
    });

    it('should expose "body" part', async () => {
      element.open = true;
      await element.updateComplete;

      const body = element.shadowRoot?.querySelector('[part="body"]');
      expect(body).toBeTruthy();
    });

    it('should expose "footer" part', async () => {
      element.open = true;
      await element.updateComplete;

      const footer = element.shadowRoot?.querySelector('[part="footer"]');
      expect(footer).toBeTruthy();
    });

    it('should expose "close-button" part', async () => {
      element.open = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector(
        '[part="close-button"]'
      );
      expect(closeButton).toBeTruthy();
    });
  });

  describe('Slots', () => {
    it('should render header slot content', async () => {
      const header = document.createElement('h2');
      header.slot = 'header';
      header.textContent = 'Modal Title';
      element.appendChild(header);

      element.open = true;
      await element.updateComplete;

      const headerSlot = element.shadowRoot?.querySelector(
        'slot[name="header"]'
      );
      expect(headerSlot).toBeTruthy();
    });

    it('should render footer slot content', async () => {
      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.textContent = 'Footer content';
      element.appendChild(footer);

      element.open = true;
      await element.updateComplete;

      const footerSlot = element.shadowRoot?.querySelector(
        'slot[name="footer"]'
      );
      expect(footerSlot).toBeTruthy();
    });

    it('should render default slot content', async () => {
      const content = document.createElement('p');
      content.textContent = 'Body content';
      element.appendChild(content);

      element.open = true;
      await element.updateComplete;

      const defaultSlot = element.shadowRoot?.querySelector(
        '.modal-body > slot:not([name])'
      );
      expect(defaultSlot).toBeTruthy();
    });
  });
});
