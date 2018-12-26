import configuration from '../configuration';


class Configuration {

  static get(key, fallback) {
    try {
      return key.split('.').reduce((accumulator, it) => accumulator[it] || fallback, configuration);
    }
    catch {
      return fallback;
    }
  }
}


export default Configuration;
