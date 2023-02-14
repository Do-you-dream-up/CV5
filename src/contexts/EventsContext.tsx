import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

import { CHATBOX_EVENT_NAME } from '../tools/constants';
import VisitManager from '../tools/RG/VisitManager';
import dotget from '../tools/dotget';
import { eventNewMessage } from '../events/chatboxIndex';
import useBlinkTitle from '../tools/hooks/useBlinkTitle';
import { useConfiguration } from './ConfigurationContext';
import useServerStatus from '../tools/hooks/useServerStatus';
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
  const { checked: serverStatusChecked } = useServerStatus();
  let chatboxRef: any;

  const onNewMessage = useCallback(() => {
    isOpen && chatboxRef?.dispatchEvent(eventNewMessage);
  }, [isOpen]);

  const { isBlinking } = useBlinkTitle({
    title: '1 nouveau message',
    trigger: onNewMessage,
  });
  console.log('🚀 ~ file: EventsContext.tsx:49 ~ EventsProvider ~ isBlinking', isBlinking);

  useBlinkTitle({ title: 'coucou', trigger: onNewMessage });

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
  }, [isChatboxLoadedAndReady]);

  const onAppReady = useCallback(() => setIsAppReady(true), []);

  const handleEventNewMessage = useCallback(() => {
    console.log('event');
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
