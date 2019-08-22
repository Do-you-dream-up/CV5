import axios from 'axios';
import debounce from 'debounce-promise';
import qs from 'qs';
import { decode, encode } from './cipher';
import { Cookie } from './storage';
import bot from '../bot';


/**
 * Read the bot ID and the API server from URL parameters when found. Default to
 * the bot configuration.
 */
const BOT = Object.assign({}, bot, (({ bot: id, server }) => ({
  ...id && {id},
  ...server && {server},
}))(qs.parse(window.location.search, {ignoreQueryPrefix: true})));


/**
 * Prefix the API and add generic headers.
 */
const API = axios.create({
  baseURL: `https://${BOT.server}/servlet/api/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
});


/**
 * Implement JavaScript bindings for Dydu's REST API.
 * https://uat.mars.doyoudreamup.com/servlet/api/doc3/index.html
 */
class Dydu {

  /**
   * Read the context ID from the cookies and return it.
   *
   * @returns {string|undefined} The context ID or undefined.
   */
  getContextId = () => {
    const contextId = Cookie.get(Cookie.cookies.context);
    return contextId !== undefined ? decode(contextId) : undefined;
  };

  /**
   * Debounce-request against the provided path with the specified data. When
   * the response contains values, decode it and refresh the context ID.
   *
   * @param {function} verb - A verb method to request with.
   * @param {string} path - Path to send the request to.
   * @param {Object} data - Data to send.
   * @returns {Promise}
   */
  emit = debounce((verb, path, data) => verb(path, data).then(({ data={} }) => {
    if (data.hasOwnProperty('values')) {
      data.values = decode(data.values);
      this.setContextId(data.values.contextId);
      return data.values;
    }
    return data;
  }), 100, {leading: true});

  /**
   * Self-regeneratively return the currently selected locale.
   *
   * @returns {string}
   */
  getLocale = () => {
    this.locale = Cookie.get(Cookie.cookies.locale);
    if (typeof this.locale !== 'string' || !this.locale) {
      this.setLocale('en');
    }
    return this.locale;
  };

  /**
   * Fetch previous conversations.
   *
   * @returns {Promise}
   */
  history = () => new Promise((resolve, reject) => {
    const contextId = this.getContextId();
    if (contextId) {
      const data = qs.stringify({contextUuid: contextId});
      const path = `chat/history/${BOT.id}/`;
      resolve(this.emit(API.post, path, data));
    }
    else {
      reject();
    }
  });

  /**
   * Save the provided context ID to the cookies.
   *
   * @param {string} value - Context ID to save.
   */
  setContextId = value => {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.context, encode(value), Cookie.duration.short);
    }
  };

  /**
   * Save the currently selected locale when the cookie is not set. If forced,
   * refresh the cookie anyway.
   *
   * @param {string} locale - Selected locale.
   * @returns {Promise}
   */
  setLocale = locale => new Promise((resolve, reject) => {
    const locales = ['en', 'fr'];
    if (locales.includes(locale)) {
      Cookie.set(Cookie.cookies.locale, locale, Cookie.duration.long);
      this.locale = locale;
      resolve(locale);
    }
    else {
      reject(`Setting an unknown locale '${locale}'. Possible values: [${locales}].`);
    }
  });

  /**
   * Fetch candidates for auto-completion.
   *
   * @param {string} text - Input to search against.
   * @returns {Promise}
   */
  suggest = text => {
    const data = qs.stringify({language: this.getLocale(), search: text});
    const path = `chat/search/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Send the provided input with optional extra parameters.
   *
   * @param {string} text - Input to send.
   * @param {Object} [options] - Extra parameters.
   * @returns {Promise}
   */
  talk = (text, options) => {
    const data = qs.stringify({
      language: this.getLocale(),
      userInput: text,
      ...(options && {extraParameters: options}),
    });
    const contextId = this.getContextId();
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data);
  };

  /**
   * Fetch the top-asked topics. Limit results to the provided size.
   *
   * @param {number} [size] - Maximum number of topics to retrieve.
   * @returns {Promise}
   */
  top = size => {
    const data = qs.stringify({language: this.getLocale(), maxKnowledge: size});
    const path = `chat/topknowledge/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Retrieve the bot identity.
   *
   * @returns {Promise}
   */
  whoami = () => this.emit(API.get, 'whoami/').then(({ headers=[] }) => {
    const data = headers.find(it => it.hasOwnProperty('host'));
    return data && data.host;
  });
}


export default new Dydu();
