/**
 * Sanitize the provided HTML string.
 *
 * @param {string} html - HTML string to sanitize.
 * @returns {string} The sanitized string.
 */
export default html => {
  const element = document.createElement('div');
  element.innerHTML = html || '';
  return element.innerHTML;
};
