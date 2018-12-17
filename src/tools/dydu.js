import axios from 'axios';
import bowser from 'bowser';
import cookie from 'js-cookie';
import uuid from 'uuid/v4';

import { decode, encode } from './cipher';
import bot from '../bot';


const browser = bowser.getParser(window.navigator.userAgent).parse().parsedResult;


class Dydu {

  constructor() {

    window.dydu = window.dydu || {

      api: {
        talk: this.talk.bind(this),
      },

      cookies: {
        client: 'dydu.client.id',
        context: 'dydu.context.id',
      },
    };

    this.alreadyCame = !!this.clientId;
    this.browser = `${browser.browser.name} ${browser.browser.version}`;
    this.os = `${browser.os.name} ${browser.os.versionName || browser.os.version}`;
  }

  get clientId() {
    const clientId = cookie.get(window.dydu.cookies.client);
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
      cookie.set(window.dydu.cookies.client, encode(value), {expires: 365})
    }
  }

  get contextId() {
    const contextId = cookie.get(window.dydu.cookies.context);
    return contextId !== undefined ? decode(contextId) : undefined;
  }

  set contextId(value) {
    if (value !== undefined) {
      cookie.set(window.dydu.cookies.context, encode(value), {expires: 1 / 24 / 60 * 10})
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
      console.log(response.data);
      return response.data;
    });
  }

  makeMessage(type) {
    return {
      parameters: {
        alreadyCame: this.alreadyCame,
        botId: bot.id,
        browser: this.browser,
        clientId: this.clientId,
        contextId: this.contextId,
        contextType: 'Web',
        disableLanguageDetection: true,
        language: 'en',
        mode: 'Synchron',
        os: this.os,
        solutionUsed: 'ASSISTANT',
        timestamp: new Date().getTime(),
        userUrl: window.location.href,
      },
      type: type,
    };
  }

  talk(text, options) {
    const data = this.makeMessage('talk');
    data.parameters = {...data.parameters, ...{userInput: text, ...(options && {extraParameters: options})}}
    return this.emit(data);
  }
}

export default new Dydu();
