import {
  base64_urlencode,
  currentLocationContainsCodeParameter,
  currentLocationContainsError,
  extractParamFromUrl,
  isDefined,
  loadOidcAuthData,
  objectToQueryParam,
} from '../helpers';
import { useCallback, useEffect, useState } from 'react';

import Auth from '../../../tools/storage';
import getPkce from 'oauth-pkce';

export default function useAuthorizeRequest(authConfiguration) {
  const [authorizeDone, setAuthorizeDone] = useState(false);
  const [error, setError] = useState(false);

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

  const authorize = useCallback(async () => {
    const oidcAuthData = loadOidcAuthData(authConfiguration);

    getPkce(50, (error, { verifier, challenge }) => {
      error && console.log('getPkce ~ error', error);
      const storedChallenge = authConfiguration?.pkceMode === 'S256' ? challenge : base64_urlencode(verifier);
      Auth.setPkceData(storedChallenge, verifier);

      const queryParams = objectToQueryParam({
        response_type: 'code',
        client_id: authConfiguration?.clientId,
        scope: authConfiguration?.scopes?.join(' '),
        state: oidcAuthData?.state,
        redirect_uri: oidcAuthData?.redirectUri,
        nonce: oidcAuthData?.nonce,
        ...(authConfiguration?.pkceActive && {
          code_challenge: storedChallenge,
          code_challenge_method: authConfiguration?.pkceMode,
        }),
      });

      window.location.replace(`${authConfiguration?.authUrl}?${queryParams}`);
    });
  }, [authConfiguration]);

  return {
    authorize,
    authorizeDone,
    error,
  };
}
