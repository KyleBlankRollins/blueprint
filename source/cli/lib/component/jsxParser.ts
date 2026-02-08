import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/** Represents one parsed component (or sub-component) */
export interface ComponentInfo {
  tagName: string;
  className: string;
  componentName: string;
  sourceFile: string;
  properties: PropertyDef[];
  exportedTypes: ExportedType[];
}

/** A single @property() declaration */
export interface PropertyDef {
  name: string;
  rawType: string;
  litType: string;
}

/** A type alias or interface exported from the component file */
export interface ExportedType {
  name: string;
  kind: 'type' | 'interface';
}

/**
 * Scan source/components/ for valid component directories.
 * A valid directory contains a matching .ts file (e.g., button/button.ts).
 */
export function discoverComponents(rootDir: string): string[] {
  const componentsDir = join(rootDir, 'source', 'components');
  const entries = readdirSync(componentsDir);
  const components: string[] = [];

  for (const entry of entries) {
    const fullPath = join(componentsDir, entry);
    if (!statSync(fullPath).isDirectory()) continue;
    if (existsSync(join(fullPath, `${entry}.ts`))) {
      components.push(entry);
    }
  }

  return components.sort();
}

/**
 * Extract the Lit type from a @property() options string.
 */
function extractLitType(opts: string): string {
  const m = opts.match(/type:\s*(String|Boolean|Number|Array|Object)/);
  return m ? m[1] : 'String';
}

/**
 * Check if @property() options contain attribute: false.
 */
function hasAttributeFalse(opts: string): boolean {
  return /attribute:\s*false/.test(opts);
}

/**
 * Collect the @property({...}) options string, handling multi-line decorators.
 * Returns [optionsString, endLineIndex] or null.
 */
function collectPropertyOptions(
  lines: string[],
  startIndex: number
): [string, number] | null {
  const firstLine = lines[startIndex];
  if (!firstLine) return null;

  const propStart = firstLine.indexOf('@property');
  if (propStart === -1) return null;

  let collected = firstLine.substring(propStart);
  let parenDepth = 0;
  let foundOpen = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = i === startIndex ? firstLine.substring(propStart) : lines[i];
    if (line === undefined) continue;
    if (i !== startIndex) collected += '\n' + line;

    for (const ch of line) {
      if (ch === '(') {
        parenDepth++;
        foundOpen = true;
      } else if (ch === ')') {
        parenDepth--;
        if (foundOpen && parenDepth === 0) {
          const optMatch = collected.match(
            /@property\s*\(\s*\{([\s\S]*)\}\s*\)/
          );
          return [optMatch ? optMatch[1] : '', i];
        }
      }
    }
  }

  return null;
}

/**
 * Collect the type declaration from after `declare` to semicolon.
 * Handles multi-line union types.
 */
function collectTypeDeclaration(
  lines: string[],
  startIndex: number,
  startCol: number
): string {
  let type = '';

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i] || '';
    if (i === startIndex) {
      type += line.substring(startCol);
    } else {
      type += ' ' + line.trim();
    }
    if (line.includes(';')) break;
  }

  // Match type between : and ; or = (for assignment-style properties)
  const typeMatch = type.match(/[?]?\s*:\s*([\s\S]+?)(?:\s*[;=])/);
  if (!typeMatch) return 'unknown';

  return (
    typeMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && l !== '|')
      .join(' ')
      .replace(/\s*\|\s*/g, ' | ')
      .replace(/^\s*\|\s*/, '')
      .trim() || 'unknown'
  );
}

/**
 * Parse a single component source file, returning one ComponentInfo per
 * @customElement() found.
 */
