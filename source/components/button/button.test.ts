import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './button.js';
import type { BpButton } from './button.js';

describe('bp-button', () => {
  let element: BpButton;

  beforeEach(() => {
    element = document.createElement('bp-button');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should be registered as a custom element', () => {
    const constructor = customElements.get('bp-button');
    expect(constructor).toBeDefined();
  });

  it('should render with default properties', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
  });

  it('should have a shadow root', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).not.toBeNull();
  });

  // Add more tests here
});
