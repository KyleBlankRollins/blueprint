import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tree.js';
import type { TreeNode } from './tree.js';

const fileSystemNodes: TreeNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'resume', label: 'Resume.pdf' },
      { id: 'cover-letter', label: 'Cover Letter.docx' },
      {
        id: 'projects',
        label: 'Projects',
        children: [
          { id: 'project1', label: 'Project Alpha' },
          { id: 'project2', label: 'Project Beta' },
        ],
      },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [
      { id: 'photo1', label: 'vacation.jpg' },
      { id: 'photo2', label: 'family.png' },
      {
        id: 'screenshots',
        label: 'Screenshots',
        children: [
          { id: 'screen1', label: 'screen-2024-01.png' },
          { id: 'screen2', label: 'screen-2024-02.png' },
        ],
      },
    ],
  },
  { id: 'readme', label: 'README.md' },
  { id: 'config', label: 'config.json' },
];

const organizationNodes: TreeNode[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    children: [
      {
        id: 'frontend',
        label: 'Frontend',
        children: [
          { id: 'alice', label: 'Alice Johnson' },
          { id: 'bob', label: 'Bob Smith' },
        ],
      },
      {
        id: 'backend',
        label: 'Backend',
        children: [
          { id: 'charlie', label: 'Charlie Brown' },
          { id: 'diana', label: 'Diana Ross' },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    children: [
      { id: 'eve', label: 'Eve Wilson' },
      { id: 'frank', label: 'Frank Miller' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    children: [{ id: 'grace', label: 'Grace Lee' }],
  },
];

const meta: Meta = {
  title: 'Components/Tree',
  component: 'bp-tree',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    selectable: {
      control: 'boolean',
      description: 'Whether nodes can be selected',
    },
    multiSelect: {
      control: 'boolean',
      description: 'Allow multiple selections',
    },
    showLines: {
      control: 'boolean',
      description: 'Show connecting lines',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    size: 'md',
    selectable: true,
    multiSelect: false,
    showLines: false,
  },
  render: (args) => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      size=${args.size}
      ?selectable=${args.selectable}
      ?multiSelect=${args.multiSelect}
      ?showLines=${args.showLines}
      @bp-select=${(e: CustomEvent) => console.log('Selected:', e.detail)}
      @bp-expand=${(e: CustomEvent) => console.log('Expanded:', e.detail)}
    ></bp-tree>
  `,
};

export const WithLines: Story = {
  args: {
    size: 'md',
    showLines: true,
  },
  render: (args) => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents', 'images', 'projects']}
      size=${args.size}
      ?showLines=${args.showLines}
    ></bp-tree>
  `,
};

export const ExpandedByDefault: Story = {
  render: () => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents', 'images', 'projects', 'screenshots']}
    ></bp-tree>
  `,
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents']}
      size=${args.size}
    ></bp-tree>
  `,
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents']}
      size=${args.size}
    ></bp-tree>
  `,
};

export const MultiSelect: Story = {
  args: {
    multiSelect: true,
  },
  render: (args) => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents', 'images']}
      selectable
      ?multiSelect=${args.multiSelect}
      @bp-select=${(e: CustomEvent) =>
        console.log('Selected:', e.detail.selectedIds)}
    ></bp-tree>
  `,
};

export const OrganizationChart: Story = {
  render: () => html`
    <bp-tree
      .nodes=${organizationNodes}
      .expandedIds=${[
        'engineering',
        'frontend',
        'backend',
        'design',
        'marketing',
      ]}
      showLines
      @bp-select=${(e: CustomEvent) =>
        console.log('Selected person:', e.detail.node.label)}
    ></bp-tree>
  `,
};

export const DisabledNodes: Story = {
  render: () => {
    const nodesWithDisabled: TreeNode[] = [
      {
        id: 'available',
        label: 'Available Folder',
        children: [
          { id: 'file1', label: 'Active File' },
          { id: 'file2', label: 'Restricted File', disabled: true },
        ],
      },
      { id: 'locked', label: 'Locked Folder', disabled: true },
      { id: 'normal', label: 'Normal File' },
    ];

    return html`
      <bp-tree
        .nodes=${nodesWithDisabled}
        .expandedIds=${['available']}
      ></bp-tree>
    `;
  },
};

export const PreSelected: Story = {
  render: () => html`
    <bp-tree
      .nodes=${fileSystemNodes}
      .expandedIds=${['documents']}
      selectedId="resume"
    ></bp-tree>
  `,
};

export const NonSelectable: Story = {
  args: {
    selectable: false,
  },
  render: (args) => html`
    <p style="margin-bottom: 1rem; color: var(--bp-color-text-muted);">
      Click nodes to expand/collapse only (no selection)
    </p>
    <bp-tree .nodes=${fileSystemNodes} ?selectable=${args.selectable}></bp-tree>
  `,
};

export const WithEventLogging: Story = {
  render: () => html`
    <div>
      <bp-tree
        .nodes=${fileSystemNodes}
        @bp-select=${(e: CustomEvent) => {
          const log = document.getElementById('event-log');
          if (log)
            log.textContent = `Selected: ${e.detail.node.label} (path: ${e.detail.path.join(' > ')})`;
        }}
        @bp-expand=${(e: CustomEvent) => {
          const log = document.getElementById('event-log');
          if (log) log.textContent = `Expanded: ${e.detail.node.label}`;
        }}
        @bp-collapse=${(e: CustomEvent) => {
          const log = document.getElementById('event-log');
          if (log) log.textContent = `Collapsed: ${e.detail.node.label}`;
        }}
      ></bp-tree>
      <div
        id="event-log"
        style="margin-top: 1rem; padding: 0.5rem; background: var(--bp-color-surface-subdued); border-radius: 4px; font-family: monospace;"
      >
        Click a node to see events...
      </div>
    </div>
  `,
};

const navigationNodes: TreeNode[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    href: '/docs/getting-started',
    children: [
      {
        id: 'installation',
        label: 'Installation',
        href: '/docs/getting-started/installation',
      },
      {
        id: 'quick-start',
        label: 'Quick Start',
        href: '/docs/getting-started/quick-start',
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'button', label: 'Button', href: '/docs/components/button' },
      { id: 'input', label: 'Input', href: '/docs/components/input' },
      { id: 'modal', label: 'Modal', href: '/docs/components/modal' },
    ],
  },
  {
    id: 'themes',
    label: 'Themes',
    href: '/docs/themes',
    children: [
      {
        id: 'customization',
        label: 'Customization',
        href: '/docs/themes/customization',
      },
      { id: 'tokens', label: 'Design Tokens', href: '/docs/themes/tokens' },
    ],
  },
  { id: 'changelog', label: 'Changelog', href: '/docs/changelog' },
];

export const Navigation: Story = {
  render: () => html`
    <p style="margin-bottom: 1rem; color: var(--bp-color-text-muted);">
      Nodes with <code>href</code> render as real
      <code>&lt;a&gt;</code> links. Click to navigate (prevented here for demo).
    </p>
    <bp-tree
      .nodes=${navigationNodes}
      .expandedIds=${['getting-started', 'components', 'themes']}
      selectedId="installation"
      size="sm"
      @bp-navigate=${(e: CustomEvent) => {
        e.preventDefault();
        const log = document.getElementById('nav-log');
        if (log)
          log.textContent = `Navigate to: ${e.detail.href}`;
      }}
    ></bp-tree>
    <div
      id="nav-log"
      style="margin-top: 1rem; padding: 0.5rem; background: var(--bp-color-surface-subdued); border-radius: 4px; font-family: monospace;"
    >
      Click a link node...
    </div>
  `,
};
