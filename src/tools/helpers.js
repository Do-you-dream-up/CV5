import { VAR_TYPE } from './constants';

export const isDefined = (val) => val !== null && typeof val !== 'undefined';

export const toFormUrlEncoded = (data) => {
  const mkAffectationStr = (key, value) => {
    if (!isDefined(value) || isEmptyString(value)) value = null;
    return `${key}=${value}`;
  };
  return Object.keys(data).reduce((resultStr, key) => {
    if (resultStr.length > 0) return resultStr + '&' + mkAffectationStr(key, data[key]);
    return mkAffectationStr(key, data[key]);
  }, '');
};

export const b64dAllFields = (obj = {}) => {
  if (isOfType(obj, VAR_TYPE.object)) {
    return Object.keys(obj).reduce((resultObj, fieldName) => {
      const val = obj[fieldName];
      if (isDefined(val)) {
        if (isOfType(val, VAR_TYPE.string)) {
          resultObj[fieldName] = b64decode(val);
        } else if (isOfType(val, VAR_TYPE.object)) {
          resultObj[fieldName] = b64dAllFields(val);
        } else if (isOfType(val, VAR_TYPE.array)) {
          resultObj[fieldName] = [];
          for (let i = 0; i < val.length; i++) {
            resultObj[fieldName][i] = b64dAllFields(val[i]);
          }
        } else {
          resultObj[fieldName] = val;
        }
      }

      return resultObj;
    }, {});
  } else if (isOfType(obj, VAR_TYPE.string)) {
    return b64decode(obj);
  }

  return obj;
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

export const isValidUrl = (string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i',
  );

  return pattern.test(string);
};

export const isOfTypeBoolean = (v) => Object.prototype.toString.call(v) === '[object Boolean]';
export const isOfTypeString = (v) => Object.prototype.toString.call(v) === '[object String]';
export const isOfTypeArray = (v) => Object.prototype.toString.call(v) === '[object Array]';
export const isOfTypeObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
export const isOfTypeFunction = (v) => Object.prototype.toString.call(v) === '[object Function]';
export const isOfTypeNumber = (v) => Object.prototype.toString.call(v) === '[object Number]';

export const isPositiveNumber = (v) => isOfTypeNumber(v) && v > 0;

// aliases
export const isFunction = isOfTypeFunction;
export const isBoolean = isOfTypeBoolean;

export const isString = isOfTypeString;
export const isEmptyString = (d) => isString(d) && d.length === 0;

export const isNumber = (d) => Object.prototype.toString.call(d) === '[object Number]';
export const isArray = (d) => Object.prototype.toString.call(d) === '[object Array]';
export const isEmptyArray = (d) => isArray(d) && d.length === 0;

export const isObject = (d) => Object.prototype.toString.call(d) === '[object Object]';
export const isEmptyObject = (d) => isObject(d) && Object.keys(d).length <= 0;

export const isOfType = (val, type) => {
  if (!isDefined(VAR_TYPE[type])) throw new Error('unknown type: type ' + type + ' is not in contant VAR_TYPE');
  switch (type) {
    case VAR_TYPE.string:
      return isOfTypeString(val);
    case VAR_TYPE.array:
      return isOfTypeArray(val);
    case VAR_TYPE.object:
      return isOfTypeObject(val);
    case VAR_TYPE.number:
      return isOfTypeNumber(val);
  }
};

export const extractDomainFromUrl = (url) => url.replace(/http[s]?:\/\//, '').split('/')[0];

export const _stringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return data;
  }
};

export const _parse = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

export const objectExtractFields = (obj, fieldList) =>
  fieldList.reduce((resultMap, fieldName) => {
    resultMap[fieldName] = obj[fieldName];
    return resultMap;
  }, {});

export const objectContainFields = (obj, fieldList = []) => {
  const objFieldList = Object.keys(obj);
  return fieldList.filter((f) => objFieldList.includes(f)).length === fieldList.length;
};

export const compareObject = (obj1, obj2) => {
  const objFieldList = Object.keys(obj1);
  if (!objectContainFields(obj2, objFieldList)) return false;
  return _stringify(Object.values(obj1)) === _stringify(Object.values(obj2));
};

export const secondsToMs = (s) => {
  if (!isOfTypeNumber(s)) return 5000;

  if (s >= 0) {
    return s * 1000;
  } else {
    throw new Error('Parameter have to be bigger or equal than 0');
  }
};

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

export const b64encodeObject = (o) => {
  const res = Object.keys(o).reduce((resultMap, key) => {
    const value = o[key];
    resultMap[key] = isString(value) ? b64encode(value) : isObject(value) ? b64encodeObject(value) : value;

    return resultMap;
  }, {});
  return res;
};

export const b64decodeObject = (o) => {
  const res = Object.keys(o).reduce((resultMap, key) => {
    const value = o[key];
    resultMap[key] = isString(value) ? b64decode(value) : isObject(value) ? b64decodeObject(value) : value;

    return resultMap;
  }, {});
  return res;
};

export const recursiveBase64EncodeString = (obj) => {
  return _recursiveBase64EncodeString(obj, Object.keys(obj), {});
};
export const recursiveBase64DecodeString = (obj) => {
  return _recursiveBase64DecodeString(obj, Object.keys(obj), {});
};

