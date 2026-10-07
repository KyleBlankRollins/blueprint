import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { containerStyles } from './container.style.js';
import type { LayoutGap } from '../stack/stack.js';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Centers page content and caps its width at a breakpoint, with an inline
 * gutter so content never touches the viewport edge.
 *
 * @element bp-container
 *
 * @slot - The page content
 */
@customElement('bp-container')
export class BpContainer extends LitElement {
  /** Maximum width, from the breakpoint scale (`full` removes the cap) */
  @property({ type: String, reflect: true }) declare size: ContainerSize;

  /** Inline padding, from the semantic spacing scale */
  @property({ type: String, reflect: true }) declare gutter: LayoutGap;

  static styles = [containerStyles];

  constructor() {
    super();
    this.size = 'lg';
    this.gutter = 'md';
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-container': BpContainer;
  }
}
