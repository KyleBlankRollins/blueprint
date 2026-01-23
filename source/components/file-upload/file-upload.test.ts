import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './file-upload.js';
import type { BpFileUpload, FileInfo } from './file-upload.js';

describe('bp-file-upload', () => {
  let element: BpFileUpload;

  beforeEach(() => {
    element = document.createElement('bp-file-upload');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-file-upload');
    expect(constructor).toBeDefined();
  });

  // Default values tests
  it('should have correct default property values', async () => {
    await element.updateComplete;
    expect(element.name).toBe('');
    expect(element.label).toBe('Drop files here or click to upload');
    expect(element.description).toBe('');
    expect(element.accept).toBe('');
    expect(element.multiple).toBe(false);
    expect(element.maxSize).toBe(0);
    expect(element.maxFiles).toBe(0);
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.variant).toBe('default');
    expect(element.message).toBe('');
    expect(element.size).toBe('medium');
    expect(element.showPreviews).toBe(true);
  });

  it('should have no files by default', async () => {
    await element.updateComplete;
    expect(element.getFiles()).toHaveLength(0);
  });

  // Property tests
  it('should set property: name', async () => {
    element.name = 'file-input';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input?.name).toBe('file-input');
  });

  it('should set property: label', async () => {
    element.label = 'Upload your documents';
    await element.updateComplete;
    const label = element.shadowRoot?.querySelector('.file-upload__label');
    expect(label?.textContent).toBe('Upload your documents');
  });

  it('should set property: description', async () => {
    element.description = 'Max 10MB per file';
    await element.updateComplete;
    const description = element.shadowRoot?.querySelector(
      '.file-upload__description'
    );
    expect(description?.textContent).toBe('Max 10MB per file');
  });

  it('should set property: accept', async () => {
    element.accept = 'image/*,.pdf';
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input?.accept).toBe('image/*,.pdf');
  });

  it('should set property: multiple', async () => {
    element.multiple = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input?.multiple).toBe(true);
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input?.disabled).toBe(true);
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(
      dropzone?.classList.contains('file-upload__dropzone--disabled')
    ).toBe(true);
  });

  it('should set property: required', async () => {
    element.required = true;
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input?.required).toBe(true);
  });

  it('should set property: message', async () => {
    element.message = 'Please select a file';
    await element.updateComplete;
    const message = element.shadowRoot?.querySelector('.file-upload__message');
    expect(message?.textContent?.trim()).toBe('Please select a file');
  });

  // Attribute reflection tests
  it('should reflect disabled attribute', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  // Variant tests
  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--success')).toBe(
      true
    );
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--error')).toBe(
      true
    );
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--warning')).toBe(
      true
    );
  });

  it('should apply message variant color for error', async () => {
    element.variant = 'error';
    element.message = 'Error message';
    await element.updateComplete;
    const message = element.shadowRoot?.querySelector('.file-upload__message');
    expect(message?.classList.contains('file-upload__message--error')).toBe(
      true
    );
  });

  // Size tests
  it('should apply small size styles', async () => {
    element.size = 'small';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--small')).toBe(
      true
    );
  });

  it('should apply medium size styles', async () => {
    element.size = 'medium';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--medium')).toBe(
      true
    );
  });

  it('should apply large size styles', async () => {
    element.size = 'large';
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.classList.contains('file-upload__dropzone--large')).toBe(
      true
    );
  });

  // File handling tests
  it('should add file via input change event', async () => {
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    // Mock file input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });

    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
    expect(element.getFiles()[0].name).toBe('test.txt');
  });

  it('should clear all files with clearFiles method', async () => {
    await element.updateComplete;

    // Add a file first
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);

    element.clearFiles();
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(0);
  });

  it('should remove specific file with removeFile method', async () => {
    element.multiple = true;
    await element.updateComplete;

    // Add files
    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(2);

    const fileToRemove = element.getFiles()[0];
    element.removeFile(fileToRemove.id);
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
    expect(element.getFiles()[0].name).toBe('test2.txt');
  });

  // Event tests
  it('should emit bp-change event when files are added', async () => {
    await element.updateComplete;
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));

    expect(changeHandler).toHaveBeenCalled();
    const event = changeHandler.mock.calls[0][0] as CustomEvent<{
      files: FileInfo[];
    }>;
    expect(event.detail.files).toHaveLength(1);
  });

  it('should emit bp-file-added event when a file is added', async () => {
    await element.updateComplete;
    const addHandler = vi.fn();
    element.addEventListener('bp-file-added', addHandler);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));

    expect(addHandler).toHaveBeenCalled();
  });

  it('should emit bp-file-removed event when a file is removed', async () => {
    await element.updateComplete;

    // Add file first
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-file-removed', removeHandler);

    element.removeFile(element.getFiles()[0].id);

    expect(removeHandler).toHaveBeenCalled();
  });

  it('should emit bp-file-rejected event for invalid file type', async () => {
    element.accept = 'image/*';
    await element.updateComplete;
    const rejectHandler = vi.fn();
    element.addEventListener('bp-file-rejected', rejectHandler);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));

    expect(rejectHandler).toHaveBeenCalled();
    const event = rejectHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.reason).toBe('File type not accepted');
  });

  it('should emit bp-file-rejected event for file exceeding max size', async () => {
    element.maxSize = 100;
    await element.updateComplete;
    const rejectHandler = vi.fn();
    element.addEventListener('bp-file-rejected', rejectHandler);

    // Create file larger than 100 bytes
    const largeContent = 'x'.repeat(200);
    const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));

    expect(rejectHandler).toHaveBeenCalled();
    const event = rejectHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.reason).toBe('File size exceeds limit');
  });

  it('should emit bp-file-rejected event when max files exceeded', async () => {
    element.multiple = true;
    element.maxFiles = 1;
    await element.updateComplete;

    // Add first file
    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: true,
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    // Try to add second file - use a new element to avoid redefine issue
    const rejectHandler = vi.fn();
    element.addEventListener('bp-file-rejected', rejectHandler);

    // Simulate adding a second file by directly calling processFiles
    const dataTransfer2 = new DataTransfer();
    dataTransfer2.items.add(file2);
    Object.defineProperty(input, 'files', {
      value: dataTransfer2.files,
      writable: true,
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));

    expect(rejectHandler).toHaveBeenCalled();
    const event = rejectHandler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.reason).toBe('Maximum number of files exceeded');
  });

  // Interaction tests
  it('should replace file in single mode', async () => {
    element.multiple = false;
    await element.updateComplete;

    // Add first file
    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: true,
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()[0].name).toBe('test1.txt');

    // Add second file - should replace
    const dataTransfer2 = new DataTransfer();
    dataTransfer2.items.add(file2);
    Object.defineProperty(input, 'files', {
      value: dataTransfer2.files,
      writable: true,
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
    expect(element.getFiles()[0].name).toBe('test2.txt');
  });

  it('should accept multiple files in multiple mode', async () => {
    element.multiple = true;
    await element.updateComplete;

    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(2);
  });

  // File type validation tests
  it('should accept file with matching MIME type', async () => {
    element.accept = 'text/plain';
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
  });

  it('should accept file with matching extension', async () => {
    element.accept = '.txt';
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
  });

  it('should accept file with wildcard MIME type', async () => {
    element.accept = 'image/*';
    await element.updateComplete;

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);
  });

  // File list rendering tests
  it('should display file name in file list', async () => {
    await element.updateComplete;

    const file = new File(['content'], 'my-document.pdf', {
      type: 'application/pdf',
    });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const fileName = element.shadowRoot?.querySelector(
      '.file-upload__file-name'
    );
    expect(fileName?.textContent).toBe('my-document.pdf');
  });

  it('should display file size in file list', async () => {
    await element.updateComplete;

    const content = 'x'.repeat(1024); // 1KB
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const fileSize = element.shadowRoot?.querySelector(
      '.file-upload__file-size'
    );
    expect(fileSize?.textContent).toBe('1.0 KB');
  });

  it('should remove file when remove button is clicked', async () => {
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(1);

    const removeButton = element.shadowRoot?.querySelector(
      '.file-upload__remove-button'
    ) as HTMLButtonElement;
    removeButton.click();
    await element.updateComplete;

    expect(element.getFiles()).toHaveLength(0);
  });

  // Accessibility tests
  it('should have proper ARIA attributes when enabled', async () => {
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.getAttribute('role')).toBe('button');
    expect(dropzone?.getAttribute('tabindex')).toBe('0');
  });

  it('should have proper ARIA attributes when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const dropzone = element.shadowRoot?.querySelector(
      '.file-upload__dropzone'
    );
    expect(dropzone?.getAttribute('aria-disabled')).toBe('true');
    expect(dropzone?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have aria-label on remove buttons', async () => {
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const removeButton = element.shadowRoot?.querySelector(
      '.file-upload__remove-button'
    );
    expect(removeButton?.getAttribute('aria-label')).toBe('Remove test.txt');
  });

  it('should have accessible file list with role list', async () => {
    await element.updateComplete;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = element.shadowRoot?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
    });
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const fileList = element.shadowRoot?.querySelector(
      '.file-upload__file-list'
    );
    expect(fileList?.getAttribute('role')).toBe('list');
    expect(fileList?.getAttribute('aria-label')).toBe('Selected files');
  });
});
