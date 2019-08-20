import axios from 'axios';
import debounce from 'debounce-promise';
import qs from 'qs';
import { decode, encode } from './cipher';
import Cookie from './cookie';
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

  constructor(language='en') {
    this.language = Cookie.get(Cookie.cookies.language) || language;
  }

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
   * @param {object} data - Data to send.
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
   */
  setContextId = value => {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.context, encode(value), Cookie.duration.short);
    }
  };

  /**
   * Save the currently selected language when the cookie is not set. If forced,
   * refresh the cookie anyway.
   *
   * @param {string} language - Selected language.
   * @param {boolean} [force=false] - Whether to ignore current cookie value.
   */
  setLanguage = (language, force=false) => {
    const languages = ['en', 'fr'];
    const current = Cookie.get(Cookie.cookies.language);
    if (force || !current || current !== language) {
      if (languages.includes(language)) {
        this.language = language;
        Cookie.set(Cookie.cookies.language, language, Cookie.duration.long);
      }
      else {
        // eslint-disable-next-line no-console
        console.warn(`Setting an unknown language '${language}'. Possible values: [${languages}].`);
      }
    }
  };

  /**
   * Fetch candidates for auto-completion.
   *
   * @param {string} text - Input to search against.
   * @returns {Promise}
   */
  suggest = text => {
    const data = qs.stringify({language: this.language, search: text});
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
      language: this.language,
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
    const data = qs.stringify({language: this.language, maxKnowledge: size});
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
