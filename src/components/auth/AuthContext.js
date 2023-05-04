import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

  const authConfig = { ...configuration, ...urlConfig };

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
    appConfiguration?.oidc?.enable && !urlConfig && fetchUrlConfig();
    dydu.setOidcLogin(authorize);
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
  }, [fetchToken, token, token?.access_token]);

  useEffect(() => {
    if (isLoggedIn && token) {
      try {
        const userInfo = jwtDecode(token?.id_token);
        const access_token = jwtDecode(token?.access_token);
        console.log('🚀 ~ file: AuthContext.js:54 ~ useEffect ~ access_token:', access_token);
        console.log('🚀 ~ file: AuthContext.js:53 ~ useEffect ~ userInfo:', userInfo);
        setUserInfo(userInfo);
      } catch (error) {
        console.error(error);
      }
    }
  }, [token, isLoggedIn, getUserInfoWithToken]);

  const login = useCallback(() => {
    const canRequestAuthorize =
      !isLoggedIn && !currentLocationContainsCodeParameter() && !currentLocationContainsError();

    if (tokenRetries > 3 || canRequestAuthorize) authorize();
  }, [authorize, isLoggedIn, tokenRetries]);

  const dataContext = useMemo(
    () => ({
      userInfo,
      isLoggedIn,
      login,
      token,
      ...authConfig,
    }),
    [authConfig, isLoggedIn, login, token, userInfo],
  );

  return <AuthContext.Provider value={dataContext}>{children}</AuthContext.Provider>;
}

export function AuthProtected({ children, enable = false }) {
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (!isLoadedFromChannels()) {
      if (!enable) return;
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
