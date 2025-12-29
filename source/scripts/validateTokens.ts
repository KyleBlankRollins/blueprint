import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TokenCheckResult {
  success: boolean;
  violations: Violation[];
  tokensUsed: Map<string, number>;
}

interface Violation {
  line: number;
  type: string;
  code: string;
  suggestion: string;
}

interface ViolationPattern {
  name: string;
  pattern: RegExp;
  getSuggestion: (match: string) => string;
}

const VIOLATION_PATTERNS: ViolationPattern[] = [
  // CSS var() with fallback values
  {
    name: 'CSS var with fallback',
    pattern: /var\s*\(\s*--[a-z-]+\s*,\s*[^)]+\)/gi,
    getSuggestion: (match: string) => {
      const tokenRegexMatch = match.match(/--[a-z-]+/);
      const token = tokenRegexMatch ? tokenRegexMatch[0] : '--bp-token';
      return `Use var(${token}) without fallback value`;
    },
  },
  // Hardcoded hex colors
  {
    name: 'Hardcoded color',
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    getSuggestion: (match: string) => {
      // Try to suggest appropriate token based on color
      if (
        match.toLowerCase() === '#3b82f6' ||
        match.toLowerCase() === '#2563eb'
      ) {
        return 'Use var(--bp-color-primary)';
      }
      return 'Use a color token from --bp-color-* (check source/themes/light.css)';
    },
  },
  // RGB/RGBA colors
  {
    name: 'Hardcoded color',
    pattern: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi,
    getSuggestion: () =>
      'Use a color token from --bp-color-* (check source/themes/light.css)',
  },
  // HSL/HSLA colors
  {
    name: 'Hardcoded color',
    pattern: /hsla?\s*\(\s*\d+/gi,
    getSuggestion: () =>
      'Use a color token from --bp-color-* (check source/themes/light.css)',
  },
  // Hardcoded pixel spacing (but not 0px)
  {
    name: 'Hardcoded spacing',
    pattern: /\b(?!0)(\d+(\.\d+)?)px\b/g,
    getSuggestion: (match: string) => {
      const value = parseFloat(match);
      if (value <= 4) return 'Use var(--bp-spacing-xs)';
      if (value <= 8) return 'Use var(--bp-spacing-sm)';
      if (value <= 16) return 'Use var(--bp-spacing-md)';
      if (value <= 24) return 'Use var(--bp-spacing-lg)';
      if (value <= 32) return 'Use var(--bp-spacing-xl)';
      return 'Use a spacing token from --bp-spacing-* (check source/themes/light.css)';
    },
  },
  // Hardcoded rem spacing
  {
    name: 'Hardcoded spacing',
    pattern: /\b(?!0)(\d+(\.\d+)?)rem\b/g,
    getSuggestion: () =>
      'Use a spacing token from --bp-spacing-* (check source/themes/light.css)',
  },
  // Hardcoded em spacing
  {
    name: 'Hardcoded spacing',
    pattern: /\b(?!0)(\d+(\.\d+)?)em\b/g,
    getSuggestion: () =>
      'Use a spacing token from --bp-spacing-* (check source/themes/light.css)',
  },
  // Hardcoded font sizes
  {
    name: 'Hardcoded font size',
    pattern: /font-size\s*:\s*(?!var\()[\d.]+(?:px|rem|em)/gi,
    getSuggestion: () =>
      'Use a font-size token from --bp-font-size-* (check source/themes/light.css)',
  },
  // Hardcoded border radius
  {
    name: 'Hardcoded border radius',
    pattern: /border-radius\s*:\s*(?!var\()[\d.]+(?:px|rem|em)/gi,
    getSuggestion: () =>
      'Use a border-radius token from --bp-border-radius-* (check source/themes/light.css)',
  },
  // Hardcoded border width
  {
    name: 'Hardcoded border width',
    pattern:
      /border(?:-(?:top|right|bottom|left|width))?\s*:\s*(?!var\()[\d.]+(?:px|rem|em)\s+(?:solid|dashed|dotted)/gi,
    getSuggestion: () => 'Use var(--bp-border-width) for border width',
  },
];

function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

function isInsideFunctionCall(
  line: string,
  matchIndex: number,
  functionName: string
): boolean {
  // Find the last occurrence of 'functionName(' before the match
  const beforeMatch = line.substring(0, matchIndex);
  const lastFunctionIndex = beforeMatch.lastIndexOf(`${functionName}(`);

  if (lastFunctionIndex === -1) {
    return false;
  }

  // Count parentheses to find the matching closing paren
  const afterFunction = line.substring(lastFunctionIndex);
  let depth = 0;
  let closingIndex = -1;

  for (let i = 0; i < afterFunction.length; i++) {
    if (afterFunction[i] === '(') {
      depth++;
    } else if (afterFunction[i] === ')') {
      depth--;
      if (depth === 0) {
        closingIndex = lastFunctionIndex + i;
        break;
      }
    }
  }

  // If we found a closing paren and the match is before it, it's inside the function call
  return closingIndex !== -1 && matchIndex < closingIndex;
}

function checkTokenUsage(componentName: string): TokenCheckResult {
  const root = process.cwd();
  const stylePath = join(
    root,
    'source',
    'components',
    componentName,
    `${componentName}.style.ts`
  );

  if (!existsSync(stylePath)) {
    return {
      success: false,
      violations: [
        {
          line: 0,
          type: 'File not found',
          code: '',
          suggestion: `Style file not found: ${componentName}.style.ts`,
        },
      ],
      tokensUsed: new Map(),
    };
  }

  const content = readFileSync(stylePath, 'utf-8');
  const lines = content.split('\n');
  const violations: Violation[] = [];
  const tokensUsed = new Map<string, number>();

  // Find all token usages
  const tokenPattern = /--bp-[a-z-]+/g;
  let tokenRegexMatch;
  while ((tokenRegexMatch = tokenPattern.exec(content)) !== null) {
    const token = tokenRegexMatch[0];
    tokensUsed.set(token, (tokensUsed.get(token) || 0) + 1);
  }

  // Check each line for violations
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]!;
    const lineNumber = lineIndex + 1;

    // Skip comments and imports
    if (
      line.trim().startsWith('//') ||
      line.trim().startsWith('/*') ||
      line.trim().startsWith('import')
    ) {
      continue;
    }

    // Check against each violation pattern
    for (const violationPattern of VIOLATION_PATTERNS) {
      let match: RegExpExecArray | null;
      const regex = new RegExp(
        violationPattern.pattern.source,
        violationPattern.pattern.flags
      );

      while ((match = regex.exec(line)) !== null) {
        // Skip if this specific match is inside a var() or calc() call
        if (
          isInsideFunctionCall(line, match.index, 'var') ||
          isInsideFunctionCall(line, match.index, 'calc')
        ) {
          continue;
        }

        violations.push({
          line: lineNumber,
          type: violationPattern.name,
          code: line.trim(),
          suggestion: violationPattern.getSuggestion(match[0]),
        });
      }
    }
  }

  return {
    success: violations.length === 0,
    violations,
    tokensUsed,
  };
}

function formatOutput(result: TokenCheckResult, componentName: string): string {
  const icon = result.success ? '✅' : '❌';
  let output = `${icon} Token usage check: bp-${componentName}\n\n`;

  // Show tokens used
  if (result.tokensUsed.size > 0) {
    output += 'Design tokens found:\n';
    const sortedTokens = Array.from(result.tokensUsed.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    for (const [token, count] of sortedTokens) {
      output += `  - ${token} (${count} use${count !== 1 ? 's' : ''})\n`;
    }
    output += '\n';
  }

  // Show violations
  if (result.violations.length > 0) {
    if (result.violations[0]?.type === 'File not found') {
      output += `❌ ${result.violations[0].suggestion}\n`;
    } else {
      output += `${componentName}.style.ts:\n`;

      for (const violation of result.violations) {
        output += `  Line ${violation.line}: ${violation.type}\n`;
        output += `    > ${violation.code}\n`;
        output += `    Fix: ${violation.suggestion}\n\n`;
      }

      output += `${result.violations.length} violation${result.violations.length !== 1 ? 's' : ''} found. Fix these to maintain design system consistency.\n`;
    }
  } else {
    output += 'No violations found! All design values use tokens.\n';
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

  const result = checkTokenUsage(componentName);
  console.log(formatOutput(result, componentName));
  process.exit(result.success ? 0 : 1);
} else {
  console.error('Usage: npm run validate:tokens <component-name>');
  console.error('Example: npm run validate:tokens button');
  process.exit(2);
}
