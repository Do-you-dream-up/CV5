import { Cookie, Local } from './storage';
import { RESPONSE_QUERY_FORMAT, RESPONSE_TYPE, SOLUTION_TYPE } from './constants';
import {
  b64encodeObject,
  hasProperty,
  isDefined,
  isEmptyObject,
  isEmptyString,
  isOfTypeFunction,
  isOfTypeString,
  isPositiveNumber,
  qualification,
  strContains,
  toFormUrlEncoded,
} from './helpers';

import Bowser from 'bowser';
import axios from 'axios';
import configuration from '../../public/override/configuration.json';
import bot from '../../public/override/bot.json';
import debounce from 'debounce-promise';
import { decode } from './cipher';
import qs from 'qs';

const channelsBot = JSON.parse(localStorage.getItem('dydu.bot'));

const { browser, os } = Bowser.getParser(window.navigator.userAgent).parsedResult;

const getUrl = window.location.href;

/**
 * - Wait for the bot ID and the API server then create default API based on the server ;
 * - Use BOT from local storage for the chatbox preview in Channels ;
 * - Protocol http is used when bliss is used in local with Channels.
 */

let BOT, protocol, API;

(async function getBotInfo() {
  const { data } = await axios.get(`${process.env.PUBLIC_URL}override/bot.json`);

  const botData = {
    ...data,
    backUpServer: getBackupServerUrl(data),
  };

  // create a copy of response data (source 1) and get the query params url (source 2) if "bot", "id" and "server" exists,
  // and merge the both sources together into a BOT object (source 2 has priority over source 1)
  BOT = Object.assign(
    {},
    channelsBot ? channelsBot : botData,
    (({ backUpServer, bot: id, server }) => ({
      ...(id && { id }),
      ...(server && { server }),
      ...(backUpServer && { backUpServer }),
    }))(qs.parse(window.location.search, { ignoreQueryPrefix: true })),
  );

  protocol = 'https';

  API = getAxiosInstanceWithDyduConfig({
    maxRetry: 2,
    timeout: 3000,
    server: `${protocol}://${BOT.server}/servlet/api/`,
    backupServer: `${protocol}://${getBackupServerUrl(data)}/servlet/api/`,
    axiosConf: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    },
  });
})();

const getBackupServerUrl = (botConf = {}) => {
  const rootUrl = {
    app1: 'app1',
    app2: 'app2',
  };

  const getDefaultBackupServerUrl = () => botConf?.backupServer;
  const getApp1BackupServerUrl = () => botConf?.server.replace(rootUrl.app1, rootUrl.app2);
  const isApp1 = botConf?.server.startsWith(rootUrl.app1);
  return isApp1 ? getApp1BackupServerUrl() : getDefaultBackupServerUrl();
};

const variables = {};

/**
 * Implement JavaScript bindings for Dydu's REST API.
 * https://uat.mars.doyoudreamup.com/servlet/api/doc3/index.html
 */
