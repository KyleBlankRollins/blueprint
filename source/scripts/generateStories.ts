import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

function loadTemplate(
  templateName: string,
  replacements: Record<string, string>
): string {
  const templatePath = join(process.cwd(), 'source', 'templates', templateName);
  let content = readFileSync(templatePath, 'utf-8');

  // Replace all placeholders
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });

  return content;
}

interface StoryGenerationResult {
  success: boolean;
  storiesGenerated: string[];
  errors: string[];
  warnings: string[];
}

function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
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

    // Extract JSDoc from previous lines
    let description = '';
    let jsDocStart = -1;

    for (
      let prevLineIndex = currentLineIndex - 1;
      prevLineIndex >= Math.max(0, currentLineIndex - 10);
      prevLineIndex--
    ) {
      const previousLineContent = lines[prevLineIndex]?.trim();
      if (previousLineContent?.includes('*/')) {
        for (
          let searchIndex = prevLineIndex;
          searchIndex >= Math.max(0, currentLineIndex - 20);
          searchIndex--
        ) {
          if (lines[searchIndex]?.trim().includes('/**')) {
            jsDocStart = searchIndex;
            break;
          }
        }
        if (jsDocStart !== -1) {
          const jsDoc = lines.slice(jsDocStart, prevLineIndex + 1).join('\n');
          const descMatch = jsDoc.match(/\/\*\*\s*([\s\S]*?)\*\//);
          if (descMatch) {
            const jsDocContent = descMatch[1];
            const descriptionLines = jsDocContent
              .split('\n')
              .map((docLine) => docLine.replace(/^\s*\*\s?/, '').trim())
              .filter((docLine) => docLine && !docLine.startsWith('@'));
            description = descriptionLines.join(' ');
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
    if (!line.match(/\)\s+(?:declare\s+)?(\w+)\s*:/)) {
      declarationLine = lines[currentLineIndex + 1] || '';
    }

    // Match both patterns:
    // @property({ type: String }) declare name: type = value;
    // @property({ type: String }) name: type = value;
    const declMatch = declarationLine.match(
      /\)\s+(?:declare\s+)?(\w+)\s*:\s*([^;=]+)(?:\s*=\s*([^;]+))?;/
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

function parseUnionType(typeString: string): string[] | null {
  // Match union types like 'primary' | 'secondary' | 'tertiary'
  const unionMatch = typeString.match(
    /^(['"][\w-]+['"](\s*\|\s*['"][\w-]+['"])+)$/
  );
  if (!unionMatch) {
    return null;
  }

  const values = typeString
    .split('|')
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''));

  return values;
}

function generateArgTypes(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '    // No properties to configure';
  }

  const argTypes = properties
    .map((prop) => {
      const unionValues = parseUnionType(prop.type);

      if (unionValues) {
        // Union type - use select control
        return `    ${prop.name}: { 
      control: 'select',
      options: [${unionValues.map((v) => `'${v}'`).join(', ')}],
      description: '${prop.description || prop.name}',
    }`;
      } else if (prop.type === 'boolean' || prop.type === 'Boolean') {
        // Boolean - use boolean control
        return `    ${prop.name}: { 
      control: 'boolean',
      description: '${prop.description || prop.name}',
    }`;
      } else if (prop.type === 'number' || prop.type === 'Number') {
        // Number - use number control
        return `    ${prop.name}: { 
      control: 'number',
      description: '${prop.description || prop.name}',
    }`;
      } else {
        // Default to text control
        return `    ${prop.name}: { 
      control: 'text',
      description: '${prop.description || prop.name}',
    }`;
      }
    })
    .join(',\n');

  return argTypes;
}

function generateDefaultArgs(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '';
  }

  const args = properties
    .map((prop) => {
      let value = prop.defaultValue;

      if (!value) {
        // Infer default based on type
        if (prop.type === 'boolean' || prop.type === 'Boolean') {
          value = 'false';
        } else if (prop.type === 'number' || prop.type === 'Number') {
          value = '0';
        } else {
          const unionValues = parseUnionType(prop.type);
          if (unionValues && unionValues.length > 0 && unionValues[0]) {
            value = `'${unionValues[0]}'`;
          } else {
            value = "''";
          }
        }
      } else {
        // Add quotes for string values if needed
        if (
          prop.type.includes("'") ||
          prop.type.includes('"') ||
          prop.type === 'string' ||
          prop.type === 'String'
        ) {
          if (!value.startsWith("'") && !value.startsWith('"')) {
            value = `'${value}'`;
          }
        }
      }

      return `    ${prop.name}: ${value}`;
    })
    .join(',\n');

  return args;
}

function generatePropertyBindings(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '';
  }

  return properties
    .map((prop) => {
      if (prop.type === 'boolean' || prop.type === 'Boolean') {
        return `?${prop.name}=\${args.${prop.name}}`;
      } else {
        return `.${prop.name}=\${args.${prop.name}}`;
      }
    })
    .join(' ');
}

function generateVariantStories(properties: PropertyInfo[]): string {
  const stories: string[] = [];

  // Find variant and size properties
  const variantProp = properties.find(
    (p) =>
      p.name === 'variant' &&
      parseUnionType(p.type) &&
      parseUnionType(p.type)!.length > 1
  );
  const sizeProp = properties.find(
    (p) =>
      p.name === 'size' &&
      parseUnionType(p.type) &&
      parseUnionType(p.type)!.length > 1
  );

  if (variantProp) {
    const variants = parseUnionType(variantProp.type);
    if (!variants) {
      // Skip if we can't parse the union type
    } else {
      variants.forEach((variant) => {
        const storyName = toPascalCase(variant);
        stories.push(`
export const ${storyName}: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: '${variant}',
  },
};`);
      });
    }
  }

  if (sizeProp) {
    const sizes = parseUnionType(sizeProp.type);
    if (!sizes) {
      // Skip if we can't parse the union type
    } else {
      sizes.forEach((size) => {
        const storyName = toPascalCase(size);
        stories.push(`
export const ${storyName}: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: '${size}',
  },
};`);
      });
    }
  }

  // Generate disabled state if there's a disabled property
  const disabledProp = properties.find(
    (p) =>
      p.name === 'disabled' && (p.type === 'boolean' || p.type === 'Boolean')
  );
  if (disabledProp) {
    stories.push(`
export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};`);
  }

  return stories.join('');
}

function generateStoriesFile(
  componentName: string,
  properties: PropertyInfo[]
): string {
  const tagName = `bp-${componentName}`;
  const titleName = toPascalCase(componentName);

  const argTypes = generateArgTypes(properties);
  const defaultArgs = generateDefaultArgs(properties);
  const propertyBindings = generatePropertyBindings(properties);
  const variantStories = generateVariantStories(properties);

  // Load template
  let storiesContent = loadTemplate('baseComponent.stories.template', {
    COMPONENT_NAME: componentName,
    TITLE_NAME: titleName,
    TAG_NAME: tagName,
  });

  // Replace argTypes section
  storiesContent = storiesContent.replace(
    /argTypes:\s*\{[\s\S]*?\n {2}\}/,
    `argTypes: {
${argTypes}
  }`
  );

  // Replace args section
  storiesContent = storiesContent.replace(
    /args:\s*\{[\s\S]*?\n {2}\}/,
    `args: {
${defaultArgs}
  }`
  );

  // Replace property bindings in render function
  storiesContent = storiesContent.replace(
    /\.someProp=\$\{args\.someProp\}/,
    propertyBindings
  );

  // Replace slot content
  storiesContent = storiesContent.replace(/Default content/, 'Button Content');

  // Append variant stories
  if (variantStories) {
    storiesContent += variantStories;
  }

  return storiesContent;
}

export function generateStories(componentName: string): StoryGenerationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const storiesGenerated: string[] = [];

  // Validate component name
  if (!isValidComponentName(componentName)) {
    return {
      success: false,
      storiesGenerated: [],
      errors: [
        'Invalid component name. Must be kebab-case (e.g., button, my-component)',
      ],
      warnings: [],
    };
  }

  // Check if component exists
  const componentDir = join(
    process.cwd(),
    'source',
    'components',
    componentName
  );
  const componentFile = join(componentDir, `${componentName}.ts`);

  if (!existsSync(componentFile)) {
    return {
      success: false,
      storiesGenerated: [],
      errors: [`Component file not found: ${componentFile}`],
      warnings: [],
    };
  }

  // Read component file
  const componentContent = readFileSync(componentFile, 'utf-8');

  // Extract properties
  const properties = extractProperties(componentContent);

  if (properties.length === 0) {
    warnings.push(
      'No properties found in component. Generated stories will be basic.'
    );
  }

  // Generate stories file
  const storiesContent = generateStoriesFile(componentName, properties);
  const storiesFile = join(componentDir, `${componentName}.stories.ts`);

  // Check if stories file already exists
  if (existsSync(storiesFile)) {
    warnings.push(
      `Stories file already exists at ${storiesFile}. It will be overwritten.`
    );
  }

  // Write stories file
  try {
    writeFileSync(storiesFile, storiesContent, 'utf-8');
    storiesGenerated.push(storiesFile);
  } catch (error) {
    errors.push(`Failed to write stories file: ${error}`);
    return {
      success: false,
      storiesGenerated: [],
      errors,
      warnings,
    };
  }

  return {
    success: true,
    storiesGenerated,
    errors,
    warnings,
  };
}

// CLI interface
if (process.argv[2]) {
  const componentName = process.argv[2];
  const result = generateStories(componentName);

  if (result.success) {
    console.log(`✅ Story Generator: ${componentName}`);
    console.log(`\nStories generated:`);
    result.storiesGenerated.forEach((file) => console.log(`  - ${file}`));

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }

    process.exit(0);
  } else {
    console.log(`❌ Story Generator: ${componentName}`);
    if (result.errors.length > 0) {
      console.log(`\nErrors:`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }
    if (result.warnings.length > 0) {
      console.log(`\nWarnings:`);
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }
    process.exit(1);
  }
}
