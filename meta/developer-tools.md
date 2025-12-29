# Developer Tools for AI-Assisted Component Development

This document describes the developer tools that support the `@component-creator` agent workflow. These tools automate validation, enforce standards, and reduce manual work when creating components.

## Design Philosophy

**Goal:** Enable the AI agent to create complete, production-ready components with minimal human intervention by providing automated validation and enforcement of project standards.

**Principles:**

1. **Validate, don't assume** - Tools check that work meets standards rather than trusting it's correct
2. **Fast feedback loops** - Quick validation allows rapid iteration
3. **Clear error messages** - Tools tell the agent exactly what to fix
4. **Automate the tedious** - Tools handle repetitive tasks like API documentation

## Core Tools

All implemented!

## Secondary Tools

### 5. Accessibility Checker

**Purpose:** Automated accessibility validation.

**Potential checks:**

- ARIA attributes present and valid
- Focus indicators in CSS
- Keyboard event handlers
- Semantic HTML usage
- Color contrast ratios

**Complexity:** High - requires sophisticated code analysis and best practice knowledge.

**Value:** Medium-High - catches accessibility issues early but requires significant investment to build well.

---

## Implemented Tools

### 6. Story Generator ✅

**Purpose:** Auto-generate Storybook stories from component properties.

**Features:**

- Parses component TypeScript with @property decorators
- Generates story for each variant/size combination
- Adds appropriate controls for all properties (select, boolean, text, number)
- Creates default args based on property types and defaults
- Automatically generates variant and size stories
- Includes disabled state story when applicable

**Usage:**

```bash
npm run generate-stories <component-name>
```

**Example:**

```bash
npm run generate-stories button
# ✅ Story Generator: button
# Stories generated:
#   - source/components/button/button.stories.ts
```

**Complexity:** Medium - requires TypeScript AST parsing.

**Value:** High - significantly reduces boilerplate and ensures consistent story structure across all components.

---

## Tool Architecture

### Technology Stack

**Language:** TypeScript (matches project)
**Execution:** Node.js scripts compiled with `tsc`
**Location:** `source/scripts/`
**Templates:** `.template` files in `source/templates/`

### Common Patterns

```typescript
// All tools follow this pattern:
export function validateComponent(componentName: string): ValidationResult {
  // 1. Validate input
  if (!isValidComponentName(componentName)) {
    return { success: false, errors: ['Invalid component name'] };
  }

  // 2. Perform checks
  const errors: string[] = [];
  if (!allFilesExist(componentName)) {
    errors.push('Missing required files');
  }

  // 3. Return structured result
  return {
    success: errors.length === 0,
    errors,
    warnings: [],
    info: [],
  };
}

// CLI wrapper
if (process.argv[2]) {
  const result = validateComponent(process.argv[2]);
  console.log(formatOutput(result));
  process.exit(result.success ? 0 : 1);
}
```

### Integration with package.json

```json
{
  "scripts": {
    "validate:component": "tsc source/scripts/validateComponent.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/validateComponent.js",
    "validate:tokens": "tsc source/scripts/validateTokens.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/validateTokens.js",
    "extract-api": "tsc source/scripts/extractAPI.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/extractAPI.js",
    "add-to-demo": "tsc source/scripts/addToDemo.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/addToDemo.js"
  }
}
```

---

## AI Agent Workflow

### Ideal Component Creation Flow

```
User: @component-creator create a button component with primary/secondary variants

Agent:
1. npm run scaffold button
   → Creates stub files

2. [Implements component logic in button.ts]

3. [Implements styles in button.style.ts]

4. npm run validate:tokens button
   → ✅ No violations

5. [Implements tests in button.test.ts]

6. npm run generate-stories button
   → Auto-generates button.stories.ts with all variants

7. npm run extract-api button
   → Generates API tables

8. [Adds API tables to README.md]

9. npm run validate:component button
   → ✅ All checks pass

10. npm run add-to-demo button
    → Added to demo page

11. npm run format
    → Formatted all files

Component complete and ready for production!
```

### Error Recovery Flow

```
Agent:
1. npm run scaffold button
2. [Implements files]
3. npm run validate:component button
   → ❌ Missing test categories: Events, Accessibility
   → ❌ Hardcoded color in styles
   → ❌ Not exported in index.ts

4. [Adds event tests and accessibility tests]
5. npm run validate:tokens button
   → Shows specific violations

6. [Fixes color to use var(--bp-color-primary)]
7. [Adds export to index.ts]
8. npm run validate:component button
   → ✅ All checks pass

Component fixed and ready!
```

---

## Implementation Priority

### Phase 1: Critical Tools (Immediate)

1. **Component Validator** - Most important for ensuring completeness
2. **Token Usage Analyzer** - Enforces core design system rule

### Phase 2: Quality of Life (Next)

3. **Property Extractor** - Reduces documentation burden
4. **Demo Page Updater** - Improves testing workflow

### Phase 3: Advanced (Future)

5. Accessibility Checker
6. Story Generator

---

## Success Metrics

**How we know the tools are working:**

1. **Reduced incomplete components** - Validator catches missing files/tests
2. **Zero hardcoded values** - Token analyzer enforces standards
3. **Up-to-date documentation** - API extractor keeps README in sync
4. **Faster iterations** - Tools provide fast feedback loops
5. **Agent autonomy** - Agent can validate its own work without human review

---

## Appendix: Tool Output Format Standards

All tools follow consistent output patterns for easy parsing:

**Success:**

```
✅ Tool name: component-name
[Details about what passed]
```

**Errors:**

```
❌ Tool name: component-name
[Specific violations with line numbers and fixes]
```

**Warnings:**

```
⚠️ Tool name: component-name
[Non-critical issues]
```

**Exit codes:**

- `0` = Success
- `1` = Validation failures
- `2` = Invalid input (bad component name, etc.)
