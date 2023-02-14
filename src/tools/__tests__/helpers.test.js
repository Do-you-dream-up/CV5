import {
  _parse,
  _stringify,
  asset,
  b64dFields,
  b64decode,
  b64encode,
  b64encodeObject,
  browserName,
  decodeHtml,
  escapeHTML,
  extractDomainFromUrl,
  getChatboxWidth,
  hasProperty,
  isDefined,
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isObject,
  isOfType,
  isOfTypeBoolean,
  isOfTypeFunction,
  isOfTypeNumber,
  isOfTypeString,
  isPositiveNumber,
  numberOfDayInMs,
  objectContainFields,
  objectExtractFields,
  osName,
  secondsToMs,
  strContains,
  toFormUrlEncoded,
} from '../helpers';

import { VAR_TYPE } from '../constants';
import { expect } from '@jest/globals';

describe('helpers', () => {
  describe('isDefined', () => {
    it('should return true when argument is not "null" or "empty" and false otherwise', () => {
      expect(isDefined('')).toEqual(true);
      expect(isDefined('nonEmptyString')).toEqual(true);

      expect(isDefined(1)).toEqual(true);
      expect(isDefined(0)).toEqual(true);
      expect(isDefined(-1)).toEqual(true);

      expect(isDefined({})).toEqual(true);
      expect(isDefined({ field: 'one' })).toEqual(true);

      const _undefined = undefined;
      const _null = null;
      expect(isDefined(_undefined)).toEqual(false);
      expect(isDefined(_null)).toEqual(false);
    });
  });

  describe('isEmptyArray', () => {
    it('should return false when argument is not an empty array', () => {
      const _nonEmptyArr = [1];
      const _nonEmptyArrInstance = new Array([1]);
      expect(isEmptyArray(_nonEmptyArr)).toEqual(false);
      expect(isEmptyArray(_nonEmptyArrInstance)).toEqual(false);
    });
    it('should return true when argument is an emptyArray', () => {
      const _emptyArr = [];
      const _emptyArrInstance = [];
      expect(isEmptyArray(_emptyArr)).toEqual(true);
      expect(isEmptyArray(_emptyArrInstance)).toEqual(true);
    });
    it('should return false when argument is not an emptyArray', () => {
      const _string = 'string';
      const _obj = {};
      const _num = 0;
      const _null = null;
      const _udef = undefined;
      expect(isEmptyArray(_string)).toEqual(false);
      expect(isEmptyArray(_obj)).toEqual(false);
      expect(isEmptyArray(_num)).toEqual(false);
      expect(isEmptyArray(_null)).toEqual(false);
      expect(isEmptyArray(_udef)).toEqual(false);
    });
  });
  describe('toFormUrlEncoded', () => {
    it('should produce an form url encoded string when arg is an object with string typed fields', () => {
      const toBeTransformObj = { field1: 'string1', field2: 'string2' };
      for (let value in toBeTransformObj) {
        expect(typeof value).toEqual('string');
      }
      expect(typeof toFormUrlEncoded(toBeTransformObj)).toEqual('string');
      expect(toFormUrlEncoded(toBeTransformObj).indexOf('&') >= 0).toEqual(true);
      expect(toFormUrlEncoded(toBeTransformObj).indexOf('=') >= 0).toEqual(true);
    });
  });
  describe('b64dFields', () => {
    it('should base64 decode given field list from given object if those fields are all string typed', () => {
      const initialobj = {
        field1: {},
        field2: btoa('bonjour'),
        field3: true,
      };
      const expectedobj = {
        ...initialobj,
        field2: 'bonjour',
      };
      const targetfieldname = 'field2';
      const resultobj = b64dFields(initialobj, [targetfieldname]);
      expect(resultobj[targetfieldname]).toEqual(expectedobj[targetfieldname]);
    });

    it('should not attempt to decode field that is not in the given object', () => {
      const initialObj = {
        field1: {},
        field2: btoa('bonjour'),
        field3: true,
      };
      const expectedObj = initialObj;
      const targetFieldName = 'field4'; // this is not in |initialObj|
      expect(b64dFields(initialObj, [targetFieldName])).toEqual(expectedObj);
    });
  });

  describe('isOfType', () => {
    it('should not throw an error when type parameter is known', () => {
      expect(() => isOfType('string', VAR_TYPE.string)).not.toThrowError();
    });
    it('returns true if the value is of the given type', () => {
      expect(isOfType('Hello World!', 'string')).toBe(true);
      expect(isOfType([1, 2, 3], 'array')).toBe(true);
      expect(isOfType({ name: 'John' }, 'object')).toBe(true);
    });

    it('returns false if the value is not of the given type', () => {
      expect(isOfType(123, 'string')).toBe(false);
      expect(isOfType(null, 'array')).toBe(false);
      expect(isOfType(undefined, 'object')).toBe(false);
    });

    it('throws an error if the given type is not recognized', () => {
      expect(() => isOfType(123, 'invalid')).toThrowError('unknown type: type invalid is not in contant VAR_TYPE');
    });
  });
  describe('b64decode', () => {
    it('should decode when param is of type string', () => {
      const param = btoa('decoded');
      expect(typeof param).toEqual('string');
      expect(b64decode(param)).toEqual('decoded');
    });
  });

  describe('b64encode', () => {
    it('should encode when param is of type string', () => {
      //GIVEN
      const target = 'bonjour';
      const expected = 'Ym9uam91cg==';

      //WHEN
      const result = b64encode(target);

      //THEN
      expect(result).toEqual(expected);
    });
  });

  describe('isOfTypeString', () => {
    it('should return true when parameter is of type string', () => {
      //GIVEN
      const target = 'bonjour';

      //WHEN
      const result = isOfTypeString(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when parameter is NOT type of string', () => {
      //GIVEN
      const target = 5;

      //WHEN
      const result = isOfTypeString(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isEmptyString', () => {
    it('should return true when parameter is of type string and is empty', () => {
      //GIVEN
      const target = '';

      //WHEN
      const result = isEmptyString(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when parameter is of type string and is NOT empty', () => {
      //GIVEN
      const target = 'bonjour';

      //WHEN
      const result = isEmptyString(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isEmptyObject', () => {
    it('should return true when param is type of object and is empty', () => {
      //GIVEN
      const target = {};

      //WHEN
      const result = isEmptyObject(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is type of object and is NOT empty', () => {
      //GIVEN
      const target = { dog: 'jack russel', name: 'Havane' };

      //WHEN
      const result = isEmptyObject(target);

      //THEN
      expect(result).toEqual(false);
    });
  });
  isEmptyObject;

  describe('isOfTypeBoolean', () => {
    it('should return true when param is type of boolean', () => {
      //GIVEN
      const target = false;

      //WHEN
      const result = isOfTypeBoolean(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is NOT type of boolean', () => {
      //GIVEN
      const target = 'false';

      //WHEN
      const result = isOfTypeBoolean(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isObject', () => {
    it('should return true when param is type of object', () => {
      //GIVEN
      const target = { dog: 'jack russel', name: 'Havane' };

      //WHEN
      const result = isObject(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is NOT type of object', () => {
      //GIVEN
      const target = 'bonjour';

      //WHEN
      const result = isObject(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isOfTypeFunction', () => {
    it('should return true when param is type of function', () => {
      //GIVEN
      const target = () => {};

      //WHEN
      const result = isOfTypeFunction(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is NOT type of function', () => {
      //GIVEN
      const target = 'bonjour';

      //WHEN
      const result = isOfTypeFunction(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isOfTypeNumber', () => {
    it('should return true when param is type of number', () => {
      //GIVEN
      const target = 8;

      //WHEN
      const result = isOfTypeNumber(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is NOT type of number', () => {
      //GIVEN
      const target = '8';

      //WHEN
      const result = isOfTypeNumber(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('should return true when param is a number greater than 0', () => {
      //GIVEN
      const target = 8;

      //WHEN
      const result = isPositiveNumber(target);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param is a number NOT greater than 0', () => {
      //GIVEN
      const target = 0;

      //WHEN
      const result = isPositiveNumber(target);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('strContains', () => {
    it('should return true when param string contains the substring param', () => {
      //GIVEN
      const str = 'reactisverygood';
      const substr = 'isveryg';

      //WHEN
      const result = strContains(str, substr);

      //THEN
      expect(result).toEqual(true);
    });

    it('should return false when param string NOT contains the substring param', () => {
      //GIVEN
      const str = 'reactisverygood';
      const substr = 'chamallow';

      //WHEN
      const result = strContains(str, substr);

      //THEN
      expect(result).toEqual(false);
    });
  });

  describe('_stringify', () => {
    it('should converts a JavaScript value in param to a JSON string', () => {
      //GIVEN
      const jsValue = [new Number(3), new String('false'), new Boolean(false)];

      //WHEN
      const result = _stringify(jsValue);

      //THEN
      expect(result).toEqual('[3,"false",false]');
    });
  });

  describe('_parse', () => {
    it('should construct the JavaScript value or object described by the string in param', () => {
      //GIVEN
      const str = '{"result":true, "count":42}';

      //WHEN
      const result = _parse(str);

      //THEN
      expect(result).toEqual({ result: true, count: 42 });
    });
  });

  describe('extractDomainFromUrl', () => {
    it('should extract domain from url in param', () => {
      //GIVEN
      const url = 'http://localhost:1234///';

      //WHEN
      const result = extractDomainFromUrl(url);

      //THEN
      expect(result).toEqual('localhost:1234');
    });
  });

  describe('secondsToMs', () => {
    it('should converts param seconds in milliseconds', () => {
      //GIVEN
      const sec = 25;

      //WHEN
      const result = secondsToMs(sec);

      //THEN
      expect(result).toEqual(25000);
    });

    it('should return 5000 when param is not a number', () => {
      //GIVEN
      const sec = {};

      //WHEN
      const result = secondsToMs(sec);

      //THEN
      expect(result).toEqual(5000);
    });

    it('throw error when param is smaller than 0', () => {
      function testNegativeSecondsToMs() {
        secondsToMs(-3);
      }
      expect(testNegativeSecondsToMs).toThrow(new Error('Parameter have to be bigger or equal than 0'));
    });
  });

  describe('browserName', () => {
    it('should return the correct browser name for a Mozilla Firefox user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
        configurable: true,
      });

      expect(browserName()).toEqual('Mozilla Firefox');
    });

    it('should return the correct browser name for a Samsung Internet user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36',
        configurable: true,
      });

      expect(browserName()).toEqual('Samsung Internet');
    });

    it('should return the correct browser name for a Opera user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106',
        configurable: true,
      });

      expect(browserName()).toEqual('Opera');
    });

    it('should return the correct browser name for a Microsoft Internet Explorer user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko',
        configurable: true,
      });

      expect(browserName()).toEqual('Microsoft Internet Explorer');
    });
    it('should return the correct browser name for a Microsoft Edge (Legacy) user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
        configurable: true,
      });

      expect(browserName()).toEqual('Microsoft Edge (Legacy)');
    });
    it('should return the correct browser name for a Microsoft Edge (Chromium) user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
        configurable: true,
      });

      expect(browserName()).toEqual('Microsoft Edge (Chromium)');
    });

    it('should return the correct browser name for a Google Chrome or Chromium user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36',
        configurable: true,
      });

      expect(browserName()).toEqual('Google Chrome or Chromium');
    });

    it('should return the correct browser name for a Apple Safari useragent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306',
        configurable: true,
      });

      expect(browserName()).toEqual('Apple Safari');
    });

    it('should return unknomn if browser doesnt exist', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'coucou',
        configurable: true,
      });

      expect(browserName()).toEqual('unknown');
    });
  });

  describe('escapeHTML', () => {
    it('escapes HTML tags in the input string', () => {
      const html = '<p>Hello, world!</p>';
      const expectedResult = '&lt;p&gt;Hello, world!&lt;/p&gt;';
      const result = escapeHTML(html);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('decodeHtml', () => {
    it('decodes HTML-encoded characters in the input string', () => {
      const html = '&lt;p&gt;Hello, world!&lt;/p&gt;';
      const expectedResult = '<p>Hello, world!</p>';

      document.createElement = jest.fn().mockImplementation(() => {
        return {
          innerHTML: html,
          value: expectedResult,
        };
      });
      const result = decodeHtml(html);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getChatboxWidth', () => {
    it('calculates the width of the chatbox element', () => {
      document.getElementById = jest.fn().mockImplementation(() => {
        return {
          getBoundingClientRect: () => ({ left: 0, right: 200 }),
        };
      });

      const expectedResult = 200;

      expect(getChatboxWidth()).toEqual(expectedResult);
    });
  });

  describe('numberOfDayInMs', () => {
    it('calculates the number of days in milliseconds for the given count', () => {
      const count = 2;
      const expectedResult = 172800000;

      expect(numberOfDayInMs(count)).toEqual(expectedResult);
    });
    it('returns zero if the count is zero', () => {
      expect(numberOfDayInMs(0)).toEqual(0);
    });

    it('throws an error if the count is a negative number', () => {
      function testNegativeNumberOfDayInMs() {
        numberOfDayInMs(-1);
      }
      expect(testNegativeNumberOfDayInMs).toThrow(new Error('Parameter have to be bigger or equal than 0'));
    });
  });

  describe('hasProperty', () => {
    it('returns true if the object has the given property', () => {
      const obj = { name: 'John', age: 30 };
      const propertyName = 'name';

      expect(hasProperty(obj, propertyName)).toBe(true);
    });

    it('returns false if the object does not have the given property', () => {
      const obj = { name: 'John', age: 30 };
      const propertyName = 'email';

      expect(hasProperty(obj, propertyName)).toBe(false);
    });
  });

  describe('asset', () => {
    it('returns the correct URL for the given asset name', () => {
      process.env = {
        PUBLIC_URL: '/public',
      };

      const name = 'image.png';
      const expectedResult = '/public/assets/image.png';

      expect(asset(name)).toEqual(expectedResult);
    });

    it('returns the base64 string if the name includes "base64"', () => {
      const name = 'data:image/png;base64,iVBORw0KGg';

      expect(asset(name)).toEqual(name);
    });
  });

  describe('objectExtractFields', () => {
    it('returns an object with the specified fields from the input object', () => {
      const obj = {
        name: 'John',
        age: 30,
        city: 'New York',
      };
      const fieldList = ['name', 'age'];

      const expectedResult = {
        name: 'John',
        age: 30,
      };

      expect(objectExtractFields(obj, fieldList)).toEqual(expectedResult);
    });
  });

  describe('objectContainFields', () => {
    it('returns true if the input object contains all the specified fields', () => {
      const obj = {
        name: 'John',
        age: 30,
        city: 'New York',
      };
      const fieldList = ['name', 'age', 'city'];

      expect(objectContainFields(obj, fieldList)).toBe(true);
    });

    it('returns false if the input object does not contain all the specified fields', () => {
      const obj = {
        name: 'John',
        age: 30,
      };
      const fieldList = ['name', 'age', 'city'];

      expect(objectContainFields(obj, fieldList)).toBe(false);
    });

    it('returns true if the input object contains no fields and the field list is empty', () => {
      const obj = {};
      const fieldList = [];

      expect(objectContainFields(obj, fieldList)).toBe(true);
    });
  });

  describe('osName', () => {
    it('returns "Windows" for user agents that contain "Win"', () => {
      Object.defineProperty(navigator, 'appVersion', {
        value: 'Win',
      });
      expect(osName()).toBe('Windows');
    });
  });

  xdescribe('b64encodeObject', () => {
    it('returns an object with base64-encoded values', () => {
      const obj = {
        name: 'John',
        age: '30',
        city: 'New York',
      };

      const expectedResult = {
        name: 'Sm9obg==',
        age: 'MzA=',
        city: 'TmV3IFlvcms=',
      };

      expect(b64encodeObject(obj)).toEqual(expectedResult);
    });
  });
});