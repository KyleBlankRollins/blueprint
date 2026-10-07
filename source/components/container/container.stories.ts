import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './container.js';
import '../stack/stack.js';

const meta: Meta = {
  title: 'Components/Container',
  component: 'bp-container',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Maximum width, from the breakpoint scale',
    },
    gutter: {
      control: 'select',
      options: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Inline padding',
    },
  },
};

export default meta;
type Story = StoryObj;

const content = (label: string) => html`
  <div
    style="padding: var(--bp-spacing-md); background: var(--bp-color-surface-subdued); border: var(--bp-border-width) solid var(--bp-color-border); border-radius: var(--bp-border-radius);"
  >
    ${label}
  </div>
`;

export const Default: Story = {
  args: { size: 'lg', gutter: 'md' },
  render: (args) => html`
    <bp-container size=${args.size} gutter=${args.gutter}>
      ${content(`size="${args.size}" gutter="${args.gutter}"`)}
    </bp-container>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <bp-stack gap="sm">
      ${['sm', 'md', 'lg', 'xl', '2xl', 'full'].map(
        (s) =>
          html`<bp-container size=${s}>${content(`size="${s}"`)}</bp-container>`
      )}
    </bp-stack>
  `,
};
