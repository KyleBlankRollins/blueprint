import type { ComponentInfo, PropertyDef, ExportedType } from './jsxParser.js';

const HEADER = `/**
 * JSX type declarations for Blueprint components.
 *
 * This file augments global JSX namespaces so that Blueprint custom elements
 * have proper IntelliSense in JSX/TSX environments (Astro, React, Solid, etc.).
 *
 * For HTML environments, the HTMLElementTagNameMap declarations in each
 * component file provide type information.
 *
 * ⚠️  AUTO-GENERATED — DO NOT EDIT
 * Run \`npx bp generate jsx\` to regenerate from component source files.
 */`;

const HELPER_TYPES = `interface BaseHTMLAttributes {
  id?: string;
  class?: string;
  style?: string;
  slot?: string;
  hidden?: boolean;
  title?: string;
  children?: unknown;
  onclick?: string | ((event: MouseEvent) => void);
  onchange?: string | ((event: Event) => void);
  oninput?: string | ((event: Event) => void);
  onfocus?: string | ((event: FocusEvent) => void);
  onblur?: string | ((event: FocusEvent) => void);
  onkeydown?: string | ((event: KeyboardEvent) => void);
  onkeyup?: string | ((event: KeyboardEvent) => void);
  onsubmit?: string | ((event: Event) => void);
}

type StringAttr<T extends string> = T | (string & {});
type BooleanAttr = boolean | 'true' | 'false' | '';
type NumberAttr<T extends number = number> = T | \`\${number}\`;`;

const NAMESPACE_AUGMENTATIONS = `declare global {
  namespace astroHTML.JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

declare module 'solid-js' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

export {};`;

/**
 * Convert a tag name like 'bp-tab-panel' to 'BpTabPanelProps'.
 */
function tagToInterfaceName(tagName: string): string {
  return (
    tagName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Props'
  );
}

/**
 * Extract individual type names referenced in a rawType string.
 * E.g., 'TableSortState | null' → ['TableSortState']
 * E.g., 'IconName | ""' → ['IconName']
 */
function extractReferencedTypeNames(rawType: string): string[] {
  const names: string[] = [];
  // Match PascalCase identifiers (but not built-in types)
  const builtins = new Set([
    'boolean',
    'string',
    'number',
    'null',
    'undefined',
    'unknown',
    'void',
    'never',
    'any',
    'object',
    'String',
    'Boolean',
    'Number',
    'Array',
    'Object',
    'MouseEvent',
    'Event',
    'FocusEvent',
    'KeyboardEvent',
    'HTMLElement',
    'TemplateResult',
  ]);
  const matches = rawType.match(/\b[A-Z][A-Za-z0-9]+\b/g);
  if (matches) {
    for (const m of matches) {
      if (!builtins.has(m)) names.push(m);
    }
  }
  return [...new Set(names)];
}

/**
 * Map a property's rawType to the JSX prop type string.
 */
function mapPropertyType(
  prop: PropertyDef,
  exportedTypes: ExportedType[]
): string {
  // Strip `| undefined` since all props are optional (?), and clean up leading pipes
  const raw = prop.rawType
    .trim()
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/^\|\s*/, '')
    .trim();

  if (raw === 'boolean') return 'BooleanAttr';
  if (raw === 'number') return 'NumberAttr';
  if (raw === 'string') return 'string';

  // Array types pass through
  if (raw.endsWith('[]')) return raw;

  // Nullable non-string-union: strip | null, map base, re-add | null
  if (raw.includes('| null')) {
    const base = raw.replace(/\s*\|\s*null/g, '').trim();
    // Check if the base is a string literal union
    if (base.includes("'") || base.includes('"')) {
      // It's a string union with null — map the base as StringAttr
      return `StringAttr<${base}> | null`;
    }
    // Check if it's a named type
    const namedType = exportedTypes.find((t) => t.name === base);
    if (namedType) {
      if (namedType.kind === 'interface') return raw; // pass through
      if (prop.litType === 'Number') return `NumberAttr<${base}> | null`;
      return `StringAttr<${base}> | null`;
    }
    // Pass through (object types, etc.)
    return raw;
  }

  // Single PascalCase identifier that's an exported type alias
  if (/^[A-Z][A-Za-z0-9]+$/.test(raw)) {
    const namedType = exportedTypes.find((t) => t.name === raw);
    if (namedType) {
      if (namedType.kind === 'interface') return raw;
      if (prop.litType === 'Number') return `NumberAttr<${raw}>`;
      return `StringAttr<${raw}>`;
    }
    // Not in our exported types — can't import it, fall back to primitive
    if (prop.litType === 'Boolean') return 'BooleanAttr';
    if (prop.litType === 'Number') return 'NumberAttr';
    return 'string';
  }

  // Compound type with | (union of IconName | '', string literals, etc.)
  if (raw.includes('|')) {
    // Check if it contains string literals or type aliases used with String
    if (prop.litType === 'String' || prop.litType === 'Number') {
      if (prop.litType === 'Number') return `NumberAttr<${raw}>`;
      return `StringAttr<${raw}>`;
    }
  }

  // Anything else — pass through
  return raw;
}

