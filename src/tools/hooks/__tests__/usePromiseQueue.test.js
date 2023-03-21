import { act, renderHook } from '@testing-library/react-hooks';

import usePromiseQueue from '../usePromiseQueue';

const mockFunction = jest.fn().mockResolvedValue(true);
describe('usePromiseQueue', () => {
  it('should set unqueue to true on calling exec', () => {
    const { result } = renderHook(() => usePromiseQueue([() => Promise.resolve()]));
    act(() => {
      result.current.exec();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(true);
    }, 500);
  });

  xtest('forceExec function sets queue to orderedList and unqueue state to true', () => {
    const orderedList = [() => Promise.resolve()];
    const { result } = renderHook(() => usePromiseQueue(orderedList));
    act(() => {
      result.current.forceExec();
    });
    setTimeout(() => {
      expect(result.current.queue).toEqual(orderedList);
      expect(result.current.unqueue).toBe(true);
    }, 500);
  });

  xtest('executing promise queue', async () => {
    const orderedList = [
      () => new Promise((resolve) => setTimeout(resolve, 100)),
      () => new Promise((resolve) => setTimeout(resolve, 200)),
      () => new Promise((resolve) => setTimeout(resolve, 300)),
    ];
    const { result } = renderHook(() => usePromiseQueue(orderedList, true));
    setTimeout(() => {
      expect(result.current.queue).toEqual(orderedList);
      expect(result.current.unqueue).toBe(false);
    }, 500);

    act(() => {
      result.current.exec();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(true);
      expect(result.current.queue.length).toBe(2);
    }, 500);

    act(() => {
      result.current.exec();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(true);

      expect(result.current.queue.length).toBe(1);
    }, 500);
    act(() => {
      result.current.exec();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(true);

      expect(result.current.queue.length).toBe(0);
      expect(result.current.unqueue).toBe(false);
    }, 500);
  });

  xit('should set unqueue to false when the queue is empty', async () => {
    const { result } = renderHook(() => usePromiseQueue([mockFunction], true));

    // First execution
    act(() => {
      result.current.exec();
    });
    await act(async () => {
      await Promise.resolve();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(true);
    }, 500);
    // Second execution
    act(() => {
      result.current.exec();
    });
    await act(async () => {
      await Promise.resolve();
    });
    setTimeout(() => {
      expect(result.current.unqueue).toBe(false);
    }, 500);
  });

  test('should be exported as a default function', () => {
    expect(typeof usePromiseQueue).toBe('function');
    expect(usePromiseQueue.name).toBe('usePromiseQueue');
  });
});
