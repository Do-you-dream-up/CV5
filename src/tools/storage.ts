import { _parse, _stringify, isDefined, isEmptyObject, isEmptyString, trimSlashes } from './helpers';

import cookie from 'js-cookie';
import uuid4 from 'uuid4';

/**
 * Small wrapper featuring a getter and a setter for browser session.
 */
export class Session {
  static names = {
    newMessage: 'dydu.chatbox.newMessage',
    banner: 'dydu.chatbox.banner',
    pushruleTrigger: 'dydu.chatbox.pushruleTrigger',
    lastPoll: 'dydu.chatbox.lastPoll',
  };

  /**
   * Retrieve a value stored in the session storage.
   *
   * If the value is not found in the session storage dictionary and a fallback is
   * provided, set it before returning it.
   *
   * If the provided fallback is a function, call it to obtain the fallback
   * value.
   *
   * @param {string} name - Name of the session storage variable to fetch.
   * @param {*} [fallback] - Value or function to fallback to if the name was
   *                         not found.
   * @param {boolean} save - Whether the fallback value should be saved.
   * @returns {*} Value of the variable that was found.
   */
  static get = (name: string, fallback?: any, save?: any) => {
    let value = sessionStorage.getItem(name);
    if (!value && fallback !== undefined) {
      value = typeof fallback === 'function' ? fallback() : fallback;
      if (save) {
        this.set(name, value);
      }
    }
    try {
      return value && JSON.parse(value);
    } catch {
      return value;
    }
  };

  /**
   * Upsert a value in the session storage.
   *
   * @param {string} name - Name of the session storage variable.
   * @param {*} [value] - Value to set, default to the current Unix timestamp.
   */
  static set = (name, value) => {
    value = value === undefined ? Math.floor(Date.now() / 1000) : value;
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    sessionStorage.setItem(name, value);
  };

  /**
   * Clear a session storage variable or all variables if no name is specified.
   *
   * @param {string} [name] - Name of the session storage variable to delete.
   */
  static clear = (name) => (name ? sessionStorage.removeItem(name) : sessionStorage.clear());
}

/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export class Cookie {
  static names = {
    locale: 'dydu.chatbox.locale',
    samlEnable: 'dydu.chatbox.saml.enable',
    oidcEnable: 'dydu.chatbox.oidc.enable',
    oidcWithAuthEnable: 'dydu.chatbox.oidcWithAuth.enable',
  };

  static duration = {
    long: 365,
    short: (1 / 24 / 60) * 10,
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
    options = {
      expires: typeof options === 'number' ? options : Cookie.duration.short,
      ...options,
    };
    cookie.set(name, value, options);
  };

  /**
   * Remove the specified cookie.
   *
   * @param {string} name - Name of the cookie.
   */
  static remove = (name) => cookie.remove(name);
}

/**
 * Small wrapper for localStorage methods.
 */
export class Local {
  static names = {
    livechatType: 'dydu.chatbox.livechatType',
    livechatType: 'dydu.chatbox.livechatType',
    waitingQueue: 'dydu.chatbox.waitingQueue',
    isChannels: 'dydu.chatbox.isChannels',
    client: 'dydu.chatbox.client',
    context: 'dydu.chatbox.context',
    dragon: 'dydu.chatbox.dragon',
    fontSize: 'dydu.chatbox.fontSize',
    gdpr: 'dydu.chatbox.gdpr',
    cookies: 'dydu.chatbox.cookies',
    botId: 'dydu.chatbox.botId',
    // used for chat talk and i18n, filled first if empty with browser Language by i18n
    // then maybe updated by configuration and/or bot languages from Atria
    // and if user switch language in chatbox
    locale: 'dydu.chatbox.locale',
    onboarding: 'dydu.chatbox.onboarding',
    open: 'dydu.chatbox.open',
    sidebar: 'dydu.chatbox.sidebar',
    space: 'dydu.chatbox.space',
    wizard: 'dydu.chatbox.wizard.data',
    images: 'dydu.chatbox.images',
    saml: 'dydu.chatbox.saml.auth',
    visit: 'dydu.chatbox.visit',
    welcome: 'dydu.chatbox.welcomeKnowledge',
    operator: 'dydu.chatbox.operator',
    servers: 'dydu.chatbox.servers', // From Channels
  };

