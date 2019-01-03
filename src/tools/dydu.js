import axios from 'axios';
import bowser from 'bowser';
import uuid from 'uuid/v4';

import { decode, encode } from './cipher';
import Cookie from './cookie';
import bot from '../bot';


const browser = bowser.getParser(window.navigator.userAgent).parse().parsedResult;


class Dydu {

  clientId = this.getClientId();

  constructor() {
    this.alreadyCame = !!this.clientId;
    this.browser = `${browser.browser.name} ${browser.browser.version}`;
    this.os = `${browser.os.name} ${browser.os.versionName || browser.os.version}`;
  }

  emit(data) {
    data.parameters = encode(data.parameters);
    const path = `https:${bot.server}/servlet/chatHttp?data=${JSON.stringify(data)}`;
    return axios.get(path).then(response => {
      if (response.data && response.data.values) {
        response.data.values = decode(response.data.values);
        this.setContextId(response.data.values.contextId);
      }
      return response.data;
    });
  }

  getClientId() {
    const clientId = Cookie.get(Cookie.cookies.client);
    if (clientId !== undefined) {
      return decode(clientId);
    }
    else {
      this.setClientId(uuid());
      return this.clientId;
    }
  }

  getContextId() {
    const contextId = Cookie.get(Cookie.cookies.context);
    return contextId !== undefined ? decode(contextId) : undefined;
  }

  history() {
    const data = this.makeMessage('history');
    data.parameters = {
      ...data.parameters,
      useServerCookieForContext: false,
    };
    return this.emit(data);
  }

  makeMessage(type) {
    return {
      parameters: {
        botId: bot.id,
        clientId: this.getClientId(),
        contextId: this.getContextId(),
        language: 'en',
        qualificationMode: true,
        solutionUsed: 'ASSISTANT',
        timestamp: new Date().getTime(),
      },
      type: type,
    };
  }

  setClientId(value) {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.client, encode(value), Cookie.duration.long);
    }
  }

  setContextId(value) {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.context, encode(value), Cookie.duration.short);
    }
  }

  talk(text, options) {
    const data = this.makeMessage('talk');
    data.parameters = {
      ...data.parameters,
      browser: this.browser,
      os: this.os,
      userUrl: window.location.href,
      contextType: 'Web',
      disableLanguageDetection: true,
      mode: 'Synchron',
      alreadyCame: this.alreadyCame,
      userInput: text,
      ...(options && {extraParameters: options}),
    };
    return this.emit(data);
  }
}

export default new Dydu();
