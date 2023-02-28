import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

import { CHATBOX_EVENT_NAME } from '../tools/constants';
import dotget from '../tools/dotget';
import { eventNewMessage } from '../events/chatboxIndex';
import { useConfiguration } from './ConfigurationContext';
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
  const { configuration } = useConfiguration();

  const [event, setEvent] = useState<any | null>();
  const [isMouseIn, setMouseIn] = useState(false);
  const [afterLoadCalled, setAfterLoadCalled] = useState<any>(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [chatboxLoaded, setChatboxLoaded] = useState(false);

  let refBlinkInterval: any;
  let chatboxRef: any;

  const INITIAL_TITLE_TAB = document.title;
  const NEW_TITLE_TAB = '1 nouveau message';

  const saveChatboxRef = (ref: any) => (chatboxRef = ref);

  const setDocumentTitle = (text: string) => (document.title = text);

  const execDyduAfterLoad = () =>
    new Promise((resolve) => {
      const _fnAfterLoad = window?.dyduAfterLoad;
      if (isDefined(_fnAfterLoad) && isOfTypeFunction(_fnAfterLoad())) _fnAfterLoad();
      resolve(true);
    });

  const stopBlink = () => {
    if (!isBlinking()) return;
    setDocumentTitle(INITIAL_TITLE_TAB);
    clearInterval(refBlinkInterval);
    refBlinkInterval = undefined;
  };

  const isBlinking = () => isDefined(refBlinkInterval);

  const blink = () => {
    if (isBlinking()) {
      return;
    }

    refBlinkInterval = setInterval(() => {
      document.title = document.title === NEW_TITLE_TAB ? INITIAL_TITLE_TAB : NEW_TITLE_TAB;
    }, 1000);
  };

  useEffect(() => {
    if (isMouseIn) stopBlink();
  }, [isMouseIn]);

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

  const handleEventNewMessage = useCallback(() => {
    if (!isMouseIn) return blink();
    else stopBlink();
  }, [isMouseIn]);

  const onChatboxLoaded = useCallback(
    (chatboxNodeElement) => {
      saveChatboxRef(chatboxNodeElement);
      chatboxNodeElement.addEventListener(CHATBOX_EVENT_NAME.newMessage, handleEventNewMessage);
      chatboxNodeElement.onmousemove = () => setMouseIn(true);
      chatboxNodeElement.onmouseleave = () => setMouseIn(false);
      chatboxNodeElement.onmouseover = () => setMouseIn(true);
      chatboxNodeElement.onmouseenter = chatboxNodeElement.onmouseover;
      setChatboxLoaded(true);
    },
    [handleEventNewMessage],
  );

  const onNewMessage = useCallback(() => {
    isOpen && chatboxRef?.dispatchEvent(eventNewMessage);
  }, [isOpen]);

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
