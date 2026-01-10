import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tag.js';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bp-tag',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outlined'],
      description: 'Visual variant of the tag',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the tag',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'error', 'warning', 'info', 'neutral'],
      description: 'Color scheme of the tag',
    },
    removable: {
      control: 'boolean',
      description: 'Whether the tag can be removed',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tag is disabled',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'solid',
    size: 'medium',
    color: 'neutral',
    removable: false,
    disabled: false,
  },
  render: (args) => html`
    <bp-tag
      .variant=${args.variant}
      .size=${args.size}
      .color=${args.color}
      ?removable=${args.removable}
      ?disabled=${args.disabled}
    >
      Design
    </bp-tag>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-tag color="primary">Primary</bp-tag>
      <bp-tag color="success">Success</bp-tag>
      <bp-tag color="error">Error</bp-tag>
      <bp-tag color="warning">Warning</bp-tag>
      <bp-tag color="info">Info</bp-tag>
      <bp-tag color="neutral">Neutral</bp-tag>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;"
    >
      <bp-tag size="small">Small</bp-tag>
      <bp-tag size="medium">Medium</bp-tag>
      <bp-tag size="large">Large</bp-tag>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; align-items: center;">
      <bp-tag variant="solid" color="primary">Solid</bp-tag>
      <bp-tag variant="outlined" color="primary">Outlined</bp-tag>
    </div>
  `,
};

export const Removable: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-tag color="primary" removable>TypeScript</bp-tag>
      <bp-tag color="success" removable>React</bp-tag>
      <bp-tag color="info" removable>Web Components</bp-tag>
      <bp-tag color="warning" removable>JavaScript</bp-tag>
      <bp-tag color="error" removable>Bug</bp-tag>
    </div>
  `,
};

export const RemovableOutlined: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-tag variant="outlined" color="primary" removable>TypeScript</bp-tag>
      <bp-tag variant="outlined" color="success" removable>React</bp-tag>
      <bp-tag variant="outlined" color="info" removable>Web Components</bp-tag>
      <bp-tag variant="outlined" color="warning" removable>JavaScript</bp-tag>
      <bp-tag variant="outlined" color="error" removable>Bug</bp-tag>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-tag disabled>Disabled</bp-tag>
      <bp-tag color="primary" disabled>Disabled Primary</bp-tag>
      <bp-tag color="success" removable disabled>Disabled Removable</bp-tag>
      <bp-tag variant="outlined" color="error" disabled
        >Disabled Outlined</bp-tag
      >
    </div>
  `,
};

export const MixedSizes: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-tag size="small" color="primary" removable>Small Tag</bp-tag>
      <bp-tag size="medium" color="success" removable>Medium Tag</bp-tag>
      <bp-tag size="large" color="info" removable>Large Tag</bp-tag>
    </div>
  `,
};

export const TagList: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; max-width: 600px;">
      <bp-tag color="primary" removable>Frontend</bp-tag>
      <bp-tag color="success" removable>Approved</bp-tag>
      <bp-tag color="info" removable>Documentation</bp-tag>
      <bp-tag color="neutral" removable>In Progress</bp-tag>
      <bp-tag color="warning" removable>Review Needed</bp-tag>
      <bp-tag color="error" removable>Critical</bp-tag>
      <bp-tag color="primary" removable>TypeScript</bp-tag>
      <bp-tag color="success" removable>Test Coverage</bp-tag>
      <bp-tag color="info" removable>UI/UX</bp-tag>
      <bp-tag color="neutral" removable>Backend</bp-tag>
    </div>
  `,
};

export const OutlinedTagList: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; max-width: 600px;">
      <bp-tag variant="outlined" color="primary" removable>Frontend</bp-tag>
      <bp-tag variant="outlined" color="success" removable>Approved</bp-tag>
      <bp-tag variant="outlined" color="info" removable>Documentation</bp-tag>
      <bp-tag variant="outlined" color="neutral" removable>In Progress</bp-tag>
      <bp-tag variant="outlined" color="warning" removable
        >Review Needed</bp-tag
      >
      <bp-tag variant="outlined" color="error" removable>Critical</bp-tag>
      <bp-tag variant="outlined" color="primary" removable>TypeScript</bp-tag>
      <bp-tag variant="outlined" color="success" removable
        >Test Coverage</bp-tag
      >
      <bp-tag variant="outlined" color="info" removable>UI/UX</bp-tag>
      <bp-tag variant="outlined" color="neutral" removable>Backend</bp-tag>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => {
    const handleRemove = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('Tag removed:', customEvent.detail);
    };

    return html`
      <div
        style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;"
      >
        <bp-tag color="primary" removable @bp-remove=${handleRemove}>
          Click to remove
        </bp-tag>
        <bp-tag color="success" removable @bp-remove=${handleRemove}>
          Try Delete key
        </bp-tag>
        <bp-tag color="error" removable @bp-remove=${handleRemove}>
          Or Backspace
        </bp-tag>
      </div>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
        Open the console to see removal events
      </p>
    `;
  },
};
