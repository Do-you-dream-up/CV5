import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

import VisitManager from '../tools/RG/VisitManager';
import dotget from '../tools/dotget';
import { eventNewMessage } from '../events/chatboxIndex';
import { useConfiguration } from './ConfigurationContext';
import useServerStatus from '../tools/hooks/useServerStatus';
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
  const { checked: serverStatusChecked, fetch: fetchServerStatus } = useServerStatus();
  const { t } = useTranslation('translation');
  const newMessageText = t('livechat.notif.newMessage');
  let chatboxRef: any;

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

  const saveChatboxRef = (ref: any) => (chatboxRef = ref);

  const execDyduAfterLoad = () =>
    new Promise((resolve) => {
      const _fnAfterLoad = window?.dyduAfterLoad;
      if (isDefined(_fnAfterLoad) && isOfTypeFunction(_fnAfterLoad())) _fnAfterLoad();
      resolve(true);
    });

  const hasAfterLoadBeenCalled = useMemo(() => afterLoadCalled === true, [afterLoadCalled]);

  const processUserVisit = useCallback(async () => {
    if (serverStatusChecked) {
      await VisitManager.refreshRegisterVisit();
    }
  }, [serverStatusChecked]);

  const processDyduAfterLoad = useCallback(() => {
    if (!hasAfterLoadBeenCalled) execDyduAfterLoad().then(setAfterLoadCalled);
  }, [hasAfterLoadBeenCalled]);

  const isChatboxLoadedAndReady = useMemo(() => chatboxLoaded && isAppReady, [chatboxLoaded, isAppReady]);

  useEffect(() => {
    if (!isChatboxLoadedAndReady) return;
    const bootstrapAfterLoadAndReadyFnList = [processDyduAfterLoad, processUserVisit];
    bootstrapAfterLoadAndReadyFnList.forEach((fn) => fn());
  }, [isChatboxLoadedAndReady, processDyduAfterLoad, processUserVisit]);

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

  useEffect(() => {
    fetchServerStatus();
  }, [fetchServerStatus]);

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
        fetchServerStatus,
        serverStatusChecked,
      }}
    />
  );
};
