import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

import dotget from '../tools/dotget';
import { eventNewMessage } from '../events/chatboxIndex';
import { useConfiguration } from './ConfigurationContext';
import useTabNotification from '../tools/hooks/useBlinkTitle';
import { useTranslation } from 'react-i18next';
import { useViewMode } from './ViewModeProvider';

interface EventsContextProps {
  isChatboxLoadedAndReady?: boolean;
  hasAfterLoadBeenCalled?: boolean;
  onAppReady?: () => void;
  onChatboxLoaded?: (chatboxNodeElement: any) => void;
  onNewMessage?: () => void;
  onEvent?: (feature: any) => (event: any, ...rest: any[]) => void;
  event?: (str: string) => void;
  dispatchEvent?: (featureName: string, eventName: string, ...rest: any[]) => void;
  getChatboxRef?: () => null;
  fetchServerStatus?: any;
  serverStatusChecked?: boolean;
}

interface EventsProviderProps {
  children: ReactElement;
}

export const useEvent = () => useContext(EventsContext);

export const EventsContext = createContext<EventsContextProps>({});

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { isOpen } = useViewMode();
  const { setTabNotification, clearTabNotification } = useTabNotification();
  const { configuration } = useConfiguration();

  const [event, setEvent] = useState<any | null>();
  const [afterLoadCalled, setAfterLoadCalled] = useState<any>(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [chatboxLoaded, setChatboxLoaded] = useState(false);
  const [chatboxRef, setChatboxRef] = useState<any>();

  const { t } = useTranslation('translation');
  const newMessageText = t('livechat.notif.newMessage');

  useEffect(() => {
    document.addEventListener('mouseenter', clearTabNotification);
    return () => {
      document.removeEventListener('mouseenter', clearTabNotification);
    };
  }, [chatboxRef]);

  const onNewMessage = useCallback(() => {
    if (isOpen) {
      chatboxRef?.dispatchEvent(eventNewMessage);
      setTabNotification(newMessageText);
    }
  }, [isOpen]);

  const saveChatboxRef = (ref: any) => setChatboxRef(ref);

  const execDyduAfterLoad = () =>
    new Promise((resolve) => {
      const _fnAfterLoad = window?.dyduAfterLoad;
      if (isDefined(_fnAfterLoad) && isOfTypeFunction(_fnAfterLoad())) _fnAfterLoad();
      resolve(true);
    });

  const hasAfterLoadBeenCalled = useMemo(() => afterLoadCalled === true, [afterLoadCalled]);

  const processDyduAfterLoad = useCallback(() => {
    if (!hasAfterLoadBeenCalled) execDyduAfterLoad().then(setAfterLoadCalled);
  }, [hasAfterLoadBeenCalled]);

  const isChatboxLoadedAndReady = useMemo(() => chatboxLoaded && isAppReady, [chatboxLoaded, isAppReady]);

  useEffect(() => {
    if (!isChatboxLoadedAndReady) return;
    const bootstrapAfterLoadAndReadyFnList = [processDyduAfterLoad];
    bootstrapAfterLoadAndReadyFnList.forEach((fn) => fn());
  }, [isChatboxLoadedAndReady, processDyduAfterLoad]);

  const onAppReady = useCallback(() => setIsAppReady(true), []);

  const onChatboxLoaded = useCallback((chatboxNodeElement) => {
    saveChatboxRef(chatboxNodeElement);
    setChatboxLoaded(true);
  }, []);

  const onEvent =
    (feature) =>
    (event, ...rest) => {
      setEvent(`${feature}/${event}`);
      if (configuration?.events.active) {
        const actions = (configuration?.events?.[feature] || {})[event];
        if (Array.isArray(actions)) {
          actions.forEach((action) => {
            if (configuration?.events.verbosity > 1) {
              console.info(`[Dydu][${feature}:${event}] '${action}' ${rest}`);
            }
            const f = dotget(window, action);
            if (typeof f === 'function') {
              f(...rest);
            } else if (configuration?.events.verbosity > 0) {
              console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
            }
          });
        }
      }
    };

  const dispatchEvent = (featureName, eventName, ...rest) => {
    const eventHandler = onEvent(featureName);

    eventHandler && eventHandler(eventName, ...rest);
  };

  return (
    <EventsContext.Provider
      children={children}
      value={{
        isChatboxLoadedAndReady,
        hasAfterLoadBeenCalled,
        onAppReady,
        onChatboxLoaded,
        onNewMessage,
        onEvent,
        dispatchEvent,
        event,
        getChatboxRef: () => chatboxRef,
      }}
    />
  );
};
