import { LitElement, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { stepperStyles } from './stepper.style.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';

/**
 * Step status
 */
export type StepStatus = 'pending' | 'current' | 'complete' | 'error';

/**
 * Stepper orientation
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Stepper size
 */
export type StepperSize = 'sm' | 'md' | 'lg';

/**
 * Step configuration interface
 */
export interface Step {
  /** Unique identifier for the step */
  id: string;
  /** Display label for the step */
  label: string;
  /** Optional description text */
  description?: string;
  /** Whether the step is disabled */
  disabled?: boolean;
  /** Optional icon name (uses step number if not provided) */
  icon?: string;
  /** Optional error message when step has error status */
  error?: string;
}

/**
 * A stepper component for multi-step workflows and wizards.
 * Provides visual progress indication through a series of numbered or labeled steps.
 *
 * @element bp-stepper
 *
 * @property {Step[]} steps - Array of step configurations
 * @property {number} currentStep - Zero-based index of the current step
 * @property {StepperOrientation} orientation - Layout orientation
 * @property {StepperSize} size - Component size variant
 * @property {boolean} linear - Whether steps must be completed in order
 * @property {boolean} disabled - Whether the entire stepper is disabled
 * @property {boolean} hideLabels - Hide step labels (show only indicators)
 * @property {boolean} clickable - Whether completed steps are clickable to navigate
 *
 * @slot step-{id} - Custom content for a specific step panel
 * @slot actions - Navigation buttons (next/prev)
 *
 * @fires bp-step-change - Fired when the current step changes
 * @fires bp-step-complete - Fired when a step is marked complete
 * @fires bp-step-click - Fired when a step indicator is clicked
 *
 * @csspart stepper - The main stepper container
 * @csspart step-list - The step indicators container
 * @csspart step - Individual step container
 * @csspart step-indicator - The step number/icon circle
 * @csspart step-content - The step label and description area
 * @csspart step-label - The step label text
 * @csspart step-description - The step description text
 * @csspart connector - The line connecting steps
 * @csspart panel - The content panel for the current step
 * @csspart actions - The navigation actions container
 */
@customElement('bp-stepper')
export class BpStepper extends LitElement {
  /**
   * Array of step configurations
   */
  @property({ type: Array }) declare steps: Step[];

  /**
   * Zero-based index of the current step
   */
  @property({ type: Number, reflect: true, attribute: 'current-step' })
  declare currentStep: number;

  /**
   * Layout orientation
   */
  @property({ type: String, reflect: true })
  declare orientation: StepperOrientation;

  /**
   * Component size variant
   */
  @property({ type: String, reflect: true }) declare size: StepperSize;

  /**
   * Whether steps must be completed in order
   */
  @property({ converter: booleanConverter, reflect: true })
  declare linear: boolean;

  /**
   * Whether the entire stepper is disabled
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /**
   * Hide step labels (show only indicators)
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-labels' })
  declare hideLabels: boolean;

  /**
   * Whether completed steps are clickable to navigate back
   */
  @property({ converter: booleanConverter, reflect: true })
  declare clickable: boolean;

  /**
   * Show built-in navigation buttons (Previous/Next)
   */
  @property({
    converter: booleanConverter,
    reflect: true,
    attribute: 'show-navigation',
  })
  declare showNavigation: boolean;

  /**
   * Tracks which steps have been completed
   */
  @state() private completedSteps: Set<number> = new Set();

  /**
   * Tracks which steps have errors
   */
  @state() private errorSteps: Set<number> = new Set();

  /**
   * Tracks whether the panel slot has any assigned content
   */
  @state() private panelHasContent = false;

  static styles = [stepperStyles];

  constructor() {
    super();
    this.steps = [];
    this.currentStep = 0;
    this.orientation = 'horizontal';
    this.size = 'md';
    this.linear = true;
    this.disabled = false;
    this.hideLabels = false;
    this.clickable = true;
    this.showNavigation = true;
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    // Sync errorSteps from step config error properties
    if (changedProperties.has('steps')) {
      const errors = new Set<number>();
      this.steps.forEach((step, index) => {
        if (step.error) {
          errors.add(index);
        }
      });
      this.errorSteps = errors;
    }

    // Auto-mark previous steps as complete when advancing
    if (changedProperties.has('currentStep')) {
      const prevStep = changedProperties.get('currentStep') as
        | number
        | undefined;
      if (prevStep !== undefined && this.currentStep > prevStep) {
        // Mark all steps before current as complete
        const updated = new Set(this.completedSteps);
        for (let i = 0; i < this.currentStep; i++) {
          if (!this.errorSteps.has(i)) {
            updated.add(i);
          }
        }
        this.completedSteps = updated;
      }
    }
  }

  /**
   * Get the status of a step based on index
   * @param index Zero-based step index
   * @returns Step status (pending, current, complete, or error)
   */
  private _getStepStatus(index: number): StepStatus {
    if (this.errorSteps.has(index)) {
      return 'error';
    }
    // Check explicit completion first (allows marking current step complete)
    if (this.completedSteps.has(index)) {
      return 'complete';
    }
    if (index === this.currentStep) {
      return 'current';
    }
    if (index < this.currentStep) {
      return 'complete';
    }
    return 'pending';
  }

  /**
   * Check if a step is clickable based on linear mode and step state
   * @param index Zero-based step index
   * @param step Step configuration
   * @returns True if the step can be clicked to navigate
   */
  private _isStepClickable(index: number, step: Step): boolean {
    if (this.disabled || step.disabled) return false;
    if (!this.clickable) return false;

    const status = this._getStepStatus(index);

    if (this.linear) {
      // In linear mode, can only click completed steps or current step
      return status === 'complete' || index === this.currentStep;
    }

    // In non-linear mode, can click any non-disabled step
    return true;
  }

  /**
   * Handle click events on step indicators
   * Validates clickability and emits bp-step-click event before navigating
   * @param index Zero-based step index that was clicked
   * @param step Step configuration
   */
  private _handleStepClick(index: number, step: Step): void {
    if (!this._isStepClickable(index, step)) return;

    const detail = {
      step: index,
      stepId: step.id,
      previousStep: this.currentStep,
    };

    const clickEvent = new CustomEvent('bp-step-click', {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(clickEvent);

    if (index !== this.currentStep) {
      // When navigating backward, clear completion for steps at and after target
      if (index < this.currentStep) {
        for (let i = index; i < this.steps.length; i++) {
          this.completedSteps.delete(i);
        }
      }
      this.currentStep = index;
      this._emitStepChange(index, step);
    }
  }

  /**
   * Handle keyboard navigation on step indicators
   * Supports Enter/Space for activation and Arrow keys for focus movement
   * @param event Keyboard event
   * @param index Zero-based step index
   * @param step Step configuration
   */
  private _handleStepKeydown(
    event: KeyboardEvent,
    index: number,
    step: Step
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleStepClick(index, step);
    }

    // Arrow key navigation
    const isHorizontal = this.orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (event.key === prevKey && index > 0) {
      event.preventDefault();
      this._focusStep(index - 1);
    } else if (event.key === nextKey && index < this.steps.length - 1) {
      event.preventDefault();
      this._focusStep(index + 1);
    }
  }

  /**
   * Focus a specific step indicator element
   * @param index Zero-based step index to focus
   */
  private _focusStep(index: number): void {
    const stepEl = this.shadowRoot?.querySelector(
      `[data-step-index="${index}"]`
    ) as HTMLElement;
    stepEl?.focus();
  }

  /**
   * Emit bp-step-change event when navigating between steps
   * @param index Zero-based step index navigated to
   * @param step Step configuration
   */
  private _emitStepChange(index: number, step: Step): void {
    const event = new CustomEvent('bp-step-change', {
      detail: { step: index, stepId: step.id },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Navigate to the next step
   */
  public next(): boolean {
    if (this.currentStep >= this.steps.length - 1) return false;
    if (this.disabled) return false;

    const currentStepConfig = this.steps[this.currentStep];
    if (this.errorSteps.has(this.currentStep)) return false;

    // Mark current step as complete
    this.completedSteps.add(this.currentStep);
    this.currentStep++;

    this._emitStepChange(this.currentStep, this.steps[this.currentStep]);

    const completeEvent = new CustomEvent('bp-step-complete', {
      detail: { step: this.currentStep - 1, stepId: currentStepConfig.id },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(completeEvent);

    return true;
  }

  /**
   * Navigate to the previous step
   */
  public previous(): boolean {
    if (this.currentStep <= 0) return false;
    if (this.disabled) return false;

    // Remove completed status from steps at and after the new current position
    for (let i = this.currentStep - 1; i < this.steps.length; i++) {
      this.completedSteps.delete(i);
    }

    this.currentStep--;
    this._emitStepChange(this.currentStep, this.steps[this.currentStep]);
    return true;
  }

  /**
   * Go to a specific step
   */
  public goToStep(index: number): boolean {
    if (index < 0 || index >= this.steps.length) return false;
    if (this.disabled) return false;

    const step = this.steps[index];
    if (step.disabled) return false;

    if (this.linear && index > this.currentStep) {
      // Can't skip ahead in linear mode
      return false;
    }

    // When navigating backward, clear completion for steps at and after target
    if (index < this.currentStep) {
      for (let i = index; i < this.steps.length; i++) {
        this.completedSteps.delete(i);
      }
    }

    this.currentStep = index;
    this._emitStepChange(index, step);
    return true;
  }

  /**
   * Mark a step as having an error
   */
  public setStepError(index: number, hasError: boolean): void {
    if (hasError) {
      this.errorSteps.add(index);
      this.completedSteps.delete(index);
    } else {
      this.errorSteps.delete(index);
    }
    this.requestUpdate();
  }

  /**
   * Mark a step as complete
   */
  public setStepComplete(index: number, complete: boolean): void {
    if (complete) {
      this.completedSteps.add(index);
      this.errorSteps.delete(index);
    } else {
      this.completedSteps.delete(index);
    }
    this.requestUpdate();
  }

  /**
   * Reset the stepper to the first step
   */
  public reset(): void {
    this.currentStep = 0;
    this.completedSteps.clear();
    this.errorSteps.clear();
    this.requestUpdate();
  }

  /**
   * Check if we're on the first step
   */
  public get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  /**
   * Check if we're on the last step
   */
  public get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  /**
   * Get the current step configuration
   */
  public get currentStepConfig(): Step | undefined {
    return this.steps[this.currentStep];
  }

  /**
   * Render the step indicator (number circle with optional icon)
   * Shows checkmark for complete, X for error, or step number for other states
   * @param index Zero-based step index
   * @param status Current step status
   * @returns TemplateResult for step indicator
   */
  private _renderStepIndicator(index: number, status: StepStatus) {
    const showCheckmark = status === 'complete';
    const showError = status === 'error';

    /* Inline SVG icons for step states - functional indicators, not themed */
    /* stylelint-disable blueprint/no-hardcoded-values */
    return html`
      <div
        class=${classMap({
          'step-indicator': true,
          [`step-indicator--${status}`]: true,
        })}
        part="step-indicator"
      >
        ${showCheckmark
          ? html`<svg
              class="step-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`
          : showError
            ? html`<svg
                class="step-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>`
            : html`<span class="step-number">${index + 1}</span>`}
      </div>
    `;
    /* stylelint-enable blueprint/no-hardcoded-values */
  }

  /**
   * Render a complete step with indicator, label, description, and connector
   * @param step Step configuration
   * @param index Zero-based step index
   * @returns TemplateResult for step
   */
  private _renderStep(step: Step, index: number) {
    const status = this._getStepStatus(index);
    const isClickable = this._isStepClickable(index, step);
    const isLast = index === this.steps.length - 1;

    return html`
      <div
        class=${classMap({
          step: true,
          [`step--${status}`]: true,
          'step--disabled': step.disabled || this.disabled,
          'step--clickable': isClickable,
        })}
        part="step"
        role="listitem"
        data-step-index=${index}
        tabindex=${isClickable ? 0 : -1}
        aria-current=${status === 'current' ? 'step' : 'false'}
        aria-disabled=${step.disabled || this.disabled ? 'true' : 'false'}
        @click=${() => this._handleStepClick(index, step)}
        @keydown=${(e: KeyboardEvent) =>
          this._handleStepKeydown(e, index, step)}
      >
        ${this._renderStepIndicator(index, status)}
        ${!this.hideLabels
          ? html`
              <div class="step-content" part="step-content">
                <span class="step-label" part="step-label" title=${step.label}
                  >${step.label}</span
                >
                ${step.description
                  ? html`<span class="step-description" part="step-description"
                      >${step.description}</span
                    >`
                  : nothing}
                ${status === 'error' && step.error
                  ? html`<span class="step-error">${step.error}</span>`
                  : nothing}
              </div>
            `
          : nothing}
        ${!isLast
          ? html`<div class="connector" part="connector"></div>`
          : nothing}
      </div>
    `;
  }

  /**
   * Handle slotchange on the panel slot to track whether content is provided
   */
  private _handlePanelSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this.panelHasContent = slot.assignedNodes({ flatten: true }).length > 0;
  }

  /**
   * Render the content panel for the current step
   * Shows slotted content via step-{id} slot
   * @returns TemplateResult for panel or nothing if no current step
   */
  private _renderPanel() {
    const currentStepConfig = this.steps[this.currentStep];
    if (!currentStepConfig) return nothing;

    return html`
      <div
        class=${classMap({
          panel: true,
          'panel--has-content': this.panelHasContent,
        })}
        part="panel"
        role="tabpanel"
      >
        <slot
          name="step-${currentStepConfig.id}"
          @slotchange=${this._handlePanelSlotChange}
        ></slot>
      </div>
    `;
  }

  render() {
    return html`
      <div
        class=${classMap({
          stepper: true,
          [`stepper--${this.orientation}`]: true,
          [`stepper--${this.size}`]: true,
          'stepper--disabled': this.disabled,
        })}
        part="stepper"
      >
        <div
          class="step-list"
          part="step-list"
          role="list"
          aria-label="Progress steps"
        >
          ${this.steps.map((step, index) => this._renderStep(step, index))}
        </div>
        ${this._renderPanel()}
        <div class="actions" part="actions">
          <slot name="actions">
            ${this.showNavigation ? this._renderDefaultNavigation() : nothing}
          </slot>
        </div>
      </div>
    `;
  }

  /**
   * Render default navigation buttons (Previous/Next)
   * Only shown when showNavigation is true and no custom actions are slotted
   */
  private _renderDefaultNavigation() {
    return html`
      <button
        class="nav-button nav-button--previous"
        part="nav-button-previous"
        ?disabled=${this.isFirstStep || this.disabled}
        @click=${() => this.previous()}
      >
        Previous
      </button>
      <button
        class="nav-button nav-button--next"
        part="nav-button-next"
        ?disabled=${this.isLastStep || this.disabled}
        @click=${() => this.next()}
      >
        ${this.isLastStep ? 'Finish' : 'Next'}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-stepper': BpStepper;
  }
}
