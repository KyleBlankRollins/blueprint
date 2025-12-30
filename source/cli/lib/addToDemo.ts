import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
}

export interface DemoResult {
  success: boolean;
  examples: string[];
  errors: string[];
}

/**
 * Validates component name format (kebab-case).
 * @param name - Component name to validate
 * @returns True if valid kebab-case format
 */
export function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

/**
 * Capitalizes the first letter of a string.
 * @param str - String to capitalize
 * @returns Capitalized string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractProperties(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const lines = content.split('\n');

  for (
    let currentLineIndex = 0;
    currentLineIndex < lines.length;
    currentLineIndex++
  ) {
    const line = lines[currentLineIndex];

    if (!line?.includes('@property')) {
      continue;
    }

    let fullDeclaration = line;
    const afterDecorator = line.split(')').slice(1).join(')');
    if (!afterDecorator.includes(':')) {
      fullDeclaration = line + '\n' + (lines[currentLineIndex + 1] || '');
    }

    // Match pattern: @property(...) [declare] propertyName: type [= defaultValue];
    const declarationMatch = fullDeclaration.match(
      /@property\([^)]*\)\s+(?:declare\s+)?(\w+)\s*:\s*([^;=]+)(?:\s*=\s*([^;]+))?;?/
    );

    if (!declarationMatch || !declarationMatch[1]) {
      continue;
    }

    const name = declarationMatch[1];
    const type = declarationMatch[2]?.trim() || 'unknown';
    let defaultValue = declarationMatch[3]?.trim() || '';

    if (defaultValue) {
      defaultValue = defaultValue.replace(/^['"`]|['"`]$/g, '');
    }

    properties.push({
      name,
      type,
      defaultValue,
    });
  }

  return properties;
}

function parseEnumType(type: string): string[] {
  const matches = Array.from(type.matchAll(/['"`]([^'"`]+)['"`]/g));
  return matches.map((match) => match[1]!);
}

function generateExamples(properties: PropertyInfo[]): string[] {
  const examples: string[] = [];

  const variantProp = properties.find(
    (prop) => prop.name === 'variant' || prop.name.includes('variant')
  );
  const sizeProp = properties.find(
    (prop) => prop.name === 'size' || prop.name.includes('size')
  );
  const booleanProps = properties.filter((prop) =>
    prop.type.toLowerCase().includes('boolean')
  );

  examples.push('Default');

  if (variantProp) {
    const variants = parseEnumType(variantProp.type);
    for (const variant of variants) {
      if (variant !== variantProp.defaultValue) {
        examples.push(`${capitalize(variant)} variant`);
      }
    }
  }

  if (sizeProp) {
    const sizes = parseEnumType(sizeProp.type);
    for (const size of sizes) {
      if (size !== sizeProp.defaultValue && size !== 'medium') {
        examples.push(`${capitalize(size)} size`);
      }
    }
  }

  for (const boolProp of booleanProps) {
    examples.push(`${capitalize(boolProp.name)} state`);
  }

  return examples;
}

function generateHTML(
  componentName: string,
  properties: PropertyInfo[]
): string {
  const tagName = `bp-${componentName}`;
  const titleName = componentName
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');

  const variantProp = properties.find(
    (prop) => prop.name === 'variant' || prop.name.includes('variant')
  );
  const sizeProp = properties.find(
    (prop) => prop.name === 'size' || prop.name.includes('size')
  );
  const booleanProps = properties.filter((prop) =>
    prop.type.toLowerCase().includes('boolean')
  );

  const htmlParts: string[] = [
    `      <div class="section" id="component-${componentName}">\n`,
    `        <h2>${titleName}</h2>\n`,
    `        <div class="examples">\n`,
    `          <div>\n`,
    `            <p><strong>Default:</strong></p>\n`,
    `            <${tagName}>Click me</${tagName}>\n`,
    `          </div>\n`,
  ];

  if (variantProp) {
    const variants = parseEnumType(variantProp.type);
    for (const variant of variants) {
      if (variant !== variantProp.defaultValue) {
        htmlParts.push(
          `\n          <div>\n`,
          `            <p><strong>${capitalize(variant)} variant:</strong></p>\n`,
          `            <${tagName} variant="${variant}">Click me</${tagName}>\n`,
          `          </div>\n`
        );
      }
    }
  }

  if (sizeProp) {
    const sizes = parseEnumType(sizeProp.type);
    for (const size of sizes) {
      if (size !== sizeProp.defaultValue && size !== 'medium') {
        const sizeAttr = sizeProp.name === 'size' ? 'size' : sizeProp.name;
        htmlParts.push(
          `\n          <div>\n`,
          `            <p><strong>${capitalize(size)} size:</strong></p>\n`,
          `            <${tagName} ${sizeAttr}="${size}">Click me</${tagName}>\n`,
          `          </div>\n`
        );
      }
    }
  }

  for (const boolProp of booleanProps) {
    htmlParts.push(
      `\n          <div>\n`,
      `            <p><strong>${capitalize(boolProp.name)} state:</strong></p>\n`,
      `            <${tagName} ${boolProp.name}>Click me</${tagName}>\n`,
      `          </div>\n`
    );
  }

  htmlParts.push(`        </div>\n`, `      </div>\n`);

  return htmlParts.join('');
}

/**
 * Adds component examples to the demo HTML page.
 * @param componentName - Name of the component (kebab-case)
 * @returns Result with success status, examples created, and any errors
 */
