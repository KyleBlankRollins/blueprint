import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './divider.js';

const meta: Meta = {
  title: 'Components/Divider',
  component: 'bp-divider',
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider',
    },
    spacing: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spacing variant for the divider',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Line style variant for the divider',
    },
    color: {
      control: 'select',
      options: ['default', 'subtle', 'accent'],
      description: 'Color variant for the divider line',
    },
    weight: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Border weight for the divider line',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
    variant: 'solid',
    color: 'default',
    weight: 'thin',
  },
  render: (args) => html`
    <bp-divider
      .orientation=${args.orientation}
      .spacing=${args.spacing}
      .variant=${args.variant}
      .color=${args.color}
      .weight=${args.weight}
    ></bp-divider>
  `,
};

export const WithText: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
    variant: 'solid',
    color: 'default',
    weight: 'thin',
  },
  render: (args) => html`
    <bp-divider
      .orientation=${args.orientation}
      .spacing=${args.spacing}
      .variant=${args.variant}
      .color=${args.color}
      .weight=${args.weight}
      >Section Title</bp-divider
    >
  `,
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
  },
  render: (args) => html`
    <div>
      <p>Content above divider</p>
      <bp-divider
        .orientation=${args.orientation}
        .spacing=${args.spacing}
      ></bp-divider>
      <p>Content below divider</p>
    </div>
  `,
};

export const HorizontalWithText: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
  },
  render: (args) => html`
    <div>
      <p>First section content here</p>
      <bp-divider .orientation=${args.orientation} .spacing=${args.spacing}
        >OR</bp-divider
      >
      <p>Second section content here</p>
    </div>
  `,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    spacing: 'md',
  },
  render: (args) => html`
    <div style="display: flex; align-items: center; height: 100px;">
      <span>Left content</span>
      <bp-divider
        .orientation=${args.orientation}
        .spacing=${args.spacing}
      ></bp-divider>
      <span>Right content</span>
    </div>
  `,
};

export const SmallSpacing: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'sm',
  },
  render: (args) => html`
    <div>
      <p>Content above</p>
      <bp-divider
        .orientation=${args.orientation}
        .spacing=${args.spacing}
      ></bp-divider>
      <p>Content below</p>
    </div>
  `,
};

export const MediumSpacing: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
  },
  render: (args) => html`
    <div>
      <p>Content above</p>
      <bp-divider
        .orientation=${args.orientation}
        .spacing=${args.spacing}
      ></bp-divider>
      <p>Content below</p>
    </div>
  `,
};

export const LargeSpacing: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'lg',
  },
  render: (args) => html`
    <div>
      <p>Content above</p>
      <bp-divider
        .orientation=${args.orientation}
        .spacing=${args.spacing}
      ></bp-divider>
      <p>Content below</p>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <div>
        <h3 style="margin: 0 0 16px 0;">Horizontal Plain</h3>
        <p>Section 1</p>
        <bp-divider orientation="horizontal"></bp-divider>
        <p>Section 2</p>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Horizontal with Text</h3>
        <p>Section 1</p>
        <bp-divider orientation="horizontal">Section Break</bp-divider>
        <p>Section 2</p>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Vertical</h3>
        <div style="display: flex; align-items: center; height: 60px;">
          <span>Left</span>
          <bp-divider orientation="vertical"></bp-divider>
          <span>Center</span>
          <bp-divider orientation="vertical"></bp-divider>
          <span>Right</span>
        </div>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Line Variants</h3>
        <p>Solid (default)</p>
        <bp-divider variant="solid"></bp-divider>
        <p>Dashed</p>
        <bp-divider variant="dashed"></bp-divider>
        <p>Dotted</p>
        <bp-divider variant="dotted"></bp-divider>
        <p>End</p>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Spacing Variants</h3>
        <p>Small spacing</p>
        <bp-divider spacing="sm"></bp-divider>
        <p>Medium spacing</p>
        <bp-divider spacing="md"></bp-divider>
        <p>Large spacing</p>
        <bp-divider spacing="lg"></bp-divider>
        <p>End</p>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Color Variants</h3>
        <p>Default color</p>
        <bp-divider color="default"></bp-divider>
        <p>Subtle color</p>
        <bp-divider color="subtle"></bp-divider>
        <p>Accent color</p>
        <bp-divider color="accent"></bp-divider>
        <p>End</p>
      </div>

      <div>
        <h3 style="margin: 0 0 16px 0;">Weight Variants</h3>
        <p>Thin weight</p>
        <bp-divider weight="thin"></bp-divider>
        <p>Medium weight</p>
        <bp-divider weight="medium"></bp-divider>
        <p>Thick weight</p>
        <bp-divider weight="thick"></bp-divider>
        <p>End</p>
      </div>
    </div>
  `,
};
