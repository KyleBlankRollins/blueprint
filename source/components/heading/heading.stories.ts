import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './heading.js';

const meta: Meta = {
  title: 'Components/Heading',
  component: 'bp-heading',
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'The semantic heading level (h1-h6)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'The visual size of the heading',
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'The font weight of the heading',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    level: 1,
    size: '4xl',
    weight: 'bold',
  },
  render: (args) => html`
    <bp-heading .level=${args.level} .size=${args.size} .weight=${args.weight}>
      The quick brown fox jumps over the lazy dog
    </bp-heading>
  `,
};

export const AllLevels: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-heading .level=${1}>Heading Level 1 (h1)</bp-heading>
      <bp-heading .level=${2} size="3xl">Heading Level 2 (h2)</bp-heading>
      <bp-heading .level=${3} size="2xl">Heading Level 3 (h3)</bp-heading>
      <bp-heading .level=${4} size="xl">Heading Level 4 (h4)</bp-heading>
      <bp-heading .level=${5} size="lg">Heading Level 5 (h5)</bp-heading>
      <bp-heading .level=${6} size="md">Heading Level 6 (h6)</bp-heading>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-heading size="4xl">4xl - The quick brown fox</bp-heading>
      <bp-heading size="3xl">3xl - The quick brown fox</bp-heading>
      <bp-heading size="2xl">2xl - The quick brown fox</bp-heading>
      <bp-heading size="xl">xl - The quick brown fox</bp-heading>
      <bp-heading size="lg">lg - The quick brown fox</bp-heading>
      <bp-heading size="md">md - The quick brown fox</bp-heading>
      <bp-heading size="sm">sm - The quick brown fox</bp-heading>
      <bp-heading size="xs">xs - The quick brown fox</bp-heading>
    </div>
  `,
};

export const AllWeights: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-heading weight="light">Light Weight</bp-heading>
      <bp-heading weight="normal">Normal Weight</bp-heading>
      <bp-heading weight="medium">Medium Weight</bp-heading>
      <bp-heading weight="semibold">Semibold Weight</bp-heading>
      <bp-heading weight="bold">Bold Weight</bp-heading>
    </div>
  `,
};

export const SemanticVsVisual: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
          Semantic h1, but visually small for special layouts:
        </p>
        <bp-heading .level=${1} size="sm" weight="medium">
          This is an h1 but looks small
        </bp-heading>
      </div>

      <div>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
          Semantic h6, but visually large for emphasis:
        </p>
        <bp-heading .level=${6} size="3xl" weight="bold">
          This is an h6 but looks huge
        </bp-heading>
      </div>
    </div>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-heading style="--bp-heading-color: #059669;" .level=${2} size="2xl">
        Custom green color
      </bp-heading>

      <bp-heading style="--bp-heading-color: #dc2626;" .level=${2} size="2xl">
        Custom red color
      </bp-heading>

      <bp-heading
        style="--bp-heading-font-family: 'Georgia', serif;"
        .level=${2}
        size="2xl"
      >
        Custom serif font
      </bp-heading>
    </div>
  `,
};

export const VisualHierarchy: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <bp-heading size="4xl" weight="bold">Display Text</bp-heading>
      <p style="font-size: 18px; color: #666; margin: 12px 0 32px;">
        Large headings create strong visual hierarchy and draw attention.
      </p>

      <bp-heading size="2xl" weight="semibold">Section Title</bp-heading>
      <p style="margin: 8px 0 24px;">
        Medium headings organize content into clear sections.
      </p>

      <bp-heading size="lg" weight="medium">Subsection</bp-heading>
      <p style="margin: 8px 0;">
        Smaller headings create subtle subdivisions within sections.
      </p>
    </div>
  `,
};

export const RealWorldExample: Story = {
  render: () => html`
    <article style="max-width: 800px;">
      <bp-heading .level=${1} size="4xl" weight="bold">
        Understanding Web Components
      </bp-heading>

      <p style="margin: 16px 0; line-height: 1.6;">
        Web Components are a suite of different technologies allowing you to
        create reusable custom elements with their functionality encapsulated
        away from the rest of your code.
      </p>

      <bp-heading .level=${2} size="2xl" weight="semibold">
        What are Web Components?
      </bp-heading>

      <p style="margin: 16px 0; line-height: 1.6;">
        Web Components consist of three main technologies: Custom Elements,
        Shadow DOM, and HTML Templates.
      </p>

      <bp-heading .level=${3} size="xl" weight="medium">
        Custom Elements
      </bp-heading>

      <p style="margin: 16px 0; line-height: 1.6;">
        Custom Elements allow you to define new HTML elements and their
        behavior.
      </p>

      <bp-heading .level=${3} size="xl" weight="medium">
        Shadow DOM
      </bp-heading>

      <p style="margin: 16px 0; line-height: 1.6;">
        Shadow DOM provides encapsulation for markup and styles.
      </p>
    </article>
  `,
};
