import { createContext, useContext, useEffect, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { useBotInfo } from './BotInfoContext';

export interface ContextIdProviderProps {
  children?: any;
  fetchContextId?: ()=> void;
}

export interface ContextIdContextProps {}

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
  const { currentLanguage } = useBotInfo();
  const { configuration } = useConfiguration();
  const [contextId, setContextId] = useState<string | null>(getContextIdFromLocalStorage() || null);

  const updateContextId = (id: string) => {
    dydu.setContextId(id);
    saveContextIdToLocalStorage(id);
  };

  useEffect(() => {
    fetchContextId();
  }, [currentLanguage]);

  const fetchContextId = () => {
    try {
      return new Promise(() => {
        dydu
          .getContextId()
          ?.then((response) => {
            response?.contextId && setContextId(response?.contextId);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    contextId && updateContextId(contextId);
  }, [contextId]);

  useEffect(() => {
    dydu.setUpdateContextId(setContextId);
    fetchContextId();
  }, []);

  const props: ContextIdContextProps = {
    contextId,
    setContextId,
    fetchContextId,
  };

  const renderChildren = () => contextId && children;

  return <ContextIdContext.Provider value={props}>{renderChildren()}</ContextIdContext.Provider>;
};
