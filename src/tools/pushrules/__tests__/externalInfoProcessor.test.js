import { ExternalInfoProcessor } from '../externalInfoProcessor';
import contextPush from '../contextPushExt';

describe('ExternalInfoProcessor', () => {
  const mockNow = 1618531200000; // April 16, 2021 00:00:00 UTC
  let mockWindowLocation;
  let mockNavigatorLanguage;
  let mockDocumentReferrer;

  beforeAll(() => {
    mockWindowLocation = jest.spyOn(window, 'location', 'get');
    mockWindowLocation.mockReturnValue({ href: 'https://example.com' });

    mockNavigatorLanguage = jest.spyOn(navigator, 'language', 'get');
    mockNavigatorLanguage.mockReturnValue('en-US');

    mockDocumentReferrer = jest.spyOn(document, 'referrer', 'get');
    mockDocumentReferrer.mockReturnValue('https://google.com?q=search+terms');
  });

  afterAll(() => {
    mockWindowLocation.mockRestore();
    mockNavigatorLanguage.mockRestore();
    mockDocumentReferrer.mockRestore();
  });

  describe('globalInfoProcessor', () => {
    it('should set the externalInfos properties correctly', () => {
      const externalInfos = {};
      ExternalInfoProcessor[0](externalInfos);

      expect(externalInfos).toEqual({
        windowLocation: 'https://example.com',
        language: 'en-US',
        referrer: 'https://google.com?q=search+terms',
        usedKeywords: ['search', 'terms'],
        now: expect.any(Number),
      });
    });
  });

  describe('visitCountProcessor', () => {
    it('should increment the visit count and reset the session count if appropriate', () => {
      const externalInfos = {
        now: mockNow,
      };
      jest.spyOn(contextPush, 'getGlobalVisitCount').mockReturnValue(3);
      jest.spyOn(contextPush, 'getLastPageLoadedTime').mockReturnValue(mockNow - 31 * 60 * 1000);
      jest.spyOn(contextPush, 'resetSessionCount');
      jest.spyOn(contextPush, 'setGlobalVisitCount');
      jest.spyOn(contextPush, 'setLastPageLoadedTime');

      ExternalInfoProcessor[1](externalInfos);

      expect(contextPush.getGlobalVisitCount).toHaveBeenCalledTimes(1);
      expect(contextPush.getLastPageLoadedTime).toHaveBeenCalledTimes(1);
      expect(contextPush.resetSessionCount).toHaveBeenCalledTimes(1);
      expect(contextPush.setGlobalVisitCount).toHaveBeenCalledTimes(1);
      expect(contextPush.setLastPageLoadedTime).toHaveBeenCalledTimes(1);
      expect(contextPush.setGlobalVisitCount).toHaveBeenCalledWith(4);
      expect(contextPush.resetSessionCount).toHaveBeenCalledWith(mockNow);
      expect(contextPush.setLastPageLoadedTime).toHaveBeenCalledWith(mockNow);
      expect(externalInfos.visitCount).toBe(4);
    });
  });

  describe('visitDurationProcessor', () => {
    test('should set visitDuration in externalInfos', () => {
      const externalInfos = { now: mockNow };
      const getGlobalVisitDurationSpy = jest.spyOn(contextPush, 'getGlobalVisitDuration');
      getGlobalVisitDurationSpy.mockReturnValue(5000);
      ExternalInfoProcessor[2](externalInfos);
      expect(externalInfos.visitDuration).toEqual(5000);
      expect(getGlobalVisitDurationSpy).toHaveBeenCalledWith(externalInfos.now);
      getGlobalVisitDurationSpy.mockRestore();
    });
  });

  describe('pagesViewedCountCountProcessor', () => {
    test('should set pagesViewedCount in externalInfos', () => {
      const externalInfos = {};
      const getPagesViewedCountSpy = jest.spyOn(contextPush, 'getPagesViewedCount');
      getPagesViewedCountSpy.mockReturnValue(3);
      ExternalInfoProcessor[3](externalInfos);
      expect(externalInfos.pagesViewedCount).toEqual(3);
      expect(getPagesViewedCountSpy).toHaveBeenCalled();
      getPagesViewedCountSpy.mockRestore();
    });
  });

  describe('durationSinceLastVisitCountProcessor', () => {
    test('should set durationSinceLastVisit in externalInfos', () => {
      const externalInfos = {};
      const getDurationSinceLastVisitSpy = jest.spyOn(contextPush, 'getDurationSinceLastVisit');
      getDurationSinceLastVisitSpy.mockReturnValue(3600000);
      ExternalInfoProcessor[4](externalInfos);
      expect(externalInfos.durationSinceLastVisit).toEqual(3600000);
      expect(getDurationSinceLastVisitSpy).toHaveBeenCalled();
      getDurationSinceLastVisitSpy.mockRestore();
    });
  });
});
