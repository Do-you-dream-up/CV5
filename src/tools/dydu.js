import { Cookie, Local } from './storage';
import { RESPONSE_QUERY_FORMAT, SOLUTION_TYPE } from './constants';
import {
  _stringify,
  b64encodeObject,
  htmlToJsonForSendUploadFile,
  isDefined,
  isEmptyString,
  isOfTypeString,
  secondsToMs,
  strContains,
  toFormUrlEncoded,
} from './helpers';
import { BOT } from './bot';
import Bowser from 'bowser';
import Storage from '../components/auth/Storage';
import { hasWizard } from './wizard';
import i18n from '../contexts/i18nProvider';
import qs from 'qs';
import {
  SERVLET_API,
  buildServletUrl,
  emit,
  SERVLET,
  setLastResponse,
  getLastResponse,
  setConfiguration,
} from './axios';

const { browser, os } = Bowser.getParser(window.navigator.userAgent).parsedResult;

const getUrl = window.location.href;

const variables = {};

/**
 * Implement JavaScript bindings for Dydu's REST API.
 * https://uat.mars.doyoudreamup.com/servlet/api/doc3/index.html
 */
export default new (class Dydu {
  constructor() {
    this.configuration = {};
    this.contextId = localStorage.getItem('dydu.context');
    this.locale = null;
    this.showSurveyCallback = null;
    this.space = null;
    this.maxTimeoutForAnswer = secondsToMs(50);
    this.qualificationMode = false;
  }

  getVariables() {
    return JSON.stringify(variables);
  }

  alreadyCame() {
    const clientIdKey = Local.clientId.getKey();
    return Local.clientId.isSet(clientIdKey);
  }

  setContextId = (value) => {
    if (isDefined(value)) {
      Local.contextId.save(BOT.id, value);
      this.contextId = value;
    }
  };

  /**
   * Export conversation by email
   *
   * @param {string} text - Input to send.
   * @param {Object} [options] - Extra parameters.
   * @returns {Promise}
   */
  exportConversation = async (text, options = {}) => {
    const data = qs.stringify({
      clientId: this.getClientId(),
      doNotRegisterInteraction: options.doNotRegisterInteraction,
      language: this.getLocale(),
      qualificationMode: this.qualificationMode,
      space: this.getSpace(),
      userInput: `#dydumailto:${this.contextId}:${text}#`,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
      ...(options.extra && { extraParameters: options.extra }),
    });
    const path = `chat/talk/${BOT.id}/${this.contextId ? `${this.contextId}/` : ''}`;
    return emit(SERVLET_API.post, path, data);
  };

  /**
   * Send the user feedback.
   *
   * @param {true|false|undefined} value - Value of the feedback.
   * @returns {Promise}
   */
  feedback = async (value) => {
    const data = qs.stringify({
      contextUUID: this.contextId,
      feedBack: { false: 'negative', true: 'positive' }[value] || 'withoutAnswer',
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/feedback/${BOT.id}/`;
    return emit(SERVLET_API.post, path, data);
  };

  /**
   * Send the user feedback comment.
   *
   * @param {string} comment - Comment to send.
   * @returns {Promise}
   */
  feedbackComment = async (comment) => {
    const data = qs.stringify({
      comment,
      contextUUID: this.contextId,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/feedback/comment/${BOT.id}/`;
    return emit(SERVLET_API.post, path, data);
  };

  /**
   * Send the user feedback insatisfaction.
   *
   * @param {string} choiceKey - Choice key to send.
   * @returns {Promise}
   */
  feedbackInsatisfaction = async (choiceKey) => {
    const data = qs.stringify({
      choiceKey,
      contextUUID: this.contextId,
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/feedback/insatisfaction/${BOT.id}/`;
    return emit(SERVLET_API.post, path, data);
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
    return Promise.all(methods.map((it) => emit(SERVLET_API.post, path, qs.stringify({ ...data, object: it }))));
  };

  hasUserAcceptedGdpr() {
    const gdprSources = [Local.byBotId(BOT.id).get(Local.names.gdpr), Local.get(Local.names.gdpr)];
    return gdprSources.some(isDefined);
  }

  getBot = () => BOT;

  /**
   * Read the client ID from cookie and return it.
   *
   * @returns {string | boolean} The client ID.
   */
  getClientId = () => {
    const clientIdKey = Local.clientId.getKey();
    const userInfo = Storage.loadUserInfo();
    if (!this.alreadyCame()) Local.clientId.createAndSave(clientIdKey, userInfo?.email);
    return Local.clientId.load(clientIdKey);
  };

  /**
   * Read the context ID from the local storage and return it,
   * if the context ID not exist in local storage we fecth it from the API
   *
   * @returns {object} The context ID.
   */
  getContextId = async () => {
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
      const response = await emit(SERVLET_API.post, path, data);
      return response?.contextId;
    } catch (e) {
      console.error('While executing getContextId() ', e);
      return '';
    }
  };

  getContextIdStorageKey() {
    return Local.contextId.createKey(BOT.id, this.getConfiguration()?.application?.directory);
  }

  getConfiguration() {
    return this.configuration;
  }

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
    if (!isDefined(this.space)) this.space = this.getConfiguration().spaces?.items[0];
    Local.set(Local.names?.space, this.space);
    return this.space;
  };

  /**
   * Fetch previous conversations.
   *
   * @returns {Promise}
   */
  history = async () => {
    if (this.contextId) {
      const data = qs.stringify({
        contextUuid: this.contextId,
        solutionUsed: SOLUTION_TYPE.assistant,
        ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
      });
      const path = `chat/history/${BOT.id}/`;
      return await emit(SERVLET_API.post, path, data);
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
      resolve(emit(SERVLET_API.post, path));
    });

  /**
   * Print conversations.
   *
   *
   */
  printHistory = async () => {
    if (this.contextId) {
      const path = `${buildServletUrl()}history?context=${this.contextId}&format=html&userLabel=Moi&botLabel=Chatbot`;

      // Create a new window to display the conversation history
      const newWindow = window.open(path, '_blank');

      // If the new window has been opened successfully, print its contents
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          newWindow.print();
        });
      }
    }
  };

  initLocaleWithConfiguration(configuration) {
    const shouldGetLanguageFromBrowser = configuration?.application?.getDefaultLanguageFromSite;
    let locale = shouldGetLanguageFromBrowser
      ? Local.get(Local.names.locale) // at this point in time, this value comes from browser language, set by i18nProvider or by locale already set by a previous usage
      : this.getConfigurationDefaultLanguage(configuration);
    this.setLocaleFromConfiguration(locale, configuration);
  }

  getConfigurationDefaultLanguage(configuration) {
    return configuration?.application?.defaultLanguage[0] || this.getFallBackLanguage();
  }

  getFallBackLanguage() {
    return 'fr';
  }

  correctLocaleFromBotLanguages = (activatedAndActiveBotLanguages = []) => {
    if (activatedAndActiveBotLanguages && activatedAndActiveBotLanguages.includes(this.locale)) {
      // keep locale that is already ok
    } else {
      this.setLocale(this.getFallBackLanguage());
    }
  };

  setLocaleFromConfiguration(localeInput, configuration) {
    let localeToSet;
    if (configuration?.application?.languages?.includes(localeInput)) {
      localeToSet = localeInput;
    } else {
      console.log(
        `Setting an unknown locale '${localeInput}'. Possible values: [${configuration?.application?.languages}].`,
      );
      localeToSet = this.getFallBackLanguage();
    }
    this.setLocale(localeToSet);
  }

  setLocale(localeToSet) {
    this.locale = localeToSet;
    Local.set(Local.names.locale, localeToSet);
    i18n.changeLanguage(localeToSet);
  }

  getLocale() {
    return this.locale;
  }

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
    return emit(SERVLET_API.post, path, data);
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
    const path = `chat/talk/${BOT.id}/${this.contextId ? `${this.contextId}/` : ''}`;
    return emit(SERVLET_API.post, path, data, this.maxTimeoutForAnswer).then(this.processTalkResponse);
  };

  processTalkResponse = (talkResponse) => {
    this.handleSpaceWithTalkResponse(talkResponse);
    this.handleKnownledgeQuerySurveyWithTalkResponse(talkResponse);
    return talkResponse;
  };

  handleSpaceWithTalkResponse(response) {
    const guiCSName = response?.guiCSName?.fromBase64();
    if (guiCSName) this.setSpace(guiCSName);
    return response;
  }

  /**
   * getBotLanguages
   *
   * @returns {Promise}
   */
  getBotLanguages = () => {
    const path = `/account/dydubox/bots/language?botUUID=${BOT.id}`;
    return emit(SERVLET_API.get, path);
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
    return emit(SERVLET_API.get, path);
  };

  /**
   * getSaml2UserInfo - Get userinfo.
   *
   * @param {string} text - Input to send.
   * @param {Object} [options] - Extra parameters.
   * @returns {Promise}
   */
  getSaml2UserInfo = (saml2Info_token) => {
    const data = qs.stringify({
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: saml2Info_token }),
      botUUID: BOT.id,
    });
    const path = `saml2/userinfo?${data}`;
    return emit(SERVLET_API.get, path);
  };

  #makeTLivechatTypingPayloadWithInput = async (input = '') => {
    if (!isDefined(input)) return;
    return {
      type: 'typing',
      parameters: {
        alreadyCame: this.alreadyCame(),
        typing: isDefined(input) && !isEmptyString(input),
        content: input?.toBase64(),
        contextId: this.contextId,
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
    const path = `${buildServletUrl()}chatHttp?data=${qs}`;
    return fetch(path).then((r) => r.json());
  };

  poll = async ({ serverTime, pollTime, contextId, context }) => {
    const data = {
      solutionUsed: SOLUTION_TYPE.livechat,
      format: RESPONSE_QUERY_FORMAT.json,
      space: this.getSpace(),
      contextUuid: contextId || context?.fromBase64() || this.contextId,
      language: this.getLocale(),
      lastPoll: pollTime || serverTime,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    };

    if (data.lastPoll) {
      const path = `/chat/poll/last/${this.getBot()?.id}`;
      return emit(SERVLET_API.post, path, toFormUrlEncoded(data));
    }

    return new Promise(() => {});
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
      solutionUsed: SOLUTION_TYPE.assistant,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/topknowledge/${BOT.id}/`;
    return emit(SERVLET_API.post, path, data);
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
    const data = qs.stringify({
      contextUuid: this.contextId,
      name,
      solutionUsed: SOLUTION_TYPE.assistant,
      value,
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
    });
    const path = `chat/variable/${BOT.id}/`;
    return emit(SERVLET_API.post, path, data);
  };

  /**
   * Register user visit.
   *
   * @returns {Promise}
   */
  welcomeCall = async () => {
    const data = qs.stringify({
      contextUuid: this.contextId,
      language: this.getLocale(),
      qualificationMode: this.qualificationMode,
      solutionUsed: SOLUTION_TYPE.assistant,
      space: this.getSpace() || 'default',
      ...(this.getConfiguration()?.saml?.enable && { saml2_info: Local.saml.load() }),
      variables: this.getVariables(),
    });
    const path = `chat/welcomecall/${BOT.id}`;
    return emit(SERVLET_API.post, path, data);
  };

  /**
   * Retrieve the bot identity.
   *
   * @returns {Promise}
   */
  whoami = () =>
    emit(SERVLET_API.get, 'whoami/').then(({ headers = [] }) => {
      const data = headers.find((it) => it && it.host);
      return data && data.host;
    });

  #makeTalkPayloadWithTextAndOption = (text, options) => {
    return {
      alreadyCame: this.alreadyCame(),
      browser: `${browser.name} ${browser.version}`,
      clientId: this.getClientId(),
      doNotRegisterInteraction: options.doNotRegisterInteraction,
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

  post = (...postArgs) => emit(...[SERVLET_API.post].concat(postArgs));
  get = (...getArgs) => emit(...[SERVLET_API.get].concat(getArgs));

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
    contextId: this.contextId,
    alreadyCame: this.alreadyCame(),
    browser: `${browser.name} ${browser.version}`,
    clientId: this.getClientId(),
    doNotRegisterInteraction: options.doNotRegisterInteraction,
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

  isLastResponseStatusInRange = (startHttpCode, endHttpCode) => {
    const status = getLastResponse()?.status;
    return Boolean(status && status >= startHttpCode && status <= endHttpCode);
  };

  sendUploadFile = (file) => {
    const formData = new FormData();
    formData.append('dydu-upload-file', file);
    const path = `fileupload?ctx=${this.contextId}&fin=dydu-upload-file&cb=dyduUploadCallBack_0PW&origin=http%3A%2F%2F0.0.0.0%3A9999`;

    return SERVLET.post(path, formData)
      .then((response) => {
        const responseObject = htmlToJsonForSendUploadFile(response.data);

        if (responseObject && responseObject.params.status === 'fail') {
          console.log('La requête a échoué :', responseObject);
          window.dydu.chat.reply(i18n.t('uploadFile.errorMessage'));
          throw new Error('La requête a échoué');
        } else {
          this.displayUploadFileSent(file.name);
          return true;
        }
      })
      .catch((error) => {
        // Gérer l'erreur ici
        console.error(error);
        return false;
      });
  };

  isLastResponseStartsLivechat = () => {
    return Boolean(!getLastResponse().data?.values?.startLivechat);
  };

  displayUploadFileSent = (fileName) => {
    const statusOk = this.isLastResponseStatusInRange(200, 206);

    if (this.isLastResponseStartsLivechat() && statusOk) {
      window.dydu.chat.reply(i18n.t('uploadFile.sentMessage', { name: fileName }));
    } else if (this.isLastResponseStartsLivechat()) {
      window.dydu.chat.reply(i18n.t('uploadFile.errorMessage', { name: fileName }));
    }
  };

  sendSurveyPolling = async (survey, options = {}) => {
    const basePayload = await this.getTalkBasePayload(options);
    let payload = {
      type: 'survey',
      parameters: b64encodeObject({
        botId: BOT.id,
        surveyId: survey.surveyId,
        interactionSurveyAnswer: survey.interactionSurvey,
        fields: survey.fields,
        reword: isDefined(survey.reword) ? survey.reword : '',
        ...basePayload,
      }),
    };
    try {
      const response = await fetch(`${buildServletUrl()}chatHttp?data=${_stringify(payload)}`);
      const jsonResponse = await response.json();
      setLastResponse(jsonResponse);
      return this.displaySurveySent(payload.parameters.reword);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async createSurveyPayload(surveyId, fieldObject) {
    return {
      ctx: this.contextId,
      uuid: surveyId,
      ...fieldObject,
    };
  }

  displaySurveySent = (reword, res, status = null) => {
    return new Promise((resolve) => {
      status = status || getLastResponse().status;
      const statusOk = status >= 200 && status <= 206;
      if (statusOk) {
        if (reword) {
          window.dydu.chat.handleRewordClicked(reword, {
            hide: true,
            type: 'redirection_knowledge',
            fromSurvey: true,
          });
        } else {
          window.dydu.chat.reply(i18n.t('survey.sentMessage'));
        }
      } else {
        window.dydu.chat.reply(i18n.t('survey.errorMessage'));
      }
      resolve(res);
    });
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
    return this.post(path, formData).then(this.displaySurveySent(surveyAnswer.reword));
  };

  getSurvey = async (surveyId = '') => {
    if (!isDefined(surveyId) || isEmptyString(surveyId)) return null;
    const path = `/chat/survey/configuration/${BOT.id}`;
    const data = toFormUrlEncoded({
      contextUuid: this.contextId,
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
      botId: await BOT.id,
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
    setConfiguration(configuration);
    this.onConfigurationLoaded();
  }

  onConfigurationLoaded() {
    this.setInitialSpace(this.getSpace(this.getConfiguration().spaces.detection));
    this.setQualificationMode(this.getConfiguration().qualification?.active);
    this.initLocaleWithConfiguration(this.getConfiguration());
  }

  setSpaceToDefault() {
    const defaultSpaceName = 'default';
    this.setInitialSpace(defaultSpaceName);
  }

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
