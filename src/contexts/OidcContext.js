/* eslint-disable react/prop-types */
import { AuthProtected, AuthProvider } from '../components/auth/context/AuthContext';
import React, { createContext, useEffect, useMemo } from 'react';

import Storage from '../components/auth/Storage';
import { useConfiguration } from './ConfigurationContext';
import { useViewMode } from './ViewModeProvider';

export const OidcContext = createContext({});

export const OidcProvider = ({ children }) => {
  const token = Storage.loadToken();
  const { configuration } = useConfiguration();

  const { close } = useViewMode();

  const hasAuthStorageCheck = configuration.checkAuthorization?.active;

  useEffect(() => {
    if (hasAuthStorageCheck && !token?.access_token) close();
  }, [close, hasAuthStorageCheck, token?.access_token]);

  const authConfiguration = useMemo(() => {
    return {
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: configuration?.oidc?.clientSecret,
      pkceActive: configuration?.oidc?.pkceActive,
      pkceMode: configuration?.oidc?.pkceMode,
      provider: process.env.OIDC_URL,
      scope: configuration?.oidc?.scopes,
      authorizePath: '/auth',
    };
  }, [configuration?.oidc?.scopes]);

  const value = {};

  const displayChatbox = () => {
    if (configuration?.oidc?.enable && token?.access_token) {
      return true;
    }
    if (configuration?.oidc?.enable && !token?.access_token) {
      return false;
    }
    return false;
  };

  const renderChildren = () => (displayChatbox() ? children : <></>);

  return (
    <OidcContext.Provider value={value}>
      <AuthProvider configuration={authConfiguration}>
        <AuthProtected enable={configuration?.oidc?.enable}>{renderChildren()}</AuthProtected>
      </AuthProvider>
    </OidcContext.Provider>
  );
};
