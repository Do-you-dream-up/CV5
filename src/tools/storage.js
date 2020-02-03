import cookie from 'js-cookie';


/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export class Cookie {

  static names = {
    banner: 'dydu.banner',
    gdpr: 'dydu.gdpr',
    locale: 'dydu.locale',
  };

  static duration = {
    long: 365,
    short: 1 / 24 / 60 * 10,
  };

  static get = cookie.getJSON;

  /**
   * Upsert a value for the specified cookie.
   *
   * @param {string} name - Name of the cookie.
   * @param {*} [value] - Value to set, default to the current Unix timestamp.
   * @param {Object|number} [options] - Extra options or lifespan duration in days.
   */
  static set = (name, value, options = {}) => {
    value = value === undefined ? Math.floor(Date.now() / 1000) : value;
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    options = {expires: typeof options === 'number' ? options : Cookie.duration.short, ...options};
    cookie.set(name, value, options);
  };
}


/**
 * Small wrapper for localStorage methods.
 */
export class Local {

  static names = {
    client: 'dydu.client',
    context: 'dydu.context',
    dragon: 'dydu.dragon',
    locale: 'dydu.locale',
    onboarding: 'dydu.onboarding',
    open: 'dydu.open',
    secondary: 'dydu.secondary',
    space: 'dydu.space',
  };


  /**
   * Clear a local storage variable or all variables if no name is specified.
   *
   * @param {string} [name] - Name of the local storage variable to delete.
   */
  static clear = name => name ? localStorage.removeItem(name) : localStorage.clear();

  /**
   * Retrieve a value stored in the local storage.
   *
   * If the value is not found in the local storage dictionary and a fallback is
   * provided, set it before returning it.
   *
   * If the provided fallback is a function, call it to obtain the fallback
   * value.
   *
   * @param {string} name - Name of the local storage variable to fetch.
   * @param {*} [fallback] - Value or function to fallback to if the name was
   *                         not found.
   * @param {boolean} save - Whether the fallback value should be saved.
   * @returns {*} Value of the variable that was found.
   */
  static get = (name, fallback, save) => {
    let value = localStorage.getItem(name);
    if (!value && fallback !== undefined) {
      value = typeof fallback === 'function' ? fallback() : fallback;
      if (save) {
        this.set(name, value);
      }
    }
    try {
      return JSON.parse(value);
    }
    catch {
      return value;
    }
  };

  /**
   * Upsert a value in the local storage.
   *
   * @param {string} name - Name of the local storage variable.
   * @param {*} [value] - Value to set, default to the current Unix timestamp.
   * @param {*} [rest] - Extra options to pass to `localStorage.setItem`.
   */
  static set = (name, value, ...rest) => {
    value = value === undefined ? Math.floor(Date.now() / 1000) : value;
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(name, value, ...rest);
  };
}
