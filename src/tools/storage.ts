import { _parse, _stringify, isDefined, isEmptyObject, isEmptyString, trimSlashes } from './helpers';

import cookie from 'js-cookie';
import uuid4 from 'uuid4';

/**
 * Small wrapper featuring a getter and a setter for browser session.
 */
export class Session {
  static names = {
    newMessage: 'dydu.newMessage',
    banner: 'dydu.banner',
    pushruleTrigger: 'pushruleTrigger',
    lastPoll: 'dydu.lastPoll',
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
    locale: 'dydu.locale',
    samlEnable: 'dydu.saml.enable',
    oidcEnable: 'dydu.oidc.enable',
    oidcWithAuthEnable: 'dydu.oidcWithAuth.enable',
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
    livechatType: 'dydu.livechatType',
    waitingQueue: 'dydu.waitingQueue',
    isChannels: 'dydu.isChannels',
    client: 'dydu.client',
    context: 'dydu.context',
    dragon: 'dydu.dragon',
    fontSize: 'dydu.fontSize',
    gdpr: 'dydu.gdpr',
    botId: 'dydu.botId',
    // used for chat talk and i18n, filled first if empty with browser Language by i18n
    // then maybe updated by configuration and/or bot languages from Atria
    // and if user switch language in chatbox
    locale: 'dydu.locale',
    onboarding: 'dydu.onboarding',
    open: 'dydu.open',
    sidebar: 'dydu.sidebar',
    space: 'dydu.space',
    wizard: 'dydu.wizard.data',
    images: 'dydu.images',
    saml: 'dydu.saml.auth',
    visit: 'dydu.visit',
    welcome: 'dydu.welcomeKnowledge',
    operator: 'dydu.operator',
    servers: 'dydu.servers', // From Channels
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
  static _BOTS_BY_ID_KEY = 'dydu.botsById';
  static _getInitialStore = () => ({});
  static _getInitialBot = (botId) => ({
    id: botId,
    [Local.names.context]: '',
  });

  /**
   * @private
   * Ensure that key exist in the localStorage and it is an object (as defined in _getInitialStore).
   * Popularize the localStorage with an itnial object associated to the key.
   * It only re initialize if the value associated to the key is undefined or it's not an object.
   */
  static _populateBotsById = () => {
    const initialStore = Local._getInitialStore();
    const botsById = localStorage.getItem(Local._BOTS_BY_ID_KEY);
    if (!botsById) {
      localStorage.setItem(Local._BOTS_BY_ID_KEY, JSON.stringify(initialStore));
    }
    try {
      const parsedBots = botsById && JSON.parse(botsById);
      if (typeof parsedBots !== 'object') {
        throw new Error('botsById is not an object. It should be');
      }
    } catch {
      // botsById is not an object. It should be !
      localStorage.setItem(Local._BOTS_BY_ID_KEY, JSON.stringify(initialStore));
    }
  };

  /**
   * @private
   * Retrieve the botsById store. It popularize before.
   * @returns {Object} parsed value stored behing the root key in the localStorage
   * @example // it should return
   * { 'xxx' : { id : 'xxx' }}
   */
  static _getBotsById = () => {
    Local._populateBotsById();
    const botById = localStorage.getItem(Local._BOTS_BY_ID_KEY);
    return botById && JSON.parse(botById);
  };

  /**
   * @private
   * Popularize an intial bot behind his id if it's the first time we access to the given id
   * @param {String} botId the bot id
   */
  static _populateBotById = (botId) => {
    const botsById = Local._getBotsById();
    if (!botsById[botId]) {
      botsById[botId] = Local._getInitialBot(botId);
      localStorage.setItem(Local._BOTS_BY_ID_KEY, JSON.stringify(botsById));
    }
  };

  /**
   * @private
   * Retrieve the associated bot from the localStorage
   * @param {String} botId the bot id
   * @returns {Object} object stored into the localStorage behind the given bot id
   */
  static _getBotById = (botId) => {
    Local._populateBotById(botId);
    return Local._getBotsById()[botId];
  };

  /**
   * Safe read/write for a bot id. If the store doesnt existe, it will create it and popularize it.
   * @param {String} botId the bot id
   * @returns {Object} An object with a setter and a getter to read/write within the store for a given bot id
   */
  static byBotId = (botId) => {
    return {
      /**
       * getter scoped to the given bot id
       * @param {String} key key to retrieve
       * @returns {*} the deserialized value behind the key
       */
      get: (key) => Local._getBotById(botId)[key],
      /**
       * setter scoped to the given bot id. The value will be stringified.
       * @param {String} key key to retrieve
       * @param {*} value value to store (should be serializable/deserializable wih JSON.parse, JSON.stringify)
       * @returns the deserialized value behind the key
       */
      set: (key, value) => {
        const botsById = Local._getBotsById();
        botsById[botId][key] = value;
        localStorage.setItem(Local._BOTS_BY_ID_KEY, JSON.stringify(botsById));
      },
      /**
       * remove given bot id. The value will be stringified.
       * @param {String} key key to retrieve
       * @param {*} value value to store (should be serializable/deserializable wih JSON.parse, JSON.stringify)
       * @returns the deserialized value behind the key
       */
      remove: () => {
        const botsById = Local._getBotsById();
        delete botsById[botId];
        localStorage.setItem(Local._BOTS_BY_ID_KEY, JSON.stringify(botsById));
      },
    };
  };

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

  static botId = Object.create({
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

  static viewMode = Object.create({
    load: () => {
      const d = localStorage.getItem(Local.names.open);
      return isDefined(d) ? _parse(d) : null;
    },
    save: (value) => localStorage.setItem(Local.names.open, value),
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
    createKey: (botId = '', directoryId = '') => {
      const separator = isEmptyString(directoryId) ? '' : '.';
      return `${trimSlashes(botId)}${separator}${trimSlashes(directoryId)}`;
    },
    save: (key, value) => {
      Local.byBotId(key).set(Local.names.context, value);
      Local.set(Local.names.context, value);
    },
    isSet: (key) => {
      return isDefined(Local.byBotId(key).get(Local.names.context) || Local.get(Local.names.context));
    },
    load: (key) => {
      return Local.byBotId(key).get(Local.names.context) || Local.get(Local.names.context);
    },
  });
}

const generateClientUuid = (charSize = 15) => uuid4().replaceAll('-', '').slice(0, charSize);