export function addToDemo(componentName: string): DemoResult {
  const root = process.cwd();
  const componentPath = join(
    root,
    'source',
    'components',
    componentName,
    `${componentName}.ts`
  );
  const demoPath = join(root, 'demo', 'index.html');

  if (!existsSync(componentPath)) {
    return {
      success: false,
      examples: [],
      errors: [`Component file not found: ${componentName}.ts`],
    };
  }

  if (!existsSync(demoPath)) {
    return {
      success: false,
      examples: [],
      errors: ['Demo file not found: demo/index.html'],
    };
  }

  const componentContent = readFileSync(componentPath, 'utf-8');
  const properties = extractProperties(componentContent);

  const componentHTML = generateHTML(componentName, properties);
  const examples = generateExamples(properties);

  let demoContent = readFileSync(demoPath, 'utf-8');

  if (demoContent.includes(`id="component-${componentName}"`)) {
    const sectionStart = demoContent.indexOf(`id="component-${componentName}"`);
    if (sectionStart !== -1) {
      const DIV_TAG_LENGTH = 4; // '<div'.length
      const DIV_CLOSE_TAG_LENGTH = 6; // '</div>'.length

      const divStart = demoContent.lastIndexOf('<div', sectionStart);
      let depth = 1;
      let pos = demoContent.indexOf('>', sectionStart) + 1;
      while (depth > 0 && pos < demoContent.length) {
        const nextOpen = demoContent.indexOf('<div', pos);
        const nextClose = demoContent.indexOf('</div>', pos);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          pos = nextOpen + DIV_TAG_LENGTH;
        } else {
          depth--;
          pos = nextClose + DIV_CLOSE_TAG_LENGTH;
        }
      }

      const oldSection = demoContent.substring(divStart, pos);
      demoContent = demoContent.replace(oldSection, componentHTML.trimEnd());
    }
  } else {
    if (demoContent.includes('<div class="placeholder">')) {
      const placeholderPattern =
        /<div class="section">[\s\S]*?<h2>Components<\/h2>[\s\S]*?<div class="placeholder">[\s\S]*?<\/div>[\s\S]*?<\/div>/;
      const componentsSection = `      <div class="section">\n        <h2>Components</h2>\n      </div>\n\n${componentHTML}`;
      demoContent = demoContent.replace(placeholderPattern, componentsSection);
    } else {
      const containerEndPattern = /(\s*)<\/div>\s*<script type="module"/;
      demoContent = demoContent.replace(
        containerEndPattern,
        `\n${componentHTML}$1</div>\n\n    <script type="module"`
      );
    }
  }

  writeFileSync(demoPath, demoContent, 'utf-8');

  return {
    success: true,
    examples,
    errors: [],
  };
}
