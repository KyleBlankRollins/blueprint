import { css } from 'lit';

export const avatarStyles = css`
  /* Base styles */
  :host {
    display: inline-flex;
    position: relative;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
    font-family: var(--bp-font-sans);
    font-weight: var(--bp-font-weight-semibold);
    user-select: none;
    flex-shrink: 0;
    box-shadow: var(--bp-shadow-sm);
    position: relative;
  }

  /* Image avatars have different background */
  .avatar:has(.avatar__image) {
    background: var(--bp-color-surface);
    color: var(--bp-color-text);
  }

  .avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .avatar__initials {
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .avatar__fallback {
    opacity: 0.8;
  }

  /* Shapes */
  .avatar--circle {
    border-radius: var(--bp-border-radius-full);
  }

  .avatar--square {
    border-radius: var(--bp-border-radius-sm);
  }

  /* Sizes */
  .avatar--xs {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
  }

  .avatar--xs .avatar__initials {
    font-size: var(--bp-font-size-xs);
  }

  .avatar--sm {
    width: var(--bp-spacing-8);
    height: var(--bp-spacing-8);
  }

  .avatar--sm .avatar__initials {
    font-size: var(--bp-font-size-sm);
  }

  .avatar--md {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
  }

  .avatar--md .avatar__initials {
    font-size: var(--bp-font-size-base);
  }

  .avatar--lg {
    width: var(--bp-spacing-12);
    height: var(--bp-spacing-12);
  }

  .avatar--lg .avatar__initials {
    font-size: var(--bp-font-size-lg);
  }

  .avatar--xl {
    width: var(--bp-spacing-16);
    height: var(--bp-spacing-16);
  }

  .avatar--xl .avatar__initials {
    font-size: var(--bp-font-size-2xl);
  }

  /* States - Interactive */
  :host([clickable]) .avatar {
    cursor: pointer;
    transition:
      transform var(--bp-duration-fast),
      box-shadow var(--bp-duration-fast);
  }

  :host([clickable]) .avatar:hover {
    transform: translateY(calc(-1 * var(--bp-spacing-0-5)));
    box-shadow: var(--bp-shadow-md);
  }

  :host([clickable]:focus-within) .avatar {
    outline: var(--bp-focus-width) solid var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* Status indicator */
  .avatar__status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 25%;
    height: 25%;
    min-width: var(--bp-spacing-2);
    min-height: var(--bp-spacing-2);
    border-radius: var(--bp-border-radius-full);
    border: var(--bp-focus-width) solid var(--bp-color-surface-elevated);
  }

  .avatar__status--online {
    background: var(--bp-color-success);
  }

  .avatar__status--offline {
    background: var(--bp-color-border-strong);
  }

  .avatar__status--busy {
    background: var(--bp-color-error);
  }

  .avatar__status--away {
    background: var(--bp-color-warning);
  }
`;
