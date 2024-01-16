import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize the provided HTML string.
 *
 * authorizedHtmlItems contains all basics html items from mdn doc that aren't already in the default config of sanitized html lib
 *
 * @param {string} html - HTML string to sanitize.
 * @returns {string} The sanitized string.
 */
export default (html) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(authorizedHtmlItems),
    allowedAttributes: false,
  });
};

const authorizedHtmlItems = [
  'img',
  'area',
  'audio',
  'map',
  'track',
  'video',
  'embed',
  'iframe',
  'object',
  'picture',
  'portal',
  'source',
  'svg',
  'math',
  'canvas',
  'noscript',
  'script',
  'del',
  'ins',
  'button',
  'datalist',
  'fieldset',
  'form',
  'input',
  'label',
  'legend',
  'meter',
  'optgroup',
  'option',
  'output',
  'progress',
  'select',
  'textarea',
  'details',
  'dialog',
  'summary',
  'slot',
  'template',
  'body',
  'html',
  'base',
  'head',
  'link',
  'meta',
  'style',
  'title',
];
