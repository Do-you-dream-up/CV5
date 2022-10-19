/* eslint-disable react/prop-types */
import React, { createContext, useState } from 'react';

export const SamlContext = createContext({});

export const SamlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [saml2Info, setSaml2Info] = useState(null);

  const logout = () => setUser(null);

  const value = {
    user,
    setUser,
    logout,
    saml2Info,
    setSaml2Info,
  };

  return <SamlContext.Provider value={value}>{children}</SamlContext.Provider>;
};
