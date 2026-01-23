import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fileUploadStyles } from './file-upload.style.js';

/**
 * File information object returned in events
 */
export interface FileInfo {
  /** Original File object */
  file: File;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Unique identifier */
  id: string;
  /** Preview URL for images */
  previewUrl?: string;
  /** Upload progress (0-100) */
  progress?: number;
  /** Upload status */
  status?: 'pending' | 'uploading' | 'complete' | 'error';
  /** Error message if upload failed */
  error?: string;
}

/**
 * A file upload component with drag-and-drop support.
 *
 * @element bp-file-upload
 *
 * @fires bp-change - Fired when files are added or removed
 * @fires bp-file-added - Fired when a file is added
 * @fires bp-file-removed - Fired when a file is removed
 * @fires bp-file-rejected - Fired when a file is rejected (wrong type/size)
 *
 * @csspart dropzone - The drop zone container
 * @csspart input - The hidden file input
 * @csspart label - The label text
 * @csspart description - The description text
 * @csspart icon - The upload icon
 * @csspart file-list - The file list container
 * @csspart file-item - Individual file item
 * @csspart file-name - File name text
 * @csspart file-size - File size text
 * @csspart file-remove - Remove file button
 */
@customElement('bp-file-upload')
export class BpFileUpload extends LitElement {
  /** Name attribute for form submission */
  @property({ type: String }) declare name: string;

  /** Label text displayed in the drop zone */
  @property({ type: String }) declare label: string;

  /** Description text displayed below the label */
  @property({ type: String }) declare description: string;

  /** Accepted file types (comma-separated MIME types or extensions) */
  @property({ type: String }) declare accept: string;

  /** Whether multiple files can be selected */
  @property({ type: Boolean }) declare multiple: boolean;

  /** Maximum file size in bytes */
  @property({ type: Number }) declare maxSize: number;

  /** Maximum number of files allowed */
  @property({ type: Number }) declare maxFiles: number;

  /** Whether the component is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Whether a file is required */
  @property({ type: Boolean }) declare required: boolean;

  /** Visual variant for validation states */
  @property({ type: String }) declare variant:
    | 'default'
    | 'success'
    | 'error'
    | 'warning';

  /** Helper or error message text */
  @property({ type: String }) declare message: string;

  /** Size variant */
  @property({ type: String }) declare size: 'small' | 'medium' | 'large';

  /** Whether to show file previews for images */
  @property({ type: Boolean }) declare showPreviews: boolean;

  /** Whether drag is currently over the drop zone */
  @state() private isDragOver = false;

  /** List of selected files */
  @state() private files: FileInfo[] = [];

  /** Reference to the hidden file input */
  @query('input[type="file"]') private fileInput!: HTMLInputElement;

  static styles = [fileUploadStyles];

  constructor() {
    super();
    this.name = '';
    this.label = 'Drop files here or click to upload';
    this.description = '';
    this.accept = '';
    this.multiple = false;
    this.maxSize = 0;
    this.maxFiles = 0;
    this.disabled = false;
    this.required = false;
    this.variant = 'default';
    this.message = '';
    this.size = 'medium';
    this.showPreviews = true;
  }

  /**
   * Get the list of selected files
   */
  getFiles(): FileInfo[] {
    return [...this.files];
  }

  /**
   * Clear all selected files
   */
  clearFiles(): void {
    // Revoke object URLs to prevent memory leaks
    this.files.forEach((fileInfo) => {
      if (fileInfo.previewUrl) {
        URL.revokeObjectURL(fileInfo.previewUrl);
      }
    });
    this.files = [];
    if (this.fileInput) {
      this.fileInput.value = '';
    }
    this.dispatchChangeEvent();
  }

