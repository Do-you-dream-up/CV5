import { act, renderHook } from '@testing-library/react-hooks';

import React from 'react';
import usePrevious from '../previous';

describe('useCurrentValue', () => {
  it('should return the initial value', () => {
    const value = 'test';
    const { result } = renderHook(() => usePrevious(value));
    setTimeout(() => {
      expect(result.current).toBe(value);
    }, 500);
  });

  it('should return the new value when updated', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 'test' } });
    setTimeout(() => {
      expect(result.current).toBe('test');
      rerender({ value: 'new value' });
      expect(result.current).toBe('new value');
    }, 500);
  });

  it('should not update the value if the prop has not changed', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 'test' } });
    setTimeout(() => {
      expect(result.current).toBe('test');
      const originalRef = result.current;
      rerender({ value: 'test' });
      expect(result.current).toBe(originalRef);
    }, 500);
  });
});
