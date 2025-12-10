import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { currentLocationContainsCodeParameter, currentLocationContainsError, isDefined } from './helpers';

import PropTypes from 'prop-types';
import Auth from '../../tools/storage';
import axios from 'axios';
import { isLoadedFromChannels } from '../../tools/wizard';
import useAuthorizeRequest from './hooks/useAuthorizeRequest';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useTokenRequest from './hooks/useTokenRequest';
import { setCallOidcLogin } from '../../tools/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(Auth.loadToken());
  const { configuration } = useConfiguration();
  const [urlConfig, setUrlConfig] = useState(Auth.loadOidcUrls() || null);
  const [isLoggedIn, setIsLoggedIn] = useState(isDefined(token?.access_token) || false);
  const [isCodeHandled, setIsCodeHandled] = useState(false);

  const authConfig = useMemo(() => ({ ...configuration?.oidc, ...urlConfig }), [urlConfig]);

  const { authorize } = useAuthorizeRequest(authConfig);
  const { fetchToken, tokenRetries } = useTokenRequest(authConfig);

  useEffect(() => {
    if (tokenRetries > 3) {
      console.error('Token retries limit reached. Forcing new authorization flow.');
      Auth.clearToken();
      login();
    }
  }, [tokenRetries, login]);

  const fetchUrlConfig = () => {
    if (authConfig.discoveryUrl) {
      axios.get(authConfig.discoveryUrl)?.then(({ data }) => {
        Auth.clearUserInfo();
        Auth.clearOidcUrls();
        const config = {
          authUrl: data?.authorization_endpoint,
          tokenUrl: data?.token_endpoint,
          userinfoUrl: data?.userinfo_endpoint,
        };
        Auth.saveOidcUrls(config);
        setUrlConfig(config);
      });
    } else {
      Auth.clearUserInfo();
      Auth.clearOidcUrls();
      const config = {
        authUrl: authConfig?.authUrl,
        tokenUrl: authConfig?.tokenUrl,
      };
      Auth.saveOidcUrls(config);
      setUrlConfig(config);
    }
  };

  const fetchUserinfo = () =>
    axios
      .get(urlConfig?.userinfoUrl, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
        },
      })
      ?.then(({ data }) => data && Auth.saveUserInfo(data))
      .catch((err) => {
        console.log("Can't fetch user info : ", err);
        Auth.clearToken();
        login();
      });

  useEffect(() => {
    setCallOidcLogin(authorize);
  }, []);

  useLayoutEffect(() => {
    authConfig?.enable && !urlConfig && fetchUrlConfig();
  }, []);

  useEffect(() => {
    token?.access_token && urlConfig?.userinfoUrl && fetchUserinfo();
  }, [token, urlConfig]);

  useEffect(() => {
    const codePresent = currentLocationContainsCodeParameter();

    if (isCodeHandled && codePresent) {
      console.log('Code present but already handled. Waiting for URL clean.');
      return;
    }

    const codeInUrl = currentLocationContainsCodeParameter();
    const isTokenExchangeAllowed = tokenRetries <= 3;

    const canRequestToken =
      urlConfig &&
      codeInUrl &&
      (!authConfig?.pkceActive || isDefined(Auth.loadPkceCodeChallenge())) &&
      !isDefined(token?.access_token) &&
      !currentLocationContainsError() &&
      isTokenExchangeAllowed;

    if (canRequestToken && !isCodeHandled) {
      setIsCodeHandled(true);

      fetchToken()
        .then((tkn) => {
          if (tkn && !tkn.isInvalid) {
            console.log('Token exchange successful.');
            setIsLoggedIn(true);
            setToken(tkn);
          } else {
            clearAndLogin();
          }
        })
        .catch((error) => {
          console.error('Fatal error during token exchange:', error);
          setIsLoggedIn(false);
          setToken(null);

          if (error.message === 'OIDC_NONCE_FATAL_ERROR') {
            console.error('Nonce mismatch detected. ABORTING OIDC FLOW. User must clear cache or manually refresh.');
            return;
          }

          clearAndLogin();
        });
    }

    if (isCodeHandled && !codeInUrl) {
      console.log('Authorization code removed from URL. Resetting code handler.');
      setIsCodeHandled(false);
    }
  }, [fetchToken, isCodeHandled, token, token?.access_token, urlConfig]);

  const clearAndLogin = useCallback(() => {
    setIsLoggedIn(false);
    Auth.clearOidcAuthData();
    Auth.clearToken();
    setToken(null);
    login();
  }, []);

  const login = useCallback(() => {
    const canRequestAuthorize =
      urlConfig && !token?.access_token && !currentLocationContainsCodeParameter() && !currentLocationContainsError();

    if (tokenRetries > 3 || canRequestAuthorize) {
      authorize();
    }
  }, [authorize, isLoggedIn, tokenRetries, urlConfig]);

  const dataContext = useMemo(
    () => ({
      isLoggedIn,
      login,
      token,
      urlConfig,
      fetchUrlConfig,
      setUrlConfig,
      ...authConfig,
    }),
    [authConfig, isLoggedIn, login, token],
  );

  return <AuthContext.Provider value={dataContext}>{children}</AuthContext.Provider>;
}

export function AuthProtected({ children, enable = false }) {
  const { isLoggedIn, login, urlConfig } = useAuth();

  useEffect(() => {
    if (!isLoadedFromChannels()) {
      if (!enable || !urlConfig) return;
      if (!isLoggedIn) login();
    }
  }, [isLoggedIn, login]);

  const canDisplayChatbot = () => {
    if (isLoadedFromChannels()) {
      return true;
    } else if (isLoggedIn && enable) {
      return true;
    } else if (!enable) {
      return true;
    }
    return false;
  };

  if (!enable) return children;

  return canDisplayChatbot() ? children : null;
}

AuthProvider.propTypes = {
  children: PropTypes.any,
};

AuthProtected.propTypes = {
  children: PropTypes.any,
  enable: PropTypes.bool,
};
