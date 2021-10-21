import axios from 'axios';
import Bowser from 'bowser';
import debounce from 'debounce-promise';
import qs from 'qs';
import uuid4 from 'uuid4';
import configuration from '../../public/override/configuration.json';
import { decode } from './cipher';
import { Cookie, Local } from './storage';
const channelsBot = JSON.parse(localStorage.getItem('dydu.bot'));

const { browser, os } = Bowser.getParser(
  window.navigator.userAgent,
).parsedResult;

const getUrl = window.location.href;

/**
 * - Wait for the bot ID and the API server then create default API based on the server.
 * - Use BOT from local storage for the chatbox preview in Channels
 * - Protocol http is used when bliss is used in local with Channels
 */

let BOT, protocol, API;

(async function getBotInfo() {
  const response = await axios.get(
    `${process.env.PUBLIC_URL}override/bot.json`,
  );
  BOT = Object.assign(
    {},
    channelsBot ? channelsBot : response.data,
    (({ backUpServer, bot: id, server }) => ({
      ...(id && { id }),
      ...(server && { server }),
      ...(backUpServer && { backUpServer }),
    }))(qs.parse(window.location.search, { ignoreQueryPrefix: true })),
  );
  protocol = BOT.server.startsWith('dev.dydu') ? 'http' : 'https';
  API = axios.create({
    baseURL: `${protocol}://${BOT.server}/servlet/api/`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  });
})();

/**
 * Solution type
 */
const ASSISTANT = 'ASSISTANT';

const variables = {};

/**
 * Implement JavaScript bindings for Dydu's REST API.
 * https://uat.mars.doyoudreamup.com/servlet/api/doc3/index.html
 */
