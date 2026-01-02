import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './avatar.js';
import type { BpAvatar } from './avatar.js';

describe('bp-avatar', () => {
  let element: BpAvatar;

  beforeEach(() => {
    element = document.createElement('bp-avatar');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-avatar');
    expect(constructor).toBeDefined();
    expect(constructor?.name).toBe('BpAvatar');
  });

  // Rendering
  it('should render avatar element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const avatar = element.shadowRoot?.querySelector('.avatar');
    expect(avatar).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.src).toBe('');
    expect(element.alt).toBe('');
    expect(element.initials).toBe('');
    expect(element.size).toBe('md');
    expect(element.shape).toBe('circle');
    expect(element.clickable).toBe(false);
    expect(element.name).toBe('');
    expect(element.status).toBeUndefined();
  });

  // Properties
  it('should set property: src', async () => {
    element.src = 'https://example.com/avatar.jpg';
    await element.updateComplete;
    expect(element.src).toBe('https://example.com/avatar.jpg');
    const img = element.shadowRoot?.querySelector('.avatar__image');
    expect(img).toBeTruthy();
  });

  it('should set property: alt', async () => {
    element.src = 'https://example.com/avatar.jpg';
    element.alt = 'User profile picture';
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    expect(img?.getAttribute('alt')).toBe('User profile picture');
  });

  it('should set property: initials', async () => {
    element.initials = 'AB';
    await element.updateComplete;
    expect(element.initials).toBe('AB');
    const initials = element.shadowRoot?.querySelector('.avatar__initials');
    expect(initials?.textContent).toBe('AB');
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const avatar = element.shadowRoot?.querySelector('.avatar--lg');
    expect(avatar).toBeTruthy();
  });

  it('should set property: shape', async () => {
    element.shape = 'square';
    await element.updateComplete;
    expect(element.shape).toBe('square');
    const avatar = element.shadowRoot?.querySelector('.avatar--square');
    expect(avatar).toBeTruthy();
  });

  it('should set property: status', async () => {
    element.status = 'online';
    await element.updateComplete;
    expect(element.status).toBe('online');
    const status = element.shadowRoot?.querySelector('.avatar__status--online');
    expect(status).toBeTruthy();
  });

  it('should set property: clickable', async () => {
    element.clickable = true;
    await element.updateComplete;
    expect(element.clickable).toBe(true);
    expect(element.hasAttribute('clickable')).toBe(true);
  });

  it('should set property: name', async () => {
    element.name = 'John Doe';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar');
    expect(avatar?.getAttribute('title')).toBe('John Doe');
  });

  // Sizes
  it('should apply xs size styles', async () => {
    element.size = 'xs';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--xs');
    expect(avatar).toBeTruthy();
  });

  it('should apply sm size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--sm');
    expect(avatar).toBeTruthy();
  });

  it('should apply md size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--md');
    expect(avatar).toBeTruthy();
  });

  it('should apply lg size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--lg');
    expect(avatar).toBeTruthy();
  });

  it('should apply xl size styles', async () => {
    element.size = 'xl';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--xl');
    expect(avatar).toBeTruthy();
  });

  // Variants
  it('should apply circle shape variant', async () => {
    element.shape = 'circle';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--circle');
    expect(avatar).toBeTruthy();
  });

  it('should apply square shape variant', async () => {
    element.shape = 'square';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--square');
    expect(avatar).toBeTruthy();
  });

  // Status
  it('should apply online status', async () => {
    element.status = 'online';
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector('.avatar__status--online');
    expect(status).toBeTruthy();
  });

  it('should apply offline status', async () => {
    element.status = 'offline';
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector(
      '.avatar__status--offline'
    );
    expect(status).toBeTruthy();
  });

  it('should apply busy status', async () => {
    element.status = 'busy';
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector('.avatar__status--busy');
    expect(status).toBeTruthy();
  });

  it('should apply away status', async () => {
    element.status = 'away';
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector('.avatar__status--away');
    expect(status).toBeTruthy();
  });

  // CSS Parts
  it('should expose avatar part for styling', async () => {
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('[part="avatar"]');
    expect(avatar).toBeTruthy();
  });

  it('should expose image part when src is provided', async () => {
    element.src = 'https://example.com/avatar.jpg';
    await element.updateComplete;
    const image = element.shadowRoot?.querySelector('[part="image"]');
    expect(image).toBeTruthy();
  });

  it('should expose initials part when initials are provided', async () => {
    element.initials = 'JD';
    await element.updateComplete;
    const initials = element.shadowRoot?.querySelector('[part="initials"]');
    expect(initials).toBeTruthy();
  });

  it('should expose fallback part when no src or initials', async () => {
    await element.updateComplete;
    const fallback = element.shadowRoot?.querySelector('[part="fallback"]');
    expect(fallback).toBeTruthy();
    expect(fallback?.tagName.toLowerCase()).toBe('bp-icon');
  });

  it('should expose status part when status is set', async () => {
    element.status = 'online';
    await element.updateComplete;
    const status = element.shadowRoot?.querySelector('[part="status"]');
    expect(status).toBeTruthy();
  });

  // Accessibility
  it('should have aria-label on fallback element', async () => {
    await element.updateComplete;
    const fallback = element.shadowRoot?.querySelector('.avatar__fallback');
    expect(fallback?.getAttribute('aria-label')).toBe('User avatar');
    expect(fallback?.tagName.toLowerCase()).toBe('bp-icon');
  });

  it('should use alt text for image accessibility', async () => {
    element.src = 'https://example.com/avatar.jpg';
    element.alt = 'John Doe';
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    expect(img?.getAttribute('alt')).toBe('John Doe');
  });

  // Interactions
  it('should display image when src is provided', async () => {
    element.src = 'https://example.com/avatar.jpg';
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    const initials = element.shadowRoot?.querySelector('.avatar__initials');
    const fallback = element.shadowRoot?.querySelector('.avatar__fallback');
    expect(img).toBeTruthy();
    expect(initials).toBeFalsy();
    expect(fallback).toBeFalsy();
  });

  it('should display initials when no src is provided', async () => {
    element.initials = 'AB';
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    const initials = element.shadowRoot?.querySelector('.avatar__initials');
    const fallback = element.shadowRoot?.querySelector('.avatar__fallback');
    expect(img).toBeFalsy();
    expect(initials).toBeTruthy();
    expect(fallback).toBeFalsy();
  });

  it('should display fallback when no src or initials', async () => {
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    const initials = element.shadowRoot?.querySelector('.avatar__initials');
    const fallback = element.shadowRoot?.querySelector('.avatar__fallback');
    expect(img).toBeFalsy();
    expect(initials).toBeFalsy();
    expect(fallback).toBeTruthy();
    expect(fallback?.tagName.toLowerCase()).toBe('bp-icon');
  });

  it('should prioritize image over initials', async () => {
    element.src = 'https://example.com/avatar.jpg';
    element.initials = 'AB';
    await element.updateComplete;
    const img = element.shadowRoot?.querySelector('.avatar__image');
    const initials = element.shadowRoot?.querySelector('.avatar__initials');
    expect(img).toBeTruthy();
    expect(initials).toBeFalsy();
  });

  // Edge cases
  it('should handle rapid size changes', async () => {
    element.size = 'sm';
    await element.updateComplete;
    element.size = 'lg';
    await element.updateComplete;
    element.size = 'md';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--md');
    expect(avatar).toBeTruthy();
  });

  it('should handle rapid shape changes', async () => {
    element.shape = 'circle';
    await element.updateComplete;
    element.shape = 'square';
    await element.updateComplete;
    element.shape = 'circle';
    await element.updateComplete;
    const avatar = element.shadowRoot?.querySelector('.avatar--circle');
    expect(avatar).toBeTruthy();
  });
});
