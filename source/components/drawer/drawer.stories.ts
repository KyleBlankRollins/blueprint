import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './drawer.js';

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'bp-drawer',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'open',
    },
    placement: {
      control: 'text',
      description: 'placement',
    },
    size: {
      control: 'text',
      description: 'size',
    },
    showClose: {
      control: 'boolean',
      description: 'showClose',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'closeOnBackdrop',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'closeOnEscape',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'showBackdrop',
    },
    label: {
      control: 'text',
      description: 'label',
    },
    inline: {
      control: 'boolean',
      description: 'inline',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    open: false,
    placement: '',
    size: '',
    showClose: false,
    closeOnBackdrop: false,
    closeOnEscape: false,
    showBackdrop: false,
    label: '',
    inline: false,
  },
  render: (args) => html`
    <bp-drawer
      ?open=${args.open}
      .placement=${args.placement}
      .size=${args.size}
      ?showClose=${args.showClose}
      ?closeOnBackdrop=${args.closeOnBackdrop}
      ?closeOnEscape=${args.closeOnEscape}
      ?showBackdrop=${args.showBackdrop}
      .label=${args.label}
      ?inline=${args.inline}
    >
      Button Content
    </bp-drawer>
  `,
};
