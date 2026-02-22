import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { iconStyles } from './icon.style.js';
import { getIconSvg, registerIcon } from './icon-registry.js';
import type { IconName } from './icons/icon-name.generated.js';

export type { IconName } from './icons/icon-name.generated.js';

export type IconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | 'full';
export type IconColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted';

/**
 * Icon component - SVG icon wrapper with size variants
 *
 * Supports both named icons from the System UI Icons library and custom SVG content via slot.
 *
 * @slot - Custom SVG content to display (used when `name` is not provided)
 *
 * @csspart icon - The icon container element
 *
 * @example
 * ```html
 * <!-- Using named icon from library -->
 * <bp-icon name="create" size="md" color="primary"></bp-icon>
 *
 * <!-- Using custom SVG content -->
 * <bp-icon size="md">
 *   <svg viewBox="0 0 24 24" fill="currentColor">
 *     <path d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z"/>
 *   </svg>
 * </bp-icon>
 * ```
 */
@customElement('bp-icon')
export class BpIcon extends LitElement {
  /**
   * Name of the icon from the System UI Icons library.
   * When set (and `svg` is empty), the component lazy-loads the icon's
   * entry module at runtime and caches the SVG for subsequent renders.
   * Ignored when the `svg` property is set.
   * @type {IconName}
   */
  @property({ type: String }) declare name: IconName | '';

  /**
   * Raw SVG string to render directly. When set, the `name` property is
   * ignored. This is the preferred way for internal Blueprint components
   * to supply icon data because it survives bundler tree-shaking.
   * @type {string}
   */
  @property({ type: String }) declare svg: string;

  /**
   * Size variant of the icon
   * @type {IconSize}
   */
  @property({ type: String, reflect: true }) declare size: IconSize;

  /**
   * Color variant of the icon
   * @type {IconColor}
   */
  @property({ type: String }) declare color: IconColor;

  /**
   * ARIA label for accessibility
   * @type {string}
   */
  @property({ type: String, attribute: 'aria-label' })
  declare ariaLabel: string;

  /** SVG content resolved by lazy-loading an icon entry module. */
  @state() private _loadedSvg = '';

  /** Tracks which icon name is currently being loaded to avoid races. */
  private _loadingName = '';

  constructor() {
    super();
    this.name = '';
    this.svg = '';
    this.size = 'md';
    this.color = 'default';
    this.ariaLabel = '';
  }

  static styles = [iconStyles];

  willUpdate(changedProps: PropertyValues) {
    // When the name changes and no direct svg is provided, lazy-load the icon.
    if (changedProps.has('name') || changedProps.has('svg')) {
      if (this.svg) {
        // Direct svg takes priority — clear any lazy-loaded content.
        this._loadedSvg = '';
        this._loadingName = '';
        return;
      }

      if (this.name && changedProps.has('name')) {
        this._loadIcon(this.name);
      }
    }
  }

  /**
   * Lazy-load an icon entry module by name.
   *
   * First checks the sync registry cache (populated by `all.ts` or a
   * previous load). If the icon isn't cached, dynamically imports the
   * per-icon entry module using `import.meta.url` to resolve the path
   * relative to this file's location in `dist/`.
   */
  private async _loadIcon(name: string) {
    this._loadingName = name;

    // Fast path: icon already in the registry (e.g. tests import all.ts).
    const cached = getIconSvg(name);
    if (cached) {
      this._loadedSvg = cached;
      return;
    }

    try {
      // Build an absolute URL to the per-icon entry module.
      // The URL is computed from this module's own location so it resolves
      // correctly regardless of how the consumer's bundler serves the files.
      const iconPath = ['..', 'icons', name + '.js'].join('/');
      const resolved = new URL(iconPath, import.meta.url).href;

      // Use Function to construct the import call so Rollup/Vite cannot
      // statically analyse or rewrite it. This is intentional — the icon
      // entries are separate files that must be fetched at runtime.
      const loadModule = new Function('url', 'return import(url)') as (
        url: string
      ) => Promise<{ default: string }>;
      const module = await loadModule(resolved);
      const svg: string = module.default;

      if (svg && this._loadingName === name) {
        registerIcon(name, svg); // Cache for next time.
        this._loadedSvg = svg;
      }
    } catch {
      if (this._loadingName === name) {
        this._loadedSvg = '';
      }
    }
  }

  render() {
    const classes = ['icon', `icon--${this.size}`, `icon--${this.color}`].join(
      ' '
    );

    // Priority: svg property → lazy-loaded → slot fallback
    const svgContent = this.svg || this._loadedSvg || null;

    return html`
      <span
        class=${classes}
        part="icon"
        role=${this.ariaLabel ? 'img' : 'presentation'}
        aria-label=${ifDefined(this.ariaLabel || undefined)}
      >
        ${svgContent ? html`${unsafeHTML(svgContent)}` : html`<slot></slot>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-icon': BpIcon;
  }
}
