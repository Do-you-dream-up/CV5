import { VAR_TYPE } from './constants';

export const isDefined = (val) => val !== null && typeof val !== 'undefined';

export const isEmptyArray = (variable) => Array.isArray(variable) && variable.length <= 0;

export const toFormUrlEncoded = (data) => {
  const mkAffectationStr = (key, value) => `${key}=${value}`;
  return Object.keys(data).reduce((resultStr, key) => {
    if (resultStr.length > 0) return resultStr + '&' + mkAffectationStr(key, data[key]);
    return mkAffectationStr(key, data[key]);
  }, '');
};

export const b64dFields = (obj = {}, encodedNameFieldList) => {
  return Object.keys(obj).reduce((resultObj, fieldName) => {
    if (!encodedNameFieldList.includes(fieldName)) {
      resultObj[fieldName] = obj[fieldName];
      return resultObj;
    }

    const val = obj[fieldName];
    // only treats defined and string value
    if (!isDefined(val) || !isOfType(val, VAR_TYPE.string)) return resultObj;

    resultObj[fieldName] = b64decode(obj[fieldName]);
    return resultObj;
  }, {});
};

export function b64encode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }),
  );
}

export function b64decode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

export const isOfTypeBoolean = (v) => Object.prototype.toString.call(v) === '[object Boolean]';
export const isOfTypeString = (v) => Object.prototype.toString.call(v) === '[object String]';
export const isOfTypeArray = (v) => Object.prototype.toString.call(v) === '[object Array]';
export const isOfTypeObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
export const isOfTypeFunction = (v) => Object.prototype.toString.call(v) === '[object Function]';
export const isOfTypeNumber = (v) => Object.prototype.toString.call(v) === '[object Number]';

export const isPositiveNumber = (v) => isOfTypeNumber(v) && v > 0;

export const isArray = isOfTypeArray;
export const isBoolean = isOfTypeBoolean;

export const isOfType = (val, type) => {
  if (!isDefined(VAR_TYPE[type])) throw new Error('unknown type: type ' + type + ' is not in contant VAR_TYPE');
  switch (type) {
    case VAR_TYPE.string:
      return isOfTypeString(val);
    case VAR_TYPE.array:
      return isOfTypeArray(val);
    case VAR_TYPE.object:
      return isOfTypeObject(val);
    default:
      return;
  }
};

export const extractDomainFromUrl = (url) => url.replace(/http[s]?:\/\//, '').split('/')[0];

export const _stringify = (data) => JSON.stringify(data);
export const _parse = (data) => JSON.parse(data);

export const isEmptyObject = (v) => isOfTypeObject(v) && Object.keys(v).length === 0;

export const isEmptyString = (v) => isOfTypeString(v) && v.length === 0;

export const objectExtractFields = (obj, fieldList) =>
  fieldList.reduce((resultMap, fieldName) => {
    resultMap[fieldName] = obj[fieldName];
    return resultMap;
  }, {});

export const objectContainFields = (obj, fieldList = []) => {
  const objFieldList = Object.keys(obj);
  return fieldList.filter((f) => objFieldList.includes(f)).length === fieldList.length;
};

export const secondsToMs = (s) => s * 1000;

export const browserName = () => {
  let sBrowser;
  const sUsrAg = navigator.userAgent;

  // The order matters here, and this may report false positives for unlisted browsers.

  if (sUsrAg.indexOf('Firefox') > -1) {
    sBrowser = 'Mozilla Firefox';
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
    sBrowser = 'Samsung Internet';
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
  } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
    sBrowser = 'Opera';
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
  } else if (sUsrAg.indexOf('Trident') > -1) {
    sBrowser = 'Microsoft Internet Explorer';
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf('Edge') > -1) {
    sBrowser = 'Microsoft Edge (Legacy)';
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (sUsrAg.indexOf('Edg') > -1) {
    sBrowser = 'Microsoft Edge (Chromium)';
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64
  } else if (sUsrAg.indexOf('Chrome') > -1) {
    sBrowser = 'Google Chrome or Chromium';
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (sUsrAg.indexOf('Safari') > -1) {
    sBrowser = 'Apple Safari';
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    sBrowser = 'unknown';
  }

  return sBrowser;
};

export const osName = () => {
  if (isDefined(navigator.userAgentData)) return navigator.userAgentData.platform;

  let OSName = 'Unknown OS';
  if (navigator.appVersion.indexOf('Win') !== -1) OSName = 'Windows';
  if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
  if (navigator.appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
  if (navigator.appVersion.indexOf('Linux') !== -1) OSName = 'Linux';
  return OSName;
};

export const recursiveBase64DecodeString = (obj) => {
  return _recursiveBase64DecodeString(obj, Object.keys(obj), {});
};

const _recursiveBase64DecodeString = (o, keylist, res = {}) => {
  if (keylist.length === 0) return res;

  const key = keylist.pop();
  let value = o[key];

  if (isOfTypeString(value)) {
    try {
      res[key] = value.fromBase64();
    } catch (e) {
      // Exception: malformed URI
      res[key] = value;
    }
  } else if (isOfTypeObject(value)) res[key] = _recursiveBase64DecodeString(value, Object.keys(value), res[key]);
  else res[key] = value;

  return _recursiveBase64DecodeString(o, keylist, res);
};

export const asset = (name) => `${process.env.PUBLIC_URL}/assets/${name}`;

export const qualification =
  window.DYDU_QUALIFICATION_MODE !== undefined ? window.DYDU_QUALIFICATION_MODE : process.env.QUALIFICATION;

export const hasProperty = (o, propertyName) => {
  return Object.hasOwnProperty.call(o, propertyName);
};
