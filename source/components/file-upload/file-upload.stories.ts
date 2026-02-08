import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './file-upload.js';

const meta: Meta = {
  title: 'Components/FileUpload',
  component: 'bp-file-upload',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
    label: {
      control: 'text',
      description: 'Label text displayed in the drop zone',
    },
    description: {
      control: 'text',
      description: 'Description text displayed below the label',
    },
    accept: {
      control: 'text',
      description:
        'Accepted file types (comma-separated MIME types or extensions)',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple files can be selected',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether a file is required',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
      description: 'Visual variant for validation states',
    },
    message: {
      control: 'text',
      description: 'Helper or error message text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showPreviews: {
      control: 'boolean',
      description: 'Whether to show file previews for images',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: 'Drop files here or click to upload',
    description: 'Supports all file types',
    size: 'md',
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      .size=${args.size}
    ></bp-file-upload>
  `,
};

export const ImagesOnly: Story = {
  args: {
    label: 'Upload images',
    description: 'PNG, JPG, GIF up to 5MB',
    accept: 'image/*',
    maxSize: 5242880,
    multiple: true,
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      .accept=${args.accept}
      .maxSize=${args.maxSize}
      ?multiple=${args.multiple}
    ></bp-file-upload>
  `,
};

export const DocumentUpload: Story = {
  args: {
    label: 'Upload documents',
    description: 'PDF, DOC, DOCX files only',
    accept: '.pdf,.doc,.docx',
    multiple: true,
    maxFiles: 5,
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      .accept=${args.accept}
      ?multiple=${args.multiple}
      .maxFiles=${args.maxFiles}
    ></bp-file-upload>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <bp-file-upload
        size="sm"
        label="Small size"
        description="Compact upload area"
      ></bp-file-upload>
      <bp-file-upload
        size="md"
        label="Medium size (default)"
        description="Standard upload area"
      ></bp-file-upload>
      <bp-file-upload
        size="lg"
        label="Large size"
        description="Prominent upload area for primary actions"
      ></bp-file-upload>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <bp-file-upload
        variant="default"
        label="Default variant"
      ></bp-file-upload>
      <bp-file-upload
        variant="success"
        label="Success variant"
        message="File uploaded successfully"
      ></bp-file-upload>
      <bp-file-upload
        variant="error"
        label="Error variant"
        message="Please upload a valid file"
      ></bp-file-upload>
      <bp-file-upload
        variant="warning"
        label="Warning variant"
        message="File size is close to the limit"
      ></bp-file-upload>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    label: 'Upload is disabled',
    description: 'Cannot select files',
    disabled: true,
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      ?disabled=${args.disabled}
    ></bp-file-upload>
  `,
};

export const Required: Story = {
  args: {
    label: 'Required file upload',
    description: 'A file must be selected',
    required: true,
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      ?required=${args.required}
    ></bp-file-upload>
  `,
};

export const SingleFile: Story = {
  args: {
    label: 'Upload a single file',
    description: 'Only one file can be selected',
    multiple: false,
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      ?multiple=${args.multiple}
    ></bp-file-upload>
  `,
};

export const WithValidation: Story = {
  args: {
    label: 'Upload with validation',
    description: 'Max 1MB per file, 3 files maximum',
    accept: 'image/*,.pdf',
    maxSize: 1048576,
    maxFiles: 3,
    multiple: true,
    variant: 'default',
  },
  render: (args) => html`
    <bp-file-upload
      .label=${args.label}
      .description=${args.description}
      .accept=${args.accept}
      .maxSize=${args.maxSize}
      .maxFiles=${args.maxFiles}
      ?multiple=${args.multiple}
      .variant=${args.variant}
    ></bp-file-upload>
  `,
};
