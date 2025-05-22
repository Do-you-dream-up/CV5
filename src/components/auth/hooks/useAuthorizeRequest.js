import {
  base64_urlencode,
  currentLocationContainsCodeParameter,
  currentLocationContainsError,
  extractObjectFields,
  extractParamFromUrl,
  isDefined,
  loadOidcAuthData,
  objectToQueryParam,
  snakeCaseFields,
} from '../helpers';
import { useCallback, useEffect, useState } from 'react';

import Auth from '../../../tools/storage';
import getPkce from 'oauth-pkce';

export default function useAuthorizeRequest(configuration) {
  const [authorizeDone, setAuthorizeDone] = useState(false);
  const [error, setError] = useState(false);

  const cleanUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('error');
    url.searchParams.delete('state');
    url.searchParams.delete('session_state');
    window.history.replaceState(null, '', url);
  };

  useEffect(() => {
    if (currentLocationContainsCodeParameter() && isDefined(Auth.loadOidcAuthData())) {
      setAuthorizeDone(true);
    } else if (currentLocationContainsError()) {
      Auth.clearOidcAuthData();
      setError(true);
      throw new Error(
        'authorization request error, aborting process',
        extractParamFromUrl(['error', 'error_description']),
      );
    }
  }, []);

  useEffect(() => {
    if (authorizeDone && currentLocationContainsCodeParameter()) {
      cleanUrl();
    }
  }, [authorizeDone]);

  const authorize = useCallback(async () => {
    const oidcAuthData = loadOidcAuthData();

    getPkce(50, (error, { verifier, challenge }) => {
      error && console.log('getPkce ~ error', error);
      const storedChallenge = configuration?.pkceMode === 'S256' ? challenge : base64_urlencode(verifier);
      Auth.setPkceData(storedChallenge, verifier);

      /*
      construct query params
     */
      const query = {
        responseType: 'code',
        ...extractObjectFields(configuration, ['clientId', 'scope']),
        ...extractObjectFields(oidcAuthData, ['state', 'redirectUri']),
        ...(configuration?.pkceActive && {
          codeChallenge: storedChallenge,
          codeChallengeMethod: configuration?.pkceMode,
        }),
      };

      const queryParams = objectToQueryParam(snakeCaseFields(query));

      /*
      construct url
     */
      const { authUrl } = configuration;
      window.location.replace(authUrl + '?' + queryParams);
    });
  }, [configuration]);

  return {
    authorize,
    authorizeDone,
    error,
  };
}
