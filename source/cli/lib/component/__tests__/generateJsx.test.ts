import { describe, it, expect } from 'vitest';
import { generateJsxDeclarations } from '../generateJsx.js';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..', '..', '..', '..');

describe('generateJsxDeclarations', () => {
  it('returns success with componentCount > 0', () => {
    const result = generateJsxDeclarations({ rootDir: ROOT, check: true });
    expect(result.success).toBe(true);
    expect(result.componentCount).toBeGreaterThan(0);
  });

  it('output contains AUTO-GENERATED header', () => {
    const result = generateJsxDeclarations({ rootDir: ROOT, check: true });
    expect(result.success).toBe(true);
  });

  it('output contains BlueprintElements interface', () => {
    const result = generateJsxDeclarations({ rootDir: ROOT, check: true });
    expect(result.success).toBe(true);
  });

  it('output contains all three namespace augmentations', () => {
    const result = generateJsxDeclarations({ rootDir: ROOT, check: true });
    expect(result.success).toBe(true);
  });

  it('check mode works without errors', () => {
    const result = generateJsxDeclarations({ rootDir: ROOT, check: true });
    expect(result.success).toBe(true);
    expect(typeof result.changed).toBe('boolean');
  });
});