export const _recursiveBase64DecodeString = (o, keylist, res = {}) => {
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

const _recursiveBase64EncodeString = (o, keylist, res = {}) => {
  if (keylist.length === 0) return res;

  const key = keylist.pop();
  let value = o[key];

  if (isOfTypeString(value)) {
    try {
      res[key] = value.toBase64();
    } catch (e) {
      // Exception: malformed URI
      res[key] = value;
    }
  } else if (isOfTypeObject(value)) res[key] = _recursiveBase64EncodeString(value, Object.keys(value), res[key]);
  else res[key] = value;

  return _recursiveBase64EncodeString(o, keylist, res);
};

export const asset = (name) => {
  if (name.includes('base64')) {
    return name;
  }
  return `${process.env.PUBLIC_URL}/assets/${name}`;
};

export const hasProperty = (o, propertyName) => {
  return Object.hasOwnProperty.call(o, propertyName);
};

export const numberOfDayInMs = (count = 1) => {
  if (count >= 0) {
    return count * 24 * 60 * 60 * 1000;
  } else {
    throw new Error('Parameter have to be bigger or equal than 0');
  }
};

export const strContains = (str = '', substr = '') => str.indexOf(substr) > -1;

export const getChatboxWidth = (chatboxRef) => {
  if (!isDefined(chatboxRef)) chatboxRef = document.getElementById('dydu-root');
  if (!isDefined(chatboxRef)) return 0;
  const { left, right } = chatboxRef.getBoundingClientRect();
  return Math.abs(right - left);
};

export const getChatboxWidthTime = (chatboxRef = null, time = 1, maxWidthPx = 850) => {
  const error = ![isDefined, isNumber, isPositiveNumber].every((fn) => fn(time));
  if (error) throw new Error('getChatboxWidthTime: parameter error', time);
  return getMinValue(getChatboxWidth(chatboxRef) * time, maxWidthPx);
};

const getMinValue = (a, b) => (a < b ? a : b);

export const decodeHtml = (html) => {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const escapeHTML = (html) => {
  return isString(html) ? html.replace(/</g, '&lt;').replace(/>/g, '&gt;') : html;
};

export const trimSlashes = (s) => removeEndingSlash(removeStartingSlash(s));

export const removeStartingSlash = (s) => {
  const isValid = [isDefined, isString].every((f) => f(s));
  if (!isValid) {
    console.error('While executing removeStartingSlash(): parameter must be a string');
    return s;
  }

  if (isEmptyString(s)) return s;

  const slashTag = '/';
  const doesStartsWithSlash = s.startsWith(slashTag);
  const rmSlashAtStartString = (s) => s.slice(1);
  return !doesStartsWithSlash ? s : removeStartingSlash(rmSlashAtStartString(s));
};

export const removeEndingSlash = (s) => {
  const isValid = [isDefined, isString].every((f) => f(s));
  if (!isValid) {
    console.error('While executing removeEndingSlash(): parameter must be a string');
    return s;
  }

  if (isEmptyString(s)) return s;

  const slashTag = '/';
  const doesEndsWithSlash = s.endsWith(slashTag);
  const rmSlashAtEndString = (s) => s.slice(0, s.length - 1);
  return !doesEndsWithSlash ? s : removeEndingSlash(rmSlashAtEndString(s));
};

export const isImageUrl = (url) => {
  if (!isString(url)) return false;
  return strContainsOneOfList(url, ['png', 'jpg', 'svg']);
};

const isArrayOfString = (list) => {
  if (!isArray(list)) return false;
  return list.every(isString);
};

export const strContainsOneOfList = (str, testList = []) => {
  if (!isArrayOfString(testList)) testList = [];
  return testList.some((strItem) => strContains(str, strItem));
};

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key])
          Object.assign(target, {
            [key]: {},
          });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key],
        });
      }
    }
  }
  return mergeDeep(target, ...sources);
};

export const objectToQueryParam = (o) => {
  return Object.keys(o).reduce((resultString, field, index) => {
    if (index !== 0) resultString += '&';
    resultString += `${field}=${o[field]}`;
    return resultString;
  }, '');
};

export const documentCreateElement = (htmlTag, attibutesOptions) => {
  const element = document.createElement(htmlTag);
  return Object.keys(attibutesOptions).reduce((node, key) => {
    node.setAttribute(key, attibutesOptions[key]);
    return node;
  }, element);
};

export const htmlToJsonForSendUploadFile = (html) => {
  const startIndex = html.indexOf('{');
  const endIndex = html.lastIndexOf('}');
  const jsonText = html.substring(startIndex, endIndex + 1);

  let correctedJsonText = jsonText;
  // remplacer les simple quotes par des doubles quotes la valeur de la clé api
  correctedJsonText = correctedJsonText.replace(/api:'(.*?)'/g, 'api:"$1"');
  // Ajouter des doubles quotes autour de la clé api
  correctedJsonText = correctedJsonText.replace(/api:/g, '"api":');
  // Ajouter des doubles quotes autour de la clé params
  correctedJsonText = correctedJsonText.replace(/params:/g, '"params":');

  return JSON.parse(correctedJsonText);
};
