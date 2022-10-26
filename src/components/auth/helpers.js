import Storage from './Storage';
import { encode as base64encode } from 'base64-arraybuffer';

const getRedirectUri = () => window.location.origin + window.location.pathname;

export const isDefined = (d) => d !== null && typeof d !== 'undefined';

export const generateUID = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
};

export const objectToQueryParam = (o) => {
  return Object.keys(o).reduce((resultString, field, index) => {
    if (index !== 0) resultString += '&';
    resultString += `${field}=${o[field]}`;
    return resultString;
  }, '');
};

export const extractObjectFields = (o, fieldList) => {
  return Object.keys(o).reduce((resultObject, field) => {
    if (fieldList.includes(field)) resultObject[field] = o[field];
    return resultObject;
  }, {});
};

export const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('_');

export const snakeCaseFields = (o) => {
  return Object.keys(o).reduce((resultObject, field) => {
    resultObject[toSnakeCase(field)] = o[field];
    return resultObject;
  }, {});
};

const strContains = (s, sub) => s.indexOf(sub) >= 0;

export const currentLocationContainsError = () => strContains(window.location.search, 'error=');

export const currentLocationContainsCodeParamater = () => strContains(window.location.search, 'code=');

const createPkce = (configuration = { redirectUri: null }) => {
  const { redirectUri } = configuration;
  const state = generateUID();
  const pkce = {
    state,
    redirectUri: redirectUri || getRedirectUri(),
    codeVerifier: createCodeVerifier(),
  };
  Storage.savePkce(pkce);
  console.log('createPkce()', JSON.stringify(pkce));
  return pkce;
};

export const getPkce = (configuration) => Storage.loadPkce() || createPkce(configuration);

export const cleanUrl = () => {};

export const createCodeVerifier = () => {
  const a = new Uint32Array(4); // we want 4 32bit values
  return Array.from(window.crypto.getRandomValues(a))
    .map((i) => i.toString(16))
    .join('-');
};

export const hash = (string) => {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });
};

export const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

export const isString = (s) => Object.prototype.toString.call(s) === '[object String]';

export const isArray = (s) => Object.prototype.toString.call(s) === '[object Array]';

export const extractParamFromUrl = (optionalName = null) => {
  const url = window.location.toString();
  if (!strContains(url, '?')) return {};

  // extract a single parameter by name
  if (isString(optionalName)) {
    const paramIndex = url.indexOf(`${optionalName}=`);
    if (paramIndex <= 0) return null;
    const paramString = url.substring(paramIndex).split('&')[0];
    const valueIdx = 1;
    return paramString.split('=')[valueIdx];
  }

  // extract a given list of param in a object
  if (isArray(optionalName)) {
    const paramNameList = optionalName;
    return paramNameList.reduce((resultObj, paramName) => {
      resultObj[paramName] = extractParamFromUrl(paramName);
      return resultObj;
    }, {});
  }

  // extract all parameters in a object result
  const params = url.split('?')[1];
  return params.split('&').reduce((objResult, pair) => {
    const [name, value] = pair.split('=');
    objResult[name] = value;
    return objResult;
  }, {});
};

export const checkProviderStateMatchWithGenerated = () => {
  const { state: generated } = getPkce();
  const { state: fromProvider } = extractParamFromUrl();
  return generated === fromProvider;
};

export async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const isEmptyObject = (o) => isObject(o) && Object.keys(o).length <= 0;

export const responseToJsonOrThrowError = (r, caller) => {
  if (!r.ok) {
    console.group('ERROR from ' + caller);
    console.log('response raw', r);
    console.log('response header', r.headers);
    console.log('response status', r.status, r.statusText);
    console.log('response body', r.body);
    console.log('response body resolve', r.body.getReader().read().then(console.log));
    console.groupEnd('ERROR from ' + caller);
    throw new Error('(ERR) response', r);
  }
  return r.json();
};

export const removeQueryFromUri = (url) => {
  const path = url.split('?')[0];
  if (strContains(path, '&')) {
    const idx = path.index('&');
    return path.substring(0, idx);
  }
  return path;
};

export async function generateCodeChallenge(codeVerifier) {
  /*
  applying https://www.rfc-editor.org/rfc/rfc7636#page-18
   */
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64Digest = base64encode(digest);
  // you can extract this replacing code to a function
  return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
