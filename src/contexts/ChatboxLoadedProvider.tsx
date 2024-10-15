import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';
import { useEvent } from './EventsContext';

interface ChatboxLoadedProps {
  hasAfterLoadBeenCalled?: boolean;
  isChatboxLoaded?: boolean;
  setIsAppLoaded?: (value: boolean) => void;
  setChatboxRefAndMarkAsLoaded?: (chatboxNodeElement: any) => void;
}

interface ChatboxLoadedProviderProps {
  children: ReactElement;
  areCookiesAllowed?: boolean;
}

export const useChatboxLoaded = () => useContext(ChatboxLoadedContext);

export const ChatboxLoadedContext = createContext<ChatboxLoadedProps>({});

export const ChatboxLoadedProvider = ({ children, areCookiesAllowed }: ChatboxLoadedProviderProps) => {
  const { saveChatboxRef } = useEvent();
  const [hasAfterLoadBeenCalled, setHasAfterLoadBeenCalled] = useState<boolean>(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isChatboxLoaded, setIsChatboxLoaded] = useState(false);

  const setChatboxRefAndMarkAsLoaded = useCallback((chatboxNodeElement) => {
    saveChatboxRef && saveChatboxRef(chatboxNodeElement);
    setIsChatboxLoaded(true);
  }, []);

  const executeDyduAfterLoad = () =>
    new Promise((resolve) => {
      const dyduAfterLoad = window?.dyduAfterLoad;
      if (isDefined(dyduAfterLoad) && isOfTypeFunction(dyduAfterLoad())) dyduAfterLoad();
      resolve(true);
    });

  useEffect(() => {
    if (areCookiesAllowed && isAppLoaded && isChatboxLoaded && !hasAfterLoadBeenCalled) {
      executeDyduAfterLoad().then(() => setHasAfterLoadBeenCalled(true));
    }
  }, [areCookiesAllowed, isAppLoaded, isChatboxLoaded]);

  return (
    <ChatboxLoadedContext.Provider
      value={{
        setIsAppLoaded,
        setChatboxRefAndMarkAsLoaded,
        isChatboxLoaded,
        hasAfterLoadBeenCalled,
      }}
      children={children}
    />
  );
};
