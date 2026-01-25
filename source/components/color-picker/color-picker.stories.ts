import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './color-picker.js';

const meta: Meta = {
  title: 'Components/ColorPicker',
  component: 'bp-color-picker',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'value',
    },
    format: {
      control: 'text',
      description: 'format',
    },
    alpha: {
      control: 'boolean',
      description: 'alpha',
    },
    swatches: {
      control: 'text',
      description: 'swatches',
    },
    inline: {
      control: 'boolean',
      description: 'inline',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'readonly',
    },
    size: {
      control: 'text',
      description: 'size',
    },
    label: {
      control: 'text',
      description: 'label',
    },
    name: {
      control: 'text',
      description: 'name',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: '',
    format: '',
    alpha: false,
    swatches: '',
    inline: false,
    disabled: false,
    readonly: false,
    size: '',
    label: '',
    name: '',
    placeholder: '',
  },
  render: (args) => html`
    <bp-color-picker
      .value=${args.value}
      .format=${args.format}
      ?alpha=${args.alpha}
      .swatches=${args.swatches}
      ?inline=${args.inline}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      .size=${args.size}
      .label=${args.label}
      .name=${args.name}
      .placeholder=${args.placeholder}
    >
      Button Content
    </bp-color-picker>
  `,
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};
