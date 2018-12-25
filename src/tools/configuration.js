import configuration from '../configuration';


class Configuration {

  static get(key, fallback) {
    return key.split('.').reduce((accumulator, it) => accumulator[it], configuration);
  }
}


export default Configuration;
