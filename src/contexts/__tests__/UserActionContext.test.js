import { UserActionProvider, useUserAction } from '../UserActionContext';

import { act, renderHook } from '@testing-library/react-hooks';
import { useShadow } from '../ShadowProvider';

jest.mock('../ShadowProvider');

describe('useUserAction', () => {
  it('should set tabbing to true when tab key is pressed', () => {
    const mockDiv = document.createElement('div');
    document.body.appendChild(mockDiv);

    useShadow.mockReturnValue({
      shadowAnchor: mockDiv,
    });

    const { result } = renderHook(() => useUserAction(), {
      wrapper: UserActionProvider,
    });

    act(() => {
      const tabKeyEvent = new KeyboardEvent('keydown', { keyCode: 9 });
      mockDiv.dispatchEvent(tabKeyEvent);
    });

    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      expect(result.current.tabbing).toBe(true);
    });
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
