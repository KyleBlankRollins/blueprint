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

### 1. Component Validator (`npm run validate <component-name>`)

**Purpose:** Verifies a component is complete and ready for production.

**What it checks:**

- All 5 required files exist (`.ts`, `.test.ts`, `.stories.ts`, `.style.ts`, `README.md`)
- Component is exported in `source/components/index.ts`
- Test coverage includes all relevant categories (see Test Categories below)
- All tests pass (`npm test` on component)
- Files are formatted (`npm run format:check`)
- No linting errors (`npm run lint`)

**Test Categories:**

The validator checks that tests cover all relevant categories for the component:

**Required for all components:**

1. **Registration** - Component is registered in `HTMLElementTagNameMap`
2. **Rendering** - Component renders without errors (smoke test)
3. **Properties** - Each `@property()` reactive property accepts values and triggers updates
4. **Default Values** - All properties have correct defaults

**Required when applicable:** 5. **Attributes** - Attribute reflection works (if properties use `reflect: true`) 6. **Events** - Each custom event fires with correct detail payload (if component emits events) 7. **Slots** - Slotted content renders correctly (if component uses `<slot>`) 8. **CSS Parts** - Parts are exposed and targetable (if component exposes `part` attributes) 9. **Variants** - Each variant/state combination renders (if component has variants like primary/secondary) 10. **Sizes** - Each size option works (if component has small/medium/large) 11. **Interactions** - User interactions work (clicks, keyboard navigation, form submission) 12. **Accessibility** - ARIA attributes, focus management, keyboard support, semantic HTML

**Complex components may need:** 13. **Lifecycle** - Connected/disconnected callbacks work (if component has cleanup logic) 14. **Edge Cases** - Invalid inputs handled gracefully, boundary conditions tested 15. **Computed Values** - Derived/computed properties calculate correctly 16. **State Management** - Internal state changes trigger correct updates

**Examples:**

- Simple divider: Categories 1-2 only (~2 tests)
- Button component: Categories 1-4, 6, 9-12 (~8-10 tests)
- Complex form input: Categories 1-12, 14-15 (~15-20 tests)

**AI Workflow Integration:**

- Agent runs `npm run validate button` before marking component complete
- Tool provides specific error messages the agent can act on
- Eliminates need for agent to remember all checklist items
- Prevents incomplete components from being committed

**Example Output:**

```
✅ Component validation: bp-button

Files:
  ✅ button.ts exists
  ✅ button.test.ts exists
  ✅ button.stories.ts exists
  ✅ button.style.ts exists
  ✅ README.md exists

Test Coverage (12 tests found):
  ✅ Registration (1 test)
  ✅ Rendering (1 test)
  ✅ Properties (3 tests)
  ✅ Default Values (1 test)
  ✅ Events (2 tests)
  ✅ Variants (2 tests)
  ✅ Accessibility (2 tests)

Integration:
  ✅ Exported in source/components/index.ts

Quality:
  ✅ All tests pass
  ✅ Code is formatted
  ✅ No lint errors

Component is ready for production! 🎉
```

**Error Example:**

```
❌ Component validation: bp-button

Files:
  ✅ button.ts exists
  ✅ button.test.ts exists
  ✅ button.stories.ts exists
  ✅ button.style.ts exists
  ❌ README.md missing API documentation section

Test Coverage (7 tests found):
  ✅ Registration (1 test)
  ✅ Rendering (1 test)
  ✅ Properties (3 tests)
  ✅ Default Values (1 test)
  ❌ Events - Missing tests for custom events
  ✅ Variants (1 test)
  ❌ Accessibility - Missing keyboard navigation and ARIA tests

Integration:
  ❌ Not exported in source/components/index.ts

Quality:
  ❌ 2 tests failing
  ✅ Code is formatted
  ❌ 3 lint errors

Fix these issues before completing the component.
```

---

### 2. Token Usage Analyzer (`npm run check-tokens <component-name>`)

**Purpose:** Enforces the critical "no hardcoded values" rule by scanning for design token violations.

**What it detects:**

- Hardcoded colors (hex, rgb, hsl)
- Hardcoded spacing values (px, rem, em)
- Hardcoded border values
- Hardcoded font sizes
- CSS `var()` with fallback values
- Any literal design values instead of tokens

