import cookie from 'js-cookie';


/**
 * Small wrapper featuring a getter and a setter for browser cookies.
 */
export default class Cookie {

  static cookies = {
    banner: 'dydu.banner',
    client: 'dydu.client.id',
    context: 'dydu.context.id',
    onboarding: 'dydu.onboarding',
    open: 'dydu.open',
  };

  static duration = {
    long: {expires: 365},
    short: {expires: 1 / 24 / 60 * 10},
  };

  static get = cookie.getJSON;
  static set = cookie.set;
}
