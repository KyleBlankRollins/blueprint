import { describe, it, expect, vi } from 'vitest';
import { memoizeOne } from './memoize.js';

describe('memoizeOne', () => {
  it('should return the cached result for the same arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoizeOne(fn);

    const result1 = memoized(1, 2);
    const result2 = memoized(1, 2);

    expect(result1).toBe(3);
    expect(result2).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return referentially equal results for same arguments', () => {
    const fn = vi.fn((items: string[]) => items.map((s) => s.toUpperCase()));
    const memoized = memoizeOne(fn);

    const input = ['a', 'b', 'c'];
    const result1 = memoized(input);
    const result2 = memoized(input);

    expect(result1).toBe(result2); // Same reference
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should recompute when arguments change', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoizeOne(fn);

    const result1 = memoized(1, 2);
    const result2 = memoized(3, 4);

    expect(result1).toBe(3);
    expect(result2).toBe(7);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should only cache the last result (not older calls)', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoizeOne(fn);

    memoized(1);
    memoized(2);
    memoized(1); // Should recompute, not use the first cached result

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should work with multiple arguments', () => {
    const fn = vi.fn((a: number, b: string, c: boolean) => `${a}-${b}-${c}`);
    const memoized = memoizeOne(fn);

    const result1 = memoized(1, 'hello', true);
    const result2 = memoized(1, 'hello', true);
    const result3 = memoized(1, 'hello', false);

    expect(result1).toBe('1-hello-true');
    expect(result2).toBe('1-hello-true');
    expect(result3).toBe('1-hello-false');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use shallow equality for object arguments (same reference matches)', () => {
    const fn = vi.fn((obj: { x: number }) => obj.x * 2);
    const memoized = memoizeOne(fn);

    const obj = { x: 5 };
    const result1 = memoized(obj);
    const result2 = memoized(obj); // Same reference

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should recompute for new object with same values (different reference)', () => {
    const fn = vi.fn((obj: { x: number }) => obj.x * 2);
    const memoized = memoizeOne(fn);

    const result1 = memoized({ x: 5 });
    const result2 = memoized({ x: 5 }); // New object, same values

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2); // Should recompute
  });

  it('should handle no-argument functions', () => {
    let counter = 0;
    const fn = vi.fn(() => ++counter);
    const memoized = memoizeOne(fn);

    const result1 = memoized();
    const result2 = memoized();

    expect(result1).toBe(1);
    expect(result2).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle willUpdate pattern with rows and sortState', () => {
    type Row = { id: number; name: string };
    type SortState = { column: string; direction: 'asc' | 'desc' };

    const sortRows = vi.fn((rows: Row[], sort: SortState) => {
      return [...rows].sort((a, b) =>
        sort.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    });

    const memoizedSort = memoizeOne(sortRows);

    const rows: Row[] = [
      { id: 1, name: 'Charlie' },
      { id: 2, name: 'Alice' },
    ];
    const sort: SortState = { column: 'name', direction: 'asc' };

    const result1 = memoizedSort(rows, sort);
    const result2 = memoizedSort(rows, sort);

    expect(result1).toBe(result2); // Same reference
    expect(sortRows).toHaveBeenCalledTimes(1);

    // New sort state object triggers recompute
    const newSort: SortState = { column: 'name', direction: 'desc' };
    const result3 = memoizedSort(rows, newSort);

    expect(result3).not.toBe(result1);
    expect(sortRows).toHaveBeenCalledTimes(2);
  });
});
