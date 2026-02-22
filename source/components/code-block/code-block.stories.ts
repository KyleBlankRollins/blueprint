import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './code-block.js';

const sampleTypeScript = `import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({ type: String }) declare name: string;

  constructor() {
    super();
    this.name = 'World';
  }

  render() {
    return html\`<h1>Hello, \${this.name}!</h1>\`;
  }
}`;

const sampleBash = `#!/bin/bash
# Install dependencies
npm install @krollins/blueprint

# Start the dev server
npm run dev

# Run tests
npm run test:run`;

const samplePython = `def fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Print the first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`;

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <bp-code-block
    language="typescript"
    title="greeting.ts"
    show-line-numbers
    .code="\${myCode}"
  ></bp-code-block>
  <script type="module" src="app.js"></script>
</body>
</html>`;

const longCode = Array.from(
  { length: 30 },
  (_, index) => `// Line ${index + 1}: Some code that goes on for a while`
).join('\n');

const meta: Meta = {
  title: 'Components/CodeBlock',
  component: 'bp-code-block',
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'The source code to display.',
    },
    language: {
      control: 'text',
      description: 'Language identifier for syntax highlighting.',
    },
    title: {
      control: 'text',
      description: 'Optional title displayed in the header.',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Show line number gutter.',
    },
    wrapLines: {
      control: 'boolean',
      description: 'Wrap long lines instead of horizontal scroll.',
    },
    showCopyButton: {
      control: 'boolean',
      description: 'Show the copy-to-clipboard button.',
    },
    maxLines: {
      control: 'number',
      description: 'Collapse to this many lines with a toggle.',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show/hide the header bar.',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    showLineNumbers: false,
    wrapLines: true,
    showCopyButton: true,
    showHeader: true,
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      ?show-line-numbers=${args.showLineNumbers}
      ?wrap-lines=${args.wrapLines}
      ?show-copy-button=${args.showCopyButton}
      ?show-header=${args.showHeader}
    ></bp-code-block>
  `,
};

export const WithTitle: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    title: 'my-element.ts',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .title=${args.title}
      show-line-numbers
    ></bp-code-block>
  `,
};

export const WithLineNumbers: Story = {
  args: {
    code: samplePython,
    language: 'python',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      show-line-numbers
    ></bp-code-block>
  `,
};

export const WithHighlightedLines: Story = {
  args: {
    code: samplePython,
    language: 'python',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      show-line-numbers
      .highlightLines=${[3, 4]}
    ></bp-code-block>
  `,
};

export const NoWrap: Story = {
  args: {
    code: 'const reallyLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix);',
    language: 'typescript',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
    ></bp-code-block>
    <br />
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .wrapLines=${false}
    ></bp-code-block>
  `,
};

export const NoCopyButton: Story = {
  args: {
    code: 'npm install @krollins/blueprint',
    language: 'bash',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .showCopyButton=${false}
    ></bp-code-block>
  `,
};

export const NoHeader: Story = {
  args: {
    code: sampleBash,
    language: 'bash',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .showHeader=${false}
    ></bp-code-block>
  `,
};

export const Collapsible: Story = {
  args: {
    code: longCode,
    language: 'typescript',
    title: 'long-file.ts',
    maxLines: 10,
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .title=${args.title}
      .maxLines=${args.maxLines}
      show-line-numbers
    ></bp-code-block>
  `,
};

export const BashExample: Story = {
  args: {
    code: sampleBash,
    language: 'bash',
    title: 'install.sh',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .title=${args.title}
      show-line-numbers
    ></bp-code-block>
  `,
};

export const HTMLExample: Story = {
  args: {
    code: sampleHTML,
    language: 'html',
    title: 'index.html',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
      .title=${args.title}
      show-line-numbers
    ></bp-code-block>
  `,
};

export const MinimalOneLiner: Story = {
  args: {
    code: 'npm install @krollins/blueprint',
    language: 'bash',
  },
  render: (args) => html`
    <bp-code-block
      .code=${args.code}
      .language=${args.language}
    ></bp-code-block>
  `,
};

export const ErrorAdapter: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    title: 'error-fallback.ts',
  },
  render: (args) => {
    const errorAdapter = {
      highlight() {
        throw new Error('Adapter crashed!');
      },
    };
    return html`
      <bp-code-block
        .code=${args.code}
        .language=${args.language}
        .title=${args.title}
        .highlightAdapter=${errorAdapter}
        show-line-numbers
      ></bp-code-block>
    `;
  },
};
