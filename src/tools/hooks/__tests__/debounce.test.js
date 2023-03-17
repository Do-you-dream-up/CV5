import { act, renderHook } from '@testing-library/react-hooks';

import React from 'react';
import useDebounce from '../debounce';

describe('useDelay', () => {
  jest.useFakeTimers();

  it('should return the initial value immediately', () => {
    const initialValue = 'initial value';
    const { result } = renderHook(() => useDebounce(initialValue, 1000));

    expect(result.current).toBe(initialValue);
  });

  it('should return the initial value after the delay', () => {
    const value = 'test';
    const { result } = renderHook(() => useDebounce(value, 1000));
    setTimeout(() => {
      expect(result.current).toBe(value);
    }, 500);
  });

  it('should return the new value after the delay', () => {
    const { result } = renderHook(() => useDebounce('test', 1000));
    setTimeout(() => {
      act(() => {
        result.current = 'new value';
      });
      expect(result.current).toBe('new value');
    }, 500);
  });
});
