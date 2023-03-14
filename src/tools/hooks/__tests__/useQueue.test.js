import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useQueue from '../useQueue';

describe('useQueue', () => {
  it('should initialize with an empty queue', () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.isEmpty).toBeTruthy();
    expect(result.current.list).toEqual([]);
  });

  it('should add an item to the queue', () => {
    const { result } = renderHook(() => useQueue(['item1', 'item2', 'item3']));
    const item = 'test';
    act(() => {
      result.current.put(item);
      console.log(result.current.list);
    });
    expect(result.current.isEmpty).toBeFalsy();
    expect(result.current.list[0]).toContain(item);
  });

  it('should remove the first item from the queue', () => {
    const { result } = renderHook(() => useQueue(['item1', 'item2', 'item3']));
    act(() => {
      result.current.pop();
    });
    expect(result.current.list).toEqual(['item2', 'item3']);
  });
});
