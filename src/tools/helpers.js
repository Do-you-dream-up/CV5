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

export const b64dFields = (obj, encodedNameFieldList) => {
  return Object.keys(obj).reduce((resultObj, fieldName) => {
    if (!encodedNameFieldList.includes(fieldName)) {
      resultObj[fieldName] = obj[fieldName];
      return resultObj;
    }

    const val = obj[fieldName];
    // only treats defined and string value
    if (!isDefined(val) || !isOfType(val, VAR_TYPE.string))
      throw new Error('field name : ' + fieldName + ' is not a string, cannot apply base 64 decode');

    resultObj[fieldName] = b64decode(obj[fieldName]);
    return resultObj;
  }, {});
};

export function b64decode(str) {
  return isOfType(str, VAR_TYPE.string) ? decodeURIComponent(escape(window.atob(str))) : str;
}

const isOfTypeString = (v) => typeof v === 'string';

export const isOfType = (val, type) => {
  if (!isDefined(VAR_TYPE[type])) throw new Error('unknown type: type ' + type + ' is not in contant VAR_TYPE');
  switch (type) {
    case VAR_TYPE.string:
      return isOfTypeString(val);
    default:
      return;
  }
};
