import { describe, it, expect } from 'vitest';
import { booleanConverter } from './boolean-converter.js';

describe('booleanConverter', () => {
  describe('fromAttribute', () => {
    it('should return true when attribute is null (absent)', () => {
      expect(booleanConverter.fromAttribute!(null, '')).toBe(true);
    });

    it('should return true for empty string (attribute present with no value)', () => {
      expect(booleanConverter.fromAttribute!('', '')).toBe(true);
    });

    it('should return true for "true"', () => {
      expect(booleanConverter.fromAttribute!('true', '')).toBe(true);
    });

    it('should return false for "false"', () => {
      expect(booleanConverter.fromAttribute!('false', '')).toBe(false);
    });

    it('should return false for "FALSE" (case-insensitive)', () => {
      expect(booleanConverter.fromAttribute!('FALSE', '')).toBe(false);
    });

    it('should return false for "False"', () => {
      expect(booleanConverter.fromAttribute!('False', '')).toBe(false);
    });

    it('should return true for any other string value', () => {
      expect(booleanConverter.fromAttribute!('yes', '')).toBe(true);
      expect(booleanConverter.fromAttribute!('1', '')).toBe(true);
    });
  });

  describe('toAttribute', () => {
    it('should return empty string for true', () => {
      expect(booleanConverter.toAttribute!(true, '')).toBe('');
    });

    it('should return "false" for false', () => {
      expect(booleanConverter.toAttribute!(false, '')).toBe('false');
    });
  });
});