**AI Workflow Integration:**

- Agent runs this after implementing styles
- Tool provides specific line numbers and violations
- Agent can fix violations immediately
- Critical for maintaining design system consistency

**Example Output:**

```
✅ Token usage check: bp-button

Design tokens found:
  - --bp-color-primary (3 uses)
  - --bp-spacing-md (2 uses)
  - --bp-border-radius-md (1 use)
  - --bp-font-size-base (1 use)
  - --bp-transition-fast (1 use)

No violations found! All design values use tokens.
```

**Error Example:**

```
❌ Token usage violations: bp-button

button.style.ts:
  Line 12: Hardcoded color #3b82f6
    > background-color: #3b82f6;
    Fix: Use var(--bp-color-primary)

  Line 18: Hardcoded spacing 12px
    > padding: 12px 16px;
    Fix: Use var(--bp-spacing-md) var(--bp-spacing-lg)

  Line 25: CSS var with fallback
    > color: var(--bp-color-primary, #3b82f6);
    Fix: Remove fallback value

3 violations found. Fix these to maintain design system consistency.
```

---

### 3. Property Extractor (`npm run extract-api <component-name>`)

**Purpose:** Auto-generates API documentation tables from component TypeScript code.

**What it extracts:**

- `@property()` decorators → Properties table
- `@event()` decorators or `dispatchEvent()` calls → Events table
- JSDoc comments → Descriptions
- TypeScript types → Type column
- Default values → Default column

**AI Workflow Integration:**

- Agent implements component with good JSDoc comments
- Tool generates API tables automatically
- Agent inserts tables into README
- Reduces manual documentation work
- Ensures API docs match actual code

**Example Output:**

```
Generated API documentation for bp-button:

### Properties

| Property   | Type                         | Default     | Description                    |
|------------|------------------------------|-------------|--------------------------------|
| `variant`  | `'primary' \| 'secondary'`   | `'primary'` | Visual style of the button     |
| `size`     | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button         |
| `disabled` | `boolean`                    | `false`     | Whether button is disabled     |

### Events

| Event       | Detail                    | Description                         |
|-------------|---------------------------|-------------------------------------|
| `bp-click`  | `{ originalEvent: Event }` | Fired when button is clicked       |

Copy this to README.md or run with --insert to add automatically.
```

---

### 4. Demo Page Updater (`npm run add-to-demo <component-name>`)

**Purpose:** Automatically adds component examples to the demo page for manual testing.

**What it does:**

- Parses component properties and variants
- Generates HTML examples showing all variants
- Inserts examples into `demo/index.html`
- Creates a section with interactive examples

**AI Workflow Integration:**

- Agent runs after component is complete
- Enables manual testing without writing demo code
- Shows component in action immediately
- Useful for visual QA

**Example Output:**

```
Added bp-button to demo/index.html

Examples created:
  - Default (primary variant)
  - Secondary variant
  - Small size
  - Large size
  - Disabled state

View at http://localhost:5173/demo/ (run npm run dev)
```

---

## Secondary Tools (Future Enhancements)

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

### 6. Story Generator

**Purpose:** Auto-generate Storybook stories from component properties.

**Potential features:**

- Parse component TypeScript
- Generate story for each variant/size combination
- Add controls for all properties
- Create args tables

**Complexity:** Medium - requires TypeScript AST parsing.

**Value:** Medium - reduces boilerplate but Storybook stories often need customization.

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
    "validate": "tsc source/scripts/validateComponent.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/validateComponent.js",
    "check-tokens": "tsc source/scripts/checkTokens.ts --module es2020 --moduleResolution bundler --outDir .scripts && node .scripts/checkTokens.js",
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

4. npm run check-tokens button
   → ✅ No violations

5. [Implements tests in button.test.ts]

6. [Implements stories in button.stories.ts]

7. npm run extract-api button
   → Generates API tables

8. [Adds API tables to README.md]

9. npm run validate button
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
3. npm run validate button
   → ❌ Missing test categories: Events, Accessibility
   → ❌ Hardcoded color in styles
   → ❌ Not exported in index.ts

4. [Adds event tests and accessibility tests]
5. npm run check-tokens button
   → Shows specific violations

6. [Fixes color to use var(--bp-color-primary)]
7. [Adds export to index.ts]
8. npm run validate button
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
