/**
 * Single-result memoization utility.
 * Caches the last call's arguments and result using shallow equality comparison.
 * Ideal for willUpdate() patterns where you memoize based on reactive properties.
 */

export function memoizeOne<T extends (...args: never[]) => unknown>(
  fn: T
): T {
  let lastArgs: Parameters<T> | undefined;
  let lastResult: ReturnType<T>;
  let hasBeenCalled = false;

  const memoized = (...args: Parameters<T>): ReturnType<T> => {
    if (hasBeenCalled && argsMatch(lastArgs!, args)) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = fn(...args) as ReturnType<T>;
    hasBeenCalled = true;
    return lastResult;
  };

  return memoized as T;
}

function argsMatch(prev: unknown[], next: unknown[]): boolean {
  if (prev.length !== next.length) {
    return false;
  }

  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== next[i]) {
      return false;
    }
  }

  return true;
}
