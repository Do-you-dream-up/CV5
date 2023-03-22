import { addRule, getExternalInfos, processRules } from '../pushService';

import dydu from '../../../tools/dydu';
import fetchPushrules from '../index';
import { isEmptyArray } from '../../../tools/helpers';

jest.mock('../../../tools/dydu', () => ({
  pushrules: jest.fn(),
}));

jest.mock('../../../tools/helpers', () => ({
  isEmptyArray: jest.fn(),
}));

jest.mock('../pushService', () => ({
  addRule: jest.fn(),
  getExternalInfos: jest.fn(),
  processRules: jest.fn(),
}));

describe('fetchPushrules', () => {
  const mockData = {
    rule1: 'some data',
    rule2: 'some other data',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('resolves null if payload is empty', async () => {
    const mockPushrules = jest.fn().mockResolvedValue('{}');
    dydu.pushrules = mockPushrules;
    await expect(fetchPushrules()).resolves.toBeNull();
    expect(mockPushrules).toHaveBeenCalledTimes(1);
    expect(isEmptyArray).toHaveBeenCalledTimes(1);
    expect(addRule).toHaveBeenCalledTimes(0);
    expect(getExternalInfos).toHaveBeenCalledTimes(0);
    expect(processRules).toHaveBeenCalledTimes(0);
  });

  it('resolves null if payload is not valid JSON', async () => {
    const mockPushrules = jest.fn().mockResolvedValue('invalid json');
    dydu.pushrules = mockPushrules;
    await expect(fetchPushrules()).resolves.toBeNull();
    expect(mockPushrules).toHaveBeenCalledTimes(1);
    expect(isEmptyArray).toHaveBeenCalledTimes(0);
    expect(addRule).toHaveBeenCalledTimes(0);
    expect(getExternalInfos).toHaveBeenCalledTimes(0);
    expect(processRules).toHaveBeenCalledTimes(0);
  });

  it('resolves null if rules array is empty', async () => {
    const mockPushrules = jest.fn().mockResolvedValue(JSON.stringify([]));
    dydu.pushrules = mockPushrules;
    expect(addRule).toHaveBeenCalledTimes(0);
    expect(getExternalInfos).toHaveBeenCalledTimes(0);
    expect(processRules).toHaveBeenCalledTimes(0);
  });

  it('resolves with rules array if valid rules are returned', async () => {
    const mockPushrules = jest.fn().mockResolvedValue(JSON.stringify(mockData));
    dydu.pushrules = mockPushrules;
    const isEmptyArray = jest.fn().mockReturnValue(false);
    await expect(fetchPushrules()).resolves.toEqual(null);
    expect(mockPushrules).toHaveBeenCalledTimes(1);
    expect(isEmptyArray).toHaveBeenCalledTimes(0);
    expect(addRule).toHaveBeenCalledTimes(0);
    expect(getExternalInfos).toHaveBeenCalledTimes(0);
    expect(processRules).toHaveBeenCalledTimes(0);
  });
});
