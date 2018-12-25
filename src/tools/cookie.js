import cookie from 'js-cookie';


class Cookie {

  static cookies = {
    client: 'dydu.client.id',
    context: 'dydu.context.id',
  };

  static duration = {
    long: {expires: 365},
    short: {expires: 1 / 24 / 60 * 10},
  };

  static get = cookie.getJSON;
  static set = cookie.set;
}


export default Cookie;
