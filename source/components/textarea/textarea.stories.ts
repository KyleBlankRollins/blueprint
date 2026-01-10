import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './textarea.js';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'bp-textarea',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Visual variant affecting border color and validation state',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description:
        'Size of the textarea (affects padding, font size, min-height)',
    },
    value: {
      control: 'text',
      description: 'Current value of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when textarea is empty',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when variant is "error"',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required (shows asterisk)',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the textarea is readonly',
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'both', 'horizontal', 'vertical'],
      description: 'How the textarea can be resized by the user',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
    maxlength: {
      control: 'number',
      description: 'Maximum number of characters allowed',
    },
    spellcheck: {
      control: 'boolean',
      description: 'Whether to enable spellcheck',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text...',
  },
  render: (args) => html`
    <bp-textarea
      .variant=${args.variant}
      .size=${args.size}
      .value=${args.value}
      .placeholder=${args.placeholder}
      .label=${args.label}
      .helperText=${args.helperText}
      .errorMessage=${args.errorMessage}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?readonly=${args.readonly}
      .resize=${args.resize}
      .rows=${args.rows}
      .maxlength=${args.maxlength}
      ?spellcheck=${args.spellcheck}
    ></bp-textarea>
  `,
};

export const WithLabel: Story = {
  args: {
    label: 'Comment',
    placeholder: 'Enter your comment here...',
    helperText: 'Please be respectful and constructive',
  },
};

export const Required: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Tell us what you think...',
    required: true,
    helperText: 'This field is required',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Feedback',
    value: 'Great work on this project!',
    helperText: 'Thank you for your feedback',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    label: 'Description',
    value: 'Too short',
    errorMessage: 'Description must be at least 10 characters',
    required: true,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Notes',
    value: 'This comment contains potentially sensitive information.',
    helperText: 'Please review before submitting',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    label: 'Additional Information',
    placeholder: 'Optional details...',
    helperText: 'You can provide extra context here',
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    label: 'Small Textarea',
    placeholder: 'Compact size...',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    label: 'Medium Textarea',
    placeholder: 'Default size...',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    label: 'Large Textarea',
    placeholder: 'Spacious size...',
  },
};

export const ResizeNone: Story = {
  args: {
    label: 'Fixed Size',
    resize: 'none',
    placeholder: 'This textarea cannot be resized',
  },
};

export const ResizeBoth: Story = {
  args: {
    label: 'Resize Both Directions',
    resize: 'both',
    placeholder: 'Resize me horizontally and vertically',
  },
};

export const ResizeHorizontal: Story = {
  args: {
    label: 'Resize Horizontally',
    resize: 'horizontal',
    placeholder: 'Resize me horizontally only',
  },
};

export const ResizeVertical: Story = {
  args: {
    label: 'Resize Vertically',
    resize: 'vertical',
    placeholder: 'Resize me vertically only (default)',
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Custom Height',
    rows: 8,
    placeholder: 'This textarea has 8 visible rows',
  },
};

export const CharacterLimit: Story = {
  args: {
    label: 'Bio',
    maxlength: 200,
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 200 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 'This textarea is disabled',
    disabled: true,
    helperText: 'You cannot edit this field',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Read Only',
    value: 'This textarea is read-only',
    readonly: true,
    helperText: 'This field cannot be modified',
  },
};
