import { css } from 'lit';

export const breadcrumbStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  /* Separator variants - set custom properties on host to cross shadow boundaries */
  :host([separator='slash']) {
    --bp-breadcrumb-separator-content: '/';
  }

  :host([separator='chevron']) {
    --bp-breadcrumb-separator-content: '›';
    --bp-breadcrumb-separator-size: 1.2em;
  }

  :host([separator='arrow']) {
    --bp-breadcrumb-separator-content: '→';
  }

  :host([separator='dot']) {
    --bp-breadcrumb-separator-content: '•';
    --bp-breadcrumb-separator-size: var(--bp-font-size-lg);
  }

  /* Size variants - set custom properties on host to cross shadow boundaries */
  :host([size='sm']) {
    --bp-breadcrumb-font-size: var(--bp-font-size-sm);
    --bp-breadcrumb-line-height: var(--bp-line-height-tight);
  }

  :host([size='md']) {
    --bp-breadcrumb-font-size: var(--bp-font-size-base);
    --bp-breadcrumb-line-height: var(--bp-line-height-normal);
  }

  :host([size='lg']) {
    --bp-breadcrumb-font-size: var(--bp-font-size-lg);
    --bp-breadcrumb-line-height: var(--bp-line-height-normal);
  }

  .breadcrumb {
    font-family: var(--bp-font-family);
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0;
  }

  .item {
    display: inline-flex;
    align-items: center;
    gap: 0;
    font-size: var(--bp-breadcrumb-font-size, var(--bp-font-size-base));
    line-height: var(--bp-breadcrumb-line-height, var(--bp-line-height-normal));
  }

  .item__icon {
    flex-shrink: 0;
  }

  .item__label {
    white-space: nowrap;
  }

  /* Link styles */
  .link {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    color: var(--bp-color-text-muted);
    text-decoration: none;
    transition: color var(--bp-transition-fast);
    outline: none;
    border-radius: var(--bp-border-radius);
  }

  .link:hover {
    color: var(--bp-color-primary);
    text-decoration: underline;
  }

  .link:active {
    transform: translateY(1px);
  }

  .link:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Text (non-link) styles */
  .text {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing-xs);
    color: var(--bp-color-text);
    font-weight: var(--bp-font-weight-medium);
  }

  /* Current item */
  .item--current .text {
    color: var(--bp-color-text);
  }

  /* Separator styles */
  .separator {
    display: inline-flex;
    align-items: center;
    color: var(--bp-color-text-muted);
    margin: 0 var(--bp-spacing-2xs);
    user-select: none;
  }

  /* Hide separator on last item */
  :host(:last-of-type) .separator {
    display: none;
  }

  /* Separator content via ::before - uses custom properties from parent */
  .separator::before {
    content: var(--bp-breadcrumb-separator-content, '/');
    font-size: var(--bp-breadcrumb-separator-size, inherit);
  }

  .separator__icon {
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .separator__icon--dot {
    font-size: var(--bp-font-size-lg);
    line-height: 1;
  }

  /* Ellipsis button */
  .ellipsis-button {
    appearance: none;
    border: none;
    background: transparent;
    padding: var(--bp-spacing-xs);
    margin: calc(-1 * var(--bp-spacing-xs));
    cursor: pointer;
    color: var(--bp-color-text-muted);
    border-radius: var(--bp-border-radius);
    transition: all var(--bp-transition-fast);
    outline: none;
  }

  .ellipsis-button:hover {
    color: var(--bp-color-primary);
    background: var(--bp-color-surface);
  }

  .ellipsis-button:active {
    transform: scale(0.95);
  }

  .ellipsis-button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .ellipsis-dots {
    font-size: var(--bp-font-size-base);
    letter-spacing: var(--bp-spacing-0-5);
  }

  /* Sizes */
  .breadcrumb--sm {
    font-size: var(--bp-font-size-sm);
    line-height: var(--bp-line-height-tight);
  }

  .breadcrumb--sm .separator__icon {
    width: var(--bp-spacing-sm);
    height: var(--bp-spacing-sm);
  }

  .breadcrumb--md {
    font-size: var(--bp-font-size-base);
    line-height: var(--bp-line-height-normal);
  }

  .breadcrumb--md .separator__icon {
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  .breadcrumb--lg {
    font-size: var(--bp-font-size-lg);
    line-height: var(--bp-line-height-normal);
  }

  .breadcrumb--lg .separator__icon {
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
  }

  /* Separator variants */
  .breadcrumb--slash .separator__icon {
    font-size: inherit;
  }

  .breadcrumb--dot .separator__icon {
    font-size: inherit;
  }

  /* Item ellipsis */
  .item--ellipsis {
    display: inline-flex;
  }

  /* Collapse on mobile - handled via maxItems property instead of CSS */
  .breadcrumb--collapse-mobile {
    /* Reserved for future container query support */
  }
`;
