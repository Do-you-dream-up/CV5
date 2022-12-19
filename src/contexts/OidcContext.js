/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useLayoutEffect } from 'react';
import { getOidcEnableStatus, setOidcEnableCookie, setOidcWithAuthEnableCookie } from '../tools/oidc';

import Storage from '../components/auth/Storage';
import { isLoadedFromChannels } from '../tools/wizard';
import { useConfiguration } from './ConfigurationContext';
import { useViewMode } from './ViewModeProvider';

export const OidcContext = createContext({});

export const OidcProvider = ({ children }) => {
  const token = Storage.loadToken();
  const { configuration } = useConfiguration();

  const { close } = useViewMode();

  const hasAuthStorageCheck = configuration.checkAuthorization?.active;

  useLayoutEffect(() => {
    setOidcEnableCookie(configuration?.oidc?.enable);
    setOidcWithAuthEnableCookie(configuration?.oidc?.withAuth);
  }, []);

  useEffect(() => {
    if (hasAuthStorageCheck && !token?.access_token) close();
  }, [close, hasAuthStorageCheck, token?.access_token]);

  const value = {};

  const displayChatbox = () => {
    if (isLoadedFromChannels()) {
      return true;
    }
    if (getOidcEnableStatus() && !token?.access_token) {
      return false;
    }
    return true;
  };

  const renderChildren = () => (displayChatbox() ? children : <></>);

  return <OidcContext.Provider value={value}>{renderChildren()}</OidcContext.Provider>;
};
