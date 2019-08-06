import configuration from '../configuration';
import theme from '../styles/theme';


export default class Configuration {

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
