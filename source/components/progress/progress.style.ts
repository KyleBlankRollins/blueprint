import { css } from 'lit';

export const progressStyles = css`
  /* Base styles */
  :host {
    display: block;
  }

  .progress-container {
    width: 100%;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--bp-spacing-sm);
    font-family: var(--bp-font-sans);
    font-size: var(--bp-font-size-sm);
    color: var(--bp-color-text);
  }

  .progress-label {
    font-weight: var(--bp-font-weight-medium);
  }

  .progress-value {
    color: var(--bp-color-text);
    opacity: 0.85;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
  }

  .progress {
    position: relative;
    width: 100%;
    background-color: var(--bp-color-border);
    opacity: 0.3;
    border-radius: var(--bp-border-radius-full);
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: var(--bp-border-radius-full);
    transition:
      width var(--bp-transition-base),
      background-color var(--bp-transition-base);
    opacity: 1;
  }

  /* Sizes */
  .progress--sm {
    height: var(--bp-spacing-2);
  }

  .progress--md {
    height: var(--bp-spacing-3);
  }

  .progress--lg {
    height: var(--bp-spacing-4);
  }

  /* Variants */
  .progress--primary .progress-bar {
    background-color: var(--bp-color-primary);
  }

  .progress--success .progress-bar {
    background-color: var(--bp-color-success);
  }

  .progress--warning .progress-bar {
    background-color: var(--bp-color-warning);
  }

  .progress--error .progress-bar {
    background-color: var(--bp-color-error);
  }

  .progress--info .progress-bar {
    background-color: var(--bp-color-info);
  }

  /* Indeterminate state */
  .progress--indeterminate .progress-bar {
    width: 40%;
    animation: indeterminate 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    transform-origin: 0 0;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-100%) scaleX(1);
    }
    40% {
      transform: translateX(-10%) scaleX(1.5);
    }
    100% {
      transform: translateX(250%) scaleX(0.5);
    }
  }

  /* States */
  .progress:focus-visible {
    outline: var(--bp-focus-ring);
    outline-offset: var(--bp-focus-offset);
  }

  .progress--complete .progress-bar {
    animation: complete-pulse 600ms ease-out;
  }

  @keyframes complete-pulse {
    0%,
    100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.15);
    }
  }

  .progress--complete.progress--primary .progress-bar {
    background-color: var(--bp-color-success);
  }
`;