export default new (class Dydu {
  constructor() {
    this.client = this.getClientId();
    this.emit = debounce(this.emit, 100, { leading: true });
    this.locale = this.getLocale();
    this.space = this.getSpace();
  }

  /**
   * Request against the provided path with the specified data. When
   * the response contains values, decode it and refresh the context ID.
   * if the request fail several times the request will be failover to back-up server.
   *
   * @param {function} verb - A verb method to request with.
   * @param {string} path - Path to send the request to.
   * @param {Object} data - Data to send.
   * @param {number} tries - number of tries to send the request.
   * @returns {Promise}
   */
  emit = (verb, path, data, tries = 0) =>
    verb(path, data)
      .then(({ data = {} }) => {
        if (Object.prototype.hasOwnProperty.call(data, 'values')) {
          data.values = decode(data.values);
          this.setContextId(data.values.contextId);
          return data.values;
        }
        return data;
      })
      .catch(() => {
        if (BOT.backUpServer) {
          tries++;
          if (tries < 3) this.emit(verb, path, data, tries);
          else if (tries < 6) {
            API.defaults.baseURL = `https://${BOT.backUpServer}/servlet/api/`;
            this.emit(verb, path, data, tries);
          }
        }
      });

  /**
   * Export conversation by email
   *
   * @param {string} text - Input to send.
   * @param {Object} [options] - Extra parameters.
   * @returns {Promise}
   */
  exportConversation = async (text, options = {}) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      clientId: this.getClientId(),
      doNotRegisterInteraction: options.doNotSave,
      language: this.getLocale(),
      qualificationMode: options.qualification,
      space: this.getSpace(),
      userInput: `#dydumailto:${contextId}:${text}#`,
      ...(options.extra && { extraParameters: options.extra }),
    });
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data);
  };

  /**
   * Send the user feedback.
   *
   * @param {true|false|undefined} value - Value of the feedback.
   * @returns {Promise}
   */
  feedback = async (value) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      contextUUID: contextId,
      feedBack:
        { false: 'negative', true: 'positive' }[value] || 'withoutAnswer',
      solutionUsed: ASSISTANT,
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
  feedbackComment = async (comment) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      comment,
      contextUUID: contextId,
      solutionUsed: ASSISTANT,
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
  feedbackInsatisfaction = async (choiceKey) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      choiceKey,
      contextUUID: contextId,
      solutionUsed: ASSISTANT,
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
    return Promise.all(
      methods.map((it) =>
        this.emit(API.post, path, qs.stringify({ ...data, object: it })),
      ),
    );
  };

  /**
   * Read the client ID from the local storage and return it. Forge a new one
   * using uuid4 if necessary.
   *
   * @returns {string} The client ID.
   */
  getClientId = () => Local.get(Local.names.client, uuid4, true);

  /**
   * Read the context ID from the local storage and return it,
   * if the context ID not exist in local storage we fecth it from the API
   *
   * @returns {string} The context ID.
   */
  getContextId = async (forced) => {
    const data = qs.stringify({
      clientId: this.getClientId() ? this.getClientId() : null,
      language: this.getLocale(),
      space: this.getLocale(),
    });
    const path = `chat/context/${BOT.id}/`;
    if (Local.byBotId(BOT.id).get(Local.names.context) && !forced) {
      return Local.byBotId(BOT.id).get(Local.names.context);
    }
    if (Local.get(Local.names.context) && !forced) {
      return Local.get(Local.names.context);
    }
    const response = await this.emit(API.post, path, data);
    this.setContextId(response.contextId);
    return response.contextId;
  };

  /**
   * Self-regeneratively return the currently selected locale.
   *
   * @returns {string}
   */
  getLocale = () => {
    if (!this.locale) {
      const { defaultLanguage, getDefaultLanguageFromSite } =
        configuration.application;
      const locale = Local.get(Local.names.locale, `${defaultLanguage}`).split(
        '-',
      )[0];
      getDefaultLanguageFromSite
        ? this.setLocale(document.documentElement.lang)
        : this.setLocale(locale);
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
  getSpace = (strategy) => {
    if (!this.space || strategy) {
      this.space = Local.get(Local.names.space, '');
      if (Array.isArray(strategy)) {
        const get = (mode) =>
          ({
            cookie: (value) => Cookie.get(value),
            global: (value) => window[value],
            hostname: (value) => value[window.location.hostname],
            localstorage: (value) => Local.get(value),
            route: (value) => value[window.location.pathname],
            urlparameter: (value) =>
              qs.parse(window.location.search, { ignoreQueryPrefix: true })[
                value
              ],
          }[mode]);
        strategy.reverse().map(({ active, mode, value }) => {
          if (active) {
            const _get = get(mode);
            this.space =
              typeof _get === 'function'
                ? _get(value) || this.space
                : this.space;
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
  history = async () => {
    const contextId = await this.getContextId();
    if (contextId) {
      const data = qs.stringify({ contextUuid: contextId });
      const path = `chat/history/${BOT.id}/`;
      const response = await this.emit(API.post, path, data);
      return response;
    }
  };

  /**
   * Fetch pushrules.
   *
   * @returns {Promise}
   */
  pushrules = () =>
    new Promise((resolve) => {
      const path = `chat/pushrules/${BOT.id}`;
      resolve(this.emit(API.post, path));
    });

  /**
   * Print conversations.
   *
   *
   */
  printHistory = async () => {
    const contextId = await this.getContextId();
    if (contextId) {
      const path = `https://${BOT.server}/servlet/history?context=${contextId}&format=html&userLabel=Moi&botLabel=Chatbot`;

      const ifrm =
        document.querySelector('.dydu-iframe') ||
        document.createElement('iframe');
      ifrm.setAttribute('class', 'dydu-iframe');
      ifrm.setAttribute('style', 'display:none;');
      ifrm.src = path;

      if (!document.querySelector('.dydu-iframe')) {
        const el = document.querySelector('.dydu-chatbox');
        el.parentNode.insertBefore(ifrm, el);
      }
    }
  };

  /**
   * End the current conversation and reset the context ID.
   *
   * @returns {Promise}
   */
  reset = async () => {
    return await this.getContextId(true);
  };

  /**
   * Save the provided context ID in the local storage.
   *
   * @param {string} value - Context ID to save.
   */
  setContextId = (value) => {
    if (value !== undefined) {
      Local.set(Local.names.context, value);
      Local.byBotId(BOT.id).set(Local.names.context, value);
    }
  };

  /**
   * Save the currently selected locale in the local storage.
   *
   * @param {string} locale - Selected locale.
   * @returns {Promise}
   */
  setLocale = (locale, languages) =>
    new Promise((resolve, reject) => {
      if (!this.locale || languages.includes(locale)) {
        Local.set(Local.names.locale, locale);
        this.locale = locale;
        resolve(locale);
      } else {
        reject(
          `Setting an unknown locale '${locale}'. Possible values: [${languages}].`,
        );
      }
    });

  /**
   * this method allows you to define variables that are modified on the client side
   * @param {*} name
   * @param {*} value
   */
  setRegisterContext = (name, value) => {
    variables[name] = value;
  };

  /**
   * Set the current space and save it in the local storage.
   *
   * @param {string} space - Selected space.
   * @returns {Promise}
   */
  setSpace = (space) =>
    new Promise((resolve, reject) => {
      const value = String(space).trim().toLowerCase();
      Local.set(Local.names.space, value);
      if (this.space !== value) {
        this.space = value;
        resolve(value);
      } else {
        reject(value);
      }
    });

  /**
   * Fetch candidates for auto-completion.
   *
   * @param {string} text - Input to search against.
   * @returns {Promise}
   */
  suggest = (text) => {
    const data = qs.stringify({
      language: this.getLocale(),
      search: text,
      space: this.getSpace(),
    });
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
  talk = async (text, options = {}) => {
    const data = qs.stringify({
      browser: `${browser.name} ${browser.version}`,
      clientId: this.getClientId(),
      doNotRegisterInteraction: options.doNotSave,
      language: this.getLocale(),
      os: `${os.name} ${os.version}`,
      qualificationMode: options.qualification,
      space: this.getSpace(),
      tokenUserData: Cookie.get('dydu-oauth-token')
        ? Cookie.get('dydu-oauth-token').id_token
        : null,
      userInput: text,
      userUrl: getUrl,
      ...(options.extra && { extraParameters: options.extra }),
      variables,
    });
    const contextId = await this.getContextId();
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data);
  };

  /**
   * Fetch the top-asked topics. Limit results to the provided size.
   *
   * @param {number} [size] - Maximum number of topics to retrieve.
   * @returns {Promise}
   */
  top = (period, size) => {
    const data = qs.stringify({
      language: this.getLocale(),
      maxKnowledge: size,
      period: period,
      space: this.getSpace(),
    });
    const path = `chat/topknowledge/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * this method is used to initialize a server-side variable
   * (example: identified user initialized to false then modified in knowledge).
   * This information is sent only once.
   * setDialogVariable works on the same principle as registerContext.
   * @param {string} name - Variable to set.
   * @param {string} value - Value to use.
   * @returns {Promise}
   */
  setDialogVariable = async (name, value) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      contextUuid: contextId,
      name,
      solutionUsed: ASSISTANT,
      value,
    });
    const path = `chat/variable/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Register user visit.
   *
   * @returns {Promise}
   */
  welcomeCall = async (options = {}) => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      contextUuid: contextId,
      language: this.getLocale(),
      qualificationMode: options.qualification,
      solutionUsed: ASSISTANT,
      space: this.getSpace() || 'default',
    });
    const path = `chat/welcomecall/${BOT.id}`;
    return this.emit(API.post, path, data);
  };

  /**
   * Retrieve the bot identity.
   *
   * @returns {Promise}
   */
  whoami = () =>
    this.emit(API.get, 'whoami/').then(({ headers = [] }) => {
      const data = headers.find((it) => it && it.host);
      return data && data.host;
    });
})();
