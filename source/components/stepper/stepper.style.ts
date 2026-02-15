import { css } from 'lit';

export const stepperStyles = css`
  /* ─────────────────────────────────────────────────────────────────────────────
   * Base Styles
   * ───────────────────────────────────────────────────────────────────────────── */

  :host {
    display: block;
    font-family: var(--bp-font-family);
  }

  :host([disabled]) {
    opacity: var(--bp-opacity-disabled);
    pointer-events: none;
  }

  .stepper {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-lg);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Step List
   * ───────────────────────────────────────────────────────────────────────────── */

  .step-list {
    display: flex;
    gap: var(--bp-spacing-xs);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Individual Step
   * ───────────────────────────────────────────────────────────────────────────── */

  .step {
    display: flex;
    align-items: flex-start;
    flex: 1;
    position: relative;
    outline: none;
  }

  .step--clickable {
    cursor: pointer;
  }

  .step--clickable:focus-visible .step-indicator {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  .step--disabled {
    cursor: not-allowed;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Step Indicator (Number Circle)
   * ───────────────────────────────────────────────────────────────────────────── */

  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--bp-spacing-xl);
    height: var(--bp-spacing-xl);
    border-radius: 50%;
    border: var(--bp-border-width) solid var(--bp-color-border);
    background-color: var(--bp-color-surface);
    color: var(--bp-color-text-muted);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    position: relative;
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  /* Expand touch target to 44×44px for WCAG 2.2 AA compliance */
  .step--clickable .step-indicator::after {
    content: '';
    position: absolute;
    inset: calc((var(--bp-spacing-11) - var(--bp-spacing-xl)) / -2);
  }

  .step-indicator--current {
    background-color: var(--bp-color-primary);
    border-color: var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .step-indicator--complete {
    background-color: var(--bp-color-success);
    border-color: var(--bp-color-success);
    color: var(--bp-color-text-inverse);
  }

  .step-indicator--error {
    background-color: var(--bp-color-error);
    border-color: var(--bp-color-error);
    color: var(--bp-color-text-inverse);
  }

  .step-number {
    line-height: 1;
  }

  .step-icon {
    width: var(--bp-spacing-md);
    height: var(--bp-spacing-md);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Step Content (Label & Description)
   * ───────────────────────────────────────────────────────────────────────────── */

  .step-content {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing-2xs);
    padding-left: var(--bp-spacing-sm);
    padding-right: var(--bp-spacing-md);
  }

  .step-label {
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    color: var(--bp-color-text);
    line-height: var(--bp-line-height-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .step--current .step-label {
    color: var(--bp-color-primary);
  }

  .step--complete .step-label {
    color: var(--bp-color-text);
  }

  .step--error .step-label {
    color: var(--bp-color-error);
  }

  .step--disabled .step-label {
    color: var(--bp-color-text-muted);
  }

  .step--pending .step-label {
    color: var(--bp-color-text-muted);
  }

  .step-description {
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-text-muted);
    line-height: var(--bp-line-height-normal);
  }

  .step-error {
    font-size: var(--bp-font-size-xs);
    color: var(--bp-color-error);
    line-height: var(--bp-line-height-normal);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Connector Lines
   * ───────────────────────────────────────────────────────────────────────────── */

  .connector {
    flex: 1;
    height: calc(var(--bp-border-width) * 2);
    background-color: var(--bp-color-border);
    margin-top: calc(var(--bp-spacing-xl) / 2);
    margin-left: var(--bp-spacing-sm);
    margin-right: var(--bp-spacing-sm);
    transition: background-color var(--bp-transition-fast);
  }

  .step--complete .connector {
    background-color: var(--bp-color-success);
  }

  .step--error .connector {
    background-color: var(--bp-color-error);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Horizontal Orientation (Default)
   * ───────────────────────────────────────────────────────────────────────────── */

  .stepper--horizontal .step-list {
    flex-direction: row;
  }

  .stepper--horizontal .step {
    flex-direction: row;
    align-items: flex-start;
  }

  .stepper--horizontal .step-content {
    max-width: var(--bp-spacing-24);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Vertical Orientation
   * ───────────────────────────────────────────────────────────────────────────── */

  .stepper--vertical .step-list {
    flex-direction: column;
    gap: 0;
  }

  .stepper--vertical .step {
    flex-direction: row;
    padding-bottom: var(--bp-spacing-lg);
  }

  .stepper--vertical .step:last-child {
    padding-bottom: 0;
  }

  .stepper--vertical .step-content {
    flex: 1;
    padding-right: 0;
  }

  .stepper--vertical .connector {
    position: absolute;
    left: calc(var(--bp-spacing-xl) / 2);
    top: calc(var(--bp-spacing-xl) + var(--bp-spacing-xs));
    bottom: 0;
    width: calc(var(--bp-border-width) * 2);
    height: auto;
    margin: 0;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Size Variants
   * ───────────────────────────────────────────────────────────────────────────── */

  /* Small */
  .stepper--sm .step-indicator {
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
    font-size: var(--bp-font-size-xs);
  }

  .stepper--sm .step--clickable .step-indicator::after {
    inset: calc((var(--bp-spacing-11) - var(--bp-spacing-lg)) / -2);
  }

  .stepper--sm .step-icon {
    width: var(--bp-spacing-sm);
    height: var(--bp-spacing-sm);
  }

  .stepper--sm .step-label {
    font-size: var(--bp-font-size-xs);
  }

  .stepper--sm .step-description {
    font-size: var(--bp-font-size-xs);
  }

  .stepper--sm .connector {
    margin-top: calc(var(--bp-spacing-lg) / 2);
  }

  .stepper--sm.stepper--vertical .connector {
    left: calc(var(--bp-spacing-lg) / 2);
    top: calc(var(--bp-spacing-lg) + var(--bp-spacing-xs));
  }

  /* Large */
  .stepper--lg .step-indicator {
    width: var(--bp-spacing-2xl);
    height: var(--bp-spacing-2xl);
    font-size: var(--bp-font-size-base);
  }

  .stepper--lg .step--clickable .step-indicator::after {
    inset: calc((var(--bp-spacing-11) - var(--bp-spacing-2xl)) / -2);
  }

  .stepper--lg .step-icon {
    width: var(--bp-spacing-lg);
    height: var(--bp-spacing-lg);
  }

  .stepper--lg .step-label {
    font-size: var(--bp-font-size-base);
  }

  .stepper--lg .step-description {
    font-size: var(--bp-font-size-sm);
  }

  .stepper--lg .connector {
    margin-top: calc(var(--bp-spacing-2xl) / 2);
  }

  .stepper--lg.stepper--vertical .connector {
    left: calc(var(--bp-spacing-2xl) / 2);
    top: calc(var(--bp-spacing-2xl) + var(--bp-spacing-xs));
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Panel
   * ───────────────────────────────────────────────────────────────────────────── */

  .panel {
    padding: var(--bp-spacing-md);
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    border-radius: var(--bp-border-radius-md);
  }

  .panel:not(.panel--has-content) {
    display: none;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Actions
   * ───────────────────────────────────────────────────────────────────────────── */

  .actions {
    display: flex;
    gap: var(--bp-spacing-sm);
    justify-content: flex-end;
  }

  .actions:empty {
    display: none;
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Navigation Buttons
   * ───────────────────────────────────────────────────────────────────────────── */

  .nav-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--bp-spacing-sm) var(--bp-spacing-md);
    font-family: var(--bp-font-family);
    font-size: var(--bp-font-size-sm);
    font-weight: var(--bp-font-weight-medium);
    line-height: var(--bp-line-height-tight);
    border-radius: var(--bp-border-radius-md);
    cursor: pointer;
    transition:
      background-color var(--bp-transition-fast),
      border-color var(--bp-transition-fast),
      color var(--bp-transition-fast);
  }

  .nav-button--previous {
    background-color: var(--bp-color-surface);
    border: var(--bp-border-width) solid var(--bp-color-border);
    color: var(--bp-color-text);
  }

  .nav-button--previous:hover:not(:disabled) {
    background-color: var(--bp-color-surface-hover);
    border-color: var(--bp-color-border-strong);
  }

  .nav-button--next {
    background-color: var(--bp-color-primary);
    border: var(--bp-border-width) solid var(--bp-color-primary);
    color: var(--bp-color-text-inverse);
  }

  .nav-button--next:hover:not(:disabled) {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  .nav-button:disabled {
    opacity: var(--bp-opacity-disabled);
    cursor: not-allowed;
  }

  .nav-button:focus-visible {
    outline: var(--bp-focus-width) var(--bp-focus-style) var(--bp-color-focus);
    outline-offset: var(--bp-focus-offset);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Hover States
   * ───────────────────────────────────────────────────────────────────────────── */

  .step--clickable:hover .step-indicator--pending {
    border-color: var(--bp-color-border-strong);
  }

  .step--clickable:hover .step-indicator--complete {
    background-color: var(--bp-color-success-hover);
    border-color: var(--bp-color-success-hover);
  }

  .step--clickable:hover .step-indicator--current {
    background-color: var(--bp-color-primary-hover);
    border-color: var(--bp-color-primary-hover);
  }

  /* ─────────────────────────────────────────────────────────────────────────────
   * Reduced Motion
   * ───────────────────────────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .step-indicator,
    .connector {
      transition: none;
    }
  }
`;
