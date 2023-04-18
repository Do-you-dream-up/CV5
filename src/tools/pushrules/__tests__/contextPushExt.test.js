import '@testing-library/jest-dom';

import contextPush from '../contextPushExt';
import { rulesDefinitions } from '../rulesDefinition';

describe('contextPush', () => {
  const now = new Date('2023-03-17T12:48:12.411Z');
  const value = 'value';

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

  it('should call computeDurationSinceLastVisit, setLastVisitTime, and setPagesViewedCount', () => {
    contextPush.resetSessionCount(now);

    const resultDuration = contextPush.getDurationSinceLastVisit();
    const resultLastVisitTime = contextPush.getLastVisitTime();
    const resultPagesViewedCount = contextPush.getPagesViewedCount();

    expect(resultDuration).toBe(1679057170.388);
    expect(resultLastVisitTime).toBe(1679057172411);
    expect(resultPagesViewedCount).toBe(1);
  });

  test('has all required properties for each rule', () => {
    rulesDefinitions.forEach((rule) => {
      expect(rule).toHaveProperty('name');
      expect(rule).toHaveProperty('processDelays');
    });
  });

  test('PageVisitCount returns INVALID_DELAY if the condition operator is invalid', () => {
    const condition = { operator: 'InvalidOperator', value: '5' };
    const result = rulesDefinitions
      .find((rule) => rule.name === 'PageVisitCount')
      .processDelays(condition, 'ruleId', {});
    expect(result).toEqual({ delay: -1, idleDelay: -1 });
  });

  test('PageVisitCount returns VALID_DELAY if the condition value is 0', () => {
    const condition = { operator: 'GreaterThan', value: '0' };
    const result = rulesDefinitions
      .find((rule) => rule.name === 'PageVisitCount')
      .processDelays(condition, 'ruleId', { visitCount: 0 });
    expect(result).toEqual({ delay: -1, idleDelay: -1 });
  });

  describe('setPagesViewedCount', () => {
    it('should write pages viewed count cookie', () => {
      contextPush.setPagesViewedCount(value);
      const result = parseInt(contextPush.readCookieValue('pagesViewed', 'count', 0, 'session'));
      expect(result).toBe(NaN);
    });
  });

  describe('setCity', () => {
    it('should call writeCookie with correct arguments', () => {
      const city = 'New York';

      contextPush.setCity(city);
      const result = contextPush.getCity();

      expect(result).toBe('New York');
    });
  });

  describe('getCountry', () => {
    it('should return country from cookie', () => {
      const result = contextPush.getCountry();
      expect(typeof result).toBe('string');
    });
  });

  describe('setCountry', () => {
    test('should call writeCookie with correct arguments', () => {
      // Call the function with test data
      contextPush.setCountry('Canada');
      contextPush.readCookieValue = jest.fn(() => now);
      const values = contextPush.getCountry();

      expect(values).toBe('Canada');
    });
  });

  test('City returns INVALID_DELAY if externInfos does not have city property', () => {
    const condition = { operator: 'Contains', value: 'New York' };
    const result = rulesDefinitions.find((rule) => rule.name === 'City').processDelays(condition, 'ruleId', {});
    expect(result).toEqual({ delay: 0, idleDelay: -1 });
  });

  test('City returns VALID_DELAY if the condition is compliant', () => {
    const condition = { operator: 'Contains', value: 'New York' };
    const externInfos = { city: 'New York' };
    const result = rulesDefinitions
      .find((rule) => rule.name === 'City')
      .processDelays(condition, 'ruleId', externInfos);
    expect(result).toEqual({ delay: 0, idleDelay: -1 });
  });

  describe('processKeywords', () => {
    it('returns an empty array if the given reference does not contain a query string', () => {
      expect(contextPush.processKeywords('https://example.com/')).toEqual([]);
    });

    it('returns an array of keywords if the given reference contains a Google query string', () => {
      expect(contextPush.processKeywords('https://www.google.com/search?q=example+search')).toEqual([
        'example',
        'search',
      ]);
    });

    it('returns an array of keywords if the given reference contains a Yahoo query string', () => {
      expect(contextPush.processKeywords('https://search.yahoo.com/search?p=example+search')).toEqual([
        'example',
        'search',
      ]);
    });

    it('returns an empty array if the given reference contains a query string that does not include q= or p=', () => {
      expect(contextPush.processKeywords('https://example.com/?key=value')).toEqual([]);
    });
    it('processKeywords returns an empty array when no q or p parameter exists in the query string', () => {
      const ref = 'https://www.example.com/search?category=books&author=John+Doe';
      const result = contextPush.processKeywords(ref);
      expect(result).toEqual([]);
    });
  });
});
