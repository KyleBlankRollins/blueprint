import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './button.js';

const meta: Meta = {
  title: 'Components/Button',
  component: 'bp-button',
  tags: ['autodocs'],
  argTypes: {
    variant: { 
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant of the button',
    },
    size: { 
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    disabled: { 
      control: 'boolean',
      description: 'Whether the button is disabled',
    }
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false
  },
  render: (args) => html`
    <bp-button .variant=${args.variant} .size=${args.size} ?disabled=${args.disabled}>
      Button Content
    </bp-button>
  `,
};

export const Primary: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: 'primary',
  },
};
export const Secondary: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: 'secondary',
  },
};
export const Small: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'small',
  },
};
export const Medium: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'medium',
  },
};
export const Large: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'large',
  },
};
export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};