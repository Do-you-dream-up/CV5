'use strict';

const camelCase = require('lodash.camelcase');
const React = require('react');
const camelCaseAttrMap = require('./camel-case-attribute-names');

function createStyleJsonFromString(styleString) {
  styleString = styleString || '';
  const styles = styleString.split(/;(?!base64)/);
  let singleStyle,
    key,
    value,
    jsonStyles = {};
  for (let i = 0; i < styles.length; ++i) {
    singleStyle = styles[i].split(':');
    if (singleStyle.length > 2) {
      singleStyle[1] = singleStyle.slice(1).join(':');
    }

    key = singleStyle[0];
    value = singleStyle[1];
    if (typeof value === 'string') {
      value = value.trim();
    }

    if (key != null && value != null && key.length > 0 && value.length > 0) {
      key = key.trim();

      // Don't camelCase CSS custom properties
      if (key.indexOf('--') !== 0) {
        key = camelCase(key);
      }

      jsonStyles[key] = value;
    }
  }
  return jsonStyles;
}

// Boolean HTML attributes, copied from https://meiert.com/en/blog/boolean-attributes-of-html/,
// on the form React expects.
const booleanAttrs = [
  'allowFullScreen',
  'allowpaymentrequest',
  'async',
  'autoFocus',
  'autoPlay',
  'checked',
  'controls',
  'default',
  'disabled',
  'formNoValidate',
  'hidden',
  'ismap',
  'itemScope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'noValidate',
  'open',
  'playsinline',
  'readOnly',
  'required',
  'reversed',
  'selected',
  'truespeed',
];

function createElement(node, index, data, children) {
  let elementProps = {
    key: index,
  };
  // The Custom Elements specification explicitly states that;
  // custom element names must contain a hyphen.
  // src: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
  const isCustomElementNode = node.name.includes('-');

  if (node.attribs) {
    elementProps = Object.entries(node.attribs).reduce((result, [key, value]) => {
      // if it's a custom element, we leave its attributes as is
      if (!isCustomElementNode) {
        key = camelCaseAttrMap[key.replace(/[-:]/, '')] || key;
        if (key === 'style') {
          value = createStyleJsonFromString(value);
        } else if (key === 'class') {
          key = 'className';
        } else if (key === 'for') {
          key = 'htmlFor';
        } else if (key === 'viewbox') {
          key = 'viewBox';
        } else if (key === 'fill-rule') {
          key = 'fillRule';
        } else if (key === 'xlink:href') {
          key = 'xlinkHref';
        } else if (key === 'tabindex') {
          key = 'tabIndex';
        } else if (key === 'frameborder') {
          key = 'frameBorder';
        } else if (key === 'allowfullscreen') {
          key = 'allowFullScreen';
        } else if (key === 'href') {
          if ('javascript:void(0)' === value) {
            value = '#';
          }
          if ((value === '#' || value === '\\"#\\"') && node.attribs.class?.contains('reword')) {
            key = 'hrefIgnored';
          }
        } else if (key === 'onclick') {
          key = 'onClick';
          const html = value;
          value = () => {
            executeScript(html);
          };
        } else if (key === 'onkeypress') {
          key = 'onKeyPress';
          const html = value;
          value = (event) => {
            executeScript(html, event);
          };
        } else if (key === 'onkeydown') {
          key = 'onKeyDown';
          const html = value;
          value = (event) => {
            executeScript(html, event);
          };
        }

        if (booleanAttrs.includes(key) && (value || '') === '') {
          value = key;
        }
      }

      result[key] = value;
      return result;
    }, elementProps);
  }

  children = children || [];
  const allChildren = data != null ? [data].concat(children) : children;
  return React.createElement.apply(null, [node.name, elementProps].concat(allChildren));
}

function executeScript(html, event) {
  if (!html) {
    return;
  }
  // html must not look like a function
  html = html.replace('return false;', '').replace('return true;', '').replace('return;', '');
  if (event) {
    // particularly for onKeyDown
    html = html.replace('event.code', event.code);
  }
  try {
    const newScript = document.createElement('script');
    newScript.innerHTML = html;
    const dyduRoot = document.getElementById('dydu-root');
    dyduRoot?.appendChild(newScript);
    dyduRoot?.removeChild(newScript);
  } catch (e) {
    console.log('Error: ' + e);
  }
}

export default createElement;
