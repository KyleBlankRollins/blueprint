import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

interface TestCategory {
  name: string;
  description: string;
  required: boolean;
  applicable: (componentContent: string) => boolean;
}

const TEST_CATEGORIES: TestCategory[] = [
  // Required for all components
  {
    name: 'Registration',
    description: 'Component is registered in HTMLElementTagNameMap',
    required: true,
    applicable: () => true,
  },
  {
    name: 'Rendering',
    description: 'Component renders without errors',
    required: true,
    applicable: () => true,
  },
  {
    name: 'Properties',
    description: 'Each @property() reactive property works',
    required: true,
    applicable: () => true,
  },
  {
    name: 'Default Values',
    description: 'All properties have correct defaults',
    required: true,
    applicable: () => true,
  },
  // Required when applicable
  {
    name: 'Attributes',
    description: 'Attribute reflection works',
    required: false,
    applicable: (content) => content.includes('reflect: true'),
  },
  {
    name: 'Events',
    description: 'Custom events fire with correct detail',
    required: false,
    applicable: (content) =>
      content.includes('dispatchEvent') || content.includes('@event'),
  },
  {
    name: 'Slots',
    description: 'Slotted content renders correctly',
    required: false,
    applicable: (content) => content.includes('<slot'),
  },
  {
    name: 'CSS Parts',
    description: 'Parts are exposed and targetable',
    required: false,
    applicable: (content) => content.includes('part='),
  },
  {
    name: 'Variants',
    description: 'Each variant/state combination renders',
    required: false,
    applicable: (content) =>
      content.includes('variant') ||
      content.includes('primary') ||
      content.includes('secondary'),
  },
  {
    name: 'Sizes',
    description: 'Each size option works',
    required: false,
    applicable: (content) =>
      content.includes('size') &&
      (content.includes('small') ||
        content.includes('medium') ||
        content.includes('large')),
  },
  {
    name: 'Interactions',
    description: 'User interactions work (clicks, keyboard, etc)',
    required: false,
    applicable: (content) =>
      content.includes('click') ||
      content.includes('keyboard') ||
      content.includes('submit'),
  },
  {
    name: 'Accessibility',
    description: 'ARIA attributes, focus management, keyboard support',
    required: false,
    applicable: (content) =>
      content.includes('aria-') ||
      content.includes('role=') ||
      content.includes('tabindex'),
  },
];

