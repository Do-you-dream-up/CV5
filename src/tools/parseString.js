/**
 * Parse string if it is stringified
 */
export const parseString = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};
