import '@testing-library/jest-dom';

import {
  currentLocationContainsCodeParameter,
  currentLocationContainsError,
  extractParamFromUrl,
  isDefined,
} from '../helpers';

import { Cookie } from '../../../tools/storage';
import Storage from '../Storage';
import { renderHook } from '@testing-library/react-hooks';
import useAuthorizeRequest from '../hooks/useAuthorizeRequest';

jest.mock('../../../tools/storage', () => ({
  Cookie: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('oauth-pkce', () => ({
  __esModule: true,
  default: jest.fn(() => ({ verifier: 'mockVerifier', challenge: 'mockChallenge' })),
}));

const configuration = {
  authUrl: 'https://example.com/auth',
  clientId: 'client-id',
  scope: 'scope',
  pkceMode: 'S256',
  pkceActive: true,
};

describe('useAuthorizeRequest', () => {
  const { location } = window;

  beforeEach(() => {
    Cookie.get.mockClear();
    Cookie.set.mockClear();
    Cookie.remove.mockClear();
    jest.spyOn(Storage, 'loadPkce').mockReturnValue(true);
    jest.spyOn(Storage, 'clearPkce').mockReturnValue(true);
    jest.spyOn(window.document, 'cookie', 'get').mockReturnValue('');
    jest.spyOn(window.document, 'cookie', 'set').mockReturnValue('');
    delete window.location;
    window.location = { ...location, replace: jest.fn() };
  });

  beforeAll(() => {
    Storage.savePkce(false);
  });

  afterAll(() => {
    window.location = location;
  });

  describe('initial state', () => {
    it('should set authorizeDone to false', () => {
      const { result } = renderHook(() => useAuthorizeRequest({}));
      expect(result.current.authorizeDone).toBe(false);
    });

    it('should set error to false', () => {
      const { result } = renderHook(() => useAuthorizeRequest({}));
      expect(result.current.error).toBe(false);
    });
  });

  describe('authorize', () => {
    it('should redirect the user to the authorization URL', async () => {
      const configuration = {
        authUrl: 'https://example.com/auth',
        clientId: 'client123',
        scope: 'openid profile',
        pkceActive: true,
        pkceMode: 'S256',
      };
      const pkce = {
        state: 'state123',
        redirectUri: 'https://example.com/callback',
      };
      Cookie.get.mockReturnValue(undefined);
      Cookie.set.mockReturnValue(undefined);
      const { result } = renderHook(() => useAuthorizeRequest(configuration));
      result.current.authorize();
    });
  });

  describe('currentLocationContainsCodeParameter', () => {
    it('should return true if the current URL contains a code parameter', () => {
      delete window.location;
      window.location = {
        search: '?code=123',
      };
      expect(currentLocationContainsCodeParameter()).toBe(true);
    });

    it('should return false if the current URL does not contain a code parameter', () => {
      delete window.location;
      window.location = {
        search: '',
      };
      expect(currentLocationContainsCodeParameter()).toBe(false);
    });

    it('should setError true if the current URL does contain a error code parameter', () => {
      delete window.location;
      window.location = {
        search: '?error=',
      };
      expect(window.location.search).toEqual('?error=');

      expect(currentLocationContainsError()).toBe(true);
      Storage.clearPkce();
      expect(() => {
        throw new Error(
          'authorization request error, aborting process',
          extractParamFromUrl(['error', 'error_description']),
        );
      }).toThrow('authorization request error, aborting process');
    });
  });

  describe('isDefined', () => {
    it('should return true if the input is defined', () => {
      expect(isDefined('abc')).toBe(true);
    });

    it('should return false if the input is undefined', () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  it('should construct query params and redirect to authorization URL', async () => {
    const { result } = renderHook(() => useAuthorizeRequest(configuration));
    const queryParams = '?response_type=code&client_id=client-id&scope=scope';
    jest.spyOn(window.location, 'replace').mockImplementationOnce(() => {
      expect(window.location.replace).toHaveBeenCalledWith(`${configuration.authUrl}${queryParams}`);
      expect(window.document.cookie).toHaveBeenCalledWith('dydu-code-verifier', expect.any(String));
      expect(window.document.cookie).toHaveBeenCalledWith('dydu-code-challenge', expect.any(String));
    });

    await result.current.authorize();
  });

  it('should construct query params with PKCE and redirect to authorization URL', async () => {
    const pkce = {
      state: 'state',
      redirectUri: 'https://example.com/callback',
    };
    jest.spyOn(Storage, 'loadPkce').mockReturnValueOnce(pkce);

    const { result } = renderHook(() => useAuthorizeRequest(configuration));
    const queryParams = `?response_type=code&client_id=client-id&scope=scope&state=${
      pkce.state
    }&redirect_uri=${encodeURIComponent(pkce.redirectUri)}&code_challenge=${expect.any(
      String,
    )}&code_challenge_method=S256`;

    jest.spyOn(window.location, 'replace').mockImplementationOnce(() => {
      expect(window.location.replace).toHaveBeenCalledWith(`${configuration.authUrl}${queryParams}`);
      expect(window.document.cookie).toHaveBeenCalledWith('dydu-code-verifier', expect.any(String));
      expect(window.document.cookie).toHaveBeenCalledWith('dydu-code-challenge', expect.any(String));
    });

    await result.current.authorize();
  });
});
