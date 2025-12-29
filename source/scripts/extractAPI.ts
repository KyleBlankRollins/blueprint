import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

interface EventInfo {
  name: string;
  detail: string;
  description: string;
}

interface APIResult {
  success: boolean;
  properties: PropertyInfo[];
  events: EventInfo[];
  errors: string[];
}

function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

function extractProperties(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];

  // Match @property() decorators
  // Look for: @property({ options }) declare propertyName: type;
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line has @property decorator
    if (!line?.includes('@property')) {
      continue;
    }

    // Extract JSDoc from previous lines
    let description = '';
    let jsDocStart = -1;

    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const prevLine = lines[j]?.trim();
      if (prevLine?.includes('*/')) {
        // Found end of JSDoc, now find start
        for (let k = j; k >= Math.max(0, i - 20); k--) {
          if (lines[k]?.trim().includes('/**')) {
            jsDocStart = k;
            break;
          }
        }
        if (jsDocStart !== -1) {
          const jsDoc = lines.slice(jsDocStart, j + 1).join('\n');
          const descMatch = jsDoc.match(/\/\*\*\s*([\s\S]*?)\*\//);
          if (descMatch) {
            const jsDocContent = descMatch[1];
            const descLines = jsDocContent
              .split('\n')
              .map((l) => l.replace(/^\s*\*\s?/, '').trim())
              .filter((l) => l && !l.startsWith('@'));
            description = descLines.join(' ');
          }
        }
        break;
      }
    }

    // Extract property details from current and next line
    const propertyMatch = line.match(/@property\s*\(\s*\{([^}]*)\}\s*\)/);
    if (!propertyMatch) {
      continue;
    }

    // Look for property declaration on same line or next line
    let declarationLine = line;
    if (!line.includes('declare')) {
      declarationLine = lines[i + 1] || '';
    }

    const declMatch = declarationLine.match(
      /declare\s+(\w+)\s*:\s*([^;=]+)(?:\s*=\s*([^;]+))?;/
    );
    if (!declMatch) {
      continue;
    }

    if (!declMatch[1]) {
      continue;
    }

    const name = declMatch[1];
    const type = declMatch[2]?.trim() || 'unknown';
    let defaultValue = declMatch[3]?.trim() || '';

    // Clean up default value
    if (defaultValue) {
      defaultValue = defaultValue.replace(/^['"`]|['"`]$/g, '');
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

function extractEvents(content: string): EventInfo[] {
  const events: EventInfo[] = [];
  const eventNames = new Set<string>();

  // Match dispatchEvent calls with new CustomEvent
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

    // Try to extract detail type from options
    let detail = '';
    const detailMatch = options.match(/detail:\s*\{([^}]*)\}/);
    if (detailMatch) {
      detail = `{ ${detailMatch[1].trim()} }`;
    }

    // Look for JSDoc comments before the dispatchEvent call
    const eventIndex = match.index;
    const beforeEvent = content.substring(0, eventIndex);
    const lines = beforeEvent.split('\n');
    let description = '';

    // Check last 10 lines for JSDoc
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 15); i--) {
      const line = lines[i]?.trim();
      if (line?.includes('*/')) {
        // Found potential end of JSDoc
        let jsDocStart = -1;
        for (let j = i; j >= Math.max(0, i - 10); j--) {
          if (lines[j]?.trim().includes('/**')) {
            jsDocStart = j;
            break;
          }
        }

        if (jsDocStart !== -1) {
          const jsDoc = lines.slice(jsDocStart, i + 1).join('\n');
          const descMatch = jsDoc.match(/\/\*\*\s*([\s\S]*?)\*\//);
          if (descMatch) {
            const jsDocContent = descMatch[1];
            const descLines = jsDocContent
              .split('\n')
              .map((l) => l.replace(/^\s*\*\s?/, '').trim())
              .filter((l) => l && !l.startsWith('@'));
            description = descLines.join(' ');

            // Only use this JSDoc if it's close enough (within 5 lines)
            if (lines.length - i <= 5) {
              break;
            }
          }
        }
        break;
      }
    }

    if (!description) {
      // Generate a default description from event name
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

function formatMarkdownTable(headers: string[], rows: string[][]): string {
  // Normalize all rows to match headers length
  const normalizedRows = rows.map((row) => {
    const normalized = [...row];
    while (normalized.length < headers.length) {
      normalized.push('');
    }
    return normalized.slice(0, headers.length);
  });

  const columnWidths = headers.map((header, i) => {
    const cellWidths = normalizedRows.map((row) => row[i]!.length);
    return Math.max(header.length, ...cellWidths);
  });

  let table =
    '| ' +
    headers.map((h, i) => h.padEnd(columnWidths[i]!)).join(' | ') +
    ' |\n';
  table += '|' + columnWidths.map((w) => '-'.repeat(w + 2)).join('|') + '|\n';

  for (const row of normalizedRows) {
    table +=
      '| ' +
      row.map((cell, i) => cell.padEnd(columnWidths[i]!)).join(' | ') +
      ' |\n';
  }

  return table;
}

function extractAPI(componentName: string): APIResult {
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

  const content = readFileSync(componentPath, 'utf-8');

  const properties = extractProperties(content);
  const events = extractEvents(content);

  return {
    success: true,
    properties,
    events,
    errors: [],
  };
}

function formatOutput(result: APIResult, componentName: string): string {
  if (!result.success) {
    return `❌ ${result.errors.join('\n')}\n`;
  }

  let output = `Generated API documentation for bp-${componentName}:\n\n`;

  // Properties table
  if (result.properties.length > 0) {
    output += '### Properties\n\n';

    const headers = ['Property', 'Type', 'Default', 'Description'];
    const rows = result.properties.map((prop) => [
      `\`${prop.name}\``,
      prop.type ? `\`${prop.type}\`` : '',
      prop.defaultValue ? `\`${prop.defaultValue}\`` : '',
      prop.description || '',
    ]);

    output += formatMarkdownTable(headers, rows);
    output += '\n';
  }

  // Events table
  if (result.events.length > 0) {
    output += '### Events\n\n';

    const headers = ['Event', 'Detail', 'Description'];
    const rows = result.events.map((event) => [
      `\`${event.name}\``,
      event.detail !== '-' ? `\`${event.detail}\`` : '-',
      event.description,
    ]);

    output += formatMarkdownTable(headers, rows);
    output += '\n';
  }

  if (result.properties.length === 0 && result.events.length === 0) {
    output += 'No properties or events found in component.\n';
  } else {
    output += 'Copy this to README.md or enhance with additional details.\n';
  }

  return output;
}

// CLI interface
if (process.argv[2]) {
  const componentName = process.argv[2];

  if (!isValidComponentName(componentName)) {
    console.error(
      '❌ Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
    );
    process.exit(2);
  }

  const result = extractAPI(componentName);
  console.log(formatOutput(result, componentName));
  process.exit(result.success ? 0 : 1);
} else {
  console.error('Usage: npm run extract-api <component-name>');
  console.error('Example: npm run extract-api button');
  process.exit(2);
}
