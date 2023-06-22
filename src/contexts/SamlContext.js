/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';

import { Local } from '../tools/storage';
import Storage from '../components/auth/Storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { useIdleTimer } from 'react-idle-timer';

export const useSaml = () => useContext(SamlContext);

export const SamlContext = createContext({});

export const SamlProvider = ({ children }) => {
  const { configuration } = useConfiguration();

  const [user, setUser] = useState(null);

  const [saml2Info, setSaml2Info] = useState(Local.saml.load());
  const [userInfo, setUserInfo] = useState(Storage.loadUserInfo());
  const [redirectUrl, setRedirectUrl] = useState(null);

  const relayState = encodeURI(window.location.href);
  // const relayState = JSON.stringify({
  //   redirection: encodeURI(window.location.href),
  //   bot: Local.get(Local.names.botId),
  // }).replaceAll(`"`, `'`);
  // Added replace for double to single quotes besoin server parse it wrong and double it.

  const checkSession = () => {
    try {
      return new Promise(() => {
        dydu
          .getSaml2Status(saml2Info)
          ?.then((response) => {
            try {
              const { values } = JSON.parse(response);
              const auth = atob(values?.auth);
              setSaml2Info(auth);
              Local.saml.save(auth);
              setRedirectUrl(`${atob(values?.redirection_url)}&RelayState=${relayState}`);
            } catch {
              // console.log('valid saml token');
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

  const fetchUserinfo = () => {
    return new Promise(() => {
      dydu
        .getSaml2UserInfo(saml2Info)
        .then((response) => {
          try {
            const data = response?.attribute || {};
            setUserInfo(data);
            response?.attribute && Storage.saveUserInfo(data);
          } catch {
            console.log('error Userinfo');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  useIdleTimer({
    debounce: 500,
    onIdle: () => configuration?.saml?.enable && checkSession(),
    timeout: 30 * 60 * 1000, // 30mn in milliseconds
  });

  const logout = () => setUser(null);

  useEffect(() => {
    if (configuration?.saml?.enable && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  useEffect(() => {
    configuration?.saml?.enable && checkSession();
  }, [configuration?.saml?.enable]);

  useEffect(() => {
    saml2Info && fetchUserinfo();
  }, [saml2Info]);

  const value = {
    user,
    setUser,
    logout,
    saml2Info,
    setSaml2Info,
    checkSession,
    redirectUrl,
  };

  const renderChildren = () => {
    if (configuration?.saml?.enable) {
      return !userInfo && !saml2Info ? <></> : children;
    }
    return children;
  };

  return <SamlContext.Provider value={value}>{renderChildren()}</SamlContext.Provider>;
};
