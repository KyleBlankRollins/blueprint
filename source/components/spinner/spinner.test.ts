import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './spinner.js';
import type { BpSpinner } from './spinner.js';

describe('bp-spinner', () => {
  let element: BpSpinner;

  beforeEach(() => {
    element = document.createElement('bp-spinner');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-spinner');
    expect(constructor).toBeDefined();
    expect(constructor?.name).toBe('BpSpinner');
  });

  // Rendering
  it('should render spinner element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  it('should render spinner circle element', async () => {
    await element.updateComplete;
    const circle = element.shadowRoot?.querySelector('.spinner__circle');
    expect(circle).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.size).toBe('md');
    expect(element.variant).toBe('primary');
    expect(element.label).toBe('Loading...');
  });

  // Properties
  it('should set property: size', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.size).toBe('sm');
    const spinner = element.shadowRoot?.querySelector('.spinner--sm');
    expect(spinner).toBeTruthy();
  });

  it('should set property: variant', async () => {
    element.variant = 'error';
    await element.updateComplete;
    expect(element.variant).toBe('error');
    const spinner = element.shadowRoot?.querySelector('.spinner--error');
    expect(spinner).toBeTruthy();
  });

  it('should set property: label', async () => {
    element.label = 'Processing...';
    await element.updateComplete;
    expect(element.label).toBe('Processing...');
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-label')).toBe('Processing...');
  });

  // Sizes
  it('should apply sm size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--sm');
    expect(spinner).toBeTruthy();
  });

  it('should apply md size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--md');
    expect(spinner).toBeTruthy();
  });

  it('should apply lg size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--lg');
    expect(spinner).toBeTruthy();
  });

  // Variants
  it('should apply primary variant styles', async () => {
    element.variant = 'primary';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--primary');
    expect(spinner).toBeTruthy();
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--success');
    expect(spinner).toBeTruthy();
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--error');
    expect(spinner).toBeTruthy();
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--warning');
    expect(spinner).toBeTruthy();
  });

  it('should apply inverse variant styles', async () => {
    element.variant = 'inverse';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--inverse');
    expect(spinner).toBeTruthy();
  });

  it('should apply neutral variant styles', async () => {
    element.variant = 'neutral';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--neutral');
    expect(spinner).toBeTruthy();
  });

  // CSS Parts
  it('should expose spinner part for styling', async () => {
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('[part="spinner"]');
    expect(spinner).toBeTruthy();
  });

  it('should expose circle part for styling', async () => {
    await element.updateComplete;
    const circle = element.shadowRoot?.querySelector('[part="circle"]');
    expect(circle).toBeTruthy();
  });

  // Accessibility
  it('should have role="status" for screen readers', async () => {
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('role')).toBe('status');
  });

  it('should have aria-label attribute', async () => {
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-label')).toBe('Loading...');
  });

  it('should update aria-label when label property changes', async () => {
    element.label = 'Saving...';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-label')).toBe('Saving...');
  });

  // Edge cases
  it('should handle rapid size changes', async () => {
    element.size = 'sm';
    await element.updateComplete;
    element.size = 'lg';
    await element.updateComplete;
    element.size = 'md';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner--md');
    expect(spinner).toBeTruthy();
  });

  it('should handle empty label gracefully', async () => {
    element.label = '';
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-label')).toBe('');
  });

  it('should handle very long labels', async () => {
    const longLabel = 'A'.repeat(100);
    element.label = longLabel;
    await element.updateComplete;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    expect(spinner?.getAttribute('aria-label')).toBe(longLabel);
  });
});
