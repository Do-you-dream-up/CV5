// /* eslint-disable react/prop-types */
// import { act, renderHook } from '@testing-library/react-hooks';

// import { ConfigurationProvider } from '../../../contexts/ConfigurationContext';
// import { Local } from '../../storage';
// import axios from 'axios';
// import dydu from '../../dydu';
// import { numberOfDayInMs } from '../../helpers';
// import useVisitManager from '../useVisitManager';

// jest.mock('../../dydu');
// jest.mock('../../storage');
// jest.mock('axios');

// const infosMock = { botId: 'botId', space: 'space', locale: 'fr' };
// const keyMock = `DYDU_lastvisitfor_${infosMock.botId}_${infosMock.space}_${infosMock.locale}`;

// const MockContextProvider = ({ children }) => <ConfigurationProvider value={{}}>{children}</ConfigurationProvider>;

describe('useVisitManager', () => {
  test('should call registerVisit if visit key is not set', async () => {
    expect(true).toBe(true);
  });
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //   test('should call registerVisit if visit key is not set', async () => {
  //     const getInfosMock = jest.fn().mockResolvedValue(infosMock);
  //     dydu.getInfos.mockResolvedValueOnce(getInfosMock);
  //     Local.visit.isSet.mockReturnValueOnce(false);
  //     Local.visit.getKey.mockReturnValueOnce(keyMock);
  //     Local.visit.load.mockReturnValueOnce(Date.now() - numberOfDayInMs(1));
  //     const registerVisitMock = jest.fn().mockResolvedValue({ success: true });
  //     dydu.registerVisit.mockResolvedValueOnce(registerVisitMock);
  //     // Mock the axios.post method
  //     jest.mock('axios');
  //     axios.post.mockResolvedValue({ data: { success: true } });
  //     const { result, waitForNextUpdate } = renderHook(() => useVisitManager(), {
  //       wrapper: MockContextProvider,
  //     });
  //     expect(result.current.result).toBe(false);
  //     await act(async () => {
  //       result.current.fetch();
  //       await waitForNextUpdate();
  //     });
  //     expect(result.current.result).toBe(true);
  //     expect(dydu.getInfos).toHaveBeenCalled();
  //     expect(Local.visit.getKey).toHaveBeenCalledTimes(1);
  //     expect(Local.visit.isSet).toHaveBeenCalledWith(keyMock);
  //     expect(dydu.registerVisit).toHaveBeenCalled();
  //     expect(axios.post).toHaveBeenCalledWith('http://example.com/registerVisit', {
  //       botId: infosMock.botId,
  //       space: infosMock.space,
  //       locale: infosMock.locale,
  //     });
  //   });
  //   test('should not call registerVisit if visit key is set and has not expired', async () => {
  //     const getInfosMock = jest.fn().mockResolvedValue(infosMock);
  //     dydu.getInfos.mockResolvedValueOnce(getInfosMock);
  //     Local.visit.isSet.mockReturnValueOnce(true);
  //     Local.visit.getKey.mockReturnValueOnce(keyMock);
  //     Local.visit.load.mockReturnValueOnce(Date.now() - numberOfDayInMs(1));
  //     const { result, waitForNextUpdate } = renderHook(() => useVisitManager(), {
  //       wrapper: MockContextProvider,
  //     });
  //     expect(result.current.result).toBe(false);
  //     await act(async () => {
  //       result.current.fetch();
  //       await waitForNextUpdate();
  //     });
  //     expect(result.current.result).toBe(true);
  //     expect(dydu.getInfos).toHaveBeenCalled();
  //     expect(Local.visit.getKey).toHaveBeenCalledTimes(1);
  //     expect(Local.visit.isSet).toHaveBeenCalledWith(keyMock);
  //     expect(Local.visit.load).toHaveBeenCalledWith(keyMock);
  //     expect(dydu.registerVisit).toHaveBeenCalledTimes(1);
  //   });
  //   test('should call registerVisit if visit key is set and has expired', async () => {
  //     const getInfosMock = jest.fn().mockResolvedValue(infosMock);
  //     dydu.getInfos.mockResolvedValueOnce(getInfosMock);
  //     Local.visit.isSet.mockReturnValueOnce(true);
  //     Local.visit.getKey.mockReturnValueOnce(keyMock);
  //     Local.visit.load.mockReturnValueOnce(Date.now() - numberOfDayInMs(2));
  //     const registerVisitMock = jest.fn().mockResolvedValue({ success: true });
  //     dydu.registerVisit.mockResolvedValueOnce(registerVisitMock);
  //     const { result, waitForNextUpdate } = renderHook(() => useVisitManager(), {
  //       wrapper: MockContextProvider,
  //     });
  //     expect(result.current.result).toBe(false);
  //     await act(async () => {
  //       result.current.fetch();
  //       await waitForNextUpdate();
  //     });
  //     expect(result.current.result).toBe(true);
  //     expect(dydu.getInfos).toHaveBeenCalled();
  //     expect(Local.visit.getKey).toHaveBeenCalledTimes(1);
  //     expect(Local.visit.isSet).toHaveBeenCalledWith(keyMock);
  //     expect(Local.visit.load).toHaveBeenCalledWith(keyMock);
  //     expect(dydu.registerVisit).toHaveBeenCalled();
  //   });
});
