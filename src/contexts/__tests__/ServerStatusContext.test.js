import '@testing-library/jest-dom';

import { ServerStatusProvider, useServerStatus } from '../ServerStatusContext';
import { act, render } from '@testing-library/react';

import dydu from '../../tools/dydu';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../tools/dydu', () => ({
  setServerStatusCheck: jest.fn(),
  setMainServerStatus: jest.fn(),
}));
describe('ServerStatusProvider', () => {
  it('should render children', () => {
    const { getByText } = render(<ServerStatusProvider>test</ServerStatusProvider>);
    expect(getByText('test')).toBeDefined();
  });

  it('should set the server status check on mount', () => {
    jest.spyOn(dydu, 'setServerStatusCheck');
    render(<ServerStatusProvider />);
    expect(dydu.setServerStatusCheck).toHaveBeenCalled();
  });

  it('should update the main server status when the result changes', () => {
    jest.spyOn(dydu, 'setMainServerStatus');
    const { result } = renderHook(() => useServerStatus(), { wrapper: ServerStatusProvider });
    setTimeout(() => {
      act(async () => {
        await result.current.fetch();
      });
      expect(dydu.setMainServerStatus).toHaveBeenCalledWith(result.current.result.status);
    }, 500);
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
    expect(result.current.fetch).toBeDefined();
    expect(result.current.result).toBeNull();
    expect(result.current.checked).toBe(false);
  });

  describe('fetch', () => {
    it('should call setServerStatusCheck with fetch function', () => {
      const setServerStatusCheck = jest.spyOn(dydu, 'setServerStatusCheck');
      renderHook(() => useServerStatus(), { wrapper: ServerStatusProvider });
      expect(setServerStatusCheck).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should set result and checked state on success', async () => {
      dydu.getServerStatus = jest.fn().mockResolvedValueOnce({ status: 'UP' });
      const { result, waitForNextUpdate } = renderHook(() => useServerStatus(), { wrapper: ServerStatusProvider });
      await act(async () => {
        await result.current.fetch();
        await waitForNextUpdate();
      });
      expect(result.current.result).toEqual({ status: 'UP' });
      expect(result.current.checked).toBe(true);
    });
  });
});
