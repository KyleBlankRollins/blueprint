import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { codeBlockStyles } from './code-block.style.js';

/**
 * Result returned by a highlight adapter.
 */
export interface HighlightResult {
  /** The highlighted code as an HTML string. */
  html: string;
  /** Whether highlighting was actually applied (false = plain text fallback). */
  isHighlighted: boolean;
}

/**
 * Adapter interface for pluggable syntax highlighting.
 */
export interface CodeBlockHighlightAdapter {
  /**
   * Called once when the adapter is first used.
   * Use this for async initialization (loading Shiki, registering languages, etc).
   * Return value is passed to `highlight()` as context.
   */
  initialize?(): Promise<unknown>;

  /**
   * Return highlighted HTML for the given code and language.
   * `context` is the resolved value from `initialize()`.
   */
  highlight(options: {
    code: string;
    language: string;
    context: unknown;
  }): HighlightResult;
}

/** Maps HTML special characters to their entity equivalents for XSS prevention. */
const htmlEscapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

/**
 * Escapes HTML special characters in a single pass to prevent XSS when rendering plain text.
 */
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char);
}

/**
 * Built-in plain text adapter that escapes HTML and renders monospace text.
 * Zero dependencies, zero bundle cost.
 */
export const plainTextAdapter: CodeBlockHighlightAdapter = {
  highlight({ code }) {
    return {
      html: escapeHtml(code),
      isHighlighted: false,
    };
  },
};

/**
 * A code block component for displaying syntax-highlighted code with
 * copy-to-clipboard, line numbers, line highlighting, and expand/collapse.
 *
 * @slot title - Custom title content. Overrides the `title` attribute.
 * @slot controls - Additional control buttons placed before the copy button.
 * @slot copy-icon - Custom icon for the copy button (default state).
 * @slot copied-icon - Custom icon for the copy button (success state).
 *
 * @fires bp-copy - Fired after a copy attempt. Detail: `{ code: string, success: boolean }`
 *
 * @csspart base - Outer wrapper
 * @csspart header - Header bar
 * @csspart title - Title text area
 * @csspart controls - Controls container
 * @csspart copy-button - The copy button
 * @csspart body - Scrollable code container
 * @csspart pre - The `<pre>` element
 * @csspart code - The `<code>` element
 * @csspart line-number - Individual line number cell
 * @csspart line - Individual line of code
 */
@customElement('bp-code-block')
export class BpCodeBlock extends LitElement {
  /**
   * The source code to display.
   */
  @property({ type: String }) declare code: string;

  /**
   * Language identifier for syntax highlighting (e.g. 'typescript', 'html', 'python').
   * Also displayed as a label when no title is set.
   */
  @property({ type: String }) declare language: string;

  /**
   * Optional title displayed in the header (e.g. a filename like `index.ts`).
   * Overrides the language label.
   */
  @property({ type: String }) declare title: string;

  /**
   * Show line number gutter.
   */
  @property({ type: Boolean, attribute: 'show-line-numbers', reflect: true })
  declare showLineNumbers: boolean;

  /**
   * Array of 1-based line numbers to visually highlight.
   */
  @property({ type: Array }) declare highlightLines: number[];

  /**
   * Wrap long lines instead of horizontal scroll.
   */
  @property({ type: Boolean, attribute: 'wrap-lines', reflect: true })
  declare wrapLines: boolean;

  /**
   * Show the copy-to-clipboard button.
   */
  @property({ type: Boolean, attribute: 'show-copy-button', reflect: true })
  declare showCopyButton: boolean;

  /**
   * When set, collapse the code block to this many visible lines with a "Show more" toggle.
   */
  @property({ type: Number, attribute: 'max-lines' })
  declare maxLines: number | undefined;

  /**
   * Show/hide the header bar. When false, the copy button floats over the code.
   */
  @property({ type: Boolean, attribute: 'show-header', reflect: true })
  declare showHeader: boolean;

  /**
   * The syntax highlight adapter to use for this instance.
   * Defaults to `BpCodeBlock.defaultAdapter` which is the plainTextAdapter.
   */
  @property({ attribute: false })
  declare highlightAdapter: CodeBlockHighlightAdapter;

  /**
   * Global default adapter used when no per-instance adapter is set.
   */
  static defaultAdapter: CodeBlockHighlightAdapter = plainTextAdapter;

