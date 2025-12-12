import { Local } from '../../storage';
import { act } from '@testing-library/react';
import dydu from '../../dydu';
import { renderHook } from '@testing-library/react-hooks';
import useVisitManager from '../useVisitManager';
import { BOT } from '../../bot';

jest.mock('../../dydu', () => ({
  getInfos: jest.fn(),
  welcomeCall: jest.fn(),
}));
jest.mock('../../storage');
jest.mock('axios');

describe('useVisitManager', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call welcomeCall when visit is found and has not expired', async () => {
    Local.visit.isSet.mockReturnValueOnce(true);
    Local.visit.load.mockReturnValueOnce(Date.now());

    const { result, waitFor } = renderHook(() => useVisitManager());

    await act(async () => {
      await result.current.fetchVisitorRegistration();
      await waitFor(() => result.current.result === true);
    });

    expect(Local.visit.isSet).toHaveBeenCalled();
    expect(Local.visit.load).toHaveBeenCalled();

    expect(dydu.welcomeCall).not.toHaveBeenCalled();
    expect(dydu.getInfos).not.toHaveBeenCalled();
    expect(Local.visit.save).not.toHaveBeenCalled();

    expect(result.current.result).toBe(true);
  });

  it('should call welcomeCall when visit is found but has expired', async () => {
    const mockInfos = { someInfo: 'someValue' };

    dydu.getInfos.mockReturnValueOnce(mockInfos);
    dydu.welcomeCall.mockResolvedValueOnce(undefined);

    Local.visit.isSet.mockReturnValueOnce(true);
    Local.visit.load.mockReturnValueOnce(Date.now() - 86400000);

    const { result, waitFor } = renderHook(() => useVisitManager());

    await act(async () => {
      await result.current.fetchVisitorRegistration();
      await waitFor(() => result.current.result === true);
    });

    expect(Local.visit.isSet).toHaveBeenCalled();
    expect(Local.visit.load).toHaveBeenCalled();
    expect(dydu.welcomeCall).toHaveBeenCalled();
    expect(dydu.getInfos).toHaveBeenCalled();
    expect(Local.visit.save).toHaveBeenCalled();
    expect(result.current.result).toBe(true);
  });
});
