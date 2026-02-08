import { css } from 'lit';

export const skeletonStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .skeleton {
    background-color: var(--bp-color-surface-subdued);
    overflow: hidden;
    position: relative;
    width: var(--skeleton-width, auto);
    height: var(--skeleton-height, auto);
  }

  /* Animation */
  .skeleton--animated::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    animation: skeleton-shimmer 1.5s infinite linear;
    transform: translateX(-100%);
  }

  @keyframes skeleton-shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /* Respect user motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .skeleton--animated::after {
      animation: none;
      opacity: 0.7;
    }
  }

  /* Variants */
  .skeleton--text {
    border-radius: var(--bp-border-radius-sm);
    width: 100%;
  }

  .skeleton--circular {
    border-radius: var(--bp-border-radius-full);
  }

  .skeleton--rectangular {
    border-radius: 2px;
  }

  .skeleton--rounded {
    border-radius: var(--bp-border-radius-lg);
  }

  /* Sizes for text variant */
  .skeleton--text.skeleton--sm {
    height: var(--bp-spacing-3);
  }

  .skeleton--text.skeleton--md {
    height: var(--bp-spacing-4);
  }

  .skeleton--text.skeleton--lg {
    height: var(--bp-spacing-6);
  }

  /* Sizes for circular variant */
  .skeleton--circular.skeleton--sm {
    width: var(--bp-spacing-8);
    height: var(--bp-spacing-8);
  }

  .skeleton--circular.skeleton--md {
    width: var(--bp-spacing-10);
    height: var(--bp-spacing-10);
  }

  .skeleton--circular.skeleton--lg {
    width: var(--bp-spacing-12);
    height: var(--bp-spacing-12);
  }

  /* Sizes for rectangular/rounded variants */
  .skeleton--rectangular.skeleton--sm,
  .skeleton--rounded.skeleton--sm {
    height: var(--bp-spacing-10);
  }

  .skeleton--rectangular.skeleton--md,
  .skeleton--rounded.skeleton--md {
    height: var(--bp-spacing-16);
  }

  .skeleton--rectangular.skeleton--lg,
  .skeleton--rounded.skeleton--lg {
    height: var(--bp-spacing-24);
  }

  /* Text lines container */
  .skeleton__lines {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-3);
  }

  /* Last line in multi-line text is shorter */
  .skeleton--last-line {
    width: 75%;
  }

  /* Static state (no animation) */
  :host([animated='false']) .skeleton::after,
  .skeleton:not(.skeleton--animated)::after {
    display: none;
  }

  :host([animated='false']) .skeleton,
  .skeleton:not(.skeleton--animated) {
    opacity: 0.6;
  }
`;
