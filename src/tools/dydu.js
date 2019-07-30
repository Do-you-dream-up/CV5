import axios from 'axios';
import debounce from 'debounce-promise';
import qs from 'qs';
import { decode, encode } from './cipher';
import Cookie from './cookie';
import getUrlParameters from './get-url-parameters';
import bot from '../bot';


const BOT = Object.assign({}, bot, (({ bot:id, server }) => ({
  ...id && {id},
  ...server && {server},
}))(getUrlParameters()));


const API = axios.create({
  baseURL: `https://${BOT.server}/servlet/api/`,
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

  emit = debounce((verb, path, data) => verb(path, data).then(({ data={} }) => {
    if (data.hasOwnProperty('values')) {
      data.values = decode(data.values);
      this.setContextId(data.values.contextId);
      return data.values;
    }
    return data;
  }), 100, {leading: true});

  history = () => new Promise(resolve => {
    const contextId = this.getContextId();
    if (contextId) {
      const data = qs.stringify({contextUuid: contextId});
      const path = `chat/history/${BOT.id}/`;
      resolve(this.emit(API.post, path, data));
    }
  });

  setContextId = value => {
    if (value !== undefined) {
      Cookie.set(Cookie.cookies.context, encode(value), Cookie.duration.short);
    }
  };

  suggest = text => {
    const data = qs.stringify({language: 'en', search: text});
    const path = `chat/search/${BOT.id}/`;
    return this.emit(API.post, path, data);
  };

  talk = (text, options) => {
    const data = qs.stringify({
      language: 'en',
      userInput: text,
      ...(options && {extraParameters: options}),
    });
    const contextId = this.getContextId();
    const path = `chat/talk/${BOT.id}/${contextId ? `${contextId}/` : ''}`;
    return this.emit(API.post, path, data);
  };
}


export default new Dydu();
