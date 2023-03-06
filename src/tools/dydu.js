import { Cookie, Local } from './storage';
import { RESPONSE_QUERY_FORMAT, SOLUTION_TYPE } from './constants';
import {
  _stringify,
  b64encodeObject,
  getBrowserLocale,
  hasProperty,
  isDefined,
  isEmptyString,
  isOfTypeString,
  isPositiveNumber,
  secondsToMs,
  strContains,
  toFormUrlEncoded,
} from './helpers';

import Bowser from 'bowser';
import Storage from '../components/auth/Storage';
import axios from 'axios';
import { axiosConfigNoCache } from './axios';
import bot from '../../public/override/bot.json';
import debounce from 'debounce-promise';
import { decode } from './cipher';
import { getOidcEnableWithAuthStatus } from './oidc';
import { hasWizard } from './wizard';
import i18n from 'i18next';
import { initI18N } from './internationalization';
import qs from 'qs';

const channelsBot = JSON.parse(localStorage.getItem('dydu.bot'));

const { browser, os } = Bowser.getParser(window.navigator.userAgent).parsedResult;

const getUrl = window.location.href;

/**
 * - Wait for the bot ID and the API server then create default API based on the server ;
 * - Use BOT from local storage for the chatbox preview in Channels ;
 * - Protocol http is used when bliss is used in local with Channels.
 */

let BOT = {},
  protocol,
  API = {};

(async function getBotInfo() {
  const { data } = await axios.get(`${process.env.PUBLIC_URL}override/bot.json`, axiosConfigNoCache);

  const getBackUpServerUrl = (botConf = {}) => {
    const rootUrl = {
      app1: 'app1',
      app2: 'app2',
    };

    const getDefaultBackupServerUrl = () => botConf?.backUpServer;

    const getApp1BackUpServerUrl = () => botConf?.server.replace(rootUrl.app1, rootUrl.app2);
    const getApp2BackUpServerUrl = () => botConf?.server.replace(rootUrl.app2, rootUrl.app1);

    const isApp1 = botConf?.server?.startsWith(rootUrl.app1);
    const isApp2 = botConf?.server?.startsWith(rootUrl.app2);

    if (isApp1) {
      return getApp1BackUpServerUrl();
    }

    if (isApp2) {
      return getApp2BackUpServerUrl();
    }

    return getDefaultBackupServerUrl();
  };

  const botData = {
    ...data,
    backUpServer: getBackUpServerUrl(data),
  };

  const overridedBot = channelsBot?.id && channelsBot?.server ? channelsBot : botData;

  // create a copy of response data (source 1) and get the query params url (source 2) if "bot", "id" and "server" exists,
  // and merge the both sources together into a BOT object (source 2 has priority over source 1)
  BOT = Object.assign(
    {},
    overridedBot,
    (({ backUpServer, bot: id, server, configId }) => ({
      ...(id && { id }),
      ...(configId && { configId }),
      ...(server && { server }),
      ...(backUpServer && { backUpServer }),
    }))(qs.parse(window.location.search, { ignoreQueryPrefix: true })),
  );

  Local.set(Local.names.botId, BOT.id);

  protocol = 'https';

  API = getAxiosInstanceWithDyduConfig({
    server: `${protocol}://${BOT.server}/servlet/api/`,
    backupServer: `${protocol}://${getBackUpServerUrl(data)}/servlet/api/`,
    timeout: 3000,
    axiosConf: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    },
  });
})();

const variables = {};

/**
 * Implement JavaScript bindings for Dydu's REST API.
 * https://uat.mars.doyoudreamup.com/servlet/api/doc3/index.html
 */