export default new (class Dydu {
  constructor() {
    this.onServerChangeFn = null;
    this.locale = this.getLocale();
    this.space = this.getSpace();
    this.emit = debounce(this.emit, 100, { leading: true });
    this.initInfos();
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

  extractPayloadFromHttpResponse = (data = {}) => {
    if (!hasProperty(data, 'values')) return data;

    data.values = decode(data.values);
    this.setContextId(data.values.contextId);
    return data.values;
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

  emit = (verb, path, data) => {
    return verb(path, data).then((httpResponse) => this.extractPayloadFromHttpResponse(httpResponse.data));
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
      qualificationMode: options.qualification,
      space: this.getSpace(),
      userInput: `#dydumailto:${contextId}:${text}#`,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
    };
    const path = `chat/gdpr/${BOT.id}/`;
    return Promise.all(methods.map((it) => this.emit(API.post, path, qs.stringify({ ...data, object: it }))));
  };

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

  /**
   * Read the context ID from the local storage and return it,
   * if the context ID not exist in local storage we fecth it from the API
   *
   * @returns {string} The context ID.
   */
  getContextId = async (forced) => {
    const data = qs.stringify({
      alreadyCame: this.alreadyCame(),
      clientId: this.getClientId(),
      language: this.getLocale(),
      space: this.getLocale(),
      solutionUsed: SOLUTION_TYPE.assistant,
      qualificationMode: qualification,
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/context/${BOT.id}/`;
    if (Local.byBotId(BOT.id).get(Local.names.context) && !forced) {
      return Local.byBotId(BOT.id).get(Local.names.context);
    }
    if (Local.get(Local.names.context) && !forced) {
      return Local.get(Local.names.context);
    }
    const response = await this.emit(API.post, path, data);
    this.setContextId(response?.contextId);
    return response?.contextId;
  };

  /**
   * Self-regeneratively return the currently selected locale.
   *
   * @returns {string}
   */
  getLocale = () => {
    if (!this.locale) {
      const { defaultLanguage, getDefaultLanguageFromSite } = configuration.application;
      const locale = Local.get(Local.names.locale, `${defaultLanguage}`).split('-')[0];
      getDefaultLanguageFromSite ? this.setLocale(document.documentElement.lang) : this.setLocale(locale);
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
            this.space = isOfTypeFunction(_get) ? _get(value) || this.space : this.space;
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
      const data = qs.stringify({
        contextUuid: contextId,
        solutionUsed: SOLUTION_TYPE.assistant,
        ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      onlyShowRewordables: true, // to display only the activates rewords / suggestions
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
    const data = qs.stringify({ ...payload, ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }) });
    const contextId = await this.getContextId(false, { qualification: options.qualification });
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data);
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
      ...(configuration?.saml?.enable && { saml2_info: saml2Info_token }),
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
        qualificationMode: true,
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      solutionUsed: SOLUTION_TYPE.assistant,
      space: this.getSpace() || 'default',
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
      qualificationMode: options.qualification,
      space: this.getSpace(),
      tokenUserData: Cookie.get('dydu-oauth-token') ? Cookie.get('dydu-oauth-token').id_token : null,
      userInput: text,
      userUrl: getUrl,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(options.extra && {
        extraParameters: JSON.stringify(options.extra),
      }),
      variables: JSON.stringify(variables),
    };
  };

  setCallbackOnServerChange(cb = null) {
    this.onServerChangeFn = cb;
  }

  post = (...postArgs) => this.emit(...[API.post].concat(postArgs));
  get = (...getArgs) => this.emit(...[API.get].concat(getArgs));

  createSurveyRequestPayload = async (survey = {}, options = {}) => {
    if (isEmptyObject(survey)) throw new Error('createSurveyRequestPayload: |survey| parameter is an empty object');
    if (isEmptyObject(options)) options = { qualification: qualification };

    return {
      type: RESPONSE_TYPE.survey,
      parameters: {
        botId: this.getBot().id,
        surveyId: survey.surveyId,
        interactionSurveyAnswer: false,
        fields: b64encodeObject(survey),
        contextId: await this.getContextId(),
        qualificationMode: options.qualification || false,
        language: this.getLocale(),
        space: this.getSpace(),
        solutionUsed: SOLUTION_TYPE.assistant,
        clientId: this.getClientId(),
        useServerCookieForContext: false,
        saml2_info: '',
        timestamp: new Date().getMilliseconds(),
      },
    };
  };

  sendSurvey = async (surveyAnswer, options = {}) => {
    const payload = await this.createSurveyRequestPayload(surveyAnswer, options);
    const surveyQueryString = this.#toQueryString(payload);
    const path = `${protocol}://${BOT.server}/servlet/chatHttp?data=${surveyQueryString}`;
    return this.get(path);
  };

  getSurvey = async (surveyId = '') => {
    if (!isDefined(surveyId) || isEmptyString(surveyId)) return null;
    const path = `/chat/survey/configuration/${this.getBotId()}`;
    const data = toFormUrlEncoded({
      contextUuid: await this.getContextId(),
      solutionUsed: SOLUTION_TYPE.assistant,
      language: this.getLocale(),
      surveyId,
      ...(configuration?.saml?.enable && { saml2_info: Local.saml.load() }),
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
    this.welcomeCall({ qualification }).then(async () => {
      const keyInfos = await this.getInfos();
      Local.visit.save(keyInfos);
    });
  }
})();

/====================================================================================================/;

const AXIOS_ERROR_CODE_RETRY = {
  timeout: 'ECONNABORTED',
  serverDown: 'ECONNREFUSED',
  networkError: 'Network Error',
};

const getAxiosInstanceWithDyduConfig = (config = {}) => {
  if (!isDefined(config?.maxRetry)) config.maxRetry = 2;
  if (!isDefined(config?.axiosConf)) config.axiosConf = {};

  const instance = axios.create({
    baseURL: config?.server,
    timeout: isPositiveNumber(config?.timeout) ? config.timeout : axios.defaults.timeout,
    ...config.axiosConf,
  });

  const flipAxiosBaseUrl = () => {
    instance.defaults.baseURL = instance.defaults.baseURL === config?.server ? config?.backupServer : config?.server;
  };

  let currentRetryCount = 0;

  const hasReachedMaxRetry = () => currentRetryCount >= config.maxRetry - 1;

  const resetRetryCounter = () => (currentRetryCount = 0);

  const incrementRetryCounter = () => ++currentRetryCount;

  const matchRetryConditions = (error) => {
    const errors = Object.values(AXIOS_ERROR_CODE_RETRY);
    return errors.includes(error.code) || errors.includes(error.message);
  };

  const retry = () => {
    if (hasReachedMaxRetry()) {
      flipAxiosBaseUrl();
      resetRetryCounter();
    }
    incrementRetryCounter();
    return instance();
  };

  const renewAuth = (auth) => {
    if (auth) {
      try {
        Local.saml.save(atob(auth));
      } catch {
        Local.saml.save(auth);
      }
    }
  };

  const redirectAndRenewAuth = (values) => {
    try {
      renewAuth(atob(values?.auth));
      window.location.href = atob(values?.redirection_url);
    } catch {
      renewAuth(values?.auth);
      window.location.href = values?.redirection_url;
    }
  };

  const samlRenewOrReject = ({ type, values }) => {
    switch (type) {
      case 'SAML_redirection':
        redirectAndRenewAuth(values);
        break;
      default:
        return renewAuth(values?.auth);
    }
  };

  // when response code in range of 2xx
  const onSuccess = (response) => {
    const { data } = response;
    data && configuration?.saml?.enable && samlRenewOrReject(data);
    return response;
  };

  // when timeout and response code out of range 2XX
  const onError = (error) => {
    return matchRetryConditions(error) ? retry(error) : Promise.reject();
  };

  instance.interceptors.response.use(onSuccess, onError);
  return instance;
};