  @state() private _copyState: 'idle' | 'copied' | 'error' = 'idle';
  @state() private _expanded = false;
  @state() private _highlightedHtml = '';
  @state() private _adapterContext: unknown = undefined;
  @state() private _adapterInitialized = false;
  @state() private _lineCount = 0;
  @state() private _highlightSet: Set<number> = new Set();
  @state() private _highlightedLines: string[] = [];

  private _copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  static styles = [codeBlockStyles];

  constructor() {
    super();
    this.code = '';
    this.language = 'text';
    this.title = '';
    this.showLineNumbers = false;
    this.highlightLines = [];
    this.wrapLines = true;
    this.showCopyButton = true;
    this.maxLines = undefined;
    this.showHeader = true;
    this.highlightAdapter = BpCodeBlock.defaultAdapter;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._copyResetTimer) {
      clearTimeout(this._copyResetTimer);
      this._copyResetTimer = null;
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('highlightAdapter')) {
      this._adapterInitialized = false;
      this._adapterContext = undefined;
      this._initializeAdapter();
    }

    if (changedProperties.has('code')) {
      this._lineCount = this.code.split('\n').length;
    }

    if (changedProperties.has('highlightLines')) {
      this._highlightSet = new Set(this.highlightLines);
    }

    const needsRehighlight =
      changedProperties.has('code') ||
      changedProperties.has('language') ||
      changedProperties.has('highlightAdapter');

    if (needsRehighlight) {
      this._updateHighlightingSync();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._initializeAdapter();
  }

  private async _initializeAdapter(): Promise<void> {
    const adapter = this.highlightAdapter;
    if (!this._adapterInitialized && adapter.initialize) {
      try {
        const context = await adapter.initialize();
        // Bail if adapter changed while awaiting
        if (this.highlightAdapter !== adapter) return;
        this._adapterContext = context;
      } catch {
        if (this.highlightAdapter !== adapter) return;
        this._adapterContext = undefined;
      }
      this._adapterInitialized = true;
      // Re-highlight with context after async init
      this._updateHighlightingSync();
      this.requestUpdate();
    }
  }

  private _updateHighlightingSync(): void {
    const adapter = this.highlightAdapter;

    try {
      const result = adapter.highlight({
        code: this.code,
        language: this.language,
        context: this._adapterContext,
      });
      this._highlightedHtml = result.html;
    } catch {
      // Fallback to plain text on adapter error
      this._highlightedHtml = escapeHtml(this.code);
    }

    this._highlightedLines = this._highlightedHtml.split('\n');
  }

