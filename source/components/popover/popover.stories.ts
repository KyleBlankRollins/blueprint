import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './popover.js';

const meta: Meta = {
  title: 'Components/Popover',
  component: 'bp-popover',
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
    trigger: {
      control: 'text',
      description: 'trigger',
    },
    arrow: {
      control: 'boolean',
      description: 'arrow',
    },
    showClose: {
      control: 'boolean',
      description: 'showClose',
    },
    distance: {
      control: 'number',
      description: 'distance',
    },
    showDelay: {
      control: 'number',
      description: 'showDelay',
    },
    hideDelay: {
      control: 'number',
      description: 'hideDelay',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled',
    },
    label: {
      control: 'text',
      description: 'label',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    open: false,
    placement: '',
    trigger: '',
    arrow: false,
    showClose: false,
    distance: 0,
    showDelay: 0,
    hideDelay: 0,
    disabled: false,
    label: '',
  },
  render: (args) => html`
    <bp-popover
      ?open=${args.open}
      .placement=${args.placement}
      .trigger=${args.trigger}
      ?arrow=${args.arrow}
      ?showClose=${args.showClose}
      .distance=${args.distance}
      .showDelay=${args.showDelay}
      .hideDelay=${args.hideDelay}
      ?disabled=${args.disabled}
      .label=${args.label}
    >
      Button Content
    </bp-popover>
  `,
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};