export function parseComponentFile(
  rootDir: string,
  componentName: string
): ComponentInfo[] {
  const componentPath = join(
    rootDir,
    'source',
    'components',
    componentName,
    `${componentName}.ts`
  );
  if (!existsSync(componentPath)) return [];

  const content = readFileSync(componentPath, 'utf-8');
  const lines = content.split('\n');
  const sourceFile = `components/${componentName}/${componentName}.ts`;

  // Extract exported types (file-level, shared across all components in file)
  const exportedTypes: ExportedType[] = [];

  const typeAliasRegex = /export\s+type\s+(\w+)\s*=/g;
  let m: RegExpExecArray | null;
  while ((m = typeAliasRegex.exec(content)) !== null) {
    if (m[1]) exportedTypes.push({ name: m[1], kind: 'type' });
  }

  const interfaceRegex = /export\s+interface\s+(\w+)/g;
  while ((m = interfaceRegex.exec(content)) !== null) {
    if (m[1]) exportedTypes.push({ name: m[1], kind: 'interface' });
  }

  // Identify all @customElement + class pairs
  interface ClassDef {
    tagName: string;
    className: string;
    startLine: number;
  }

  const classDefs: ClassDef[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const ceMatch = line.match(/@customElement\(\s*['"](.+?)['"]\s*\)/);
    if (!ceMatch?.[1]) continue;

    const tagName = ceMatch[1];

    // Look for the class declaration on same line or next few lines
    for (let j = i; j < Math.min(i + 5, lines.length); j++) {
      const classLine = lines[j];
      if (!classLine) continue;
      const classMatch = classLine.match(
        /class\s+(\w+)\s+extends\s+\w*(?:Lit)?Element/
      );
      if (classMatch?.[1]) {
        classDefs.push({ tagName, className: classMatch[1], startLine: j });
        break;
      }
    }
  }

  // Build result array
  const result: ComponentInfo[] = classDefs.map((cd) => ({
    tagName: cd.tagName,
    className: cd.className,
    componentName,
    sourceFile,
    properties: [],
    exportedTypes,
  }));

  // Determine which class owns a given line
  function ownerIndex(lineIndex: number): number {
    let best = -1;
    for (let k = 0; k < classDefs.length; k++) {
      if (classDefs[k].startLine <= lineIndex) best = k;
    }
    return best;
  }

  // Scan for @property() declarations
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !/@property\s*\(/.test(line)) continue;

    const optionsResult = collectPropertyOptions(lines, i);
    if (!optionsResult) continue;

    const [optionsStr, decoratorEndLine] = optionsResult;

    if (hasAttributeFalse(optionsStr)) continue;
    const litType = extractLitType(optionsStr);

    // Find the property declaration after the decorator closing paren.
    // Two patterns:
    //   1. @property({...}) declare propName: Type;
    //   2. @property({...}) propName: Type = value;  (or propName?: Type;)
    let propLine = -1;
    let propCol = 0;
    let isPrivate = false;
    let useDeclare = false;

    for (
      let j = decoratorEndLine;
      j < Math.min(decoratorEndLine + 5, lines.length);
      j++
    ) {
      const ln = lines[j] || '';

      // Check for private keyword in the text after the decorator
      const afterDecorator =
        j === decoratorEndLine
          ? ln.substring(ln.lastIndexOf(')') + 1)
          : ln;

      if (/\bprivate\b/.test(afterDecorator)) {
        isPrivate = true;
        break;
      }

      // Pattern 1: declare keyword
      const declareIdx = ln.indexOf('declare');
      if (declareIdx !== -1) {
        propLine = j;
        propCol = declareIdx;
        useDeclare = true;
        break;
      }

      // Pattern 2: property name directly after the decorator closing paren
      // Look for identifier followed by colon or question mark
      if (j === decoratorEndLine) {
        // Text after the last closing paren on the decorator end line
        const lastParen = ln.lastIndexOf(')');
        const rest = ln.substring(lastParen + 1).trim();
        const directMatch = rest.match(/^(\w+)\s*[?:]|^([\w]+)\s*[?:]/);
        if (directMatch) {
          propLine = j;
          propCol = ln.indexOf(directMatch[1] || directMatch[2], lastParen);
          useDeclare = false;
          break;
        }
      } else {
        // Next line: look for a standalone property declaration
        const trimmed = ln.trim();
        const nextLineMatch = trimmed.match(/^(\w+)\s*[?:]/);
        if (nextLineMatch) {
          propLine = j;
          propCol = ln.indexOf(nextLineMatch[1]);
          useDeclare = false;
          break;
        }
      }
    }

    if (isPrivate || propLine === -1) continue;

    const propContent = (lines[propLine] || '').substring(propCol);
    const nameMatch = useDeclare
      ? propContent.match(/declare\s+(\w+)\s*[?:\s]/)
      : propContent.match(/^(\w+)\s*[?:]/);
    if (!nameMatch?.[1]) continue;

    const propName = nameMatch[1];
    const rawType = collectTypeDeclaration(lines, propLine, propCol);

    const owner = ownerIndex(i);
    if (owner >= 0 && result[owner]) {
      result[owner].properties.push({ name: propName, rawType, litType });
    }
  }

  return result;
}
