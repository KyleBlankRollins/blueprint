import { describe, it, expect } from 'vitest';
import { discoverComponents, parseComponentFile } from '../jsxParser.js';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..', '..', '..', '..');

describe('discoverComponents', () => {
  it('returns all component directories', () => {
    const components = discoverComponents(ROOT);
    expect(components).toContain('button');
    expect(components).toContain('tabs');
    expect(components).toContain('menu');
    expect(components).toContain('drawer');
    expect(components).toContain('slider');
    expect(components).toContain('table');
    expect(components.length).toBeGreaterThan(30);
  });

  it('skips non-directory entries like index.ts', () => {
    const components = discoverComponents(ROOT);
    expect(components).not.toContain('index.ts');
    for (const name of components) {
      expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});

describe('parseComponentFile', () => {
  it('parses button.ts into 1 ComponentInfo with correct properties', () => {
    const infos = parseComponentFile(ROOT, 'button');
    expect(infos).toHaveLength(1);

    const btn = infos[0];
    expect(btn.tagName).toBe('bp-button');
    expect(btn.className).toBe('BpButton');
    expect(btn.componentName).toBe('button');

    const propNames = btn.properties.map((p) => p.name);
    expect(propNames).toContain('variant');
    expect(propNames).toContain('size');
    expect(propNames).toContain('disabled');
    expect(propNames).toContain('type');

    const disabledProp = btn.properties.find((p) => p.name === 'disabled');
    expect(disabledProp?.litType).toBe('Boolean');
  });

  it('extracts exported types from button.ts', () => {
    const infos = parseComponentFile(ROOT, 'button');
    const typeNames = infos[0].exportedTypes.map((t) => t.name);
    expect(typeNames).toContain('ButtonVariant');
    expect(typeNames).toContain('ButtonSize');

    const bv = infos[0].exportedTypes.find((t) => t.name === 'ButtonVariant');
    expect(bv?.kind).toBe('type');
  });

  it('parses tabs.ts into 2 ComponentInfos (bp-tabs, bp-tab-panel)', () => {
    const infos = parseComponentFile(ROOT, 'tabs');
    expect(infos).toHaveLength(2);

    const tagNames = infos.map((i) => i.tagName);
    expect(tagNames).toContain('bp-tabs');
    expect(tagNames).toContain('bp-tab-panel');

    const panel = infos.find((i) => i.tagName === 'bp-tab-panel')!;
    expect(panel.properties.map((p) => p.name)).toContain('tabId');
  });

  it('parses menu.ts into 3 ComponentInfos', () => {
    const infos = parseComponentFile(ROOT, 'menu');
    expect(infos).toHaveLength(3);

    const tagNames = infos.map((i) => i.tagName);
    expect(tagNames).toContain('bp-menu');
    expect(tagNames).toContain('bp-menu-item');
    expect(tagNames).toContain('bp-menu-divider');

    const divider = infos.find((i) => i.tagName === 'bp-menu-divider')!;
    expect(divider.properties).toHaveLength(0);
  });

  it('excludes private properties from drawer.ts', () => {
    const infos = parseComponentFile(ROOT, 'drawer');
    const propNames = infos[0].properties.map((p) => p.name);
    expect(propNames).not.toContain('hasHeader');
    expect(propNames).not.toContain('hasFooter');
  });

  it('excludes attribute:false properties from slider.ts', () => {
    const infos = parseComponentFile(ROOT, 'slider');
    const propNames = infos[0].properties.map((p) => p.name);
    expect(propNames).not.toContain('formatValue');
    expect(propNames).toContain('value');
    expect(propNames).toContain('min');
  });

  it('uses JS property name showClose (not show-close)', () => {
    const infos = parseComponentFile(ROOT, 'drawer');
    const propNames = infos[0].properties.map((p) => p.name);
    expect(propNames).toContain('showClose');
    expect(propNames).not.toContain('show-close');
  });

  it('handles array/object types in table.ts', () => {
    const infos = parseComponentFile(ROOT, 'table');

    const columns = infos[0].properties.find((p) => p.name === 'columns');
    expect(columns?.litType).toBe('Array');

    const sortState = infos[0].properties.find((p) => p.name === 'sortState');
    expect(sortState?.litType).toBe('Object');

    const typeNames = infos[0].exportedTypes.map((t) => t.name);
    expect(typeNames).toContain('TableColumn');
    expect(typeNames).toContain('TableSortState');
  });

  it('parses all discovered components without errors', () => {
    const components = discoverComponents(ROOT);
    for (const name of components) {
      expect(() => parseComponentFile(ROOT, name)).not.toThrow();
      const infos = parseComponentFile(ROOT, name);
      expect(infos.length).toBeGreaterThanOrEqual(1);
    }
  });
});
