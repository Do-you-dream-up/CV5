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

  describe('saveOidcAuthData()', () => {
    it('should save oidc auth data to local storage', () => {
      const oidcAuthData = { redirectUrl: 'https://localhost:8080', state: '1234567890' };
      Auth.saveOidcAuthData(oidcAuthData);
      const result = Auth.loadOidcAuthData();
      expect(JSON.stringify(result)).toBe(JSON.stringify(oidcAuthData));
    });
  });

  describe('clearOidcAuthData()', () => {
    it('should remove oidc auth data from local storage', () => {
      const oidcAuthData = { redirectUrl: 'https://localhost:8080', state: '1234567890' };
      Auth.saveOidcAuthData(oidcAuthData);
      Auth.clearOidcAuthData();
      expect(Auth.loadOidcAuthData()).toBeNull();
    });
  });

  describe('loadOidcAuthData()', () => {
    it('should load oidc auth data from local storage', () => {
      const oidcAuthData = { redirectUrl: 'https://localhost:8080', state: '1234567890' };
      Auth.saveOidcAuthData(oidcAuthData);
      expect(Auth.loadOidcAuthData()).toEqual(oidcAuthData);
    });

    it('should return null if oidc auth data is not in local storage', () => {
      expect(Auth.loadOidcAuthData()).toBeNull();
    });
  });

  describe('containsOidcAuthData()', () => {
    it('should return true if oidc auth data is in local storage', () => {
      const oidcAuthData = { redirectUrl: 'https://localhost:8080', state: '1234567890' };
      Auth.saveOidcAuthData(oidcAuthData);
      expect(Auth.containsOidcAuthData()).toBe(true);
    });

    it('should return false if auth data is in local storage', () => {
      expect(Auth.containsOidcAuthData()).toBe(false);
    });
  });

  describe('saveUrls', () => {
    it('saves urls to localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      Auth.saveOidcUrls(urls);
      expect(JSON.stringify(Auth.loadOidcUrls())).toBe(JSON.stringify(urls));
    });
  });

  describe('loadUrls', () => {
    it('loads urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      expect(Auth.loadOidcUrls()).toEqual(urls);
    });
  });

  describe('clearUrls', () => {
    it('clears urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      Auth.clearOidcUrls();
      expect(Auth.loadOidcUrls()).toBeNull();
    });
  });

  describe('saveUserInfo', () => {
    it('saves user info to localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      Auth.saveUserInfo(userInfo);
      expect(JSON.stringify(Auth.loadUserInfo())).toBe(JSON.stringify(userInfo));
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
      expect(Auth.loadUserInfo()).toBeNull();
    });
  });

  describe('saveToken()', () => {
    it('should save token data to local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveToken(token);
      const tokens = Auth.loadToken();
      expect(tokens.access_token).toBe(token.access_token);
      expect(tokens.refresh_token).toBe(token.refresh_token);
    });
  });

  describe('clearToken()', () => {
    it('should remove token data from local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveToken(token);
      Auth.clearToken();
      const tokens = Auth.loadToken();
      expect(tokens.access_token).toBeUndefined();
      expect(tokens.refresh_token).toBeUndefined();
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
      const authData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Auth.saveOidcAuthData(authData);
      Auth.saveToken(token);
      Auth.clearAll();
      const tokens = Auth.loadToken();
      expect(Auth.loadOidcAuthData()).toBeNull();
      expect(tokens.access_token).toBeUndefined();
      expect(tokens.refresh_token).toBeUndefined();
    });
  });
});
