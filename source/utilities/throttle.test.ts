import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from './throttle.js';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call the function immediately on first invocation', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should suppress rapid calls within the limit', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should execute trailing call after the limit elapses', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1 as never);
    throttled(2 as never);
    throttled(3 as never);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1);

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it('should allow a new call after the throttle period', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);

    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should cancel pending execution with .cancel()', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1 as never);
    throttled(2 as never);

    expect(fn).toHaveBeenCalledTimes(1);

    throttled.cancel();
    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should preserve argument types', () => {
    const fn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const throttled = throttle(fn, 100);

    throttled(42, 'hello');

    expect(fn).toHaveBeenCalledWith(42, 'hello');
  });
});
