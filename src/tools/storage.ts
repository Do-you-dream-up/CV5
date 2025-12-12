import { _parse, getChatboxId, isDefined, isEmptyObject, isEmptyString } from './helpers';

import cookie from 'js-cookie';
import uuid4 from 'uuid4';
import { cleanUrl } from '../components/auth/helpers';
import { isLoadedFromChannels } from './wizard';
import { BOT } from './bot';

abstract class CustomStorageBase {
  buildBotKey(key: string): string {
    const botId = typeof BOT !== 'undefined' && BOT.id ? BOT.id : 'unknown';
    return `${key}_${botId}`;
  }

  abstract getItem(key: string): string | null;
  abstract setItem(key: string, value: string): void;
  abstract removeItem(key: string): void;
  abstract clear(): void;

  getItemForBot(key: string): string | null {
    return this.getItem(this.buildBotKey(key));
  }

  setItemForBot(key: string, value: string): void {
    this.setItem(this.buildBotKey(key), value);
  }

  removeItemForBot(key: string): void {
    this.removeItem(this.buildBotKey(key));
  }
}

class ExtendedLocalStorage extends CustomStorageBase {
  public static INSTANCE: ExtendedLocalStorage = new ExtendedLocalStorage();
  private constructor() {
    super();
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

class ExtendedSessionStorage extends CustomStorageBase {
  public static INSTANCE: ExtendedSessionStorage = new ExtendedSessionStorage();
  private constructor() {
    super();
  }

  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}

const customLocalStorage = ExtendedLocalStorage.INSTANCE;
const customSessionStorage = ExtendedSessionStorage.INSTANCE;

/**
 * Small wrapper featuring a getter and a setter for browser session.
 */
export class Session {
  static names = {
    banner: 'dydu.chatbox.banner',
    retryLazyRefreshed: 'dydu.chatbox.retry.lazy.refreshed',
    currentServer: 'dydu.chatbox.server',
    nonce: 'dydu.chatbox.oidc.nonce',
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
    let value = customSessionStorage.getItem(name);
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
    customSessionStorage.setItem(name, value);
  };

  /**
   * Clear a session storage variable or all variables if no name is specified.
   *
   * @param {string} [name] - Name of the session storage variable to delete.
   */
  static clear = (name) => (name ? customSessionStorage.removeItem(name) : customSessionStorage.clear());

  static serverIndex = Object.create({
    save: (data): void => customSessionStorage.setItem(Session.names.currentServer, data),
    load: (): number => Number(customSessionStorage.getItem(Session.names.currentServer)) || 0,
    remove: (): void => customSessionStorage.removeItem(Session.names.currentServer),
  });

  static nonce = Object.create({
    save: (data: string): void => customSessionStorage.setItem(Session.names.nonce, data),
    load: (): string => customSessionStorage.getItem(Session.names.nonce) || '',
    remove: (): void => customSessionStorage.removeItem(Session.names.nonce),
  });
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

let suffix = '';
const chatboxId = getChatboxId();
if (chatboxId) {
  suffix = '.' + chatboxId;
} else if (isLoadedFromChannels()) {
  suffix = '.' + 'preview';
}

/**
 * Small wrapper for localStorage methods.
 */
export class Local {
  static names = {
    livechatType: 'dydu.chatbox.livechatType' + suffix,
    waitingQueue: 'dydu.chatbox.waitingQueue' + suffix,
    client: 'dydu.chatbox.client' + suffix,
    context: 'dydu.chatbox.context' + suffix,
    dragon: 'dydu.chatbox.dragon' + suffix,
    fontSize: 'dydu.chatbox.fontSize' + suffix,
    gdpr: 'dydu.chatbox.gdpr' + suffix,
    userConsentOptions: 'dydu.chatbox.userConsentOptions' + suffix,
    cookies: 'dydu.chatbox.cookies' + suffix,
    botId: 'dydu.chatbox.botId' + suffix,
    // used for chat talk and i18n, filled first if empty with browser Language by i18n
    // then maybe updated by configuration and/or bot languages from Atria
    // and if user switch language in chatbox
    locale: 'dydu.chatbox.locale' + suffix,
    onboarding: 'dydu.chatbox.onboarding' + suffix,
    open: 'dydu.chatbox.open' + suffix,
    sidebar: 'dydu.chatbox.sidebar' + suffix,
    space: 'dydu.chatbox.space' + suffix,
    manualSpaceSet: 'dydu.chatbox.manualSpaceSet' + suffix,
    wizard: 'dydu.chatbox.wizard.data' + suffix, // used only with channels
    images: 'dydu.chatbox.images' + suffix, // used only with channels
    saml: 'dydu.chatbox.saml.auth' + suffix,
    visit: 'dydu.chatbox.visit' + suffix,
    welcome: 'dydu.chatbox.welcomeKnowledge' + suffix,
    operator: 'dydu.chatbox.operator' + suffix,
    servers: 'dydu.chatbox.servers' + suffix, // From Channels
    lastInteraction: 'dydu.chatbox.interaction.last' + suffix,
    pushRules: 'dydu.chatbox.pushRules' + suffix,
    pushRulesTrigger: 'dydu.chatbox.pushRulesTriggered' + suffix,
    userInfo: 'dydu.chatbox.auth.userInfo' + suffix,
    oidcAuthData: 'dydu.chatbox.oidc.authData' + suffix,
    oidcUrls: 'dydu.chatbox.oidc.urls' + suffix,
    oidcIdToken: 'dydu.chatbox.oidc.idToken' + suffix,
    oidcAccessToken: 'dydu.chatbox.oidc.accessToken' + suffix,
    oidcRefreshToken: 'dydu.chatbox.oidc.refreshToken' + suffix,
    oidcRetry: 'dydu.chatbox.oidc.retry' + suffix,
    oidcPkceCodeVerifier: 'dydu.chatbox.oidc.pkce.codeVerifier' + suffix,
    oidcPkceCodeChallenge: 'dydu.chatbox.oidc.pkce.codeChallenge' + suffix,
    css: 'dydu.chatbox.css' + suffix,
    main: 'dydu.chatbox.main' + suffix,
  };

  // Ensuring compatibility after key renaming
  static oldNames = {
    userInfo: 'dydu-user-info' + suffix,
    oidcAuthData: 'pkce' + suffix,
    oidcUrls: 'dydu-oauth-url' + suffix,
    oidcIdToken: 'dydu-oauth-token-id' + suffix,
    oidcAccessToken: 'dydu-oauth-token-access' + suffix,
    oidcRefreshToken: 'dydu-oauth-token-refresh' + suffix,
    oidcPkceCodeVerifier: 'dydu-code-verifier' + suffix,
    oidcPkceCodeChallenge: 'dydu-code-challenge' + suffix,
  };

  static clearAll(botId?: string) {
    const prefixes = ['dydu', 'pushruleTrigger_', 'DYDU_'];
    Object.keys(localStorage)
      .filter((key: string) => {
        const hasPrefix = prefixes.some((prefix) => key.startsWith(prefix));
        return hasPrefix && (!botId || (botId && key.endsWith(botId)));
      })
      .forEach((key: string) => {
        console.log('Removing key=' + key + ' bot=', botId);
        customLocalStorage.removeItem(key);
      });
  }

  /**
   * Clear a local storage variable or all variables if no name is specified.
   *
   * @param {string} [name] - Name of the local storage variable to delete.
   */
  static clear = (name) => (name ? customLocalStorage.removeItem(name) : customLocalStorage.clear());

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
    let value = customLocalStorage.getItem(name);
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
    customLocalStorage.setItem(name, value);
  };

  static cookies = Object.create({
    save: (data) => customLocalStorage.setItem(Local.names.cookies, data),
    load: () => {
      const areCookiesAccepted = customLocalStorage.getItem(Local.names.cookies);
      return (areCookiesAccepted && JSON.parse(areCookiesAccepted)) || false;
    },
    reset: () => customLocalStorage.removeItem(Local.names.cookies),
  });

  static dragon = Object.create({
    save: (data) => customLocalStorage.setItem(Local.names.dragon, JSON.stringify(data)),
    load: () => {
      const dragonValue = customLocalStorage.getItem(Local.names.dragon);
      return (dragonValue && JSON.parse(dragonValue)) || null;
    },
    reset: () => customLocalStorage.removeItem(Local.names.dragon),
  });

  static gdpr = Object.create({
    save: (data) => customLocalStorage.setItem(Local.names.gdpr, data),
    load: () => {
      const isGdprAccepted = customLocalStorage.getItem(Local.names.gdpr);
      return (isGdprAccepted && JSON.parse(isGdprAccepted)) || false;
    },
    reset: () => customLocalStorage.removeItem(Local.names.gdpr),
  });

  static userConsentOptions = Object.create({
    save: (data) => {
      if (data && Object.keys(data).length > 0) {
        customLocalStorage.setItem(Local.names.userConsentOptions, JSON.stringify(data));
      }
    },
    load: () => {
      const str = customLocalStorage.getItem(Local.names.userConsentOptions);
      if (str !== null) {
        return JSON.parse(str);
      }
      return null;
    },
    reset: () => {
      const str = customLocalStorage.getItem(Local.names.userConsentOptions);
      if (str !== null) {
        customLocalStorage.removeItem(Local.names.userConsentOptions);
      }
    },
  });

  static livechatType = Object.create({
    save: (data) => customLocalStorage.setItemForBot(Local.names.livechatType, data),
    load: () => customLocalStorage.getItemForBot(Local.names.livechatType),
    remove: () => customLocalStorage.removeItemForBot(Local.names.livechatType),
  });

  static waitingQueue = Object.create({
    save: (data) => customLocalStorage.setItemForBot(Local.names.waitingQueue, data),
    load: () => {
      const waitingQueue = customLocalStorage.getItemForBot(Local.names.waitingQueue);
      return (waitingQueue && JSON.parse(waitingQueue)) || false;
    },
    remove: () => customLocalStorage.removeItemForBot(Local.names.waitingQueue),
  });

  static servers = Object.create({
    load: () => {
      const servers = customLocalStorage.getItem(Local.names.servers);
      return servers && JSON.parse(servers);
    },
  });

  static botIdForChannels = Object.create({
    save: (data: string) => customLocalStorage.setItem(Local.names.botId, data),
    load: () => customLocalStorage.getItem(Local.names.botId) || null,
    remove: () => customLocalStorage.removeItem(Local.names.botId),
  });

  static saml = Object.create({
    save: (data) => customLocalStorage.setItemForBot(Local.names.saml, data),
    load: () => customLocalStorage.getItemForBot(Local.names.saml) || null,
    remove: () => customLocalStorage.removeItemForBot(Local.names.saml),
  });

  static operator = Object.create({
    save: (data) => customLocalStorage.setItemForBot(Local.names.operator, data),
    load: () => customLocalStorage.getItemForBot(Local.names.operator) || null,
    remove: () => customLocalStorage.removeItemForBot(Local.names.operator),
  });

  static locale = Object.create({
    save: (data) => customLocalStorage.setItem(Local.names.locale, data),
    load: () => customLocalStorage.getItem(Local.names.locale) || null,
    remove: () => customLocalStorage.removeItem(Local.names.locale),
  });

  static space = Object.create({
    save: (data) => {
      customLocalStorage.setItemForBot(Local.names.space, data);
    },
    load: () => {
      return customLocalStorage.getItemForBot(Local.names.space) || null;
    },
    remove: () => {
      customLocalStorage.removeItemForBot(Local.names.space);
    },
  });

  static manualSpaceSet = Object.create({
    save: () => {
      customLocalStorage.setItemForBot(Local.names.manualSpaceSet, 'true');
    },
    load: () => {
      return customLocalStorage.getItemForBot(Local.names.manualSpaceSet) == 'true' || false;
    },
    remove: () => {
      customLocalStorage.removeItemForBot(Local.names.manualSpaceSet);
    },
  });

  static viewMode = Object.create({
    load: () => {
      const d = customLocalStorage.getItem(Local.names.open);
      return isDefined(d) ? _parse(d) : null;
    },
    save: (value) => customLocalStorage.setItem(Local.names.open, value),
    remove: () => customLocalStorage.removeItem(Local.names.open),
  });

  static visit = Object.create({
    load: (): number | null => {
      const content = customLocalStorage.getItemForBot(Local.names.visit);
      return isDefined(content) ? Number(content) : null;
    },
    isSet: () => {
      const content = Local.visit.load();
      return isDefined(content);
    },
    save: () => {
      customLocalStorage.setItemForBot(Local.names.visit, Date.now().toString());
    },
  });

  static lastInteraction = Object.create({
    load: () => {
      const content = customLocalStorage.getItemForBot(Local.names.lastInteraction);
      return isDefined(content) && content ? Number(content) : null;
    },

    save: () => {
      customLocalStorage.setItemForBot(Local.names.lastInteraction, Date.now().toString());
    },
    reset: () => {
      customLocalStorage.removeItemForBot(Local.names.lastInteraction);
    },
  });

  static clientId = Object.create({
    getKey: () => Local.names.client,
    load: (keyString = '') => {
      const content = customLocalStorage.getItem(keyString);
      return isDefined(content) ? content : '';
    },
    isSet: (keyString = '') => {
      const content = Local.clientId.load(keyString);
      return [isDefined, (c) => !isEmptyObject(c), (c) => !isEmptyString(c)].every((fn) => fn(content));
    },
    createAndSave: (keyString, clientId = null) => {
      const ID_CHAR_SIZE = 15;
      const generatedClientId = clientId || generateClientUuid(ID_CHAR_SIZE).toString();
      customLocalStorage.setItem(keyString, generatedClientId);
    },
  });

  static sidebar = Object.create({
    getKey: () => Local.names.sidebar,
    load: () => customLocalStorage.getItemForBot(Local.sidebar.getKey()) || false,
    save: (newValue) => {
      const currentSaved = Local.sidebar.load();
      if (currentSaved !== newValue) customLocalStorage.setItemForBot(Local.sidebar.getKey(), newValue);
    },
  });

  static welcomeKnowledge = Object.create({
    getKey: () => Local.names.welcome,
    load: (contextId) => {
      const data = customLocalStorage.getItemForBot(Local.welcomeKnowledge.getKey());
      if (data) {
        return JSON.parse(data)[contextId];
      }
      return null;
    },
    save: (newValue) => {
      if (newValue) {
        const contextId = newValue.contextId;
        const stored = Local.welcomeKnowledge.load(contextId) || {};
        stored[contextId] = newValue;
        customLocalStorage.setItemForBot(Local.welcomeKnowledge.getKey(), JSON.stringify(stored));
      }
    },
    reset: () => {
      customLocalStorage.removeItemForBot(Local.welcomeKnowledge.getKey());
    },
  });

  static pushRules = Object.create({
    getKey: (space: string) => `${Local.names.pushRules}_${space}`,
    load: (space: string) => {
      const data = customLocalStorage.getItemForBot(Local.pushRules.getKey(space));
      if (data) {
        return JSON.parse(data) || {};
      }
      return {};
    },
    save: (space: string, key: string, value: any) => {
      if (key && value) {
        const stored = Local.pushRules.load(space) || {};
        stored[key] = value;
        customLocalStorage.setItemForBot(Local.pushRules.getKey(space), JSON.stringify(stored));
      }
    },
    reset: (space: string) => {
      customLocalStorage.removeItemForBot(Local.pushRules.getKey(space));
    },
    getValueOfRuleCondition: (space: string, ruleId: string, conditionId: string, defaultValue: string): string => {
      const ruleKey = `r_${ruleId}`;
      const cookieData = Local.pushRules.load(space);
      const ruleConditions = cookieData[ruleKey];

      return ruleConditions?.[conditionId] ?? defaultValue;
    },
    setValueOfRuleCondition: (space: string, ruleId: string, conditionId: string, value: any): void => {
      const ruleKey = `r_${ruleId}`;
      const cookieData = Local.pushRules.load(space);
      const ruleConditions = cookieData[ruleKey] || {};

      ruleConditions[conditionId] = value;
      Local.pushRules.save(space, ruleKey, ruleConditions);
    },
  });

  static pushRulesTrigger = Object.create({
    getKey: (): string => Local.names.pushRulesTrigger,
    load: (): string[] => {
      const data: string | null = customLocalStorage.getItemForBot(Local.pushRulesTrigger.getKey());
      if (data) {
        return JSON.parse(data) || [];
      }
      return [];
    },
    save: (value: any): void => {
      if (value) {
        const stored: string[] = Local.pushRulesTrigger.load() || [];
        if (!stored.some((item: string) => item === value)) {
          stored.push(value);
        }
        customLocalStorage.setItemForBot(Local.pushRulesTrigger.getKey(), JSON.stringify(stored));
      }
    },
    reset: (): void => {
      customLocalStorage.removeItemForBot(Local.pushRulesTrigger.getKey());
    },
  });

  static contextId = Object.create({
    getKey: () => Local.names.context,
    load: () => {
      return customLocalStorage.getItemForBot(Local.contextId.getKey());
    },
    save: (newValue: string) => {
      if (newValue) {
        customLocalStorage.setItemForBot(Local.contextId.getKey(), newValue);
      }
    },
    reset: () => {
      customLocalStorage.removeItemForBot(Local.contextId.getKey());
    },
  });

  static resetAllLocalStorageIfTooOld = (timeToKeep: number): boolean => {
    const lastInteractionKeyPrefix = Local.names.lastInteraction;
    const now = Date.now();
    const allInteractionKeys = Object.keys(localStorage).filter((key) => key.startsWith(lastInteractionKeyPrefix));
    const expiredBotIds: string[] = [];
    let isAllBotExpired = allInteractionKeys?.length !== 0;
    let hasClearedSomething = false;
    allInteractionKeys.forEach((key) => {
      const content = customLocalStorage.getItem(key);
      const lastInteraction = content ? Number(content) : null;

      if (lastInteraction && !Number.isNaN(lastInteraction)) {
        const timeSpent = now - lastInteraction;
        if (timeSpent > timeToKeep) {
          const botId = key.slice(lastInteractionKeyPrefix.length);
          expiredBotIds.push(botId);
        } else {
          isAllBotExpired = false;
        }
      }
    });
    expiredBotIds.forEach((botId) => {
      console.log(`Local storage for bot ${botId} is too old. Clearing its data.`);
      Local.clearAll(botId);
      hasClearedSomething = true;
    });

    if (isAllBotExpired) {
      Local.clearAll();
      hasClearedSomething = true;
    }

    return hasClearedSomething;
  };

  static isDialogTimeOver = () => {
    const lastInteraction = Local.lastInteraction.load();

    if (lastInteraction) {
      const now = Date.now();
      const timeSpent = now - lastInteraction;

      if (timeSpent > 600000) {
        return true;
      }
    }
    return false;
  };
}

export default class Auth {
  static setPkceData(codeChallenge, codeVerifier) {
    if (codeChallenge && codeVerifier) {
      customLocalStorage.setItem(Local?.names?.oidcPkceCodeChallenge, codeChallenge);
      customLocalStorage.setItem(Local?.names?.oidcPkceCodeVerifier, codeVerifier);
      console.log('Storing challenge/verifier');
    }
  }

  static loadPkceCodeVerifier() {
    return (
      customLocalStorage.getItem(Local?.names?.oidcPkceCodeVerifier) ||
      customLocalStorage.getItem(Local?.oldNames?.oidcPkceCodeVerifier)
    );
  }

  static loadPkceCodeChallenge() {
    return (
      customLocalStorage.getItem(Local?.names?.oidcPkceCodeChallenge) ||
      customLocalStorage.getItem(Local?.oldNames?.oidcPkceCodeChallenge)
    );
  }

  static saveOidcAuthData(pkceData) {
    customLocalStorage.setItem(Local?.names?.oidcAuthData, JSON.stringify(pkceData));
  }

  static clearOidcAuthData() {
    customLocalStorage.removeItem(Local?.names?.oidcAuthData);
    customLocalStorage.removeItem(Local?.oldNames?.oidcAuthData);
  }

  static loadOidcAuthData() {
    const authData =
      customLocalStorage.getItem(Local?.names?.oidcAuthData) ||
      customLocalStorage.getItem(Local?.oldNames?.oidcAuthData);
    return isDefined(authData) ? JSON.parse(<string>authData) : null;
  }

  static saveOidcUrls = (urls) => {
    customLocalStorage.setItem(Local?.names?.oidcUrls, JSON.stringify(urls));
  };

  static loadOidcUrls() {
    return (
      JSON.parse(<string>customLocalStorage.getItem(Local?.names?.oidcUrls)) ||
      JSON.parse(<string>customLocalStorage.getItem(Local?.oldNames?.oidcUrls))
    );
  }

  static clearOidcUrls() {
    customLocalStorage.removeItem(Local?.names?.oidcUrls);
    customLocalStorage.removeItem(Local?.oldNames?.oidcUrls);
  }

  static saveUserInfo = (info) => {
    customLocalStorage.setItem(Local?.names?.userInfo, JSON.stringify(info));
  };

  static loadUserInfo() {
    return (
      JSON.parse(<string>customLocalStorage.getItem(Local?.names?.userInfo)) ||
      JSON.parse(<string>customLocalStorage.getItem(Local?.oldNames?.userInfo))
    );
  }

  static clearUserInfo() {
    customLocalStorage.removeItem(Local?.names?.userInfo);
    customLocalStorage.removeItem(Local?.oldNames?.userInfo);
  }

  static saveToken = (token) => {
    cleanUrl();
    Auth.clearOidcAuthData();

    if (isDefined(token?.id_token)) {
      customLocalStorage.setItem(Local?.names?.oidcIdToken, token?.id_token);
    }

    if (isDefined(token?.access_token)) {
      customLocalStorage.setItem(Local?.names?.oidcAccessToken, token?.access_token);
    }

    if (isDefined(token?.refresh_token)) {
      customLocalStorage.setItem(Local?.names?.oidcRefreshToken, token?.refresh_token);
    }
  };

  static clearToken() {
    customLocalStorage.removeItem(Local?.names?.oidcIdToken);
    customLocalStorage.removeItem(Local?.names?.oidcAccessToken);
    customLocalStorage.removeItem(Local?.names?.oidcRefreshToken);
    customLocalStorage.removeItem(Local?.names?.oidcPkceCodeVerifier);

    customLocalStorage.removeItem(Local?.oldNames?.oidcIdToken);
    customLocalStorage.removeItem(Local?.oldNames?.oidcAccessToken);
    customLocalStorage.removeItem(Local?.oldNames?.oidcRefreshToken);
    customLocalStorage.removeItem(Local?.oldNames?.oidcPkceCodeVerifier);
  }

  static loadToken() {
    return {
      id_token:
        isDefined(customLocalStorage.getItem(Local?.names?.oidcIdToken)) ||
        isDefined(customLocalStorage.getItem(Local?.oldNames?.oidcIdToken))
          ? customLocalStorage.getItem(Local?.names?.oidcIdToken) ||
            customLocalStorage.getItem(Local?.oldNames?.oidcIdToken)
          : undefined,
      access_token:
        isDefined(customLocalStorage.getItem(Local?.names?.oidcAccessToken)) ||
        isDefined(customLocalStorage.getItem(Local?.oldNames?.oidcAccessToken))
          ? customLocalStorage.getItem(Local?.names?.oidcAccessToken) ||
            customLocalStorage.getItem(Local?.oldNames?.oidcAccessToken)
          : undefined,
      refresh_token:
        isDefined(customLocalStorage.getItem(Local?.names?.oidcRefreshToken)) ||
        isDefined(customLocalStorage.getItem(Local?.oldNames?.oidcRefreshToken))
          ? customLocalStorage.getItem(Local?.names?.oidcRefreshToken) ||
            customLocalStorage.getItem(Local?.oldNames?.oidcRefreshToken)
          : undefined,
    };
  }

  static clearAll() {
    Auth.clearOidcAuthData();
    Auth.clearToken();
  }

  static containsOidcAuthData() {
    return Auth.loadOidcAuthData() !== null;
  }

  static retry = Object.create({
    load: () => {
      const d = customLocalStorage.getItem(Local.names.oidcRetry);
      return isDefined(d) ? _parse(d) : 0;
    },
    save: (value: number) => customLocalStorage.setItem(Local.names.oidcRetry, String(value)),
    reset: () => customLocalStorage.setItem(Local.names.oidcRetry, '0'),
  });
}

const generateClientUuid = (charSize = 15) => uuid4().replaceAll('-', '').slice(0, charSize);
