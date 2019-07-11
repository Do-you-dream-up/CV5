import axios from 'axios';
import qs from 'qs';
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


class Dydu {

  getContextId = () => {
    const contextId = Cookie.get(Cookie.cookies.context);
    return contextId !== undefined ? decode(contextId) : undefined;
  };

  emit = (verb, path, data) => verb(path, data).then(({ data={} }) => {
    if (data.hasOwnProperty('values')) {
      data.values = decode(data.values);
      this.setContextId(data.values.contextId);
      return data.values;
    }
    return data;
  });

  history = () => new Promise(resolve => {
    const contextId = this.getContextId();
    if (contextId) {
      const data = qs.stringify({contextUuid: contextId});
      const path = `chat/history/${bot.id}/`;
      resolve(this.emit(api.post, path, data));
    }
  });

  setContextId = value => {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.context, encode(value), Cookie.duration.short);
    }
  };

  talk = (text, options) => {
    const data = qs.stringify({
      language: 'en',
      userInput: text,
      ...(options && {extraParameters: options}),
    });
    const contextId = this.getContextId();
    const path = `chat/talk/${bot.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(api.post, path, data);
  };
}


export default new Dydu();
