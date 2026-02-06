import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './icon.js';

const meta: Meta = {
  title: 'Components/Icon',
  component: 'bp-icon',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        '',
        // Common actions
        'check',
        'cross',
        'create',
        'trash',
        'search',
        'settings',
        // Arrows
        'arrow-up',
        'arrow-down',
        'chevron-down',
        'chevron-up',
        // Status
        'info-circle',
        'warning-circle',
        'check-circle',
        // User
        'user',
        'user-circle',
        'heart',
        // Communication
        'mail',
        'message',
        'bell',
      ],
      description:
        'Name of the icon from the System UI Icons library (430+ icons available)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'],
      description: 'Size variant of the icon',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'muted'],
      description: 'Color variant of the icon',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    name: 'create',
    size: 'md',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

// Named icons from System UI Icons
export const NamedIcons: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
    >
      <div style="text-align: center;">
        <bp-icon name="create" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">create</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="check" size="lg" color="success"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">check</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="cross" size="lg" color="error"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">cross</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="heart" size="lg" color="error"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">heart</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="warning-circle" size="lg" color="warning"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">warning-circle</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="info-circle" size="lg" color="primary"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">info-circle</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="user-circle" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">user-circle</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="mail" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">mail</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="bell" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">bell</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="search" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">search</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="trash" size="lg" color="error"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">trash</div>
      </div>
      <div style="text-align: center;">
        <bp-icon name="settings" size="lg"></bp-icon>
        <div style="margin-top: 8px; font-size: 12px;">settings</div>
      </div>
    </div>
    <div
      style="margin-top: 16px; font-size: 14px; color: var(--bp-color-text-muted);"
    >
      430+ icons available from System UI Icons. Browse all at
      <a
        href="https://www.systemuicons.com/"
        target="_blank"
        style="color: var(--bp-color-primary);"
        >systemuicons.com</a
      >
    </div>
  `,
};

// Size variants
export const ExtraSmall: Story = {
  args: {
    name: 'create',
    size: 'xs',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Small: Story = {
  args: {
    name: 'create',
    size: 'sm',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Medium: Story = {
  args: {
    name: 'create',
    size: 'md',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Large: Story = {
  args: {
    name: 'create',
    size: 'lg',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const ExtraLarge: Story = {
  args: {
    name: 'create',
    size: 'xl',
    color: 'default',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

// Color variants
export const Primary: Story = {
  args: {
    name: 'info',
    size: 'md',
    color: 'primary',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Success: Story = {
  args: {
    name: 'check',
    size: 'md',
    color: 'success',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Warning: Story = {
  args: {
    name: 'warning',
    size: 'md',
    color: 'warning',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Error: Story = {
  args: {
    name: 'cross',
    size: 'md',
    color: 'error',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

export const Muted: Story = {
  args: {
    name: 'create',
    size: 'md',
    color: 'muted',
  },
  render: (args) => html`
    <bp-icon .name=${args.name} .size=${args.size} .color=${args.color}>
    </bp-icon>
  `,
};

// Accessibility example
export const WithAriaLabel: Story = {
  args: {
    name: 'warning',
    size: 'md',
    color: 'error',
    ariaLabel: 'Warning: This action cannot be undone',
  },
  render: (args) => html`
    <bp-icon
      .name=${args.name}
      .size=${args.size}
      .color=${args.color}
      aria-label=${args.ariaLabel}
    >
    </bp-icon>
  `,
};

// Combined examples
export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <bp-icon name="heart" size="xs" color="error"></bp-icon>
      <bp-icon name="heart" size="sm" color="error"></bp-icon>
      <bp-icon name="heart" size="md" color="error"></bp-icon>
      <bp-icon name="heart" size="lg" color="error"></bp-icon>
      <bp-icon name="heart" size="xl" color="error"></bp-icon>
      <bp-icon name="heart" size="2xl" color="error"></bp-icon>
      <bp-icon name="heart" size="3xl" color="error"></bp-icon>
      <bp-icon name="heart" size="4xl" color="error"></bp-icon>
    </div>
  `,
};

export const FullSize: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: flex-start;">
      <div style="text-align: center;">
        <div
          style="width: 48px; height: 48px; border: 2px dashed var(--bp-color-border); display: flex; align-items: center; justify-content: center;"
        >
          <bp-icon name="versions" size="full" color="primary"></bp-icon>
        </div>
        <div style="margin-top: 8px; font-size: 12px;">48x48 container</div>
      </div>
      <div style="text-align: center;">
        <div
          style="width: 64px; height: 64px; border: 2px dashed var(--bp-color-border); display: flex; align-items: center; justify-content: center;"
        >
          <bp-icon name="check-circle" size="full" color="success"></bp-icon>
        </div>
        <div style="margin-top: 8px; font-size: 12px;">64x64 container</div>
      </div>
      <div style="text-align: center;">
        <div
          style="width: 96px; height: 96px; border: 2px dashed var(--bp-color-border); display: flex; align-items: center; justify-content: center;"
        >
          <bp-icon name="heart" size="full" color="error"></bp-icon>
        </div>
        <div style="margin-top: 8px; font-size: 12px;">96x96 container</div>
      </div>
    </div>
    <div
      style="margin-top: 16px; font-size: 14px; color: var(--bp-color-text-muted);"
    >
      The 'full' size makes the icon fill 100% of its container's width and
      height.
    </div>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <bp-icon name="create" size="lg" color="default"></bp-icon>
      <bp-icon name="info" size="lg" color="primary"></bp-icon>
      <bp-icon name="check" size="lg" color="success"></bp-icon>
      <bp-icon name="warning" size="lg" color="warning"></bp-icon>
      <bp-icon name="cross" size="lg" color="error"></bp-icon>
      <bp-icon name="create" size="lg" color="muted"></bp-icon>
    </div>
  `,
};

// Custom SVG (slot fallback)
export const CustomSVG: Story = {
  render: () => html`
    <bp-icon size="lg" color="primary">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z"
        />
      </svg>
    </bp-icon>
  `,
};
