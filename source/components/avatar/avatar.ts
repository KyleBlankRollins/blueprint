import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { avatarStyles } from './avatar.style.js';
import '../icon/icon.js';
import '../icon/icons/entries/users.js';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * An avatar component that displays user profile images with fallback to initials.
 * Supports multiple sizes, shapes, status indicators, and interactive states.
 */
@customElement('bp-avatar')
export class BpAvatar extends LitElement {
  /**
   * Image source URL for the avatar.
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare src: string;

  /**
   * Alt text for the avatar image (accessibility).
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare alt: string;

  /**
   * Initials to display when no image is provided.
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare initials: string;

  /**
   * Size of the avatar.
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
   * @default 'md'
   */
  @property({ type: String, reflect: true }) declare size: AvatarSize;

  /**
   * Shape of the avatar.
   * @type {'circle' | 'square'}
   * @default 'circle'
   */
  @property({ type: String, reflect: true }) declare shape: AvatarShape;

  /**
   * Status indicator for the avatar.
   * @type {'online' | 'offline' | 'busy' | 'away' | undefined}
   * @default undefined
   */
  @property({ type: String, reflect: true }) declare status?: AvatarStatus;

  /**
   * Makes the avatar interactive with hover/focus states.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true }) declare clickable: boolean;

  /**
   * Name for tooltip display on hover.
   * @type {string}
   * @default ''
   */
  @property({ type: String }) declare name: string;

  /**
   * Internal state to track if image failed to load.
   * @private
   */
  @state() private imageError = false;

  static styles = [avatarStyles];

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.initials = '';
    this.size = 'md';
    this.shape = 'circle';
    this.clickable = false;
    this.name = '';
  }

  private handleImageError() {
    // Track image error state to show fallback
    this.imageError = true;
  }

  render() {
    const hasImage = this.src.length > 0 && !this.imageError;
    const hasInitials = this.initials.length > 0;
    const titleText = this.name || this.alt;

    return html`
      <div
        class="avatar avatar--${this.size} avatar--${this.shape}"
        part="avatar"
        title="${titleText}"
      >
        ${hasImage
          ? html`
              <img
                class="avatar__image"
                src="${this.src}"
                alt="${this.alt}"
                @error="${this.handleImageError}"
                part="image"
              />
            `
          : hasInitials
            ? html`<span
                class="avatar__initials"
                part="initials"
                role="img"
                aria-label="${this.alt || 'User avatar'}"
                >${this.initials}</span
              >`
            : html`<bp-icon
                class="avatar__fallback"
                name="users"
                size="${this.size === 'xs'
                  ? 'xs'
                  : this.size === 'xl'
                    ? 'lg'
                    : this.size}"
                part="fallback"
                aria-label="User avatar"
              ></bp-icon>`}
        ${this.status
          ? html`<span
              class="avatar__status avatar__status--${this.status}"
              part="status"
              aria-label="${this.status}"
            ></span>`
          : ''}
      </div>
    `;
  }

  updated(changedProperties: Map<string, unknown>) {
    // Reset image error state when src changes
    if (changedProperties.has('src')) {
      this.imageError = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-avatar': BpAvatar;
  }
}
