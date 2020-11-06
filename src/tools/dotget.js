/**
 * Deep-get from an object according to a dotted path.
 *
 * @param {Object} data - Data to get value from.
 * @param {string} path - Path to get the value.
 * @param {string} [separator='.'] - Separator.
 * @returns {*} The queried value.
 */
export default (data = {}, path = '', separator = '.') => (
  path.split(separator).reduce((accumulator, it) => (
    accumulator && Object.prototype.hasOwnProperty.call(accumulator, it) ? accumulator[it] : undefined
  ), data)
);
