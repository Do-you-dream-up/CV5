import axios from 'axios';
import bowser from 'bowser';
import cookie from 'js-cookie';
import uuid from 'uuid/v4';

import { decode, encode } from './cipher';
import bot from '../bot';


const browser = bowser.getParser(window.navigator.userAgent).parse().parsedResult;


class Dydu {

  constructor() {

    this.cookies = {
      client: 'dydu.client.id',
      context: 'dydu.context.id',
    };

    this.alreadyCame = !!this.clientId;
    this.browser = `${browser.browser.name} ${browser.browser.version}`;
    this.os = `${browser.os.name} ${browser.os.versionName || browser.os.version}`;
  }

  get clientId() {
    const clientId = cookie.get(this.cookies.client);
    if (clientId !== undefined) {
      return decode(clientId);
    }
    else {
      this.clientId = uuid();
      return this.clientId;
    }
  }

  set clientId(value) {
    if (value !== undefined) {
      cookie.set(this.cookies.client, encode(value), {expires: 365});
    }
  }

  get contextId() {
    const contextId = cookie.get(this.cookies.context);
    return contextId !== undefined ? decode(contextId) : undefined;
  }

  set contextId(value) {
    if (value !== undefined) {
      cookie.set(this.cookies.context, encode(value), {expires: 1 / 24 / 60 * 10});
    }
  }

  emit(data) {
    data.parameters = encode(data.parameters);
    const path = `https:${bot.server}/servlet/chatHttp?data=${JSON.stringify(data)}`;
    return axios.get(path).then(response => {
      if (response.data && response.data.values) {
        response.data.values = decode(response.data.values);
        this.contextId = response.data.values.contextId;
      }
      return response.data;
    });
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
        clientId: this.clientId,
        contextId: this.contextId,
        language: 'en',
        qualificationMode: true,
        solutionUsed: 'ASSISTANT',
        timestamp: new Date().getTime(),
      },
      type: type,
    };
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
