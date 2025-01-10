/* eslint-disable react/prop-types */
import { createContext, useEffect } from 'react';

import Auth from '../tools/storage';
import { isLoadedFromChannels } from '../tools/wizard';
import { useConfiguration } from './ConfigurationContext';
import { useViewMode } from './ViewModeProvider';
import { VIEW_MODE } from '../tools/constants';

export const OidcContext = createContext({});

export const OidcProvider = ({ children }) => {
  const token = Auth.loadToken();
  const { configuration } = useConfiguration();

  const { toggle } = useViewMode();

  const hasAuthStorageCheck = configuration?.checkAuthorization?.active;

  useEffect(() => {
    if (hasAuthStorageCheck && !token?.access_token) toggle(VIEW_MODE.close);
  }, [hasAuthStorageCheck, token?.access_token]);

  const value = {};

  const displayChatbox = () => {
    if (configuration?.oidc?.enable && !token?.access_token) {
      return false;
    }
    return true;
  };

  const renderChildren = () => (isLoadedFromChannels() || displayChatbox() ? children : <></>);

  return <OidcContext.Provider value={value}>{renderChildren()}</OidcContext.Provider>;
};
