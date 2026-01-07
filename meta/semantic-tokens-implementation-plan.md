# Implementation Plan: Semantic-Only Token Output

**Status:** Ready for Implementation  
**Design Doc:** [semantic-tokens-design.md](./semantic-tokens-design.md)  
**Estimated Effort:** 3-4 days

## Overview

Refactor theme system to emit only semantic tokens in CSS output, eliminating primitive color scale tokens. Expand semantic tokens to include typography, border radius, and improve validation.

## Implementation Phases

### Phase 1: Expand SemanticTokens Interface (Day 1)

**Goal:** Add new semantic tokens for typography and border radius to the type system.

#### Tasks

1. **Update `SemanticTokens` interface** in `source/themes/core/types.ts`
   - Add typography tokens:
     - `fontFamily: string`
     - `fontFamilyMono: string`
     - `fontFamilyHeading: string`
   - Add border radius tokens:
     - `borderRadius: string`
     - `borderRadiusLarge: string`
     - `borderRadiusFull: string`
   - Make all color tokens required (remove `?` from `textStrong`)
   - Make shadow tokens required (remove `?` from `shadowSm`, `shadowMd`, `shadowLg`, `shadowXl`)
   - Make `borderWidth` required

2. **Update ThemeBase defaults** in `source/themes/builder/ThemeBase.ts`
   - Add default values for new semantic tokens
   - Ensure all themes get sensible fallbacks

3. **Update blueprint-core theme** in `source/themes/plugins/blueprint-core/index.ts`
   - Add typography tokens to light/dark variants:
     ```typescript
     fontFamily: 'system-ui, -apple-system, sans-serif',
     fontFamilyMono: 'ui-monospace, monospace',
     fontFamilyHeading: 'system-ui, -apple-system, sans-serif',
     ```
   - Add border radius tokens:
     ```typescript
     borderRadius: '4px',
     borderRadiusLarge: '8px',
     borderRadiusFull: '9999px',
     ```
   - Populate all shadow tokens (currently optional)
   - Make `textStrong` required

**Testing:** Build should compile without errors. All types should be satisfied.

---

### Phase 2: Update CSS Generation (Day 2)

**Goal:** Modify CSS generator to emit semantic tokens only, resolving ColorRefs to direct OKLCH values.

#### Tasks

1. **Modify `generateThemeCSS()`** in `source/themes/generator/generateCSS.ts`
   - Change color resolution: instead of emitting `var(--bp-vandarPoelBlue-500)`, resolve to direct OKLCH value
   - Add generation for new tokens:
     - `--bp-font-family`
     - `--bp-font-family-mono`
     - `--bp-font-family-heading`
     - `--bp-border-radius` (not `--bp-border-radius-md`, use semantic name)
     - `--bp-border-radius-large`
     - `--bp-border-radius-full`
   - Ensure `--bp-shadow-*` tokens are always generated
   - Ensure `--bp-border-width` is always generated

2. **Remove primitive color emission** from build pipeline
   - Remove or disable `generatePrimitivesCSS()` calls in theme builder
   - Or add flag to skip primitive generation by default

3. **Update CSS output structure**
   - Semantic tokens go directly in theme variant selector
   - No separate `:root` block for primitives
   - OKLCH values resolved at build time, not runtime

**Expected Output:**

