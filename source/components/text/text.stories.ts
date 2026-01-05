import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './text.js';

const meta: Meta = {
  title: 'Components/Text',
  component: 'bp-text',
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div'],
      description: 'The HTML element type to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      description: 'The size of the text',
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'The font weight',
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'success', 'warning', 'error'],
      description: 'The color variant',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    italic: {
      control: 'boolean',
      description: 'Whether the text is italic',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate with ellipsis',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    as: 'p',
    size: 'base',
    weight: 'normal',
    variant: 'default',
    align: 'left',
    italic: false,
    truncate: false,
  },
  render: (args) => html`
    <bp-text
      .as=${args.as}
      .size=${args.size}
      .weight=${args.weight}
      .variant=${args.variant}
      .align=${args.align}
      ?italic=${args.italic}
      ?truncate=${args.truncate}
    >
      The quick brown fox jumps over the lazy dog
    </bp-text>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text size="xs">Extra small text (xs)</bp-text>
      <bp-text size="sm">Small text (sm)</bp-text>
      <bp-text size="base">Base text (base)</bp-text>
      <bp-text size="lg">Large text (lg)</bp-text>
      <bp-text size="xl">Extra large text (xl)</bp-text>
    </div>
  `,
};

export const AllWeights: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text weight="light">Light weight text</bp-text>
      <bp-text weight="normal">Normal weight text</bp-text>
      <bp-text weight="medium">Medium weight text</bp-text>
      <bp-text weight="semibold">Semibold weight text</bp-text>
      <bp-text weight="bold">Bold weight text</bp-text>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text variant="default">Default color text</bp-text>
      <bp-text variant="muted">Muted color text</bp-text>
      <bp-text variant="primary">Primary color text</bp-text>
      <bp-text variant="success">Success color text</bp-text>
      <bp-text variant="warning">Warning color text</bp-text>
      <bp-text variant="error">Error color text</bp-text>
    </div>
  `,
};

export const Alignment: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text align="left">
        Left aligned text. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </bp-text>
      <bp-text align="center">
        Center aligned text. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </bp-text>
      <bp-text align="right">
        Right aligned text. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </bp-text>
      <bp-text align="justify">
        Justified text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </bp-text>
    </div>
  `,
};

export const ItalicAndTruncate: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text ?italic=${true}>This text is italic</bp-text>

      <div style="max-width: 300px;">
        <bp-text ?truncate=${true}>
          This is a very long text that will be truncated with an ellipsis when
          it overflows the container width
        </bp-text>
      </div>
    </div>
  `,
};

export const ElementTypes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text as="p">Rendered as a paragraph (p)</bp-text>
      <bp-text as="span">Rendered as an inline span</bp-text>
      <bp-text as="div">Rendered as a div block</bp-text>
    </div>
  `,
};

export const InlineText: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <bp-text as="p">
        This paragraph contains
        <bp-text as="span" variant="primary" weight="semibold">
          inline primary text</bp-text
        >, <bp-text as="span" variant="error">inline error text</bp-text>, and
        <bp-text as="span" variant="muted" ?italic=${true}>
          inline muted italic text</bp-text
        >
        without breaking the text flow. This demonstrates the power of the
        <bp-text as="span" weight="bold">as="span"</bp-text> property for inline
        styling.
      </bp-text>
    </div>
  `,
};

export const TextTransform: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text transform="uppercase">Uppercase text</bp-text>
      <bp-text transform="lowercase">LOWERCASE TEXT</bp-text>
      <bp-text transform="capitalize">capitalize each word</bp-text>
      <bp-text transform="none">Normal text (no transformation)</bp-text>
    </div>
  `,
};

export const LetterSpacing: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text tracking="tighter">Tighter letter spacing</bp-text>
      <bp-text tracking="tight">Tight letter spacing</bp-text>
      <bp-text tracking="normal">Normal letter spacing</bp-text>
      <bp-text tracking="wide">Wide letter spacing</bp-text>
      <bp-text tracking="wider">Wider letter spacing</bp-text>
    </div>
  `,
};

export const LineHeightVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <bp-text size="sm" variant="muted">Line height: none (1.0)</bp-text>
        <bp-text line-height="none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </bp-text>
      </div>
      <div>
        <bp-text size="sm" variant="muted">Line height: tight (1.25)</bp-text>
        <bp-text line-height="tight">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </bp-text>
      </div>
      <div>
        <bp-text size="sm" variant="muted">Line height: normal (1.5)</bp-text>
        <bp-text line-height="normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </bp-text>
      </div>
      <div>
        <bp-text size="sm" variant="muted">
          Line height: relaxed (1.625)
        </bp-text>
        <bp-text line-height="relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </bp-text>
      </div>
    </div>
  `,
};

export const MultiLineClamp: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="max-width: 400px;">
        <bp-text size="sm" variant="muted">Clamp to 2 lines:</bp-text>
        <bp-text .clamp=${2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </bp-text>
      </div>
      <div style="max-width: 400px;">
        <bp-text size="sm" variant="muted">Clamp to 3 lines:</bp-text>
        <bp-text .clamp=${3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </bp-text>
      </div>
    </div>
  `,
};

export const Combinations: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-text size="lg" weight="bold" variant="primary">
        Large, bold, primary text
      </bp-text>

      <bp-text size="sm" weight="medium" variant="muted" ?italic=${true}>
        Small, medium, muted, italic text
      </bp-text>

      <bp-text size="xl" weight="semibold" variant="success">
        Extra large, semibold, success text
      </bp-text>

      <bp-text size="base" weight="light" variant="error">
        Base size, light weight, error text
      </bp-text>
    </div>
  `,
};

export const RealWorldExample: Story = {
  render: () => html`
    <article style="max-width: 600px;">
      <bp-text size="lg" weight="semibold" variant="default">
        Typography in Web Design
      </bp-text>

      <bp-text as="p" size="base" weight="normal" variant="default">
        Typography is the art and technique of arranging type to make written
        language legible, readable, and appealing when displayed. The
        arrangement of type involves selecting typefaces, point sizes, line
        lengths, line-spacing, and letter-spacing.
      </bp-text>

      <bp-text as="p" size="sm" weight="medium" variant="muted">
        Published on January 4, 2026
      </bp-text>

      <bp-text as="p" size="base" weight="normal" variant="default">
        Good typography establishes a strong visual hierarchy, provides a
        graphic balance to the website, and sets the product's overall tone.
        Typography should guide and inform users, optimize readability and
        accessibility, and ensure an excellent user experience.
      </bp-text>

      <bp-text size="sm" weight="semibold" variant="primary">
        Learn more about typography →
      </bp-text>
    </article>
  `,
};
