# File Upload

A file upload component with drag-and-drop support, file type validation, size limits, and image previews.

## Features

- Drag-and-drop file upload with visual feedback
- Click to open file browser
- Single or multiple file selection
- File type validation (MIME types, extensions, wildcards)
- Maximum file size validation
- Maximum file count limit
- Image preview thumbnails
- File list with remove functionality
- 3 size variants: `sm`, `md`, `lg`
- 4 validation variants: `default`, `success`, `error`, `warning`
- Disabled and required states
- Full keyboard navigation (Enter/Space to open dialog)
- ARIA-compliant accessibility

## Usage

```html
<!-- Basic file upload -->
<bp-file-upload
  label="Drop files here or click to upload"
  description="Maximum file size: 5MB"
></bp-file-upload>

<!-- Multiple files with restrictions -->
<bp-file-upload
  label="Upload images"
  accept="image/*"
  multiple
  max-size="5242880"
  max-files="5"
></bp-file-upload>

<!-- With validation state -->
<bp-file-upload
  label="Upload document"
  accept=".pdf,.doc,.docx"
  variant="error"
  message="Please upload a valid document"
></bp-file-upload>
```

## API

### Properties

| Property       | Type                                             | Default                                | Description                                                    |
| -------------- | ------------------------------------------------ | -------------------------------------- | -------------------------------------------------------------- |
| `name`         | `string`                                         | `''`                                   | Name attribute for form submission                             |
| `label`        | `string`                                         | `'Drop files here or click to upload'` | Label text displayed in the drop zone                          |
| `description`  | `string`                                         | `''`                                   | Description text displayed below the label                     |
| `accept`       | `string`                                         | `''`                                   | Accepted file types (comma-separated MIME types or extensions) |
| `multiple`     | `boolean`                                        | `false`                                | Whether multiple files can be selected                         |
| `maxSize`      | `number`                                         | `0`                                    | Maximum file size in bytes (0 = no limit)                      |
| `maxFiles`     | `number`                                         | `0`                                    | Maximum number of files allowed (0 = no limit)                 |
| `disabled`     | `boolean`                                        | `false`                                | Whether the component is disabled                              |
| `required`     | `boolean`                                        | `false`                                | Whether a file is required                                     |
| `variant`      | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'`                            | Visual variant for validation states                           |
| `message`      | `string`                                         | `''`                                   | Helper or error message text                                   |
| `size`         | `'sm' \| 'md' \| 'lg'`                 | `'md'`                             | Size variant                                                   |
| `showPreviews` | `boolean`                                        | `true`                                 | Whether to show file previews for images                       |

### Events

| Event              | Detail                  | Description                                       |
| ------------------ | ----------------------- | ------------------------------------------------- |
| `bp-change`        | `{ files: FileInfo[] }` | Fired when files are added or removed             |
| `bp-file-added`    | `{ file: FileInfo }`    | Fired when a file is added                        |
| `bp-file-removed`  | `{ file: FileInfo }`    | Fired when a file is removed                      |
| `bp-file-rejected` | `{ file, reason }`      | Fired when a file is rejected (invalid type/size) |

### Methods

| Method                   | Description                    |
| ------------------------ | ------------------------------ |
| `getFiles(): FileInfo[]` | Get the list of selected files |
| `clearFiles(): void`     | Clear all selected files       |
| `removeFile(id): void`   | Remove a specific file by ID   |

### CSS Parts

| Part          | Description             |
| ------------- | ----------------------- |
| `dropzone`    | The drop zone container |
| `input`       | The hidden file input   |
| `label`       | The label text          |
| `description` | The description text    |
| `icon`        | The upload icon         |
| `file-list`   | The file list container |
| `file-item`   | Individual file item    |
| `file-name`   | File name text          |
| `file-size`   | File size text          |
| `file-remove` | Remove file button      |

## Keyboard Navigation

| Key     | Action                    |
| ------- | ------------------------- |
| `Enter` | Open file browser dialog  |
| `Space` | Open file browser dialog  |
| `Tab`   | Navigate between elements |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Dropzone background
- `--bp-color-surface-elevated` - Hover/drag background
- `--bp-color-surface-subdued` - Disabled background
- `--bp-color-text` - Primary text color
- `--bp-color-text-muted` - Secondary text color
- `--bp-color-text-inverse` - Inverse text (on remove hover)
- `--bp-color-border` - Border color
- `--bp-color-primary` - Primary accent color
- `--bp-color-success` - Success variant color
- `--bp-color-error` - Error variant color
- `--bp-color-warning` - Warning variant color

### Universal Tokens (Infrastructure)

- `--bp-spacing-*` - Padding and margins
- `--bp-font-sans` - Font family
- `--bp-font-size-*` - Text sizes
- `--bp-font-weight-medium` - Font weight
- `--bp-line-height-normal` - Line spacing
- `--bp-border-radius-*` - Border roundness
- `--bp-border-width` - Border width
- `--bp-focus-ring` - Focus indicator
- `--bp-focus-offset` - Focus offset
- `--bp-transition-fast` - Animations
- `--bp-opacity-disabled` - Disabled opacity

## Accessibility

- **Role**: Dropzone has `role="button"` for clear semantics
- **Keyboard**: Full keyboard support with Enter/Space to activate
- **Focus**: Visible focus indicator on dropzone
- **ARIA**: `aria-disabled` reflects disabled state
- **File list**: Uses `role="list"` with `aria-label`
- **Remove buttons**: Include `aria-label` with file name
- **Screen readers**: Descriptive text announces accepted types and size limits
