/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState } from 'react';

import { Local } from '../../tools/storage';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../ConfigurationContext';
import { useIdleTimer } from 'react-idle-timer';

export const SamlContext = createContext({});

export const SamlProvider = ({ children }) => {
  const { configuration } = useConfiguration();
  const [user, setUser] = useState(null);
  const [saml2Info, setSaml2Info] = useState(Local.saml.load());
  const [redirectUrl, setRedirectUrl] = useState(null);

  const isSamlActive = () => configuration?.saml?.enable;
  console.log('🚀 ~ file: SamlProvider.js ~ line 18 ~ SamlProvider ~ isSamlActive', isSamlActive());

  const checkSession = () => {
    try {
      new Promise((resolve) => {
        dydu
          .getSaml2Status(saml2Info)
          .then((response) => {
            try {
              const { values } = JSON.parse(response);
              const auth = atob(values?.auth);
              setSaml2Info(auth);
              Local.saml.save(auth);
              setRedirectUrl(atob(values?.redirection_url));
              resolve(true);
            } catch {
              console.log('valid saml token');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useIdleTimer({
    debounce: 500,
    onIdle: () => isSamlActive() && checkSession(),
    timeout: 30 * 60 * 1000, // 2H in milliseconds
  });

  const logout = () => setUser(null);

  useEffect(() => {
    if (isSamlActive() && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  useEffect(async () => {
    isSamlActive() && (await checkSession());
  }, []);

  const value = {
    user,
    setUser,
    logout,
    saml2Info,
    setSaml2Info,
    checkSession,
  };

  const renderChildren = () => {
    if (isSamlActive()) {
      return !saml2Info ? <></> : children;
    }
    return children;
  };

  return <SamlContext.Provider value={value}>{renderChildren()}</SamlContext.Provider>;
};
