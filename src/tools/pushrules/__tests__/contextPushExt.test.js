import contextPush from '../contextPushExt';

describe('contextPush', () => {
  const now = new Date('2023-03-17T12:48:12.411Z');
  it('getGlobalVisitDuration should return correct visit duration', () => {
    const lastVisitTime = now.setSeconds(now.getSeconds() - 60);
    contextPush.getLastVisitTime = jest.fn(() => lastVisitTime);
    const duration = contextPush.getGlobalVisitDuration(now);
    expect(duration).toBe(NaN);
  });

  it('getGlobalVisitCount should return global visit count', () => {
    const count = contextPush.getGlobalVisitCount();
    expect(typeof count).toBe('number');
  });

  it('setGlobalVisitCount should set global visit count', () => {
    const count = 5;
    contextPush.setGlobalVisitCount(count);
    expect(contextPush.getGlobalVisitCount()).toBe(count);
  });

  it('getLastVisitTime should return last visit time', () => {
    contextPush.writeCookie = jest.fn();
    contextPush.readCookieValue = jest.fn(() => now);
    const lastVisitTime = contextPush.getLastVisitTime(now);
    expect(lastVisitTime).toBe(1679057232411);
  });

  it('setLastVisitTime should set last visit time', () => {
    contextPush.writeCookie = jest.fn();
    contextPush.setLastVisitTime(now);
    expect(contextPush.getLastVisitTime(now)).toBe(1679057232411);
  });

  it('getLastPageLoadedTime should return last page loaded time', () => {
    const time = contextPush.getLastPageLoadedTime();
    expect(typeof time).toBe('number');
  });

  it('setLastPageLoadedTime should set last page loaded time', () => {
    contextPush.writeCookie = jest.fn();
    contextPush.setLastPageLoadedTime(now);
    expect(contextPush.getLastPageLoadedTime()).toBe(2023);
  });

  it('getPagesViewedCount should return pages viewed count', () => {
    const count = contextPush.getPagesViewedCount();
    expect(typeof count).toBe('number');
  });

  it('computeDurationSinceLastVisit should compute duration since last visit', () => {
    const lastVisitTime = now.setMinutes(now.getMinutes() - 1);
    contextPush.getLastVisitTime = jest.fn(() => lastVisitTime);
    contextPush.writeCookie = jest.fn();
    contextPush.computeDurationSinceLastVisit(now);
    const duration = contextPush.getDurationSinceLastVisit();
    expect(duration).toBe(1679057170.388);
  });
});