  /**
   * Clear a local storage variable or all variables if no name is specified.
   *
   * @param {string} [name] - Name of the local storage variable to delete.
   */
  static clear = (name) => (name ? localStorage.removeItem(name) : localStorage.clear());

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
  static get = (name: string, fallback?: any, save?: any) => {
    let value = localStorage.getItem(name);
    if (!value && fallback !== undefined) {
      value = typeof fallback === 'function' ? fallback() : fallback;
      if (save) {
        this.set(name, value);
      }
    }
    try {
      return value && JSON.parse(value);
    } catch {
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
    value = value === undefined ? Math.floor(Date.now() / 1000) : value;
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(name, value);
  };

  // TODO: review with someone

  // The root key associated  to the 'botsById' store ino the local storage
  static _getInitialStore = () => ({});
  static _getInitialBot = (botId) => ({
    id: botId,
    [Local.names.context]: '',
  });

  static cookies = Object.create({
    save: (data) => localStorage.setItem(Local.names.cookies, data),
    load: () => {
      const areCookiesAccepted = localStorage.getItem(Local.names.cookies);
      return (areCookiesAccepted && JSON.parse(areCookiesAccepted)) || false;
    },
    reset: () => localStorage.removeItem(Local.names.cookies),
  });

  static gdpr = Object.create({
    save: (data) => localStorage.setItem(Local.names.gdpr, data),
    load: () => {
      const isGdprAccepted = localStorage.getItem(Local.names.gdpr);
      return (isGdprAccepted && JSON.parse(isGdprAccepted)) || false;
    },
    reset: () => localStorage.removeItem(Local.names.gdpr),
  });

  static livechatType = Object.create({
    save: (data) => localStorage.setItem(Local.names.livechatType, data),
    load: () => localStorage.getItem(Local.names.livechatType),
    remove: () => localStorage.removeItem(Local.names.livechatType),
  });

  static waitingQueue = Object.create({
    save: (data) => localStorage.setItem(Local.names.waitingQueue, data),
    load: () => {
      const waitingQueue = localStorage.getItem(Local.names.waitingQueue);
      return (waitingQueue && JSON.parse(waitingQueue)) || false;
    },
    remove: () => localStorage.removeItem(Local.names.waitingQueue),
  });

  static isChannels = Object.create({
    load: () => {
      const isChannels = localStorage.getItem(Local.names.isChannels);
      return (isChannels && JSON.parse(isChannels)) || false;
    },
  });

  static servers = Object.create({
    load: () => {
      const servers = localStorage.getItem(Local.names.servers);
      return servers && JSON.parse(servers);
    },
  });

  static botIdForChannels = Object.create({
    save: (data: string) => localStorage.setItem(Local.names.botId, data),
    load: () => localStorage.getItem(Local.names.botId) || null,
    remove: () => localStorage.removeItem(Local.names.botId),
  });

  static saml = Object.create({
    save: (data) => localStorage.setItem(Local.names.saml, data),
    load: () => localStorage.getItem(Local.names.saml) || null,
    remove: () => localStorage.removeItem(Local.names.saml),
  });

  static operator = Object.create({
    save: (data) => localStorage.setItem(Local.names.operator, data),
    load: () => localStorage.getItem(Local.names.operator) || null,
    remove: () => localStorage.removeItem(Local.names.operator),
  });

  static locale = Object.create({
    save: (data) => localStorage.setItem(Local.names.locale, data),
    load: () => localStorage.getItem(Local.names.locale) || null,
    remove: () => localStorage.removeItem(Local.names.locale),
  });

  static space = Object.create({
    save: (data) => localStorage.setItem(Local.names.space, data),
    load: () => localStorage.getItem(Local.names.space) || null,
    remove: () => localStorage.removeItem(Local.names.space),
  });

  static viewMode = Object.create({
    load: () => {
      const d = localStorage.getItem(Local.names.open);
      return isDefined(d) ? _parse(d) : null;
    },
    save: (value) => localStorage.setItem(Local.names.open, value),
    remove: () => localStorage.removeItem(Local.names.open),
  });

  static visit = Object.create({
    getKey: () => Local.names.visit,
    load: (keyString = '') => {
      const content = localStorage.getItem(keyString);
      return isDefined(content) ? content : null;
    },
    isSet: (keyString = '') => {
      const content = Local.visit.load(keyString);
      return [isDefined, (c) => !isEmptyObject(c)].every((fn) => fn(content));
    },
    save: (keyStringParams = {}) => {
      const key = Local.visit.getKey(keyStringParams);
      localStorage.setItem(key, Date.now().toString());
    },
  });

  static clientId = Object.create({
    getKey: () => Local.names.client,
    load: (keyString = '') => {
      const content = localStorage.getItem(keyString);
      return isDefined(content) ? content : '';
    },
    isSet: (keyString = '') => {
      const content = Local.clientId.load(keyString);
      return [isDefined, (c) => !isEmptyObject(c), (c) => !isEmptyString(c)].every((fn) => fn(content));
    },
    createAndSave: (keyString, clientId = null) => {
      const ID_CHAR_SIZE = 15;
      const generatedClientId = clientId || generateClientUuid(ID_CHAR_SIZE).toString();
      localStorage.setItem(keyString, generatedClientId);
    },
  });

  static sidebar = Object.create({
    getKey: () => Local.names.sidebar,
    load: () => localStorage.getItem(Local.sidebar.getKey()) || false,
    save: (newValue) => {
      const currentSaved = Local.sidebar.load();
      if (currentSaved !== newValue) localStorage.setItem(Local.sidebar.getKey(), newValue);
    },
  });

  static welcomeKnowledge = Object.create({
    getKey: (botId) => `${Local.names.welcome}_${botId}`,
    load: (botId, contextId) => {
      const data = localStorage.getItem(Local.welcomeKnowledge.getKey(botId));
      if (data) {
        return JSON.parse(data)[contextId];
      }
      return null;
    },
    save: (botId, newValue) => {
      if (newValue) {
        const contextId = newValue.contextId;
        const stored = Local.welcomeKnowledge.load(botId, contextId) || {};
        stored[contextId] = newValue;
        localStorage.setItem(Local.welcomeKnowledge.getKey(botId), JSON.stringify(stored));
      }
    },
  });

  static contextId = Object.create({
    getKey: (botId: string) => `${Local.names.context}_${botId}`,
    load: (botId: string) => {
      return localStorage.getItem(Local.contextId.getKey(botId));
    },
    save: (botId: string, newValue: string) => {
      if (newValue) {
        localStorage.setItem(Local.contextId.getKey(botId), newValue);
      }
    },
  });
}

const generateClientUuid = (charSize = 15) => uuid4().replaceAll('-', '').slice(0, charSize);
