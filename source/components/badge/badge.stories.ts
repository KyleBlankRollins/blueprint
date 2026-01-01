import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './badge.js';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'bp-badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'error', 'warning', 'info', 'neutral'],
      description: 'Visual variant of the badge',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the badge',
    },
    dot: {
      control: 'boolean',
      description: 'Whether to display as a dot indicator',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    dot: false,
  },
  render: (args) => html`
    <bp-badge .variant=${args.variant} .size=${args.size} ?dot=${args.dot}>
      New
    </bp-badge>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-badge variant="primary">Primary</bp-badge>
      <bp-badge variant="success">Success</bp-badge>
      <bp-badge variant="error">Error</bp-badge>
      <bp-badge variant="warning">Warning</bp-badge>
      <bp-badge variant="info">Info</bp-badge>
      <bp-badge variant="neutral">Neutral</bp-badge>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <bp-badge size="small">Small</bp-badge>
      <bp-badge size="medium">Medium</bp-badge>
      <bp-badge size="large">Large</bp-badge>
    </div>
  `,
};

export const CountBadges: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <bp-badge variant="primary" size="small">3</bp-badge>
      <bp-badge variant="error" size="small">99+</bp-badge>
      <bp-badge variant="success" size="medium">12</bp-badge>
    </div>
  `,
};

export const DotIndicators: Story = {
  render: () => html`
    <div style="display: flex; gap: 1.5rem; align-items: center;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <bp-badge variant="success" size="small" dot></bp-badge>
        <span>Online</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <bp-badge variant="warning" size="medium" dot></bp-badge>
        <span>Away</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <bp-badge variant="error" size="large" dot></bp-badge>
        <span>Offline</span>
      </div>
    </div>
  `,
};

export const WithContent: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;"
    >
      <bp-badge variant="primary">New Feature</bp-badge>
      <bp-badge variant="success">✓ Verified</bp-badge>
      <bp-badge variant="error">! Critical</bp-badge>
      <bp-badge variant="info">Beta</bp-badge>
    </div>
  `,
};
