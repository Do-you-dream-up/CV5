import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { currentLocationContainsCodeParameter, currentLocationContainsError, isDefined } from './helpers';

import PropTypes from 'prop-types';
import Storage from './Storage';
import axios from 'axios';
import dydu from '../../tools/dydu';
import { isLoadedFromChannels } from '../../tools/wizard';
import jwtDecode from 'jwt-decode';
import useAuthorizeRequest from './hooks/useAuthorizeRequest';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useTokenRequest from './hooks/useTokenRequest';
import useUserInfo from './hooks/useUserInfo';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children, configuration }) {
  const [token, setToken] = useState(Storage.loadToken());
  const { configuration: appConfiguration } = useConfiguration();
  const [urlConfig, setUrlConfig] = useState(Storage.loadUrls() || null);
  const [isLoggedIn, setIsLoggedIn] = useState(isDefined(token?.access_token) || false);
  const [userInfo, setUserInfo] = useState(null);

  const authConfig = useMemo(() => ({ ...configuration, ...urlConfig }), [urlConfig]);

  const { authorize } = useAuthorizeRequest(authConfig);
  const { fetchToken, tokenRetries } = useTokenRequest(authConfig);
  const { getUserInfoWithToken } = useUserInfo(authConfig);

  useEffect(() => {
    if (tokenRetries > 3) {
      login();
    }
  }, [tokenRetries]);

  const fetchUrlConfig = () =>
    axios.get(configuration.discoveryUrl).then(({ data }) => {
      const config = {
        authUrl: data?.authorization_endpoint,
        tokenUrl: data?.token_endpoint,
      };
      Storage.saveUrls(config);
      setUrlConfig(config);
    });

  useEffect(() => {
    dydu.setOidcLogin(authorize);
  }, []);

  useLayoutEffect(() => {
    appConfiguration?.oidc?.enable && !urlConfig && fetchUrlConfig();
  }, []);

  useEffect(() => {
    const canRequestToken =
      urlConfig &&
      currentLocationContainsCodeParameter() &&
      Storage.containsPkce() &&
      !isDefined(token?.access_token) &&
      !currentLocationContainsError();

    if (canRequestToken)
      fetchToken().then((tkn) => {
        setIsLoggedIn(true);
        setToken(tkn);
      });
  }, [fetchToken, token, token?.access_token, urlConfig]);

  useEffect(() => {
    if (isLoggedIn && token) {
      try {
        const userInfo = jwtDecode(token?.id_token);
        setUserInfo(userInfo);
      } catch (error) {
        console.error(error);
      }
    }
  }, [token, isLoggedIn, getUserInfoWithToken]);

  const login = useCallback(() => {
    const canRequestAuthorize =
      urlConfig && !token && !currentLocationContainsCodeParameter() && !currentLocationContainsError();
    if (tokenRetries > 3 || canRequestAuthorize) authorize();
  }, [authorize, isLoggedIn, tokenRetries, urlConfig]);

  const dataContext = useMemo(
    () => ({
      userInfo,
      isLoggedIn,
      login,
      token,
      urlConfig,
      ...authConfig,
    }),
    [authConfig, isLoggedIn, login, token, userInfo],
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
  configuration: PropTypes.shape({
    clientId: PropTypes.string,
    tokenPath: PropTypes.string,
    redirectUri: PropTypes.string,
    discoveryUrl: PropTypes.string,
    scope: PropTypes.array,
  }),
};

AuthProtected.propTypes = {
  children: PropTypes.any,
  enable: PropTypes.bool,
};
