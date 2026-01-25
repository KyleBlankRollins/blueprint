import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './stepper.js';
import type { BpStepper, Step } from './stepper.js';

const testSteps: Step[] = [
  { id: 'step1', label: 'Step 1', description: 'First step description' },
  { id: 'step2', label: 'Step 2', description: 'Second step description' },
  { id: 'step3', label: 'Step 3', description: 'Third step description' },
];

describe('bp-stepper', () => {
  let element: BpStepper;

  beforeEach(() => {
    element = document.createElement('bp-stepper');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Registration Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-stepper');
    expect(constructor).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render stepper container to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.stepper')).toBeTruthy();
  });

  it('should render step list', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.step-list')).toBeTruthy();
  });

  it('should render all steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const steps = element.shadowRoot?.querySelectorAll('.step');
    expect(steps?.length).toBe(3);
  });

  it('should render step indicators', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const indicators = element.shadowRoot?.querySelectorAll('.step-indicator');
    expect(indicators?.length).toBe(3);
  });

  it('should render step labels', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const labels = element.shadowRoot?.querySelectorAll('.step-label');
    expect(labels?.length).toBe(3);
    expect(labels?.[0].textContent).toBe('Step 1');
  });

  it('should render step descriptions', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const descriptions =
      element.shadowRoot?.querySelectorAll('.step-description');
    expect(descriptions?.length).toBe(3);
    expect(descriptions?.[0].textContent).toBe('First step description');
  });

  it('should render connectors between steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const connectors = element.shadowRoot?.querySelectorAll('.connector');
    expect(connectors?.length).toBe(2); // 3 steps = 2 connectors
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Default Values Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should have correct default property values', () => {
    expect(element.steps).toEqual([]);
    expect(element.currentStep).toBe(0);
    expect(element.orientation).toBe('horizontal');
    expect(element.size).toBe('md');
    expect(element.linear).toBe(true);
    expect(element.disabled).toBe(false);
    expect(element.hideLabels).toBe(false);
    expect(element.clickable).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Property Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should set property: steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    expect(element.steps).toEqual(testSteps);
  });

  it('should set property: currentStep', async () => {
    element.steps = testSteps;
    element.currentStep = 1;
    await element.updateComplete;
    expect(element.currentStep).toBe(1);
  });

  it('should set property: orientation', async () => {
    element.orientation = 'vertical';
    await element.updateComplete;
    expect(element.orientation).toBe('vertical');
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
  });

  it('should set property: linear', async () => {
    element.linear = false;
    await element.updateComplete;
    expect(element.linear).toBe(false);
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
  });

  it('should set property: hideLabels', async () => {
    element.hideLabels = true;
    await element.updateComplete;
    expect(element.hideLabels).toBe(true);
  });

  it('should set property: clickable', async () => {
    element.clickable = false;
    await element.updateComplete;
    expect(element.clickable).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Step Status Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should mark current step correctly', async () => {
    element.steps = testSteps;
    element.currentStep = 1;
    await element.updateComplete;
    const steps = element.shadowRoot?.querySelectorAll('.step');
    expect(steps?.[1].classList.contains('step--current')).toBe(true);
  });

  it('should mark previous steps as complete when advancing', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;
    element.currentStep = 2;
    await element.updateComplete;
    const steps = element.shadowRoot?.querySelectorAll('.step');
    expect(steps?.[0].classList.contains('step--complete')).toBe(true);
    expect(steps?.[1].classList.contains('step--complete')).toBe(true);
  });

  it('should mark pending steps correctly', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;
    const steps = element.shadowRoot?.querySelectorAll('.step');
    expect(steps?.[2].classList.contains('step--pending')).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation Method Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should navigate to next step with next()', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;
    const result = element.next();
    await element.updateComplete;
    expect(result).toBe(true);
    expect(element.currentStep).toBe(1);
  });

  it('should not navigate past last step with next()', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;
    const result = element.next();
    expect(result).toBe(false);
    expect(element.currentStep).toBe(2);
  });

  it('should navigate to previous step with previous()', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;
    const result = element.previous();
    await element.updateComplete;
    expect(result).toBe(true);
    expect(element.currentStep).toBe(1);
  });

  it('should not navigate before first step with previous()', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;
    const result = element.previous();
    expect(result).toBe(false);
    expect(element.currentStep).toBe(0);
  });

  it('should navigate to specific step with goToStep()', async () => {
    element.steps = testSteps;
    element.linear = false;
    element.currentStep = 0;
    await element.updateComplete;
    const result = element.goToStep(2);
    await element.updateComplete;
    expect(result).toBe(true);
    expect(element.currentStep).toBe(2);
  });

  it('should not skip ahead in linear mode with goToStep()', async () => {
    element.steps = testSteps;
    element.linear = true;
    element.currentStep = 0;
    await element.updateComplete;
    const result = element.goToStep(2);
    expect(result).toBe(false);
    expect(element.currentStep).toBe(0);
  });

  it('should reset stepper with reset()', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;
    element.reset();
    await element.updateComplete;
    expect(element.currentStep).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Getter Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should return true for isFirstStep when on first step', () => {
    element.steps = testSteps;
    element.currentStep = 0;
    expect(element.isFirstStep).toBe(true);
  });

  it('should return false for isFirstStep when not on first step', () => {
    element.steps = testSteps;
    element.currentStep = 1;
    expect(element.isFirstStep).toBe(false);
  });

  it('should return true for isLastStep when on last step', () => {
    element.steps = testSteps;
    element.currentStep = 2;
    expect(element.isLastStep).toBe(true);
  });

  it('should return false for isLastStep when not on last step', () => {
    element.steps = testSteps;
    element.currentStep = 0;
    expect(element.isLastStep).toBe(false);
  });

  it('should return current step config with currentStepConfig', () => {
    element.steps = testSteps;
    element.currentStep = 1;
    expect(element.currentStepConfig?.id).toBe('step2');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Error State Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should mark step as error with setStepError()', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    element.setStepError(0, true);
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('.step');
    expect(step?.classList.contains('step--error')).toBe(true);
  });

  it('should clear error state with setStepError(index, false)', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    element.setStepError(0, true);
    await element.updateComplete;
    element.setStepError(0, false);
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('.step');
    expect(step?.classList.contains('step--error')).toBe(false);
  });

  it('should not advance when current step has error', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;
    element.setStepError(0, true);
    await element.updateComplete;
    const result = element.next();
    expect(result).toBe(false);
    expect(element.currentStep).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Complete State Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should mark step as complete with setStepComplete()', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    element.setStepComplete(0, true);
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('.step');
    expect(step?.classList.contains('step--complete')).toBe(true);
  });

  it('should show checkmark icon for complete steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    element.setStepComplete(0, true);
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('.step .step-icon');
    expect(icon).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should emit bp-step-change event when navigating with next()', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;

    const changeHandler = vi.fn();
    element.addEventListener('bp-step-change', changeHandler);

    element.next();
    await element.updateComplete;

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler.mock.calls[0][0].detail.step).toBe(1);
    expect(changeHandler.mock.calls[0][0].detail.stepId).toBe('step2');
  });

  it('should emit bp-step-complete event when completing a step', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;

    const completeHandler = vi.fn();
    element.addEventListener('bp-step-complete', completeHandler);

    element.next();
    await element.updateComplete;

    expect(completeHandler).toHaveBeenCalledTimes(1);
    expect(completeHandler.mock.calls[0][0].detail.step).toBe(0);
    expect(completeHandler.mock.calls[0][0].detail.stepId).toBe('step1');
  });

  it('should emit bp-step-click event when step is clicked', async () => {
    element.steps = testSteps;
    element.currentStep = 0;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-step-click', clickHandler);

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="0"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Click Interaction Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should navigate when clicking completed step', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="0"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(element.currentStep).toBe(0);
  });

  it('should not navigate when clicking pending step in linear mode', async () => {
    element.steps = testSteps;
    element.linear = true;
    element.currentStep = 0;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="2"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(element.currentStep).toBe(0);
  });

  it('should navigate when clicking any step in non-linear mode', async () => {
    element.steps = testSteps;
    element.linear = false;
    element.currentStep = 0;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="2"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(element.currentStep).toBe(2);
  });

  it('should not click when clickable is false', async () => {
    element.steps = testSteps;
    element.clickable = false;
    element.currentStep = 2;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="0"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(element.currentStep).toBe(2);
  });

  it('should not navigate when disabled', async () => {
    element.steps = testSteps;
    element.disabled = true;
    element.currentStep = 0;
    await element.updateComplete;

    const result = element.next();
    expect(result).toBe(false);
    expect(element.currentStep).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should support keyboard navigation with Enter on step', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="0"]'
    ) as HTMLElement;
    step?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await element.updateComplete;

    expect(element.currentStep).toBe(0);
  });

  it('should support keyboard navigation with Space on step', async () => {
    element.steps = testSteps;
    element.currentStep = 2;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="0"]'
    ) as HTMLElement;
    step?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await element.updateComplete;

    expect(element.currentStep).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should have role="list" on step list', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const stepList = element.shadowRoot?.querySelector('.step-list');
    expect(stepList?.getAttribute('role')).toBe('list');
  });

  it('should have role="listitem" on steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('.step');
    expect(step?.getAttribute('role')).toBe('listitem');
  });

  it('should have aria-current="step" on current step', async () => {
    element.steps = testSteps;
    element.currentStep = 1;
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('[data-step-index="1"]');
    expect(step?.getAttribute('aria-current')).toBe('step');
  });

  it('should have aria-label on step list', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const stepList = element.shadowRoot?.querySelector('.step-list');
    expect(stepList?.getAttribute('aria-label')).toBe('Progress steps');
  });

  it('should have tabindex on clickable steps', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('[data-step-index="0"]');
    expect(step?.getAttribute('tabindex')).toBe('0');
  });

  it('should have tabindex -1 on non-clickable steps', async () => {
    element.steps = testSteps;
    element.linear = true;
    element.currentStep = 0;
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('[data-step-index="2"]');
    expect(step?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have aria-disabled on disabled steps', async () => {
    element.steps = [
      { id: 'step1', label: 'Step 1', disabled: true },
      { id: 'step2', label: 'Step 2' },
    ];
    await element.updateComplete;
    const step = element.shadowRoot?.querySelector('[data-step-index="0"]');
    expect(step?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role="tabpanel" on panel', async () => {
    element.steps = testSteps;
    await element.updateComplete;
    const panel = element.shadowRoot?.querySelector('.panel');
    expect(panel?.getAttribute('role')).toBe('tabpanel');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Disabled Step Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should not allow clicking disabled step', async () => {
    element.steps = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2', disabled: true },
      { id: 'step3', label: 'Step 3' },
    ];
    element.linear = false;
    element.currentStep = 0;
    await element.updateComplete;

    const step = element.shadowRoot?.querySelector(
      '[data-step-index="1"]'
    ) as HTMLElement;
    step?.click();
    await element.updateComplete;

    expect(element.currentStep).toBe(0);
  });

  it('should not navigate to disabled step with goToStep()', async () => {
    element.steps = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2', disabled: true },
    ];
    element.currentStep = 0;
    await element.updateComplete;

    const result = element.goToStep(1);
    expect(result).toBe(false);
    expect(element.currentStep).toBe(0);
  });
});
