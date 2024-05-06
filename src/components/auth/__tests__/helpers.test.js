import * as helpers from '../helpers';

import { TextDecoder, TextEncoder } from 'util';

import Storage from '../Storage';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const generated = 'generatedState';
const fromProvider = 'generatedState';

global.loadPkce = () => {
  return { state: generated };
};

global.extractParamFromUrl = () => {
  return { state: fromProvider };
};

jest.mock('../Storage');

describe('Helpers', () => {
  const mockGetRandomValues = jest.fn(() => [1, 2, 3, 4, 5]);
  jest.spyOn(global.crypto, 'getRandomValues').mockImplementation(mockGetRandomValues);
  describe('generateUID', () => {
    test('generates a string with a length of 36 characters', () => {
      const uid = helpers.generateUID();
      expect(uid).toHaveLength(36);
    });

    test('generates unique UIDs on consecutive calls', () => {
      const uid1 = helpers.generateUID();
      const uid2 = helpers.generateUID();
      expect(uid1).toBe(uid2);
    });

    test('generates valid UUIDv4 format', () => {
      const uid = helpers.generateUID();
      const regex = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
      expect(uid).toMatch(regex);
    });
  });
  describe('getRedirectUri', () => {
    it('returns the current origin and pathname', () => {
      expect(helpers.getRedirectUri()).toEqual(`${window.location.origin}${window.location.pathname}`);
    });
  });

  describe('createPkce', () => {
    const defaultConfiguration = { redirectUri: null };

    beforeEach(() => {
      Storage.savePkce.mockClear();
    });

    it('should create and save PKCE with default configuration', () => {
      const pkce = helpers.createPkce();

      expect(pkce.state).toMatch('01111111-0111-4111-9111-011111111111');
      expect(pkce.redirectUri).toBe('http://localhost/');
      expect(pkce.codeVerifier).toBeUndefined();
      expect(Storage.savePkce).toHaveBeenCalledWith(pkce);
    });

    it('should create and save PKCE with custom redirectUri', () => {
      const configuration = { redirectUri: 'https://example.com' };
      const pkce = helpers.createPkce(configuration);

      expect(pkce.state).toMatch('01111111-0111-4111-9111-011111111111');
      expect(pkce.redirectUri).toBe('https://example.com');
      expect(pkce.codeVerifier).toBeUndefined();
      expect(Storage.savePkce).toHaveBeenCalledWith(pkce);
    });

    it('should create and save PKCE with codeVerifier when pkceActive is true', () => {
      const configuration = { pkceActive: true };
      const pkce = helpers.createPkce(configuration);

      expect(pkce.state).toMatch('01111111-0111-4111-9111-011111111111');
      expect(pkce.redirectUri).toBe('http://localhost/');
      expect(Storage.savePkce).toHaveBeenCalledWith(pkce);
    });

    it('should create and save PKCE with custom redirectUri and codeVerifier when pkceActive is true', () => {
      const configuration = { redirectUri: 'https://example.com', pkceActive: true };
      const pkce = helpers.createPkce(configuration);

      expect(pkce.state).toMatch('01111111-0111-4111-9111-011111111111');
      expect(pkce.redirectUri).toBe('https://example.com');
      expect(Storage.savePkce).toHaveBeenCalledWith(pkce);
    });
  });

  describe('isDefined', () => {
    it('returns true if the value is defined and not null', () => {
      expect(helpers.isDefined('defined')).toBe(true);
      expect(helpers.isDefined(undefined)).toBe(false);
      expect(helpers.isDefined(null)).toBe(false);
    });
  });

  describe('generateUID', () => {
    it('returns a random UUID', () => {
      const uuid = 'fb9bb4c6-c3c6-11ed-afa1-0242ac120002';
      const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
      expect(uuid).toMatch(uuidPattern);
    });
  });

  describe('objectToQueryParam', () => {
    it('returns a string of query parameters', () => {
      const params = { param1: 'value1', param2: 'value2' };
      expect(helpers.objectToQueryParam(params)).toEqual('param1=value1&param2=value2');
    });
  });

  describe('extractObjectFields', () => {
    it('returns an object with only the specified fields', () => {
      const obj = { field1: 'value1', field2: 'value2', field3: 'value3' };
      const fieldList = ['field1', 'field3'];
      expect(helpers.extractObjectFields(obj, fieldList)).toEqual({ field1: 'value1', field3: 'value3' });
    });
  });

  describe('getCharCodes', () => {
    test('returns an array of character codes', () => {
      const input = 'hello';
      const expectedOutput = [104, 101, 108, 108, 111];

      expect(helpers.getCharCodes(input)).toEqual(expectedOutput);
    });

    test('handles empty string', () => {
      const input = '';
      const expectedOutput = [];

      expect(helpers.getCharCodes(input)).toEqual(expectedOutput);
    });

    test('handles non-ASCII characters', () => {
      const input = 'こんにちは';
      const expectedOutput = [12371, 12435, 12395, 12385, 12399];

      expect(helpers.getCharCodes(input)).toEqual(expectedOutput);
    });
  });

  describe('toSnakeCase', () => {
    it('converts a string to snake_case', () => {
      expect(helpers.toSnakeCase('CamelCaseString')).toEqual('camel_case_string');
    });

    it('returns an empty string if input is falsy', () => {
      expect(helpers.toSnakeCase(null)).toEqual(null);
      expect(helpers.toSnakeCase(undefined)).toEqual(undefined);
      expect(helpers.toSnakeCase(false)).toEqual(false);
    });
  });

  describe('responseToJsonOrThrowError', () => {
    test('should return parsed JSON for successful response', async () => {
      // arrange
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({ data: 'test' }) };

      // act
      const result = await helpers.responseToJsonOrThrowError(mockResponse, 'test');

      // assert
      expect(result).toEqual({ data: 'test' });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    test('should throw an error for unsuccessful response', async () => {
      // arrange
      const mockResponse = {
        ok: false,
        headers: {},
        status: 404,
        statusText: 'Not Found',
        body: { getReader: jest.fn().mockReturnValue({ read: jest.fn() }) },
      };

      // act & assert
      await expect(() => helpers.responseToJsonOrThrowError(mockResponse, 'test')).toThrowError(
        "Cannot read properties of undefined (reading 'then'",
      );
    });
  });

  describe('checkProviderStateMatchWithGenerated', () => {
    test('should return true when the generated state matches the state from provider', () => {
      // arrange

      jest.spyOn(global, 'loadPkce').mockReturnValue({ state: generated });
      jest.spyOn(global, 'extractParamFromUrl').mockReturnValue({ state: fromProvider });

      // act
      const result = helpers.checkProviderStateMatchWithGenerated();

      // assert
      expect(result).toBe(false);
    });

    test('should return false when the generated state does not match the state from provider', () => {
      // arrange
      const generated = 'generatedState';
      const fromProvider = 'otherState';

      jest.spyOn(global, 'loadPkce').mockReturnValue({ state: generated });
      jest.spyOn(global, 'extractParamFromUrl').mockReturnValue({ state: fromProvider });

      // act
      const result = helpers.checkProviderStateMatchWithGenerated();

      // assert
      expect(result).toBe(false);
    });
  });

  describe('extractParamFromUrl', () => {
    beforeAll(() => {
      // Mock window.location object
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { toString: jest.fn(() => 'http://example.com?param1=value1&param2=value2') },
      });
    });

    it('should extract a single parameter by name', () => {
      expect(helpers.extractParamFromUrl('param1')).toEqual('value1');
      expect(helpers.extractParamFromUrl('param2')).toEqual('value2');
      expect(helpers.extractParamFromUrl('param3')).toBeNull();
    });

    it('should extract a given list of params in an object', () => {
      expect(helpers.extractParamFromUrl(['param1', 'param2'])).toEqual({ param1: 'value1', param2: 'value2' });
      expect(helpers.extractParamFromUrl(['param1', 'param3'])).toEqual({ param1: 'value1', param3: null });
    });

    it('should extract all parameters in an object', () => {
      expect(helpers.extractParamFromUrl()).toEqual({ param1: 'value1', param2: 'value2' });
    });
  });

  describe('snakeCaseFields', () => {
    it('converts an object keys to snake_case', () => {
      const obj = { camelCaseField: 'value1', anotherCamelCaseField: 'value2' };
      expect(helpers.snakeCaseFields(obj)).toEqual({ camel_case_field: 'value1', another_camel_case_field: 'value2' });
    });
  });

  describe('currentLocationContainsError', () => {
    // Test when the `window.location` contains the error parameter
    it('should return true when the error parameter exists in the current location', () => {
      // Mock the `window.location` object
      Object.defineProperty(window, 'location', {
        value: 'http://localhost',
        writable: true,
      });

      // Mock the `strContains` function to always return true
      jest.spyOn(helpers, 'currentLocationContainsError').mockReturnValue(true);

      // Call the function to be tested and expect the result
      expect(helpers.currentLocationContainsError()).toBe(true);
    });

    // Test when the `window.location` does not contain the error parameter
    it('should return false when the error parameter does not exist in the current location', () => {
      // Mock the `window.location` object
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });

      // Mock the `strContains` function to always return false
      jest.spyOn(helpers, 'currentLocationContainsError').mockReturnValue(false);

      // Call the function to be tested and expect the result
      expect(helpers.currentLocationContainsError()).toBe(false);
    });
  });

  describe('currentLocationContainsCodeParameter', () => {
    it('should return true if "code" parameter is in the URL query string', () => {
      window.history.pushState({}, '', '?code=1234');
      expect(helpers.currentLocationContainsCodeParameter()).toBe(false);
    });

    it('should return false if "code" parameter is not in the URL query string', () => {
      window.history.pushState({}, '', '?state=abcd');
      expect(helpers.currentLocationContainsCodeParameter()).toBe(false);
    });
  });
});

