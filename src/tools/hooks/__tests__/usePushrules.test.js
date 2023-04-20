import { act, renderHook } from '@testing-library/react-hooks';
import { addRule, getExternalInfos, processRules } from '../../pushrules/pushService';

import dydu from '../../dydu';
import usePushrules from '../usePushrules';

jest.mock('../../pushrules/pushService', () => ({
  addRule: jest.fn(),
  getExternalInfos: jest.fn(),
  processRules: jest.fn(),
}));

jest.mock('../../dydu', () => ({
  pushrules: jest.fn(),
}));

xdescribe('usePushrules', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return result and fetch function', () => {
    const { result } = renderHook(() => usePushrules());
    expect(result.current.result).toBeNull();
    expect(typeof result.current.fetch).toBe('function');
  });

  it('should fetch and process rules', async () => {
    const mockRules = '[{"rule": "exampleRule"}]';
    dydu.pushrules.mockResolvedValue(mockRules);

    const { result, waitForNextUpdate } = renderHook(() => usePushrules());
    act(() => {
      result.current.fetch();
    });

    await waitForNextUpdate();

    expect(addRule).toHaveBeenCalledTimes(1);
    expect(processRules).toHaveBeenCalledTimes(1);
    expect(getExternalInfos).toHaveBeenCalledTimes(1);
    expect(result.current.result).toEqual(JSON.parse(mockRules));
  });

  it('should handle empty payload', async () => {
    dydu.pushrules.mockResolvedValue('{}');

    const { result } = renderHook(() => usePushrules());
    act(() => {
      result.current.fetch();
    });

    console.log('🚀 ~ file: usePushrules.test.js:57 ~ it ~ result.current.result:', result.current.result);
    expect(result.current.result).toBeNull();
  });

  it('should handle invalid JSON', async () => {
    dydu.pushrules.mockResolvedValue('invalid JSON');

    const { result, waitForNextUpdate } = renderHook(() => usePushrules());
    act(() => {
      result.current.fetch();
    });

    await waitForNextUpdate();

    expect(result.current.result).toEqual([]);
  });

  it('should handle empty rules array', async () => {
    dydu.pushrules.mockResolvedValue('[]');

    const { result } = renderHook(() => usePushrules());
    act(() => {
      result.current.fetch();
    });

    expect(result.current.result).toBe(null);
  });
});
