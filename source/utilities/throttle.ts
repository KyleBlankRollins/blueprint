/**
 * Throttle utility for rate-limiting function calls.
 * When limit <= 16ms, uses requestAnimationFrame for frame-aligned throttling.
 * Otherwise uses Date.now() comparison.
 */

type ThrottledFunction<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  limit: number
): ThrottledFunction<T> {
  const useRAF = limit <= 16;
  let lastArgs: Parameters<T> | null = null;
  let rafId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let waiting = false;

  const throttled = (...args: Parameters<T>): void => {
    if (useRAF) {
      lastArgs = args;
      if (rafId === null) {
        // First call: execute immediately
        fn(...args);
        lastArgs = null;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (lastArgs !== null) {
            fn(...lastArgs);
            lastArgs = null;
          }
        });
      }
    } else {
      if (!waiting) {
        // First call or enough time has elapsed
        fn(...args);
        waiting = true;
        lastArgs = null;

        const scheduleNext = () => {
          timeoutId = setTimeout(() => {
            timeoutId = null;
            if (lastArgs !== null) {
              fn(...lastArgs);
              lastArgs = null;
              scheduleNext();
            } else {
              waiting = false;
            }
          }, limit);
        };
        scheduleNext();
      } else {
        lastArgs = args;
      }
    }
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    waiting = false;
  };

  return throttled;
}
