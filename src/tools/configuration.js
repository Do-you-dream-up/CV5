import configuration from '../configuration';
import axios from 'axios';
import json from './configuration.json';
import theme from '../styles/theme';


/**
 * Helper class to find values in a JSON configuration file.
 */
export default class Configuration {

  constructor() {
    this.configuration = {};
  }

  /**
   * Retrieve the value assiocated to the provided path or fallback when not
   * found. Support dotted paths.
   *
   * @param {string} key - Key to retrieve for.
   * @param {*} fallback - Default value to return.
   * @returns {*} Value found or fallback.
   */
  static get = (key, fallback={}) => {
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
  };

  /**
   * Make styling properties out of the values found in the configuration for
   * any given object or path.
   *
   * @param {Object|string} it - Configuration or path to the configuration.
   * @returns {Object.<string, number|string>} Styling properties.
   */
  static getStyles = it => {
    const data = typeof it === 'string' ? this.get(it, {}) : it;
    return (({background, bottom, height, left, maxHeight, position, right, shadow, top, width}) => ({
      ...(background !== undefined && {backgroundColor: background}),
      ...(bottom !== undefined && {bottom}),
      ...(height !== undefined && {height}),
      ...(left !== undefined && {left}),
      ...(maxHeight !== undefined && {maxHeight}),
      ...(position !== undefined && {position}),
      ...(right !== undefined && {right}),
      ...(shadow !== undefined && theme.shadows && {boxShadow: theme.shadows[~~shadow]}),
      ...(top !== undefined && {top}),
      ...(width !== undefined && {width}),
    }))(data);
  };

  /**
   * Fetch the configuration JSON and save its content.
   *
   * @param {string} [path] - Configuration file path.
   * @returns {Promise}
   */
  initialize = (path='/configuration.json') => {
    this.configuration = JSON.parse(JSON.stringify(json));
    return axios.get(path).then(
      ({ data }) => this.sanitize(data),
      ({ request }) => {
        // eslint-disable-next-line no-console
        console.warn(`Configuration file not found at '${request.responseURL}'.`);
        return this.configuration;
      },
    );
  };

  /**
   * Clean up and ensure a sane structure for the configuration object.
   *
   * @param {Object} [data] - Configuration object to merge with.
   * @returns {Object}
   */
  sanitize = data => {
    const merge = (target, source) => {
      if (target instanceof Object && source instanceof Object) {
        Object.keys(source).forEach(key => {
          const targetValue = target[key];
          const sourceValue = source[key];
          if (targetValue instanceof Object && sourceValue instanceof Object) {
            target[key] = merge(Object.assign({}, targetValue), sourceValue);
          }
          else {
            target[key] = sourceValue;
          }
        });
      }
      return target;
    };
    data = JSON.parse(JSON.stringify(data));
    if (typeof data !== 'object') {
      // eslint-disable-next-line no-console
      console.warn('Invalid configuration file. Fallback to default values.');
    }
    return merge(this.configuration, data);
  };
}
