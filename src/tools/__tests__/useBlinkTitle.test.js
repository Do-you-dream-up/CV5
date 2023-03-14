import { act, renderHook } from '@testing-library/react-hooks';
import useTabNotification, { tick } from '../hooks/useBlinkTitle';

jest.useFakeTimers();

describe('useTabNotification', () => {
  afterEach(() => {
    document.title = '';
    jest.clearAllTimers();
  });
  it('should update the document title correctly', () => {
    const { result } = renderHook(() => useTabNotification());
    const message = 'New message';

    act(() => {
      result.current.setTabNotification(message);
    });

    expect(document.title).toBe(message);

    act(() => {
      result.current.clearTabNotification();
    });
    setTimeout(() => {
      expect(document.title).not.toBe(message);
    }, 500);
  });

  it('should update the message correctly', () => {
    const { result } = renderHook(() => useTabNotification());
    const message = 'New message';

    act(() => {
      result.current.setTabNotification(message);
    });

    expect(document.title).toBe(message);
  });

  it('should clear the tab notification and revert the document title to the original', () => {
    document.title = 'Original title';
    const { result } = renderHook(() => useTabNotification());

    // check that document title has been updated
    act(() => {
      result.current.setTabNotification('New message');
    });
    expect(document.title).toBe('New message');

    // clear notification
    act(() => {
      result.current.clearTabNotification();
    });
    console.log(document.title);
    // check that document title has been reset to original title
    setTimeout(() => {
      expect(document.title).toBe('Original title');
    }, 500);
  });

  test('tick function should update document title', () => {
    document.title = 'Original title';
    const message = 'New message';
    tick(message);
    expect(document.title).toBe(message);
    tick(message);
    setTimeout(() => {
      expect(document.title).toBe('Original title');
    }, 500);
  });

  it('should revert original title when unmounted', () => {
    const originalTitle = document.title;
    document.title = 'New title';
    const { unmount } = renderHook(() => useTabNotification(100));
    unmount();
    expect(document.title).toBe(originalTitle);
  });
});
