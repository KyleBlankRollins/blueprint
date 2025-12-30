/**
 * Mock ThemeBuilder for testing
 * Provides a lightweight builder for unit tests
 */

import type {
  ThemeBuilderInterface,
  ColorDefinition,
  SemanticTokens,
  ColorRef,
} from '../../../core/types.js';
import { createColorRef } from '../../pluginUtils.js';

/**
 * Create a mock ThemeBuilder for testing
 * This is a simplified version that doesn't include full validation
 */
export function createMockBuilder(): MockThemeBuilder {
  return new MockThemeBuilder();
}

/**
 * Mock ThemeBuilder implementation
 */
export class MockThemeBuilder implements ThemeBuilderInterface {
  private colorDefinitions = new Map<string, ColorDefinition>();
  private themeVariantMap = new Map<string, SemanticTokens<ColorRef>>();
  public _colors: Record<string, ColorRef> = {};

  get colors(): Record<string, ColorRef> {
    return this._colors;
  }

  addColor(name: string, config: ColorDefinition): this {
    this.colorDefinitions.set(name, config);

    // Create color refs for each step
    for (const step of config.scale) {
      const ref = createColorRef(name, step);
      const compoundName = `${name}${step}`;
      this._colors[compoundName] = ref;
    }

    return this;
  }

  getColor(name: string): ColorDefinition | undefined {
    return this.colorDefinitions.get(name);
  }

  hasColor(name: string): boolean {
    return this.colorDefinitions.has(name);
  }

  addThemeVariant(name: string, tokens: SemanticTokens<ColorRef>): this {
    this.themeVariantMap.set(name, tokens);
    return this;
  }

  getThemeVariant(name: string): SemanticTokens<ColorRef> | undefined {
    return this.themeVariantMap.get(name);
  }

  extendThemeVariant(
    baseName: string,
    newName: string,
    overrides: Partial<SemanticTokens<ColorRef>>
  ): this {
    const base = this.themeVariantMap.get(baseName);
    if (!base) {
      throw new Error(`Base theme variant "${baseName}" not found`);
    }

    const extended = { ...base, ...overrides };
    this.themeVariantMap.set(newName, extended);
    return this;
  }

  /**
   * Get all color names (for testing)
   */
  getColorNames(): string[] {
    return Array.from(this.colorDefinitions.keys());
  }

  /**
   * Get all theme variant names (for testing)
   */
  getThemeVariantNames(): string[] {
    return Array.from(this.themeVariantMap.keys());
  }

  /**
   * Clear all data (for test cleanup)
   */
  clear(): void {
    this.colorDefinitions.clear();
    this.themeVariantMap.clear();
    this._colors = {};
  }
}

/**
 * Create a spy builder that tracks method calls
 */
export function createSpyBuilder() {
  const calls: {
    method: string;
    args: unknown[];
  }[] = [];

  const builder = createMockBuilder();

  // Wrap methods to track calls
  const originalAddColor = builder.addColor.bind(builder);
  builder.addColor = function (name: string, config: ColorDefinition) {
    calls.push({ method: 'addColor', args: [name, config] });
    return originalAddColor(name, config);
  };

  const originalAddThemeVariant = builder.addThemeVariant.bind(builder);
  builder.addThemeVariant = function (
    name: string,
    tokens: SemanticTokens<ColorRef>
  ) {
    calls.push({ method: 'addThemeVariant', args: [name, tokens] });
    return originalAddThemeVariant(name, tokens);
  };

  const originalExtendThemeVariant = builder.extendThemeVariant.bind(builder);
  builder.extendThemeVariant = function (
    baseName: string,
    newName: string,
    overrides: Partial<SemanticTokens<ColorRef>>
  ) {
    calls.push({
      method: 'extendThemeVariant',
      args: [baseName, newName, overrides],
    });
    return originalExtendThemeVariant(baseName, newName, overrides);
  };

  return {
    builder,
    calls,
    getCalls(methodName?: string) {
      if (methodName) {
        return calls.filter((c) => c.method === methodName);
      }
      return calls;
    },
    reset() {
      calls.length = 0;
      builder.clear();
    },
  };
}
