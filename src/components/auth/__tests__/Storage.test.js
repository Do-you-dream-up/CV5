import Storage from '../Storage';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('savePkce()', () => {
    it('should save pkce data to local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Storage.savePkce(pkceData);
      expect(localStorage.getItem('pkce')).toBe(JSON.stringify(pkceData));
    });
  });

  describe('clearPkce()', () => {
    it('should remove pkce data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Storage.savePkce(pkceData);
      Storage.clearPkce();
      expect(localStorage.getItem('pkce')).toBe(null);
    });
  });

  describe('loadPkce()', () => {
    it('should load pkce data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Storage.savePkce(pkceData);
      expect(Storage.loadPkce()).toEqual(pkceData);
    });

    it('should return null if pkce data is not in local storage', () => {
      expect(Storage.loadPkce()).toBe(null);
    });
  });

  describe('containsPkce()', () => {
    it('should return true if pkce data is in local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      Storage.savePkce(pkceData);
      expect(Storage.containsPkce()).toBe(true);
    });

    it('should return false if pkce data is in local storage', () => {
      expect(Storage.containsPkce()).toBe(false);
    });
  });

  describe('saveUrls', () => {
    it('saves urls to localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      Storage.saveUrls(urls);
      expect(localStorage.getItem('dydu-oauth-url')).toBe(JSON.stringify(urls));
    });
  });

  describe('loadUrls', () => {
    it('loads urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      expect(Storage.loadUrls()).toEqual(urls);
    });
  });

  describe('clearUrls', () => {
    it('clears urls from localStorage', () => {
      const urls = ['http://example.com', 'http://test.com'];
      localStorage.setItem('dydu-oauth-url', JSON.stringify(urls));
      Storage.clearUrls();
      expect(localStorage.getItem('dydu-oauth-url')).toBeNull();
    });
  });

  describe('saveUserInfo', () => {
    it('saves user info to localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      Storage.saveUserInfo(userInfo);
      expect(localStorage.getItem('dydu-user-info')).toBe(JSON.stringify(userInfo));
    });
  });

  describe('loadUserInfo', () => {
    it('loads user info from localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      localStorage.setItem('dydu-user-info', JSON.stringify(userInfo));
      expect(Storage.loadUserInfo()).toEqual(userInfo);
    });
  });

  describe('clearUserInfo', () => {
    it('clears user info from localStorage', () => {
      const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };
      localStorage.setItem('dydu-user-info', JSON.stringify(userInfo));
      Storage.clearUserInfo();
      expect(localStorage.getItem('dydu-user-info')).toBeNull();
    });
  });

  describe('saveToken()', () => {
    it('should save token data to local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Storage.saveToken(token);
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(token.access_token);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(token.refresh_token);
    });
  });

  describe('clearToken()', () => {
    it('should remove token data from local storage', () => {
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Storage.saveToken(token);
      Storage.clearToken();
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(null);
    });
  });

  describe('loadToken()', () => {
    it('should load token data from local storage', () => {
      const token = { id_token: '1234567890', access_token: '1234567890', refresh_token: '0987654321' };
      Storage.saveToken(token);
      expect(Storage.loadToken()).toEqual(token);
    });

    it('should return null if token data is not in local storage', () => {
      expect(Storage.loadToken()).toBe(false);
    });
  });

  describe('clearAll()', () => {
    it('should clear all stored data from local storage', () => {
      const pkceData = { codeVerifier: '1234567890', codeChallenge: '0987654321' };
      const token = { access_token: '1234567890', refresh_token: '0987654321' };
      Storage.savePkce(pkceData);
      Storage.saveToken(token);
      Storage.clearAll();
      expect(localStorage.getItem('pkce')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-access')).toBe(null);
      expect(localStorage.getItem('dydu-oauth-token-refresh')).toBe(null);
    });
  });
});