/**
 * Generate the complete jsx.d.ts content from parsed components.
 */
export function emitJsxDeclarations(components: ComponentInfo[]): string {
  const sorted = [...components].sort((a, b) =>
    a.tagName.localeCompare(b.tagName)
  );
  const sections: string[] = [];

  // Section 1: Header
  sections.push(HEADER);

  // Section 2: Imports
  const imports = generateImports(sorted);
  if (imports) sections.push(imports);

  // Section 3: Helper types
  sections.push(HELPER_TYPES);

  // Section 4: Component prop interfaces
  const interfaces = generateInterfaces(sorted);
  if (interfaces) sections.push(interfaces);

  // Section 5: BlueprintElements map
  sections.push(generateElementsMap(sorted));

  // Section 6: Namespace augmentations
  sections.push(NAMESPACE_AUGMENTATIONS);

  return sections.join('\n\n') + '\n';
}

/**
 * Generate import statements.
 */
function generateImports(components: ComponentInfo[]): string {
  // Collect all referenced types grouped by source file
  const importsByFile = new Map<string, Set<string>>();
  let needsIconName = false;

  for (const comp of components) {
    for (const prop of comp.properties) {
      const refNames = extractReferencedTypeNames(prop.rawType);

      for (const refName of refNames) {
        if (refName === 'IconName') {
          needsIconName = true;
          continue;
        }
        // Check if this name is in the component's exported types
        const exported = comp.exportedTypes.find((t) => t.name === refName);
        if (exported) {
          const importPath = `./${comp.sourceFile.replace('.ts', '.js')}`;
          if (!importsByFile.has(importPath)) {
            importsByFile.set(importPath, new Set());
          }
          importsByFile.get(importPath)!.add(refName);
        }
      }
    }
  }

  // Special IconName import path
  const iconNamePath = './components/icon/icons/icon-name.generated.js';
  if (needsIconName) {
    if (!importsByFile.has(iconNamePath)) {
      importsByFile.set(iconNamePath, new Set());
    }
    importsByFile.get(iconNamePath)!.add('IconName');
  }

  // Build import lines sorted by path
  const importLines: string[] = [];
  const sortedPaths = [...importsByFile.keys()].sort();

  for (const path of sortedPaths) {
    const types = [...importsByFile.get(path)!].sort();
    if (types.length === 1) {
      importLines.push(`import type { ${types[0]} } from '${path}';`);
    } else {
      importLines.push(
        `import type {\n  ${types.join(',\n  ')},\n} from '${path}';`
      );
    }
  }

  return importLines.join('\n');
}

/**
 * Generate component prop interfaces.
 */
function generateInterfaces(components: ComponentInfo[]): string {
  const lines: string[] = [];

  for (const comp of components) {
    const interfaceName = tagToInterfaceName(comp.tagName);

    if (comp.properties.length === 0) {
      lines.push(
        `// eslint-disable-next-line @typescript-eslint/no-empty-object-type\ninterface ${interfaceName} extends BaseHTMLAttributes {}`
      );
    } else {
      const propLines = comp.properties.map((prop) => {
        const jsxType = mapPropertyType(prop, comp.exportedTypes);
        return `  ${prop.name}?: ${jsxType};`;
      });
      lines.push(
        `interface ${interfaceName} extends BaseHTMLAttributes {\n${propLines.join('\n')}\n}`
      );
    }
  }

  return lines.join('\n\n');
}

/**
 * Generate the BlueprintElements map.
 */
function generateElementsMap(components: ComponentInfo[]): string {
  const entries = components.map((comp) => {
    const interfaceName = tagToInterfaceName(comp.tagName);
    return `  '${comp.tagName}': ${interfaceName};`;
  });

  return `export interface BlueprintElements {\n${entries.join('\n')}\n}`;
}
