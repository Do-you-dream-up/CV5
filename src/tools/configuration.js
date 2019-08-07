import configuration from '../configuration';
import theme from '../styles/theme';


/**
 * Helper class to find values in a JSON configuration file.
 */
export default class Configuration {

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
}
