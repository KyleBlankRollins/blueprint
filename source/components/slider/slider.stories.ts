import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './slider.js';

const meta: Meta = {
  title: 'Components/Slider',
  component: 'bp-slider',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current value of the slider',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form association',
    },
    label: {
      control: 'text',
      description: 'Label text for the slider',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the current value',
    },
    showTicks: {
      control: 'boolean',
      description: 'Whether to show tick marks at step intervals',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    name: '',
    label: '',
    disabled: false,
    size: 'md',
    showValue: false,
    showTicks: false,
  },
  render: (args) => html`
    <bp-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      .name=${args.name}
      .label=${args.label}
      ?disabled=${args.disabled}
      .size=${args.size}
      ?showValue=${args.showValue}
      ?showTicks=${args.showTicks}
    ></bp-slider>
  `,
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Volume',
    showValue: true,
    value: 75,
  },
  render: Default.render,
};

export const WithTicks: Story = {
  args: {
    ...Default.args,
    label: 'Progress',
    showValue: true,
    showTicks: true,
    step: 25,
    value: 50,
  },
  render: Default.render,
};

export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'sm',
    label: 'Small Slider',
    showValue: true,
  },
  render: Default.render,
};

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    label: 'Large Slider',
    showValue: true,
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    label: 'Disabled Slider',
    showValue: true,
    value: 30,
  },
  render: Default.render,
};

export const CustomRange: Story = {
  args: {
    ...Default.args,
    min: 100,
    max: 500,
    step: 50,
    value: 250,
    label: 'Price Range',
    showValue: true,
    showTicks: true,
  },
  render: Default.render,
};
