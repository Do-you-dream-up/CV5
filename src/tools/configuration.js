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

  static getStyles(it, theme = {}) {
    const data = typeof it === 'string' ? this.get(it, {}) : it;
    return (({background, bottom, height, left, position, right, shadow, top, width}) => ({
      ...(background && {backgroundColor: background}),
      ...(bottom && {bottom: typeof bottom === 'string' ? bottom : `${bottom}px`}),
      ...(height && {height}),
      ...(left && {left: typeof left === 'string' ? left : `${left}px`}),
      ...(position && {position}),
      ...(right && {right: typeof right === 'string' ? right : `${right}px`}),
      ...(shadow && {boxShadow: theme.shadows && theme.shadows[~~shadow]}),
      ...(top && {top: typeof top === 'string' ? top : `${top}px`}),
      ...(width && {width}),
    }))(data);
  }
}


export default Configuration;
