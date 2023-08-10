import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { useSaml } from './SamlContext';

export interface ContextIdProviderProps {
  children?: any;
}

export interface ContextIdContextProps {
  fetchContextId?: (options?: any) => void;
  contextId: string | null;
  setContextId: Dispatch<SetStateAction<string | null>>;
}

export const useContextId = () => useContext<ContextIdContextProps>(ContextIdContext);

export const ContextIdContext = createContext({} as ContextIdContextProps);

export const ContextIdProvider = ({ children }: ContextIdProviderProps) => {
  const getContextIdStorageKey = () => {
    return Local.contextId.createKey(dydu.getBotId(), configuration?.application?.directory);
  };

  const getContextIdFromLocalStorage = () => {
    const lcContextIdKey = getContextIdStorageKey();
    return Local.contextId.load(lcContextIdKey);
  };

  const saveContextIdToLocalStorage = (value) => {
    try {
      const lcContextIdKey = getContextIdStorageKey();
      Local.contextId.save(lcContextIdKey, value);
    } catch (e) {
      return console.error('While executing setContextId : ', e);
    }
  };

  const { configuration } = useConfiguration();
  const { connected: saml2Connected, saml2enabled } = useSaml();
  const [contextId, setContextId] = useState<string | null>(getContextIdFromLocalStorage() || null);

  const updateContextId = (id: string) => {
    dydu.setContextId(id);
    saveContextIdToLocalStorage(id);
  };

  const fetchContextId = () => {
    const isLivechatOn = Local.isLivechatOn.load();

    return new Promise(() => {
      if (!isLivechatOn) {
        dydu
          .getContextId()
          ?.then((response) => {
            response?.contextId && setContextId(response?.contextId);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const [prevContext, setPrevContext] = useState<string | null>(localStorage.getItem('dydu.context'));

  useEffect(() => {
    contextId && updateContextId(contextId);
    for (const key in localStorage) {
      if (key.startsWith('pushruleTrigger') && prevContext !== contextId) {
        localStorage.removeItem(key);
      }
    }
    if (contextId !== null) {
      setPrevContext(contextId);
    }
  }, [contextId]);

  useEffect(() => {
    dydu.setUpdateContextId(setContextId);
    if (!saml2enabled || (saml2enabled && saml2Connected)) {
      fetchContextId();
    }
  }, [saml2enabled, saml2Connected]);

  const props: ContextIdContextProps = {
    contextId,
    setContextId,
    fetchContextId,
  };

  const renderChildren = () => contextId && children;

  return <ContextIdContext.Provider value={props}>{renderChildren()}</ContextIdContext.Provider>;
};
