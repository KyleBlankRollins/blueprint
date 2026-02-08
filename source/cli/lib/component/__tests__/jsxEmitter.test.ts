import { describe, it, expect } from 'vitest';
import { emitJsxDeclarations } from '../jsxEmitter.js';
import type { ComponentInfo } from '../jsxParser.js';

function makeComponent(overrides: Partial<ComponentInfo> = {}): ComponentInfo {
  return {
    tagName: 'bp-test',
    className: 'BpTest',
    componentName: 'test',
    sourceFile: 'components/test/test.ts',
    properties: [],
    exportedTypes: [],
    ...overrides,
  };
}

describe('emitJsxDeclarations', () => {
  it('empty components → emits header, helpers, empty BlueprintElements', () => {
    const output = emitJsxDeclarations([]);
    expect(output).toContain('AUTO-GENERATED');
    expect(output).toContain('BaseHTMLAttributes');
    expect(output).toContain('StringAttr');
    expect(output).toContain('BooleanAttr');
    expect(output).toContain('NumberAttr');
    expect(output).toContain('export interface BlueprintElements {');
    expect(output).toContain('}');
  });

  it('simple component with StringAttr wrapping', () => {
    const comp = makeComponent({
      tagName: 'bp-button',
      properties: [
        { name: 'variant', rawType: 'ButtonVariant', litType: 'String' },
      ],
      exportedTypes: [{ name: 'ButtonVariant', kind: 'type' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('variant?: StringAttr<ButtonVariant>;');
    expect(output).toContain("'bp-button': BpButtonProps;");
  });

  it('boolean prop → BooleanAttr', () => {
    const comp = makeComponent({
      properties: [
        { name: 'disabled', rawType: 'boolean', litType: 'Boolean' },
      ],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('disabled?: BooleanAttr;');
  });

  it('number prop → NumberAttr', () => {
    const comp = makeComponent({
      properties: [{ name: 'value', rawType: 'number', litType: 'Number' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('value?: NumberAttr;');
  });

  it('plain string prop → string (no wrapper)', () => {
    const comp = makeComponent({
      properties: [{ name: 'label', rawType: 'string', litType: 'String' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('label?: string;');
  });

  it('named type alias prop → StringAttr<TypeName>', () => {
    const comp = makeComponent({
      properties: [
        { name: 'size', rawType: 'ButtonSize', litType: 'String' },
      ],
      exportedTypes: [{ name: 'ButtonSize', kind: 'type' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('size?: StringAttr<ButtonSize>;');
  });

  it('inline union prop → StringAttr<union>', () => {
    const comp = makeComponent({
      properties: [
        {
          name: 'type',
          rawType: "'button' | 'submit' | 'reset'",
          litType: 'String',
        },
      ],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain(
      "type?: StringAttr<'button' | 'submit' | 'reset'>;"
    );
  });

  it('array prop → pass-through', () => {
    const comp = makeComponent({
      properties: [
        { name: 'columns', rawType: 'TableColumn[]', litType: 'Array' },
      ],
      exportedTypes: [{ name: 'TableColumn', kind: 'interface' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('columns?: TableColumn[];');
  });

  it('nullable object prop → pass-through', () => {
    const comp = makeComponent({
      properties: [
        {
          name: 'sortState',
          rawType: 'TableSortState | null',
          litType: 'Object',
        },
      ],
      exportedTypes: [{ name: 'TableSortState', kind: 'interface' }],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('sortState?: TableSortState | null;');
  });

  it('component with no properties → empty interface with eslint-disable', () => {
    const comp = makeComponent({
      tagName: 'bp-menu-divider',
      properties: [],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain(
      '// eslint-disable-next-line @typescript-eslint/no-empty-object-type'
    );
    expect(output).toContain(
      'interface BpMenuDividerProps extends BaseHTMLAttributes {}'
    );
  });

  it('import generation → only imports referenced types', () => {
    const comp = makeComponent({
      properties: [
        { name: 'variant', rawType: 'ButtonVariant', litType: 'String' },
      ],
      exportedTypes: [
        { name: 'ButtonVariant', kind: 'type' },
        { name: 'ButtonSize', kind: 'type' },
      ],
    });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('ButtonVariant');
    expect(output).not.toMatch(
      /import.*ButtonSize.*from.*components\/test\/test/
    );
  });

  it('import generation → sorts alphabetically', () => {
    const compA = makeComponent({
      tagName: 'bp-zebra',
      componentName: 'zebra',
      sourceFile: 'components/zebra/zebra.ts',
      properties: [
        { name: 'variant', rawType: 'ZebraVariant', litType: 'String' },
      ],
      exportedTypes: [{ name: 'ZebraVariant', kind: 'type' }],
    });
    const compB = makeComponent({
      tagName: 'bp-alpha',
      componentName: 'alpha',
      sourceFile: 'components/alpha/alpha.ts',
      properties: [
        { name: 'size', rawType: 'AlphaSize', litType: 'String' },
      ],
      exportedTypes: [{ name: 'AlphaSize', kind: 'type' }],
    });
    const output = emitJsxDeclarations([compA, compB]);
    const alphaIdx = output.indexOf('components/alpha/alpha.js');
    const zebraIdx = output.indexOf('components/zebra/zebra.js');
    expect(alphaIdx).toBeLessThan(zebraIdx);
  });

  it('multiple components → sorted alphabetically in BlueprintElements', () => {
    const compZ = makeComponent({ tagName: 'bp-zebra' });
    const compA = makeComponent({ tagName: 'bp-alpha' });
    const output = emitJsxDeclarations([compZ, compA]);
    const alphaIdx = output.indexOf("'bp-alpha'");
    const zebraIdx = output.indexOf("'bp-zebra'");
    expect(alphaIdx).toBeLessThan(zebraIdx);
  });

  it('tag name → interface name conversion', () => {
    const comp = makeComponent({ tagName: 'bp-tab-panel' });
    const output = emitJsxDeclarations([comp]);
    expect(output).toContain('BpTabPanelProps');
  });

  it('output includes all three namespace augmentations', () => {
    const output = emitJsxDeclarations([]);
    expect(output).toContain('namespace astroHTML.JSX');
    expect(output).toContain('namespace JSX');
    expect(output).toContain("declare module 'solid-js'");
    expect(output).toContain('export {};');
  });
});