export default new (class Dydu {
  constructor() {
    this.configuration = {};
    this.onServerChangeFn = null;
    this.serverStatusChek = null;
    this.tokenRefresher = null;
    this.oidcLogin = null;
    this.locale = null;
    this.showSurveyCallback = null;
    this.space = null;
    this.emit = debounce(this.emit, 100, { leading: true });
    this.mainServerStatus = 'Ok';
    this.triesCounter = 0;
    this.maxTries = 3;
    this.minTimeoutForAnswer = secondsToMs(3);
    this.maxTimeoutForAnswer = secondsToMs(30);
    this.lastResponse = null;
    this.qualificationMode = false;
    this.initInfos();
  }

  setServerStatusCheck(serverStatusChek) {
    this.serverStatusChek = serverStatusChek;
  }

  setTokenRefresher(refreshToken) {
    this.tokenRefresher = refreshToken;
  }

  setMainServerStatus(value) {
    this.mainServerStatus = value;
  }

  setOidcLogin(loginOidc) {
    this.oidcLogin = loginOidc;
  }

  getVariables() {
    return JSON.stringify(variables);
  }

  alreadyCame() {
    const clientIdKey = Local.clientId.getKey(this.infos);
    return Local.clientId.isSet(clientIdKey);
  }

  initInfos() {
    this.infos = {
      locale: this.locale,
      space: this.space,
      botId: channelsBot || bot?.id,
    };
  }

  handleTokenRefresh = () => {
    if (this.getConfiguration()?.oidc?.enable) {
      if (Storage.loadToken()?.refresh_token) {
        this.tokenRefresher();
      } else {
        Storage.clearToken();
        this.oidcLogin();
      }
    }
  };

  renewAuth = (auth) => {
    if (auth) {
      try {
        Local.saml.save(atob(auth));
      } catch {
        Local.saml.save(auth);
      }
    }
  };

  redirectAndRenewAuth = (values) => {
    const relayState = encodeURI(window.location.href);
    // const relayState = JSON.stringify({ redirection: encodeURI(window.location.href), bot: BOT.id });
    try {
      this.renewAuth(atob(values?.auth));
      window.location.href = `${atob(values?.redirection_url)}&RelayState=${relayState}`;
    } catch {
      this.renewAuth(values?.auth);
      window.location.href = `${values?.redirection_url}&RelayState=${relayState}`;
    }
  };

  samlRenewOrReject = ({ type, values }) => {
    switch (type) {
      case 'SAML_redirection':
        this.redirectAndRenewAuth(values);
        break;
      default:
        return this.renewAuth(values?.auth);
    }
  };

  handleAxiosResponse = (data = {}) => {
    data && this.getConfiguration()?.saml?.enable && this.samlRenewOrReject(data);

    if (!hasProperty(data, 'values')) return data;
    data.values = decode(data.values);
    this.setContextId(data.values.contextId);
    return data.values;
  };

  handleSetApiUrl = () => {
    let apiUrl = BOT.server;
    if (this.mainServerStatus === 'Error') {
      if (BOT.backUpServer && BOT.backUpServer !== '') {
        apiUrl = BOT.backUpServer;
      }
      API.defaults.baseURL = `https://${apiUrl}/servlet/api/`;
    }
  };

  handleSetApiTimeout = (ms) => {
    let timeout = this.minTimeoutForAnswer;
    if (ms) {
      timeout = ms;
    }
    if (API?.defaults) {
      API.defaults.timeout = timeout;
    }
  };

  handleAxiosError = (error, verb, path, data, timeout) => {
    this.triesCounter = this.triesCounter + 1;

    if (this.triesCounter >= this.maxTries) {
      throw 'API Unreachable';
    }

    /**
     * NO 401 ERROR
     */
    if (error?.response?.status !== 401) {
      if (API.defaults.baseURL === `https://${BOT.server}/servlet/api/`) {
        this.mainServerStatus = 'Error';
      }
    }

    /**
     * IF 401
     */
    if (error?.response?.status === 401) {
      this.handleTokenRefresh();
    }

    // Retry API Call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.emit(verb, path, data, timeout));
      }, this.minTimeoutForAnswer);
    });
  };

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

  emit = (verb, path, data, timeout) => {
    this.handleSetApiUrl();
    this.handleSetApiTimeout(timeout);
    try {
      return verb(path, data)
        .then(this.setLastResponse)
        .then(({ data = {} }) => this.handleAxiosResponse(data))
        .catch((error) => this.handleAxiosError(error, verb, path, data, timeout));
    } catch (e) {
      console.error('while executing |emit()|', e);
    }
  };

  setLastResponse = (res) => {
    this.lastResponse = res;
    return res;
  };

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
      qualificationMode: this.qualificationMode,
      space: this.getSpace(),
      userInput: `#dydumailto:${contextId}:${text}#`,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      feedBack: { false: 'negative', true: 'positive' }[value] || 'withoutAnswer',
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    };
    const path = `chat/gdpr/${BOT.id}/`;
    return Promise.all(methods.map((it) => this.emit(API.post, path, qs.stringify({ ...data, object: it }))));
  };

  hasUserAcceptedGdpr() {
    const gdprSources = [Local.byBotId(this.getBotId()).get(Local.names.gdpr), Local.get(Local.names.gdpr)];
    return gdprSources.some(isDefined);
  }

  getBot = () => BOT;

  /**
   * Read the client ID from cookie and return it.
   *
   * @returns {string | boolean} The client ID.
   */
  getClientId = () => {
    const clientIdKey = Local.clientId.getKey(this.infos);
    if (!this.alreadyCame()) Local.clientId.createAndSave(clientIdKey);
    return Local.clientId.load(clientIdKey);
  };

  getContextIdStorageKey() {
    try {
      return Local.contextId.createKey(this.getBotId(), BOT.configId);
    } catch (e) {
      console.error(e);
      return Local.contextId.createKey(this.getBotId(), this.getConfiguration()?.application?.directory);
    }
  }

  getContextIdFromLocalStorage() {
    const lcContextIdKey = this.getContextIdStorageKey();
    return Local.contextId.load(lcContextIdKey);
  }

  /**
   * Read the context ID from the local storage and return it,
   * if the context ID not exist in local storage we fecth it from the API
   *
   * @returns {string} The context ID.
   */
  getContextId = async (forced) => {
    if (!forced) {
      const contextId = this.getContextIdFromLocalStorage();
      if (isDefined(contextId)) return contextId;
    }

    const data = qs.stringify({
      alreadyCame: this.alreadyCame(),
      clientId: this.getClientId(),
      language: this.getLocale(),
      space: this.getLocale(),
      solutionUsed: SOLUTION_TYPE.assistant,
      qualificationMode: this.qualificationMode,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/context/${BOT.id}/`;
    try {
      const response = await this.emit(API.post, path, data);
      this.setContextId(response?.contextId);
      return response?.contextId;
    } catch (e) {
      console.error('While executing getContextId() ', e);
      return '';
    }
  };

  saveContextIdToLocalStorage(value) {
    try {
      const lcContextIdKey = this.getContextIdStorageKey();
      Local.contextId.save(lcContextIdKey, value);
    } catch (e) {
      return console.error('While executing setContextId : ', e);
    }
  }

  /**
   * Save the provided context ID in the local storage.
   *
   * @param {string} value - Context ID to save.
   */
  setContextId = (value) => {
    if (isDefined(value)) this.saveContextIdToLocalStorage(value);
  };

  getConfiguration() {
    return this.configuration;
  }

  /**
   * Self-regeneratively return the currently selected locale.
   *
   * @returns {string}
   */
  getLocale = () => {
    const { application } = this.getConfiguration();
    if (!this.locale) {
      const locale = Local.get(Local.names.locale, `${application?.defaultLanguage[0]}`).split('-')[0];
      application?.getDefaultLanguageFromSite ? this.setLocale(document.documentElement.lang) : this.setLocale(locale);
    }
    return this.locale || application?.defaultLanguage;
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
  getSpace = (strategy = []) => {
    const atLeastOneStrategyActive = strategy?.some(({ active }) => active);
    if (!this.space || atLeastOneStrategyActive) {
      this.space = Local.get(Local.names.space, this.getConfiguration()?.spaces?.items[0] || 'default', true);
      if (Array.isArray(strategy)) {
        const get = (mode) =>
          ({
            cookie: (value) => Cookie.get(value),
            global: (value) => window[value],
            hostname: (value) => value[window.location.hostname],
            localstorage: (value) => Local.get(value),
            route: (value) => value[window.location.pathname],
            urlparameter: (value) => qs.parse(window.location.search, { ignoreQueryPrefix: true })[value],
            urlpart: (value) => {
              const currentHref = window.location.href;
              if (isOfTypeString(value)) return strContains(currentHref, value);
              const isPartOfCurrentHref = (v) => strContains(currentHref, v);
              const result = Object.keys(value).find(isPartOfCurrentHref);
              return value[result];
            },
          }[mode]);
        strategy.reverse().map(({ active, mode, value }) => {
          if (active) {
            const _get = get(mode);
            this.space = isDefined(_get) ? _get(value) : this.space;
          }
        });
      }
    }
    if (!isDefined(this.space)) this.space = this.getConfiguration().spaces.items[0];
    Local.set(Local.names.space, this.space);
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
      const data = qs.stringify({
        contextUuid: contextId,
        solutionUsed: SOLUTION_TYPE.assistant,
        ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
      });
      const path = `chat/history/${BOT.id}/`;
      return await this.emit(API.post, path, data);
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

      const ifrm = document.querySelector('.dydu-iframe') || document.createElement('iframe');
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
   * Save the currently selected locale in the local storage.
   *
   * @param {string} locale - Selected locale.
   * @returns {Promise}
   */
  setLocale = (locale, languages = []) =>
    new Promise((resolve, reject) => {
      if (!this.locale || languages?.includes(locale)) {
        Local.set(Local.names.locale, locale);
        this.locale = locale;
        return resolve(locale);
      } else {
        reject(`Setting an unknown locale '${locale}'. Possible values: [${languages}].`);
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
   * get all contextVariables and format them in an html list:
   */
  getContextVariables = () => {
    let list = '<ul>';
    for (const [key, value] of Object.entries(variables)) {
      list += '<li>' + key + '&nbsp;=&nbsp;' + value + '</li>';
    }
    list += '</ul>';
    return list;
  };

  setInitialSpace(initialSpace = 'default') {
    this.space = initialSpace;
  }

  /**
   * Set the current space and save it in the local storage.
   *
   * @param {string} space - Selected space.
   * @returns {Promise}
   */
  setSpace = (space) => {
    const value = space?.toLocaleLowerCase() === 'default' ? String(space).trim().toLowerCase() : String(space);
    Local.set(Local.names.space, value);
    this.space = value;
  };

  setQualificationMode = (value) => {
    let isActive = value;
    if (window.DYDU_QUALIFICATION_MODE && !hasWizard()) {
      isActive = window.DYDU_QUALIFICATION_MODE;
    }
    this.qualificationMode = isActive ?? false;
  };

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
      onlyShowRewordables: true, // to display only the activates rewords / suggestions
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
    const payload = this.#makeTalkPayloadWithTextAndOption(text, options);
    const data = qs.stringify({
      ...payload,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const contextId = await this.getContextId(false, { qualification: this.qualificationMode });
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data, this.maxTimeoutForAnswer).then(this.processTalkResponse);
  };

  processTalkResponse = (talkResponse) => {
    this.handleSpaceWithResponseWithTalkResponse(talkResponse);
    this.handleKnownledgeQuerySurveyWithTalkResponse(talkResponse);
    return talkResponse;
  };

  handleSpaceWithResponseWithTalkResponse(response) {
    const guiCSName = response?.guiCSName?.fromBase64();
    if (guiCSName) this.setSpace(guiCSName);
    return response;
  }

  /**
   * getServerStatus
   *
   * @returns {Promise}
   */
  getServerStatus = () => {
    const path = `/serverstatus`;
    return this.emit(API.get, path, null, 5000);
  };

  /**
   * getSaml2Status - Get auth status.
   *
   * @param {string} text - Input to send.
   * @param {Object} [options] - Extra parameters.
   * @returns {Promise}
   */
  getSaml2Status = (saml2Info_token) => {
    const data = qs.stringify({
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: saml2Info_token }),
      botUUID: BOT.id,
    });
    const path = `saml2/status?${data}`;
    return this.emit(API.get, path);
  };

  #makeTLivechatTypingPayloadWithInput = async (input = '') => {
    if (!isDefined(input)) return;
    return {
      type: 'typing',
      parameters: {
        alreadyCame: this.alreadyCame(),
        typing: isDefined(input) && !isEmptyString(input),
        content: input?.toBase64(),
        contextId: await this.getContextId(),
        botId: this.getBot()?.id?.toBase64(),
        qualificationMode: this.qualificationMode,
        language: this.getLocale().toBase64(),
        space: this.getSpace().toBase64(),
        solutionUsed: SOLUTION_TYPE.assistant,
        clientId: this.getClientId(),
        useServerCookieForContext: false,
        saml2_info: '',
        timestamp: new Date().getMilliseconds(),
      },
    };
  };

  #toQueryString = (obj) => {
    return encodeURIComponent(JSON.stringify(obj));
  };

  typing = async (text) => {
    const typingPayload = await this.#makeTLivechatTypingPayloadWithInput(text);
    const qs = this.#toQueryString(typingPayload);
    const path = `${protocol}://${BOT.server}/servlet/chatHttp?data=${qs}`;
    return fetch(path).then((r) => r.json());
  };

  poll = async ({ serverTime, pollTime, contextId, context }) => {
    const data = {
      solutionUsed: SOLUTION_TYPE.livechat,
      format: RESPONSE_QUERY_FORMAT.json,
      space: this.getSpace(),
      contextUuid: contextId || context?.fromBase64() || (await this.getContextId()),
      language: this.getLocale(),
      lastPoll: serverTime || pollTime,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    };

    const path = `/chat/poll/last/${this.getBot()?.id}`;
    return this.emit(API.post, path, toFormUrlEncoded(data));
  };

  getBotId = () => BOT.id;

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
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      solutionUsed: SOLUTION_TYPE.assistant,
      value,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/variable/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  /**
   * Register user visit.
   *
   * @returns {Promise}
   */
  welcomeCall = async () => {
    const contextId = await this.getContextId();
    const data = qs.stringify({
      contextUuid: contextId,
      language: this.getLocale(),
      qualificationMode: this.qualificationMode,
      solutionUsed: SOLUTION_TYPE.assistant,
      space: this.getSpace() || 'default',
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
      variables: this.getVariables(),
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

  #makeTalkPayloadWithTextAndOption = (text, options) => {
    return {
      alreadyCame: this.alreadyCame(),
      browser: `${browser.name} ${browser.version}`,
      clientId: this.getClientId(),
      doNotRegisterInteraction: options.doNotSave,
      language: this.getLocale(),
      os: `${os.name} ${os.version}`,
      qualificationMode: this.qualificationMode,
      space: this.getSpace(),
      userInput: text,
      userUrl: getUrl,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(options.extra && {
        extraParameters: JSON.stringify(options.extra),
      }),
      variables: this.getVariables(),
    };
  };

  setCallbackOnServerChange(cb = null) {
    this.onServerChangeFn = cb;
  }

  post = (...postArgs) => this.emit(...[API.post].concat(postArgs));
  get = (...getArgs) => this.emit(...[API.get].concat(getArgs));

  formatFieldsForSurveyAnswerRequest = (survey = {}) => {
    const reducerPrependFieldTag = (objResult, fieldId) => {
      return {
        ...objResult,
        [`field_${fieldId}`]: survey.fields[fieldId],
      };
    };

    return Object.keys(survey.fields).reduce(reducerPrependFieldTag, {});
  };

  getTalkBasePayload = async (options) => ({
    contextId: await this.getContextId(),
    alreadyCame: this.alreadyCame(),
    browser: `${browser.name} ${browser.version}`,
    clientId: this.getClientId(),
    doNotRegisterInteraction: options.doNotSave,
    language: this.getLocale(),
    os: `${os.name} ${os.version}`,
    qualificationMode: this.qualificationMode,
    space: this.getSpace(),
    tokenUserData: Cookie.get('dydu-oauth-token') ? Cookie.get('dydu-oauth-token').id_token : null,
    userUrl: getUrl,
    solutionUsed: options?.solutionUsed || SOLUTION_TYPE.assistant,
    ...(options.extra && {
      extraParameters: JSON.stringify(options.extra),
    }),
    variables: this.getVariables(),
  });

  sendSurveyPolling = async (survey, options = {}) => {
    const basePayload = await this.getTalkBasePayload(options);
    let payload = {
      type: 'survey',
      parameters: b64encodeObject({
        botId: BOT.id,
        surveyId: survey.surveyId,
        interactionSurveyAnswer: survey.interactionSurvey,
        fields: survey.fields,
        ...basePayload,
      }),
    };
    try {
      const response = await fetch(`https://${BOT.server}/servlet/chatHttp?data=${_stringify(payload)}`);
      const jsonResponse = await response.json();
      this.setLastResponse(jsonResponse);
      return this.displaySurveySent();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async createSurveyPayload(surveyId, fieldObject) {
    return {
      ctx: await this.getContextId(),
      uuid: surveyId,
      ...fieldObject,
    };
  }

  displaySurveySent = (res, status = null) => {
    return new Promise((resolve) => {
      status = status || this.getLastResponse().status;
      const statusOk = status >= 200 && status <= 206;
      if (statusOk) window.dydu.chat.reply(i18n.t('survey.sentMessage'));
      else window.dydu.chat.reply(i18n.t('survey.errorMessage'));
      resolve(res);
    });
  };

  getLastResponse = () => {
    return this.lastResponse || {};
  };
  /*
   * Survey sent by a Knowledge
   */
  sendSurvey = async (surveyAnswer) => {
    const fields = this.formatFieldsForSurveyAnswerRequest(surveyAnswer);
    const payload = await this.createSurveyPayload(surveyAnswer.surveyId, fields);
    const formData = toFormUrlEncoded(payload);

    if (!isDefined(formData)) return;
    const path = `/chat/survey/${BOT.id}`;
    return this.post(path, formData).then(this.displaySurveySent);
  };

  getSurvey = async (surveyId = '') => {
    if (!isDefined(surveyId) || isEmptyString(surveyId)) return null;
    const path = `/chat/survey/configuration/${this.getBotId()}`;
    const data = toFormUrlEncoded({
      contextUuid: await this.getContextId(),
      solutionUsed: SOLUTION_TYPE.assistant,
      language: this.getLocale(),
      surveyId,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    // get survey is a POST
    return this.post(path, data);
  };

  getInfos = async () => {
    return {
      botId: await this.getBotId(),
      locale: this.getLocale(),
      space: this.getSpace(),
    };
  };

  registerVisit() {
    this.welcomeCall().then(async () => {
      const keyInfos = await this.getInfos();
      Local.visit.save(keyInfos);
    });
  }

  setConfiguration(configuration = {}) {
    this.configuration = configuration;
    this.onConfigurationLoaded();
  }

  onConfigurationLoaded() {
    this.setInitialSpace(this.getSpace(this.getConfiguration().spaces.detection));
    this.setQualificationMode(this.getConfiguration().qualification?.active);
    this.initLocaleWithConfiguration(this.getConfiguration());
  }

  initLocaleWithConfiguration(configuration) {
    let locale = getBrowserLocale();
    try {
      const shouldGetFromBrowser = configuration.application.getDefaultLanguageFromSite;
      locale = shouldGetFromBrowser ? getBrowserLocale() : this.getConfigurationDefaultLocal();
      this.setLocale(locale, configuration.application.languages).catch(console.error);
      this.locale = locale;
      initI18N({ defaultLang: this.locale });
      return this.locale;
    } catch (e) {
      console.info('Error while initializing locale, fallback to browser locale');
      this.setLocale(locale, configuration.application.languages).catch(console.error);
      this.locale = locale;
      initI18N({ defaultLang: this.locale });
      return this.locale;
    }
  }

  getConfigurationDefaultLocal() {
    try {
      return `${this.getConfiguration().application.defaultLanguage[0]}`.split('-')[0];
    } catch (e) {
      console.info('No default language from configuration file, fallback to browser locale');
      return getBrowserLocale();
    }
  }

  setSpaceToDefault() {
    const defaultSpaceName = 'default';
    this.setInitialSpace(defaultSpaceName);
  }

  getWelcomeKnowledge = (tagWelcome) => {
    const wkFoundInStorage = Local.welcomeKnowledge.isSet(this.getBotId());
    if (wkFoundInStorage) return Promise.resolve(Local.welcomeKnowledge.load(this.getBotId()));
    const talkOption = { doNotSave: true, hide: true };
    return this.talk(tagWelcome, talkOption).then((talkResponse) => {
      const isInteractionResponse = isDefined(talkResponse?.text) && 'text' in talkResponse;
      if (!isInteractionResponse) return null;
      delete talkResponse.contextId;
      Local.welcomeKnowledge.save(this.getBotId(), talkResponse);
      return talkResponse;
    });
  };

  setShowSurveyCallback(showSurvey) {
    this.showSurveyCallback = showSurvey;
  }

  handleKnownledgeQuerySurveyWithTalkResponse(response) {
    try {
      const { human, knowledgeId, survey } = response;
      const isNotLivechat = human === false && isDefined(knowledgeId);
      const isQuerySurvey = isDefined(survey) && !isEmptyString(survey);
      const shouldShowSurvey = isNotLivechat && isQuerySurvey;
      if (shouldShowSurvey) this.showSurveyCallback(response);
    } catch (e) {
      console.log('catched Error', e);
    }
  }
})();

/====================================================================================================/;

const getAxiosInstanceWithDyduConfig = (config = {}) => {
  if (!isDefined(config?.axiosConf)) config.axiosConf = {};

  const instance = axios.create({
    baseURL: config?.server,
    timeout: isPositiveNumber(config?.timeout) ? config.timeout : axios.defaults.timeout,
    ...config.axiosConf,
  });

  // when request is sent
  instance.interceptors.request.use(
    (config) => {
      if (getOidcEnableWithAuthStatus()) {
        config.headers['Authorization'] = `Bearer ${Storage.loadToken()?.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // when response code in range of 2xx
  const onSuccess = (response) => {
    API.defaults.baseURL = `https://${BOT.server}/servlet/api/`;
    return response;
  };

  instance.interceptors.response.use(onSuccess);

  return instance;
};