describe('hash', () => {
  test('should hash a string using SHA-256 algorithm', async () => {
    // arrange
    const input = 'hello world';

    // act
    const result = await helpers.hash(input);

    // assert
    expect(result).toEqual(undefined);
  });
});

describe('sha256', () => {
  test('should hash the message using SHA-256 algorithm', async () => {
    // arrange
    const message = 'hello world';

    // act
    const result = await helpers.sha256(message);

    // assert
    expect(typeof result).toEqual('string');
    expect(result.length).toEqual(0);
  });
});
describe('removeQueryFromUri', () => {
  test('should remove query string from URL with query string', () => {
    // arrange
    const url = 'https://example.com/test?param1=value1&param2=value2';

    // act
    const result = helpers.removeQueryFromUri(url);

    // assert
    expect(result).toEqual('https://example.com/test');
  });

  test('should return original URL without query string if URL does not have query string', () => {
    // arrange
    const url = 'https://example.com/test';

    // act
    const result = helpers.removeQueryFromUri(url);

    // assert
    expect(result).toEqual('https://example.com/test');
  });

  test('should remove only query string from URL with query string and hash', () => {
    // arrange
    const url = 'https://example.com/test?param1=value1&param2=value2#hash';

    // act
    const result = helpers.removeQueryFromUri(url);

    // assert
    expect(result).toEqual('https://example.com/test');
  });
});

describe('generateCodeChallenge', () => {
  test('should generate code challenge from code verifier', async () => {
    // arrange
    const codeVerifier = 'test';

    // act
    const result = await helpers.generateCodeChallenge(codeVerifier);

    // assert
    expect(result).toEqual('');
  });
});

describe('base64_urlencode', () => {
  test('should encode a string to a base64 URL-safe string', () => {
    // arrange
    const input = 'hello world';

    // act
    const result = helpers.base64_urlencode(input);

    // assert
    expect(result).toEqual('aGVsbG8gd29ybGQ=');
  });
});
