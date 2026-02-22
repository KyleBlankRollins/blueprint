import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './code-block.js';
import type { BpCodeBlock, CodeBlockHighlightAdapter } from './code-block.js';

describe('bp-code-block', () => {
  let element: BpCodeBlock;

  beforeEach(() => {
    element = document.createElement('bp-code-block');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-code-block');
    expect(constructor).toBeDefined();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.code).toBe('');
    expect(element.language).toBe('text');
    expect(element.title).toBe('');
    expect(element.showLineNumbers).toBe(false);
    expect(element.highlightLines).toEqual([]);
    expect(element.wrapLines).toBe(true);
    expect(element.showCopyButton).toBe(true);
    expect(element.maxLines).toBeUndefined();
    expect(element.showHeader).toBe(true);
  });

  // Attributes
  it('should reflect show-line-numbers attribute to DOM', async () => {
    element.showLineNumbers = true;
    await element.updateComplete;
    expect(element.hasAttribute('show-line-numbers')).toBe(true);
  });

  it('should reflect wrap-lines attribute to DOM', async () => {
    element.wrapLines = true;
    await element.updateComplete;
    expect(element.hasAttribute('wrap-lines')).toBe(true);
  });

  it('should reflect show-copy-button attribute to DOM', async () => {
    element.showCopyButton = true;
    await element.updateComplete;
    expect(element.hasAttribute('show-copy-button')).toBe(true);
  });

  it('should reflect show-header attribute to DOM', async () => {
    element.showHeader = true;
    await element.updateComplete;
    expect(element.hasAttribute('show-header')).toBe(true);
  });

  // Events
  it('should emit bp-copy event when copy button is clicked', async () => {
    element.code = 'test code';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    // Mock clipboard API
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    const copyHandler = vi.fn();
    element.addEventListener('bp-copy', copyHandler);

    const copyButton = element.shadowRoot?.querySelector('.code-block__copy');
    expect(copyButton).toBeTruthy();
    (copyButton as HTMLButtonElement)?.click();

    // Wait for async clipboard operation
    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    expect(copyHandler).toHaveBeenCalled();
    const event = copyHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.code).toBe('test code');
    expect(event.detail.success).toBe(true);

    // Restore
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it('should emit bp-copy event with success false when copy fails', async () => {
    element.code = 'test code';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    // Mock clipboard API to fail
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
      writable: true,
      configurable: true,
    });

    // Also mock execCommand to fail
    const originalExecCommand = document.execCommand;
    document.execCommand = vi.fn().mockReturnValue(false);

    const copyHandler = vi.fn();
    element.addEventListener('bp-copy', copyHandler);

    const copyButton = element.shadowRoot?.querySelector('.code-block__copy');
    (copyButton as HTMLButtonElement)?.click();

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    expect(copyHandler).toHaveBeenCalled();
    const event = copyHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.success).toBe(false);

    // Restore
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
  });

  // Slots
  it('should have named slots for title, controls, and copy-icon', async () => {
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    for (const name of ['title', 'controls', 'copy-icon']) {
      const slot = element.shadowRoot?.querySelector(`slot[name="${name}"]`);
      expect(slot, `slot[name="${name}"] should exist`).toBeTruthy();
    }
  });

  // CSS Parts
  it('should expose structural CSS parts (base, body, pre, code)', async () => {
    await element.updateComplete;

    for (const part of ['base', 'body', 'pre', 'code']) {
      const el = element.shadowRoot?.querySelector(`[part="${part}"]`);
      expect(el, `part="${part}" should exist`).toBeTruthy();
    }
  });

  it('should expose header CSS parts when header is visible', async () => {
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    for (const part of ['header', 'title', 'controls', 'copy-button']) {
      const el = element.shadowRoot?.querySelector(`[part="${part}"]`);
      expect(el, `part="${part}" should exist`).toBeTruthy();
    }
  });

  it('should expose line-number part when showLineNumbers is true', async () => {
    element.code = 'line 1\nline 2';
    element.showLineNumbers = true;
    await element.updateComplete;

    // Wait for highlighting to complete
    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const lineNumber = element.shadowRoot?.querySelector(
      '[part="line-number"]'
    );
    expect(lineNumber).toBeTruthy();
  });

  it('should expose line part when showLineNumbers is true', async () => {
    element.code = 'line 1\nline 2';
    element.showLineNumbers = true;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const line = element.shadowRoot?.querySelector('[part="line"]');
    expect(line).toBeTruthy();
  });

  // Header behavior
  it('should show language label in header when no title', async () => {
    element.language = 'typescript';
    element.showHeader = true;
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.code-block__title');
    expect(title?.textContent).toContain('typescript');
  });

  it('should show title in header when title is set', async () => {
    element.title = 'app.ts';
    element.showHeader = true;
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.code-block__title');
    expect(title?.textContent).toContain('app.ts');
  });

  it('should not render header when showHeader is false', async () => {
    element.showHeader = false;
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('.code-block__header');
    expect(header).toBeFalsy();
  });

  // Copy button visibility
  it('should not render copy button when showCopyButton is false', async () => {
    element.showCopyButton = false;
    await element.updateComplete;

    const copyButton = element.shadowRoot?.querySelector('.code-block__copy');
    expect(copyButton).toBeFalsy();
  });

  it('should render copy button in header by default', async () => {
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    const copyButton = element.shadowRoot?.querySelector('.code-block__copy');
    expect(copyButton).toBeTruthy();
  });

  it('should render floating copy button when header is hidden', async () => {
    element.showHeader = false;
    element.showCopyButton = true;
    await element.updateComplete;

    const floatingCopy = element.shadowRoot?.querySelector(
      '.code-block__floating-copy'
    );
    expect(floatingCopy).toBeTruthy();
  });

  // Line numbers
  it('should render line numbers when showLineNumbers is true', async () => {
    element.code = 'line 1\nline 2\nline 3';
    element.showLineNumbers = true;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const lineNumbers = element.shadowRoot?.querySelectorAll(
      '.code-block__line-number'
    );
    expect(lineNumbers?.length).toBe(3);
    expect(lineNumbers?.[0]?.textContent).toBe('1');
    expect(lineNumbers?.[1]?.textContent).toBe('2');
    expect(lineNumbers?.[2]?.textContent).toBe('3');
  });

  it('should not render line numbers by default', async () => {
    element.code = 'line 1\nline 2';
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const lineNumbers = element.shadowRoot?.querySelectorAll(
      '.code-block__line-number'
    );
    expect(lineNumbers?.length).toBe(0);
  });

  // Line highlighting
  it('should apply highlighted class to specified lines', async () => {
    element.code = 'line 1\nline 2\nline 3';
    element.highlightLines = [2];
    element.showLineNumbers = true;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const highlightedLines = element.shadowRoot?.querySelectorAll(
      '.code-block__line--highlighted'
    );
    expect(highlightedLines?.length).toBe(1);
  });

  // Wrap behavior
  it('should apply wrap class when wrapLines is true', async () => {
    element.wrapLines = true;
    await element.updateComplete;

    const body = element.shadowRoot?.querySelector('.code-block__body--wrap');
    expect(body).toBeTruthy();
  });

  it('should apply scroll class when wrapLines is false', async () => {
    element.wrapLines = false;
    await element.updateComplete;

    const body = element.shadowRoot?.querySelector('.code-block__body--scroll');
    expect(body).toBeTruthy();
  });

  // Expand / collapse interactions
  it('should show expand button when maxLines is set and code exceeds it', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 5;
    await element.updateComplete;

    const expandButton = element.shadowRoot?.querySelector(
      '.code-block__expand'
    );
    expect(expandButton).toBeTruthy();
    expect(expandButton?.textContent).toContain('Show more');
  });

  it('should toggle expand on click', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 5;
    await element.updateComplete;

    const expandButton = element.shadowRoot?.querySelector(
      '.code-block__expand'
    ) as HTMLButtonElement;
    expect(expandButton?.textContent).toContain('Show more');

    expandButton?.click();
    await element.updateComplete;

    expect(expandButton?.textContent).toContain('Show less');
  });

  it('should not show expand button when code fits within maxLines', async () => {
    element.code = 'line 1\nline 2';
    element.maxLines = 5;
    await element.updateComplete;

    const expandButton = element.shadowRoot?.querySelector(
      '.code-block__expand'
    );
    expect(expandButton).toBeFalsy();
  });

  it('should show gradient overlay when collapsed', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 5;
    await element.updateComplete;

    const gradient = element.shadowRoot?.querySelector('.code-block__gradient');
    expect(gradient).toBeTruthy();
  });

  // Adapter
  it('should use custom highlight adapter', async () => {
    const customAdapter: CodeBlockHighlightAdapter = {
      highlight({ code }) {
        return {
          html: `<span class="custom">${code}</span>`,
          isHighlighted: true,
        };
      },
    };

    element.highlightAdapter = customAdapter;
    element.code = 'test';
    await element.updateComplete;

    // Wait for async highlighting
    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const codeContent = element.shadowRoot?.querySelector('.code-block__code');
    expect(codeContent?.innerHTML).toContain('custom');
  });

  it('should call adapter initialize when provided', async () => {
    const initializeFn = vi.fn().mockResolvedValue('context-data');
    const highlightFn = vi.fn().mockReturnValue({
      html: 'highlighted',
      isHighlighted: true,
    });

    const customAdapter: CodeBlockHighlightAdapter = {
      initialize: initializeFn,
      highlight: highlightFn,
    };

    element.highlightAdapter = customAdapter;
    element.code = 'test';
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    expect(initializeFn).toHaveBeenCalled();
    expect(highlightFn).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'test',
        language: 'text',
        context: 'context-data',
      })
    );
  });

  // Escaping
  it('should escape HTML in code by default', async () => {
    element.code = '<script>alert("xss")</script>';
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const codeContent = element.shadowRoot?.querySelector('.code-block__code');
    expect(codeContent?.innerHTML).not.toContain('<script>');
    expect(codeContent?.innerHTML).toContain('&lt;script&gt;');
  });

  // Accessibility
  it('should have role region on the outer container', async () => {
    await element.updateComplete;
    const region = element.shadowRoot?.querySelector('[role="region"]');
    expect(region).toBeTruthy();
  });

  it('should have aria-label for accessibility', async () => {
    await element.updateComplete;
    const region = element.shadowRoot?.querySelector('[role="region"]');
    expect(region?.getAttribute('aria-label')).toBe('Code example');
  });

  it('should include title in aria-label when title is set', async () => {
    element.title = 'app.ts';
    await element.updateComplete;
    const region = element.shadowRoot?.querySelector('[role="region"]');
    expect(region?.getAttribute('aria-label')).toBe('Code example: app.ts');
  });

  it('should have aria-label on copy button', async () => {
    element.showCopyButton = true;
    element.showHeader = true;
    await element.updateComplete;

    const copyButton = element.shadowRoot?.querySelector('.code-block__copy');
    expect(copyButton?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('should have aria-hidden on line numbers', async () => {
    element.code = 'line 1\nline 2';
    element.showLineNumbers = true;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const lineNumber = element.shadowRoot?.querySelector(
      '.code-block__line-number'
    );
    expect(lineNumber?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have aria-current on highlighted lines', async () => {
    element.code = 'line 1\nline 2\nline 3';
    element.highlightLines = [2];
    element.showLineNumbers = true;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const lines = element.shadowRoot?.querySelectorAll('.code-block__line');
    expect(lines?.[0]?.getAttribute('aria-current')).toBeNull();
    expect(lines?.[1]?.getAttribute('aria-current')).toBe('true');
    expect(lines?.[2]?.getAttribute('aria-current')).toBeNull();
  });

  it('should have aria-live polite status element for screen reader announcements', async () => {
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector('[role="status"]');
    expect(status).toBeTruthy();
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('should have aria-expanded on expand button', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 5;
    await element.updateComplete;

    const expandButton = element.shadowRoot?.querySelector(
      '.code-block__expand'
    );
    expect(expandButton?.getAttribute('aria-expanded')).toBe('false');

    (expandButton as HTMLButtonElement)?.click();
    await element.updateComplete;

    expect(expandButton?.getAttribute('aria-expanded')).toBe('true');
  });

  // Attribute-to-property binding
  it('should set maxLines from max-lines attribute', async () => {
    element.setAttribute('max-lines', '15');
    await element.updateComplete;
    expect(element.maxLines).toBe(15);
  });

  // Clipboard fallback
  it('should use fallback copy when clipboard API is unavailable', async () => {
    element.code = 'fallback test';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const originalExecCommand = document.execCommand;
    document.execCommand = vi.fn().mockReturnValue(true);

    const copyHandler = vi.fn();
    element.addEventListener('bp-copy', copyHandler);

    const copyButton = element.shadowRoot?.querySelector(
      '.code-block__copy'
    ) as HTMLButtonElement;
    copyButton.click();

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    expect(copyHandler).toHaveBeenCalled();
    const event = copyHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.success).toBe(true);

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
  });

  // Timer reset
  it('should reset copy state after 2 seconds', async () => {
    vi.useFakeTimers();

    element.code = 'timer test';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    const copyButton = element.shadowRoot?.querySelector(
      '.code-block__copy'
    ) as HTMLButtonElement;
    copyButton.click();

    await vi.advanceTimersByTimeAsync(50);
    await element.updateComplete;

    expect(copyButton.getAttribute('aria-label')).toBe('Copied!');

    await vi.advanceTimersByTimeAsync(2000);
    await element.updateComplete;

    expect(copyButton.getAttribute('aria-label')).toBe('Copy code');

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    vi.useRealTimers();
  });

  // Disconnect cleanup
  it('should clean up copy timer on disconnect', async () => {
    element.code = 'cleanup test';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    const copyButton = element.shadowRoot?.querySelector(
      '.code-block__copy'
    ) as HTMLButtonElement;
    copyButton.click();

    await new Promise((resolve) => setTimeout(resolve, 50));
    // Remove element while timer is active — should not throw
    element.remove();

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  // Adapter error fallback
  it('should fall back to escaped plain text when adapter throws', async () => {
    const brokenAdapter: CodeBlockHighlightAdapter = {
      highlight() {
        throw new Error('adapter crashed');
      },
    };

    element.highlightAdapter = brokenAdapter;
    element.code = '<script>alert("xss")</script>';
    await element.updateComplete;

    const codeContent = element.shadowRoot?.querySelector('.code-block__code');
    expect(codeContent?.innerHTML).toContain('&lt;script&gt;');
    expect(codeContent?.innerHTML).not.toContain('<script>');
  });

  // Event composition
  it('should emit bp-copy event that is composed and bubbles', async () => {
    element.code = 'test';
    element.showHeader = true;
    element.showCopyButton = true;
    await element.updateComplete;

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    let capturedEvent: CustomEvent | null = null;
    // Listen on document to verify the event crosses shadow DOM boundary
    document.addEventListener('bp-copy', ((event: CustomEvent) => {
      capturedEvent = event;
    }) as EventListener);

    const copyButton = element.shadowRoot?.querySelector(
      '.code-block__copy'
    ) as HTMLButtonElement;
    copyButton.click();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.bubbles).toBe(true);
    expect(capturedEvent!.composed).toBe(true);

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  // Line highlighting without line numbers
  it('should highlight lines without line numbers using no-gutter grid', async () => {
    element.code = 'line 1\nline 2\nline 3';
    element.highlightLines = [2];
    element.showLineNumbers = false;
    await element.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 50));
    await element.updateComplete;

    const grid = element.shadowRoot?.querySelector(
      '.code-block__lines--no-gutter'
    );
    expect(grid).toBeTruthy();

    const highlighted = element.shadowRoot?.querySelectorAll(
      '.code-block__line--highlighted'
    );
    expect(highlighted?.length).toBe(1);

    const lineNumbers = element.shadowRoot?.querySelectorAll(
      '.code-block__line-number'
    );
    expect(lineNumbers?.length).toBe(0);
  });

  // Gradient lifecycle
  it('should remove gradient overlay when expanded', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 5;
    await element.updateComplete;

    expect(
      element.shadowRoot?.querySelector('.code-block__gradient')
    ).toBeTruthy();

    const expandButton = element.shadowRoot?.querySelector(
      '.code-block__expand'
    ) as HTMLButtonElement;
    expandButton.click();
    await element.updateComplete;

    expect(
      element.shadowRoot?.querySelector('.code-block__gradient')
    ).toBeFalsy();
  });

  // Collapsed CSS variable
  it('should set --_max-lines CSS variable when collapsed', async () => {
    const longCode = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join(
      '\n'
    );
    element.code = longCode;
    element.maxLines = 8;
    await element.updateComplete;

    const base = element.shadowRoot?.querySelector(
      '[part="base"]'
    ) as HTMLElement;
    expect(base.style.getPropertyValue('--_max-lines')).toBe('8');
  });
});
