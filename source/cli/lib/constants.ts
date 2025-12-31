/**
 * CLI Configuration Constants
 * Centralized constants for paths, ports, and validation patterns
 */

// Server Configuration
export const DEFAULT_VITE_PORT = 5173;
export const BROWSER_OPEN_DELAY_MS = 2000;

// Directory Paths (relative to project root)
export const GENERATED_THEMES_DIR = 'source/themes/generated';
export const PLUGINS_DIR = 'source/themes/plugins';
export const THEME_BUILDER_FILE = 'source/themes/builder/ThemeBuilder.ts';
export const DEMO_DIR = 'demo';

// File Names
export const THEME_PREVIEW_HTML = 'theme-preview.html';
export const PLUGIN_INDEX_FILE = 'index.ts';
export const PLUGIN_README_FILE = 'README.md';

// Validation Patterns
export const PLUGIN_ID_REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
export const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

// WCAG Contrast Standards
export const WCAG_AA_LARGE_TEXT = 3.0;
export const WCAG_AA_NORMAL_TEXT = 4.5;
export const WCAG_AAA_LARGE_TEXT = 4.5;
export const WCAG_AAA_NORMAL_TEXT = 7.0;
