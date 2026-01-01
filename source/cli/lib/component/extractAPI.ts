import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Constants for JSDoc extraction
const JSDOC_SEARCH_LINES = 10;
const JSDOC_START_SEARCH_LINES = 20;
const JSDOC_PROXIMITY_THRESHOLD = 5;

/**
 * Information about a component property.
 */
export interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

/**
 * Information about a component event.
 */
export interface EventInfo {
  name: string;
  detail: string;
  description: string;
}

/**
 * Result of API extraction operation.
 */
export interface APIResult {
  success: boolean;
  properties: PropertyInfo[];
  events: EventInfo[];
  errors: string[];
}

/**
 * Validates component name format (kebab-case).
 * @param name - Component name to validate
 * @returns True if valid kebab-case format
 */
export function isValidComponentName(name: string): boolean {
  // Prevent path traversal attacks
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return false;
  }
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

/**
 * Extracts JSDoc comment before a given line.
 * @param lines - All file lines
 * @param startLine - Line to search backwards from
 * @returns Object containing description and @default value if present
 */
function extractJSDoc(
  lines: string[],
  startLine: number
): { description: string; defaultValue: string } {
  for (
    let lineIndex = startLine - 1;
    lineIndex >= Math.max(0, startLine - JSDOC_SEARCH_LINES);
    lineIndex--
  ) {
    const line = lines[lineIndex]?.trim();

    if (line?.includes('*/')) {
      let jsDocStart = -1;
      for (
        let searchIndex = lineIndex;
        searchIndex >= Math.max(0, lineIndex - JSDOC_START_SEARCH_LINES);
        searchIndex--
      ) {
        if (lines[searchIndex]?.trim().includes('/**')) {
          jsDocStart = searchIndex;
          break;
        }
      }

      if (jsDocStart !== -1) {
        const jsDoc = lines.slice(jsDocStart, lineIndex + 1).join('\n');
        const descMatch = jsDoc.match(/\/\*\*([\s\S]*?)\*\//);

        if (descMatch) {
          const jsDocContent = descMatch[1];
          const jsDocLines = jsDocContent
            .split('\n')
            .map((line) => line.replace(/^\s*\*\s?/, '').trim())
            .filter((line) => line);

          // Extract description (lines before @tags)
          const description = jsDocLines
            .filter((line) => !line.startsWith('@'))
            .join(' ');

          // Extract @default value if present
          let defaultValue = '';
          const defaultMatch = jsDocContent.match(/@default\s+(.+)/);
          if (defaultMatch) {
            // Extract value and remove surrounding quotes if present
            defaultValue =
              defaultMatch[1]?.trim().replace(/^['"`]|['"`]$/g, '') || '';
          }

          return { description, defaultValue };
        }
      }
      break;
    }
  }
  return { description: '', defaultValue: '' };
}

/**
 * Extracts property information from component source code.
 * @param content - Component file content
 * @returns Array of property information objects
 */
function extractProperties(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const lines = content.split('\n');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    if (!line?.includes('@property')) {
      continue;
    }

    // Extract JSDoc description and default value
    const { description, defaultValue: jsDocDefault } = extractJSDoc(
      lines,
      lineIndex
    );

    // Extract property details from current and next line
    const propertyMatch = line.match(/@property\s*\(\s*\{([^}]*)\}\s*\)/);
    if (!propertyMatch) {
      continue;
    }

    // Look for property declaration on same line or next line
    let declarationStartIndex = lineIndex;
    let declarationStartCol = 0;

    if (line.includes('declare')) {
      // @property and declare on same line - find where 'declare' starts
      const declareIndex = line.indexOf('declare');
      if (declareIndex !== -1) {
        declarationStartCol = declareIndex;
      }
    } else {
      // declare is on the next line
      declarationStartIndex = lineIndex + 1;
    }

    // Extract property name
    const declareLine = lines[declarationStartIndex] || '';
    const declareContent = declareLine.substring(declarationStartCol);
    const nameMatch = declareContent.match(/declare\s+(\w+)\s*:/);
    if (!nameMatch?.[1]) {
      continue;
    }

    const name = nameMatch[1];

    // Extract multi-line type declaration starting from 'declare'
    let type = '';
    let currentIndex = declarationStartIndex;
    let foundSemicolon = false;

    // Collect lines until we find the semicolon
    while (currentIndex < lines.length && !foundSemicolon) {
      const currentLine = lines[currentIndex] || '';

      // For first line, only take content from 'declare' onwards
      if (currentIndex === declarationStartIndex) {
        type += currentLine.substring(declarationStartCol);
      } else {
        type += ' ' + currentLine.trim();
      }

      if (currentLine.includes(';')) {
        foundSemicolon = true;
      }
      currentIndex++;
    }

    // Extract just the type part (after : and before ; or =)
    const typeMatch = type.match(/:\s*([^;=]+)(?:[;=])/);
    if (typeMatch) {
      type = typeMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && line !== '|') // Remove empty lines and standalone pipes
        .join(' ')
        .replace(/\s*\|\s*/g, ' | ') // Normalize pipe separators
        .replace(/^\|\s*/, '') // Remove leading pipe
        .trim();
    } else {
      type = 'unknown';
    }

    // Try to find default value from inline assignment (e.g., = 'value')
    let defaultValue = '';
    const inlineDefaultMatch = type.match(/=\s*([^;]+)/);
    if (inlineDefaultMatch) {
      defaultValue = inlineDefaultMatch[1].trim().replace(/^['"`]|['"`]$/g, '');
      // Remove the default assignment from the type
      type = type.split('=')[0]?.trim() || type;
    }

    // Prefer JSDoc @default over inline default
    if (jsDocDefault) {
      defaultValue = jsDocDefault;
    }

    properties.push({
      name,
      type,
      defaultValue,
      description,
    });
  }

  return properties;
}

/**
 * Extracts event information from component source code.
 * Looks for CustomEvent dispatch patterns.
 * @param content - Component file content
 * @returns Array of event information objects
 */
function extractEvents(content: string): EventInfo[] {
  const events: EventInfo[] = [];
  const eventNames = new Set<string>();

  // Match pattern: this.dispatchEvent(new CustomEvent('event-name', { ...options }))
  const dispatchPattern =
    /this\.dispatchEvent\s*\(\s*new\s+CustomEvent\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)\s*\)/g;

  let match;
  while ((match = dispatchPattern.exec(content)) !== null) {
    const eventName = match[1];
    const options = match[2] || '';

    if (!eventName || eventNames.has(eventName)) {
      continue;
    }

    eventNames.add(eventName);

    let detail = '';
    const detailMatch = options.match(/detail:\s*\{([^}]*)\}/);
    if (detailMatch) {
      detail = `{ ${detailMatch[1].trim()} }`;
    }

    const eventIndex = match.index;
    const beforeEvent = content.substring(0, eventIndex);
    const lines = beforeEvent.split('\n');

    // Extract JSDoc description (check proximity to dispatch)
    const { description: jsDocDescription } = extractJSDoc(lines, lines.length);
    let description = jsDocDescription;

    // Only use JSDoc if it's close to the event dispatch (within 5 lines)
    const lastJSDocLine = lines.length - 1;
    let foundJSDoc = false;
    for (
      let lineIndex = lastJSDocLine;
      lineIndex >= Math.max(0, lastJSDocLine - JSDOC_PROXIMITY_THRESHOLD);
      lineIndex--
    ) {
      if (lines[lineIndex]?.trim().includes('*/')) {
        foundJSDoc = true;
        break;
      }
    }

    if (!foundJSDoc) {
      description = '';
    }

    if (!description) {
      const eventAction = eventName.replace(/^bp-/, '').replace(/-/g, ' ');
      description = `Fired when ${eventAction} occurs`;
    }

    events.push({
      name: eventName,
      detail: detail || '-',
      description,
    });
  }

  return events;
}

