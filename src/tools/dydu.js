import axios from 'axios';
import bowser from 'bowser';
import qs from 'qs';
import uuid from 'uuid/v4';

import { decode, encode } from './cipher';
import Cookie from './cookie';
import bot from '../bot';


const api = axios.create({
  baseURL: `https:${bot.server}/servlet/api/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
});
const browser = bowser.getParser(window.navigator.userAgent).parse().parsedResult;


class Dydu {

  clientId = this.getClientId();

  constructor() {
    this.alreadyCame = !!this.clientId;
    this.browser = `${browser.browser.name} ${browser.browser.version}`;
    this.os = `${browser.os.name} ${browser.os.versionName || browser.os.version}`;
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

  emit(verb, path, data) {
    return verb(path, data).then(({ data={} }) => {
      data.values = decode(data.values);
      this.setContextId(data.values.contextId);
      return data.values;
    });
  }

  history() {
    const history = new Promise(resolve => {
      const contextId = this.getContextId();
      if (contextId) {
        const data = qs.stringify({contextUuid: contextId});
        const path = `chat/history/${bot.id}/`;
        resolve(this.emit(api.post, path, data));
      }
    });
    return history;
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
    const data = qs.stringify({
      language: 'en',
      userInput: text,
      ...(options && {extraParameters: options}),
    });
    const contextId = this.getContextId();
    const path = `chat/talk/${bot.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(api.post, path, data);
  }
}


export default new Dydu();
