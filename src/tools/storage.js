import cookie from 'js-cookie';
import moment from 'moment';


/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export class Cookie {

  static names = {
    banner: 'dydu.banner',
    client: 'dydu.client.id',
    context: 'dydu.context.id',
    locale: 'dydu.locale',
    onboarding: 'dydu.onboarding',
    open: 'dydu.open',
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
    banner: 'dydu.banner',
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
   * @returns {*} Value of the variable that was found.
   */
  static get = name => {
    const value = localStorage.getItem(name);
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
    localStorage.setItem(name, value === undefined ? moment().format('X') : value);
  };
}
