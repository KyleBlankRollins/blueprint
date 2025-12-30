import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './button.js';

const meta: Meta = {
  title: 'Components/Button',
  component: 'bp-button',
  tags: ['autodocs'],
  argTypes: {
    someProp: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    someProp: 'Example',
  },
  render: (args) => html`
    <bp-button .someProp=${args.someProp}>
      Default content
    </bp-button>
  `,
};
