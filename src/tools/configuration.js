import configuration from '../configuration';


class Configuration {

  static get(key, fallback) {
    if (!key) {
      return configuration;
    }
    let result;
    try {
      result = key.split('.').reduce((accumulator, it) => accumulator[it], configuration);
    }
    catch {
      result = fallback;
    }
    return result === undefined ? fallback : result;
  }
}


export default Configuration;
