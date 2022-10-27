import {
  currentLocationContainsCodeParamater,
  currentLocationContainsError,
  extractObjectFields,
  extractParamFromUrl,
  isDefined,
  loadPkce,
  objectToQueryParam,
  snakeCaseFields,
} from '../helpers';
import { useCallback, useEffect, useState } from 'react';

import { Cookie } from '../../../tools/storage';
import Storage from '../Storage';
import getPkce from 'oauth-pkce';

export default function useAuthorizeRequest(configuration) {
  const [authorizeDone, setAuthorizeDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (currentLocationContainsCodeParamater() && isDefined(Storage.loadPkce())) setAuthorizeDone(true);
    else if (currentLocationContainsError()) {
      Storage.clearPkce();
      setError(true);
      throw new Error(
        'authorization request error, aborting process',
        extractParamFromUrl(['error', 'error_description']),
      );
    }
  }, []);

  const authorize = useCallback(async () => {
    const pkce = loadPkce();
    // console.log('/* PREPARE AUTHORIZE REQUEST */', { pkce });

    getPkce(50, (error, { verifier, challenge }) => {
      if (!Cookie.get('dydu-code-challenge')) {
        Cookie.set('dydu-code-verifier', verifier);
        Cookie.set('dydu-code-challenge', challenge);
      }
    });

    /*
      construct query params
     */
    const query = {
      responseType: 'code',
      ...extractObjectFields(configuration, ['clientId', 'scope']),
      ...extractObjectFields(pkce, ['state', 'redirectUri']),
      ...{
        codeChallenge: Cookie.get('dydu-code-challenge'),
        codeChallengeMethod: 'S256',
      },
    };

    console.log('authorize: query', JSON.stringify(query));

    const queryParams = objectToQueryParam(snakeCaseFields(query));
    console.log('authorize: queryParams', JSON.stringify(queryParams));

    /*
      construct url
     */
    let { provider, authorizePath = '/authorize' } = configuration;
    if (!authorizePath.startsWith('/')) authorizePath = '/' + authorizePath;
    const url = provider + authorizePath + '?' + queryParams;
    console.log('authorize: url', url);

    window.location.replace(url);
  }, [configuration]);

  return {
    authorize,
    authorizeDone,
    error,
  };
}
