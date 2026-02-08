import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './pagination.js';

const meta: Meta = {
  title: 'Components/Pagination',
  component: 'bp-pagination',
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Current page number (1-indexed)',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    siblingCount: {
      control: 'number',
      description: 'Number of page buttons to show around the current page',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    boundaryCount: {
      control: 'number',
      description: 'Number of page buttons to show at the start and end',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Show first/last page buttons',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showPrevNext: {
      control: 'boolean',
      description: 'Show previous/next page buttons',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showInfo: {
      control: 'boolean',
      description: 'Show page info text (e.g., "Page 1 of 10")',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all pagination controls',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A pagination component for navigating through multiple pages of content with customizable controls and appearance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: false,
    disabled: false,
    size: 'medium',
  },
  render: (args) => html`
    <bp-pagination
      .currentPage=${args.currentPage}
      .totalPages=${args.totalPages}
      .siblingCount=${args.siblingCount}
      .boundaryCount=${args.boundaryCount}
      ?showFirstLast=${args.showFirstLast}
      ?showPrevNext=${args.showPrevNext}
      ?showInfo=${args.showInfo}
      ?disabled=${args.disabled}
      .size=${args.size}
      @bp-page-change=${(e: CustomEvent) =>
        console.log('Page changed:', e.detail.page)}
    ></bp-pagination>
  `,
};

export const Small: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: false,
    disabled: false,
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: false,
    disabled: false,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    currentPage: 7,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: false,
    disabled: false,
    size: 'large',
  },
};

export const WithEllipsis: Story = {
  args: {
    currentPage: 10,
    totalPages: 50,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: true,
    disabled: false,
    size: 'medium',
  },
};

export const Compact: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: false,
    showPrevNext: true,
    showInfo: true,
    disabled: false,
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showInfo: false,
    disabled: true,
    size: 'medium',
  },
};
