import cookie from 'js-cookie';

/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export class Cookie {
  static names = {
    locale: 'dydu.locale',
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
}

/**
 * Small wrapper for localStorage methods.
 */
export class Local {
  static names = {
    banner: 'dydu.banner',
    client: 'dydu.client',
    context: 'dydu.context',
    dragon: 'dydu.dragon',
    fontSize: 'dydu.fontSize',
    gdpr: 'dydu.gdpr',
    locale: 'dydu.locale',
    onboarding: 'dydu.onboarding',
    open: 'dydu.open',
    secondary: 'dydu.secondary',
    space: 'dydu.space',
    visitor: 'dydu.visitor',
    wizard: 'dydu.wizard.data',
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
   * @deprecated You will end with a 'configuration (because it's saved in the localStorage)' conflict. Use byBotId.get instead
   */
  static get = (name, fallback, save) => {
    let value = localStorage.getItem(name);
    if (!value && fallback !== undefined) {
      value = typeof fallback === 'function' ? fallback() : fallback;
      if (save) {
        this.set(name, value);
      }
    }
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  /**
   * Upsert a value in the local storage.
   *
   * @param {string} name - Name of the local storage variable.
   * @param {*} [value] - Value to set, default to the current Unix timestamp.
   * @param {*} [rest] - Extra options to pass to `localStorage.setItem`.
   * @deprecated You will end with a 'configuration (because it's saved in the localStorage)' conflict. Use byBotId.set instead
   */
  static set = (name, value, ...rest) => {
    value = value === undefined ? Math.floor(Date.now() / 1000) : value;
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(name, value, ...rest);
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
      const parsedBots = JSON.parse(botsById);
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
    return JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
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
    };
  };
}
