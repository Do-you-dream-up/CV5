import {
  extractObjectFields,
  extractParamFromUrl,
  isDefined,
  loadPkce,
  removeQueryFromUri,
  responseToJsonOrThrowError,
  snakeCaseFields,
} from '../helpers';
import { useCallback, useEffect, useState } from 'react';

import { Cookie } from '../../../tools/storage';
import Storage from '../Storage';
import dydu from '../../../tools/dydu';

export default function useTokenRequest(configuration) {
  const [error, setError] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [tokenRetries, setTokenRetries] = useState(0);

  let { tokenUrl, pkceActive } = configuration;

  const fetchToken = useCallback(() => {
    console.log('/* PREPARE FETCH TOKEN REQUEST */');
    /*
      construct payload
     */
    const payload = {
      ...snakeCaseFields(extractObjectFields(loadPkce(), ['redirectUri'])),
      ...{
        client_id: configuration.clientId,
        client_secret: configuration.clientSecret,
        grant_type: Storage.loadToken()?.refresh_token ? 'refresh_token' : 'authorization_code',
        ...(!Storage.loadToken()?.refresh_token && { code: extractParamFromUrl('code') }),
        ...(pkceActive && { code_verifier: Cookie.get('dydu-code-verifier') }),
        ...(Storage.loadToken()?.refresh_token && { refresh_token: Storage.loadToken()?.refresh_token }),
      },
    };

    if (isDefined(configuration?.clientSecret)) payload.client_secret = configuration?.clientSecret;

    const redirectUri = removeQueryFromUri(payload.redirect_uri);
    payload.redirect_uri = redirectUri;

    /*
      construct fetchOption
     */
    const optionFetch = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      body: new URLSearchParams(payload),
    };

    /*
      process fetch
     */
    return fetch(tokenUrl, optionFetch)
      .then((r) => responseToJsonOrThrowError(r, 'token fetch'))
      .then((token) => {
        const { expires_in } = token;
        if (expires_in && Number.isFinite(expires_in)) {
          const slackSeconds = 10;
          // add 'expires_at', with the given slack
          token.expires_at = new Date(new Date().getTime() + expires_in * 1000 - slackSeconds * 1000);
        }
        setTokenRetries(0);
        setCurrentToken(token);
        return token;
      })
      .catch((e) => {
        console.error('error fetching token');
        setTokenRetries(tokenRetries + 1);
        setError(e);
        throw new Error('error: fetching token', e);
      });
  }, [configuration, tokenRetries]);

  useEffect(() => {
    const token = currentToken || Storage.loadToken();
    if (token) {
      Storage.saveToken(token);
      token?.refresh_token && dydu.setTokenRefresher(fetchToken);
    }
  }, [currentToken, fetchToken]);

  return {
    fetchToken,
    tokenRetries,
    error,
  };
}