  private _handleCopy = async (): Promise<void> => {
    let success: boolean;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(this.code);
        success = true;
      } else {
        // Fallback for insecure contexts
        success = this._fallbackCopy();
      }
    } catch {
      success = this._fallbackCopy();
    }

    this._copyState = success ? 'copied' : 'error';

    this.dispatchEvent(
      new CustomEvent('bp-copy', {
        detail: { code: this.code, success },
        bubbles: true,
        composed: true,
      })
    );

    // Reset after 2 seconds
    if (this._copyResetTimer) {
      clearTimeout(this._copyResetTimer);
    }
    this._copyResetTimer = setTimeout(() => {
      this._copyState = 'idle';
      this._copyResetTimer = null;
    }, 2000);
  };

  private _fallbackCopy(): boolean {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = this.code;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      return result;
    } catch {
      return false;
    }
  }

  private _toggleExpanded(): void {
    this._expanded = !this._expanded;
  }

  private get _shouldCollapse(): boolean {
    return (
      this.maxLines !== undefined &&
      this.maxLines > 0 &&
      this._lineCount > this.maxLines
    );
  }

  private get _isCollapsed(): boolean {
    return this._shouldCollapse && !this._expanded;
  }

  private get _headerLabel(): string {
    return this.title || this.language;
  }

  private _getCopyAriaLabel(): string {
    if (this._copyState === 'copied') return 'Copied!';
    if (this._copyState === 'error') return 'Failed to copy';
    return 'Copy code';
  }

  private _renderCopyIcon() {
    if (this._copyState === 'copied') {
      return html`
        <slot name="copied-icon">
          <svg
            class="code-block__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </slot>
      `;
    }

    return html`
      <slot name="copy-icon">
        <svg
          class="code-block__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </slot>
    `;
  }

  private _renderCopyButton() {
    if (!this.showCopyButton) return nothing;

    return html`
      <button
        part="copy-button"
        class="code-block__copy code-block__copy--${this._copyState}"
        aria-label=${this._getCopyAriaLabel()}
        @click=${this._handleCopy}
      >
        ${this._renderCopyIcon()}
      </button>
    `;
  }

  private _renderHeader() {
    if (!this.showHeader) return nothing;

    return html`
      <div part="header" class="code-block__header">
        <span part="title" class="code-block__title">
          <slot name="title">${this._headerLabel}</slot>
        </span>
        <div part="controls" class="code-block__controls">
          <slot name="controls"></slot>
          ${this._renderCopyButton()}
        </div>
      </div>
    `;
  }

  private _renderFloatingCopyButton() {
    if (this.showHeader || !this.showCopyButton) return nothing;

    return html`
      <div class="code-block__floating-copy">${this._renderCopyButton()}</div>
    `;
  }

  private _renderLine(
    lineHtml: string,
    lineNumber: number,
    showNumber: boolean
  ) {
    const isHighlighted = this._highlightSet.has(lineNumber);
    // Template kept tight to avoid whitespace text nodes inside the CSS grid.
    // Anonymous text nodes in a grid become extra rows, adding visual gaps.
    return showNumber
      ? html`<span
            part="line-number"
            class="code-block__line-number"
            aria-hidden="true"
            >${lineNumber}</span
          ><span
            part="line"
            class="code-block__line ${isHighlighted
              ? 'code-block__line--highlighted'
              : ''}"
            aria-current=${ifDefined(isHighlighted ? 'true' : undefined)}
            >${unsafeHTML(lineHtml)}</span
          >`
      : html`<span
          part="line"
          class="code-block__line ${isHighlighted
            ? 'code-block__line--highlighted'
            : ''}"
          aria-current=${ifDefined(isHighlighted ? 'true' : undefined)}
          >${unsafeHTML(lineHtml)}</span
        >`;
  }

  private _renderCodeLines() {
    // Templates kept tight to avoid whitespace text nodes inside CSS grids.
    if (this.showLineNumbers) {
      return html`<div class="code-block__lines">
        ${this._highlightedLines.map((lineHtml, index) =>
          this._renderLine(lineHtml, index + 1, true)
        )}
      </div>`;
    }

    if (this.highlightLines.length > 0) {
      return html`<div class="code-block__lines code-block__lines--no-gutter">
        ${this._highlightedLines.map((lineHtml, index) =>
          this._renderLine(lineHtml, index + 1, false)
        )}
      </div>`;
    }

    return unsafeHTML(this._highlightedHtml);
  }

  private _renderExpandButton() {
    if (!this._shouldCollapse) return nothing;

    return html`
      <button
        part="expand-button"
        class="code-block__expand"
        @click=${this._toggleExpanded}
        aria-expanded=${this._expanded}
      >
        ${this._expanded ? 'Show less' : 'Show more'}
      </button>
    `;
  }

  render() {
    const bodyClasses = [
      'code-block__body',
      this.wrapLines ? 'code-block__body--wrap' : 'code-block__body--scroll',
      this._isCollapsed ? 'code-block__body--collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div
        part="base"
        class="code-block"
        role="region"
        aria-label=${this.title
          ? `Code example: ${this.title}`
          : 'Code example'}
        style=${this._isCollapsed && this.maxLines
          ? `--_max-lines: ${this.maxLines}`
          : ''}
      >
        ${this._renderHeader()}
        <div part="body" class=${bodyClasses}>
          ${this._renderFloatingCopyButton()}
          <pre
            part="pre"
            class="code-block__pre"
          ><code part="code" class="code-block__code">${this._renderCodeLines()}</code></pre>
          ${this._isCollapsed
            ? html`<div class="code-block__gradient"></div>`
            : nothing}
        </div>
        ${this._renderExpandButton()}
        <div class="code-block__status" role="status" aria-live="polite">
          ${this._copyState === 'copied' ? 'Copied to clipboard' : ''}
          ${this._copyState === 'error' ? 'Failed to copy' : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-code-block': BpCodeBlock;
  }
}
