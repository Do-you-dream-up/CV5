import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Local } from '../tools/storage';
import Storage from '../components/auth/Storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { useIdleTimer } from 'react-idle-timer';

export interface SamlProviderProps {
  children?: any;
}

export interface SamlContextProps {
  user: any;
  setUser: Dispatch<SetStateAction<null>>;
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  saml2Info: any;
  setSaml2Info: any;
  saml2enabled?: boolean;
  checkSession: () => void;
  redirectUrl: string | null;
}

export const useSaml = () => useContext<SamlContextProps>(SamlContext);

export const SamlContext = createContext({} as SamlContextProps);

export const SamlProvider = ({ children }: SamlProviderProps) => {
  const { configuration } = useConfiguration();

  const [user, setUser] = useState(null);

  const [saml2Info, setSaml2Info] = useState(Local.saml.load());
  const [userInfo, setUserInfo] = useState(Storage.loadUserInfo());
  const [connected, setConnected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<null | string>(null);

  const relayState = encodeURI(window.location.href);
  // const relayState = JSON.stringify({
  //   redirection: encodeURI(window.location.href),
  //   bot: Local.get(Local.names.botId),
  // }).replaceAll(`"`, `'`);
  // Added replace for double to single quotes besoin server parse it wrong and double it.

  const saml2enabled = useMemo(() => configuration?.saml?.enable, [configuration]);

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
              console.log('--- SAML2 NOT CONNECTED : Redirect user to provider login ---');
              setRedirectUrl(`${atob(values?.redirection_url)}&RelayState=${relayState}`);
            } catch {
              console.log('--- SAML2 CONNECTED ---');
              setConnected(true);
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

  const props: SamlContextProps = {
    user,
    setUser,
    logout,
    saml2Info,
    setSaml2Info,
    checkSession,
    redirectUrl,
    connected,
    setConnected,
    saml2enabled,
  };

  const renderChildren = () => {
    if (configuration?.saml?.enable) {
      return !userInfo && !saml2Info ? <></> : children;
    }
    return children;
  };

  return <SamlContext.Provider value={props}>{renderChildren()}</SamlContext.Provider>;
};
