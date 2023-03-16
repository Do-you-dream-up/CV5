import { renderHook } from '@testing-library/react-hooks';
import useEventListener from '../event';

describe('useEventListener', () => {
  it('registers an event listener on the specified element', () => {
    const mockCallback = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const { unmount } = renderHook(() => useEventListener('click', mockCallback));

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

    unmount();

    addEventListenerSpy.mockRestore();
  });

  it('calls the specified handler function when the event is triggered', () => {
    const mockCallback = jest.fn();
    renderHook(() => useEventListener('click', mockCallback));
  });

  it('registers the event listener on a specified element', () => {
    const mockCallback = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const div = document.createElement('div');
    document.body.appendChild(div);

    const { unmount } = renderHook(() => useEventListener('click', mockCallback, div));

    unmount();

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();

    document.body.removeChild(div);
  });
});
