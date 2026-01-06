import { css } from 'lit';

export const spinnerStyles = css`
  /* Base styles */
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner__circle {
    border-radius: var(--bp-border-radius-full);
    border-style: solid;
    border-color: transparent;
    animation: bp-spinner-rotate var(--bp-ease-linear) infinite;
    will-change: transform;
  }

  /* Variants */
  .spinner--primary .spinner__circle {
    border-top-color: var(--bp-color-primary);
    border-right-color: var(--bp-color-primary);
  }

  .spinner--success .spinner__circle {
    border-top-color: var(--bp-color-success);
    border-right-color: var(--bp-color-success);
  }

  .spinner--error .spinner__circle {
    border-top-color: var(--bp-color-error);
    border-right-color: var(--bp-color-error);
  }

  .spinner--warning .spinner__circle {
    border-top-color: var(--bp-color-warning);
    border-right-color: var(--bp-color-warning);
  }

  .spinner--inverse .spinner__circle {
    border-top-color: var(--bp-color-text-inverse);
    border-right-color: var(--bp-color-text-inverse);
  }

  .spinner--neutral .spinner__circle {
    border-top-color: var(--bp-color-text-muted);
    border-right-color: var(--bp-color-text-muted);
  }

  /* Sizes */
  .spinner--sm .spinner__circle {
    width: var(--bp-spacing-4);
    height: var(--bp-spacing-4);
    border-width: var(--bp-spacing-xs);
    animation-duration: var(--bp-duration-normal);
  }

  .spinner--md .spinner__circle {
    width: var(--bp-spacing-6);
    height: var(--bp-spacing-6);
    border-width: var(--bp-spacing-xs);
    animation-duration: var(--bp-duration-slow);
  }

  .spinner--lg .spinner__circle {
    width: var(--bp-spacing-8);
    height: var(--bp-spacing-8);
    border-width: var(--bp-spacing-xs);
    animation-duration: 600ms;
  }

  /* Animation */
  @keyframes bp-spinner-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .spinner__circle {
      animation-duration: 2s;
    }
  }
`;