```css
:root,
[data-theme='light'] {
  /* Colors - direct OKLCH values */
  --bp-color-background: oklch(0.941 0.0554 91.42);
  --bp-color-surface: oklch(...);
  --bp-color-text: oklch(...);
  /* ... all semantic color tokens */

  /* Typography */
  --bp-font-family: system-ui, -apple-system, sans-serif;
  --bp-font-family-mono: ui-monospace, monospace;
  --bp-font-family-heading: system-ui, -apple-system, sans-serif;

  /* Borders */
  --bp-border-width: 1px;
  --bp-border-radius: 4px;
  --bp-border-radius-large: 8px;
  --bp-border-radius-full: 9999px;

  /* Shadows */
  --bp-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --bp-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --bp-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --bp-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

**Testing:**

- Run `npm run build`
- Inspect generated CSS files
- Verify no primitive tokens like `--bp-vandarPoelBlue-500`
- Verify all semantic tokens present

---

### Phase 3: Component Token Migration (Day 2-3)

**Goal:** Update components to use new semantic tokens and remove any primitive token references.

#### Tasks

1. **Audit all component styles** for token usage
   - Run: `bp validate tokens` on all components
   - Search for any `--bp-{colorName}-{step}` patterns (primitive references)
   - List components that need updates

2. **Update components to use semantic tokens**

   **Typography tokens:**
   - Replace `var(--bp-font-sans)` → `var(--bp-font-family)`
   - Replace `var(--bp-font-mono)` → `var(--bp-font-family-mono)`
   - Add `var(--bp-font-family-heading)` to heading component

   **Border radius tokens:**
   - Create mapping strategy:
     - `--bp-border-radius-sm` (2px) → component-specific or keep universal?
     - `--bp-border-radius-md` (4px) → `var(--bp-border-radius)`
     - `--bp-border-radius-lg` (8px) → `var(--bp-border-radius-large)`
     - `--bp-border-radius-full` (9999px) → `var(--bp-border-radius-full)`
   - Update all components using border-radius

   **Decision needed:** Do we keep the full universal radius scale AND add semantic ones? Or replace certain universal tokens with semantic?

   Recommendation: Keep universal scale (`--bp-border-radius-sm/md/lg/xl`) for explicit control, add semantic tokens for theme-aware defaults. Components can choose which to use.

3. **Fix any broken references**
   - Search for `--bp-color-text-inverse` → verify it's in SemanticTokens
   - Ensure all color references map to semantic tokens

**Testing:**

- Run `bp validate tokens` to verify compliance
- Visual regression testing in demo pages
- Test light/dark theme switching

---

### Phase 4: Validation & Error Handling (Day 3)

**Goal:** Add build-time validation to ensure themes provide all required semantic tokens.

#### Tasks

1. **Enhance theme validation** in `source/themes/builder/validation.ts` (or create if missing)
   - Validate all required semantic tokens are provided
   - Check for missing color tokens
   - Check for missing typography tokens
   - Check for missing border/shadow tokens
   - Generate clear error messages:
     ```
     Error: Theme 'my-theme' variant 'light' is missing required tokens:
       - textStrong (color)
       - fontFamily (typography)
       - borderRadius (borders)
     ```

2. **Update `ThemeBuilder.build()`** in `source/themes/builder/ThemeBuilder.ts`
   - Call validation before generating CSS
   - Throw errors for missing required tokens
   - Provide warnings for optional tokens if helpful

3. **Update CLI validation command** in `source/cli/commands/validate.ts`
   - Add `bp validate theme <theme-id>` subcommand
   - Validate theme completeness
   - Report missing tokens
   - Check for deprecated primitive token usage in components

**Testing:**

- Create incomplete test theme
- Verify validation catches missing tokens
- Verify error messages are clear
- Test CLI commands

---

### Phase 5: Documentation & Migration Guide (Day 4)

**Goal:** Update all documentation to reflect new semantic token system.

#### Tasks

1. **Update plugin authoring guide** in `source/docs/plugin-authoring-guide.md`
   - Document new `SemanticTokens` interface
   - Show complete theme variant example with all required tokens
   - Explain that primitive colors are internal-only
   - Document new typography tokens
   - Document new border radius tokens
   - Add constraint: "Choose fonts that work at standard 16px base size"

2. **Update type generation docs** in `source/docs/type-generation.md`
   - Document semantic-only output
   - Update examples to show OKLCH direct resolution

3. **Update best practices** in `source/docs/best-practices.md`
   - Add section on semantic vs universal tokens
   - Explain when to use each
   - Component authors: always use semantic tokens
   - Theme authors: must provide all semantic tokens

4. **Update component README templates**
   - Update token usage sections to reference semantic tokens only

**Testing:**

- Review docs for accuracy
- Ensure code examples compile
- Verify all links work

---

### Phase 6: Cleanup & Polish (Day 4)

**Goal:** Remove deprecated code, clean up utilities.css, final testing.

#### Tasks

1. **Clean up `utilities.css`** in `source/themes/generated/`
   - Remove semantic token definitions that now come from themes:
     - Remove `--bp-color-text-inverse` (now from theme)
   - Keep universal infrastructure tokens:
     - Spacing scale
     - Font size scale
     - Font weight scale
     - Motion tokens
     - Z-index scale
     - Breakpoints
     - Focus indicators

2. **Update utility CSS generation**
   - If utilities are generated, update generator to exclude semantic tokens
   - Ensure utilities only contain universal infrastructure

3. **Final testing**
   - Build entire project: `npm run build`
   - Test demo pages: `npm run dev`
   - Test light/dark theme switching
   - Visual regression check
   - Test all components in Storybook (if applicable)
   - Run full test suite: `npm test`

4. **Update CHANGELOG** (if exists)
   - Document breaking changes for theme authors
   - Note new required tokens
   - Note removal of primitive token output

---

## Breaking Changes & Migration

### For Theme Plugin Authors

**Required Actions:**

1. Add new required tokens to all theme variants:
   - `textStrong` (if was optional)
   - `fontFamily`, `fontFamilyMono`, `fontFamilyHeading`
   - `borderRadius`, `borderRadiusLarge`, `borderRadiusFull`
   - All shadow tokens (if were optional)

2. Understand that primitive colors (e.g., `builder.colors.blue500`) are internal only and won't appear in CSS output

**Non-breaking:**

- Existing color mappings continue to work
- Internal use of `builder.addColor()` unchanged
- Semantic token mappings work the same way

### For Component Authors (Blueprint maintainers)

**Required Actions:**

1. Replace universal typography tokens with semantic ones:
   - `--bp-font-sans` → `--bp-font-family`
   - `--bp-font-mono` → `--bp-font-family-mono`

2. Consider using semantic border radius tokens where themes should control roundness

**Non-breaking:**

- Existing semantic color tokens unchanged
- Universal spacing/sizing tokens unchanged

### For Blueprint Users

**Non-breaking:**

- Components continue to work
- Theme switching continues to work
- No API changes

---

## Success Criteria

- [ ] All semantic tokens defined in TypeScript interface
- [ ] CSS output contains only semantic tokens (no primitives)
- [ ] All Blueprint components use semantic tokens
- [ ] Build-time validation catches missing tokens
- [ ] blueprint-core theme provides all required tokens
- [ ] Documentation fully updated
- [ ] All tests passing
- [ ] Demo page works with light/dark themes
- [ ] No console errors or warnings
- [ ] CSS file size reduced (no primitive tokens)

---

## Risks & Mitigations

**Risk:** Breaking existing custom themes  
**Mitigation:** Clear migration guide, validation errors with actionable messages

**Risk:** Components look wrong with new token mappings  
**Mitigation:** Visual regression testing, careful review of token mappings

**Risk:** Performance impact of OKLCH resolution at build time  
**Mitigation:** Should be faster (no runtime `var()` lookups), but benchmark if concerned

**Risk:** Incomplete migration leaves some primitive references  
**Mitigation:** Automated validation with `bp validate tokens`, grep searches

---

## Open Questions for Implementation

1. **Border radius mapping:** Do we replace some universal radius tokens with semantic ones, or add semantic alongside universal?
   - Recommendation: Add semantic alongside universal. Let components choose.

2. **Utilities.css:** Should we generate it from code or keep as static file?
   - Current: Static file
   - Consider: Generate to keep DRY

3. **Shadow token names:** Keep current (shadowSm/Md/Lg/Xl) or make more semantic (shadowSubtle/Default/Elevated/Floating)?
   - Recommendation: Keep size-based for consistency with existing patterns

4. **Hex fallbacks:** Should we still emit hex fallbacks for older browsers, or OKLCH-only?
   - Recommendation: Keep hex fallbacks with `@supports` override for OKLCH (already in design)

---

## Next Steps

1. Review this plan with team
2. Address open questions
3. Create GitHub issues/tasks for each phase
4. Begin Phase 1 implementation
