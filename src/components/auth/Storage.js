import { cleanUrl, isDefined } from './helpers';

const store = localStorage;

const PKCE_KEY = 'pkce';
const TOKEN_KEY_ID = 'dydu-oauth-token-id';
const AUTH_URL = 'dydu-oauth-url';
const USER_INFO = 'dydu-user-info';
const TOKEN_KEY_ACCESS = 'dydu-oauth-token-access';
const TOKEN_KEY_REFRESH = 'dydu-oauth-token-refresh';

export default class Storage {
  static savePkce(pkceData) {
    store.setItem(PKCE_KEY, JSON.stringify(pkceData));
  }

  static clearPkce() {
    store.removeItem(PKCE_KEY);
  }

  static loadPkce() {
    const pkce = store.getItem(PKCE_KEY);
    return isDefined(pkce) ? JSON.parse(pkce) : null;
  }

  static saveUrls = (urls) => {
    localStorage.setItem(AUTH_URL, JSON.stringify(urls));
  };

  static loadUrls() {
    return JSON.parse(localStorage.getItem(AUTH_URL));
  }

  static clearUrls() {
    store.removeItem(AUTH_URL);
  }

  static saveUserInfo = (info) => {
    localStorage.setItem(USER_INFO, JSON.stringify(info));
  };

  static loadUserInfo() {
    return JSON.parse(localStorage.getItem(USER_INFO));
  }

  static clearUserInfo() {
    store.removeItem(USER_INFO);
  }

  static saveToken = (token) => {
    cleanUrl();
    Storage.clearPkce();
    localStorage.setItem(TOKEN_KEY_ID, token?.id_token);
    localStorage.setItem(TOKEN_KEY_ACCESS, token?.access_token);
    localStorage.setItem(TOKEN_KEY_REFRESH, token?.refresh_token);
  };

  static clearToken() {
    localStorage.removeItem(TOKEN_KEY_ID);
    localStorage.removeItem(TOKEN_KEY_ACCESS);
    localStorage.removeItem(TOKEN_KEY_REFRESH);
  }

  static loadToken() {
    return (
      isDefined(localStorage.getItem(TOKEN_KEY_ID)) && {
        id_token: isDefined(localStorage.getItem(TOKEN_KEY_ID)) && localStorage.getItem(TOKEN_KEY_ID),
        access_token: isDefined(localStorage.getItem(TOKEN_KEY_ACCESS)) && localStorage.getItem(TOKEN_KEY_ACCESS),
        refresh_token: isDefined(localStorage.getItem(TOKEN_KEY_REFRESH)) && localStorage.getItem(TOKEN_KEY_REFRESH),
      }
    );
  }

  static clearAll() {
    Storage.clearPkce();
    Storage.clearToken();
  }

  static containsPkce() {
    return Storage.loadPkce() !== null;
  }
}