export function isValidComponentName(name: string): boolean {
  // Must be kebab-case
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

function checkFilesExist(componentName: string): {
  missing: string[];
  existing: string[];
} {
  const root = process.cwd();
  const componentDir = join(root, 'source', 'components', componentName);

  const requiredFiles = [
    `${componentName}.ts`,
    `${componentName}.test.ts`,
    `${componentName}.stories.ts`,
    `${componentName}.style.ts`,
    'README.md',
  ];

  const missing: string[] = [];
  const existing: string[] = [];

  for (const file of requiredFiles) {
    const filePath = join(componentDir, file);
    if (existsSync(filePath)) {
      existing.push(file);
    } else {
      missing.push(file);
    }
  }

  return { missing, existing };
}

function checkExportedInIndex(componentName: string): boolean {
  const root = process.cwd();
  const indexPath = join(root, 'source', 'components', 'index.ts');

  if (!existsSync(indexPath)) {
    return false;
  }

  const content = readFileSync(indexPath, 'utf-8');
  const exportPattern = new RegExp(
    `export.*from.*['"]./${componentName}/${componentName}.js['"]`
  );
  return exportPattern.test(content);
}

function analyzeTestCoverage(componentName: string): {
  totalTests: number;
  coveredCategories: Map<string, number>;
  missingCategories: string[];
} {
  const root = process.cwd();
  const testPath = join(
    root,
    'source',
    'components',
    componentName,
    `${componentName}.test.ts`
  );
  const componentPath = join(
    root,
    'source',
    'components',
    componentName,
    `${componentName}.ts`
  );

  if (!existsSync(testPath) || !existsSync(componentPath)) {
    return {
      totalTests: 0,
      coveredCategories: new Map(),
      missingCategories: [],
    };
  }

  const testContent = readFileSync(testPath, 'utf-8');
  const componentContent = readFileSync(componentPath, 'utf-8');

  // Count total test() and it() calls
  const testMatches = testContent.match(/\b(test|it)\s*\(/g);
  const totalTests = testMatches ? testMatches.length : 0;

  const coveredCategories = new Map<string, number>();
  const missingCategories: string[] = [];

  for (const category of TEST_CATEGORIES) {
    const isApplicable = category.applicable(componentContent);

    if (!isApplicable && !category.required) {
      continue; // Skip non-applicable optional categories
    }

    // Check if test file has tests for this category
    const categoryTests = detectCategoryTests(testContent, category.name);

    if (categoryTests > 0) {
      coveredCategories.set(category.name, categoryTests);
    } else if (category.required || isApplicable) {
      missingCategories.push(category.name);
    }
  }

  return { totalTests, coveredCategories, missingCategories };
}

function detectCategoryTests(
  testContent: string,
  categoryName: string
): number {
  const lowerCategory = categoryName.toLowerCase();

  // Create search patterns for each category
  const patterns: Record<string, RegExp[]> = {
    registration: [/htmlelementtagnamemap/i, /custom.*element.*registered/i],
    rendering: [/renders/i, /mount/i, /\bdom\b/i],
    properties: [
      /@property/i,
      /\.property/i,
      /set.*property/i,
      /attribute.*property/i,
    ],
    'default values': [/default/i, /initial.*value/i],
    attributes: [/attribute/i, /reflect/i, /getattribute/i, /setattribute/i],
    events: [/event/i, /dispatch/i, /emit/i, /fire/i],
    slots: [/slot/i, /slotted/i],
    'css parts': [/part/i, /::part/i],
    variants: [/variant/i, /primary/i, /secondary/i],
    sizes: [/size/i, /small/i, /medium/i, /large/i],
    interactions: [/click/i, /keyboard/i, /press/i, /submit/i, /interact/i],
    accessibility: [
      /aria/i,
      /a11y/i,
      /accessibility/i,
      /screen.*reader/i,
      /keyboard.*nav/i,
      /focus/i,
    ],
  };

  const categoryPatterns = patterns[lowerCategory] || [];
  let count = 0;

  // Find test blocks that match this category by locating each `test(` or `it(`,
  // then slicing from that position to the start of the next test block.
  const testStartRegex = /\b(test|it)\s*\(/g;
  const testStartIndices: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = testStartRegex.exec(testContent)) !== null) {
    testStartIndices.push(match.index);
  }

  const testBlocks: string[] = [];

  for (let index = 0; index < testStartIndices.length; index++) {
    const start = testStartIndices[index]!;
    const end =
      index + 1 < testStartIndices.length
        ? testStartIndices[index + 1]!
        : testContent.length;
    testBlocks.push(testContent.slice(start, end));
  }

  for (const block of testBlocks) {
    for (const pattern of categoryPatterns) {
      if (pattern.test(block)) {
        count++;
        break; // Count each test block only once
      }
    }
  }

  return count;
}

function runTests(componentName: string): { passed: boolean; output: string } {
  try {
    const output = execSync(
      `npm test -- --run --reporter=verbose ${componentName}.test.ts`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return { passed: true, output };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === 'object' && 'stdout' in error
        ? String((error as { stdout?: string }).stdout)
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    return { passed: false, output: errorMessage };
  }
}

function checkFormatting(): { formatted: boolean; output: string } {
  try {
    const output = execSync('npm run format:check', {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    return { formatted: true, output };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === 'object' && 'stdout' in error
        ? String((error as { stdout?: string }).stdout)
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    return { formatted: false, output: errorMessage };
  }
}

function checkLinting(): {
  clean: boolean;
  output: string;
  errorCount: number;
} {
  try {
    const output = execSync('npm run lint', {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    return { clean: true, output, errorCount: 0 };
  } catch (error: unknown) {
    const output =
      error && typeof error === 'object' && 'stdout' in error
        ? String((error as { stdout?: string }).stdout)
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    // Count errors from ESLint output
    const errorMatch = output.match(/(\d+)\s+error/);
    const errorCount = errorMatch ? parseInt(errorMatch[1], 10) : 1;
    return { clean: false, output, errorCount };
  }
}

function checkReadmeDocumentation(componentName: string): {
  hasApiDocs: boolean;
} {
  const root = process.cwd();
  const readmePath = join(
    root,
    'source',
    'components',
    componentName,
    'README.md'
  );

  if (!existsSync(readmePath)) {
    return { hasApiDocs: false };
  }

  const content = readFileSync(readmePath, 'utf-8');
  const hasProperties =
    /##\s*Properties/i.test(content) || /##\s*API/i.test(content);
  const hasUsage = /##\s*Usage/i.test(content);

  return { hasApiDocs: hasProperties && hasUsage };
}

export function validateComponent(componentName: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  // 1. Validate input
  if (!isValidComponentName(componentName)) {
    return {
      success: false,
      errors: [
        'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")',
      ],
      warnings: [],
      info: [],
    };
  }

  // 2. Check files exist
  const { missing, existing } = checkFilesExist(componentName);
  if (missing.length > 0) {
    errors.push(`Missing required files: ${missing.join(', ')}`);
  }
  info.push(`Files found: ${existing.join(', ')}`);

  // 3. Check exported in index.ts
  const isExported = checkExportedInIndex(componentName);
  if (!isExported) {
    errors.push(`Component not exported in source/components/index.ts`);
  } else {
    info.push('Exported in source/components/index.ts');
  }

  // 4. Check test coverage
  const { totalTests, coveredCategories, missingCategories } =
    analyzeTestCoverage(componentName);
  info.push(`Test file contains ${totalTests} tests`);

  for (const [category, count] of Array.from(coveredCategories.entries())) {
    info.push(`✓ ${category} (${count} test${count !== 1 ? 's' : ''})`);
  }

  if (missingCategories.length > 0) {
    for (const category of missingCategories) {
      errors.push(`Missing tests for: ${category}`);
    }
  }

  // 5. Check README documentation
  const { hasApiDocs } = checkReadmeDocumentation(componentName);
  if (!hasApiDocs) {
    errors.push(
      'README.md missing API documentation (Properties/Usage sections)'
    );
  } else {
    info.push('README.md has API documentation');
  }

  // 6. Run tests
  if (existing.includes(`${componentName}.test.ts`)) {
    info.push('Running tests...');
    const { passed, output } = runTests(componentName);
    if (!passed) {
      errors.push('Tests are failing');
      // Extract failure count if available
      const failMatch = output.match(/(\d+)\s+failed/);
      if (failMatch) {
        errors.push(`${failMatch[1]} test(s) failing`);
      }
    } else {
      info.push('All tests pass');
    }
  }

  // 7. Check formatting
  info.push('Checking code formatting...');
  const { formatted } = checkFormatting();
  if (!formatted) {
    errors.push('Code is not formatted (run: npm run format)');
  } else {
    info.push('Code is formatted');
  }

  // 8. Check linting
  info.push('Checking for lint errors...');
  const { clean, errorCount } = checkLinting();
  if (!clean) {
    errors.push(
      `${errorCount} lint error${errorCount !== 1 ? 's' : ''} found (run: npm run lint)`
    );
  } else {
    info.push('No lint errors');
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
    info,
  };
}
