import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonStyles } from './button.style.js';

@customElement('bp-button')
export class BpButton extends LitElement {
  @property({ type: String }) declare someProp: string;

  static styles = [buttonStyles];

  render() {
    return html`
      <div class="button">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-button': BpButton;
  }
}
