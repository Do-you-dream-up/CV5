import { extractParamFromUrl, getRedirectUri, removeQueryFromUri, responseToJsonOrThrowError } from '../helpers';
import { useCallback, useState } from 'react';

import Auth, { Session } from '../../../tools/storage';
import { useHarmonicIntervalFn } from 'react-use';
import { setCallTokenRefresher } from '../../../tools/axios';
import jwtDecode from 'jwt-decode';

export default function useTokenRequest(authConfiguration) {
  const [error, setError] = useState(false);
  const [tokenRetries, setTokenRetries] = useState(Auth.retry.load());

  let { tokenUrl, pkceActive, nonceActive } = authConfiguration;

  const cleanUrl = () => {
    if (extractParamFromUrl('code')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      url.searchParams.delete('session_state');
      url.searchParams.delete('error');
      window.history.replaceState(null, '', url);
    }
  };

  function buildOptionsFetch(isRefreshTokenGrant) {
    const payload = {
      redirect_uri: removeQueryFromUri(getRedirectUri()),
      ...{
        client_id: authConfiguration.clientId,
        ...(authConfiguration.clientSecret && { client_secret: authConfiguration.clientSecret }),
        grant_type: isRefreshTokenGrant ? 'refresh_token' : 'authorization_code',
        ...(!isRefreshTokenGrant && { code: extractParamFromUrl('code') }),
        ...(!isRefreshTokenGrant && pkceActive && { code_verifier: Auth.loadPkceCodeVerifier() }),
        ...(isRefreshTokenGrant && { refresh_token: Auth.loadToken()?.refresh_token }),
      },
    };

    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      body: new URLSearchParams(payload),
    };
  }

  const fetchToken = useCallback(() => {
    if (tokenRetries > 3) {
      console.log('Max token retries reached. Aborting token request.');
      Auth.clearOidcAuthData();
      return Promise.reject(new Error('Max retries reached'));
    }

    console.log('/* PREPARE FETCH TOKEN REQUEST */');

    const isRefreshTokenGrant = Auth.loadToken()?.refresh_token;

    const optionFetch = buildOptionsFetch(isRefreshTokenGrant);

    return fetch(tokenUrl, optionFetch)
      .then((r) => responseToJsonOrThrowError(r, 'token fetch'))
      .then((token) => {
        if (tokenRetries > 3) {
          console.log('Max token retries reached. Aborting token request.');
          Auth.clearOidcAuthData();
          return Promise.reject(new Error('Max retries reached'));
        }

        // Check nonce and reject token if not equals, for grant_type authorization_code only
        if (token.id_token && !isRefreshTokenGrant) {
          const idTokenPayload = jwtDecode(token.id_token);

          if (nonceActive) {
            const storedNonce = Session.nonce.load();
            if (!storedNonce) {
              console.log('nonce generation needed');
              return { isInvalid: true };
            } else if (idTokenPayload.nonce !== storedNonce) {
              console.error('Nonce mismatch! Potential Replay Attack.', storedNonce, idTokenPayload.nonce);
              Auth.clearOidcAuthData();
              Auth.clearToken();
              throw new Error('OIDC_NONCE_FATAL_ERROR');
            }
          }
        }

        const { expires_in } = token;
        if (expires_in && Number.isFinite(expires_in)) {
          const slackSeconds = 10;
          // add 'expires_at', with the given slack
          token.expires_at = new Date(new Date().getTime() + expires_in * 1000 - slackSeconds * 1000);
        }
        setTokenRetries(0);
        Auth.retry.reset();

        token.isInvalid = false;
        Auth.saveToken(token);
        return token;
      })
      .catch((e) => {
        if (e.message === 'OIDC_NONCE_FATAL_ERROR') {
          console.error('error fetching token (nonce error)');
          throw new Error('OIDC_NONCE_FATAL_ERROR');
        }

        if (e.message !== 'NONCE_FAILED_FATAL') {
          console.error('error fetching token (retryable)');
        }

        const currentRetries = Auth.retry.load();
        const newRetries = currentRetries + 1;
        Auth.retry.save(newRetries);
        setTokenRetries(newRetries);

        setError(e);
        throw new Error('ERROR_TOKEN_EXCHANGE_RETRYABLE');
      })
      .finally(() => {
        cleanUrl();
      });
  }, [authConfiguration, setTokenRetries, setError]);

  useHarmonicIntervalFn(() => {
    if (authConfiguration?.enable) {
      console.log('/* Refresh Token - 30mn */');
      fetchToken(); // refresh token every 30mn
    }
  }, 60 * 1000 * 30);

  setCallTokenRefresher(fetchToken);

  return {
    fetchToken,
    tokenRetries,
    error,
  };
}
