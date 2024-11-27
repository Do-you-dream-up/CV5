import Auth, { Cookie, Session } from '../storage';

import cookie from 'js-cookie';

jest.mock('js-cookie');
describe('Session', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('should get the value from session storage', () => {
    const value = { name: 'test' };
    sessionStorage.setItem('test', JSON.stringify(value));
    const result = Session.get('test');
    expect(result).toEqual(value);
  });

  test('should get the fallback value if the name is not found', () => {
    const result = Session.get('test', 'fallback');
    expect(result).toEqual('fallback');
  });

  test('should get the fallback value if the name is not found and save it if the save flag is true', () => {
    Session.get('test', 'fallback', true);
    const result = sessionStorage.getItem('test');
    expect(result).toEqual('fallback');
  });

  test('should set a value to session storage', () => {
    Session.set('test', { name: 'test' });
    const result = JSON.parse(sessionStorage.getItem('test'));
    expect(result).toEqual({ name: 'test' });
  });

  test('should set a timestamp if no value is provided', () => {
    const date = new Date().getTime();
    jest.spyOn(Date, 'now').mockImplementation(() => date);
    Session.set('test');
    const result = parseInt(sessionStorage.getItem('test'));
    expect(result).toEqual(Math.floor(date / 1000));
    jest.spyOn(Date, 'now').mockRestore();
  });

  test('should clear a specific item from session storage', () => {
    sessionStorage.setItem('test', 'value');
    Session.clear('test');
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  test('should clear all items from session storage', () => {
    sessionStorage.setItem('test1', 'value1');
    sessionStorage.setItem('test2', 'value2');
    Session.clear();
    expect(sessionStorage.getItem('test1')).toBeNull();
    expect(sessionStorage.getItem('test2')).toBeNull();
  });
});

describe('Cookie', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls cookie.getJSON with the specified name', () => {
    const name = 'test';
    const expectedValue = { foo: 'bar' };
    cookie.getJSON.mockReturnValue(expectedValue);

    const result = Cookie.get(name);

    expect(cookie.getJSON).toHaveBeenCalledWith(name);
    expect(result).toEqual(expectedValue);
  });

  it('calls cookie.set with the specified name, value and options', () => {
    const name = 'test';
    const value = 'test value';
    const options = { expires: 10 };
    const expectedOptions = { expires: 10, ...Cookie.options };

    Cookie.set(name, value, options);

    expect(cookie.set).toHaveBeenCalledWith(name, value, expectedOptions);
  });

  it('uses the current timestamp if value is undefined', () => {
    const name = 'test';
    const expectedValue = Math.floor(Date.now() / 1000);
    const expectedOptions = { expires: Cookie.duration.short, ...Cookie.options };
    Cookie.set(name);

    expect(cookie.set).toHaveBeenCalledWith(name, expectedValue, expectedOptions);
  });

  it('stringifies the value if it is an object', () => {
    const name = 'test';
    const value = { foo: 'bar' };
    const expectedValue = JSON.stringify(value);
    const expectedOptions = { expires: Cookie.duration.short, ...Cookie.options };
    Cookie.set(name, value);

    expect(cookie.set).toHaveBeenCalledWith(name, expectedValue, expectedOptions);
  });
  it('calls cookie.remove with the specified name', () => {
    const name = 'test';

    Cookie.remove(name);

    expect(cookie.remove).toHaveBeenCalledWith(name);
  });
});

describe('Auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('savePkce()', () => {
    it('should save pkce data to local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Auth.savePkce(pkceData);
      expect(localStorage.getItem('pkce')).toBe(JSON.stringify(pkceData));
    });
  });

  describe('clearPkce()', () => {
    it('should remove pkce data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Auth.savePkce(pkceData);
      Auth.clearPkce();
      expect(localStorage.getItem('pkce')).toBe(null);
    });
  });

  describe('loadPkce()', () => {
    it('should load pkce data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Auth.savePkce(pkceData);
      expect(Auth.loadPkce()).toEqual(pkceData);
    });

    it('should return null if pkce data is not in local storage', () => {
      expect(Auth.loadPkce()).toBe(null);
    });
  });

  describe('containsPkce()', () => {
    it('should return true if pkce data is in local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Auth.savePkce(pkceData);
      expect(Auth.containsPkce()).toBe(true);
    });

    it('should return false if pkce data is in local storage', () => {
      expect(Auth.containsPkce()).toBe(false);
    });
  });

  describe('saveUrls', () => {
    it('saves urls to localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      Auth.saveUrls(urls);
      expect(localStorage.getItem('dydu-oauth-url')).toBe(JSON.stringify(urls));
    });
  });

  describe('loadUrls', () => {
    it('loads urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      expect(Auth.loadUrls()).toEqual(urls);
    });
  });

  describe('clearUrls', () => {
    it('clears urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      Auth.clearUrls();
      expect(localStorage.getItem('dydu-oauth-url')).toBeNull();
    });
  });

  describe('saveUserInfo', () => {
    it('saves user info to localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      Auth.saveUserInfo(userInfo);
      expect(localStorage.getItem('dydu-user-info')).toBe(JSON.stringify(userInfo));
    });
  });

  describe('loadUserInfo', () => {
    it('loads user info from localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      localStorage.setItem('dydu-user-info', JSON.stringify(userInfo));
      expect(Auth.loadUserInfo()).toEqual(userInfo);
    });
  });

  describe('clearUserInfo', () => {
    it('clears user info from localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      localStorage.setItem('dydu-user-info', JSON.stringify(userInfo));
      Auth.clearUserInfo();
      expect(localStorage.getItem('dydu-user-info')).toBeNull();
    });
  });

  describe('saveToken()', () => {
    it('should save token data to local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveToken(token);
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(token.access_token);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(token.refresh_token);
    });
  });

  describe('clearToken()', () => {
    it('should remove token data from local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveToken(token);
      Auth.clearToken();
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(null);
    });
  });

  describe('loadToken()', () => {
    it('should load token data from local storage', () => {
      const token = { id_token: '1234567890', access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveToken(token);
      expect(Auth.loadToken()).toEqual(token);
    });

    it('should return null if token data is not in local storage', () => {
      expect(Auth.loadToken()).toEqual({});
    });
  });

  describe('clearAll()', () => {
    it('should clear all stored data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.savePkce(pkceData);
      Auth.saveToken(token);
      Auth.clearAll();
      expect(localStorage.getItem('pkce')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(null);
    });
  });
});

