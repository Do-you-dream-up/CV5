import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { currentLocationContainsCodeParamater, currentLocationContainsError, isDefined } from '../helpers';

import PropTypes from 'prop-types';
import Storage from '../Storage';
import { getOidcEnableStatus } from '../../../tools/oidc';
import { isLoadedFromChannels } from '../../../tools/wizard';
import jwtDecode from 'jwt-decode';
import useAuthorizeRequest from '../hooks/useAuthorizeRequest';
import useTokenRequest from '../hooks/useTokenRequest';
import useUserInfo from '../hooks/useUserInfo';

const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children, configuration }) {
  const [token, setToken] = useState(Storage.loadToken());
  const [isLoggedIn, setIsLoggedIn] = useState(isDefined(token?.access_token) || false);
  const [userInfo, setUserInfo] = useState(null);

  const { authorize } = useAuthorizeRequest(configuration);
  const { fetchToken, tokenRetries } = useTokenRequest(configuration);
  const { getUserInfoWithToken } = useUserInfo(configuration);

  useEffect(() => {
    if (tokenRetries > 3) {
      login();
      Storage.clearToken();
    }
  }, [tokenRetries]);

  useEffect(() => {
    const canRequestToken =
      currentLocationContainsCodeParamater() &&
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
        const userInfo = jwtDecode(token?.access_token);
        setUserInfo(userInfo);
      } catch (error) {
        console.error(error);
      }
    }
  }, [token, isLoggedIn, getUserInfoWithToken]);

  const login = useCallback(() => {
    console.log('LOGIN TRY');
    const canRequestAuthorize =
      getOidcEnableStatus() &&
      !isLoggedIn &&
      !currentLocationContainsCodeParamater() &&
      !currentLocationContainsError();

    if (tokenRetries > 3 || canRequestAuthorize) authorize();
  }, [authorize, isLoggedIn, tokenRetries]);

  const dataContext = useMemo(
    () => ({
      userInfo,
      isLoggedIn,
      login,
      token,
      ...configuration,
    }),
    [configuration, isLoggedIn, login, token, userInfo],
  );

  return <AuthContext.Provider value={dataContext}>{children}</AuthContext.Provider>;
}

export function AuthProtected({ children, enable = false }) {
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (!isLoadedFromChannels()) {
      console.log('AuthProtected/Effect() :', { isLoggedIn });
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
    authUrl: PropTypes.string,
    tokenUrl: PropTypes.string,
    scope: PropTypes.array,
  }),
};

AuthProtected.propTypes = {
  children: PropTypes.any,
  enable: PropTypes.bool,
};
