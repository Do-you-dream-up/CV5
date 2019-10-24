import cookie from 'js-cookie';
import moment from 'moment';


/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export class Cookie {

  static names = {
    banner: 'dydu.banner',
  };

  static duration = {
    long: {expires: 365},
    short: {expires: 1 / 24 / 60 * 10},
  };

  static get = cookie.getJSON;
  static set = cookie.set;
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
   * @param {string} name - Name of the local storage variable to fetch.
   * @param {function} [getValue] - Function returning the value to set if the
   *                                name was not found.
   * @returns {*} Value of the variable that was found.
   */
  static get = (name, getValue) => {
    const value = localStorage.getItem(name);
    if (!value && typeof getValue === 'function') {
      this.set(name, getValue());
      return this.get(name);
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
   */
  static set = (name, value) => {
    value = value === undefined ? moment().format('X') : value;
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    localStorage.setItem(name, value);
  };
}
