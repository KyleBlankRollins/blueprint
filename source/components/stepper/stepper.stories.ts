import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './stepper.js';

const meta: Meta = {
  title: 'Components/Stepper',
  component: 'bp-stepper',
  tags: ['autodocs'],
  argTypes: {
    steps: {
      control: 'text',
      description: 'steps',
    },
    size: {
      control: 'text',
      description: 'size',
    },
    linear: {
      control: 'boolean',
      description: 'linear',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled',
    },
    clickable: {
      control: 'boolean',
      description: 'clickable',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    steps: '',
    size: '',
    linear: false,
    disabled: false,
    clickable: false,
  },
  render: (args) => html`
    <bp-stepper
      .steps=${args.steps}
      .size=${args.size}
      ?linear=${args.linear}
      ?disabled=${args.disabled}
      ?clickable=${args.clickable}
    >
      Button Content
    </bp-stepper>
  `,
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};
