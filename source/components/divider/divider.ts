import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dividerStyles } from './divider.style.js';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'sm' | 'md' | 'lg';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerColor = 'default' | 'subtle' | 'accent';
export type DividerWeight = 'thin' | 'medium' | 'thick';

/**
 * A divider component that provides visual separation between content sections.
 * Supports both horizontal and vertical orientations with optional text labels.
 */
@customElement('bp-divider')
export class BpDivider extends LitElement {
  /**
   * Orientation of the divider.
   * @type {'horizontal' | 'vertical'}
   * @default 'horizontal'
   */
  @property({ type: String, reflect: true })
  declare orientation: DividerOrientation;

  /**
   * Spacing variant for the divider.
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  @property({ type: String, reflect: true }) declare spacing: DividerSpacing;

  /**
   * Visual variant of the divider line.
   * @type {'solid' | 'dashed' | 'dotted'}
   * @default 'solid'
   */
  @property({ type: String, reflect: true }) declare variant: DividerVariant;

  /**
   * Color variant for the divider line.
   * @type {'default' | 'subtle' | 'accent'}
   * @default 'default'
   */
  @property({ type: String, reflect: true }) declare color: DividerColor;

  /**
   * Border weight for the divider line.
   * @type {'thin' | 'medium' | 'thick'}
   * @default 'thin'
   */
  @property({ type: String, reflect: true }) declare weight: DividerWeight;

  static styles = [dividerStyles];

  constructor() {
    super();
    this.orientation = 'horizontal';
    this.spacing = 'md';
    this.variant = 'solid';
    this.color = 'default';
    this.weight = 'thin';
  }

  render() {
    return html`
      <div
        class="divider divider--${this.orientation} divider--spacing-${this
          .spacing}"
        role="separator"
        aria-orientation="${this.orientation}"
        part="divider"
      >
        ${this.orientation === 'horizontal'
          ? html`
              <span
                class="divider__line divider__line--${this.variant}"
                part="line"
              ></span>
              <span class="divider__content" part="content">
                <slot></slot>
              </span>
              <span
                class="divider__line divider__line--${this.variant}"
                part="line"
              ></span>
            `
          : html`<span
              class="divider__line divider__line--${this.variant}"
              part="line"
            ></span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-divider': BpDivider;
  }
}
