import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './radio-group.js';
import '../radio/radio.js';

const meta: Meta = {
  title: 'Components/RadioGroup',
  component: 'bp-radio-group',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Visible group label' },
    description: {
      control: 'text',
      description: 'Helper text linked to the group',
    },
    errorMessage: { control: 'text', description: 'Error text' },
    name: { control: 'text', description: 'Name submitted with the form' },
    value: { control: 'text', description: 'Value of the selected radio' },
    required: { control: 'boolean', description: 'Requires a selection' },
    disabled: { control: 'boolean', description: 'Disables every radio' },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Stack radios or lay them out in a row',
    },
  },
  args: {
    label: 'Delivery speed',
    description: '',
    errorMessage: '',
    name: 'delivery',
    value: 'standard',
    required: false,
    disabled: false,
    orientation: 'vertical',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <bp-radio-group
      .label=${args.label}
      .description=${args.description}
      .errorMessage=${args.errorMessage}
      name=${args.name}
      .value=${args.value}
      ?required=${args.required}
      ?disabled=${args.disabled}
      orientation=${args.orientation}
    >
      <bp-radio value="standard">Standard (3-5 days)</bp-radio>
      <bp-radio value="express">Express (1-2 days)</bp-radio>
      <bp-radio value="overnight">Overnight</bp-radio>
    </bp-radio-group>
  `,
};

export const Horizontal: Story = {
  render: () => html`
    <bp-radio-group
      label="Size"
      name="size"
      value="md"
      orientation="horizontal"
    >
      <bp-radio value="sm">Small</bp-radio>
      <bp-radio value="md">Medium</bp-radio>
      <bp-radio value="lg">Large</bp-radio>
    </bp-radio-group>
  `,
};

export const RequiredWithError: Story = {
  render: () => html`
    <bp-radio-group
      label="Plan"
      name="plan"
      required
      errorMessage="Choose a plan to continue."
    >
      <bp-radio value="free">Free</bp-radio>
      <bp-radio value="team">Team</bp-radio>
      <bp-radio value="enterprise" disabled
        >Enterprise (contact sales)</bp-radio
      >
    </bp-radio-group>
  `,
};
