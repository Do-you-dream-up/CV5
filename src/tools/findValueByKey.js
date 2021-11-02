/**
 * Find value of a key in a deep nested object
 *
 * @param {Object} obj - Object.
 * @param {String} keyToFind - Key you are looking for
 * @returns {Array} All corresponding values
 */
export const findValueByKey = (obj, keyToFind) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === 'object'
        ? acc.concat(findValueByKey(value, keyToFind))
        : acc,
    [],
  );
};
