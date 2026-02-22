# CodeBlock

A code block component for displaying source code with syntax highlighting, copy-to-clipboard, line numbers, line highlighting, and expand/collapse functionality.

## Features

- **Syntax highlighting** via a pluggable adapter pattern (Shiki, highlight.js, or plain text fallback)
- **Copy-to-clipboard** button with visual feedback and screen reader announcements
- **Line numbers** with proper alignment for wrapped lines
- **Line highlighting** to draw attention to specific lines
- **Line wrapping** enabled by default for responsive layouts
- **Expand/collapse** for long code blocks with configurable `maxLines`
- **Responsive** via CSS container queries — adapts to container width, not viewport
- **Themeable** using Blueprint design tokens
- **Accessible** with ARIA attributes, keyboard support, and screen reader announcements

## Usage

### Basic

```html
<bp-code-block
  language="bash"
  code="npm install @krollins/blueprint"
></bp-code-block>
```

### With title and line numbers

```html
<bp-code-block
  language="typescript"
  title="greeting.ts"
  show-line-numbers
  code="function greet(name: string): string {
  return `Hello, ${name}!`;
}"
></bp-code-block>
```

### With highlighted lines

```html
<bp-code-block
  language="python"
  show-line-numbers
  .highlightLines="${[3, 4]}"
  code="def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)"
></bp-code-block>
```

### Collapsible long code

```html
<bp-code-block
  language="typescript"
  title="long-file.ts"
  max-lines="10"
  .code="${longCodeString}"
></bp-code-block>
```

### With a custom syntax highlight adapter

```javascript
import {
  createShikiAdapter,
  BpCodeBlock,
} from '@krollins/blueprint/code-block';

BpCodeBlock.defaultAdapter = createShikiAdapter({
  langs: ['typescript', 'html', 'css'],
  theme: 'github-dark',
});
```

## API

### Properties

| Property           | Attribute           | Type                        | Default            | Description                                                                                  |
| ------------------ | ------------------- | --------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `code`             | `code`              | `string`                    | `''`               | The source code to display.                                                                  |
| `language`         | `language`          | `string`                    | `'text'`           | Language identifier for syntax highlighting. Also shown as header label.                     |
| `title`            | `title`             | `string`                    | `''`               | Optional title in the header (e.g. filename). Overrides language label.                      |
| `showLineNumbers`  | `show-line-numbers` | `boolean`                   | `false`            | Show line number gutter.                                                                     |
| `highlightLines`   | —                   | `number[]`                  | `[]`               | Array of 1-based line numbers to visually highlight.                                         |
| `wrapLines`        | `wrap-lines`        | `boolean`                   | `true`             | Wrap long lines instead of horizontal scroll.                                                |
| `showCopyButton`   | `show-copy-button`  | `boolean`                   | `true`             | Show the copy-to-clipboard button.                                                           |
| `maxLines`         | `max-lines`         | `number \| undefined`       | `undefined`        | Collapse to this many lines with a "Show more" toggle.                                       |
| `showHeader`       | `show-header`       | `boolean`                   | `true`             | Show/hide the header bar. When false, copy button floats over the code.                      |
| `highlightAdapter` | —                   | `CodeBlockHighlightAdapter` | `plainTextAdapter` | Pluggable syntax highlighting adapter. Set per-instance or via `BpCodeBlock.defaultAdapter`. |

### Events

| Event     | Detail                               | Description                                                                |
| --------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `bp-copy` | `{ code: string, success: boolean }` | Fired after a copy attempt. `success` indicates clipboard write succeeded. |

### Slots

| Slot          | Description                                               |
| ------------- | --------------------------------------------------------- |
| `title`       | Custom title content. Overrides the `title` attribute.    |
| `controls`    | Additional control buttons placed before the copy button. |
| `copy-icon`   | Custom icon for the copy button (default state).          |
| `copied-icon` | Custom icon for the copy button (success state).          |

### CSS Parts

| Part            | Description                 |
| --------------- | --------------------------- |
| `base`          | Outer wrapper               |
| `header`        | Header bar                  |
| `title`         | Title text area             |
| `controls`      | Controls container          |
| `copy-button`   | The copy button             |
| `body`          | Scrollable code container   |
| `pre`           | The `<pre>` element         |
| `code`          | The `<code>` element        |
| `line-number`   | Individual line number cell |
| `line`          | Individual line of code     |
| `expand-button` | The show more/less button   |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` — Code area background
- `--bp-color-surface-elevated` — Header background, floating copy button background
- `--bp-color-text` — Code text color
- `--bp-color-text-muted` — Title label, line numbers
- `--bp-color-border` — Borders
- `--bp-color-primary` — Expand button text, highlight line border
- `--bp-color-success` — Copy success icon color
- `--bp-color-error` — Copy error icon color
- `--bp-color-selected-bg` — Highlighted line background
- `--bp-color-hover-overlay` — Button hover state
- `--bp-color-active-overlay` — Button active state
- `--bp-font-family` — Header text font
- `--bp-font-family-mono` — Code font

### Universal Tokens (Infrastructure)

- `--bp-spacing-*` — Padding, gaps, margins
- `--bp-font-size-xs`, `--bp-font-size-sm` — Font sizes
- `--bp-font-weight-medium` — Header label weight
- `--bp-line-height-relaxed` — Code line height
- `--bp-border-radius-lg`, `--bp-border-radius-md` — Border radius
- `--bp-border-width` — Border thickness
- `--bp-transition-fast` — Hover/focus transitions
- `--bp-focus-ring`, `--bp-focus-offset` — Focus indicators
- `--bp-icon-size-sm` — Copy icon size
- `--bp-shadow-sm` — Floating copy button shadow
- `--bp-opacity-subtle` — Line number opacity
- `--bp-z-base` — Floating copy button z-index

## Syntax Highlighting Adapters

The component uses an adapter pattern. The built-in `plainTextAdapter` escapes HTML and renders monospace text with zero dependencies.

### Adapter Interface

```typescript
interface CodeBlockHighlightAdapter {
  initialize?(): Promise<unknown>;
  highlight(options: {
    code: string;
    language: string;
    context: unknown;
  }): HighlightResult;
}

interface HighlightResult {
  html: string;
  isHighlighted: boolean;
}
```

### Setting an adapter

```typescript
// Per-instance
codeBlock.highlightAdapter = myAdapter;

// Global default
BpCodeBlock.defaultAdapter = myAdapter;
```

## Accessibility

- `role="region"` with `aria-label="Code example"` (includes title when set) on the outer container
- Semantic `<pre><code>` structure for screen readers
- Copy button is a real `<button>` with `aria-label` that updates on state change
- `aria-live="polite"` status region announces "Copied to clipboard" or "Failed to copy"
- Line numbers are `aria-hidden="true"` (visual aids only)
- Expand button has `aria-expanded` attribute
- Keyboard: `Tab` to copy/expand buttons, `Enter`/`Space` to activate
