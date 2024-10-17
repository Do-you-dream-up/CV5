import { renderHook } from '@testing-library/react-hooks';
import useNotificationHelper from '../useNotificationHelper';

describe('useNotificationHelper', () => {
  test('should return null values for undefined notification', () => {
    const { result } = renderHook(() => useNotificationHelper(undefined));
    expect(result.current.text).toBe(undefined);
    expect(result.current.iconName).toBeNull();
  });
});
