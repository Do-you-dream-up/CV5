export default () => {
  const parameters = window.location.search.substring(1).split('&');
  return parameters.reduce((accumulator, it) => {
    const [ key, value ] = it.split('=');
    return Object.assign(accumulator, key && {[key]: decodeURIComponent(value || key)});
  }, {});
};
