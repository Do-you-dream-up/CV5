import '@testing-library/jest-dom';

import { ServerStatusProvider, useServerStatus } from '../ServerStatusContext';
import { act, render } from '@testing-library/react';

import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../tools/axios', () => ({
  ...jest.requireActual('../../tools/axios'),
  emit: jest.fn().mockReturnValue(Promise.resolve({ status: 'UP' })),
  SERVLET_API: {
    get: jest.fn(),
  },
}));

describe('ServerStatusProvider', () => {
  it('should render children', () => {
    const { getByText } = render(<ServerStatusProvider>test</ServerStatusProvider>);
    expect(getByText('test')).toBeDefined();
  });
});

describe('useServerStatus', () => {
  it('should throw an error when used outside of a ServerStatusProvider', () => {
    const { result } = renderHook(() => useServerStatus());
    setTimeout(() => {
      expect(result.error).toBeInstanceOf(Error);
    }, 500);
  });

  it('should return the server status context', () => {
    const { result } = renderHook(() => useServerStatus(), { wrapper: ServerStatusProvider });
    expect(result.current.checkServerStatus).toBeDefined();
    expect(result.current.isServerAvailable).toBe(false);
  });

  describe('fetch', () => {
    it('should set result and checked state on success', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useServerStatus(), { wrapper: ServerStatusProvider });
      await act(async () => {
        result.current.checkServerStatus();
        await waitForNextUpdate();
      });
      expect(result.current.isServerAvailable).toBe(true);
    });
  });
});