  /**
   * Remove a specific file by ID
   */
  removeFile(fileId: string): void {
    const fileIndex = this.files.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
      const removedFile = this.files[fileIndex];
      if (removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }
      this.files = this.files.filter((f) => f.id !== fileId);
      this.dispatchEvent(
        new CustomEvent('bp-file-removed', {
          detail: { file: removedFile },
          bubbles: true,
          composed: true,
        })
      );
      this.dispatchChangeEvent();
    }
  }

  private handleClick(): void {
    if (!this.disabled) {
      this.fileInput?.click();
    }
  }

  private handleKeyDown(event: globalThis.KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.fileInput?.click();
    }
  }

  private handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
  }

  private handleDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragOver = true;
    }
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled && event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  private handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Only set isDragOver to false if we're leaving the dropzone entirely
    const relatedTarget = event.relatedTarget as Node | null;
    if (!this.contains(relatedTarget)) {
      this.isDragOver = false;
    }
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (this.disabled) return;

    const dataTransfer = event.dataTransfer;
    if (dataTransfer?.files) {
      this.processFiles(Array.from(dataTransfer.files));
    }
  }

  private processFiles(newFiles: File[]): void {
    const validFiles: FileInfo[] = [];

    for (const file of newFiles) {
      // Check if max files limit is reached
      if (
        this.maxFiles > 0 &&
        this.files.length + validFiles.length >= this.maxFiles
      ) {
        this.dispatchRejectEvent(file, 'Maximum number of files exceeded');
        continue;
      }

      // Check file type
      if (this.accept && !this.isFileTypeAccepted(file)) {
        this.dispatchRejectEvent(file, 'File type not accepted');
        continue;
      }

      // Check file size
      if (this.maxSize > 0 && file.size > this.maxSize) {
        this.dispatchRejectEvent(file, 'File size exceeds limit');
        continue;
      }

      // Create file info object
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        id: this.generateFileId(),
        status: 'pending',
        progress: 0,
      };

      // Generate preview for images
      if (this.showPreviews && file.type.startsWith('image/')) {
        fileInfo.previewUrl = URL.createObjectURL(file);
      }

      validFiles.push(fileInfo);

      this.dispatchEvent(
        new CustomEvent('bp-file-added', {
          detail: { file: fileInfo },
          bubbles: true,
          composed: true,
        })
      );
    }

    if (validFiles.length > 0) {
      if (this.multiple) {
        this.files = [...this.files, ...validFiles];
      } else {
        // Single file mode - replace existing file
        this.files.forEach((existingFile) => {
          if (existingFile.previewUrl) {
            URL.revokeObjectURL(existingFile.previewUrl);
          }
        });
        this.files = validFiles.slice(0, 1);
      }
      this.dispatchChangeEvent();
    }
  }

  private isFileTypeAccepted(file: File): boolean {
    if (!this.accept) return true;

    const acceptedTypes = this.accept
      .split(',')
      .map((type) => type.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    return acceptedTypes.some((accepted) => {
      // Check MIME type match
      if (accepted === fileType) return true;
      // Check extension match
      if (accepted === fileExtension) return true;
      // Check wildcard MIME type (e.g., image/*)
      if (accepted.endsWith('/*')) {
        const category = accepted.slice(0, -2);
        return fileType.startsWith(category + '/');
      }
      return false;
    });
  }

  private dispatchChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { files: this.getFiles() },
        bubbles: true,
        composed: true,
      })
    );
  }

  private dispatchRejectEvent(file: File, reason: string): void {
    this.dispatchEvent(
      new CustomEvent('bp-file-rejected', {
        detail: { file, reason },
        bubbles: true,
        composed: true,
      })
    );
  }

  private generateFileId(): string {
    return `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );
    const size = bytes / Math.pow(1024, exponent);
    return `${size.toFixed(exponent > 0 ? 1 : 0)} ${units[exponent]}`;
  }

  private handleRemoveFile(event: Event, fileId: string): void {
    event.stopPropagation();
    this.removeFile(fileId);
  }

  private renderUploadIcon() {
    return html`
      <svg
        class="file-upload__icon"
        part="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    `;
  }

  private renderFileList() {
    if (this.files.length === 0) return nothing;

    return html`
      <div
        class="file-upload__file-list"
        part="file-list"
        role="list"
        aria-label="Selected files"
      >
        ${this.files.map(
          (fileInfo) => html`
            <div
              class="file-upload__file-item"
              part="file-item"
              role="listitem"
            >
              ${fileInfo.previewUrl
                ? html`
                    <img
                      class="file-upload__preview"
                      src="${fileInfo.previewUrl}"
                      alt="Preview of ${fileInfo.name}"
                    />
                  `
                : html`
                    <div class="file-upload__file-icon" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                  `}
              <div class="file-upload__file-info">
                <span class="file-upload__file-name" part="file-name"
                  >${fileInfo.name}</span
                >
                <span class="file-upload__file-size" part="file-size"
                  >${this.formatFileSize(fileInfo.size)}</span
                >
              </div>
              <button
                type="button"
                class="file-upload__remove-button"
                part="file-remove"
                @click=${(e: Event) => this.handleRemoveFile(e, fileInfo.id)}
                aria-label="Remove ${fileInfo.name}"
                ?disabled=${this.disabled}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    const dropzoneClasses = {
      'file-upload__dropzone': true,
      'file-upload__dropzone--drag-over': this.isDragOver,
      'file-upload__dropzone--disabled': this.disabled,
      'file-upload__dropzone--has-files': this.files.length > 0,
      [`file-upload__dropzone--${this.variant}`]: this.variant !== 'default',
      [`file-upload__dropzone--${this.size}`]: true,
    };

    const acceptDescription = this.accept
      ? `Accepted file types: ${this.accept}`
      : '';
    const sizeDescription =
      this.maxSize > 0
        ? `Maximum file size: ${this.formatFileSize(this.maxSize)}`
        : '';

    return html`
      <div class="file-upload">
        <div
          class=${classMap(dropzoneClasses)}
          part="dropzone"
          role="button"
          tabindex=${this.disabled ? -1 : 0}
          aria-disabled=${this.disabled}
          aria-describedby="file-upload-description"
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
          @dragenter=${this.handleDragEnter}
          @dragover=${this.handleDragOver}
          @dragleave=${this.handleDragLeave}
          @drop=${this.handleDrop}
        >
          <input
            type="file"
            part="input"
            .name=${this.name}
            .accept=${this.accept}
            ?multiple=${this.multiple}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @change=${this.handleInputChange}
            aria-hidden="true"
            tabindex="-1"
          />

          ${this.renderUploadIcon()}

          <span class="file-upload__label" part="label">${this.label}</span>

          ${this.description
            ? html`<span class="file-upload__description" part="description"
                >${this.description}</span
              >`
            : nothing}
        </div>

        <span id="file-upload-description" class="visually-hidden">
          ${acceptDescription} ${sizeDescription}
        </span>

        ${this.renderFileList()}
        ${this.message
          ? html`<div
              class="file-upload__message file-upload__message--${this.variant}"
              part="message"
            >
              ${this.message}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-file-upload': BpFileUpload;
  }
}
