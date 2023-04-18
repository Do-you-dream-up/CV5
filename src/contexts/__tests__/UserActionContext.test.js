import { UserActionProvider, useUserAction } from '../UserActionContext';

import { renderHook } from '@testing-library/react-hooks';

describe('useUserAction', () => {
  it('should set tabbing to true when tab key is pressed', () => {
    const { result } = renderHook(() => useUserAction(), {
      wrapper: UserActionProvider,
    });

    expect(result.current.tabbing).toBe(false);

    const tabKeyEvent = new KeyboardEvent('keydown', { keyCode: 9 });
    document.dispatchEvent(tabKeyEvent);

    expect(result.current.tabbing).toBe(true);
  });

  it('should set tabbing to false when a click event occurs', () => {
    const { result } = renderHook(() => useUserAction(), {
      wrapper: UserActionProvider,
    });

    expect(result.current.tabbing).toBe(false);

    const clickEvent = new MouseEvent('click');
    document.dispatchEvent(clickEvent);

    expect(result.current.tabbing).toBe(false);
  });
});
