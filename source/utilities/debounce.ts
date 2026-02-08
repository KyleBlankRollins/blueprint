/**
 * Debounce utility for delaying function execution until after a period of inactivity.
 * Trailing-edge by default: fires after the delay has elapsed since the last call.
 */

type DebouncedFunction<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>): void => {
    pendingArgs = args;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (pendingArgs !== null) {
        const args = pendingArgs;
        pendingArgs = null;
        fn(...args);
      }
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    pendingArgs = null;
  };

  debounced.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (pendingArgs !== null) {
      const args = pendingArgs;
      pendingArgs = null;
      fn(...args);
    }
  };

  return debounced;
}
