import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './avatar.js';

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'bp-avatar',
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL for the avatar',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the avatar image (accessibility)',
    },
    initials: {
      control: 'text',
      description: 'Initials to display when no image is provided',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Shape of the avatar',
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'busy', 'away'],
      description: 'Status indicator for the avatar',
    },
    clickable: {
      control: 'boolean',
      description: 'Makes the avatar interactive with hover/focus states',
    },
    name: {
      control: 'text',
      description: 'Name for tooltip display on hover',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    src: '',
    alt: '',
    initials: 'JD',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .src=${args.src}
      .alt=${args.alt}
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    alt: 'User avatar',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .src=${args.src}
      .alt=${args.alt}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const WithInitials: Story = {
  args: {
    initials: 'AB',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const Fallback: Story = {
  args: {
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar .size=${args.size} .shape=${args.shape}></bp-avatar>
  `,
};

export const ExtraSmall: Story = {
  args: {
    initials: 'XS',
    size: 'xs',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const Small: Story = {
  args: {
    initials: 'SM',
    size: 'sm',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const Medium: Story = {
  args: {
    initials: 'MD',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const Large: Story = {
  args: {
    initials: 'LG',
    size: 'lg',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const ExtraLarge: Story = {
  args: {
    initials: 'XL',
    size: 'xl',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const CircleShape: Story = {
  args: {
    initials: 'CR',
    size: 'md',
    shape: 'circle',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const SquareShape: Story = {
  args: {
    initials: 'SQ',
    size: 'md',
    shape: 'square',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .shape=${args.shape}
    ></bp-avatar>
  `,
};

export const WithStatus: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    status: 'online',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .status=${args.status}
    ></bp-avatar>
  `,
};

export const Clickable: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    clickable: true,
    name: 'John Doe',
  },
  render: (args) => html`
    <bp-avatar
      .initials=${args.initials}
      .size=${args.size}
      .clickable=${args.clickable}
      .name=${args.name}
    ></bp-avatar>
  `,
};

export const AllStatuses: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="text-align: center;">
        <bp-avatar initials="ON" status="online"></bp-avatar>
        <div style="margin-top: 8px; font-size: 12px;">Online</div>
      </div>
      <div style="text-align: center;">
        <bp-avatar initials="OF" status="offline"></bp-avatar>
        <div style="margin-top: 8px; font-size: 12px;">Offline</div>
      </div>
      <div style="text-align: center;">
        <bp-avatar initials="BS" status="busy"></bp-avatar>
        <div style="margin-top: 8px; font-size: 12px;">Busy</div>
      </div>
      <div style="text-align: center;">
        <bp-avatar initials="AW" status="away"></bp-avatar>
        <div style="margin-top: 8px; font-size: 12px;">Away</div>
      </div>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
    >
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Extra Small</p>
        <bp-avatar size="xs" initials="XS"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Small</p>
        <bp-avatar size="sm" initials="SM"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Medium</p>
        <bp-avatar size="md" initials="MD"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Large</p>
        <bp-avatar size="lg" initials="LG"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Extra Large</p>
        <bp-avatar size="xl" initials="XL"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Circle</p>
        <bp-avatar shape="circle" initials="CR"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Square</p>
        <bp-avatar shape="square" initials="SQ"></bp-avatar>
      </div>
      <div
        style="display: flex; flex-direction: column; gap: 12px; align-items: center;"
      >
        <p style="margin: 0; font-size: 12px;">Image</p>
        <bp-avatar
          src="https://i.pravatar.cc/150?img=5"
          alt="Avatar"
        ></bp-avatar>
      </div>
    </div>
  `,
};
