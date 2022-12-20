import {
  _parse,
  _stringify,
  asset,
  b64dFields,
  b64decode,
  b64encode,
  escapeHTML,
  extractDomainFromUrl,
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
  secondsToMs,
  strContains,
  toFormUrlEncoded,
} from './helpers';

import { VAR_TYPE } from './constants';
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
      const _emptyArrInstance = new Array();
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
  describe('isOfType', function () {
    it('should not throw an error when type parameter is known', () => {
      expect(() => isOfType('string', VAR_TYPE.string)).not.toThrowError();
    });
    it('should throw an error when type parameter is not known', () => {
      expect(() => isOfType('string', 'unknown type')).toThrowError();
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
    it('should return null when param is empty string', () => {
      //GIVEN
      const target = null;
      const expected = 'bnVsbA==';

      //WHEN
      const result = b64encode(target);

      //THEN
      expect(result).toEqual(null);
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

    it('should return 5000 when param is not a number and console error message', () => {
      //GIVEN
      const sec = {};

      //WHEN
      const result = secondsToMs(sec);
      // global.console = { error: jest.fn() };
      //THEN
      expect(result).toEqual(5000);
      // expect(console.error).toHaveBeenCalled();
    });

    it('should return 5000 when param is smaller than 0', () => {
      //GIVEN
      const sec = -3;

      //WHEN
      const result = secondsToMs(sec);

      //THEN
      expect(result).toEqual(5000);
    });
  });

  describe('asset', () => {
    it('should return name of asset if it contains base64', () => {
      //GIVEN
      const assetName = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vc';

      //WHEN
      const result = asset(assetName);

      //THEN
      expect(result).toEqual('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vc');
    });

    it('should return url for asset if it NOT contains base64', () => {
      //GIVEN
      const assetName = 'dydu-logo.svg';

      //WHEN
      const result = asset(assetName);

      //THEN
      expect(result).toEqual(`${process.env.PUBLIC_URL}/assets/${assetName}`);
    });
  });

  describe('escapeHTML', () => {
    it('', () => {
      //GIVEN
      const html = '<a href="http://google.com" onClick="toto>click</a>';

      //WHEN
      const result = escapeHTML(html);

      //THEN
      expect(result).toEqual('&lt;a href="http://google.com" onClick="toto&gt;click&lt;/a&gt;');
    });
  });
});
