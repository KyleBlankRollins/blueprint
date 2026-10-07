import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './stack.js';
import '../button/button.js';
import '../input/input.js';
import '../tag/tag.js';

const GAPS = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const meta: Meta = {
  title: 'Components/Stack',
  component: 'bp-stack',
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Main axis of the stack',
    },
    gap: {
      control: 'select',
      options: GAPS,
      description: 'Space between items, from the semantic spacing scale',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Cross-axis alignment',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis distribution',
    },
    wrap: { control: 'boolean', description: 'Allow items to wrap' },
  },
};

export default meta;
type Story = StoryObj;

const box = (label: string) => html`
  <div
    style="padding: var(--bp-spacing-sm); background: var(--bp-color-surface-subdued); border: var(--bp-border-width) solid var(--bp-color-border); border-radius: var(--bp-border-radius);"
  >
    ${label}
  </div>
`;

export const Default: Story = {
  args: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  render: (args) => html`
    <bp-stack
      direction=${args.direction}
      gap=${args.gap}
      align=${args.align}
      justify=${args.justify}
      ?wrap=${args.wrap}
    >
      ${box('One')} ${box('Two')} ${box('Three')}
    </bp-stack>
  `,
};

export const FormFields: Story = {
  render: () => html`
    <bp-stack gap="md" style="max-width: 24rem;">
      <bp-input label="Name"></bp-input>
      <bp-input label="Email" type="email"></bp-input>
      <bp-stack direction="horizontal" gap="xs" justify="end">
        <bp-button variant="secondary">Cancel</bp-button>
        <bp-button>Save</bp-button>
      </bp-stack>
    </bp-stack>
  `,
};

export const WrappingTags: Story = {
  render: () => html`
    <bp-stack direction="horizontal" gap="xs" wrap style="max-width: 20rem;">
      ${[
        'Design',
        'Tokens',
        'Accessibility',
        'Theming',
        'Lit',
        'Forms',
        'Layout',
      ].map((t) => html`<bp-tag>${t}</bp-tag>`)}
    </bp-stack>
  `,
};

export const Gaps: Story = {
  render: () => html`
    <bp-stack gap="lg">
      ${GAPS.map(
        (g) => html`
          <div>
            <code>gap="${g}"</code>
            <bp-stack direction="horizontal" gap=${g}>
              ${box('A')} ${box('B')} ${box('C')}
            </bp-stack>
          </div>
        `
      )}
    </bp-stack>
  `,
};
