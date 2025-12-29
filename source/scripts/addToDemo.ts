import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
}

interface DemoResult {
  success: boolean;
  examples: string[];
  errors: string[];
}

function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
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

    // Match property declaration on same line or next line
    // Pattern: @property(...) name: type = value; or @property(...)\n  name: type = value;
    let fullDeclaration = line;

    // If the line doesn't have a colon (type annotation), check next line
    const afterDecorator = line.split(')').slice(1).join(')');
    if (!afterDecorator.includes(':')) {
      fullDeclaration = line + '\n' + (lines[currentLineIndex + 1] || '');
    }

    // Extract the property declaration part (after the closing paren of decorator)
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
  // Extract values from union types like 'primary' | 'secondary' | 'tertiary'
  const matches = type.matchAll(/['"`]([^'"`]+)['"`]/g);
  return Array.from(matches, (m) => m[1]).filter(
    (v): v is string => v !== undefined
  );
}

function generateExamples(
  componentName: string,
  properties: PropertyInfo[]
): string[] {
  const examples: string[] = [];

  // Find variant and size properties
  const variantProp = properties.find(
    (p) => p.name === 'variant' || p.name.includes('variant')
  );
  const sizeProp = properties.find(
    (p) => p.name === 'size' || p.name.includes('size')
  );
  const booleanProps = properties.filter((p) =>
    p.type.toLowerCase().includes('boolean')
  );

  // Default example
  examples.push('Default');

  // Variant examples
  if (variantProp) {
    const variants = parseEnumType(variantProp.type);
    for (const variant of variants) {
      if (variant !== variantProp.defaultValue) {
        examples.push(
          `${variant.charAt(0).toUpperCase() + variant.slice(1)} variant`
        );
      }
    }
  }

  // Size examples
  if (sizeProp) {
    const sizes = parseEnumType(sizeProp.type);
    for (const size of sizes) {
      if (size !== sizeProp.defaultValue && size !== 'medium') {
        examples.push(`${size.charAt(0).toUpperCase() + size.slice(1)} size`);
      }
    }
  }

  // Boolean property examples (like disabled)
  for (const boolProp of booleanProps) {
    examples.push(
      `${boolProp.name.charAt(0).toUpperCase() + boolProp.name.slice(1)} state`
    );
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find variant, size, and boolean properties
  const variantProp = properties.find(
    (p) => p.name === 'variant' || p.name.includes('variant')
  );
  const sizeProp = properties.find(
    (p) => p.name === 'size' || p.name.includes('size')
  );
  const booleanProps = properties.filter((p) =>
    p.type.toLowerCase().includes('boolean')
  );

  let html = `      <div class="section" id="component-${componentName}">\n`;
  html += `        <h2>${titleName}</h2>\n`;
  html += `        <div class="examples">\n`;

  // Default example
  html += `          <div>\n`;
  html += `            <p><strong>Default:</strong></p>\n`;
  html += `            <${tagName}>Click me</${tagName}>\n`;
  html += `          </div>\n`;

  // Variant examples
  if (variantProp) {
    const variants = parseEnumType(variantProp.type);
    for (const variant of variants) {
      if (variant !== variantProp.defaultValue) {
        html += `\n          <div>\n`;
        html += `            <p><strong>${variant.charAt(0).toUpperCase() + variant.slice(1)} variant:</strong></p>\n`;
        html += `            <${tagName} variant="${variant}">Click me</${tagName}>\n`;
        html += `          </div>\n`;
      }
    }
  }

  // Size examples
  if (sizeProp) {
    const sizes = parseEnumType(sizeProp.type);
    for (const size of sizes) {
      if (size !== sizeProp.defaultValue && size !== 'medium') {
        html += `\n          <div>\n`;
        html += `            <p><strong>${size.charAt(0).toUpperCase() + size.slice(1)} size:</strong></p>\n`;
        html += `            <${tagName}`;
        if (sizeProp.name !== 'size') {
          html += ` ${sizeProp.name}="${size}"`;
        } else {
          html += ` size="${size}"`;
        }
        html += `>Click me</${tagName}>\n`;
        html += `          </div>\n`;
      }
    }
  }

  // Boolean property examples
  for (const boolProp of booleanProps) {
    html += `\n          <div>\n`;
    html += `            <p><strong>${boolProp.name.charAt(0).toUpperCase() + boolProp.name.slice(1)} state:</strong></p>\n`;
    html += `            <${tagName} ${boolProp.name}>Click me</${tagName}>\n`;
    html += `          </div>\n`;
  }

  html += `        </div>\n`;
  html += `      </div>\n`;

  return html;
}

function addToDemo(componentName: string): DemoResult {
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

  // Read component file and extract properties
  const componentContent = readFileSync(componentPath, 'utf-8');
  const properties = extractProperties(componentContent);

  // Generate HTML
  const componentHTML = generateHTML(componentName, properties);
  const examples = generateExamples(componentName, properties);

  // Read demo file
  let demoContent = readFileSync(demoPath, 'utf-8');

  // Check if component already exists in demo
  if (demoContent.includes(`id="component-${componentName}"`)) {
    // Replace existing section - match from opening div to its closing div
    const escapedName = componentName.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      '\\$&'
    );
    const sectionStart = demoContent.indexOf(`id="component-${componentName}"`);
    if (sectionStart !== -1) {
      // Find the opening <div> tag
      const divStart = demoContent.lastIndexOf('<div', sectionStart);
      // Find the matching closing </div> by counting div depth
      let depth = 1;
      let pos = demoContent.indexOf('>', sectionStart) + 1;
      while (depth > 0 && pos < demoContent.length) {
        const nextOpen = demoContent.indexOf('<div', pos);
        const nextClose = demoContent.indexOf('</div>', pos);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          pos = nextOpen + 4;
        } else {
          depth--;
          pos = nextClose + 6;
        }
      }

      const oldSection = demoContent.substring(divStart, pos);
      demoContent = demoContent.replace(oldSection, componentHTML.trimEnd());
    }
  } else {
    // Find the placeholder section and replace it, or add before closing container
    if (demoContent.includes('<div class="placeholder">')) {
      // Replace placeholder in Components section
      const placeholderPattern =
        /<div class="section">[\s\S]*?<h2>Components<\/h2>[\s\S]*?<div class="placeholder">[\s\S]*?<\/div>[\s\S]*?<\/div>/;
      const componentsSection = `      <div class="section">\n        <h2>Components</h2>\n      </div>\n\n${componentHTML}`;
      demoContent = demoContent.replace(placeholderPattern, componentsSection);
    } else {
      // Add before closing container div
      const containerEndPattern = /(\s*)<\/div>\s*<script type="module"/;
      demoContent = demoContent.replace(
        containerEndPattern,
        `\n${componentHTML}$1</div>\n\n    <script type="module"`
      );
    }
  }

  // Write back to demo file
  writeFileSync(demoPath, demoContent, 'utf-8');

  return {
    success: true,
    examples,
    errors: [],
  };
}

function formatOutput(result: DemoResult, componentName: string): string {
  if (!result.success) {
    return `❌ ${result.errors.join('\n')}\n`;
  }

  let output = `✅ Added bp-${componentName} to demo/index.html\n\n`;
  output += 'Examples created:\n';

  for (const example of result.examples) {
    output += `  - ${example}\n`;
  }

  output += '\nView at http://localhost:5173/demo/ (run npm run dev)\n';

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

  const result = addToDemo(componentName);
  console.log(formatOutput(result, componentName));
  process.exit(result.success ? 0 : 1);
} else {
  console.error('Usage: npm run add-to-demo <component-name>');
  console.error('Example: npm run add-to-demo button');
  process.exit(2);
}
