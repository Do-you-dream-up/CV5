import { Local } from '../../storage';
import { act } from '@testing-library/react';
import dydu from '../../dydu';
import { renderHook } from '@testing-library/react-hooks';
import useVisitManager from '../useVisitManager';

jest.mock('../../dydu', () => ({
  getInfos: jest.fn(),
  registerVisit: jest.fn(),
}));
jest.mock('../../storage');
jest.mock('axios');

describe('useVisitManager', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call registerVisit when visit is not found', async () => {
    const { result, waitFor } = renderHook(() => useVisitManager());

    await act(async () => {
      await result.current.fetch();
      await waitFor(() => result.current.result === true);
    });
  });

  it('should not call registerVisit when visit is found and has not expired', async () => {
    const getInfosMock = jest.fn(() => ({
      someInfo: 'someValue',
    }));
    dydu.getInfos.mockResolvedValueOnce(getInfosMock());

    Local.visit.getKey.mockReturnValueOnce('visitKey');
    Local.visit.isSet.mockReturnValueOnce(true);
    Local.visit.load.mockReturnValueOnce(Date.now());

    const { result, waitFor } = renderHook(() => useVisitManager());

    expect(result.current.result).toBe(false);

    await act(async () => {
      await result.current.fetch();
      await waitFor(() => result.current.result === true);
    });

    expect(getInfosMock).toHaveBeenCalled();
    expect(Local.visit.getKey).toHaveBeenCalledWith(getInfosMock());
    expect(Local.visit.isSet).toHaveBeenCalledWith('visitKey');
    expect(Local.visit.load).toHaveBeenCalledWith('visitKey');
    expect(result.current.result).toBe(true);
    expect(dydu.registerVisit).not.toHaveBeenCalled();
  });

  it('should call registerVisit when visit is found but has expired', async () => {
    const getInfosMock = jest.fn(() => ({
      someInfo: 'someValue',
    }));
    dydu.getInfos.mockResolvedValueOnce(getInfosMock());

    Local.visit.getKey.mockReturnValueOnce('visitKey');
    Local.visit.isSet.mockReturnValueOnce(true);
    Local.visit.load.mockReturnValueOnce(Date.now() - 86400000);

    const registerVisitMock = jest.fn();
    dydu.registerVisit.mockResolvedValueOnce(registerVisitMock());

    const { result, waitFor } = renderHook(() => useVisitManager());

    expect(result.current.result).toBe(false);

    await act(async () => {
      await result.current.fetch();
      await waitFor(() => result.current.result === true);
    });

    expect(getInfosMock).toHaveBeenCalled();
    expect(Local.visit.getKey).toHaveBeenCalledWith(getInfosMock());
    expect(Local.visit.isSet).toHaveBeenCalledWith('visitKey');
    expect(Local.visit.load).toHaveBeenCalledWith('visitKey');
    expect(dydu.registerVisit).toHaveBeenCalled();
    expect(result.current.result).toBe(true);
  });
});
