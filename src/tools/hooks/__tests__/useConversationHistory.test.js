import { act, renderHook } from '@testing-library/react-hooks';

import { compareObject } from '../../helpers.js';
import dydu from '../../../tools/dydu';
import useConversationHistory from '../useConversationHistory';

jest.mock('../../../tools/dydu', () => ({
  history: jest.fn(),
}));

describe('useConversationHistory', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return an object with fetch and result properties', () => {
    const { result } = renderHook(() => useConversationHistory());

    expect(result.current).toHaveProperty('fetch');
    expect(result.current).toHaveProperty('result');
  });

  it('should not set the result state when there are no interactions', () => {
    dydu.history.mockResolvedValueOnce({});

    const { result } = renderHook(() => useConversationHistory());

    expect(result.current.result).toEqual([]);

    result.current.fetch();

    expect(result.current.result).toEqual([]);
  });

  it('should not set the result state when interactions is not an array', () => {
    dydu.history.mockResolvedValueOnce({ interactions: {} });

    const { result } = renderHook(() => useConversationHistory());

    expect(result.current.result).toEqual([]);

    result.current.fetch();

    expect(result.current.result).toEqual([]);
  });

  it('should set the result state when fetching history with interactions array', async () => {
    const mockInteractions = [
      { id: 1, message: 'Hello' },
      { id: 2, message: 'How are you?' },
    ];
    dydu.history.mockResolvedValueOnce({ interactions: mockInteractions });

    const { result } = renderHook(() => useConversationHistory());

    await act(async () => {
      await result.current.fetch();
    });

    const hasSameValues = (arr1, arr2) => {
      return arr1.map((item, i) => compareObject(item, arr2[i])).every((bval) => bval === true);
    };

    expect(hasSameValues(result.current.result, mockInteractions)).toEqual(true);
  });
});
