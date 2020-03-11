import axios from 'axios';
import debounce from 'debounce-promise';
import qs from 'qs';
import uuid4 from 'uuid4';
import bot from '../bot';
import { decode } from './cipher';
import { Cookie, Local } from './storage';


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
export default new class Dydu {

  constructor() {
    this.client = this.getClientId();
    this.emit = debounce(this.emit, 100, {leading: true});
    this.locale = this.getLocale();
    this.space = this.getSpace();
  }

  /**
   * Request against the provided path with the specified data. When
   * the response contains values, decode it and refresh the context ID.
   *
   * @param {function} verb - A verb method to request with.
   * @param {string} path - Path to send the request to.
   * @param {Object} data - Data to send.
   * @returns {Promise}
   */
  emit = (verb, path, data) => verb(path, data).then(({ data = {} }) => {
    if (Object.prototype.hasOwnProperty.call(data, 'values')) {
      data.values = decode(data.values);
      this.setContextId(data.values.contextId);
      return data.values;
    }
    return data;
  });

  /**
   * Send the user feedback.
   *
   * @param {true|false|undefined} value - Value of the feedback.
   * @returns {Promise}
   */
  feedback = value => {
    const data = qs.stringify({
      contextUUID: this.getContextId(),
      feedBack: {false: 'negative', true: 'positive'}[value] || 'withoutAnswer',
      solutionUsed: 'ASSISTANT',
    });
    const path = `chat/feedback/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Send the user feedback comment.
   *
   * @param {string} comment - Comment to send.
   * @returns {Promise}
   */
  feedbackComment = comment => {
    const data = qs.stringify({
      comment,
      contextUUID: this.getContextId(),
      solutionUsed: 'ASSISTANT',
    });
    const path = `chat/feedback/comment/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Send the user feedback insatisfaction.
   *
   * @param {string} choiceKey - Choice key to send.
   * @returns {Promise}
   */
  feedbackInsatisfaction = choiceKey => {
    const data = qs.stringify({
      choiceKey,
      contextUUID: this.getContextId(),
      solutionUsed: 'ASSISTANT',
    });
    const path = `chat/feedback/insatisfaction/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * File a GDPR request to be processed.
   *
   * Accepts an array of methods to call for. When multiple methods are
   * provided, combine requests using `Promise.all`.
   *
   * @param {Object} options - Options.
   * @param {email} options.email - The email address of the user to request for.
   * @param {'Delete'|'Get'|string[]} options.method - Type(s) of the request
   * @returns {Promise}
   */
  gdpr = ({ email, method }) => {
    const methods = Array.isArray(method) ? method : [method];
    const data = {
      clientId: this.getClientId(),
      language: this.getLocale(),
      mail: email,
    };
    const path = `chat/gdpr/${BOT.id}/`;
    return Promise.all(methods.map(it => this.emit(
      API.post,
      path,
      qs.stringify({...data, object: it}),
    )));
  };

  /**
   * Read the client ID from the local storage and return it. Forge a new one
   * using uuid4 if necessary.
   *
   * @returns {string} The client ID.
   */
  getClientId = () => Local.get(Local.names.client, uuid4, true);

  /**
   * Read the context ID from the local storage and return it.
   *
   * @returns {string|undefined} The context ID or undefined.
   */
  getContextId = () => Local.get(Local.names.context);

  /**
   * Self-regeneratively return the currently selected locale.
   *
   * @returns {string}
   */
  getLocale = () => {
    if (!this.locale) {
      const locale = Local.get(Local.names.locale, 'en').split('-')[0];
      this.setLocale(locale);
    }
    return this.locale;
  };

  /**
   * Return the currently selected space.
   *
   * @param {Object[]} strategy - Order in which space should be detected.
   * @param {boolean} strategy.active - Whether the strategy should be applied.
   * @param {string} strategy.mode - The type of strategy.
   * @param {string|Object} strategy.value - Data needed to extract the space value.
   * @returns {string}
   */
  getSpace = strategy => {
    if (!this.space || strategy) {
      this.space = Local.get(Local.names.space, '');
      if (Array.isArray(strategy)) {
        const get = mode => ({
          cookie: value => Cookie.get(value),
          global: value => window[value],
          hostname: value => value[window.location.hostname],
          localstorage: value => Local.get(value),
          route: value => value[window.location.pathname],
          urlparameter: value => qs.parse(window.location.search, {ignoreQueryPrefix: true})[value],
        }[mode]);
        strategy.reverse().map(({ active, mode, value }) => {
          if (active) {
            const _get = get(mode);
            this.space = typeof _get === 'function' ? _get(value) || this.space : this.space;
          }
        });
      }
    }
    return this.space;
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
   * End the current conversation and reset the context ID.
   *
   * @returns {Promise}
   */
  reset = () => {
    const data = qs.stringify({
      clientId: this.getClientId(),
      language: this.getLocale(),
      space: true,
    });
    const path = `chat/context/${BOT.id}/`;
    return this.emit(API.post, path, data).then(({ contextId }) => {
      this.setContextId(contextId);
    });
  };

  /**
   * Save the provided context ID in the local storage.
   *
   * @param {string} value - Context ID to save.
   */
  setContextId = value => {
    if (value !== undefined) {
      Local.set(Local.names.context, value);
    }
  };

  /**
   * Save the currently selected locale in the local storage.
   *
   * @param {string} locale - Selected locale.
   * @returns {Promise}
   */
  setLocale = locale => new Promise((resolve, reject) => {
    const locales = ['en', 'fr'];
    if (locales.includes(locale)) {
      Local.set(Local.names.locale, locale);
      this.locale = locale;
      resolve(locale);
    }
    else {
      reject(`Setting an unknown locale '${locale}'. Possible values: [${locales}].`);
    }
  });

  /**
   * Set the current space and save it in the local storage.
   *
   * @param {string} space - Selected space.
   * @returns {Promise}
   */
  setSpace = space => new Promise((resolve, reject) => {
    const value = String(space).trim().toLowerCase();
    Local.set(Local.names.space, value);
    if (this.space !== value) {
      this.space = value;
      resolve(value);
    }
    else {
      reject(value);
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
  talk = (text, options = {}) => {
    const data = qs.stringify({
      clientId: this.getClientId(),
      language: this.getLocale(),
      qualificationMode: options.qualification,
      space: this.getSpace(),
      userInput: text,
      ...(options.extra && {extraParameters: options.extra}),
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
   * Set a context variable by name.
   *
   * @param {string} name - Variable to set.
   * @param {string} value - Value to use.
   * @returns {Promise}
   */
  variable = (name, value) => {
    const data = qs.stringify({
      contextUuid: this.getContextId(),
      name,
      value,
    });
    const path = `chat/variable/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Retrieve the bot identity.
   *
   * @returns {Promise}
   */
  whoami = () => this.emit(API.get, 'whoami/').then(({ headers = [] }) => {
    const data = headers.find(it => it && it.host);
    return data && data.host;
  });
}();
