import '@testing-library/jest-dom';

import {
  _parse,
  _recursiveBase64DecodeString,
  _stringify,
  asset,
  b64dFields,
  b64decode,
  b64encode,
  b64encodeObject,
  browserName,
  compareObject,
  decodeHtml,
  escapeHTML,
  extractDomainFromUrl,
  hasProperty,
  htmlToJsonForSendUploadFile,
  isDefined,
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isImageUrl,
  isObject,
  isOfType,
  isOfTypeBoolean,
  isOfTypeFunction,
  isOfTypeNumber,
  isOfTypeString,
  isPositiveNumber,
  mergeDeep,
  numberOfDayInMs,
  objectContainFields,
  objectExtractFields,
  osName,
  recursiveBase64DecodeString,
  recursiveBase64EncodeString,
  removeEndingSlash,
  removeStartingSlash,
  secondsToMs,
  strContains,
  strContainsOneOfList,
  toFormUrlEncoded,
  b64dAllFields,
  isValidUrl,
  cleanHtml,
} from '../helpers';

import { VAR_TYPE } from '../constants';
import { expect } from '@jest/globals';
import PrettyHtml from '../../components/PrettyHtml';

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

  describe('b64dAllFields', () => {
    it('json with only one level', () => {
      const encodedJsonFields = {
        field1: btoa('string'),
        field2: 1,
        field3: true,
        field4: [btoa('one'), btoa('two'), btoa('three')],
        field5: {},
        field6: [1, 2, 3],
      };

      const expectedJsonFields = {
        field1: 'string',
        field2: 1,
        field3: true,
        field4: ['one', 'two', 'three'],
        field5: {},
        field6: [1, 2, 3],
      };

      expect(b64dAllFields(encodedJsonFields)).toEqual(expectedJsonFields);
    });

    it('json with two levels of data', () => {
      const encodedJsonFields = {
        field1: btoa('string'),
        field2: 1,
        field3: true,
        field4: [btoa('one'), btoa('two'), btoa('three')],
        field5: {
          field1: btoa('string'),
          field2: 1,
          field3: true,
          field4: [btoa('one'), btoa('two'), btoa('three')],
          field5: {},
          field6: [1, 2, 3],
        },
        field6: [1, 2, 3],
      };

      const expectedJsonFields = {
        field1: 'string',
        field2: 1,
        field3: true,
        field4: ['one', 'two', 'three'],
        field5: {
          field1: 'string',
          field2: 1,
          field3: true,
          field4: ['one', 'two', 'three'],
          field5: {},
          field6: [1, 2, 3],
        },
        field6: [1, 2, 3],
      };

      expect(b64dAllFields(encodedJsonFields)).toEqual(expectedJsonFields);
    });

    it('complex json data', () => {
      const encodedJsonFields = {
        values: {
          submitValue: 'RW52b3llcg==',
          surveyId: 'NzNhNTI5YjctNDViNS00ZWQ4LThkNTItNjFhYjY2NDM0NjI1',
          name: 'R3JvcyBxdWVzdGlvbm5haXJl',
          contextId: 'YzI3NmU1NzAtMGFlZS00Zjk1LTk3N2QtOWIyN2ZlZWExMTVi',
          title: 'R3JvcyBxdWVzdGlvbm5haXJlICEhIQ==',
          fields: [
            {
              id: 568,
              label: 'Q2VjaSBlc3QgdW4gdGl0cmU=',
              type: 'VElUTEU=',
              mandatory: false,
              order: 1,
            },
            {
              children: [
                {
                  id: 570,
                  label: 'T3VpICE=',
                  type: 'UkFESU8=',
                  mandatory: false,
                  order: 1,
                },
                {
                  id: 571,
                  label: 'Tm9uIDoo',
                  type: 'UkFESU8=',
                  mandatory: false,
                  order: 2,
                },
              ],
              id: 569,
              label: 'Q2UgdGl0cmUgZXN0LWlsIGdyb3MgPw==',
              type: 'TVVMVElQTEVfQ0hPSUNF',
              mandatory: true,
              order: 2,
            },
            {
              id: 572,
              label: 'QXMtdHUgZGVzIGNvbnNlaWxzIHBvdXIgdW4gdGl0cmUgPw==',
              type: 'TE9OR19URVhU',
              mandatory: false,
              order: 3,
            },
            {
              id: 573,
              label: 'QXV0cmUgY2hvc2Ugw6AgZMOpY2xhcmVyID8=',
              type: 'VEVYVA==',
              mandatory: false,
              order: 4,
            },
            {
              children: [
                {
                  id: 575,
                  label: 'WSBhIHBsZWluIGRlIHRydWNzIGRlZGFucw==',
                  type: 'U0VMRUNUX09QVElPTg==',
                  mandatory: false,
                  order: 1,
                },
                {
                  id: 576,
                  label: 'WSBhIHBhcyBncmFuZCBjaG9zZSBkZWRhbnM=',
                  type: 'U0VMRUNUX09QVElPTg==',
                  mandatory: false,
                  order: 2,
                },
                {
                  masterOf: [578],
                  id: 577,
                  label: 'TW91YWlzIG9r',
                  type: 'U0VMRUNUX09QVElPTg==',
                  mandatory: false,
                  order: 3,
                },
              ],
              id: 574,
              label: 'Vk9pY2kgw6lnYWxlbWVudCB1bmUgbGlzdGU=',
              type: 'U0VMRUNU',
              mandatory: false,
              order: 5,
            },
            {
              id: 578,
              label: 'Q29uZGl0aW9u',
              type: 'VEVYVA==',
              mandatory: false,
              order: 6,
            },
          ],
          requiredMessage: 'UmVxdWlz',
        },
      };

      const expectedJsonFields = {
        values: {
          submitValue: 'Envoyer',
          surveyId: '73a529b7-45b5-4ed8-8d52-61ab66434625',
          name: 'Gros questionnaire',
          contextId: 'c276e570-0aee-4f95-977d-9b27feea115b',
          title: 'Gros questionnaire !!!',
          fields: [
            {
              id: 568,
              label: 'Ceci est un titre',
              type: 'TITLE',
              mandatory: false,
              order: 1,
            },
            {
              children: [
                {
                  id: 570,
                  label: 'Oui !',
                  type: 'RADIO',
                  mandatory: false,
                  order: 1,
                },
                {
                  id: 571,
                  label: 'Non :(',
                  type: 'RADIO',
                  mandatory: false,
                  order: 2,
                },
              ],
              id: 569,
              label: 'Ce titre est-il gros ?',
              type: 'MULTIPLE_CHOICE',
              mandatory: true,
              order: 2,
            },
            {
              id: 572,
              label: 'As-tu des conseils pour un titre ?',
              type: 'LONG_TEXT',
              mandatory: false,
              order: 3,
            },
            {
              id: 573,
              label: 'Autre chose à déclarer ?',
              type: 'TEXT',
              mandatory: false,
              order: 4,
            },
            {
              children: [
                {
                  id: 575,
                  label: 'Y a plein de trucs dedans',
                  type: 'SELECT_OPTION',
                  mandatory: false,
                  order: 1,
                },
                {
                  id: 576,
                  label: 'Y a pas grand chose dedans',
                  type: 'SELECT_OPTION',
                  mandatory: false,
                  order: 2,
                },
                {
                  masterOf: [578],
                  id: 577,
                  label: 'Mouais ok',
                  type: 'SELECT_OPTION',
                  mandatory: false,
                  order: 3,
                },
              ],
              id: 574,
              label: 'VOici également une liste',
              type: 'SELECT',
              mandatory: false,
              order: 5,
            },
            {
              id: 578,
              label: 'Condition',
              type: 'TEXT',
              mandatory: false,
              order: 6,
            },
          ],
          requiredMessage: 'Requis',
        },
      };

      expect(b64dAllFields(encodedJsonFields)).toEqual(expectedJsonFields);
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
      expect(isOfType(2, 'number')).toBe(true);
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

    it('should return entry value if not strinfiable', () => {
      expect(_stringify(undefined)).toEqual(undefined);
    });
  });

  describe('_parse', () => {
    it('should parse json when its json', () => {
      //GIVEN
      const str = '{"result":true, "count":42}';

      //WHEN
      const result = _parse(str);

      //THEN
      expect(result).toEqual({ result: true, count: 42 });
    });

    it('should return entry string when it is not a json object', () => {
      //GIVEN
      const str = 'ceci est une string et non un json';

      //WHEN
      const result = _parse(str);

      //THEN
      expect(result).toEqual(str);
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
      const result = decodeHtml(html);
      expect(result).toEqual(expectedResult);
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

  describe('recursiveBase64DecodeString', () => {
    it('return object with decoded values', () => {
      const fields = {
        field1: {
          getId: 'WFhYWFg=',
          getLabel: 'bGFiZWw=',
          isRoot: false,
        },
      };
      expect(recursiveBase64DecodeString(fields)).toEqual(fields);
    });
  });

  describe('_recursiveBase64DecodeString', () => {
    it('return object with decoded values', () => {
      const fields = {
        field1: {
          getId: 'WFhYWFg=',
          getLabel: 'bGFiZWw=',
          isRoot: false,
        },
      };
      expect(_recursiveBase64DecodeString(fields, Object.keys(fields), {})).toEqual(fields);
    });
  });

  describe('_recursiveBase64EncodeString', () => {
    it('return object with encoded values', () => {
      const fields = {
        field1: {
          getId: 'XXXXX',
          getLabel: 'label',
          isRoot: false,
        },
      };
      expect(recursiveBase64EncodeString(fields)).toEqual(fields);
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

  describe('compareObject', () => {
    test('returns true when objects have the same values for all fields', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };
      expect(compareObject(obj1, obj2)).toBe(true);
    });

    test('returns false when objects have different values for at least one field', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      expect(compareObject(obj1, obj2)).toBe(false);
    });

    test('returns false when the second object does not contain all fields of the first object', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1 };
      expect(compareObject(obj1, obj2)).toBe(false);
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

  describe('b64encodeObject', () => {
    it('returns an object with base64-encoded values', () => {
      // GIVEN
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

      // WHEN
      const encoded = b64encodeObject(obj);

      // THEN
      // same number of keys
      const testKeyList = Object.keys(encoded);
      const expectedKeyList = Object.keys(expectedResult);
      expect(testKeyList.length).toEqual(expectedKeyList.length);

      // same key names
      const sameKeys =
        testKeyList.every((key) => expectedKeyList.includes(key)) &&
        expectedKeyList.every((key) => testKeyList.includes(key));
      expect(sameKeys).toEqual(true);

      // same values
      const sameValues = Object.keys(encoded).every((key) => encoded[key] === expectedResult[key]);
      expect(sameValues).toEqual(true);
    });
  });

  describe('strContainsOneOfList', () => {
    it('returns a boolean regading str listed in array', () => {
      // GIVEN
      const urlWithResult = 'http://localhost/image.jpg';

      const urlWithNoResult = 'http://localhost/image.gif';

      const list = ['png', 'jpg', 'svg'];

      const wrongList = [1, 2, 3];

      // WHEN
      const testUrlTrue = strContainsOneOfList(urlWithResult, list);

      const testUrlFalse = strContainsOneOfList(urlWithNoResult, list);

      const testUrlWrongList = strContainsOneOfList(urlWithResult, wrongList);

      // THEN
      // with extention listed
      expect(testUrlTrue).toEqual(true);

      // with extention listed
      expect(testUrlFalse).toEqual(false);

      // with wrong list of sring
      expect(testUrlWrongList).toEqual(false);
    });
  });
});

describe('removeStartingSlash', () => {
  const pathIn = '/urldetest/';
  const pathOut = 'urldetest/';
  const invalidPath = '3';

  it('with not valid param', () => {
    expect(removeStartingSlash(invalidPath)).toEqual(invalidPath);
  });

  it('returns a string with first slash removed', () => {
    expect(removeStartingSlash(pathIn)).toEqual(pathOut);
  });
});

describe('removeEndingSlash', () => {
  const urlIn = 'http://localhost/urldetest/';
  const urlOut = 'http://localhost/urldetest';
  const invalidPath = '3';

  it('with not valid param', () => {
    expect(removeEndingSlash(invalidPath)).toEqual(invalidPath);
  });

  it('returns a string with last slash removed', () => {
    expect(removeEndingSlash(urlIn)).toEqual(urlOut);
  });
});

describe('isImageUrl', () => {
  it('returns a boolean is string is a valid Image Url or not', () => {
    // GIVEN
    const urlWithResult = 'http://localhost/image.jpg';

    const urlWithNoResult = 'http://localhost/image.gif';

    // WHEN
    const testUrlTrue = isImageUrl(urlWithResult);

    const testUrlFalse = isImageUrl(urlWithNoResult);

    // THEN
    // with good url
    expect(testUrlTrue).toEqual(true);

    // with wrong url
    expect(testUrlFalse).toEqual(false);
  });
});

describe('mergeDeep', () => {
  it('returns a deep merge with an existing key', () => {
    const source = { user: { name: 'Maxime', age: 37, animals: { dog: 'Havane' } } };

    const target = { user: { animals: { cat: 'Woody, Cali' } } };

    const result = { user: { name: 'Maxime', age: 37, animals: { dog: 'Havane', cat: 'Woody, Cali' } } };

    // THEN
    // with existing key
    expect(mergeDeep(source, target)).toEqual(result);
  });

  it('returns a deep merge with a not existing key', () => {
    const source = { user: { name: 'Maxime', age: 37, animals: { dog: 'Havane' } } };

    const target = { user: { vehicules: { bike: true } } };

    const result = { user: { name: 'Maxime', age: 37, animals: { dog: 'Havane' }, vehicules: { bike: true } } };

    // THEN
    expect(mergeDeep(source, target)).toEqual(result);
  });

  describe('htmlToJsonForSendUploadFile', () => {
    it('should return correct json content in html response', () => {
      //GIVEN
      const html = `<html>
      <head></head>
      <body>
      <script>
          var params={
              api:'dyduUploadCallBack_0PW',
              params:{"filesUploaded":["awesome-user-plus.svg"],"status":"success"}
          };
          parent.postMessage(params,"http://0.0.0.0:9999");
      </script>
      </body>
      </html>`;

      //WHEN
      const expectedResult = {
        api: 'dyduUploadCallBack_0PW',
        params: { filesUploaded: ['awesome-user-plus.svg'], status: 'success' },
      };
      const result = htmlToJsonForSendUploadFile(html);

      //THEN
      expect(result).toEqual(expectedResult);
    });

    it('should return correct json content in html response with simple quote in file name', () => {
      //GIVEN
      const html = `<html>
      <head></head>
      <body>
      <script>
          var params={
              api:'dyduUploadCallBack_0PW',
              params:{"filesUploaded":["awes'ome-user-plus.svg"],"status":"success"}
          };
          parent.postMessage(params,"http://0.0.0.0:9999");
      </script>
      </body>
      </html>`;

      //WHEN
      const expectedResult = {
        api: 'dyduUploadCallBack_0PW',
        params: { filesUploaded: ["awes'ome-user-plus.svg"], status: 'success' },
      };
      const result = htmlToJsonForSendUploadFile(html);

      //THEN
      expect(result).toEqual(expectedResult);
    });
  });
});

describe('REGEX URL', () => {
  test('valid http url', () => {
    const validHttpUrl = 'http://google.fr';
    expect(isValidUrl(validHttpUrl)).toBeTruthy();
  });

  test('valid https url', () => {
    const validHttspUrl = 'https://google.fr';
    expect(isValidUrl(validHttspUrl)).toBeTruthy();
    const otherValidHttspUrl = 'https://google.fr';
    expect(isValidUrl(otherValidHttspUrl)).toBeTruthy();
  });

  test('valid url with two dots', () => {
    const validHttspUrlWuthTwoDots = 'https://google.form.fr';
    expect(isValidUrl(validHttspUrlWuthTwoDots)).toBeTruthy();
  });

  test('valid url with uppercases', () => {
    const validHttspUrlWithUppercase = 'Https://gOOgle.form.fr';
    expect(isValidUrl(validHttspUrlWithUppercase)).toBeTruthy();
  });

  test('invalid url with text', () => {
    const invalidHttspUrl = 'bonjour voici une url https://google.fr et voila une autre https://google.form.fr';
    expect(isValidUrl(invalidHttspUrl)).toBeFalsy();
  });

  test('valid url with specials characters', () => {
    const invalidHttspUrl = 'https://google$$éé.fr';
    expect(isValidUrl(invalidHttspUrl)).toBeTruthy();
  });

  test('valid url with fragment', () => {
    const validHttspUrl = 'https://maretraitepublique.caissedesdepots.fr/espace-prive/plateforme/#/acces-direct/90';
    expect(isValidUrl(validHttspUrl)).toBeTruthy();
  });

  test('valid url with IPV4', () => {
    const validHttspUrl = 'https://127.0.0.1/espace-prive/plateforme/#/acces-direct/90';
    expect(isValidUrl(validHttspUrl)).toBeTruthy();
  });

  test('valid complex url', () => {
    const validHttspUrl =
      'https://localhost:9043/login?servercode=dev.dydu.local&locale=fr&loginmessage=eyJhcHBXZWxjb21lU2VudGVuY2UiOiJjYXMubG9naW4ud2VsY29tZS5ibXMiLCJtc2dMZXZlbCI6IklORk8ifQ%3D%3D&service=https%3A%2F%2Fdev.dydu.local%2Fwebsite%2Fcallback%3Fclient_name%3DCasClient';
    expect(isValidUrl(validHttspUrl)).toBeTruthy();
  });
});

describe('cleanHtml', () => {
  it('cleanHtml method 1', () => {
    const htmlToCLean =
      '<p>Saisissez votre nouvelle adresse depuis votre<a href="https://www.letese.urssaf.fr/cetpeweb/connectempl.jsp" target="_blank" onclick="try {reword(\'https://www.letese.urssaf.fr/cetpeweb/connectempl.jsp\',{\'botsource\':795,\'type\':\'redirection_newpage\'});}catch(e){}"> espace employeur<svg style="height: 20px;width: 20px;margin: 0px 0px -2px 3px;">  <use href="#action_external-link">  <svg id="action_external-link" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">  <use fill-rule="evenodd" xlink:href="#asa">  <path id="asa" d="M14.499 17.681H2v-12h6.959v1.55h-5.27v8.908h9.251v-5.117H14.5v6.66zM18 7.433h-2.014V5.625l-5.304 5.072-1.407-1.352 5.304-5.092h-1.883V2.32H18v5.113z"></path></use></svg></use></svg><span class="sr-only" style="display: none;">nouvelle fenêtre</span></a></p> <hr class="split"> <p>Rubrique <i>Adhésion &gt; Adresse de correspondance</i></p>';
    const cleanedHtml =
      '<p>Saisissez votre nouvelle adresse depuis votre<a href="https://www.letese.urssaf.fr/cetpeweb/connectempl.jsp" target="_blank" onclick="try {reword(\'https://www.letese.urssaf.fr/cetpeweb/connectempl.jsp\',{\'botsource\':795,\'type\':\'redirection_newpage\'});}catch(e){}"> espace employeur<svg style="height: 20px;width: 20px;margin: 0px 0px -2px 3px;">  <use href="#action_external-link">  <svg id="action_external-link" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">  <use fill-rule="evenodd" xlink:href="#asa">  <path id="asa" d="M14.499 17.681H2v-12h6.959v1.55h-5.27v8.908h9.251v-5.117H14.5v6.66zM18 7.433h-2.014V5.625l-5.304 5.072-1.407-1.352 5.304-5.092h-1.883V2.32H18v5.113z"></path></use></svg></use></svg><span class="sr-only" style="display: none;">nouvelle fenêtre</span></a></p> <hr class="split"> <p>Rubrique <i>Adhésion > Adresse de correspondance</i></p>';
    expect(cleanHtml(htmlToCLean)).toBe(cleanedHtml);
  });
  it('cleanHtml method 2', () => {
    const htmlToCLean = 'je suis un text simple';
    expect(cleanHtml(htmlToCLean)).toBe(htmlToCLean);
  });
  it('cleanhtml  json 1', () => {
    const jsonToClean =
      '{"text":"Pouvez-vous me préciser votre profil ?","separator":true,"quick":{"button4":null,"button5":null,"button2":"<a href=\\"#\\" class=\\"reword\\" onclick=\\"try {rewordtest(\'Mon profil est &quot;diffuseur&quot;\',{\'personality_id\':792,\'lastcondition\':91854,\'botsource\':792,\'type\':\'redirection_knowledge\'}); return false;}catch(e){}\\">Diffuseur</a>","button3":null,"button8":null,"button9":null,"button6":null,"button7":null,"button1":"<a href=\\"#\\" class=\\"reword\\" onclick=\\"try {rewordtest(\'Mon profil est &quot;artiste-auteur&quot;\',{\'personality_id\':792,\'lastcondition\':91854,\'botsource\':792,\'type\':\'redirection_knowledge\'}); return false;}catch(e){}\\">Artiste-Auteur</a>"}}';
    expect(cleanHtml(jsonToClean)).toBe(jsonToClean);
  });
  it('cleanhtml json 2', () => {
    const jsonToClean =
      '{"text":"<p><span>Veuillez consulter la définition ci-contre.<br/></span><span><em></em></span></p> <br/><a href=\\"#\\" class=\\"reword\\" onclick=\\"try {reword(\'Je souhaiterais obtenir des informations sur Compliance Catalyst.\',{\'personality_id\':794,\'lastcondition\':92276,\'botsource\':794,\'type\':\'redirection_knowledge\'}); return false;}catch(e){}\\">Je souhaiterais obtenir des informations sur Compliance Catalyst.</a><br/><br/><a href=\\"#\\" class=\\"reword\\" onclick=\\"try {reword(\'Comment utiliser le bouton &quot;RAID&quot; ?\',{\'personality_id\':794,\'lastcondition\':92276,\'botsource\':794,\'type\':\'redirection_knowledge\'}); return false;}catch(e){}\\">Comment utiliser le bouton \\"RAID\\" ?</a><br/><br/><a href=\\"#\\" class=\\"reword\\" onclick=\\"try {reword(\'Qu\'est qu\'une diligence d\'honorabilité ?\',{\'personality_id\':794,\'lastcondition\':92276,\'botsource\':794,\'type\':\'redirection_knowledge\'}); return false;}catch(e){}\\">Qu\'est qu\'une diligence d\'honorabilité ?</a>","separator":true,"quick":{"button4":"<a href=\\"https://next.caissedesdepots.fr/jplatform/jcms/1452966751_DBWikiPage/compliance-catalyst-dans-l-application-sylab\\" target=\\"_blank\\" rel=\\"nofeedback noopener\\" title=\\"Bouton Compliance Catalyst\\" onclick=\\"try {reword(\'https://next.caissedesdepots.fr/jplatform/jcms/1452966751_DBWikiPage/compliance-catalyst-dans-l-application-sylab\',{botsource:794,type:\'redirection_newpage\'});}catch(e){}\\">Bouton Compliance Catalyst</a>","button5":null,"button2":"<a href=\\"https://next.caissedesdepots.fr/jplatform/jcms/pr1_3042678/information-negative-ou-presse-negative\\" target=\\"_blank\\" rel=\\"nofeedback noopener\\" title=\\"Termes à connaitre\\" onclick=\\"try {reword(\'https://next.caissedesdepots.fr/jplatform/jcms/pr1_3042678/information-negative-ou-presse-negative\',{botsource:794,type:\'redirection_newpage\'});}catch(e){}\\">Glossaire</a>","button3":"<a href=\\"https://next.caissedesdepots.fr/jplatform/jcms/1566501934_DBWikiPage/raid-recherche-automatisee-d-information-defavorable-dans-sylab\\" target=\\"_blank\\" rel=\\"nofeedback noopener\\" title=\\"RAID : Recherche Automatisée d\'Information Défavorable\\" onclick=\\"try {reword(\'https://next.caissedesdepots.fr/jplatform/jcms/1566501934_DBWikiPage/raid-recherche-automatisee-d-information-defavorable-dans-sylab\',{botsource:794,type:\'redirection_newpage\'});}catch(e){}\\">Bouton RAID</a>","button8":null,"button9":null,"button6":null,"button7":null,"button1":"<a href=\\"https://next.caissedesdepots.fr/jplatform/jcms/1380190548_DBWikiPage/recherche-de-presse/information-negative-dans-le-cadre-de-la-lcb-ft\\" target=\\"_blank\\" rel=\\"nofeedback noopener\\" title=\\"Recherche de Presse/Information négative dans le cadre de la LCB-FT\\" onclick=\\"try {reword(\'https://next.caissedesdepots.fr/jplatform/jcms/1380190548_DBWikiPage/recherche-de-presse/information-negative-dans-le-cadre-de-la-lcb-ft\',{botsource:794,type:\'redirection_newpage\'});}catch(e){}\\">Recherche Presse négative</a>"}}';
    expect(cleanHtml(jsonToClean)).toBe(jsonToClean);
  });
});
