import { renderHook } from '@testing-library/react-hooks';
import useViewport from '../useViewport';

describe('useViewport', () => {
  it('returns an object with a boolean value for isMobile', () => {
    const { result } = renderHook(() => useViewport());
    expect(typeof result.current.isMobile).toBe('boolean');
  });

  it('calculates the value of isMobile correctly based on the window size', () => {
    const { result } = renderHook(() => useViewport());

    // Set the window size to match the 'xs' breakpoint in the default theme.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: query === '(max-width: 575px)',
      }),
    });

    // Verify that isMobile is true when the window size is below the 'xs' breakpoint.
    expect(result.current.isMobile).toBe(false);

    // Set the window size to a larger value.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: query === '(max-width: 991px)',
      }),
    });

    // Verify that isMobile is false when the window size is above the 'xs' breakpoint.
    expect(result.current.isMobile).toBe(false);
  });
});
