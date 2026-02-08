import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should NOT call the function immediately', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();

    expect(fn).not.toHaveBeenCalled();
  });

  it('should call the function after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer on rapid calls and only fire the last one', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1 as never);
    vi.advanceTimersByTime(50);

    debounced(2 as never);
    vi.advanceTimersByTime(50);

    debounced(3 as never);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('should cancel pending execution with .cancel()', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    vi.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should execute immediately with .flush()', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(42 as never);
    debounced.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('should not fire again after .flush() when delay elapses', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.flush();

    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should do nothing when .flush() is called with no pending call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced.flush();

    expect(fn).not.toHaveBeenCalled();
  });

  it('should preserve argument types', () => {
    const fn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const debounced = debounce(fn, 100);

    debounced(42, 'hello');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith(42, 'hello');
  });
});
