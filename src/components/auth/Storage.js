import { cleanUrl, isDefined } from './helpers';
import Cookie from 'js-cookie';

const store = localStorage;

const PKCE_KEY = 'pkce';
const TOKEN_KEY = 'dydu-oauth-token';

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

  static saveToken(token) {
    cleanUrl();
    Storage.clearPkce();
    Cookie.set(TOKEN_KEY, JSON.stringify(token));
  }

  static clearToken() {
    Cookie.remove(TOKEN_KEY);
  }

  static loadToken() {
    const token = Cookie.get(TOKEN_KEY);
    return isDefined(token) ? JSON.parse(token) : null;
  }

  static clearAll() {
    Storage.clearPkce();
    Storage.clearToken();
  }

  static containsPkce() {
    return Storage.loadPkce() !== null;
  }
}
