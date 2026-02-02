import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './menu.js';

const meta: Meta = {
  title: 'Components/Menu',
  component: 'bp-menu',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant for menu items',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="cut">Cut</bp-menu-item>
      <bp-menu-item value="copy">Copy</bp-menu-item>
      <bp-menu-item value="paste">Paste</bp-menu-item>
    </bp-menu>
  `,
};

export const WithDividers: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="new">New File</bp-menu-item>
      <bp-menu-item value="open">Open</bp-menu-item>
      <bp-menu-divider></bp-menu-divider>
      <bp-menu-item value="save">Save</bp-menu-item>
      <bp-menu-item value="save-as">Save As...</bp-menu-item>
      <bp-menu-divider></bp-menu-divider>
      <bp-menu-item value="exit">Exit</bp-menu-item>
    </bp-menu>
  `,
};

export const WithShortcuts: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="undo" shortcut="Ctrl+Z">Undo</bp-menu-item>
      <bp-menu-item value="redo" shortcut="Ctrl+Y">Redo</bp-menu-item>
      <bp-menu-divider></bp-menu-divider>
      <bp-menu-item value="cut" shortcut="Ctrl+X">Cut</bp-menu-item>
      <bp-menu-item value="copy" shortcut="Ctrl+C">Copy</bp-menu-item>
      <bp-menu-item value="paste" shortcut="Ctrl+V">Paste</bp-menu-item>
    </bp-menu>
  `,
};

export const WithSubmenus: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="file" hasSubmenu>File</bp-menu-item>
      <bp-menu-item value="edit" hasSubmenu>Edit</bp-menu-item>
      <bp-menu-item value="view" hasSubmenu>View</bp-menu-item>
      <bp-menu-divider></bp-menu-divider>
      <bp-menu-item value="settings">Settings</bp-menu-item>
    </bp-menu>
  `,
};

export const WithDisabledItems: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="undo" disabled>Undo</bp-menu-item>
      <bp-menu-item value="redo" disabled>Redo</bp-menu-item>
      <bp-menu-divider></bp-menu-divider>
      <bp-menu-item value="cut">Cut</bp-menu-item>
      <bp-menu-item value="copy">Copy</bp-menu-item>
      <bp-menu-item value="paste">Paste</bp-menu-item>
    </bp-menu>
  `,
};
export const WithSelectedItem: Story = {
  args: {
    size: 'md',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="home">Home</bp-menu-item>
      <bp-menu-item value="about" selected>About</bp-menu-item>
      <bp-menu-item value="services">Services</bp-menu-item>
      <bp-menu-item value="contact">Contact</bp-menu-item>
    </bp-menu>
  `,
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="cut">Cut</bp-menu-item>
      <bp-menu-item value="copy">Copy</bp-menu-item>
      <bp-menu-item value="paste">Paste</bp-menu-item>
    </bp-menu>
  `,
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => html`
    <bp-menu .size=${args.size}>
      <bp-menu-item value="cut">Cut</bp-menu-item>
      <bp-menu-item value="copy">Copy</bp-menu-item>
      <bp-menu-item value="paste">Paste</bp-menu-item>
    </bp-menu>
  `,
};
