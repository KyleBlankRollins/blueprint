import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './link.js';

const meta: Meta = {
  title: 'Components/Link',
  component: 'bp-link',
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'The URL the link points to',
    },
    target: {
      control: 'text',
      description: 'Where to display the linked URL (e.g., _blank for new tab)',
    },
    rel: {
      control: 'text',
      description: 'Relationship of the linked URL',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'muted'],
      description: 'Visual variant of the link',
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
      description: 'Underline style for the link',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the link text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the link is disabled',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    variant: 'default',
    underline: 'hover',
    size: 'md',
    disabled: false,
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .target=${args.target}
      .rel=${args.rel}
      .variant=${args.variant}
      .underline=${args.underline}
      .size=${args.size}
      ?disabled=${args.disabled}
    >
      Default Link
    </bp-link>
  `,
};

export const Primary: Story = {
  args: {
    href: 'https://example.com',
    variant: 'primary',
    underline: 'hover',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      Primary Link
    </bp-link>
  `,
};

export const Muted: Story = {
  args: {
    href: 'https://example.com',
    variant: 'muted',
    underline: 'hover',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      Muted Link
    </bp-link>
  `,
};

export const AlwaysUnderline: Story = {
  args: {
    href: 'https://example.com',
    variant: 'default',
    underline: 'always',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      Always Underlined Link
    </bp-link>
  `,
};

export const HoverUnderline: Story = {
  args: {
    href: 'https://example.com',
    variant: 'default',
    underline: 'hover',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      Hover Underline Link
    </bp-link>
  `,
};

export const NoUnderline: Story = {
  args: {
    href: 'https://example.com',
    variant: 'default',
    underline: 'none',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      No Underline Link
    </bp-link>
  `,
};

export const Disabled: Story = {
  args: {
    href: 'https://example.com',
    variant: 'default',
    underline: 'hover',
    disabled: true,
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .variant=${args.variant}
      .underline=${args.underline}
      ?disabled=${args.disabled}
    >
      Disabled Link
    </bp-link>
  `,
};

export const ExternalLink: Story = {
  args: {
    href: 'https://github.com',
    target: '_blank',
    variant: 'primary',
    underline: 'hover',
  },
  render: (args) => html`
    <bp-link
      .href=${args.href}
      .target=${args.target}
      .variant=${args.variant}
      .underline=${args.underline}
    >
      External Link (opens in new tab)
    </bp-link>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <bp-link href="https://example.com" variant="default"
        >Default Link</bp-link
      >
      <bp-link href="https://example.com" variant="primary"
        >Primary Link</bp-link
      >
      <bp-link href="https://example.com" variant="muted">Muted Link</bp-link>
    </div>
  `,
};

export const AllUnderlineStyles: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <bp-link href="https://example.com" underline="always"
        >Always Underline</bp-link
      >
      <bp-link href="https://example.com" underline="hover"
        >Hover Underline</bp-link
      >
      <bp-link href="https://example.com" underline="none"
        >No Underline</bp-link
      >
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;"
    >
      <bp-link href="https://example.com" size="sm">Small Link</bp-link>
      <bp-link href="https://example.com" size="md"
        >Medium Link (Default)</bp-link
      >
      <bp-link href="https://example.com" size="lg">Large Link</bp-link>
    </div>
  `,
};
