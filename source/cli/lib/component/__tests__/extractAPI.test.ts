import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { extractAPI } from '../extractAPI.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('extractAPI', () => {
  const testDir = join(process.cwd(), 'source', 'components', 'test-extract');
  const testFile = join(testDir, 'test-extract.ts');

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should extract multi-line union type properties', () => {
    const content = `import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('test-extract')
export class TestExtract extends LitElement {
  /**
   * Visual variant of the component
   * @type {'primary' | 'success' | 'error'}
   * @default 'primary'
   */
  @property({ type: String, reflect: true }) declare variant:
    | 'primary'
    | 'success'
    | 'error';

  constructor() {
    super();
    this.variant = 'primary';
  }
}`;

    writeFileSync(testFile, content, 'utf-8');

    const result = extractAPI('test-extract');

    expect(result.success).toBe(true);
    expect(result.properties).toHaveLength(1);

    const prop = result.properties[0];
    expect(prop?.name).toBe('variant');
    expect(prop?.type).toContain('primary');
    expect(prop?.type).toContain('success');
    expect(prop?.type).toContain('error');
    expect(prop?.defaultValue).toBe('primary');
    expect(prop?.description).toContain('Visual variant');
  });

  it('should extract default values from JSDoc @default tags', () => {
    const content = `import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('test-extract')
export class TestExtract extends LitElement {
  /**
   * Size of the component
   * @default 'medium'
   */
  @property({ type: String }) declare size: 'small' | 'medium' | 'large';
}`;

    writeFileSync(testFile, content, 'utf-8');

    const result = extractAPI('test-extract');

    expect(result.success).toBe(true);
    expect(result.properties[0]?.defaultValue).toBe('medium');
  });

  it('should handle boolean properties', () => {
    const content = `import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('test-extract')
export class TestExtract extends LitElement {
  /**
   * Whether the component is a dot
   * @default false
   */
  @property({ type: Boolean }) declare dot: boolean;
}`;

    writeFileSync(testFile, content, 'utf-8');

    const result = extractAPI('test-extract');

    expect(result.success).toBe(true);
    expect(result.properties[0]).toMatchObject({
      name: 'dot',
      type: 'boolean',
      defaultValue: 'false',
    });
  });
});
