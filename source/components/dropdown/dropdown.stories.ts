import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './dropdown.js';
import '../menu/menu.js';
import '../button/button.js';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'bp-dropdown',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dropdown is open',
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'right',
      ],
      description: 'Placement of the dropdown panel relative to the trigger',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Whether the dropdown closes when clicking outside',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether the dropdown closes on Escape key',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether the dropdown closes when an item is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
    },
    distance: {
      control: 'number',
      description: 'Distance between trigger and panel in pixels',
    },
    arrow: {
      control: 'boolean',
      description: 'Whether to show an arrow pointing to the trigger',
    },
    panelRole: {
      control: 'select',
      options: ['menu', 'dialog', 'listbox'],
      description: 'ARIA role for the dropdown panel',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    open: false,
    placement: 'bottom-start',
    closeOnClickOutside: true,
    closeOnEscape: true,
    closeOnSelect: true,
    disabled: false,
    distance: 4,
    arrow: false,
    panelRole: 'menu',
  },
  render: (args) => html`
    <div style="padding: 100px;">
      <bp-dropdown
        ?open=${args.open}
        .placement=${args.placement}
        ?closeOnClickOutside=${args.closeOnClickOutside}
        ?closeOnEscape=${args.closeOnEscape}
        ?closeOnSelect=${args.closeOnSelect}
        ?disabled=${args.disabled}
        .distance=${args.distance}
        ?arrow=${args.arrow}
        .panelRole=${args.panelRole}
      >
        <bp-button>Open Dropdown</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="edit">Edit</bp-menu-item>
          <bp-menu-item value="duplicate">Duplicate</bp-menu-item>
          <bp-menu-divider></bp-menu-divider>
          <bp-menu-item value="delete">Delete</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};

export const WithArrow: Story = {
  args: {
    ...Default.args,
    arrow: true,
  },
  render: (args) => html`
    <div style="padding: 100px;">
      <bp-dropdown
        .placement=${args.placement}
        ?arrow=${args.arrow}
        .distance=${8}
      >
        <bp-button variant="secondary">With Arrow</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="profile">Profile</bp-menu-item>
          <bp-menu-item value="settings">Settings</bp-menu-item>
          <bp-menu-divider></bp-menu-divider>
          <bp-menu-item value="logout">Log out</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};

export const PlacementTop: Story = {
  args: {
    ...Default.args,
    placement: 'top-start',
  },
  render: (args) => html`
    <div style="padding: 150px 100px;">
      <bp-dropdown .placement=${args.placement}>
        <bp-button>Top Placement</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="option1">Option 1</bp-menu-item>
          <bp-menu-item value="option2">Option 2</bp-menu-item>
          <bp-menu-item value="option3">Option 3</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};

export const PlacementRight: Story = {
  args: {
    ...Default.args,
    placement: 'right',
  },
  render: (args) => html`
    <div style="padding: 100px;">
      <bp-dropdown .placement=${args.placement}>
        <bp-button>Right Placement</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="option1">Option 1</bp-menu-item>
          <bp-menu-item value="option2">Option 2</bp-menu-item>
          <bp-menu-item value="option3">Option 3</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};

export const CustomContent: Story = {
  args: {
    ...Default.args,
    closeOnSelect: false,
  },
  render: (args) => html`
    <div style="padding: 100px;">
      <bp-dropdown ?closeOnSelect=${args.closeOnSelect}>
        <bp-button>Custom Content</bp-button>
        <div slot="content" style="padding: 16px; min-width: 200px;">
          <p style="margin: 0 0 8px;">This is custom content</p>
          <p style="margin: 0; color: var(--bp-color-text-muted);">
            Any HTML can go here
          </p>
        </div>
      </bp-dropdown>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render: (args) => html`
    <div style="padding: 100px;">
      <bp-dropdown ?disabled=${args.disabled}>
        <bp-button ?disabled=${args.disabled}>Disabled</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="option1">Option 1</bp-menu-item>
          <bp-menu-item value="option2">Option 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};

export const AllPlacements: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 80px; padding: 120px;"
    >
      <bp-dropdown .placement=${'top-start'}>
        <bp-button size="small">top-start</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'top'}>
        <bp-button size="small">top</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'top-end'}>
        <bp-button size="small">top-end</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'left'}>
        <bp-button size="small">left</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <div></div>

      <bp-dropdown .placement=${'right'}>
        <bp-button size="small">right</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'bottom-start'}>
        <bp-button size="small">bottom-start</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'bottom'}>
        <bp-button size="small">bottom</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>

      <bp-dropdown .placement=${'bottom-end'}>
        <bp-button size="small">bottom-end</bp-button>
        <bp-menu slot="content">
          <bp-menu-item value="1">Item 1</bp-menu-item>
          <bp-menu-item value="2">Item 2</bp-menu-item>
        </bp-menu>
      </bp-dropdown>
    </div>
  `,
};
