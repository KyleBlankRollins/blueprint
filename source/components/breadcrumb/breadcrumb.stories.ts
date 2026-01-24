import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './breadcrumb.js';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'bp-breadcrumb',
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'text',
      description: 'items',
    },
    size: {
      control: 'text',
      description: 'size',
    },
    separator: {
      control: 'text',
      description: 'separator',
    },
    ariaLabel: {
      control: 'text',
      description: 'ariaLabel',
    },
    maxItems: {
      control: 'number',
      description: 'maxItems',
    },
    href: {
      control: 'text',
      description: 'href',
    },
    current: {
      control: 'boolean',
      description: 'current',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    items: '',
    size: '',
    separator: '',
    ariaLabel: '',
    maxItems: 0,
    href: '',
    current: false,
  },
  render: (args) => html`
    <bp-breadcrumb
      .items=${args.items}
      .size=${args.size}
      .separator=${args.separator}
      .ariaLabel=${args.ariaLabel}
      .maxItems=${args.maxItems}
      .href=${args.href}
      ?current=${args.current}
    >
      Button Content
    </bp-breadcrumb>
  `,
};