/**
 * Formats data as a Markdown table.
 * @param headers - Column headers
 * @param rows - Table rows
 * @returns Formatted Markdown table string
 */
export function formatMarkdownTable(
  headers: string[],
  rows: string[][]
): string {
  const normalizedRows = rows.map((row) => {
    const normalized = [...row];
    while (normalized.length < headers.length) {
      normalized.push('');
    }
    return normalized.slice(0, headers.length);
  });

  const columnWidths = headers.map((header, columnIndex) => {
    const cellWidths = normalizedRows.map((row) => row[columnIndex]!.length);
    return Math.max(header.length, ...cellWidths);
  });

  const tableParts = [
    '| ' +
      headers
        .map((header, columnIndex) => header.padEnd(columnWidths[columnIndex]!))
        .join(' | ') +
      ' |',
    '|' + columnWidths.map((width) => '-'.repeat(width + 2)).join('|') + '|',
    ...normalizedRows.map(
      (row) =>
        '| ' +
        row
          .map((cell, columnIndex) => cell.padEnd(columnWidths[columnIndex]!))
          .join(' | ') +
        ' |'
    ),
  ];

  return tableParts.join('\n') + '\n';
}

/**
 * Extracts API documentation from a component file.
 * @param componentName - Name of the component (kebab-case)
 * @returns API extraction result with properties, events, and errors
 */
export function extractAPI(componentName: string): APIResult {
  // Validate component name format
  if (!isValidComponentName(componentName)) {
    return {
      success: false,
      properties: [],
      events: [],
      errors: [`Invalid component name: ${componentName}. Must be kebab-case.`],
    };
  }

  const root = process.cwd();
  const componentPath = join(
    root,
    'source',
    'components',
    componentName,
    `${componentName}.ts`
  );

  if (!existsSync(componentPath)) {
    return {
      success: false,
      properties: [],
      events: [],
      errors: [`Component file not found: ${componentName}.ts`],
    };
  }

  try {
    const content = readFileSync(componentPath, 'utf-8');
    const properties = extractProperties(content);
    const events = extractEvents(content);

    return {
      success: true,
      properties,
      events,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      properties: [],
      events: [],
      errors: [
        `Failed to parse component file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}
